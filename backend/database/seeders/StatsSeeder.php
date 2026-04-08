<?php

namespace Database\Seeders;

use App\Models\DailyGoal;
use App\Models\LearningLog;
use App\Models\User;
use Illuminate\Database\Seeder;

class StatsSeeder extends Seeder
{
    public function run(): void
    {
        $student = User::where('email', 'student@beelearn.vn')->first();
        if (!$student) return;

        // Daily goals for today
        $goals = [
            ['title' => 'Hoàn thành bài nghe Unit 5',     'is_completed' => true,  'progress' => '10/10'],
            ['title' => 'Ôn tập 20 từ vựng mới',          'is_completed' => false, 'progress' => '7/20'],
            ['title' => 'Làm bài tập ngữ pháp chương 3',  'is_completed' => false, 'progress' => '0/15'],
            ['title' => 'Xem video bài giảng Writing',     'is_completed' => true,  'progress' => '1/1'],
        ];

        foreach ($goals as $goal) {
            DailyGoal::updateOrCreate(
                ['user_id' => $student->id, 'title' => $goal['title'], 'date' => now()->format('Y-m-d')],
                $goal
            );
        }

        // Learning logs for last 7 days
        $minutesPerDay = [40, 60, 30, 90, 50, 75, 10];
        $courses = \App\Models\Course::limit(3)->pluck('id')->toArray();

        for ($i = 6; $i >= 0; $i--) {
            LearningLog::updateOrCreate(
                ['user_id' => $student->id, 'logged_at' => now()->subDays($i)->format('Y-m-d')],
                [
                    'course_id'        => $courses[array_rand($courses)] ?? null,
                    'duration_minutes' => $minutesPerDay[6 - $i],
                ]
            );
        }
    }
}
