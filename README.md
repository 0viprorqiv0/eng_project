# 🐝 BEELEARN: High-Performance LMS for English Centers

> **Hệ thống quản lý học tập (LMS) cao cấp — Nền tảng chinh phục Tiếng Anh toàn diện.**

BeeLearn là giải pháp Monorepo hiện đại kết hợp sức mạnh của **Laravel 12 (Backend)** và **React 19 (Frontend)**, được thiết kế chuyên biệt cho các trung tâm Anh ngữ quy mô lớn, tập trung vào trải nghiệm người dùng (UX) và tính cá nhân hóa lộ trình học tập.

---

## 🎨 Design Philosophy
- **Premium Aesthetics**: Giao diện mang đậm chất hiện đại với Glassmorphism, Dynamic Animations (Framer Motion) và hiệu ứng chuyển cảnh mượt mà.
- **Role-Based Experience**: Mỗi người dùng (Admin, Teacher, Student) đều có một Dashboard riêng biệt, tối ưu cho nhu cầu cụ thể.
- **Interactive Learning**: Các thẻ bài học được "game hóa" với streak, biểu đồ radar kỹ năng và theo dõi tiến độ thời gian thực.

---

## 🏗️ Architecture & Structure

```text
eng_project/
├── .gitignore            ← Cấu hình bảo mật Root
├── docs/                 ← Tài liệu hệ thống
│   ├── ARCHITECTURE.md
│   ├── FEATURE_REVIEW.md
│   ├── PROJECT_STATUS_SUMMARY.md
│   └── TESTING_ACCOUNTS.md
├── frontend/             ← React 19 + TypeScript
│   ├── src/
│   │   ├── components/   ← AuthContext, BeeDecoration, MainLayout
│   │   ├── pages/        ← 5 Subfolders (auth, public, dashboard, courses, features)
│   │   └── lib/          ← Axios API Client (api.ts)
└── backend/              ← Laravel 12 (REST API)
    ├── app/              ← Controllers, Models, Middleware
    ├── database/         ← Migrations & Seeders → MySQL (XAMPP)
    └── routes/           ← api.php (125+ API Routes)
```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion |
| **Backend** | PHP 8.2, Laravel 12, Sanctum, Eloquent ORM |
| **Database** | MySQL (XAMPP, cổng 3306) |
| **UX/UI** | Lucide Icons, Glassmorphic CSS, Cinema Mode Video Player |
| **Media** | Secure Internal Hosting (Public Disk), HTML5 Custom Player |

---

## 🛠️ Hướng dẫn cài đặt

### 0️⃣ Yêu cầu hệ thống
- **XAMPP** (đã cài đặt tại `C:\xampp`)
- **Composer** (PHP package manager)
- **Node.js** ≥ 18 + npm

### 1️⃣ Khởi động XAMPP MySQL
1. Mở **XAMPP Control Panel**.
2. Nhấn **Start** bên cạnh **MySQL**.
3. Nếu báo lỗi *"Port 3306 in use"*, tắt MySQL Server bằng lệnh sau (chạy PowerShell với quyền **Admin**):
   ```powershell
   net stop MySQL80
   ```
   Sau đó nhấn **Start** MySQL trong XAMPP lại.

### 2️⃣ Tạo Database
Mở PowerShell và chạy:
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS beelearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```
> **Lưu ý:** XAMPP MySQL mặc định tài khoản `root` **không có mật khẩu**.

### 3️⃣ Backend Setup (Cổng 8000)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

> ⚠️ **Quan trọng:** Phải chạy `php artisan key:generate` **trước khi** `migrate:fresh --seed`. Nếu quên bước này, hệ thống sẽ không thể đăng nhập được.

File `.env.example` đã được cấu hình sẵn cho XAMPP MySQL:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beelearn
DB_USERNAME=root
DB_PASSWORD=
```

### 4️⃣ Frontend Setup (Cổng 5173)
```bash
cd frontend
npm install
npm run dev
```

### 5️⃣ Truy cập ứng dụng
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api

---

## 🌟 Tính năng chi tiết (Role-Based Features)

### 👨‍🎓 Dành cho Học sinh (Student)
- **Premium Learning Area**: Trình phát video chuyên nghiệp với Cinema Mode, sidebar bài học và quản lý tài liệu PDF.
- **Hồ sơ năng lực (Radar Chart)**: Tự động phân tích kỹ năng dựa trên kết quả bài tập.
- **Nộp bài tập (FileUpload)**: Hệ thống nộp file chuyên sâu (PDF, DOCX, ZIP) với Drag & Drop và Progress Bar.
- **Làm bài Quiz tương tác**: Trắc nghiệm tính giờ, tự động chấm điểm, hiển thị kết quả chi tiết.
- **Lịch học thông minh**: Nhắc lịch các buổi Live Session hoặc lớp học trực tiếp.

### 👩‍🏫 Dành cho Giáo viên (Teacher)
- **Quản lý học liệu**: Giao diện Upload video/tài liệu bài giảng trực tiếp qua Dashboard.
- **Tạo bài giảng**: Form tạo 4 loại bài (Video, Document, Quiz, Assignment) kèm cấu hình chi tiết.
- **Chấm bài & Phản hồi**: Quy trình chấm điểm tập trung dựa trên tệp tin nộp của học viên.
- **Quản lý học sinh**: Xem danh sách, tiến độ và điểm trung bình của từng học sinh.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Quản trị Khóa học**: Khởi tạo khóa học mới qua Form API (Tên, Danh mục, Giá, Mô tả).
- **Trung tâm điều hành**: Thống kê doanh thu thực tế và báo cáo hiệu suất giảng dạy.

---

## 📋 Tài khoản Demo

Tất cả tài khoản sử dụng mật khẩu: `password`

| Email | Vai trò | Mô tả |
|---|---|---|
| `admin@beelearn.vn` | Admin | Quản trị & Tạo khóa học |
| `teacher@beelearn.vn` | Teacher | Upload bài giảng & Chấm bài |
| `student@beelearn.vn` | Student | Trải nghiệm học Premium Cinema Mode |

> Xem đầy đủ danh sách 16 tài khoản demo tại [`docs/TESTING_ACCOUNTS.md`](docs/TESTING_ACCOUNTS.md).

---

## 📈 Trạng thái & Lộ trình (Project Roadmap)

### ✅ Đã hoàn thành
- Kiến trúc 4 Module Bài học (Video, Document, Quiz, Assignment)
- Hệ thống Quiz tương tác với chấm điểm tự động
- Theo dõi tiến độ học tập (Progress Tracking)
- Ghi chú bài học (Notes) & Diễn đàn thảo luận (Discussions)
- Hệ thống Upload file (Submission & Lesson Media)
- Hệ thống thông báo (Notifications API)
- **Chuyển đổi Database sang MySQL (XAMPP)**

### ⚠️ Giai đoạn tiếp theo (Next Steps)
1. **Toast Notifications UI**: Chuông thông báo thời gian thực trên giao diện.
2. **Rich Text Editor**: Bộ soạn thảo chuyên nghiệp cho Diễn đàn và Bài luận.
3. **Cổng thanh toán**: Tích hợp VNPAY/MoMo cho quy trình đăng ký khóa học.
4. **Quên mật khẩu**: Luồng reset password qua email SMTP.

---
*Phát triển bởi đội ngũ **BeeLearn Academy** — Nâng tầm giáo dục qua công nghệ.*
