<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\LessonFeatureController;
use App\Http\Controllers\ConsultationController;
use App\Http\Controllers\JobApplicationController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PlacementController;

/*
|--------------------------------------------------------------------------
| API Routes — BeeLearn
|--------------------------------------------------------------------------
*/

// ── Public ──
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/chat',     [ChatController::class, 'sendMessage'])->middleware('throttle:20,1');
Route::post('/consultations', [ConsultationController::class, 'store']);
Route::post('/placement-evaluate', [PlacementController::class, 'evaluate'])
    ->middleware('throttle:20,1');  // 20 req/phút/IP
Route::post('/job-applications', [JobApplicationController::class, 'store']);

Route::get('/courses',          [CourseController::class, 'index']);
Route::get('/courses/{course}', [CourseController::class, 'show']);
Route::get('/courses/{course}/lessons', [CourseController::class, 'lessons']);
Route::get('/lessons/{lesson}', [CourseController::class, 'lessonDetail']);

// ── Authenticated ──
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me',      [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // Courses
    Route::get('/my-courses', [CourseController::class, 'myCourses']);
    Route::post('/courses/{course}/enroll', [CourseController::class, 'enroll']);
    Route::post('/lessons/{lesson}/quiz', [CourseController::class, 'submitQuiz']);

    // Progress tracking
    Route::get('/courses/{courseId}/progress',    [LessonFeatureController::class, 'getProgress']);
    Route::post('/lessons/{lessonId}/complete',   [LessonFeatureController::class, 'markComplete']);
    Route::delete('/lessons/{lessonId}/complete',  [LessonFeatureController::class, 'unmarkComplete']);

    // Notes
    Route::get('/lessons/{lessonId}/notes',    [LessonFeatureController::class, 'getNotes']);
    Route::post('/lessons/{lessonId}/notes',   [LessonFeatureController::class, 'storeNote']);
    Route::delete('/notes/{noteId}',           [LessonFeatureController::class, 'destroyNote']);

    // Discussions
    Route::get('/courses/{courseId}/discussions',  [LessonFeatureController::class, 'getDiscussions']);
    Route::post('/courses/{courseId}/discussions', [LessonFeatureController::class, 'storeDiscussion']);
    Route::delete('/discussions/{id}',            [LessonFeatureController::class, 'destroyDiscussion']);

    // Assignments
    Route::get('/assignments', [AssignmentController::class, 'index']);
    Route::post('/assignments/{assignment}/submit', [AssignmentController::class, 'submit']);
    Route::get('/assignments/{assignment}/feedback', [AssignmentController::class, 'getFeedback']);

    // Schedules
    Route::get('/schedules', [ScheduleController::class, 'index']);

    // Reports
    Route::get('/reports/overview', [ReportsController::class, 'overview']);
    Route::get('/reports/skills',   [ReportsController::class, 'skills']);
    Route::get('/reports/activity', [ReportsController::class, 'activity']);

    // Settings
    Route::get('/settings',               [SettingsController::class, 'show']);
    Route::put('/settings',               [SettingsController::class, 'update']);
    Route::post('/settings/avatar',       [SettingsController::class, 'uploadAvatar']);

    // File Uploads
    Route::post('/upload/submission',    [FileController::class, 'uploadSubmission']);
    Route::post('/upload/lesson-media',  [FileController::class, 'uploadLessonMedia']);

    // Notifications
    Route::get('/notifications',              [NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read',   [NotificationController::class, 'markRead']);
    Route::post('/notifications/read-all',    [NotificationController::class, 'markAllRead']);
    Route::post('/notifications/send',        [NotificationController::class, 'send']);
    Route::delete('/notifications/{id}',       [NotificationController::class, 'destroy']);
    Route::post('/notifications/{id}/toggle-pin', [NotificationController::class, 'togglePin']);

    // ── Student ──
    Route::middleware('role:student')->group(function () {
        Route::get('/student/stats',         [StudentController::class, 'stats']);
        Route::get('/student/learning-time', [StudentController::class, 'learningTime']);
        Route::get('/student/daily-goals',   [StudentController::class, 'dailyGoals']);
        Route::post('/student/daily-goals',  [StudentController::class, 'storeDailyGoal']);
        Route::put('/student/daily-goals/{id}', [StudentController::class, 'updateDailyGoal']);
        Route::delete('/student/daily-goals/{id}', [StudentController::class, 'destroyDailyGoal']);
    });

    // ── Teacher ──
    Route::middleware('role:teacher')->group(function () {
        Route::get('/teacher/stats', [StudentController::class, 'teacherStats']);
        Route::get('/teacher/students', [StudentController::class, 'teacherStudents']);
        Route::post('/teacher/students/{id}/warn', [StudentController::class, 'warnStudent']);
        Route::post('/teacher/students/{id}/report', [StudentController::class, 'reportStudent']);
    });

    // ── Teacher + Admin ──
    Route::middleware('role:teacher,admin')->group(function () {
        Route::post('/courses',            [CourseController::class, 'store']);
        Route::post('/courses/{course}/lessons', [CourseController::class, 'storeLesson']);
        Route::put('/lessons/{lesson}',    [CourseController::class, 'updateLesson']);
        Route::delete('/lessons/{lesson}', [CourseController::class, 'destroyLesson']);
        Route::put('/courses/{course}',    [CourseController::class, 'update']);
        Route::delete('/courses/{course}', [CourseController::class, 'destroy']);

        Route::post('/assignments',        [AssignmentController::class, 'store']);
        Route::put('/assignments/{assignment}', [AssignmentController::class, 'update']);
        Route::delete('/assignments/{assignment}', [AssignmentController::class, 'destroy']);
        Route::get('/assignments/{assignment}/submissions', [AssignmentController::class, 'getSubmissions']);
        Route::put('/assignments/{assignment}/grade/{submission}', [AssignmentController::class, 'grade']);

        Route::post('/schedules', [ScheduleController::class, 'store']);
    });

    // ── Admin only ──
    Route::middleware(['role:admin', 'not_banned'])->group(function () {
        
        // Dashboard Stats
        Route::middleware('throttle:60,1')->group(function () {
            Route::get('/admin/stats',              [AdminController::class, 'stats']);
            Route::get('/admin/revenue',            [AdminController::class, 'revenue']);
            Route::get('/admin/recent-enrollments', [AdminController::class, 'recentEnrollments']);
            Route::get('/consultations',            [ConsultationController::class, 'index']);
            Route::get('/admin/users',              [\App\Http\Controllers\AdminUserController::class, 'index']);
            Route::get('/admin/courses',            [\App\Http\Controllers\AdminCourseController::class, 'index']);
            Route::get('/admin/courses/{id}/performance', [\App\Http\Controllers\AdminCourseController::class, 'performance']);
            Route::get('/admin/job-applications',   [JobApplicationController::class, 'index']);
            Route::get('/admin/placement-results',   [PlacementController::class, 'index']);
            Route::get('/admin/placement-results/{id}', [PlacementController::class, 'show']);
        });

        // Mutating actions with relaxed rate limiting
        Route::middleware('throttle:30,1')->group(function () {
            Route::put('/consultations/{id}',       [ConsultationController::class, 'update']);
            Route::post('/admin/users',             [\App\Http\Controllers\AdminUserController::class, 'store']);
            Route::put('/admin/users/{id}/role',    [\App\Http\Controllers\AdminUserController::class, 'updateRole']);
            Route::put('/admin/job-applications/{id}', [JobApplicationController::class, 'update']);
            Route::delete('/admin/job-applications/{id}', [JobApplicationController::class, 'destroy']);
        });

        // Danger actions with strict rate limiting
        Route::middleware('throttle:15,1')->group(function () {
            Route::put('/admin/users/{id}/ban',      [\App\Http\Controllers\AdminUserController::class, 'toggleBan']);
            Route::delete('/admin/users/{id}',       [\App\Http\Controllers\AdminUserController::class, 'destroy']);
            Route::post('/admin/users/{id}/restore', [\App\Http\Controllers\AdminUserController::class, 'restore']);
            
            // Enrollment management
            Route::get('/admin/users/{id}/enrollments', [\App\Http\Controllers\AdminUserController::class, 'getEnrollments']);
            Route::post('/admin/users/{id}/enroll',     [\App\Http\Controllers\AdminUserController::class, 'enrollUser']);
            Route::delete('/admin/users/{id}/enroll/{courseId}', [\App\Http\Controllers\AdminUserController::class, 'unenrollUser']);

            Route::post('/admin/users/bulk-ban',     [\App\Http\Controllers\AdminUserController::class, 'bulkBan']);
            Route::post('/admin/users/bulk-delete',  [\App\Http\Controllers\AdminUserController::class, 'bulkDelete']);
            Route::delete('/admin/courses/{id}',     [\App\Http\Controllers\AdminCourseController::class, 'destroy']);
        });
    });
});
