<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id', 'email_notifications', 'push_notifications', 
        'marketing_emails', 'theme', 'language'
    ];

    protected function casts(): array
    {
        return [
            'email_notifications' => 'boolean',
            'push_notifications'  => 'boolean',
            'marketing_emails'    => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
