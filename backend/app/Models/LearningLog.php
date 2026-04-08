<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LearningLog extends Model
{
    protected $fillable = ['user_id', 'course_id', 'duration_minutes', 'logged_at'];

    protected function casts(): array
    {
        return ['logged_at' => 'date'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }
}
