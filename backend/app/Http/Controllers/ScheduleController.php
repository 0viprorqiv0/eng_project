<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
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
            'title'        => 'required|string|max:255',
            'location'     => 'nullable|string|max:255',
            'time_slot'    => 'required|string|max:50',
            'day_of_week'  => 'required|integer|min:0|max:6',
            'color'        => 'nullable|string|max:30',
            'type'         => 'nullable|in:live,offline,recorded',
            'max_students' => 'nullable|integer|min:1',
            'start_date'   => 'nullable|date',
            'end_date'     => 'nullable|date',
        ]);

        $schedule = Schedule::create([
            ...$validated,
            'teacher_id' => $request->user()->id,
        ]);

        return response()->json($schedule, 201);
    }
}
