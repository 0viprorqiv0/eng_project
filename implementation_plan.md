# Thêm tính năng Tạo Bài Giảng & Nộp Bài Tập (Liên kết đồng bộ)

Tính năng tạo bài học (lesson) kèm video và nộp bài tập (assignment) hiện đang rời rạc và chưa có UI tạo bài giảng cụ thể cho giáo viên. Dưới đây là kế hoạch chi tiết để hoàn thiện luồng này.

## User Review Required

> [!IMPORTANT]
> - Có cần cho giáo viên tạo nhiều bài tập (assignments) trong 1 bài giảng không, hay **chỉ 1 bài giảng = 1 bài tập tối đa** cho đơn giản? (Trong lộ trình này tôi đề xuất 1 bài giảng có thể đính kèm tối đa 1 bài tập).
> - Hiện tại trang "Chi tiết khóa học" (CourseDetailPage) đang dùng dữ liệu mô phỏng (mock data). Trong kế hoạch này tôi sẽ nâng cấp nó để gọi trực tiếp dữ liệu học từ backend nếu người dùng là giáo viên, và cho phép họ ấn nút **"Thêm bài giảng"** ngay tại đây. Bạn có đồng ý không?

## Proposed Changes

---

### Backend Schema & API
Cập nhật CSDL và bổ sung Endpoint mới để cho phép tạo bài học kèm bài tập.

#### [NEW] `backend/database/migrations/xxxx_xx_xx_xxxxxx_add_lesson_id_to_assignments_table.php`
- Cập nhật bảng `assignments`:
  - Thêm cột `lesson_id` (nullable, foreign key).
  - Điều này giúp hệ thống nhận diện bài tập thuộc về video bài giảng nào (trước đây chỉ gắn chung ở cấp degree/course).

#### [MODIFY] `backend/app/Models/Lesson.php` & `Assignment.php`
- `Lesson.php`: Khai báo quan hệ `hasOne(Assignment::class)`.
- `Assignment.php`: Khai báo quan hệ `belongsTo(Lesson::class)`.

#### [MODIFY] `backend/app/Http/Controllers/CourseController.php`
- Cập nhật thêm hàm `storeLesson(Request $request, Course $course)`:
  - Cho phép Giáo viên/Admin tải lên thông tin bài giảng (`title`, `content`, `video_path` qua endpoint upload riêng).
  - Nhận thêm payload bài tập (nếu có yêu cầu tạo bài tập mảng): `assignment_title`, `max_score`, `due_date`.
  - Nếu có dữ liệu bài tập, tự động tạo assignment và gán `lesson_id` tương ứng với bài giảng vừa tạo.
- Cập nhật hàm `lessonDetail()`:
  - Thêm `$lesson->load('assignment')` để trả về nội dung bài tập kèm với bài giảng gửi xuống phía Frontend.

---

### Frontend: Khung Giao Diện Giáo Viên Tạo Bài Giảng
Giáo viên có thể thêm bài học trực tiếp từ trang chi tiết khóa học.

#### [NEW] `frontend/src/components/CreateLessonModal.tsx`
- Dialog trượt/nổi lên màn hình:
  - **Thông tin cơ bản**: Tiêu đề bài học, Mô tả text.
  - **Upload Video**: Tải tệp lên máy chủ bằng endpoint `POST /api/upload/lesson-media`.
  - **Tùy chọn tạo bài tập**: Nút gạt (Toggle) "Kèm bài tập". Bật lên sẽ hiển thị form: Tên bài tập, Lời khuyên/Hướng dẫn tự luận, Điểm tối đa, Hạn nộp.
  - Dữ liệu gửi đến endpoint `POST /api/courses/{id}/lessons` để tạo đồng bộ.

#### [MODIFY] `frontend/src/pages/courses/CourseDetailPage.tsx`
- Sửa lại tính năng mock data, thực thi lấy danh sách bài học thực tế từ khóa học.
- Nếu `user.role === 'teacher' || 'admin'`, hiển thị nút **[+ Thêm bài giảng]** ở khu vực Sidebar/Lộ trình học. Nút này sẽ mở `CreateLessonModal`.

---

### Frontend: Trải Nghiệm Học Tập Sinh Viên (Học & Nộp Bài)
Kết hợp xem Video và nộp bài vào chung một luồng.

#### [MODIFY] `frontend/src/pages/courses/LessonPage.tsx`
- Dựa trên dữ liệu `lesson.assignment` trả về từ Backend:
  - Cập nhật giao diện tabs bên dưới video: Thay vì chỉ có 'Nội dung chung' & 'Tài liệu', sẽ chia bổ sung tab **"BÀI TẬP VỀ NHÀ"** nếu bài giảng này có bài tập đi kèm.
  - Trong tab "Bài tập", hiển thị mô tả bài tập mà giáo viên đã cung cấp.
  - Tích hợp tính năng Upload File nộp bài (`POST /api/upload/submission` và gọi tiếp API `/api/assignments/{id}/submit` để Nộp). Sau khi sinh viên upload xong, cập nhật trạng thái "Đã nộp bài". Mở khoá bài kế tiếp tự động (logic frontend hiện có).

## Verification Plan

### Automated Tests
- Chạy migrate db và test validation của backend API endpoint tạo bài học (`storeLesson`).

### Manual Verification
1. Đăng nhập làm **Teacher**, vào Khóa học và nhấn **[+ Thêm bài giảng]**.
2. Upload một video clip kèm theo tuỳ chọn "Tạo bài tập định kỳ". Submit form tạo thành công.
3. Đăng xuất, đăng nhập làm **Student**, mở khóa học và xem chính bài giảng đó.
4. Xác minh Video hiện ra đầy đủ, và ở tab "BÀI TẬP", sinh viên thấy đề bài và có khả năng Submit file nộp.
