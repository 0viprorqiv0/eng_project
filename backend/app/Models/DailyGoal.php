<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyGoal extends Model
{
    protected $fillable = ['user_id', 'title', 'is_completed', 'progress', 'date'];

    protected function casts(): array
    {
        return ['date' => 'date', 'is_completed' => 'boolean'];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
