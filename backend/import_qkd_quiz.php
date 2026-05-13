<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Lesson;

$course = Course::where('title', 'like', '%Tổng ôn ngữ pháp%')->first();
if (!$course) { die("Course not found!\n"); }

$sourcePath = 'c:/eng_project/material/Tổng ôn ngữ pháp/Quá khứ đơn';
$quizFile = "$sourcePath/quiz qkd.txt";

if (!file_exists($quizFile) || filesize($quizFile) == 0) {
    die("Quiz file is missing or empty.");
}

$quizText = file_get_contents($quizFile);
$quizText = str_replace("\r\n", "\n", $quizText);
$quizText = trim($quizText);

$blocks = preg_split('/\n\s*\n/', $quizText);
$questionsData = [];

foreach ($blocks as $index => $block) {
    $block = trim($block);
    if (empty($block)) continue;
    
    $lines = array_values(array_filter(array_map('trim', explode("\n", $block)), fn($l) => $l !== ''));
    if (count($lines) < 3) continue;

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
        'id' => 'qkd_q' . ($index + 1),
        'type' => 'multiple_choice',
        'question' => $questionText,
        'options' => $options
    ];
}

echo "Parsed " . count($questionsData) . " questions for Quá khứ đơn.\n";

if (!empty($questionsData)) {
    // Check if the quiz already exists to avoid duplicates
    $existingQuiz = $course->lessons()->where('title', 'Quá khứ đơn - Quiz kiểm tra')->first();
    
    if ($existingQuiz) {
        $existingQuiz->update(['questions_data' => $questionsData]);
        echo "Updated existing Quiz!\n";
    } else {
        // Just find the order of the document lesson to put it right after
        $docLesson = $course->lessons()->where('title', 'Quá khứ đơn - Tài liệu lý thuyết')->first();
        $sortOrder = $docLesson ? $docLesson->sort_order + 1 : ($course->lessons()->max('sort_order') + 1);
        
        // Shift others up if needed
        if ($docLesson) {
            $course->lessons()->where('sort_order', '>=', $sortOrder)->increment('sort_order');
        }

        $course->lessons()->create([
            'title' => 'Quá khứ đơn - Quiz kiểm tra',
            'lesson_type' => 'quiz',
            'duration_minutes' => 10,
            'sort_order' => $sortOrder,
            'questions_data' => $questionsData,
        ]);
        echo "Created new Quiz!\n";
    }
}
