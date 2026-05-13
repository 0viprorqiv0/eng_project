<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsultationRequest extends Model
{
    protected $fillable = [
        'name',
        'phone',
        'email',
        'status',
        'resolved_at',
        'resolved_by',
        'notes',
    ];

    public function resolver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'resolved_by');
    }
}
