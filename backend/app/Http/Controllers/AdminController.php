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
        $totalTeachers = User::where('role', 'teacher')->count();
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

        $lastMonthCourses = Course::whereMonth('created_at', now()->subMonth()->month)->count();
        $courseTrend = $lastMonthCourses > 0 ? round(($totalCourses - $lastMonthCourses) / $lastMonthCourses * 100) : 10;

        return response()->json([
            'total_students'        => $totalStudents,
            'total_teachers'        => $totalTeachers,
            'active_teachers'       => max(1, round($totalTeachers * 0.8)), // Mocking active teachers
            'total_courses'         => $totalCourses,
            'monthly_revenue'       => $monthlyRevenue,
            'new_enrollment_rate'   => $newEnrollmentRate,
            'student_trend'         => $newEnrollmentRate, // Using enrollment rate as student growth proxy
            'course_trend'          => $courseTrend,
            'new_students_this_month' => User::where('role', 'student')
                ->whereMonth('created_at', now()->month)->count(),
            'upcoming_sessions'     => \App\Models\Schedule::count(),
            'popular_courses'       => Course::withCount('enrollments')
                ->orderByDesc('enrollments_count')
                ->limit(3)
                ->get()
                ->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->title,
                    'students' => $c->enrollments_count,
                    'rating' => $c->rating ?: 4.8,
                    'color' => $c->color ?: 'bg-[#002143]'
                ]),
        ]);
    }

    /**
     * GET /api/admin/revenue — Monthly revenue data for charts
     */
    public function revenue(Request $request)
    {
        $months = [];
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months[] = [
                'year'        => $date->year,
                'month'       => $date->month,
                'revenue'     => 0,
                'enrollments' => 0,
            ];
        }

        $startDate = now()->startOfMonth()->subMonths(5);

        $data = DB::table('enrollments')
            ->join('courses', 'enrollments.course_id', '=', 'courses.id')
            ->where('enrollments.created_at', '>=', $startDate)
            ->selectRaw('YEAR(enrollments.created_at) as year, MONTH(enrollments.created_at) as month, SUM(courses.price_amount) as revenue, COUNT(enrollments.id) as enrollments')
            ->groupByRaw('YEAR(enrollments.created_at), MONTH(enrollments.created_at)')
            ->get();

        foreach ($data as $d) {
            foreach ($months as &$m) {
                if ($m['year'] == $d->year && $m['month'] == $d->month) {
                    $m['revenue'] = $d->revenue;
                    $m['enrollments'] = $d->enrollments;
                }
            }
        }

        return response()->json($months);
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
