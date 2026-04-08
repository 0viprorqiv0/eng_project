<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Course extends Model
{
    protected $fillable = [
        'slug', 'title', 'subtitle', 'description', 'outcome',
        'price', 'price_amount', 'category', 'level', 'duration',
        'image', 'color', 'status', 'teacher_id', 'rating',
        'features', 'testimonials',
    ];

    protected $casts = [
        'features' => 'array',
        'testimonials' => 'array',
    ];

    /* ---- Relationships ---- */

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function structures(): HasMany
    {
        return $this->hasMany(CourseStructure::class);
    }

    public function lessons(): HasMany
    {
        return $this->hasMany(Lesson::class);
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(Enrollment::class);
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'enrollments')
            ->withPivot('progress', 'completed_lessons', 'status', 'enrolled_at')
            ->withTimestamps();
    }

    /* ---- Accessors ---- */

    public function getStudentCountAttribute(): int
    {
        return $this->enrollments()->count();
    }
}
