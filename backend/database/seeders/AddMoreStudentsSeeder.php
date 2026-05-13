<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Course;
use App\Models\Enrollment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class AddMoreStudentsSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('vi_VN');
        $courses = Course::pluck('id')->toArray();

        // 10 leaderboard students
        $leaderboardNames = [
            "Phạm Hoàng Long",
            "Vũ Phương Thảo",
            "Đặng Tiến Dũng",
            "Hoàng Minh Đức",
            "Nguyễn Bảo Ngọc",
            "Trần Thanh Huyền",
            "Lê Quốc Khánh",
            "Bùi Ngọc Hân",
            "Võ Đình Trọng",
            "Mai Thị Hồng Nhung"
        ];

        // Ensure leaderboard students exist
        foreach ($leaderboardNames as $idx => $name) {
            $user = User::firstOrCreate(
                ['email' => "topstudent" . ($idx + 1) . "@beelearn.vn"],
                [
                    'name' => $name,
                    'role' => 'student',
                    'password' => Hash::make('password'),
                    'phone' => '09' . rand(10000000, 99999999),
                    'streak' => rand(20, 100),
                ]
            );
            
            // Randomly enroll in 1-3 courses
            $numCourses = rand(1, 3);
            $randomCourses = (array) array_rand(array_flip($courses), min($numCourses, count($courses)));
            foreach($randomCourses as $cid) {
                Enrollment::firstOrCreate([
                    'user_id' => $user->id,
                    'course_id' => $cid
                ], [
                    'progress' => rand(50, 100),
                    'status' => 'active'
                ]);
            }
        }

        // Add 30 more realistic students
        $realisticNames = [
            "Nguyễn Đình Hải", "Trần Thu Uyên", "Lê Phương Nam", "Phạm Thị Huyền", "Vũ Nhật Đức",
            "Hoàng Mai Lan", "Bùi Trọng Hiếu", "Đặng Thùy Linh", "Đỗ Tuấn Kiệt", "Ngô Bích Ngọc",
            "Dương Hải Trăng", "Đinh Bằng Việt", "Lý Thu Trang", "Vương Hải Đăng", "Khúc Tú Quỳnh",
            "Trần Ngọc An", "Lưu Thanh Tâm", "Nguyễn Tuấn Lâm", "Lê Hương Ly", "Phạm Nhật Minh",
            "Đào Hồng Hà", "Vũ Minh Phương", "Trịnh Quang Vinh", "Văn Thịnh Hải", "Hà Quỳnh Thy",
            "Đặng Nhật Quang", "Đỗ Hương Giang", "Hoàng Kim Oanh", "Tô Thái Hưng", "Bùi Minh Khang"
        ];

        foreach ($realisticNames as $name) {
            $slug = \Illuminate\Support\Str::slug($name, '');
            $user = User::firstOrCreate(
                ['email' => $slug . rand(10,99) . "@beelearn.vn"],
                [
                    'name' => $name,
                    'role' => 'student',
                    'password' => Hash::make('password'),
                    'phone' => '09' . rand(10000000, 99999999),
                    'streak' => rand(1, 30),
                ]
            );

            // Randomly enroll in 1-3 courses
            $numCourses = rand(1, 4);
            $randomCourses = (array) array_rand(array_flip($courses), min($numCourses, count($courses)));
            foreach($randomCourses as $cid) {
                Enrollment::firstOrCreate([
                    'user_id' => $user->id,
                    'course_id' => $cid
                ], [
                    'progress' => rand(10, 80),
                    'status' => 'active'
                ]);
            }
        }
    }
}
