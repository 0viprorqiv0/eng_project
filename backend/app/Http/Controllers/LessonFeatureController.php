<?php

namespace App\Http\Controllers;

use App\Models\LessonProgress;
use App\Models\LessonNote;
use App\Models\Discussion;
use App\Models\Lesson;
use App\Models\Course;
use Illuminate\Http\Request;

class LessonFeatureController extends Controller
{
    // ═══════════════════════════════════════════
    //  PROGRESS TRACKING
    // ═══════════════════════════════════════════

    /**
     * GET /api/courses/{courseId}/progress — Get completion status for all lessons
     */
    public function getProgress(Request $request, int $courseId)
    {
        Course::findOrFail($courseId);
        $userId = $request->user()->id;

        $progress = LessonProgress::where('user_id', $userId)
            ->whereHas('lesson', fn ($q) => $q->where('course_id', $courseId))
            ->get()
            ->keyBy('lesson_id')
            ->map(fn ($p) => [
                'completed' => $p->completed,
                'completed_at' => $p->completed_at?->format('d/m/Y H:i'),
            ]);

        return response()->json($progress);
    }

    /**
     * POST /api/lessons/{lessonId}/complete — Mark lesson as completed
     */
    public function markComplete(Request $request, int $lessonId)
    {
        Lesson::findOrFail($lessonId);
        $userId = $request->user()->id;

        $progress = LessonProgress::updateOrCreate(
            ['user_id' => $userId, 'lesson_id' => $lessonId],
            ['completed' => true, 'completed_at' => now()]
        );

        return response()->json([
            'message' => 'Đã đánh dấu hoàn thành!',
            'progress' => $progress,
        ]);
    }

    /**
     * DELETE /api/lessons/{lessonId}/complete — Unmark lesson completion
     */
    public function unmarkComplete(Request $request, int $lessonId)
    {
        Lesson::findOrFail($lessonId);
        LessonProgress::where('user_id', $request->user()->id)
            ->where('lesson_id', $lessonId)
            ->delete();

        return response()->json(['message' => 'Đã bỏ đánh dấu hoàn thành.']);
    }

    // ═══════════════════════════════════════════
    //  NOTES
    // ═══════════════════════════════════════════

    /**
     * GET /api/lessons/{lessonId}/notes — Get user's notes for a lesson
     */
    public function getNotes(Request $request, int $lessonId)
    {
        Lesson::findOrFail($lessonId);
        $notes = LessonNote::where('user_id', $request->user()->id)
            ->where('lesson_id', $lessonId)
            ->orderBy('created_at')
            ->get()
            ->map(fn ($n) => [
                'id' => $n->id,
                'timestamp' => $n->timestamp,
                'content' => $n->content,
                'created_at' => $n->created_at->format('d/m/Y H:i'),
            ]);

        return response()->json($notes);
    }

    /**
     * POST /api/lessons/{lessonId}/notes — Create a note
     */
    public function storeNote(Request $request, int $lessonId)
    {
        Lesson::findOrFail($lessonId);
        $validated = $request->validate([
            'timestamp' => 'nullable|string|max:10',
            'content'   => 'required|string|max:2000',
        ]);

        $note = LessonNote::create([
            'user_id'   => $request->user()->id,
            'lesson_id' => $lessonId,
            'timestamp' => $validated['timestamp'] ?? '00:00',
            'content'   => $validated['content'],
        ]);

        return response()->json([
            'id' => $note->id,
            'timestamp' => $note->timestamp,
            'content' => $note->content,
            'created_at' => $note->created_at->format('d/m/Y H:i'),
        ], 201);
    }

    /**
     * DELETE /api/notes/{noteId} — Delete a note
     */
    public function destroyNote(Request $request, int $noteId)
    {
        $note = LessonNote::where('id', $noteId)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $note->delete();
        return response()->json(['message' => 'Đã xóa ghi chú.']);
    }

    // ═══════════════════════════════════════════
    //  DISCUSSION / FORUM
    // ═══════════════════════════════════════════

    /**
     * GET /api/courses/{courseId}/discussions?lesson_id= — Get discussions
     */
    public function getDiscussions(Request $request, int $courseId)
    {
        Course::findOrFail($courseId);

        $query = Discussion::where('course_id', $courseId)
            ->whereNull('parent_id') // top-level only
            ->with(['user:id,name,avatar_url', 'replies' => fn ($q) => $q->with('user:id,name,avatar_url')->orderBy('created_at')->limit(10)])
            ->withCount('replies')
            ->orderByDesc('created_at');

        if ($request->has('lesson_id')) {
            $query->where('lesson_id', $request->lesson_id);
        }

        $paginated = $query->paginate(20);

        $paginated->through(fn ($d) => [
            'id' => $d->id,
            'author' => $d->user->name,
            'avatar_url' => $d->user->avatar_url,
            'content' => $d->content,
            'date' => $d->created_at->diffForHumans(),
            'replies_count' => $d->replies_count,
            'replies' => $d->replies->map(fn ($r) => [
                'id' => $r->id,
                'author' => $r->user->name,
                'avatar_url' => $r->user->avatar_url,
                'content' => $r->content,
                'date' => $r->created_at->diffForHumans(),
            ]),
        ]);

        return response()->json($paginated);
    }

    /**
     * POST /api/courses/{courseId}/discussions — Create a discussion post
     */
    public function storeDiscussion(Request $request, int $courseId)
    {
        Course::findOrFail($courseId);
        $validated = $request->validate([
            'lesson_id' => 'nullable|exists:lessons,id',
            'parent_id' => 'nullable|exists:discussions,id',
            'content'   => 'required|string|max:5000',
        ]);

        $discussion = Discussion::create([
            'user_id'   => $request->user()->id,
            'course_id' => $courseId,
            'lesson_id' => $validated['lesson_id'] ?? null,
            'parent_id' => $validated['parent_id'] ?? null,
            'content'   => $validated['content'],
        ]);

        $discussion->load('user:id,name,avatar_url');

        return response()->json([
            'id' => $discussion->id,
            'author' => $discussion->user->name,
            'avatar_url' => $discussion->user->avatar_url,
            'content' => $discussion->content,
            'date' => 'Vừa xong',
            'replies_count' => 0,
            'replies' => [],
        ], 201);
    }

    /**
     * DELETE /api/discussions/{id} — Delete a discussion post
     */
    public function destroyDiscussion(Request $request, int $id)
    {
        $discussion = Discussion::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $discussion->delete();
        return response()->json(['message' => 'Đã xóa bài viết.']);
    }
}
