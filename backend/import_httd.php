<?php
// Script to import 'Thì hiện tại tiếp diễn' materials into existing course
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Assignment;

$course = Course::where('title', 'like', '%Tổng ôn ngữ pháp%')->first();
if (!$course) { die("Course not found!\n"); }

// Get max sort_order from existing lessons
$maxOrder = $course->lessons()->max('sort_order') ?? 0;

// 1. Copy files
$sourcePath = 'c:/eng_project/material/Tổng ôn ngữ pháp/Thì hiện tại tiếp diễn';
$destPath = 'lessons/httd';

if (!file_exists(storage_path('app/public/' . $destPath))) {
    mkdir(storage_path('app/public/' . $destPath), 0777, true);
}

@copy("$sourcePath/Thì hiện tại tiếp diễn.mp4", storage_path("app/public/$destPath/video_httd.mp4"));
@copy("$sourcePath/Present_Continuous_Engineering.pptx", storage_path("app/public/$destPath/Present_Continuous.pptx"));
@copy("$sourcePath/BTVN_httd.docx", storage_path("app/public/$destPath/BTVN_httd.docx"));
@copy("$sourcePath/poster.png", storage_path("app/public/$destPath/poster.png"));

echo "Files copied successfully.\n";

// 2. Parse Quiz
$quizText = file_get_contents("$sourcePath/quiz httd.txt");
$quizText = str_replace("\r\n", "\n", $quizText);
$quizText = trim($quizText);

$blocks = preg_split('/\n\s*\n/', $quizText);
$questionsData = [];

foreach ($blocks as $index => $block) {
    $block = trim($block);
    if (empty($block)) continue;
    
    $lines = array_values(array_filter(array_map('trim', explode("\n", $block)), fn($l) => $l !== ''));
    if (count($lines) < 3) continue;

    // Line 0 = question (may start with "1. ", "2. " etc)
    $questionText = preg_replace('/^\d+\.\s*/', '', $lines[0]);
    
    $optionsLine = '';
    $answerLine = '';
    foreach ($lines as $line) {
        if (preg_match('/^A\./', $line)) {
            $optionsLine = $line;
        } elseif (preg_match('/^=>\s*Answer:\s*(.+)$/i', $line, $am)) {
            $answerLine = trim($am[1]);
        }
    }

    if (!$optionsLine || !$answerLine) continue;

    preg_match_all('/([A-D])\.\s*(.*?)(?=\s+[A-D]\.|$)/s', $optionsLine, $matches);
    
    $options = [];
    for ($i = 0; $i < count($matches[1]); $i++) {
        $char = trim($matches[1][$i]);
        $text = trim($matches[2][$i]);
        $options[] = [
            'text' => $text,
            'isCorrect' => ($char === $answerLine)
        ];
    }

    if (empty($options)) continue;
    
    $questionsData[] = [
        'id' => 'httd_q' . ($index + 1),
        'type' => 'multiple_choice',
        'question' => $questionText,
        'options' => $options
    ];
}

echo "Parsed " . count($questionsData) . " questions.\n";
foreach ($questionsData as $i => $q) {
    $correct = '';
    foreach ($q['options'] as $o) { if ($o['isCorrect']) $correct = $o['text']; }
    echo ($i+1) . ". " . $q['question'] . " [" . count($q['options']) . " opts, answer: $correct]\n";
}

// 3. Create Lessons
$lessonsToCreate = [
    [
        'title' => 'Thì hiện tại tiếp diễn - Video bài giảng',
        'lesson_type' => 'video',
        'duration_minutes' => 30,
        'video_path' => "$destPath/video_httd.mp4",
        'sort_order' => $maxOrder + 1
    ],
    [
        'title' => 'Thì hiện tại tiếp diễn - Tài liệu lý thuyết',
        'lesson_type' => 'document',
        'duration_minutes' => 15,
        'materials_path' => "$destPath/Present_Continuous.pptx",
        'sort_order' => $maxOrder + 2
    ],
    [
        'title' => 'Thì hiện tại tiếp diễn - Quiz kiểm tra',
        'lesson_type' => 'quiz',
        'duration_minutes' => 10,
        'questions_data' => $questionsData,
        'sort_order' => $maxOrder + 3
    ],
    [
        'title' => 'Thì hiện tại tiếp diễn - Bài tập về nhà',
        'lesson_type' => 'assignment',
        'duration_minutes' => 45,
        'materials_path' => "$destPath/BTVN_httd.docx",
        'sort_order' => $maxOrder + 4,
        'assignment_data' => [
            'title' => 'Bài tập về nhà: Thì hiện tại tiếp diễn',
            'max_score' => 100,
            'due_date' => now()->addDays(7)
        ]
    ],
    [
        'title' => 'Tài liệu bổ trợ - Poster thì HTTD',
        'lesson_type' => 'document',
        'duration_minutes' => 5,
        'materials_path' => "$destPath/poster.png",
        'sort_order' => $maxOrder + 5
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

echo "\nXong! Đã tạo " . count($lessonsToCreate) . " bài học cho Thì Hiện Tại Tiếp Diễn.\n";
