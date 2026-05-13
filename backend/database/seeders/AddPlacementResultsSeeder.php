<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PlacementResult;
use Carbon\Carbon;

class AddPlacementResultsSeeder extends Seeder
{
    public function run(): void
    {
        $hoList = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
        $demList = ['Văn', 'Thị', 'Đức', 'Minh', 'Thanh', 'Quốc', 'Hữu', 'Ngọc', 'Kim', 'Hoàng'];
        $tenList = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Hưng', 'Khánh', 'Lan', 'Mai', 'Nam',
            'Phúc', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Vinh', 'Xuân', 'Yến', 'Linh', 'Tuấn',
            'Thảo', 'Đạt', 'Hùng', 'Trang', 'Long', 'Hoa', 'Kiên', 'Ngân', 'Trung', 'Hiền',
            'Duy', 'Anh', 'Giang', 'Thành', 'Phương', 'Huy', 'Nhung', 'Quỳnh', 'Bảo', 'Khoa',
            'Tiến', 'Nhi', 'Đông', 'Tùng', 'Hằng', 'Thắng', 'Ly', 'Châu', 'Khôi', 'Vy',
            'Hạnh', 'Toàn', 'Trinh', 'Cường', 'Nga', 'Đăng', 'Thùy', 'Minh', 'Lộc', 'Diệu',
            'Phát', 'Như', 'Hoài', 'Thiện', 'Mỹ', 'Trí', 'Ngọc', 'Phong', 'Hương', 'Quang',
            'Tú', 'Oanh', 'Việt', 'Hiếu', 'Thy', 'Khải', 'Thanh', 'Nhật', 'Dung', 'Thịnh'];

