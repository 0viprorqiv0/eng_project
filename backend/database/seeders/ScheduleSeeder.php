<?php

namespace Database\Seeders;

use App\Models\Course;
use App\Models\Schedule;
use App\Models\User;
use Illuminate\Database\Seeder;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = User::where('role', 'teacher')->get();
        if ($teachers->isEmpty()) return;

        $courses = Course::whereIn('slug', ['grammar', 'advanced', 'exam'])->get();

        $schedulesData = [
            // Teacher schedule (from SchedulePage.tsx)
            ['course_slug' => 'grammar',  'title' => 'IELTS Speaking Practice',      'location' => 'Phòng trực tuyến 04', 'time_slot' => '08:00 - 09:30', 'day' => 1, 'color' => 'border-[#13375f]', 'type' => 'live'],
            ['course_slug' => 'advanced', 'title' => 'Academic Writing Workshop',    'location' => 'Phòng 201',           'time_slot' => '10:00 - 11:30', 'day' => 1, 'color' => 'border-[#73000a]', 'type' => 'offline'],
            ['course_slug' => 'exam',     'title' => 'Mock Test Session',            'location' => 'Phòng trực tuyến 01', 'time_slot' => '14:00 - 15:30', 'day' => 2, 'color' => 'border-[#13375f]', 'type' => 'live'],
            ['course_slug' => 'grammar',  'title' => 'Grammar Review – Conditionals','location' => 'Phòng 305',          'time_slot' => '08:00 - 09:30', 'day' => 3, 'color' => 'border-[#13375f]', 'type' => 'offline'],
            ['course_slug' => 'advanced', 'title' => 'Vocabulary Masterclass',       'location' => 'Phòng trực tuyến 02', 'time_slot' => '15:00 - 16:30', 'day' => 4, 'color' => 'border-[#73000a]', 'type' => 'live'],
            ['course_slug' => 'exam',     'title' => 'Luyện đề thực chiến #8',       'location' => 'Online Zoom',         'time_slot' => '19:00 - 20:30', 'day' => 5, 'color' => 'border-[#13375f]', 'type' => 'live'],
        ];

        foreach ($schedulesData as $index => $data) {
            $course = $courses->firstWhere('slug', $data['course_slug']);
            if (!$course) continue;

            $teacher = $teachers[$index % $teachers->count()];

            Schedule::updateOrCreate(
                ['title' => $data['title'], 'course_id' => $course->id],
                [
                    'course_id'   => $course->id,
                    'teacher_id'  => $teacher->id,
                    'title'       => $data['title'],
                    'location'    => $data['location'],
                    'time_slot'   => $data['time_slot'],
                    'day_of_week' => $data['day'],
                    'color'       => $data['color'],
                    'type'        => $data['type'],
                ]
            );
        }
    }
}
