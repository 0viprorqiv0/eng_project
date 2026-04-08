<?php

namespace App\Http\Controllers;

use App\Models\UserSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    /**
     * GET /api/settings — Get user profile + preferences
     */
    public function show(Request $request)
    {
        $user = $request->user();

        // Create default settings if not exists
        $settings = UserSetting::firstOrCreate(
            ['user_id' => $user->id],
            [
                'email_notifications' => true,
                'push_notifications'  => false,
                'marketing_emails'    => false,
                'theme'               => 'light',
                'language'            => 'vi',
            ]
        );

        return response()->json([
            'profile' => [
                'name'       => $user->name,
                'email'      => $user->email,
                'phone'      => $user->phone,
                'bio'        => $user->bio,
                'avatar_url' => $user->avatar_url,
            ],
            'preferences' => [
                'email_notifications' => $settings->email_notifications,
                'push_notifications'  => $settings->push_notifications,
                'marketing_emails'    => $settings->marketing_emails,
                'theme'               => $settings->theme,
                'language'            => $settings->language,
            ]
        ]);
    }

    /**
     * PUT /api/settings — Update profile + preferences
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            // Profile fields
            'name'  => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'bio'   => 'nullable|string',
            
            // Preferences
            'email_notifications' => 'sometimes|boolean',
            'push_notifications'  => 'sometimes|boolean',
            'marketing_emails'    => 'sometimes|boolean',
            'theme'               => 'sometimes|in:light,dark',
            'language'            => 'sometimes|in:vi,en',
        ]);

        // Update User profile
        $user->update([
            'name'  => $validated['name'] ?? $user->name,
            'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $user->phone,
            'bio'   => array_key_exists('bio', $validated) ? $validated['bio'] : $user->bio,
        ]);

        // Update Settings
        $settings = UserSetting::firstOrCreate(['user_id' => $user->id]);
        $settings->update([
            'email_notifications' => $validated['email_notifications'] ?? $settings->email_notifications,
            'push_notifications'  => $validated['push_notifications'] ?? $settings->push_notifications,
            'marketing_emails'    => $validated['marketing_emails'] ?? $settings->marketing_emails,
            'theme'               => $validated['theme'] ?? $settings->theme,
            'language'            => $validated['language'] ?? $settings->language,
        ]);

        return response()->json([
            'message'     => 'Cập nhật cài đặt thành công!',
            'profile'     => $user->only(['name', 'email', 'phone', 'bio', 'avatar_url']),
            'preferences' => $settings->only(['email_notifications', 'push_notifications', 'marketing_emails', 'theme', 'language']),
        ]);
    }

    /**
     * POST /api/settings/avatar — Upload avatar
     */
    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:2048', // max 2MB
        ]);

        $user = $request->user();
        
        $path = $request->file('avatar')->store('avatars', 'public');
        
        // Delete old avatar if exists
        if ($user->avatar_url && str_contains($user->avatar_url, 'storage/avatars')) {
            $oldPath = str_replace(url('storage') . '/', '', $user->avatar_url);
            Storage::disk('public')->delete($oldPath);
        }

        $user->update([
            'avatar_url' => url('storage/' . $path)
        ]);

        return response()->json([
            'message'    => 'Cập nhật ảnh đại diện thành công!',
            'avatar_url' => $user->avatar_url,
        ]);
    }
}
