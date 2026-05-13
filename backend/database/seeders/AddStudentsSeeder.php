<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class AddStudentsSeeder extends Seeder
{
    public function run(): void
    {
        $courseIds = [1, 2, 3, 4, 5, 6, 7, 8];
        $password = Hash::make('student123');

        // Họ và tên Việt Nam
        $hoList = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
        $tenDemList = ['Văn', 'Thị', 'Đức', 'Minh', 'Thanh', 'Quốc', 'Hữu', 'Ngọc', 'Kim', 'Hoàng'];
        $tenList = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Hưng', 'Khánh', 'Lan', 'Mai', 'Nam', 'Phúc', 'Quân', 'Sơn', 'Tâm', 'Uyên', 'Vinh', 'Xuân', 'Yến', 'Linh', 'Tuấn', 'Thảo', 'Đạt', 'Hùng', 'Trang', 'Long', 'Hoa', 'Kiên', 'Ngân', 'Trung', 'Hiền', 'Duy', 'Anh', 'Giang', 'Thành', 'Phương', 'Huy', 'Nhung', 'Quỳnh', 'Bảo', 'Khoa', 'Tiến', 'Nhi', 'Đông', 'Tùng', 'Hằng', 'Thắng', 'Ly', 'Châu', 'Khôi', 'Vy'];

        $newUserIds = [];

        // ── Tạo 50 học sinh mới ──
        for ($i = 0; $i < 50; $i++) {
            $ho = $hoList[array_rand($hoList)];
            $dem = $tenDemList[array_rand($tenDemList)];
            $ten = $tenList[$i]; // Lấy theo thứ tự để không trùng
            $name = "$ho $dem $ten";
            $email = strtolower($this->removeVietnamese($ten)) . '.' . strtolower($this->removeVietnamese($ho)) . ($i + 1) . '@beelearn.edu.vn';

            // Ngày tạo: 20 người đầu → tháng 4, 30 người sau → tháng 5
            if ($i < 20) {
                $createdAt = Carbon::create(2026, 4, rand(1, 28), rand(8, 20), rand(0, 59));
            } else {
                $createdAt = Carbon::create(2026, 5, rand(1, 13), rand(8, 20), rand(0, 59));
            }

            $user = User::create([
                'name'       => $name,
                'email'      => $email,
                'password'   => $password,
                'role'       => 'student',
                'phone'      => '09' . rand(10000000, 99999999),
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $newUserIds[] = ['id' => $user->id, 'month' => $i < 20 ? 4 : 5];
        }

        // ── Tháng 4: 20 học sinh → 30 đăng ký (mỗi người 1-2 khóa) ──
        $aprilStudents = array_filter($newUserIds, fn($u) => $u['month'] === 4);
        $enrollCount = 0;
        foreach ($aprilStudents as $u) {
            // Mỗi người đăng ký 1-2 khóa
            $numCourses = $enrollCount < 20 ? 2 : 1; // 10 người đăng 2 khóa, 10 người đăng 1 khóa = 30
            $selectedCourses = array_rand(array_flip($courseIds), min($numCourses, count($courseIds)));
            if (!is_array($selectedCourses)) $selectedCourses = [$selectedCourses];

            foreach ($selectedCourses as $courseId) {
                $enrolledAt = Carbon::create(2026, 4, rand(1, 28), rand(8, 20), rand(0, 59));
                DB::table('enrollments')->insert([
                    'user_id'          => $u['id'],
                    'course_id'        => $courseId,
                    'progress'         => rand(0, 80),
                    'completed_lessons' => rand(0, 10),
                    'status'           => 'active',
                    'enrolled_at'      => $enrolledAt,
                    'created_at'       => $enrolledAt,
                    'updated_at'       => $enrolledAt,
                ]);
                $enrollCount++;
                if ($enrollCount >= 30) break;
            }
            if ($enrollCount >= 30) break;
        }

        // ── Tháng 5: 30 học sinh → 50 đăng ký (mỗi người 1-2 khóa) ──
        $mayStudents = array_filter($newUserIds, fn($u) => $u['month'] === 5);
        $enrollCount = 0;
        foreach ($mayStudents as $u) {
            // 20 người đăng 2 khóa, 10 người đăng 1 khóa = 50
            $numCourses = $enrollCount < 40 ? 2 : 1;
            $selectedCourses = array_rand(array_flip($courseIds), min($numCourses, count($courseIds)));
            if (!is_array($selectedCourses)) $selectedCourses = [$selectedCourses];

            foreach ($selectedCourses as $courseId) {
                $enrolledAt = Carbon::create(2026, 5, rand(1, 13), rand(8, 20), rand(0, 59));
                DB::table('enrollments')->insert([
                    'user_id'          => $u['id'],
                    'course_id'        => $courseId,
                    'progress'         => rand(0, 50),
                    'completed_lessons' => rand(0, 5),
                    'status'           => 'active',
                    'enrolled_at'      => $enrolledAt,
                    'created_at'       => $enrolledAt,
                    'updated_at'       => $enrolledAt,
                ]);
                $enrollCount++;
                if ($enrollCount >= 50) break;
            }
            if ($enrollCount >= 50) break;
        }

        $this->command->info('✅ Đã thêm 50 học sinh mới + 80 lượt đăng ký (30 tháng 4 + 50 tháng 5)');
    }

    private function removeVietnamese(string $str): string
    {
        $map = [
            'à'=>'a','á'=>'a','ả'=>'a','ã'=>'a','ạ'=>'a','ă'=>'a','ắ'=>'a','ằ'=>'a','ẳ'=>'a','ẵ'=>'a','ặ'=>'a','â'=>'a','ấ'=>'a','ầ'=>'a','ẩ'=>'a','ẫ'=>'a','ậ'=>'a',
            'è'=>'e','é'=>'e','ẻ'=>'e','ẽ'=>'e','ẹ'=>'e','ê'=>'e','ế'=>'e','ề'=>'e','ể'=>'e','ễ'=>'e','ệ'=>'e',
            'ì'=>'i','í'=>'i','ỉ'=>'i','ĩ'=>'i','ị'=>'i',
            'ò'=>'o','ó'=>'o','ỏ'=>'o','õ'=>'o','ọ'=>'o','ô'=>'o','ố'=>'o','ồ'=>'o','ổ'=>'o','ỗ'=>'o','ộ'=>'o','ơ'=>'o','ớ'=>'o','ờ'=>'o','ở'=>'o','ỡ'=>'o','ợ'=>'o',
            'ù'=>'u','ú'=>'u','ủ'=>'u','ũ'=>'u','ụ'=>'u','ư'=>'u','ứ'=>'u','ừ'=>'u','ử'=>'u','ữ'=>'u','ự'=>'u',
            'ỳ'=>'y','ý'=>'y','ỷ'=>'y','ỹ'=>'y','ỵ'=>'y',
            'đ'=>'d',
            'À'=>'A','Á'=>'A','Ả'=>'A','Ã'=>'A','Ạ'=>'A','Ă'=>'A','Ắ'=>'A','Ằ'=>'A','Ẳ'=>'A','Ẵ'=>'A','Ặ'=>'A','Â'=>'A','Ấ'=>'A','Ầ'=>'A','Ẩ'=>'A','Ẫ'=>'A','Ậ'=>'A',
            'È'=>'E','É'=>'E','Ẻ'=>'E','Ẽ'=>'E','Ẹ'=>'E','Ê'=>'E','Ế'=>'E','Ề'=>'E','Ể'=>'E','Ễ'=>'E','Ệ'=>'E',
            'Ì'=>'I','Í'=>'I','Ỉ'=>'I','Ĩ'=>'I','Ị'=>'I',
            'Ò'=>'O','Ó'=>'O','Ỏ'=>'O','Õ'=>'O','Ọ'=>'O','Ô'=>'O','Ố'=>'O','Ồ'=>'O','Ổ'=>'O','Ỗ'=>'O','Ộ'=>'O','Ơ'=>'O','Ớ'=>'O','Ờ'=>'O','Ở'=>'O','Ỡ'=>'O','Ợ'=>'O',
            'Ù'=>'U','Ú'=>'U','Ủ'=>'U','Ũ'=>'U','Ụ'=>'U','Ư'=>'U','Ứ'=>'U','Ừ'=>'U','Ử'=>'U','Ữ'=>'U','Ự'=>'U',
            'Ỳ'=>'Y','Ý'=>'Y','Ỷ'=>'Y','Ỹ'=>'Y','Ỵ'=>'Y',
            'Đ'=>'D',
        ];
        return strtr($str, $map);
    }
}
