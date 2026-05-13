# 🐝 BEELEARN: High-Performance LMS for English Centers

> **Hệ thống quản lý học tập (LMS) cao cấp — Nền tảng chinh phục Tiếng Anh toàn diện.**

BeeLearn là giải pháp Monorepo hiện đại kết hợp sức mạnh của **Laravel 12 (Backend)** và **React 19 (Frontend)**, được thiết kế chuyên biệt cho các trung tâm Anh ngữ quy mô lớn, tập trung vào trải nghiệm người dùng (UX) và tính cá nhân hóa lộ trình học tập.

---

## 🎨 Design Philosophy
- **Premium Aesthetics**: Giao diện mang đậm chất hiện đại với Glassmorphism, Dynamic Animations (Framer Motion) và hiệu ứng chuyển cảnh mượt mà.
- **Role-Based Experience**: Mỗi người dùng (Admin, Teacher, Student) đều có một Dashboard riêng biệt, tối ưu cho nhu cầu cụ thể.
- **Interactive Learning**: Các thẻ bài học được "game hóa" với streak, biểu đồ radar kỹ năng và theo dõi tiến độ thời gian thực.
- **AI-Powered**: Tích hợp Google Gemini AI cho trợ lý ảo BeeBot và hệ thống kiểm tra trình độ thông minh.

---

## 🏗️ Architecture & Structure

```text
eng_project/
├── .gitignore                ← Cấu hình bảo mật Root
├── README.md                 ← Tài liệu chính (file này)
├── beelearn_backup.sql       ← Bản sao lưu Database (cập nhật 13/05/2026)
├── export_db.bat             ← Script export DB nhanh
├── docs/                     ← Tài liệu hệ thống
│   ├── ARCHITECTURE.md
│   ├── FEATURE_REVIEW.md
│   ├── RBAC_WORKFLOW.md          ← Sơ đồ phân quyền & workflow
│   ├── PROJECT_STATUS_SUMMARY.md
│   └── TESTING_ACCOUNTS.md
├── frontend/                 ← React 19 + TypeScript
│   ├── src/
│   │   ├── components/       ← AuthContext, BeeBotChat, Navbar, Footer, ...
│   │   ├── pages/
│   │   │   ├── auth/         ← Login, Register, Unauthorized
│   │   │   ├── public/       ← Landing, About, Careers, PlacementTest
│   │   │   ├── dashboard/    ← Student/Teacher Dashboard, Notifications
│   │   │   ├── admin/        ← Admin Overview, Users, Courses, Placement, Recruitment
│   │   │   ├── courses/      ← Discovery, Detail, Lesson, Quiz, Create
│   │   │   └── features/     ← Assignments, Schedule, Settings, Achievements
│   │   ├── data/             ← 10 bộ đề Placement Test (placementQuestions)
│   │   └── lib/              ← Fetch API Client (api.ts)
└── backend/                  ← Laravel 12 (REST API)
    ├── app/
    │   ├── Http/Controllers/ ← 18 Controllers
    │   ├── Models/           ← 21 Eloquent Models
    │   ├── Services/         ← GeminiService (AI multi-key rotation)
    │   └── Middleware/       ← CheckRole, CheckIfNotBanned
    ├── config/gemini.php     ← Cấu hình BeeBot AI & System Prompt
    ├── database/             ← Migrations & Seeders → MySQL (XAMPP)
    └── routes/api.php        ← ~90 API Endpoints
```

---

## 🚀 Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion |
| **Backend** | PHP 8.2, Laravel 12, Sanctum, Eloquent ORM |
| **Database** | MySQL / MariaDB 10.4 (XAMPP, cổng 3306) |
| **AI Engine** | Google Gemini API (multi-key rotation, fallback tự động) |
| **UX/UI** | Lucide Icons, Glassmorphic CSS, Cinema Mode Video Player |
| **Media** | Secure Internal Hosting (Public Disk), HTML5 Custom Player |

---

## 📊 Database Overview

| Bảng | Số bản ghi | Mô tả |
|---|---|---|
| `users` | 155 | 1 Admin, 4 Teachers, 150 Students |
| `courses` | 8 | 3 nhóm: THPT QG, IELTS, Người đi làm |
| `lessons` | 63 | 4 loại: Video, Document, Quiz, Assignment |
| `enrollments` | 300 | Lượt đăng ký khóa học |
| `placement_results` | 82 | Kết quả kiểm tra trình độ AI |
| `notifications` | 101 | Thông báo hệ thống |
| `assignments` | 8 | Bài tập về nhà |
| `submissions` | 10 | Bài nộp từ học viên |

> Tổng cộng **30 bảng** trong cơ sở dữ liệu. File backup: `beelearn_backup.sql` (~725 KB).

---

## 🛠️ Hướng dẫn cài đặt chi tiết

