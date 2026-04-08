<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;

class AssignmentController extends Controller
{
    /**
     * GET /api/assignments — Role-adaptive listing
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isStudent()) {
            return $this->studentAssignments($user);
        }

        return $this->teacherAssignments($user);
    }

    /**
     * Student: assignments from enrolled courses + my submission status
     */
    private function studentAssignments($user)
    {
        $enrolledCourseIds = $user->enrollments()->pluck('course_id');

        $assignments = Assignment::whereIn('course_id', $enrolledCourseIds)
            ->with('course:id,title')
            ->orderByDesc('due_date')
            ->get()
            ->map(function ($a) use ($user) {
                $submission = Submission::where('assignment_id', $a->id)
                    ->where('student_id', $user->id)
                    ->first();

                $status = 'Chưa nộp';
                $score = null;
                $submissionId = null;
                $feedback = null;
                $fileUrl = null;
                $gradedAt = null;
                if ($submission) {
                    $submissionId = $submission->id;
                    $status = $submission->status === 'graded' ? 'Đã chấm' : 'Đã nộp';
                    $score = $submission->score ? $submission->score . '/' . $a->max_score : null;
                    $feedback = $submission->feedback;
                    $fileUrl = $submission->file_url;
                    $gradedAt = $submission->graded_at?->format('d/m/Y H:i');
                }

                return [
                    'id'            => $a->id,
                    'title'         => $a->title,
                    'course'        => $a->course->title,
                    'due'           => $a->due_date->format('d/m/Y'),
                    'status'        => $status,
                    'score'         => $score,
                    'score_raw'     => $submission?->score,
                    'max_score'     => $a->max_score,
                    'icon'          => $a->icon,
                    'submission_id' => $submissionId,
                    'feedback'      => $feedback,
                    'file_url'      => $fileUrl,
                    'graded_at'     => $gradedAt,
                    'description'   => $a->description,
                ];
            });

        // Stats
        $total = $assignments->count();
        $notSubmitted = $assignments->where('status', 'Chưa nộp')->count();
        $submitted = $assignments->where('status', 'Đã nộp')->count();
        $graded = $assignments->where('status', 'Đã chấm')->count();

        return response()->json([
            'assignments' => $assignments,
            'stats' => compact('total', 'notSubmitted', 'submitted', 'graded'),
        ]);
    }

    /**
     * Teacher/Admin: assignments with submission counts
     */
    private function teacherAssignments($user)
    {
        $query = Assignment::with('course:id,title')
            ->withCount(['submissions', 'submissions as need_grading_count' => function ($q) {
                $q->where('status', 'submitted');
            }]);

        // Teacher: only their courses; Admin: all
        if ($user->isTeacher()) {
            $query->where('teacher_id', $user->id);
        }

        $assignments = $query->orderByDesc('due_date')->get()->map(function ($a) {
            // Total enrolled students in course
            $totalStudents = $a->course->enrollments()->count();

            return [
                'id'          => $a->id,
                'title'       => $a->title,
                'course'      => $a->course->title,
                'submitted'   => $a->submissions_count,
                'total'       => $totalStudents,
                'needGrading' => $a->need_grading_count,
                'dueDate'     => $a->due_date->format('d/m/Y'),
                'max_score'   => $a->max_score,
            ];
        });

        // Stats
        $totalOpen = $assignments->count();
        $needGrading = $assignments->sum('needGrading');
        $completed = Submission::where('status', 'graded')
            ->whereIn('assignment_id', $assignments->pluck('id'))
            ->count();

        return response()->json([
            'assignments' => $assignments,
            'stats' => [
                'totalOpen'    => $totalOpen,
                'needGrading'  => $needGrading,
                'completed'    => $completed,
                'overdue'      => Assignment::where('due_date', '<', now())
                    ->where('teacher_id', $user->id)
                    ->count(),
            ],
        ]);
    }

    /**
     * POST /api/assignments — Teacher: create assignment
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id'   => 'required|exists:courses,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'due_date'    => 'required|date',
            'max_score'   => 'nullable|integer|min:1',
        ]);

        $assignment = Assignment::create([
            ...$validated,
            'teacher_id' => $request->user()->id,
        ]);

        return response()->json($assignment, 201);
    }

    /**
     * PUT /api/assignments/{assignment} — Teacher: update assignment
     */
    public function update(Request $request, Assignment $assignment)
    {
        $user = $request->user();
        if (!$user->isAdmin() && $assignment->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền chỉnh sửa.'], 403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'icon'        => 'nullable|string|max:50',
            'due_date'    => 'sometimes|date',
            'max_score'   => 'nullable|integer|min:1',
        ]);

