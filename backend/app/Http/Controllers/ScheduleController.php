<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use App\Models\Notification;
use App\Models\Enrollment;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * GET /api/schedules — Role-adaptive weekly schedule
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->isTeacher()) {
            return $this->teacherSchedule($user);
        }

        if ($user->isAdmin()) {
            return $this->adminSchedule();
        }

        return $this->studentSchedule($user);
    }

    private function teacherSchedule($user)
    {
        $schedules = Schedule::where('teacher_id', $user->id)
            ->with('course:id,title')
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->get()
            ->map(fn ($s) => [
                'id'       => $s->id,
                'time'     => $s->time_slot,
                'title'    => $s->title,
                'location' => $s->location,
                'students' => $s->course->enrollments()->count(),
                'color'    => $s->color,
                'day'      => $s->day_of_week,
                'type'     => $s->type,
            ]);

        return response()->json($schedules);
    }

    private function studentSchedule($user)
    {
        $enrolledCourseIds = $user->enrollments()->pluck('course_id');

        $schedules = Schedule::whereIn('course_id', $enrolledCourseIds)
            ->with(['course:id,title', 'teacher:id,name'])
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->get()
            ->map(fn ($s) => [
                'id'         => $s->id,
                'time'       => $s->time_slot,
                'title'      => $s->title,
                'instructor' => $s->teacher->name,
                'location'   => $s->location,
                'color'      => $s->color,
                'day'        => $s->day_of_week,
                'type'       => $s->type,
            ]);

        return response()->json($schedules);
    }

    private function adminSchedule()
    {
        $schedules = Schedule::with(['course:id,title', 'teacher:id,name'])
            ->orderBy('day_of_week')
            ->orderBy('time_slot')
            ->get()
            ->map(fn ($s) => [
                'id'         => $s->id,
                'time'       => $s->time_slot,
                'title'      => $s->title,
                'instructor' => $s->teacher->name,
                'location'   => $s->location,
                'students'   => $s->course->enrollments()->count(),
                'color'      => $s->color,
                'day'        => $s->day_of_week,
                'type'       => $s->type,
            ]);

        return response()->json($schedules);
    }

    /**
     * POST /api/schedules — Teacher/Admin: create schedule
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'course_id'    => 'required|exists:courses,id',
            'teacher_id'   => 'nullable|exists:users,id',
            'title'        => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'time_slot'    => 'required|string|max:50',
            'day_of_week'  => 'required|integer|min:1|max:7', // 1=Mon, 7=Sun
            'color'        => 'nullable|string|max:30',
            'type'         => 'nullable|in:live,offline,recorded',
            'max_students' => 'nullable|integer|min:1',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date',
        ]);

        $teacherId = $request->user()->isAdmin() && isset($validated['teacher_id']) 
            ? $validated['teacher_id'] 
            : $request->user()->id;

        $schedule = Schedule::create([
            ...$validated,
            'teacher_id' => $teacherId,
        ]);

        // --- Notifications ---
        $courseTitle = $schedule->course->title;
        $dayNum = $schedule->day_of_week;
        $days = [1=>'Thứ 2', 2=>'Thứ 3', 3=>'Thứ 4', 4=>'Thứ 5', 5=>'Thứ 6', 6=>'Thứ 7', 7=>'Chủ Nhật'];
        $dayName = $days[$dayNum] ?? 'N/A';
        
        // 1. Notify Teacher (if Admin created schedule for them)
        if ($request->user()->isAdmin() && $teacherId !== $request->user()->id) {
            Notification::notify(
                $teacherId,
                'schedule',
                'Lịch dạy mới đã được phân công',
                "Bạn có lịch dạy mới cho khóa {$courseTitle} vào {$dayName} ({$schedule->time_slot}).",
                '/dashboard/schedule',
                'calendar_month'
            );
        }

        // 2. Notify all enrolled students
        $studentIds = Enrollment::where('course_id', $schedule->course_id)
            ->where('status', 'active')
            ->pluck('user_id');

        foreach ($studentIds as $sId) {
            Notification::notify(
                $sId,
                'schedule',
                'Lịch học mới đã được cập nhật',
                "Khóa học {$courseTitle} vừa có lịch học mới vào {$dayName} ({$schedule->time_slot}). Hãy kiểm tra ngay!",
                '/dashboard/schedule',
                'event_available'
            );
        }

        return response()->json($schedule, 201);
    }
}
