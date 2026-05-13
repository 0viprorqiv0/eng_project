<?php

namespace App\Http\Controllers;

use App\Models\JobApplication;
use App\Models\Notification;
use Illuminate\Http\Request;

class JobApplicationController extends Controller
{
    /**
     * POST /api/job-applications (Public)
     * Submit a new job application from the Careers page.
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name'      => 'required|string|max:255',
            'email'          => 'required|email|max:255',
            'phone'          => 'required|string|max:20',
            'date_of_birth'  => 'nullable|date',
            'position'       => 'required|string|max:255',
            'experience'     => 'nullable|string|max:255',
            'achievements'   => 'nullable|string|max:2000',
            'cv_link'        => 'nullable|url|max:500',
            'cover_letter'   => 'nullable|string|max:3000',
        ]);

        $application = JobApplication::create($request->only([
            'full_name', 'email', 'phone', 'date_of_birth',
            'position', 'experience', 'achievements', 'cv_link', 'cover_letter',
        ]));

        // Notify Admins about new application
        Notification::notifyRole(
            'admin',
            'recruitment',
            'Hồ sơ ứng tuyển mới',
            "{$application->full_name} vừa nộp hồ sơ ứng tuyển vị trí {$application->position}.",
            '/dashboard/admin/recruitment',
            'person_add'
        );

        return response()->json([
            'message' => 'Hồ sơ ứng tuyển đã được gửi thành công! Chúng tôi sẽ xem xét và phản hồi sớm nhất.',
            'data'    => $application
        ], 201);
    }

    /**
     * GET /api/admin/job-applications (Admin only)
     * List all job applications with filtering.
     */
    public function index(Request $request)
    {
        $query = JobApplication::query()->with('reviewer:id,name');

        // Filter by status
        if ($request->has('status') && $request->query('status') !== 'all') {
            $query->where('status', $request->query('status'));
        }

        // Filter by position
        if ($request->has('position') && $request->query('position') !== 'all') {
            $query->where('position', 'like', '%' . $request->query('position') . '%');
        }

        // Search by name or email
        if ($request->has('search') && $request->query('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('position', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderByDesc('created_at')->get();

        $stats = [
            'total'      => JobApplication::count(),
            'new'        => JobApplication::where('status', 'new')->count(),
            'reviewing'  => JobApplication::where('status', 'reviewing')->count(),
            'interview'  => JobApplication::where('status', 'interview')->count(),
            'accepted'   => JobApplication::where('status', 'accepted')->count(),
            'rejected'   => JobApplication::where('status', 'rejected')->count(),
        ];

        return response()->json([
            'data'  => $applications,
            'stats' => $stats,
        ]);
    }

    /**
     * PUT /api/admin/job-applications/{id} (Admin only)
     * Update a job application's status and notes.
     */
    public function update(Request $request, $id)
    {
        $application = JobApplication::findOrFail($id);

        $request->validate([
            'status'      => 'required|in:new,reviewing,interview,accepted,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        $updateData = $request->only('status', 'admin_notes');

        // Track who reviewed it
        if ($request->input('status') !== 'new' && !$application->reviewed_by) {
            $updateData['reviewed_by'] = $request->user()->id;
            $updateData['reviewed_at'] = now();
        }

        $application->update($updateData);

        return response()->json([
            'message' => 'Cập nhật trạng thái hồ sơ thành công',
            'data'    => $application->load('reviewer:id,name'),
        ]);
    }

    /**
     * DELETE /api/admin/job-applications/{id} (Admin only)
     */
    public function destroy($id)
    {
        $application = JobApplication::findOrFail($id);
        $application->delete();

        return response()->json([
            'message' => 'Đã xóa hồ sơ ứng tuyển',
        ]);
    }
}
