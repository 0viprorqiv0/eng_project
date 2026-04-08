<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizAttempt extends Model
{
    protected $fillable = [
        'lesson_id',
        'user_id',
        'score',
        'total_questions',
        'answers_data',
        'essay_answers',
        'time_spent'
    ];

    protected $casts = [
        'answers_data' => 'array',
        'essay_answers' => 'array',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