> Hướng dẫn này dành cho việc cài đặt BeeLearn trên **máy mới hoàn toàn** (Windows 10/11). Nếu máy đã có sẵn XAMPP, Composer, Node.js thì bỏ qua Bước 1.

### Bước 1️⃣ — Cài đặt phần mềm yêu cầu

Cần cài đặt **3 phần mềm** theo thứ tự sau:

#### 1.1. XAMPP (MySQL + PHP)
- Tải về tại: https://www.apachefriends.org/download.html
- Chọn phiên bản **XAMPP for Windows** (PHP 8.2+)
- Cài đặt vào đường dẫn mặc định: `C:\xampp`
- Khi cài, chỉ cần tích chọn **MySQL** và **PHP** (các thành phần khác không bắt buộc)

#### 1.2. Composer (PHP Package Manager)
- Tải về tại: https://getcomposer.org/download/
- Chạy file **Composer-Setup.exe**, chọn đường dẫn PHP: `C:\xampp\php\php.exe`
- Kiểm tra cài đặt thành công:
  ```powershell
  composer --version
  # Kết quả mong đợi: Composer version 2.x.x ...
  ```

#### 1.3. Node.js (JavaScript Runtime)
- Tải về tại: https://nodejs.org/ — chọn phiên bản **LTS** (≥ 18)
- Cài đặt mặc định (Next → Next → Finish)
- Kiểm tra cài đặt thành công:
  ```powershell
  node --version
  # Kết quả mong đợi: v18.x.x hoặc cao hơn

  npm --version
  # Kết quả mong đợi: 9.x.x hoặc cao hơn
  ```

> ⚠️ **Sau khi cài xong cả 3 phần mềm**, đóng và mở lại PowerShell/CMD để các lệnh có hiệu lực.

---

### Bước 2️⃣ — Khởi động MySQL (XAMPP)

1. Mở **XAMPP Control Panel** (tìm trong Start Menu hoặc chạy `C:\xampp\xampp-control.exe`)
2. Nhấn nút **Start** bên cạnh **MySQL**
3. Khi cột "PID(s)" và "Port(s)" hiển thị số (ví dụ: `3306`), MySQL đã chạy thành công

**❌ Xử lý lỗi thường gặp:**

| Lỗi | Nguyên nhân | Cách xử lý |
|-----|------------|------------|
| "Port 3306 in use" | MySQL 8 đã chạy sẵn trên máy | Mở PowerShell **Admin** → chạy `net stop MySQL80` → Start lại |
| "MySQL shutdown unexpectedly" | Dữ liệu cũ bị hỏng | Xóa thư mục `C:\xampp\mysql\data\` → Mở CMD → chạy `C:\xampp\mysql\bin\mysql_install_db.exe` |
| XAMPP không mở được | Thiếu quyền Admin | Click phải → "Run as Administrator" |

---

### Bước 3️⃣ — Tạo Database

Mở **PowerShell** (nhấn `Win + X` → chọn "Windows PowerShell") và chạy lệnh sau:

```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS beelearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Kiểm tra database đã tạo thành công:
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "SHOW DATABASES;" | Select-String "beelearn"
```
Nếu hiện ra dòng `beelearn` là thành công.

> **Lưu ý:** XAMPP MySQL mặc định tài khoản `root` **không có mật khẩu**.

---

### Bước 4️⃣ — Cài đặt Backend (Laravel — Cổng 8000)

Mở PowerShell, di chuyển vào thư mục project và chạy **lần lượt từng lệnh**:

```powershell
# 4.1 — Di chuyển vào thư mục backend
cd C:\đường_dẫn_tới_project\eng_project\backend

# 4.2 — Cài đặt thư viện PHP (chờ 1-2 phút)
composer install

# 4.3 — Tạo file cấu hình từ mẫu
copy .env.example .env

# 4.4 — Tạo khóa bảo mật ứng dụng (BẮT BUỘC)
php artisan key:generate

# 4.5 — Tạo liên kết thư mục lưu trữ file (video, ảnh, tài liệu)
php artisan storage:link
```

> ⚠️ **Quan trọng:** Bước 4.4 (`key:generate`) là **bắt buộc**. Nếu bỏ qua, hệ thống sẽ không thể đăng nhập hoặc mã hóa dữ liệu.

#### 4.6 — Khôi phục Database từ bản sao lưu

Để nạp toàn bộ dữ liệu mẫu (155 user, 8 khóa học, 63 bài giảng...), chạy lệnh sau (**vẫn đang ở trong thư mục `backend`**):

```powershell
cmd.exe /c "C:\xampp\mysql\bin\mysql.exe -u root beelearn < ..\beelearn_backup.sql"
```

Kiểm tra dữ liệu đã nạp thành công:
```powershell
& "C:\xampp\mysql\bin\mysql.exe" -u root -e "SELECT COUNT(*) AS so_user FROM beelearn.users;"
# Kết quả mong đợi: 155
```

> **Lưu ý:** Nếu muốn tạo dữ liệu mẫu từ đầu (không dùng backup), chạy lệnh thay thế:
> ```powershell
> php artisan migrate:fresh --seed
> ```

#### 4.7 — Cấu hình BeeBot AI & Placement Test AI (Tùy chọn)

Mở file `backend/.env` bằng trình soạn thảo bất kỳ (Notepad, VS Code...), kéo xuống cuối file và sửa 2 dòng sau:

```env
# BeeBot AI — Chatbot tư vấn khóa học (hỗ trợ nhiều key, tự động xoay vòng)
GEMINI_API_KEYS=paste_api_key_vào_đây

