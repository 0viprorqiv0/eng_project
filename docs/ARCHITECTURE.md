# Kiến trúc Hệ thống BeeLearn LMS (Architecture)

Tài liệu này cung cấp cái nhìn tổng quan về luồng dữ liệu, cấu trúc thư mục, và các quyết định kỹ thuật cốt lõi tạo nên hệ thống BeeLearn LMS.

## 1. Tổng quan Monorepo
Dự án được xây dựng trên một kho lưu trữ duy nhất (Monorepo) để dễ dàng chia sẻ file và deploy, đảm bảo Frontend tĩnh và Backend API được đồng bộ phiên bản cùng lúc.

- **Frontend**: Khởi tạo bằng `Vite`, React 19, TypeScript, TailwindCSS 4.
- **Backend**: Khởi tạo bằng `Laravel 12`, PHP 8.2, SQLite phục vụ cho khâu R&D.

---

## 2. Cấu trúc Frontend (React)

Tất cả code nguồn xử lý giao diện nằm trong `eng_project/frontend/src`. Cấu trúc tuân theo chuẩn phân tầng theo tính năng:

```text
src/
├── components/         # Chứa các mảnh UI tái sử dụng (Button, Modal, AuthContext, Navbar)
├── lib/                # Cài đặt Axios Interceptor, tích hợp Token Authorization (api.ts)
├── pages/              # Các route chính - Phân chia rành mạch 5 mảng:
│   ├── auth/           # Login, Register
│   ├── courses/        # CourseList, CourseDetail, LessonPage, QuizPage
│   ├── dashboard/      # AdminDashboard, TeacherDashboard
│   ├── public/         # LandingPage, About
│   └── features/       # (Tương lai) Các công cụ ngoại vi
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

```text
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php      # Xác thực người dùng (Login/Register/Logout)
│   │   ├── CourseController.php    # API tạo/đọc/sửa thông tin Khoá học
│   │   ├── LessonController.php    # Quản trị Bài giảng, Quản Trị Tiến độ học, Ghi chú
│   │   └── UploadController.php    # Helper xử lý file lên Storage Public
│   └── Middleware/
│       └── HandleCors.php          # Bắt buộc Cấu hình để Frontend gọi qua 127.0.0.1
├── Models/
│   ├── User.php
│   ├── Course.php
│   ├── Lesson.php                  # Chứa mảng `$casts['questions_data'] => 'array'` xử lý Quiz
│   ├── Progress.php
│   └── Note.php
```

### Bảo mật API (Sanctum Auth)
Toàn bộ hệ thống kiểm duyệt qua Laravel Sanctum:
- Frontend sau khi đăng nhập nhận về `token`.
- Token được đưa vào Header `Authorization: Bearer {token}` cho mọi API GET/POST.
- `routes/api.php` đóng gói Route vào cụm `middleware('auth:sanctum')`.
- Ràng buộc phân quyền tại Controller thông qua check Role `$request->user()->role`.

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
- **Tiện ích Parser**: Hệ thống backend có File script chuyên biệt để đọc cấu trúc Text thuần chuyển JSON cấp tốc mỗi khi import Câu hỏi mới.
