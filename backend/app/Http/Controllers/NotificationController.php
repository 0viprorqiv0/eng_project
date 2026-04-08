<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * GET /api/notifications — Current user's notifications (paginated)
     */
    public function index(Request $request)
    {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->limit(30)
            ->get();

        $unreadCount = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json([
            'notifications' => $notifications,
            'unread_count'  => $unreadCount,
        ]);
    }

    /**
     * GET /api/notifications/unread-count — Quick poll for badge count
     */
    public function unreadCount(Request $request)
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * POST /api/notifications/{id}/read — Mark single notification as read
     */
    public function markRead(Request $request, $id)
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Đã đọc']);
    }

    /**
     * POST /api/notifications/read-all — Mark all as read
     */
    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'Đã đánh dấu tất cả đã đọc']);
    }

    /**
     * POST /api/notifications/send — Admin/Teacher: send notification
     */
    public function send(Request $request)
    {
        $request->validate([
            'target'  => 'required|in:all,students,teachers,user',
            'user_id' => 'nullable|integer|exists:users,id',
            'title'   => 'required|string|max:255',
            'message' => 'required|string',
            'type'    => 'nullable|string',
        ]);

        $type = $request->input('type', 'system');
        $title = $request->input('title');
        $message = $request->input('message');
        $target = $request->input('target');

        if ($target === 'user' && $request->input('user_id')) {
            Notification::notify($request->input('user_id'), $type, $title, $message, null, 'campaign');
        } elseif ($target === 'students') {
            Notification::notifyRole('student', $type, $title, $message, null, 'campaign');
        } elseif ($target === 'teachers') {
            Notification::notifyRole('teacher', $type, $title, $message, null, 'campaign');
        } else {
            // All users
            Notification::notifyRole('student', $type, $title, $message, null, 'campaign');
            Notification::notifyRole('teacher', $type, $title, $message, null, 'campaign');
        }

        return response()->json(['message' => 'Thông báo đã được gửi thành công!']);
    }
}
