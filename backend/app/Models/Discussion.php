<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Discussion extends Model
{
    protected $fillable = ['user_id', 'course_id', 'lesson_id', 'parent_id', 'content'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    public function lesson(): BelongsTo
    {
        return $this->belongsTo(Lesson::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Discussion::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Discussion::class, 'parent_id');
    }
}
