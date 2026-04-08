<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Lesson extends Model
{
    protected $fillable = [
        'course_id', 'title', 'lesson_type', 'content', 'description',
        'questions_data',
        'video_url', 'video_path', 'materials_path', 'subtitle_path',
        'video_type', 'duration_minutes', 'sort_order',
        'is_free_preview', 'unlock_condition', 'unlock_days',
    ];

    protected $appends = ['video_full_url', 'materials_full_url', 'subtitle_full_url'];

    protected $casts = [
        'is_free_preview' => 'boolean',
        'duration_minutes' => 'integer',
        'unlock_days' => 'integer',
        'questions_data' => 'array',
    ];

    public function course(): BelongsTo
    {
        return $this->belongsTo(Course::class);
    }

    /**
     * A lesson may have one associated assignment.
     */
    public function assignment(): HasOne
    {
        return $this->hasOne(Assignment::class);
    }

    /**
     * Get the full URL for the video (either uploaded or external URL).
     */
    public function getVideoFullUrlAttribute(): ?string
    {
        if ($this->video_path) {
            return url('storage/' . $this->video_path);
        }
        return $this->video_url;
    }

    /**
     * Get the full URL for the materials PDF.
     */
    public function getMaterialsFullUrlAttribute(): ?string
    {
        if ($this->materials_path) {
            return url('storage/' . $this->materials_path);
        }
        return null;
    }

    /**
     * Get the full URL for the subtitle file.
     */
    public function getSubtitleFullUrlAttribute(): ?string
    {
        if ($this->subtitle_path) {
            return url('storage/' . $this->subtitle_path);
        }
        return null;
    }
}
