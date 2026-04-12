# Kiến trúc Hệ thống BeeLearn LMS (Architecture)

Tài liệu này cung cấp cái nhìn tổng quan về luồng dữ liệu, cấu trúc thư mục, và các quyết định kỹ thuật cốt lõi tạo nên hệ thống BeeLearn LMS.

## 1. Tổng quan Monorepo
Dự án được xây dựng trên một kho lưu trữ duy nhất (Monorepo) để dễ dàng chia sẻ file và deploy, đảm bảo Frontend tĩnh và Backend API được đồng bộ phiên bản cùng lúc.

- **Frontend**: Khởi tạo bằng `Vite`, React 19, TypeScript, TailwindCSS 4.
- **Backend**: Khởi tạo bằng `Laravel 12`, PHP 8.2.
- **Database**: MySQL (XAMPP, cổng 3306), tài khoản `root` không mật khẩu.

---

## 2. Cấu trúc Frontend (React)

Tất cả code nguồn xử lý giao diện nằm trong `eng_project/frontend/src`. Cấu trúc tuân theo chuẩn phân tầng theo tính năng:

```text
src/
├── components/         # Chứa các mảnh UI tái sử dụng (AuthContext, DashboardLayout, Navbar)
├── lib/                # Cài đặt Axios Interceptor, tích hợp Token Authorization (api.ts)
├── pages/              # Các route chính - Phân chia rành mạch 5 mảng:
│   ├── auth/           # Login, Register, Unauthorized
│   ├── courses/        # CourseDiscovery, CourseIntro, CourseDetail, LessonPage, QuizPage, CreateCourse, CreateLecture
│   ├── dashboard/      # AdminDashboard, TeacherDashboard, StudentDashboard, TeacherStudents
│   ├── public/         # LandingPage, AboutPage, CareersPage
│   └── features/       # Assignments, Schedule, Reports, Settings, Achievements, Library
├── App.tsx             # Cấu hình React Router DOM
└── index.css           # Cấu hình TailwindCSS gốc
```

### Triết lý State Management Frontend
BeeLearn hạn chế sử dụng Redux do kích thước. Thay vào đó, nền tảng sử dụng:
1. **React Context (`AuthContext`)**: Bọc quanh App để chia sẻ Global State của Người dùng `user` (id, role, name, token).
2. **Local State (`useState` / `useEffect`)**: Cho phép các Trang gọi ngay API lấy dữ liệu và render nội dung độc lập nhằm tận dụng tối đa Fetch Tree của React.

---

## 3. Cấu trúc Backend (Laravel)

API được xây dựng khép kín tại `eng_project/backend`.
- Chỉ xuất chuẩn dữ liệu JSON (không dùng Blade Template).
- Sử dụng **Eloquent ORM** cho toàn bộ thao tác Database.
- Database: **MySQL** qua XAMPP (tài khoản `root`, không mật khẩu, database `beelearn`).

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php           # Xác thực (Login/Register/Logout)
│   │   ├── CourseController.php         # CRUD Khóa học + Bài giảng + Quiz Submit
│   │   ├── AssignmentController.php     # CRUD Bài tập + Nộp bài + Chấm điểm
│   │   ├── LessonFeatureController.php  # Progress, Notes, Discussions
│   │   ├── NotificationController.php   # Thông báo CRUD
│   │   ├── FileController.php           # Upload file (Submission + Lesson Media)
│   │   ├── ScheduleController.php       # Lịch học
│   │   ├── ReportsController.php        # Báo cáo & Thống kê
│   │   ├── SettingsController.php       # Cài đặt User & Avatar
│   │   ├── AdminController.php          # Stats & Revenue (Admin only)
│   │   └── StudentController.php        # Stats cho Student & Teacher
│   └── Middleware/
│       └── CheckRole.php                # Phân quyền role:admin, role:teacher,admin
├── Models/
│   ├── User.php                         # HasApiTokens, role helpers
│   ├── Course.php                       # Relationships: teacher, lessons, structures, enrollments
│   ├── Lesson.php                       # JSON cast questions_data, relationship: assignment
│   ├── Assignment.php                   # Relationship: lesson, submissions
│   ├── QuizAttempt.php                  # Lưu kết quả quiz
│   ├── LessonProgress.php              # Đánh dấu hoàn thành bài học
│   ├── LessonNote.php                   # Ghi chú bài học
│   ├── Discussion.php                   # Thảo luận khóa học
│   └── Notification.php                 # Thông báo hệ thống
```

### Bảo mật API (Sanctum Auth)
Toàn bộ hệ thống kiểm duyệt qua Laravel Sanctum:
- Frontend sau khi đăng nhập nhận về `token`.
- Token được đưa vào Header `Authorization: Bearer {token}` cho mọi API GET/POST.
- `routes/api.php` đóng gói Route vào cụm `middleware('auth:sanctum')`.
- Phân quyền 3 cấp qua Middleware `role`: Admin, Teacher, Student.
- Một số endpoint yêu cầu `role:teacher,admin` (chỉ Teacher hoặc Admin mới truy cập được).

---

## 4. Quản trị Tệp Tin (File Storage)
BeeLearn không băm URL của file. Hệ thống trỏ File trực tiếp trên ổ đĩa vật lý của Server.

1. **Nguyên lý Xử lý Video/Tài liệu**:
   - `storage/app/public/lessons/`: Nơi cất giấu 100% video và bài giảng.
   - Khi Sinh viên yêu cầu, Backend nối đường link thông qua alias `http://127.0.0.1:8000/storage/lessons/file.mp4`.
2. **Quyền Lợi Symlink**: 
   - Lệnh `php artisan storage:link` đóng vai trò cốt lõi. Nếu không chạy lệnh, Frontend hoàn toàn mù tịt vì Laravel giấu chặt thư mục `storage` khỏi Internet.

---

## 5. Xử lý Quiz & Assignment (Kiến trúc đặc biệt)
Thay vì tạo bảng `questions` rườm rà (gây phình to DB vì hàng trăm ngàn câu hỏi), dự án nhóm thẳng toàn bộ Data Ngân hàng câu hỏi vào cột `questions_data` của bảng `Lesson`.
- **Định dạng Data**: Text JSON thuần túy dẹp bỏ các vòng lặp JOIN Table nặng nề.
- **Quiz Attempts**: Bảng `quiz_attempts` lưu kết quả làm bài (score, total_questions, answers_data, essay_answers, time_spent).
- **Tiện ích Parser**: Hệ thống backend có File script chuyên biệt để đọc cấu trúc Text thuần chuyển JSON cấp tốc mỗi khi import Câu hỏi mới.

---

## 6. Database Schema (21 Migrations)
| Bảng | Mô tả |
|---|---|
| `users` | Người dùng (Admin, Teacher, Student) |
| `courses` | Khóa học |
| `course_structures` | Lộ trình/Cấu trúc khóa học |
| `lessons` | Bài giảng (Video, Document, Quiz, Assignment) |
| `enrollments` | Đăng ký khóa học |
| `assignments` | Bài tập (liên kết với lesson) |
| `submissions` | Bài nộp của học sinh |
| `quiz_attempts` | Kết quả làm quiz |
| `lesson_progress` | Tiến độ hoàn thành bài học |
| `lesson_notes` | Ghi chú bài học |
| `discussions` | Diễn đàn thảo luận |
| `schedules` | Lịch học |
| `notifications` | Thông báo |
| `personal_access_tokens` | Token Sanctum |
| `user_settings` | Cài đặt người dùng |