        $assignment->update($validated);
        return response()->json($assignment);
    }

    /**
     * DELETE /api/assignments/{assignment} — Teacher: delete assignment
     */
    public function destroy(Request $request, Assignment $assignment)
    {
        $user = $request->user();
        if (!$user->isAdmin() && $assignment->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền xóa.'], 403);
        }

        // Delete all submissions first
        Submission::where('assignment_id', $assignment->id)->delete();
        $assignment->delete();

        return response()->json(['message' => 'Đã xóa bài tập thành công.']);
    }

    /**
     * POST /api/assignments/{assignment}/submit — Student: submit
     */
    public function submit(Request $request, Assignment $assignment)
    {
        $user = $request->user();

        $validated = $request->validate([
            'content'  => 'nullable|string',
            'file_url' => 'nullable|string',
        ]);

        // Allow re-submit: update if exists, create if not
        $existing = Submission::where('assignment_id', $assignment->id)
            ->where('student_id', $user->id)
            ->first();

        if ($existing) {
            // Only allow re-submit if not yet graded
            if ($existing->status === 'graded') {
                return response()->json(['message' => 'Bài đã được chấm điểm, không thể nộp lại.'], 409);
            }
            $existing->update([
                'content'      => $validated['content'] ?? $existing->content,
                'file_url'     => $validated['file_url'] ?? $existing->file_url,
                'submitted_at' => now(),
            ]);
            return response()->json([
                'message'    => 'Đã cập nhật bài nộp!',
                'submission' => $existing,
            ]);
        }

        $submission = Submission::create([
            'assignment_id' => $assignment->id,
            'student_id'    => $user->id,
            'content'       => $validated['content'] ?? null,
            'file_url'      => $validated['file_url'] ?? null,
        ]);

        return response()->json([
            'message'    => 'Nộp bài thành công!',
            'submission' => $submission,
        ], 201);
    }

    /**
     * GET /api/assignments/{assignment}/submissions — Teacher: list all submissions
     */
    public function getSubmissions(Request $request, Assignment $assignment)
    {
        $submissions = Submission::where('assignment_id', $assignment->id)
            ->with('student:id,name,email,avatar_url')
            ->orderByDesc('submitted_at')
            ->get()
            ->map(function ($s) use ($assignment) {
                return [
                    'id'           => $s->id,
                    'student'      => [
                        'id'         => $s->student->id,
                        'name'       => $s->student->name,
                        'email'      => $s->student->email,
                        'avatar_url' => $s->student->avatar_url,
                    ],
                    'content'      => $s->content,
                    'file_url'     => $s->file_url,
                    'score'        => $s->score,
                    'max_score'    => $assignment->max_score,
                    'feedback'     => $s->feedback,
                    'status'       => $s->status,
                    'submitted_at' => $s->submitted_at?->format('d/m/Y H:i'),
                    'graded_at'    => $s->graded_at?->format('d/m/Y H:i'),
                ];
            });

        return response()->json([
            'assignment' => [
                'id'        => $assignment->id,
                'title'     => $assignment->title,
                'course'    => $assignment->course->title ?? '',
                'max_score' => $assignment->max_score,
                'due_date'  => $assignment->due_date->format('d/m/Y'),
            ],
            'submissions' => $submissions,
            'stats'       => [
                'total'       => $submissions->count(),
                'graded'      => $submissions->where('status', 'graded')->count(),
                'pending'     => $submissions->where('status', 'submitted')->count(),
            ],
        ]);
    }

    /**
     * GET /api/assignments/{assignment}/feedback — Student: get my feedback
     */
    public function getFeedback(Request $request, Assignment $assignment)
    {
        $user = $request->user();

        $submission = Submission::where('assignment_id', $assignment->id)
            ->where('student_id', $user->id)
            ->first();

        if (!$submission) {
            return response()->json(['message' => 'Bạn chưa nộp bài tập này.'], 404);
        }

        return response()->json([
            'assignment' => [
                'id'        => $assignment->id,
                'title'     => $assignment->title,
                'course'    => $assignment->course->title ?? '',
                'max_score' => $assignment->max_score,
                'icon'      => $assignment->icon,
            ],
            'submission' => [
                'id'           => $submission->id,
                'content'      => $submission->content,
                'file_url'     => $submission->file_url,
                'score'        => $submission->score,
                'max_score'    => $assignment->max_score,
                'feedback'     => $submission->feedback,
                'status'       => $submission->status,
                'submitted_at' => $submission->submitted_at?->format('d/m/Y H:i'),
                'graded_at'    => $submission->graded_at?->format('d/m/Y H:i'),
            ],
        ]);
    }

    /**
     * PUT /api/assignments/{assignment}/grade/{submission} — Teacher: grade
     */
    public function grade(Request $request, Assignment $assignment, Submission $submission)
    {
        $validated = $request->validate([
            'score'    => 'required|numeric|min:0|max:' . $assignment->max_score,
            'feedback' => 'nullable|string',
        ]);

        $submission->update([
            'score'     => $validated['score'],
            'feedback'  => $validated['feedback'] ?? null,
            'status'    => 'graded',
            'graded_at' => now(),
        ]);

        return response()->json([
            'message'    => 'Đã chấm điểm thành công!',
            'submission' => $submission->load('student:id,name,email'),
        ]);
    }
}
