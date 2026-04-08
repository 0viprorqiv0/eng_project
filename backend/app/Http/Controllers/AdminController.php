<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Submission;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * GET /api/admin/stats — Dashboard overview stats
     */
    public function stats()
    {
        $totalStudents = User::where('role', 'student')->count();
        $totalCourses = Course::count();

        // Revenue = sum of price_amount * enrollments
        $monthlyRevenue = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->whereMonth('enrollments.created_at', now()->month)
            ->whereYear('enrollments.created_at', now()->year)
            ->sum('courses.price_amount');

        $lastMonthStudents = User::where('role', 'student')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->count();

        $newEnrollmentRate = $lastMonthStudents > 0
            ? round(($totalStudents - $lastMonthStudents) / $lastMonthStudents * 100)
            : 25;

        return response()->json([
            'total_students'        => $totalStudents,
            'total_courses'         => $totalCourses,
            'monthly_revenue'       => $monthlyRevenue,
            'new_enrollment_rate'   => $newEnrollmentRate,
            'new_students_this_month' => User::where('role', 'student')
                ->whereMonth('created_at', now()->month)->count(),
            'upcoming_sessions'     => \App\Models\Schedule::count(),
        ]);
    }

    /**
     * GET /api/admin/revenue — Monthly revenue data for charts
     */
    public function revenue(Request $request)
    {
        $year = $request->get('year', now()->year);

        $data = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->whereYear('enrollments.created_at', $year)
            ->selectRaw('CAST(strftime("%m", enrollments.created_at) AS INTEGER) as month, SUM(courses.price_amount) as revenue')
            ->groupByRaw('strftime("%m", enrollments.created_at)')
            ->pluck('revenue', 'month');

        // Fill 12 months
        $monthly = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthly[] = [
                'month'   => $i,
                'revenue' => $data->get($i, 0),
            ];
        }

        return response()->json($monthly);
    }

    /**
     * GET /api/admin/recent-enrollments — Latest enrollments
     */
    public function recentEnrollments(Request $request)
    {
        $limit = $request->get('limit', 10);

        $enrollments = Enrollment::with(['user:id,name,email', 'course:id,title'])
            ->orderByDesc('created_at')
            ->limit($limit)
            ->get()
            ->map(fn ($e) => [
                'student' => $e->user->name,
                'course'  => $e->course->title,
                'date'    => $e->created_at->format('d/m/Y'),
                'status'  => $e->status === 'active' ? 'Mới' : 'Hoàn thành',
            ]);

        return response()->json($enrollments);
    }
}
