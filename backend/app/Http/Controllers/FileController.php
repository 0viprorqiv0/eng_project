<?php


namespace App\Http\Controllers;

use Illuminate\Http\Request;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class FileController extends Controller
{
    /**
     * POST /api/upload/submission — Student: upload assignment file
     */
    public function uploadSubmission(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:20480|mimes:pdf,doc,docx,zip,rar,jpg,jpeg,png,mp3,mp4',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();

        // Upload trực tiếp lên Cloudinary vào thư mục submissions
        $uploadedFile = Cloudinary::upload($file->getRealPath(), [
            'folder' => 'beelearn/submissions/' . $request->user()->id,
            'resource_type' => 'auto'
        ]);

        return response()->json([
            'message'   => 'Tải tệp thành công!',
            'file_path' => $uploadedFile->getSecurePath(),
            'file_name' => $originalName,
            'file_url'  => $uploadedFile->getSecurePath(),
        ]);
    }

    /**
     * POST /api/upload/lesson-media — Teacher/Admin: upload video or PDF for lesson
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

        // Upload lên Cloudinary
        $uploadedFile = Cloudinary::upload($file->getRealPath(), [
            'folder' => "beelearn/courses/{$courseId}/{$type}s",
            'resource_type' => 'auto'
        ]);

        return response()->json([
            'message'   => 'Tải lên thành công!',
            'file_path' => $uploadedFile->getSecurePath(),
            'file_name' => $originalName,
            'file_url'  => $uploadedFile->getSecurePath(),
        ]);
    }
}

