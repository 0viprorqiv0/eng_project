<?php

// Script to import the 'Thì hiện tại đơn' materials into the database
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Assignment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

$course = Course::where('title', 'like', '%Tổng ôn ngữ pháp%')->first();
if (!$course) {
    die("Course not found!\n");
}

// 1. Delete old lessons for this course
$course->lessons()->delete();

// 2. Define the source files
$sourcePath = 'c:/eng_project/material/Tổng ôn ngữ pháp/Thì hiện tại đơn';
$destPath = 'lessons/htd';

if (!file_exists(storage_path('app/public/' . $destPath))) {
    mkdir(storage_path('app/public/' . $destPath), 0777, true);
}

// Ensure files are copied over
@copy("$sourcePath/học liệu hiện tại đơn khoá 1.mp4", storage_path("app/public/$destPath/hoc_lieu.mp4"));
@copy("$sourcePath/Present_Simple_Mastery.pdf", storage_path("app/public/$destPath/Present_Simple_Mastery.pdf"));
@copy("$sourcePath/BTVN THÌ HIỆN TẠI ĐƠN khoá 1.docx", storage_path("app/public/$destPath/BTVN.docx"));
@copy("$sourcePath/htd.docx", storage_path("app/public/$destPath/htd.docx"));
@copy("$sourcePath/simple.png", storage_path("app/public/$destPath/simple.png"));

// 3. Parse Quiz
$quizText = file_get_contents("$sourcePath/quiz htd.txt");
$blocks = explode("\n\n", trim($quizText));
$questionsData = [];

foreach ($blocks as $index => $block) {
    $lines = array_values(array_filter(array_map('trim', explode("\n", $block))));
    if (count($lines) < 3) continue;

    $questionText = $lines[0];
    
    // Parse options
    $optionsLine = '';
    $answerLine = '';
    foreach ($lines as $line) {
        if (str_starts_with($line, 'A.')) {
            $optionsLine = $line;
        } elseif (str_starts_with($line, '=> Answer:')) {
            $answerLine = $line;
        }
    }

    if (!$optionsLine || !$answerLine) continue;

    // Split options
    preg_match_all('/([A-D])\.\s*(.*?)(?=(?:[A-D]\.)|$)/s', $optionsLine, $matches);
    
    $correctAnswerChar = trim(str_replace('=> Answer:', '', $answerLine));
    
    $options = [];
    for ($i = 0; $i < count($matches[1]); $i++) {
        $char = trim($matches[1][$i]);
        $text = trim($matches[2][$i]);
        $options[] = [
            'text' => $text,
            'isCorrect' => ($char === $correctAnswerChar)
        ];
    }

    $questionsData[] = [
        'id' => 'q' . uniqid(),
        'type' => 'multiple_choice',
        'question' => $questionText,
        'options' => $options
    ];
}

// 4. Create Lessons with " - " separator for grouping
$lessonsToCreate = [
    [
        'title' => 'Thì hiện tại đơn - Video bài giảng',
        'lesson_type' => 'video',
        'duration_minutes' => 30, // Default duration
        'video_path' => "$destPath/hoc_lieu.mp4",
        'sort_order' => 1
    ],
    [
        'title' => 'Thì hiện tại đơn - Tài liệu lý thuyết',
        'lesson_type' => 'document',
        'duration_minutes' => 15,
        'materials_path' => "$destPath/Present_Simple_Mastery.pdf",
        'sort_order' => 2
    ],
    [
        'title' => 'Thì hiện tại đơn - Quiz kiểm tra',
        'lesson_type' => 'quiz',
        'duration_minutes' => 20,
        'questions_data' => $questionsData,
        'sort_order' => 3
    ],
    [
        'title' => 'Thì hiện tại đơn - Bài tập về nhà',
        'lesson_type' => 'assignment',
        'duration_minutes' => 45,
        'materials_path' => "$destPath/BTVN.docx",
        'sort_order' => 4,
        'assignment_data' => [
            'title' => 'Bài tập về nhà: Thì hiện tại đơn',
            'max_score' => 100,
            'due_date' => now()->addDays(7)
        ]
    ],
    // Tài liệu bổ trợ (Supplemental Materials)
    [
        'title' => 'Tài liệu bổ trợ - Bài tập bổ sung (Word)',
        'lesson_type' => 'document',
        'duration_minutes' => 10,
        'materials_path' => "$destPath/htd.docx",
        'sort_order' => 5
    ],
    [
        'title' => 'Tài liệu bổ trợ - Sơ đồ tư duy học tập (Ảnh)',
        'lesson_type' => 'document',
        'duration_minutes' => 5,
        'materials_path' => "$destPath/simple.png",
        'sort_order' => 6
    ]
];

foreach ($lessonsToCreate as $l) {
    $lesson = $course->lessons()->create([
        'title' => $l['title'],
        'lesson_type' => $l['lesson_type'],
        'duration_minutes' => $l['duration_minutes'],
        'sort_order' => $l['sort_order'],
        'video_path' => $l['video_path'] ?? null,
        'materials_path' => $l['materials_path'] ?? null,
        'questions_data' => $l['questions_data'] ?? null,
    ]);

    if ($l['lesson_type'] === 'assignment' && isset($l['assignment_data'])) {
        Assignment::create([
            'course_id' => $course->id,
            'lesson_id' => $lesson->id,
            'teacher_id' => $course->teacher_id,
            'title' => $l['assignment_data']['title'],
            'max_score' => $l['assignment_data']['max_score'],
            'due_date' => $l['assignment_data']['due_date']
        ]);
    }
}

echo "Xong! Đã tạo " . count($lessonsToCreate) . " bài học và upload tệp thành công.\n";
