<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    /**
     * POST /api/upload/submission — Student: upload assignment file
     * Max: 20MB | Allowed: pdf, doc, docx, zip, rar, jpg, png, mp3
     */
    public function uploadSubmission(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480|mimes:pdf,doc,docx,zip,rar,jpg,jpeg,png,mp3,mp4',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();

        // Store in: storage/app/public/submissions/{user_id}/filename
        $path = $file->storeAs(
            'submissions/' . $request->user()->id,
            time() . '_' . $originalName,
            'public'
        );

        return response()->json([
            'message'   => 'Tải tệp thành công!',
            'file_path' => $path,
            'file_name' => $originalName,
            'file_url'  => url('storage/' . $path),
        ]);
    }

    /**
     * POST /api/upload/lesson-media — Teacher/Admin: upload video or PDF for lesson
     * Max: 200MB for video, 20MB for documents
     */
    public function uploadLessonMedia(Request $request)
    {
        $request->validate([
            'file'      => 'required|file|max:204800',
            'type'      => 'required|in:video,material',
            'course_id' => 'required|integer',
        ]);

        $file = $request->file('file');
        $type = $request->input('type');
        $courseId = $request->input('course_id');
        $originalName = $file->getClientOriginalName();

        // Validate file types
        $allowedVideo = ['mp4', 'webm', 'mov', 'avi'];
        $allowedDocs  = ['pdf', 'doc', 'docx', 'pptx', 'xlsx', 'zip'];

        $ext = strtolower($file->getClientOriginalExtension());

        if ($type === 'video' && !in_array($ext, $allowedVideo)) {
            return response()->json([
                'message' => 'Chỉ chấp nhận video định dạng: ' . implode(', ', $allowedVideo),
            ], 422);
        }

        if ($type === 'material' && !in_array($ext, $allowedDocs)) {
            return response()->json([
                'message' => 'Chỉ chấp nhận tài liệu định dạng: ' . implode(', ', $allowedDocs),
            ], 422);
        }

        // Store in: storage/app/public/courses/{course_id}/{type}/filename
        $folder = "courses/{$courseId}/{$type}s";
        $path = $file->storeAs(
            $folder,
            time() . '_' . $originalName,
            'public'
        );

        return response()->json([
            'message'   => 'Tải lên thành công!',
            'file_path' => $path,
            'file_name' => $originalName,
            'file_url'  => url('storage/' . $path),
        ]);
    }
}
