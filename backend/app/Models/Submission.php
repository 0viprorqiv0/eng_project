<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = [
        'assignment_id', 'student_id', 'content', 'file_url',
        'score', 'feedback', 'status', 'submitted_at', 'graded_at',
    ];

    protected function casts(): array
    {
        return [
            'submitted_at' => 'datetime',
            'graded_at'    => 'datetime',
            'score'        => 'decimal:1',
        ];
    }

    public function assignment(): BelongsTo
    {
        return $this->belongsTo(Assignment::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
