<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Lesson;
use Illuminate\Http\Request;

class CourseController extends Controller
{
    /**
     * GET /api/courses — Public: list all published courses
     * Supports: ?category=, ?search=, ?sort=popular|newest|price
     */
    public function index(Request $request)
    {
        $query = Course::with(['teacher:id,name', 'structures'])
            ->where('status', 'published');

        // Filter by category
        if ($request->has('category') && $request->category !== 'Tất cả') {
            $query->where('category', $request->category);
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('subtitle', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sort
        $sort = $request->get('sort', 'newest');
        $query = match ($sort) {
            'popular' => $query->withCount('enrollments')->orderByDesc('enrollments_count'),
            'price'   => $query->orderBy('price_amount'),
            'rating'  => $query->orderByDesc('rating'),
            default   => $query->orderBy('id'), // Ensure courses appear in the exact 1-8 order seeded
        };

        $courses = $query->paginate($request->get('per_page', 20));

        return response()->json($courses);
    }

    /**
     * GET /api/courses/{course} — Public: course detail
     */
    public function show(Course $course)
    {
        $course->load(['teacher:id,name,bio,avatar_url', 'structures', 'lessons:id,course_id,title,lesson_type,duration_minutes,sort_order,video_path,video_url,materials_path,questions_data,content,description']);
        $course->loadCount('enrollments');

        return response()->json($course);
    }

    /**
     * GET /api/courses/{course}/lessons — All lessons for a course
     */
    public function lessons(Course $course)
    {
        $lessons = $course->lessons()
            ->select('id', 'course_id', 'title', 'duration_minutes', 'sort_order', 'video_path', 'materials_path')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'course' => [
                'id'    => $course->id,
                'title' => $course->title,
                'color' => $course->color,
            ],
            'lessons' => $lessons,
        ]);
    }

