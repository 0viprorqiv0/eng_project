<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    protected $fillable = [
        'user_id', 'type', 'title', 'message', 'icon', 'link', 'is_read',
    ];

    protected $casts = [
        'is_read' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper: create notification for a user
     */
    public static function notify(int $userId, string $type, string $title, string $message, ?string $link = null, string $icon = 'notifications'): self
    {
        return self::create([
            'user_id' => $userId,
            'type'    => $type,
            'title'   => $title,
            'message' => $message,
            'link'    => $link,
            'icon'    => $icon,
        ]);
    }

    /**
     * Helper: broadcast notification to all users with a specific role
     */
    public static function notifyRole(string $role, string $type, string $title, string $message, ?string $link = null, string $icon = 'notifications'): void
    {
        $users = \App\Models\User::where('role', $role)->pluck('id');
        foreach ($users as $userId) {
            self::notify($userId, $type, $title, $message, $link, $icon);
        }
    }
}
