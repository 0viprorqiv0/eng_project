<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlacementResult extends Model
{
    protected $fillable = [
        'name',
        'email',
        'profile_type',
        'current_level',
        'goal',
        'score',
        'total',
        'level_result',
        'answers_summary',
        'ai_analysis',
        'suggested_course',
        'consent',
    ];

    protected $casts = [
        'answers_summary' => 'array',
        'consent'         => 'boolean',
        'score'           => 'integer',
        'total'           => 'integer',
    ];
}
