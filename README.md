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
├── docs/                 ← Tài liệu hệ thống (Đã tổ chức lại)
│   ├── ARCHITECTURE.md
│   ├── FEATURE_REVIEW.md
│   └── TESTING_ACCOUNTS.md
├── frontend/             ← React 19 + TypeScript (Đã cleanup)
│   ├── src/
│   │   ├── components/   ← AuthContext, BeeDecoration, MainLayout
│   │   ├── pages/        ← 5 Subfolders (auth, public, dashboard, courses, features)
│   │   └── data/         ← Static Course configuration
└── backend/              ← Laravel 12 (Đã bảo mật database)
    ├── app/
    ├── database/         ← SQLite database (Gitignored)
    └── routes/

```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion |
| **Backend** | PHP 8.2, Laravel 12, Sanctum, Eloquent ORM, SQLite |
| **UX/UI** | Lucide Icons, Glassmorphic CSS, Cinema Mode Video Player |
| **Media** | Secure Internal Hosting (Public Disk), HTML5 Custom Player |
| **AI Integration** | Google Gemini (Backend analysis & content generation) |

---

## 🛠️ Hướng dẫn cài đặt (Specific Setup)

### 1️⃣ Frontend Setup (Cổng 3000)
```bash
cd frontend
npm install
npm run dev                      
```

### 2️⃣ Backend Setup (Cổng 8000)
```bash
cd backend
composer install
# Quan trọng: Chạy migrate để áp dụng bảng Media & Notifications mới
php artisan migrate --seed  
php artisan storage:link
php artisan serve                
```

---

## 🌟 Tính năng chi tiết (Role-Based Features)

### 👨‍🎓 Dành cho Học sinh (Student)
- **Premium Learning Area**: Trình phát video chuyên nghiệp với Cinema Mode, sidebar bài học và quản lý tài liệu PDF.
- **Hồ sơ năng lực (Radar Chart)**: Tự động phân tích kỹ năng dựa trên kết quả bài tập.
- **Nộp bài tập (FileUpload)**: Hệ thống nộp file chuyên sâu (PDF, DOCX, ZIP) với Drag & Drop và Progress Bar.
- **Lịch học thông minh**: Nhắc lịch các buổi Live Session hoặc lớp học trực tiếp.

### 👩‍🏫 Dành cho Giáo viên (Teacher)
- **Quản lý học liệu**: Giao diện Upload video/tài liệu bài giảng trực tiếp qua Dashboard.
- **Hồ sơ chuyên gia**: Hiển thị bằng cấp (PhD/Master) và chứng chỉ IELTS 9.0/C2.
- **Chấm bài & Phản hồi**: Quy trình chấm điểm tập trung dựa trên tệp tin nộp của học viên.

### 🛡️ Dành cho Quản trị viên (Admin)
- **Quản trị Khóa học**: Khởi tạo khóa học mới qua Form API (Tên, Danh mục, Giá, Mô tả).
- **Trung tâm điều hành**: Thống kê doanh thu thực tế và báo cáo hiệu suất giảng dạy.

---

## 🎓 Học thuật & Chuyên môn (Academic Focus)

### 🏆 Đội ngũ Giảng viên Tinh hoa
Hệ thống sử dụng hồ sơ giảng viên thực tế với trình độ vượt trội:
- **Tiến sĩ (PhD)** từ các ĐH danh giá: Cambridge (Anh), NUS (Singapore).
- **Thạc sĩ (Master)** từ: Oxford (Anh), Melbourne (Úc).
- **Chứng chỉ**: 100% sở hữu IELTS 8.5 - 9.0 hoặc C2 Proficiency.

### 📚 Danh mục khóa học Trọng tâm
- **THPT Quốc Gia**: "Chuyên sâu 12 - Mục tiêu 9+" và "Luyện đề cấp tốc".
- **Chứng chỉ Quốc tế**: "IELTS Mastery 8.0+ (Chinh phục đỉnh cao)".
- **Kỹ năng nghề nghiệp**: "Tiếng Anh Công sở (Professional Communication)".

---

## 📋 Tài khoản Demo (Demo Credentials)

| Email | Mật khẩu | Vai trò | Mô tả |
|---|---|---|---|
| `admin@beelearn.vn` | `password` | Admin | Quản trị & Tạo khóa học qua API |
| `teacher@beelearn.vn` | `password` | Teacher | Upload bài giảng & Chấm bài |
| `student@beelearn.vn` | `password` | Student | Trải nghiệm học Premium Cinema Mode |

---

## 📈 Trạng thái & Lộ trình (Project Roadmap)

### ✅ Giai đoạn đã hoàn thành (Phase 1-11)
*   **Kiến trúc 4 Module Bài học**: Đã triển khai đầy đủ màn hình tối ưu cho Video Player HTML5, Hiển thị tài liệu (Documents), Máy chấm trắc nghiệm tự động (Interactive Quizzes), và UI Nộp bài (Assignments File Upload).
*   **Hệ thống Quiz Tương tác**: Đã hoàn thiện Parser đọc file text băm đáp án và tự động cấu hình cơ sở dữ liệu.
*   **Theo dõi Tiến độ**: API Endpoint lưu quá trình tương tự Udemy. Module Ghi chú và Diễn đàn 1-1 với kho khóa học.
*   **File Management**: Hệ thống API File độc lập, lưu trữ nội bộ bảo mật có link Storage cục bộ.

### ⚠️ Giai đoạn tiếp theo (Next Steps)
1.  **UI/UX Mức cảnh báo**: Gắn Toast Notifications cải thiện UX và UI chuông thả xuống (Backend đã xong database).
2.  **Rich Text Editor**: Sử dụng bộ soạn thảo chuyên nghiệp thay thế Textarea trong phần Diễn đàn và Bài luận sinh viên.
3.  **Sanitization & Rate Limit**: Gắn HTMLPurifier và Laravel throttle chống tấn công Spam vào Database.
4.  **Micro-Service Video**: Tách riêng Server Video cho mạng truyền hình tương lai (Production scale).

---
*Phát triển bởi đội ngũ **BeeLearn Academy** — Nâng tầm giáo dục qua công nghệ.*
