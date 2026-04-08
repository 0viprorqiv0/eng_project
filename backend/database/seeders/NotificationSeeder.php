<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        // Get all users
        $students = User::where('role', 'student')->pluck('id');
        $teachers = User::where('role', 'teacher')->pluck('id');

        $now = now();

        // Sample notifications for all students
        foreach ($students as $studentId) {
            Notification::create([
                'user_id'    => $studentId,
                'type'       => 'system',
                'title'      => 'Chào mừng đến BeeLearn! 🎉',
                'message'    => 'Tài khoản của bạn đã được kích hoạt. Hãy bắt đầu khám phá các khóa học ngay nhé!',
                'icon'       => 'celebration',
                'link'       => '/dashboard/courses',
                'is_read'    => true,
                'created_at' => $now->copy()->subDays(7),
            ]);

            Notification::create([
                'user_id'    => $studentId,
                'type'       => 'schedule_reminder',
                'title'      => 'Nhắc nhở lịch học',
                'message'    => 'Bạn có lớp "IELTS Speaking Practice" bắt đầu lúc 08:00 ngày mai. Đừng quên chuẩn bị bài nhé!',
                'icon'       => 'event',
                'link'       => '/dashboard/schedule',
                'is_read'    => false,
                'created_at' => $now->copy()->subHours(3),
            ]);

            Notification::create([
                'user_id'    => $studentId,
                'type'       => 'assignment_graded',
                'title'      => 'Bài tập đã được chấm ✅',
                'message'    => 'Giáo viên đã chấm điểm bài "Writing Task 2: Climate Change". Xem kết quả ngay!',
                'icon'       => 'grading',
                'link'       => '/dashboard/assignments',
                'is_read'    => false,
                'created_at' => $now->copy()->subHours(1),
            ]);

            Notification::create([
                'user_id'    => $studentId,
                'type'       => 'new_lesson',
                'title'      => 'Bài giảng mới 📚',
                'message'    => 'Bài giảng "Chiến thuật đọc hiểu Reading Section 3" vừa được cập nhật trong khóa IELTS của bạn.',
                'icon'       => 'auto_stories',
                'link'       => '/dashboard/courses',
                'is_read'    => false,
                'created_at' => $now->copy()->subMinutes(30),
            ]);
        }

        // Sample notifications for teachers
        foreach ($teachers as $teacherId) {
            Notification::create([
                'user_id'    => $teacherId,
                'type'       => 'system',
                'title'      => 'Hệ thống bảo trì ⚙️',
                'message'    => 'Hệ thống sẽ bảo trì từ 23:00 - 01:00 tối nay. Vui lòng lưu bài tập trước thời gian này.',
                'icon'       => 'engineering',
                'is_read'    => true,
                'created_at' => $now->copy()->subDays(2),
            ]);

            Notification::create([
                'user_id'    => $teacherId,
                'type'       => 'assignment_submitted',
                'title'      => '8 bài tập mới cần chấm 📝',
                'message'    => 'Có 8 học viên vừa nộp bài Writing Task 2. Hãy kiểm tra và phản hồi sớm nhé!',
                'icon'       => 'assignment_turned_in',
                'link'       => '/dashboard/assignments',
                'is_read'    => false,
                'created_at' => $now->copy()->subHours(2),
            ]);

            Notification::create([
                'user_id'    => $teacherId,
                'type'       => 'schedule_reminder',
                'title'      => 'Lớp sắp bắt đầu ⏰',
                'message'    => 'Lớp "Business English Seminar" của bạn bắt đầu lúc 14:00 hôm nay. 45 học viên đã đăng ký.',
                'icon'       => 'videocam',
                'link'       => '/dashboard/schedule',
                'is_read'    => false,
                'created_at' => $now->copy()->subMinutes(45),
            ]);
        }
    }
}
