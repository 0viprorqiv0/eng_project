<?php

namespace App\Http\Controllers;

use App\Models\DailyGoal;
use App\Models\LearningLog;
use App\Models\Submission;
use App\Models\Enrollment;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * GET /api/student/stats — Dashboard overview
     */
    public function stats(Request $request)
    {
        $user = $request->user();

        $totalCourses = $user->enrollments()->count();
        $completedLessons = \App\Models\LessonProgress::where('user_id', $user->id)
            ->where('completed', true)
            ->count();

        // Avg score from graded submissions
        $avgScore = Submission::where('student_id', $user->id)
            ->where('status', 'graded')
            ->whereNotNull('score')
            ->avg('score');

        return response()->json([
            'total_courses'     => $totalCourses,
            'completed_lessons' => $completedLessons,
            'avg_score'         => round($avgScore ?? 0, 1),
            'streak'            => $user->streak,
        ]);
    }

    /**
     * GET /api/student/learning-time — Last 7 days chart data
     */
    public function learningTime(Request $request)
    {
        $user = $request->user();

        $data = LearningLog::where('user_id', $user->id)
            ->where('logged_at', '>=', now()->subDays(6)->startOfDay())
            ->selectRaw("logged_at, SUM(duration_minutes) as minutes")
            ->groupBy('logged_at')
            ->pluck('minutes', 'logged_at');

        // Fill 7 days
        $result = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->locale('vi')->isoFormat('ddd');
            $result[] = [
                'day'     => $dayName,
                'date'    => $date,
                'minutes' => $data->get($date, 0),
            ];
        }

        return response()->json($result);
    }

    /**
     * GET /api/student/daily-goals — Today's goals
     */
    public function dailyGoals(Request $request)
    {
        $user = $request->user();

        $goals = DailyGoal::where('user_id', $user->id)
            ->whereDate('date', today())
            ->orderBy('id')
            ->get()
            ->map(fn ($g) => [
                'id'           => $g->id,
                'title'        => $g->title,
                'is_completed' => $g->is_completed,
                'progress'     => $g->progress,
            ]);

        return response()->json($goals);
    }

    /**
     * POST /api/student/daily-goals — Create a new goal
     */
    public function storeDailyGoal(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $goal = DailyGoal::create([
            'user_id' => $request->user()->id,
            'title'   => $request->title,
            'progress' => $request->get('progress', '0'),
            'is_completed' => false,
            'date'    => today(),
        ]);

        return response()->json([
            'id'           => $goal->id,
            'title'        => $goal->title,
            'is_completed' => $goal->is_completed,
            'progress'     => $goal->progress,
        ], 201);
    }

    /**
     * PUT /api/student/daily-goals/{id} — Update a goal
     */
    public function updateDailyGoal(Request $request, $id)
    {
        $goal = DailyGoal::where('user_id', $request->user()->id)->findOrFail($id);

        if ($request->has('title')) {
            $goal->title = $request->title;
        }
        if ($request->has('progress')) {
            $goal->progress = $request->progress;
            $goal->is_completed = intval($request->progress) >= 100;
        }

        $goal->save();

        return response()->json([
            'id'           => $goal->id,
            'title'        => $goal->title,
            'is_completed' => $goal->is_completed,
            'progress'     => $goal->progress,
        ]);
    }

    /**
     * DELETE /api/student/daily-goals/{id} — Delete a goal
     */
    public function destroyDailyGoal(Request $request, $id)
    {
        $goal = DailyGoal::where('user_id', $request->user()->id)->findOrFail($id);
        $goal->delete();

        return response()->json(['message' => 'Đã xóa mục tiêu.']);
    }

    /**
     * GET /api/teacher/stats — Teacher dashboard overview
     */
    public function teacherStats(Request $request)
    {
        $user = $request->user();

        $courses = $user->taughtCourses();
        $totalStudents = DB::table('enrollments')
            ->whereIn('course_id', $courses->pluck('id'))
            ->distinct('user_id')
            ->count('user_id');

        $totalCourses = $courses->count();
        $avgRating = $courses->avg('rating');
        $liveSessions = \App\Models\Schedule::where('teacher_id', $user->id)
            ->where('type', 'live')->count();
        $courseIds = $courses->pluck('id');
        $newEnrollmentsToday = Enrollment::whereIn('course_id', $courseIds)
            ->whereDate('created_at', today())->count();
        
        $pendingSubmissions = Submission::whereIn('assignment_id', function($q) use ($courseIds) {
            $q->select('id')->from('assignments')->whereIn('course_id', $courseIds);
        })->where('status', 'submitted')->count();

        return response()->json([
            'total_students'  => $totalStudents,
            'total_courses'   => $totalCourses,
            'avg_rating'      => round($avgRating ?? 0, 1),
            'live_sessions'   => $liveSessions,
            'new_enrollments_today' => $newEnrollmentsToday,
            'pending_submissions_count' => $pendingSubmissions,
        ]);
    }

    /**
     * GET /api/teacher/students — List of students for teacher
     */
    public function teacherStudents(Request $request)
    {
        $user = $request->user();
        $courseIds = $user->taughtCourses()->pluck('id');

        // KPIs
        $enrollmentsQuery = \App\Models\Enrollment::whereIn('course_id', $courseIds);
        
        $totalStudents = (clone $enrollmentsQuery)->distinct('user_id')->count('user_id');
        
        $newStudents = (clone $enrollmentsQuery)
            ->where('created_at', '>=', now()->subDays(30))
            ->distinct('user_id')
            ->count('user_id');
            
        $avgCompletion = (clone $enrollmentsQuery)->avg('progress') ?? 0;
        
        $needsHelp = (clone $enrollmentsQuery)
            ->where('progress', '<', 50)
            ->where('enrolled_at', '<', now()->subDays(7))
            ->distinct('user_id')
            ->count('user_id');

        // Build list query
        $query = \App\Models\Enrollment::with(['user:id,name,email,avatar_url', 'course:id,title'])
            ->whereIn('course_id', $courseIds);

        // Filters
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->whereHas('user', function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->has('course_id') && $request->course_id !== 'all') {
            $query->where('course_id', $request->course_id);
        }

        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $list = $query->orderByDesc('enrolled_at')->paginate($request->get('limit', 10));

        // Inject average score per enrollment
        foreach ($list->items() as $item) {
            $avgScore = DB::table('submissions')
                ->join('assignments', 'submissions.assignment_id', '=', 'assignments.id')
                ->where('assignments.course_id', $item->course_id)
                ->where('submissions.student_id', $item->user_id)
                ->where('submissions.status', 'graded')
                ->avg('submissions.score');
                
            $item->avg_score = round($avgScore ?? 0, 1);
            
            // Format enrolled term based on month
            $month = clone $item->enrolled_at;
            $season = match(true) {
                $month->month >= 2 && $month->month <= 4 => 'Xuân',
                $month->month >= 5 && $month->month <= 7 => 'Hè',
                $month->month >= 8 && $month->month <= 10 => 'Thu',
                default => 'Đông'
            };
            $item->enrolled_term = $season . ' ' . $month->year;
        }

        return response()->json([
            'kpis' => [
                'total_students' => $totalStudents,
                'new_students' => $newStudents,
                'avg_completion' => round($avgCompletion, 1),
                'needs_help' => $needsHelp
            ],
            'students' => $list
        ]);
    }
    /**
     * POST /api/teacher/students/{id}/warn — Warn a student about learning attitude
     */
    public function warnStudent(Request $request, $id)
    {
        $student = User::where('role', 'student')->findOrFail($id);
        
        Notification::notify(
            $student->id,
            'warning',
            'Cảnh cáo từ Giảng viên',
            'Giảng viên đã gửi cảnh cáo về thái độ học tập của bạn. Vui lòng tập trung hơn vào các bài giảng và bài tập.',
            null,
            'priority_high'
        );

        return response()->json(['message' => 'Đã gửi cảnh cáo cho học sinh thành công.']);
    }

    /**
     * POST /api/teacher/students/{id}/report — Report a student to admin
     */
    public function reportStudent(Request $request, $id)
    {
        $student = User::findOrFail($id);
        $teacher = $request->user();

        Notification::notifyRole(
            'admin',
            'report',
            'Báo cáo học sinh từ Giảng viên',
            "Giảng viên {$teacher->name} đã báo cáo về học sinh {$student->name} (Email: {$student->email}). Vui lòng xem xét tình hình.",
            null,
            'admin_panel_settings'
        );

        return response()->json(['message' => 'Đã gửi báo cáo cho Admin thành công.']);
    }
}
