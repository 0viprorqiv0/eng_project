<?php

namespace App\Http\Controllers;

use App\Models\PlacementResult;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PlacementController extends Controller
{
    /**
     * POST /api/placement-evaluate
     * Public endpoint — đánh giá năng lực + gọi Gemini AI
     */
    public function evaluate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'                    => 'required|string|max:255',
            'email'                   => 'required|email|max:255',
            'consent'                 => 'required|boolean',
            'profile.type'            => 'required|in:student_11_12,ielts,working',
            'profile.currentLevel'    => 'required|in:beginner,elementary,intermediate,advanced',
            'profile.goal'            => 'nullable|string|max:500',
            'score'                   => 'required|integer|min:0|max:20',
            'total'                   => 'required|integer|min:1|max:20',
            'answers'                 => 'required|array|min:1|max:20',
            'answers.*.category'      => 'required|in:grammar,vocabulary,reading',
            'answers.*.isCorrect'     => 'required|boolean',
            'answers.*.difficulty'    => 'required|in:easy,medium,hard',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $request->all();
        $profile = $data['profile'];
        $answers = $data['answers'];
        $score = $data['score'];
        $total = $data['total'];

        // Tính điểm theo category
        $categories = ['grammar' => [0, 0], 'vocabulary' => [0, 0], 'reading' => [0, 0]];
        foreach ($answers as $a) {
            $cat = $a['category'];
            $categories[$cat][1]++; // total
            if ($a['isCorrect']) {
                $categories[$cat][0]++; // correct
            }
        }

        // Phân loại level
        $percentage = ($score / $total) * 100;
        $levelResult = $this->classifyLevel($percentage);

        // Gọi Gemini AI — ưu tiên danh sách key riêng GEMINI_PLACEMENT_KEYS (hỗ trợ xoay vòng)
        $aiAnalysis = null;
        $suggestedCourse = null;
        try {
            $placementKeysStr = env('GEMINI_PLACEMENT_KEYS', '');
            $placementKeys = array_filter(array_map('trim', explode(',', $placementKeysStr)));

            if (!empty($placementKeys)) {
                $lastError = null;
                foreach ($placementKeys as $index => $key) {
                    try {
                        $aiAnalysis = $this->callGeminiDirect($key, $this->buildPrompt($profile, $categories, $score, $total, $percentage));
                        break; // Thành công thì thoát vòng lặp
                    } catch (\Exception $e) {
                        $lastError = $e;
                        $code = $e->getCode();
                        Log::warning("Placement AI: Key riêng #$index thất bại (HTTP $code). Đang thử key tiếp theo...");
                        
                        // Nếu không phải lỗi quota (429) hoặc invalid (403) thì có thể là lỗi mạng/hệ thống -> throw luôn
                        if (!in_array($code, [429, 403])) throw $e;
                    }
                }
                
                if (!$aiAnalysis && $lastError) {
                    throw $lastError;
                }
            } else {
                // Fallback: dùng pool key chung của BeeBot nếu không có key riêng
                $gemini = new GeminiService();
                $aiAnalysis = $gemini->chat($this->buildPrompt($profile, $categories, $score, $total, $percentage));
            }

            $parsed = $this->parseAiResponse($aiAnalysis);
            if ($parsed) {
                $aiAnalysis = json_encode($parsed, JSON_UNESCAPED_UNICODE);
                $suggestedCourse = $parsed['suggestedCourse'] ?? null;
            }
        } catch (\Exception $e) {
            Log::error('Placement AI Final Failure: ' . $e->getMessage());
        }
        // Nếu AI thất bại → dùng fallback trước khi lưu DB
        $fallbackUsed = false;
        if (!$aiAnalysis) {
            $fallback = $this->getFallbackAnalysis($levelResult, $categories);
            $aiAnalysis = json_encode($fallback, JSON_UNESCAPED_UNICODE);
            $suggestedCourse = $fallback['suggestedCourse'] ?? null;
            $fallbackUsed = true;
        }

        // Lưu hoặc cập nhật (email dedup trong 24h)
        $result = PlacementResult::where('email', $data['email'])
            ->where('created_at', '>=', now()->subDay())
            ->first();

        $resultData = [
            'name'             => $data['name'],
            'email'            => $data['email'],
            'profile_type'     => $profile['type'],
            'current_level'    => $profile['currentLevel'],
            'goal'             => $profile['goal'] ?? null,
            'score'            => $score,
            'total'            => $total,
            'level_result'     => $levelResult,
            'answers_summary'  => $answers,
            'ai_analysis'      => $aiAnalysis,
            'suggested_course' => $suggestedCourse,
            'consent'          => $data['consent'],
        ];

        if ($result) {
            $result->update($resultData);
        } else {
            $result = PlacementResult::create($resultData);
        }

        return response()->json([
            'status'      => 'ok',
            'levelResult' => $levelResult,
            'score'       => $score,
            'total'       => $total,
            'percentage'  => round($percentage),
            'aiAnalysis'  => json_decode($aiAnalysis, true),
            'categories'  => [
                'grammar'    => "{$categories['grammar'][0]}/{$categories['grammar'][1]}",
                'vocabulary' => "{$categories['vocabulary'][0]}/{$categories['vocabulary'][1]}",
                'reading'    => "{$categories['reading'][0]}/{$categories['reading'][1]}",
            ],
        ]);
    }

    /**
     * GET /api/admin/placement-results
     * Admin — danh sách kết quả
     */
    public function index(Request $request)
    {
        $query = PlacementResult::query()->orderBy('created_at', 'desc');

        if ($request->has('profile_type')) {
            $query->where('profile_type', $request->profile_type);
        }
        if ($request->has('level_result')) {
            $query->where('level_result', $request->level_result);
        }
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        $results = $query->paginate(20);

        // Mask email trong list
        $results->getCollection()->transform(function ($item) {
            $item->email_masked = $this->maskEmail($item->email);
            return $item;
        });

        return response()->json($results);
    }

    /**
     * GET /api/admin/placement-results/{id}
     * Admin — chi tiết 1 record (email không mask)
     */
    public function show($id)
    {
        $result = PlacementResult::findOrFail($id);
        return response()->json($result);
    }

    // ═════════════════ HELPERS ═════════════════

    /**
     * Gọi Gemini trực tiếp với 1 key riêng (không qua GeminiService pool).
     */
    private function callGeminiDirect(string $apiKey, string $prompt): string
    {
        $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={$apiKey}";
        $response = \Illuminate\Support\Facades\Http::timeout(30)->post($url, [
            'contents' => [
                ['role' => 'user', 'parts' => [['text' => $prompt]]]
            ],
            'generationConfig' => [
                'maxOutputTokens' => 800,
                'temperature'     => 0.4,
            ],
        ]);

        if ($response->failed()) {
            throw new \Exception($response->json('error.message', 'Gemini API error'), $response->status());
        }

        return $response->json('candidates.0.content.parts.0.text', '');
    }

    private function classifyLevel(float $percentage): string
    {
        if ($percentage <= 30) return 'Beginner';
        if ($percentage <= 50) return 'Elementary';
        if ($percentage <= 70) return 'Intermediate';
        if ($percentage <= 85) return 'Upper-Intermediate';
        return 'Advanced';
    }

    private function buildPrompt(array $profile, array $categories, int $score, int $total, float $pct): string
    {
        $profileLabels = [
            'student_11_12' => 'Học sinh Lớp 11-12, chuẩn bị thi THPT',
            'ielts'         => 'Luyện thi IELTS',
            'working'       => 'Người đi làm, cần tiếng Anh cho công việc',
        ];
        $profileText = $profileLabels[$profile['type']] ?? $profile['type'];
        $goal = $profile['goal'] ?? 'Không cung cấp';

        $g = "{$categories['grammar'][0]}/{$categories['grammar'][1]}";
        $v = "{$categories['vocabulary'][0]}/{$categories['vocabulary'][1]}";
        $r = "{$categories['reading'][0]}/{$categories['reading'][1]}";

        return <<<PROMPT
Bạn là BeeBot — trợ lý AI đánh giá năng lực tiếng Anh của BeeLearn Academy.

== THÔNG TIN HỌC VIÊN ==
- Đối tượng: {$profileText}
- Tự đánh giá: {$profile['currentLevel']}
- Mục tiêu: {$goal}

== KẾT QUẢ BÀI TEST (20 CÂU) ==
- Grammar: {$g}
- Vocabulary: {$v}
- Reading: {$r}
- Tổng: {$score}/{$total} ({$pct}%)

== YÊU CẦU ==
Trả lời bằng JSON duy nhất, KHÔNG kèm text khác:
{
  "analysis": "Nhận xét tổng quan 2-3 câu, cá nhân hóa theo đối tượng",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "weaknesses": ["Điểm yếu 1", "Điểm yếu 2"],
  "suggestedCourse": "Tên 1 khóa học phù hợp nhất",
  "advice": "Lời khuyên 1-2 câu để cải thiện"
}
PROMPT;
    }

    private function parseAiResponse(string $text): ?array
    {
        // Tìm JSON block trong response
        $text = trim($text);

        // Xóa markdown code fence nếu có
        if (preg_match('/```(?:json)?\s*([\s\S]*?)```/', $text, $m)) {
            $text = trim($m[1]);
        }

        $decoded = json_decode($text, true);
        if (is_array($decoded) && isset($decoded['analysis'])) {
            return $decoded;
        }

        return null;
    }

    private function getFallbackAnalysis(string $level, array $categories): array
    {
        $messages = [
            'Beginner'           => 'Bạn đang ở giai đoạn bắt đầu. Hãy tập trung vào ngữ pháp cơ bản và từ vựng hàng ngày.',
            'Elementary'         => 'Bạn đã có nền tảng cơ bản. Hãy luyện thêm ngữ pháp và mở rộng vốn từ.',
            'Intermediate'       => 'Trình độ trung bình khá! Hãy tập trung vào đọc hiểu và ngữ pháp nâng cao.',
            'Upper-Intermediate' => 'Rất tốt! Bạn có thể tập trung vào luyện đề và kỹ năng đọc hiểu nâng cao.',
            'Advanced'           => 'Xuất sắc! Hãy duy trì bằng cách luyện đề thường xuyên và nâng cao kỹ năng tổng hợp.',
        ];

        $courses = [
            'Beginner'           => 'IELTS FOUNDATION 5.0+',
            'Elementary'         => 'IELTS FOUNDATION 5.0+',
            'Intermediate'       => 'IELTS TARGET 6.5',
            'Upper-Intermediate' => 'IELTS TARGET 6.5',
            'Advanced'           => 'IELTS BỨT PHÁ 8.0+',
        ];

        return [
            'analysis'        => $messages[$level] ?? 'Cảm ơn bạn đã làm bài test!',
            'strengths'       => ['Hoàn thành bài test đầy đủ'],
            'weaknesses'      => ['Cần đánh giá thêm'],
            'suggestedCourse' => $courses[$level] ?? 'IELTS FOUNDATION 5.0+',
            'advice'          => 'Hãy liên hệ BeeLearn để được tư vấn lộ trình học phù hợp nhất!',
        ];
    }

    private function maskEmail(string $email): string
    {
        $parts = explode('@', $email);
        if (count($parts) !== 2) return '***';
        $name = $parts[0];
        $domain = $parts[1];
        $masked = substr($name, 0, 1) . str_repeat('*', max(strlen($name) - 1, 2));
        return $masked . '@' . $domain;
    }
}
