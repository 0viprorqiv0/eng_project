<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserActivation;
use App\Models\AdminLog;
use App\Models\Enrollment;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserController extends Controller
{
    /**
     * Helper: Log admin actions
     */
    private function logAction($action, $targetId = null, $details = [])
    {
        AdminLog::create([
            'user_id'    => auth()->id(),
            'action'     => $action,
            'target_id'  => $targetId,
            'details'    => $details,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Prevent acting on super admins or self
     */
    private function authorizeAction(User $targetUser)
    {
        if ($targetUser->id === auth()->id()) {
            abort(403, 'Bạn không thể thay đổi chính mình.');
        }

        // Future-proof for super_admin hierarchy
        if ($targetUser->role === 'super_admin' && auth()->user()->role !== 'super_admin') {
            abort(403, 'Bạn không có quyền thay đổi Super Admin.');
        }
    }

    /**
     * GET /admin/users
     */
    public function index(Request $request)
    {
        $query = User::query()->withTrashed(); // Show soft-deleted too

        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where(function ($q) use ($s) {
                $q->where('name', 'like', "%$s%")
                  ->orWhere('email', 'like', "%$s%");
            });
        }

        if ($request->filled('course_id') && $request->course_id !== 'all') {
            $courseId = $request->course_id;
            $query->whereHas('enrollments', function($q) use ($courseId) {
                $q->where('course_id', $courseId);
            });
        }

        $users = $query->with(['enrollments.course:id,title', 'taughtCourses:id,title'])
            ->orderByRaw("
                CASE 
                    WHEN role = 'admin' THEN 1
                    WHEN role = 'teacher' THEN 2
                    WHEN role = 'student' AND email LIKE '%@beelearn.vn' THEN 3
                    ELSE 4 
                END ASC
            ")
            ->orderBy('id', 'desc')
            ->paginate($request->get('per_page', 10));
        
        return response()->json($users);
    }

    /**
     * POST /admin/users
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'role'  => 'required|in:student,teacher,admin',
        ]);

        DB::beginTransaction();
        try {
            // Generate a secure random password initially so the DB constraint doesn't fail
            $user = User::create([
                'name'     => $validated['name'],
                'email'    => $validated['email'],
                'role'     => $validated['role'],
                'password' => Hash::make(Str::random(32)), 
            ]);

            // Create activation token
            $token = Str::random(60);
            UserActivation::create([
                'user_id'    => $user->id,
                'token_hash' => hash('sha256', $token),
                'expires_at' => now()->addDay(),
            ]);

            // TODO: In production, trigger an Email sending job here
            // Mail::to($user->email)->send(new AccountActivationMail($token));

            $this->logAction('create_user', $user->id, ['role' => $user->role]);

            DB::commit();

            return response()->json([
                'message' => 'Tạo người dùng thành công.',
                'user'    => $user,
                'activation_link' => "/activate-account?token={$token}" // For testing
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * PUT /admin/users/{id}/role
     */
    public function updateRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorizeAction($user);

        $validated = $request->validate([
            'role' => 'required|in:student,teacher,admin'
        ]);

        $oldRole = $user->role;
        $user->update(['role' => $validated['role']]);

        $this->logAction('update_role', $user->id, ['old_role' => $oldRole, 'new_role' => $user->role]);

        return response()->json(['message' => 'Cập nhật phân quyền thành công.']);
    }

    /**
     * PUT /admin/users/{id}/ban
     */
    public function toggleBan(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $this->authorizeAction($user);

        $validated = $request->validate([
            'duration_days' => 'nullable|integer|min:1'
        ]);

        // Unban: If the user is currently banned AND no new duration/empty duration is sent
        if ($user->banned_until && empty($request->duration_days)) {
            $user->update(['banned_until' => null]);
            $this->logAction('unban_user', $user->id);
            return response()->json(['message' => 'Đã bỏ khóa tài khoản.']);
        }

        // Ban
        $until = $request->duration_days ? now()->addDays($request->duration_days) : now()->addYears(100);
        $user->update(['banned_until' => $until]);
        $user->tokens()->delete(); // Immediately revoke their current sessions

        $this->logAction('ban_user', $user->id, ['duration_days' => $request->duration_days ?? 'permanent']);
        return response()->json(['message' => 'Đã khóa tài khoản thành công.']);
    }

    /**
     * DELETE /admin/users/{id}
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $this->authorizeAction($user);

        $user->delete(); // Soft delete
        $this->logAction('delete_user', $user->id);

        return response()->json(['message' => 'Đã vô hiệu hóa tài khoản (Soft Delete).']);
    }

    /**
     * POST /admin/users/{id}/restore
     */
    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();
        
        $this->logAction('restore_user', $user->id);

        return response()->json(['message' => 'Đã khôi phục tài khoản thành công.']);
    }

    /**
     * POST /admin/users/bulk-ban
     */
    public function bulkBan(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
            'duration_days' => 'nullable|integer|min:1'
        ]);

        DB::beginTransaction();
        try {
            $until = $request->duration_days ? now()->addDays($request->duration_days) : now()->addYears(100);
            
            foreach ($validated['user_ids'] as $id) {
                $user = User::find($id);
                if ($user && $user->id !== auth()->id() && $user->role !== 'super_admin') {
                    $user->update(['banned_until' => $until]);
                    $user->tokens()->delete();
                    $this->logAction('ban_user', $user->id, ['bulk' => true, 'duration_days' => $request->duration_days ?? 'permanent']);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Khóa hàng loạt thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * POST /admin/users/bulk-delete
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'integer|exists:users,id',
        ]);

        DB::beginTransaction();
        try {
            foreach ($validated['user_ids'] as $id) {
                $user = User::find($id);
                if ($user && $user->id !== auth()->id() && $user->role !== 'super_admin') {
                    $user->delete();
                    $this->logAction('delete_user', $user->id, ['bulk' => true]);
                }
            }

            DB::commit();
            return response()->json(['message' => 'Vô hiệu hóa hàng loạt thành công.']);
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * GET /admin/users/{id}/enrollments
     */
    public function getEnrollments($id)
    {
        $user = User::findOrFail($id);
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with('course:id,title,image,category,price')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($enrollments);
    }

    /**
     * POST /admin/users/{id}/enroll
     */
    public function enrollUser(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $validated = $request->validate([
            'course_id' => 'required|exists:courses,id'
        ]);

        $exists = Enrollment::where('user_id', $user->id)
            ->where('course_id', $validated['course_id'])
            ->exists();

        if ($exists) {
            return response()->json(['message' => 'Người dùng đã tham gia khóa học này rồi.'], 409);
        }

        $enrollment = Enrollment::create([
            'user_id'     => $user->id,
            'course_id'   => $validated['course_id'],
            'enrolled_at' => now(),
            'status'      => 'active',
            'progress'    => 0,
            'completed_lessons' => 0
        ]);

        $this->logAction('enroll_user', $user->id, ['course_id' => $validated['course_id']]);

        return response()->json([
            'message'    => 'Ghi danh thành công.',
            'enrollment' => $enrollment->load('course:id,title,image')
        ], 201);
    }

    /**
     * DELETE /admin/users/{id}/enroll/{courseId}
     */
    public function unenrollUser($id, $courseId)
    {
        $user = User::findOrFail($id);
        
        $deleted = Enrollment::where('user_id', $id)
            ->where('course_id', $courseId)
            ->delete();

        if ($deleted) {
            $this->logAction('unenroll_user', $id, ['course_id' => $courseId]);
            return response()->json(['message' => 'Đã hủy ghi danh thành công.']);
        }

        return response()->json(['message' => 'Không tìm thấy thông tin ghi danh.'], 404);
    }
}