        $profiles = ['student_11_12', 'ielts', 'working'];
        $levels = ['beginner', 'elementary', 'intermediate', 'advanced'];
        $categories = ['grammar', 'vocabulary', 'reading'];
        $difficulties = ['easy', 'medium', 'hard'];
        $emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'beelearn.edu.vn'];

        $courseSuggestions = [
            'Beginner'           => ['TỔNG ÔN NGỮ PHÁP', 'IELTS FOUNDATION 5.0+', 'TIẾNG ANH GIAO TIẾP'],
            'Elementary'         => ['CHUYÊN SÂU TỪ VỰNG & ĐỌC HIỂU', 'IELTS FOUNDATION 5.0+', 'TIẾNG ANH GIAO TIẾP'],
            'Intermediate'       => ['LUYỆN ĐỀ CẤP TỐC', 'IELTS TARGET 6.5', 'TIẾNG ANH CÔNG SỞ'],
            'Upper-Intermediate' => ['IELTS TARGET 6.5', 'IELTS BỨT PHÁ 8.0+', 'TIẾNG ANH CÔNG SỞ'],
            'Advanced'           => ['IELTS BỨT PHÁ 8.0+', 'TIẾNG ANH CÔNG SỞ'],
        ];

        for ($i = 0; $i < 80; $i++) {
            $name = $hoList[array_rand($hoList)] . ' ' . $demList[array_rand($demList)] . ' ' . $tenList[$i];
            $emailName = strtolower($this->removeVN($tenList[$i])) . '.' . strtolower($this->removeVN($hoList[array_rand($hoList)])) . rand(10, 99);
            $email = $emailName . '@' . $emailDomains[array_rand($emailDomains)];
            $profileType = $profiles[array_rand($profiles)];
            $currentLevel = $levels[array_rand($levels)];

            // Sinh điểm ngẫu nhiên nhưng hợp lý
            $score = rand(3, 19);
            $total = 20;
            $pct = ($score / $total) * 100;

            if ($pct <= 30) $levelResult = 'Beginner';
            elseif ($pct <= 50) $levelResult = 'Elementary';
            elseif ($pct <= 70) $levelResult = 'Intermediate';
            elseif ($pct <= 85) $levelResult = 'Upper-Intermediate';
            else $levelResult = 'Advanced';

            // Sinh answers_summary giả
            $answers = [];
            $catCounts = ['grammar' => 8, 'vocabulary' => 6, 'reading' => 6];
            $correctByCategory = [];
            foreach ($catCounts as $cat => $count) {
                $correct = 0;
                for ($j = 0; $j < $count; $j++) {
                    $diff = $difficulties[array_rand($difficulties)];
                    $isCorrect = rand(0, 100) < ($pct + rand(-15, 15));
                    if ($isCorrect) $correct++;
                    $answers[] = [
                        'category'   => $cat,
                        'difficulty' => $diff,
                        'isCorrect'  => (bool)$isCorrect,
                    ];
                }
                $correctByCategory[$cat] = $correct;
            }

            // AI analysis
            $suggested = $courseSuggestions[$levelResult][array_rand($courseSuggestions[$levelResult])];

            $strengths = [];
            $weaknesses = [];
            if ($correctByCategory['grammar'] >= 6) $strengths[] = 'Nền tảng ngữ pháp vững chắc';
            else $weaknesses[] = 'Cần củng cố kiến thức ngữ pháp';
            if ($correctByCategory['vocabulary'] >= 4) $strengths[] = 'Vốn từ vựng phong phú';
            else $weaknesses[] = 'Cần mở rộng vốn từ vựng';
            if ($correctByCategory['reading'] >= 4) $strengths[] = 'Khả năng đọc hiểu tốt';
            else $weaknesses[] = 'Kỹ năng đọc hiểu cần luyện thêm';
            if (empty($strengths)) $strengths[] = 'Đã hoàn thành bài test';
            if (empty($weaknesses)) $weaknesses[] = 'Duy trì luyện tập đều đặn';

            $analysisTexts = [
                'Beginner'           => 'Bạn đang ở giai đoạn khởi đầu. Với lộ trình phù hợp từ BeeLearn, bạn sẽ tiến bộ nhanh chóng!',
                'Elementary'         => 'Bạn đã có nền tảng cơ bản tốt. Hãy tập trung vào ngữ pháp và từ vựng để nâng trình độ.',
                'Intermediate'       => 'Trình độ trung bình khá! Hãy tập trung vào đọc hiểu và ngữ pháp nâng cao để đạt kết quả tốt hơn.',
                'Upper-Intermediate' => 'Rất ấn tượng! Bạn có trình độ khá cao. Hãy luyện thêm bài nâng cao để đạt điểm tối đa.',
                'Advanced'           => 'Xuất sắc! Hãy duy trì phong độ và thử thách bản thân với các bài tập khó hơn.',
            ];

            $aiAnalysis = json_encode([
                'analysis'        => $analysisTexts[$levelResult],
                'strengths'       => $strengths,
                'weaknesses'      => $weaknesses,
                'suggestedCourse' => $suggested,
                'advice'          => 'Hãy đăng ký tư vấn miễn phí tại BeeLearn để được xây dựng lộ trình học tập phù hợp nhất!',
            ], JSON_UNESCAPED_UNICODE);

            // Ngày: rải đều từ tháng 4 đến tháng 5/2026
            if ($i < 30) {
                $createdAt = Carbon::create(2026, 4, rand(1, 28), rand(8, 21), rand(0, 59));
            } elseif ($i < 65) {
                $createdAt = Carbon::create(2026, 5, rand(1, 12), rand(8, 21), rand(0, 59));
            } else {
                $createdAt = Carbon::create(2026, 5, 13, rand(8, 20), rand(0, 59));
            }

            PlacementResult::create([
                'name'             => $name,
                'email'            => $email,
                'profile_type'     => $profileType,
                'current_level'    => $currentLevel,
                'goal'             => null,
                'score'            => $score,
                'total'            => $total,
                'level_result'     => $levelResult,
                'answers_summary'  => $answers,
                'ai_analysis'      => $aiAnalysis,
                'suggested_course' => $suggested,
                'consent'          => true,
                'created_at'       => $createdAt,
                'updated_at'       => $createdAt,
            ]);
        }

        $this->command->info('✅ Đã thêm 80 kết quả Placement Test (30 tháng 4 + 35 đầu tháng 5 + 15 hôm nay)');
    }

    private function removeVN(string $str): string
    {
        $map = [
            'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y','đ'=>'d',
            'À'=>'A','Á'=>'A','Ả'=>'A','Ã'=>'A','Ạ'=>'A','Ă'=>'A','Ắ'=>'A','Ằ'=>'A','Ẳ'=>'A','Ẵ'=>'A','Ặ'=>'A','Â'=>'A','Ấ'=>'A','Ầ'=>'A','Ẩ'=>'A','Ẫ'=>'A','Ậ'=>'A',
            'È'=>'E','É'=>'E','Ẻ'=>'E','Ẽ'=>'E','Ẹ'=>'E','Ê'=>'E','Ế'=>'E','Ề'=>'E','Ể'=>'E','Ễ'=>'E','Ệ'=>'E',
            'Ì'=>'I','Í'=>'I','Ỉ'=>'I','Ĩ'=>'I','Ị'=>'I',
            'Ò'=>'O','Ó'=>'O','Ỏ'=>'O','Õ'=>'O','Ọ'=>'O','Ô'=>'O','Ố'=>'O','Ồ'=>'O','Ổ'=>'O','Ỗ'=>'O','Ộ'=>'O','Ơ'=>'O','Ớ'=>'O','Ờ'=>'O','Ở'=>'O','Ỡ'=>'O','Ợ'=>'O',
            'Ù'=>'U','Ú'=>'U','Ủ'=>'U','Ũ'=>'U','Ụ'=>'U','Ư'=>'U','Ứ'=>'U','Ừ'=>'U','Ử'=>'U','Ữ'=>'U','Ự'=>'U',
            'Ỳ'=>'Y','Ý'=>'Y','Ỷ'=>'Y','Ỹ'=>'Y','Ỵ'=>'Y','Đ'=>'D',
        ];
        return strtr($str, $map);
    }
}
