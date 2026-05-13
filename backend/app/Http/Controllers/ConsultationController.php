<?php

namespace App\Http\Controllers;

use App\Models\ConsultationRequest;
use App\Models\Notification;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    /**
     * POST /api/consultations (Public)
     */
    public function store(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'nullable|email|max:255',
        ]);

        $consultation = ConsultationRequest::create($request->only('name', 'phone', 'email'));

        // Notify Admins
        Notification::notifyRole(
            'admin', 
            'campaign', // You can use 'system' or anything
            'Yêu cầu tư vấn mới', 
            "{$consultation->name} - {$consultation->phone} vừa đăng ký nhận tư vấn.",
            '/dashboard/consultations',
            'support_agent'
        );

        return response()->json([
            'message' => 'Yêu cầu tư vấn đã được gửi thành công. Chúng tôi sẽ sớm liên hệ lại với bạn!',
            'data'    => $consultation
        ], 201);
    }

    /**
     * GET /api/consultations (Admin only)
     */
    public function index(Request $request)
    {
        $query = ConsultationRequest::query()->with('resolver:id,name');

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        $consultations = $query->orderBy('status', 'asc') // 'new' > 'contacting' > 'resolved' based on enum, or strictly by created_at.
                               ->orderByDesc('created_at')
                               ->get();

        $stats = [
            'total' => ConsultationRequest::count(),
            'new'   => ConsultationRequest::where('status', 'new')->count(),
            'resolved' => ConsultationRequest::where('status', 'resolved')->count(),
        ];

        return response()->json([
            'data'  => $consultations,
            'stats' => $stats
        ]);
    }

    /**
     * PUT /api/consultations/{id} (Admin only)
     */
    public function update(Request $request, $id)
    {
        $consultation = ConsultationRequest::findOrFail($id);

        $request->validate([
            'status' => 'required|in:new,contacting,resolved',
            'notes'  => 'nullable|string',
        ]);

        $updateData = $request->only('status', 'notes');

        if ($request->input('status') === 'resolved' && $consultation->status !== 'resolved') {
            $updateData['resolved_at'] = now();
            $updateData['resolved_by'] = $request->user()->id;
        }

        $consultation->update($updateData);

        return response()->json([
            'message' => 'Cập nhật trạng thái thành công',
            'data'    => $consultation
        ]);
    }
}
