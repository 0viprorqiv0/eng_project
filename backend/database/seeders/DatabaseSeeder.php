<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::updateOrCreate(
            ['email' => 'admin@beelearn.vn'],
            [
                'name'     => 'Admin BeeLearn',
                'role'     => 'admin',
                'password' => Hash::make('password'),
                'phone'    => '0901000001',
            ]
        );

        // Teacher 1
        User::updateOrCreate(
            ['email' => 'teacher@beelearn.vn'],
            [
                'name'     => 'Ms. Linh',
                'role'     => 'teacher',
                'password' => Hash::make('password'),
                'phone'    => '0901000002',
                'bio'      => 'Giảng viên IELTS 8.5, 7 năm kinh nghiệm giảng dạy.',
                'avatar_url' => '/Linh.png',
                'qualifications' => [
                    ['title' => 'Tiến sĩ Giáo dục học', 'subtitle' => 'Đại học Cambridge, Anh'],
                    ['title' => 'IELTS 9.0 Overall', 'subtitle' => 'Chứng chỉ C2 Proficiency (CPE) - Grade A'],
                ],
            ]
        );

        // Teacher 2
        User::updateOrCreate(
            ['email' => 'teacher2@beelearn.vn'],
            [
                'name'     => 'Mr. Tuan',
                'role'     => 'teacher',
                'password' => Hash::make('password'),
                'phone'    => '0901000004',
                'bio'      => 'Chuyên gia luyện thi IELTS Writing & Speaking.',
                'avatar_url' => '/Tuấn.png',
                'qualifications' => [
                    ['title' => 'Thạc sĩ Ngôn ngữ Anh', 'subtitle' => 'Đại học Melbourne, Úc'],
                    ['title' => 'IELTS 8.5 Writing & Speaking', 'subtitle' => 'Chuyên gia khảo thí quốc tế'],
                ],
            ]
        );

        // Teacher 3
        User::updateOrCreate(
            ['email' => 'teacher3@beelearn.vn'],
            [
                'name'     => 'Ms. Ngoc',
                'role'     => 'teacher',
                'password' => Hash::make('password'),
                'phone'    => '0901000005',
                'bio'      => 'Giảng viên tiếng Anh giao tiếp và chứng chỉ TOEIC.',
                'avatar_url' => '/Ngọc.png',
                'qualifications' => [
                    ['title' => 'Tiến sĩ Ngôn ngữ học ứng dụng', 'subtitle' => 'Đại học Quốc gia Singapore (NUS)'],
                    ['title' => 'Chứng chỉ C2 Proficiency', 'subtitle' => '10 năm đào tạo tiếng Anh doanh nghiệp'],
                ],
            ]
        );

        // Teacher 4
        User::updateOrCreate(
            ['email' => 'teacher4@beelearn.vn'],
            [
                'name'     => 'Mr. Hoang',
                'role'     => 'teacher',
                'password' => Hash::make('password'),
                'phone'    => '0901000006',
                'bio'      => 'Giảng viên chuyên sâu ngữ pháp và luyện thi đại học.',
                'avatar_url' => '/Hoang.png',
                'qualifications' => [
                    ['title' => 'Thạc sĩ Sư phạm Tiếng Anh', 'subtitle' => 'Đại học Oxford, Anh'],
                    ['title' => 'IELTS 8.0 & C2 Proficiency', 'subtitle' => 'Tác giả sách luyện thi THPT Quốc gia'],
                ],
            ]
        );

        // Students (10 accounts)
        $studentNames = [
            'Nguyễn Văn Minh', 'Trần Thị Hoa', 'Lê Văn Nam', 'Phạm Minh Đức', 
            'Hoàng Thu Trang', 'Đặng Quốc Bảo', 'Vũ Hoài Anh', 'Bùi Xuân Hùng',
            'Ngô Thanh Huyền', 'Lý Gia Hân'
        ];

        foreach ($studentNames as $i => $name) {
            $num = $i === 0 ? '' : ($i + 1);
            User::updateOrCreate(
                ['email' => "student{$num}@beelearn.vn"],
                [
                    'name'     => $name,
                    'role'     => 'student',
                    'password' => Hash::make('password'),
                    'phone'    => '090100010' . $i,
                    'streak'   => rand(1, 30),
                ]
            );
        }

        // Seed courses
        $this->call(CourseSeeder::class);

        // Seed assignments
        $this->call(AssignmentSeeder::class);

        // Seed schedules
        $this->call(ScheduleSeeder::class);

        // Seed stats (daily goals + learning logs)
        $this->call(StatsSeeder::class);
    }
}
