<?php

namespace App\Http\Controllers;

use App\Models\LearningLog;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportsController extends Controller
{
    /**
     * GET /api/reports/overview — Overall stats for authenticated user
     */
    public function overview(Request $request)
    {
        $user = $request->user();

        $totalHours = round(
            LearningLog::where('user_id', $user->id)->sum('duration_minutes') / 60, 1
        );

        $avgScore = Submission::where('student_id', $user->id)
            ->where('status', 'graded')
            ->avg('score');

        $enrollments = $user->enrollments;
        $completionRate = $enrollments->count() > 0
            ? round($enrollments->avg('progress'))
            : 0;

        return response()->json([
            'total_hours'     => $totalHours,
            'avg_score'       => round($avgScore ?? 0, 1),
            'completion_rate' => $completionRate,
            'streak'          => $user->streak,
        ]);
    }

    /**
     * GET /api/reports/skills — Student skill breakdown (L/R/W/S)
     */
    public function skills(Request $request)
    {
        // In a real app, scores would come from tagged assignments
        // For now, derive from submission scores per course category
        $user = $request->user();

        $submissions = Submission::where('student_id', $user->id)
            ->where('status', 'graded')
            ->with('assignment.course:id,slug')
            ->get();

        // Map course slugs to skills
        $skillMap = [
            'grammar'  => 'reading',
            'advanced' => 'listening',
            'exam'     => 'writing',
        ];

        $skills = ['listening' => 0, 'reading' => 0, 'writing' => 0, 'speaking' => 0];
        $counts = ['listening' => 0, 'reading' => 0, 'writing' => 0, 'speaking' => 0];

        foreach ($submissions as $sub) {
            $slug = $sub->assignment->course->slug ?? '';
            $skill = $skillMap[$slug] ?? 'speaking';
            $normalized = ($sub->score / $sub->assignment->max_score) * 100;
            $skills[$skill] += $normalized;
            $counts[$skill]++;
        }

        $result = [];
        foreach ($skills as $skill => $total) {
            $result[$skill] = $counts[$skill] > 0
                ? round($total / $counts[$skill])
                : rand(60, 90); // Sample data fallback
        }

        return response()->json($result);
    }

    /**
     * GET /api/reports/activity — Monthly activity for Teacher/Admin charts
     */
    public function activity(Request $request)
    {
        $year = $request->get('year', now()->year);

        $data = DB::table('learning_logs')
            ->whereYear('logged_at', $year)
            ->selectRaw('CAST(strftime("%m", logged_at) AS INTEGER) as month, SUM(duration_minutes) as total')
            ->groupByRaw('strftime("%m", logged_at)')
            ->pluck('total', 'month');

        $monthly = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthly[] = [
                'month' => $i,
                'hours' => round(($data->get($i, 0)) / 60, 1),
            ];
        }

        return response()->json($monthly);
    }
}
