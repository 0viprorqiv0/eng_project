<?php
// Script to import 'Quá khứ đơn', 'Thì hiện tại hoàn thành', and 'Thì hiện tại hoàn thành tiếp diễn'
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Course;
use App\Models\Lesson;
use App\Models\Assignment;

$course = Course::where('title', 'like', '%Tổng ôn ngữ pháp%')->first();
if (!$course) { die("Course not found!\n"); }

$tenses = [
    [
        'name' => 'Quá khứ đơn',
        'dir' => 'qkd',
        'source_path' => 'c:/eng_project/material/Tổng ôn ngữ pháp/Quá khứ đơn',
        'files' => [
            'video' => '../../video qkd.mp4',
            'doc' => 'Past_Simple_Blueprint.pdf',
            'btvn' => 'BTVN THÌ QUÁ KHỨ ĐƠN.docx',
            'poster' => 'Poster QKD.png',
            'extra' => 'bang-360-dong-tu-bat-quy-tac-tvpl.pdf',
            'quiz' => 'quiz qkd.txt',
        ],
    ],
    [
        'name' => 'Thì hiện tại hoàn thành',
        'dir' => 'htht',
        'source_path' => 'c:/eng_project/material/Tổng ôn ngữ pháp/Thì hiện tại hoàn thành',
        'files' => [
            'video' => 'Video Project 4.mp4',
            'doc' => 'Present_Perfect_Mastery.pptx',
            'btvn' => 'BÀI TẬP VỀ NHÀ_ THÌ HIỆN TẠI HOÀN THÀNH.docx',
            'poster' => 'poster htht.png',
            'extra' => 'bang-360-dong-tu-bat-quy-tac-tvpl.pdf',
            'quiz' => 'quiz htht.txt',
        ],
    ],
    [
        'name' => 'Thì hiện tại hoàn thành tiếp diễn',
        'dir' => 'hthttd',
        'source_path' => 'c:/eng_project/material/Tổng ôn ngữ pháp/Thì hiện tại hoàn thành tiếp diễn',
        'files' => [
            'video' => 'Thì hiện tại hoàn thành tiếp diễn.mp4',
            'doc' => 'Present_Perfect_Continuous_Mastery.pdf',
            'btvn' => 'BTVN Thì hiện tại hoàn thành tiếp diễn.docx',
            'poster' => 'poster hthttd.png',
            'extra' => 'bang-360-dong-tu-bat-quy-tac-tvpl.pdf',
            'quiz' => 'quiz hthttd.txt',
        ],
    ]
];

foreach ($tenses as $tense) {
    echo "Processing " . $tense['name'] . "...\n";
    $maxOrder = $course->lessons()->max('sort_order') ?? 0;
    $destPath = 'lessons/' . $tense['dir'];
    $fullDestPath = storage_path('app/public/' . $destPath);
    
    if (!file_exists($fullDestPath)) {
        mkdir($fullDestPath, 0777, true);
    }
    
    // Copy files
    $sourcePath = $tense['source_path'];
    $copiedFiles = [];
    foreach ($tense['files'] as $key => $filename) {
        if (file_exists("$sourcePath/$filename") && filesize("$sourcePath/$filename") > 0) {
            $ext = pathinfo($filename, PATHINFO_EXTENSION);
            $newFilename = $key . ' ' . $tense['dir'] . '.' . $ext;
            copy("$sourcePath/$filename", "$fullDestPath/$newFilename");
            $copiedFiles[$key] = "$destPath/$newFilename";
            echo " - Copied $filename -> $newFilename\n";
        }
    }
    
    // Parse Quiz
    $questionsData = [];
    $quizFile = "$sourcePath/" . $tense['files']['quiz'];
    if (file_exists($quizFile) && filesize($quizFile) > 0) {
        $quizText = file_get_contents($quizFile);
        $quizText = str_replace("\r\n", "\n", $quizText);
        $quizText = trim($quizText);
        
        // Match both '1. I ___' and 'I ___' format relying on blocks separated by blank lines
        $blocks = preg_split('/\n\s*\n/', $quizText);
        
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
                'id' => $tense['dir'] . '_q' . ($index + 1),
                'type' => 'multiple_choice',
                'question' => $questionText,
                'options' => $options
            ];
        }
        echo " - Parsed " . count($questionsData) . " questions\n";
    } else {
        echo " - No valid quiz questions found.\n";
    }
    
    // Create Lessons
    $prefix = $tense['name'] . ' - ';
    
    $lessonsToCreate = [];
    if (isset($copiedFiles['video'])) {
        $lessonsToCreate[] = [
            'title' => $prefix . 'Video bài giảng',
            'lesson_type' => 'video',
            'duration_minutes' => 30,
            'video_path' => $copiedFiles['video'],
            'sort_order' => $maxOrder + 1
        ];
    }
    
    if (isset($copiedFiles['doc'])) {
        $lessonsToCreate[] = [
            'title' => $prefix . 'Tài liệu lý thuyết',
            'lesson_type' => 'document',
            'duration_minutes' => 15,
            'materials_path' => $copiedFiles['doc'],
            'sort_order' => $maxOrder + 2
        ];
    }
    
    if (!empty($questionsData)) {
        $lessonsToCreate[] = [
            'title' => $prefix . 'Quiz kiểm tra',
            'lesson_type' => 'quiz',
            'duration_minutes' => 10,
            'questions_data' => $questionsData,
            'sort_order' => $maxOrder + 3
        ];
    }
    
    if (isset($copiedFiles['btvn'])) {
        $lessonsToCreate[] = [
            'title' => $prefix . 'Bài tập về nhà',
            'lesson_type' => 'assignment',
            'duration_minutes' => 45,
            'materials_path' => $copiedFiles['btvn'],
            'sort_order' => $maxOrder + 4,
            'assignment_data' => [
                'title' => 'Bài tập về nhà: ' . $tense['name'],
                'max_score' => 100,
                'due_date' => now()->addDays(7)
            ]
        ];
    }
    
    if (isset($copiedFiles['poster'])) {
        $lessonsToCreate[] = [
            'title' => 'Tài liệu bổ trợ - Poster ' . $tense['name'],
            'lesson_type' => 'document',
            'duration_minutes' => 5,
            'materials_path' => $copiedFiles['poster'],
            'sort_order' => $maxOrder + 5
        ];
    }
    
    if (isset($copiedFiles['extra'])) {
        // Since Bảng động từ bất quy tắc is the same file, we only need to add it once if it's the first time,
        // or just suffix it so it doesn't conflict. 
        // We'll add it.
        $lessonsToCreate[] = [
            'title' => 'Tài liệu bổ trợ - Bảng 360 động từ bất quy tắc (' . $tense['name'] . ')',
            'lesson_type' => 'document',
            'duration_minutes' => 5,
            'materials_path' => $copiedFiles['extra'],
            'sort_order' => $maxOrder + 6
        ];
    }
    
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
    echo "Done with " . $tense['name'] . "\n\n";
}
echo "All tenses imported successfully.\n";