# Placement Test AI — Đánh giá trình độ tự động (pool key riêng)
GEMINI_PLACEMENT_KEYS=paste_api_key_vào_đây
```

**Cách lấy API Key miễn phí:**
1. Truy cập https://aistudio.google.com/apikey
2. Đăng nhập bằng tài khoản Google
3. Nhấn "Create API Key" → Copy key
4. Dán vào file `.env` ở trên

> **Nếu có nhiều key**, ngăn cách bằng dấu phẩy (không có khoảng trắng):
> ```
> GEMINI_API_KEYS=key1,key2,key3
> ```
> **Nếu không có key:** BeeBot chatbot sẽ báo "đang bảo trì", Placement Test sẽ dùng logic phân tích local (vẫn hoạt động, chỉ không có nhận xét AI).

#### 4.8 — Khởi động Backend Server

```powershell
php artisan serve
```

Khi thấy dòng `INFO  Server running on [http://127.0.0.1:8000]` là Backend đã chạy thành công.

> **Giữ cửa sổ này mở** — không đóng! Mở thêm cửa sổ PowerShell mới cho bước tiếp theo.

---

### Bước 5️⃣ — Cài đặt Frontend (React — Cổng 5173)

Mở **một cửa sổ PowerShell mới** (giữ nguyên cửa sổ backend ở bước trên) và chạy:

```powershell
# 5.1 — Di chuyển vào thư mục frontend
cd C:\đường_dẫn_tới_project\eng_project\frontend

# 5.2 — Cài đặt thư viện JavaScript (chờ 1-3 phút)
npm install

# 5.3 — Khởi động Frontend
npm run dev
```

Khi thấy dòng `Local: http://localhost:5173/` là Frontend đã chạy thành công.

---

### Bước 6️⃣ — Truy cập & Kiểm tra

Mở trình duyệt web (Chrome, Edge, Firefox...) và truy cập:

| Địa chỉ | Mô tả |
|----------|--------|
| http://localhost:5173 | 🌐 **Trang chủ BeeLearn** (giao diện chính) |
| http://localhost:8000/api/courses | 🔌 **API Backend** (kiểm tra Backend hoạt động) |
| http://localhost:5173/placement-test | 📝 **Bài kiểm tra trình độ AI** |

**Đăng nhập thử:**
- Email: `admin@beelearn.vn` — Mật khẩu: `password` (Quyền Admin)
- Email: `teacher@beelearn.vn` — Mật khẩu: `password` (Quyền Giáo viên)
- Email: `student@beelearn.vn` — Mật khẩu: `password` (Quyền Học sinh)

---

### 📌 Tóm tắt nhanh (Quick Reference)

Sau khi đã cài đặt xong lần đầu, các lần sau chỉ cần chạy **3 bước**:

```powershell
# Terminal 1 — Bật MySQL
# Mở XAMPP Control Panel → Start MySQL

# Terminal 2 — Bật Backend
cd C:\đường_dẫn_tới_project\eng_project\backend
php artisan serve

# Terminal 3 — Bật Frontend
cd C:\đường_dẫn_tới_project\eng_project\frontend
npm run dev
```

Sau đó mở trình duyệt → http://localhost:5173

---

### 🔧 Xử lý sự cố thường gặp

| Hiện tượng | Nguyên nhân | Cách xử lý |
|------------|------------|------------|
| Trang trắng khi truy cập `localhost:5173` | Frontend chưa chạy | Kiểm tra terminal frontend, chạy `npm run dev` |
| Lỗi "CORS" hoặc "Network Error" | Backend chưa chạy | Kiểm tra terminal backend, chạy `php artisan serve` |
| Đăng nhập sai mật khẩu | Dùng mật khẩu khác `password` | Tất cả tài khoản demo dùng: `password` |
| Lỗi "SQLSTATE[HY000]" | MySQL chưa bật hoặc DB chưa tạo | Bật MySQL trong XAMPP, chạy lại Bước 3 |
| BeeBot báo "đang bảo trì" | Chưa cấu hình `GEMINI_API_KEYS` | Xem Bước 4.7 để thêm API Key |
| `composer install` báo lỗi | PHP chưa có trong PATH | Thêm `C:\xampp\php` vào biến môi trường PATH |
| `npm` không nhận lệnh | Node.js chưa cài hoặc chưa restart terminal | Cài Node.js (Bước 1.3), đóng mở lại PowerShell |

---

### 💾 Sao lưu & Khôi phục Database

#### Export (Sao lưu dữ liệu hiện tại)
Chạy file `export_db.bat` ở thư mục gốc project (click đúp), hoặc chạy lệnh:
```powershell
C:\xampp\mysql\bin\mysqldump.exe -u root beelearn > C:\đường_dẫn_tới_project\eng_project\beelearn_backup.sql
```

#### Import (Khôi phục từ file backup)
```powershell
cmd.exe /c "C:\xampp\mysql\bin\mysql.exe -u root beelearn < C:\đường_dẫn_tới_project\eng_project\beelearn_backup.sql"
```

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
- **Quản lý người dùng**: Tạo/xóa/ban user, gán role, quản lý enrollment hàng loạt.
- **Quản lý tuyển dụng**: Xem và xử lý đơn ứng tuyển giáo viên.
- **Phân tích Placement Test**: Dashboard thống kê kết quả kiểm tra trình độ, filter theo đối tượng/level.

### 🤖 Trợ lý ảo BeeBot (AI Chatbot)
- **Tư vấn khóa học**: Tự động gợi ý khóa học phù hợp dựa trên mục tiêu và trình độ.
- **Giải đáp kiến thức**: Hỗ trợ ngữ pháp, từ vựng, phát âm tiếng Anh.
- **Đa ngôn ngữ**: Tự động phát hiện và trả lời bằng ngôn ngữ của người dùng (Việt/Anh).
- **Multi-key rotation**: Tự động xoay API key khi hết quota, đảm bảo hoạt động liên tục.

### 📝 Kiểm tra trình độ thông minh (AI Placement Test)
- **10 bộ đề ngẫu nhiên**: 20 câu/bộ, chia 3 kỹ năng (Grammar, Vocabulary, Reading) với 3 mức độ (Easy, Medium, Hard).
- **Wizard 4 bước**: Welcome → Profile (chọn đối tượng/trình độ) → Quiz → Result.
- **AI Analysis**: Gemini phân tích kết quả, đưa ra nhận xét cá nhân hóa, điểm mạnh/yếu, và gợi ý khóa học.
- **Fallback thông minh**: Nếu AI lỗi, hệ thống tự động dùng logic phân tích local.

---

## 📋 Tài khoản Demo

Tất cả tài khoản sử dụng mật khẩu: `password`

| Email | Vai trò | Mô tả |
|---|---|---|
| `admin@beelearn.vn` | Admin | Quản trị & Tạo khóa học |
| `teacher@beelearn.vn` | Teacher | Upload bài giảng & Chấm bài |
| `student@beelearn.vn` | Student | Trải nghiệm học Premium Cinema Mode |

> Xem đầy đủ danh sách tài khoản demo tại [`docs/TESTING_ACCOUNTS.md`](docs/TESTING_ACCOUNTS.md).

---

## 📈 Trạng thái & Lộ trình (Project Roadmap)

### ✅ Đã hoàn thành
- Kiến trúc 4 Module Bài học (Video, Document, Quiz, Assignment)
- Hệ thống Quiz tương tác với chấm điểm tự động
- Theo dõi tiến độ học tập (Progress Tracking)
- Ghi chú bài học (Notes) & Diễn đàn thảo luận (Discussions)
- Hệ thống Upload file (Submission & Lesson Media)
- Hệ thống thông báo (Notifications API)
- Chuyển đổi Database sang MySQL (XAMPP)
- **Trợ lý ảo BeeBot (Gemini AI) với multi-key rotation**
- **Kiểm tra trình độ thông minh (AI Placement Test) — 10 bộ đề**
- **Admin Analytics Dashboard (Placement Results, Recruitment, Revenue)**
- **Trang Tuyển dụng (Careers) & Đơn ứng tuyển**
- **Legal Pages (Terms of Service & Privacy Policy)**

### ⚠️ Giai đoạn tiếp theo (Next Steps)
1. **Toast Notifications UI**: Chuông thông báo thời gian thực trên giao diện.
2. **Rich Text Editor**: Bộ soạn thảo chuyên nghiệp cho Diễn đàn và Bài luận.
3. **Cổng thanh toán**: Tích hợp VNPAY/MoMo cho quy trình đăng ký khóa học.

---
*Phát triển bởi đội ngũ **BeeLearn Academy** — Nâng tầm giáo dục qua công nghệ.*
