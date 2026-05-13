<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\GeminiService;

class ChatController extends Controller
{
    /**
     * BeeBot AI Chat — Nhận tin nhắn + history, trả về AI response.
     *
     * POST /api/chat
     * Body: { message: string, history?: [{role: 'user'|'bot', text: string}] }
     * Response: { reply: string, status: 'ok'|'error' }
     */
    public function sendMessage(Request $request, GeminiService $gemini)
    {
        $validated = $request->validate([
            'message'        => 'required|string|max:2000',
            'history'        => 'nullable|array|max:20',
            'history.*.role' => 'required_with:history|in:user,bot',
            'history.*.text' => 'required_with:history|string|max:3000',
        ]);

        try {
            $reply = $gemini->chat(
                $validated['message'],
                $validated['history'] ?? []
            );

            return response()->json([
                'reply'  => $reply,
                'status' => 'ok',
            ]);
        } catch (\Exception $e) {
            Log::error('BeeBot chat error: ' . $e->getMessage(), [
                'code'    => $e->getCode(),
                'message' => $request->input('message'),
            ]);

            return response()->json([
                'reply'  => 'Xin lỗi, BeeBot đang bảo trì. Vui lòng liên hệ hotline 1900 6789 để được hỗ trợ trực tiếp. 🐝',
                'status' => 'error',
            ], 503);
        }
    }
}
