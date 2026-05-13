<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private array $apiKeys;
    private string $model;
    private string $systemPrompt;
    private int $maxHistory;
    private int $maxOutputTokens;
    private float $temperature;

    public function __construct()
    {
        $this->apiKeys        = config('gemini.api_keys', []);
        $this->model          = config('gemini.model', 'gemini-2.5-flash');
        $this->systemPrompt   = config('gemini.system_prompt', '');
        $this->maxHistory     = config('gemini.max_history', 15);
        $this->maxOutputTokens = config('gemini.max_output_tokens', 512);
        $this->temperature    = config('gemini.temperature', 0.7);
    }

    /**
     * Gửi tin nhắn tới Gemini API với multi-turn context.
     * Tự động xoay key khi gặp lỗi 429 (quota) hoặc 403 (invalid).
     *
     * @param string $message Tin nhắn mới từ user
     * @param array  $history Lịch sử hội thoại [{role: 'user'|'bot', text: '...'}]
     * @return string AI response text
     * @throws \Exception Khi tất cả keys đều thất bại
     */
    public function chat(string $message, array $history = []): string
    {
        if (empty($this->apiKeys)) {
            throw new \Exception('No Gemini API keys configured');
        }

        // Trim history — giữ N lượt gần nhất để tiết kiệm token
        $history = array_slice($history, -$this->maxHistory);

        // Build Gemini contents array — map 'bot' → 'model' cho Gemini API
        $contents = [];
        foreach ($history as $entry) {
            $role = ($entry['role'] ?? 'user') === 'bot' ? 'model' : 'user';
            $text = $entry['text'] ?? '';
            if ($text !== '') {
                $contents[] = [
                    'role'  => $role,
                    'parts' => [['text' => $text]],
                ];
            }
        }

        // Thêm tin nhắn mới
        $contents[] = [
            'role'  => 'user',
            'parts' => [['text' => $message]],
        ];

        // Thử từng key, xoay khi gặp 429/403
        $lastError = null;
        foreach ($this->apiKeys as $index => $key) {
            try {
                return $this->callGemini($key, $contents);
            } catch (\Exception $e) {
                $code = $e->getCode();
                Log::warning("BeeBot: Gemini key #$index failed (HTTP $code): {$e->getMessage()}");
                $lastError = $e;

                // Chỉ xoay key khi quota hoặc key invalid
                if (in_array($code, [429, 403])) {
                    continue;
                }

                // Lỗi khác (500, network timeout...) → throw ngay
                throw $e;
            }
        }

        // Tất cả keys đều thất bại
        throw $lastError ?? new \Exception('All Gemini API keys exhausted');
    }

    /**
     * Gọi Gemini REST API với một key cụ thể.
     */
    private function callGemini(string $apiKey, array $contents): string
    {
        $url = sprintf(
            'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s',
            $this->model,
            $apiKey
        );

        $response = Http::timeout(30)->post($url, [
            'system_instruction' => [
                'parts' => [['text' => $this->systemPrompt]],
            ],
            'contents' => $contents,
            'generationConfig' => [
                'maxOutputTokens' => $this->maxOutputTokens,
                'temperature'     => $this->temperature,
            ],
        ]);

        if ($response->failed()) {
            throw new \Exception(
                $response->json('error.message', 'Gemini API error'),
                $response->status()
            );
        }

        $text = $response->json('candidates.0.content.parts.0.text', '');

        if (empty($text)) {
            // Có thể bị block bởi safety filter
            $blockReason = $response->json('candidates.0.finishReason', 'UNKNOWN');
            Log::info("BeeBot: Gemini returned empty text. finishReason=$blockReason");
            return 'Xin lỗi, tôi không thể trả lời câu hỏi này. Bạn có thể thử hỏi theo cách khác nhé! 🐝';
        }

        return $text;
    }
}
