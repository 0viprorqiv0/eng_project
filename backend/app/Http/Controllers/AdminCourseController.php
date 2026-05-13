<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class AdminCourseController extends Controller
{
    /**
     * GET /admin/courses
     */
    public function index(Request $request)
    {
        $query = Course::with('teacher:id,name,email');

        if ($request->filled('search')) {
            $s = $request->search;
            $query->where('title', 'like', "%$s%");
        }

        if ($request->filled('teacher_id')) {
            $query->where('teacher_id', $request->teacher_id);
        }

        $courses = $query->orderBy('id', 'desc')->paginate($request->get('per_page', 10));

        return response()->json($courses);
    }

    /**
     * GET /admin/courses/{id}/performance
     */
    public function performance($id)
    {
        $course = Course::findOrFail($id);

        $cacheKey = "course_{$id}_performance";
        
        $stats = Cache::remember($cacheKey, 300, function () use ($course) {
            // Aggregation implementation for large scale
            
            // 1. Enrollment metrics
            $totalEnrollments = $course->enrollments()->count();
            $completedEnrollments = $course->enrollments()->where('status', 'completed')->count();
            $completionRate = $totalEnrollments > 0 
                                ? round(($completedEnrollments / $totalEnrollments) * 100, 2) 
                                : 0;

            // 2. Average Score metrics (assuming Submissions table exists with normalized 'score' metric over 100)
            // Here we average the score of submittions by enrollments belonging to this course's assignments
            // Querying via relationship: course -> assignments -> submissions
            $avgScore = $course->assignments()
                ->join('submissions', 'assignments.id', '=', 'submissions.assignment_id')
                ->whereNotNull('submissions.score')
                ->avg('submissions.score');

            // Optionally, also average quiz scores (if they use standard submissions table or separate quiz_attempts)
            // If BeeLearn implements quiz_attempts separately:
            /*
            $quizAvgScore = DB::table('quiz_attempts')
                ->join('lessons', 'quiz_attempts.lesson_id', '=', 'lessons.id')
                ->where('lessons.course_id', $course->id)
                ->avg('score');
            */

            return [
                'total_enrollments' => $totalEnrollments,
                'completion_rate'   => $completionRate,
                'avg_score'         => $avgScore ? round($avgScore, 2) : null,
                'active_students'   => $course->enrollments()->where('status', 'active')->count()
            ];
        });

        return response()->json($stats);
    }

    /**
     * DELETE /admin/courses/{id}
     */
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        
        // Clear performance cache
        Cache::forget("course_{$id}_performance");
        
        $course->delete();

        return response()->json(['message' => 'Khóa học đã được xóa']);
    }
}
