<?php

namespace Database\Seeders;

use App\Models\Assignment;
use App\Models\Course;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Database\Seeder;

class AssignmentSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = User::where('role', 'teacher')->get();
        $students = User::where('role', 'student')->get();
        if ($teachers->isEmpty() || $students->isEmpty()) return;

        $courses = Course::whereIn('slug', ['grammar', 'advanced', 'exam'])->get();

        $assignmentsData = [
            [
                'course_slug' => 'grammar',
                'title'       => 'Writing Task 2: Climate Change',
                'icon'        => 'edit_note',
                'due_date'    => now()->addDays(2),
                'max_score'   => 10,
            ],
            [
                'course_slug' => 'grammar',
                'title'       => 'Listening Practice Test 5',
                'icon'        => 'headphones',
                'due_date'    => now()->addDays(3),
                'max_score'   => 10,
            ],
            [
                'course_slug' => 'advanced',
                'title'       => 'Vocabulary Quiz: Travel & Tourism',
                'icon'        => 'quiz',
                'due_date'    => now()->subDay(),
                'max_score'   => 10,
            ],
            [
                'course_slug' => 'advanced',
                'title'       => 'Speaking Part 1 Recording',
                'icon'        => 'mic',
                'due_date'    => now()->subDays(3),
                'max_score'   => 9,
            ],
            [
                'course_slug' => 'exam',
                'title'       => 'Grammar Exercise: Conditionals',
                'icon'        => 'spellcheck',
                'due_date'    => now()->subDays(5),
                'max_score'   => 10,
            ],
        ];

        foreach ($assignmentsData as $index => $data) {
            $course = $courses->firstWhere('slug', $data['course_slug']);
            if (!$course) continue;

            unset($data['course_slug']);
            
            // Distribute teachers
            $teacher = $teachers[$index % $teachers->count()];

            Assignment::updateOrCreate(
                ['title' => $data['title'], 'course_id' => $course->id],
                array_merge($data, [
                    'course_id'  => $course->id,
                    'teacher_id' => $teacher->id,
                ])
            );
        }

        // Create sample submissions for ALL students
        $assignments = Assignment::all();

        foreach ($students as $index => $student) {
            // Assignment 3: Submitted (not graded)
            if ($a = $assignments->get(2)) {
                Submission::updateOrCreate(
                    ['assignment_id' => $a->id, 'student_id' => $student->id],
                    ['content' => 'My vocabulary answers for student ' . $student->id, 'status' => 'submitted']
                );
            }

            // Assignment 4: Graded 
            if ($a = $assignments->get(3)) {
                Submission::updateOrCreate(
                    ['assignment_id' => $a->id, 'student_id' => $student->id],
                    [
                        'content'   => 'Speaking recording link...',
                        'score'     => mt_rand(60, 90) / 10, // random score 6.0 to 9.0
                        'feedback'  => 'Phát âm khá ổn, cần chú ý intonation.',
                        'status'    => 'graded',
                        'graded_at' => now()->subDays(2),
                    ]
                );
            }

            // Assignment 5: Graded
            if ($a = $assignments->get(4)) {
                Submission::updateOrCreate(
                    ['assignment_id' => $a->id, 'student_id' => $student->id],
                    [
                        'content'   => 'Conditionals completed.',
                        'score'     => mt_rand(7, 10), // random score 7 to 10
                        'feedback'  => 'Tốt!',
                        'status'    => 'graded',
                        'graded_at' => now()->subDays(4),
                    ]
                );
            }
        }
    }
}