    /**
     * GET /api/lessons/{lesson} — Full lesson detail with content, video, materials
     */
    public function lessonDetail(Request $request, \App\Models\Lesson $lesson)
    {
        $isAuth = $request->bearerToken() && auth('sanctum')->check();

        // Only load assignment data for authenticated users
        $relations = $isAuth
            ? ['course:id,title,color,slug', 'assignment']
            : ['course:id,title,color,slug'];

        $lesson->load($relations);

        // Hide assignment description from unauthenticated viewers
        if (!$isAuth && $lesson->assignment) {
            $lesson->unsetRelation('assignment');
        }

        // Get sibling lessons for navigation
        $siblings = \App\Models\Lesson::where('course_id', $lesson->course_id)
            ->select('id', 'title', 'sort_order', 'duration_minutes', 'video_path')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'lesson'   => $lesson,
            'siblings' => $siblings,
        ]);
    }

    /**
     * POST /api/courses — Teacher/Admin: create course
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:255',
            'slug'        => 'required|string|max:100|unique:courses,slug',
            'subtitle'    => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'outcome'     => 'nullable|string',
            'price'       => 'nullable|string|max:50',
            'price_amount'=> 'nullable|integer',
            'category'    => 'nullable|string|max:50',
            'level'       => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'image'       => 'nullable|string',
            'color'       => 'nullable|string|max:20',
            'status'      => 'nullable|in:draft,published,archived',
            'structures'  => 'nullable|array',
            'structures.*'=> 'string',
        ]);

        $course = Course::create([
            ...$validated,
            'teacher_id' => $request->user()->id,
        ]);

        // Create structures
        if (!empty($validated['structures'])) {
            foreach ($validated['structures'] as $i => $content) {
                $course->structures()->create([
                    'content'    => $content,
                    'sort_order' => $i,
                ]);
            }
        }

        $course->load('structures');
        return response()->json($course, 201);
    }

    /**
     * PUT /api/courses/{course} — Owner/Admin: update course
     */
    public function update(Request $request, Course $course)
    {
        $user = $request->user();

        // Only admin or course owner can update
        if (!$user->isAdmin() && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền chỉnh sửa.'], 403);
        }

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:255',
            'subtitle'    => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'outcome'     => 'nullable|string',
            'price'       => 'nullable|string|max:50',
            'price_amount'=> 'nullable|integer',
            'category'    => 'nullable|string|max:50',
            'level'       => 'nullable|string|max:50',
            'duration'    => 'nullable|string|max:50',
            'image'       => 'nullable|string',
            'color'       => 'nullable|string|max:20',
            'status'      => 'nullable|in:draft,published,archived',
        ]);

        $course->update($validated);
        return response()->json($course);
    }

    /**
     * DELETE /api/courses/{course} — Owner/Admin: delete course
     */
    public function destroy(Request $request, Course $course)
    {
        $user = $request->user();

        if (!$user->isAdmin() && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền xóa.'], 403);
        }

        $course->delete();
        return response()->json(['message' => 'Đã xóa khóa học.']);
    }

    /**
     * POST /api/courses/{course}/lessons — Teacher/Admin: create a lesson/lecture
     */
    public function storeLesson(Request $request, Course $course)
    {
        $user = $request->user();

        // Only admin or course owner can add lessons
        if (!$user->isAdmin() && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền thêm bài giảng.'], 403);
        }

        $validated = $request->validate([
            'title'            => 'required|string|max:255',
            'lesson_type'      => 'nullable|in:video,document,quiz,assignment',
            'content'          => 'nullable|string',
            'description'      => 'nullable|string',
            'questions_data'   => 'nullable|array',
            'video_url'        => 'nullable|string|max:500',
            'video_path'       => 'nullable|string|max:500',
            'materials_path'   => 'nullable|string|max:500',
            'subtitle_path'    => 'nullable|string|max:500',
            'video_type'       => 'nullable|in:upload,url',
            'duration_minutes' => 'nullable|integer|min:0',
            'is_free_preview'  => 'nullable|boolean',
            'unlock_condition' => 'nullable|in:immediate,after_previous,after_days',
            'unlock_days'      => 'nullable|integer|min:0',
            // Optional assignment fields (when lesson_type = assignment)
            'assignment_title'     => 'nullable|string|max:255',
            'assignment_max_score' => 'nullable|integer|min:1',
            'assignment_due_date'  => 'nullable|date',
        ]);

        // Auto sort_order = max + 1
        $maxOrder = $course->lessons()->max('sort_order') ?? 0;
        $validated['sort_order'] = $maxOrder + 1;
        $validated['course_id'] = $course->id;

        // Remove assignment-specific fields before creating lesson
        $assignmentData = [
            'title'     => $validated['assignment_title'] ?? null,
            'max_score' => $validated['assignment_max_score'] ?? null,
            'due_date'  => $validated['assignment_due_date'] ?? null,
        ];
        unset($validated['assignment_title'], $validated['assignment_max_score'], $validated['assignment_due_date']);

        $lesson = \App\Models\Lesson::create($validated);

        // Auto-create linked assignment if lesson_type is 'assignment'
        if ($lesson->lesson_type === 'assignment' && $assignmentData['title']) {
            \App\Models\Assignment::create([
                'course_id'  => $course->id,
                'lesson_id'  => $lesson->id,
                'teacher_id' => $user->id,
                'title'      => $assignmentData['title'],
                'description'=> $validated['description'] ?? null,
                'max_score'  => $assignmentData['max_score'] ?? 100,
                'due_date'   => $assignmentData['due_date'] ?? now()->addDays(7),
            ]);
        }

        $lesson->load(['course:id,title', 'assignment']);

        return response()->json($lesson, 201);
    }

    /**
     * PUT /api/lessons/{lesson} — Teacher/Admin: update lesson
     */
    public function updateLesson(Request $request, Lesson $lesson)
    {
        $user = $request->user();
        $course = $lesson->course;

        if (!$user->isAdmin() && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền chỉnh sửa.'], 403);
        }

        $validated = $request->validate([
            'title'            => 'sometimes|string|max:255',
            'lesson_type'      => 'nullable|in:video,document,quiz,assignment',
            'content'          => 'nullable|string',
            'description'      => 'nullable|string',
            'questions_data'   => 'nullable|array',
            'video_url'        => 'nullable|string|max:500',
            'video_path'       => 'nullable|string|max:500',
            'materials_path'   => 'nullable|string|max:500',
            'subtitle_path'    => 'nullable|string|max:500',
            'video_type'       => 'nullable|in:upload,url',
            'duration_minutes' => 'nullable|integer|min:0',
            'is_free_preview'  => 'nullable|boolean',
            'sort_order'       => 'nullable|integer|min:0',
        ]);

        $lesson->update($validated);
        $lesson->load(['course:id,title', 'assignment']);

        return response()->json($lesson);
    }

    /**
     * DELETE /api/lessons/{lesson} — Teacher/Admin: delete lesson
     */
    public function destroyLesson(Request $request, Lesson $lesson)
    {
        $user = $request->user();
        $course = $lesson->course;

        if (!$user->isAdmin() && $course->teacher_id !== $user->id) {
            return response()->json(['message' => 'Không có quyền xóa.'], 403);
        }

        // Delete linked assignment if any
        if ($lesson->assignment) {
            $lesson->assignment->submissions()->delete();
            $lesson->assignment->delete();
        }

        $lesson->delete();
        return response()->json(['message' => 'Đã xóa bài giảng.']);
    }

    /**
     * POST /api/courses/{course}/enroll — Student: enroll in course
     */
    public function enroll(Request $request, Course $course)
    {
        $user = $request->user();

        // Check if already enrolled
        $existing = Enrollment::where('user_id', $user->id)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Bạn đã đăng ký khóa học này.'], 409);
        }

        $enrollment = Enrollment::create([
            'user_id'   => $user->id,
            'course_id' => $course->id,
        ]);

        return response()->json([
            'message'    => 'Đã đăng ký khóa học thành công!',
            'enrollment' => $enrollment,
        ], 201);
    }

    /**
     * GET /api/my-courses — Auth: courses for current user (role-adaptive)
     */
    public function myCourses(Request $request)
    {
        $user = $request->user();

        if ($user->isAdmin()) {
            // Admin: all courses with stats
            $courses = Course::with('teacher:id,name')
                ->withCount('enrollments')
                ->orderByDesc('created_at')
                ->get()
                ->map(fn ($c) => [
                    'id'         => $c->id,
                    'name'       => $c->title,
                    'instructor' => $c->teacher?->name ?? 'N/A',
                    'students'   => $c->enrollments_count,
                    'rating'     => $c->rating,
                    'status'     => $c->status === 'published' ? 'Đang bán' : 'Nháp',
                    'revenue'    => $c->price,
                ]);

            return response()->json($courses);
        }

        if ($user->isTeacher()) {
            // Teacher: courses they teach
            $courses = Course::where('teacher_id', $user->id)
                ->withCount('enrollments')
                ->get()
                ->map(fn ($c) => [
                    'id'       => $c->id,
                    'name'     => $c->title,
                    'students' => $c->enrollments_count,
                    'price'    => $c->price,
                    'rating'   => $c->rating,
                    'status'   => $c->status === 'published' ? 'Đang bán' : 'Nháp',
                    'progress' => 100, // content progress (placeholder)
                ]);

            return response()->json($courses);
        }

        // Student: enrolled courses with progress
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course' => fn ($q) => $q->with('teacher:id,name')->withCount('lessons')])
            ->get()
            ->map(fn ($e) => [
                'id'         => $e->course->id,
                'name'       => $e->course->title,
                'instructor' => $e->course->teacher?->name ?? 'N/A',
                'progress'   => $e->progress,
                'lessons'    => $e->completed_lessons . '/' . $e->course->lessons_count,
                'level'      => $e->course->level,
                'image'      => $e->course->image,
                'status'     => $e->status,
            ]);

        return response()->json($enrollments);
    }

    /**
     * POST /api/lessons/{lesson}/quiz — Submit a quiz attempt
     */
    public function submitQuiz(Request $request, Lesson $lesson)
    {
        $user = $request->user();

        if ($lesson->lesson_type !== 'quiz') {
            return response()->json(['message' => 'Bài giảng này không phải là bài trắc nghiệm.'], 400);
        }

        $answers = $request->input('answers', []);
        $essayAnswers = $request->input('essay_answers', []);

        $questionsData = $lesson->questions_data ?? [];
        $totalMcQuestions = 0;
        $correctAnswers = 0;

        foreach ($questionsData as $q) {
            if (isset($q['type']) && $q['type'] === 'multiple_choice') {
                $totalMcQuestions++;
                $correctIdx = -1;
                foreach ($q['options'] ?? [] as $idx => $opt) {
                    if (isset($opt['isCorrect']) && $opt['isCorrect']) {
                        $correctIdx = $idx;
                        break;
                    }
                }
                
                if (isset($answers[$q['id']]) && $answers[$q['id']] === $correctIdx) {
                    $correctAnswers++;
                }
            }
        }

        $score = $correctAnswers;

        $attempt = \App\Models\QuizAttempt::updateOrCreate(
            ['lesson_id' => $lesson->id, 'user_id' => $user->id],
            [
                'score' => $score,
                'total_questions' => $totalMcQuestions,
                'answers_data' => $answers,
                'essay_answers' => $essayAnswers,
                'time_spent' => tap($request->input('time_spent', 0), fn($v) => is_numeric($v) ? (int)$v : 0),
            ]
        );

        $percentage = $totalMcQuestions > 0 ? round(($score / $totalMcQuestions) * 100) : 100;

        return response()->json([
            'message' => 'Nộp bài thành công',
            'score' => $score,
            'total' => $totalMcQuestions,
            'percentage' => $percentage,
            'attempt' => $attempt
        ]);
    }
}
