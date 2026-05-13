# 🍏 Hướng dẫn cài đặt BeeLearn trên macOS

> Hướng dẫn này dành cho việc cài đặt hệ thống BeeLearn trên môi trường **macOS (Intel hoặc Apple Silicon M1/M2/M3)**. 
> Trên macOS, cách chuẩn nhất để chạy Laravel & React là sử dụng **Homebrew** để quản lý các dịch vụ (PHP, MySQL, Node.js) thay vì dùng XAMPP.

---

## Bước 1️⃣ — Cài đặt Homebrew và các phần mềm

Mở ứng dụng **Terminal** trên máy Mac và chạy lần lượt các lệnh sau:

### 1.1. Cài đặt Homebrew (nếu chưa có)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
*(Lưu ý: Chạy xong lệnh này, Terminal có thể yêu cầu bạn chạy thêm 2 lệnh nhỏ để thêm Homebrew vào biến môi trường PATH. Hãy làm theo hướng dẫn in trên màn hình Terminal).*

### 1.2. Cài đặt PHP, Composer, Node.js và MySQL
Chạy lệnh sau để cài đặt toàn bộ môi trường cần thiết:
```bash
brew install php@8.2 composer node mysql
```

### 1.3. Khởi động MySQL Service
```bash
brew services start mysql
```

---

## Bước 2️⃣ — Tạo Database

Sau khi MySQL đã chạy, bạn mở Terminal và chạy lệnh sau để tạo database cho dự án:

```bash
mysql -u root -e "CREATE DATABASE IF NOT EXISTS beelearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

> **Lưu ý:** MySQL cài qua Homebrew mặc định tài khoản `root` **không có mật khẩu**.

---

## Bước 3️⃣ — Cài đặt Backend (Laravel — Cổng 8000)

Mở Terminal, di chuyển vào thư mục project và chạy lần lượt:

```bash
# 3.1 — Di chuyển vào thư mục backend (thay đổi đường dẫn cho đúng với máy của bạn)
cd /đường_dẫn_tới_project/eng_project/backend

# 3.2 — Cài đặt thư viện PHP
composer install

# 3.3 — Tạo file cấu hình từ mẫu
cp .env.example .env

# 3.4 — Tạo khóa bảo mật (BẮT BUỘC)
php artisan key:generate

# 3.5 — Tạo liên kết thư mục lưu trữ file
php artisan storage:link
```

### 3.6 — Khôi phục dữ liệu mẫu
Để nạp dữ liệu (users, courses, lessons...) từ bản backup, chạy lệnh sau:
```bash
mysql -u root beelearn < ../beelearn_backup.sql
```

### 3.7 — Cấu hình AI (Tùy chọn)
Mở file `backend/.env` bằng trình soạn thảo (TextEdit, VS Code) và thêm API Key vào cuối file:
```env
# BeeBot AI — Chatbot tư vấn
GEMINI_API_KEYS=paste_api_key_vào_đây

# Placement Test AI — Đánh giá trình độ
GEMINI_PLACEMENT_KEYS=paste_api_key_vào_đây
```

### 3.8 — Khởi động Backend
```bash
php artisan serve
```
Khi thấy dòng `INFO Server running on [http://127.0.0.1:8000]`, backend đã chạy thành công. **Giữ nguyên cửa sổ Terminal này**.

---

## Bước 4️⃣ — Cài đặt Frontend (React — Cổng 5173)

Mở **một cửa sổ Terminal mới** (nhấn `Cmd + T` hoặc mở tab mới) và chạy:

```bash
# 4.1 — Di chuyển vào thư mục frontend
cd /đường_dẫn_tới_project/eng_project/frontend

# 4.2 — Cài đặt thư viện Node.js
npm install

# 4.3 — Khởi động Frontend
npm run dev
```

---

## Bước 5️⃣ — Truy cập Ứng dụng

Mở trình duyệt (Safari, Chrome) và truy cập:

- 🌐 **Trang chủ BeeLearn:** [http://localhost:5173](http://localhost:5173)
- 🔌 **API Backend:** [http://localhost:8000/api/courses](http://localhost:8000/api/courses)

**Tài khoản đăng nhập dùng thử:**
Tất cả đều dùng mật khẩu: `password`
- Admin: `admin@beelearn.vn`
- Giáo viên: `teacher@beelearn.vn`
- Học sinh: `student@beelearn.vn`

---

### 🔧 Xử lý sự cố thường gặp trên macOS

| Lỗi | Cách xử lý |
|---|---|
| `mysql: command not found` | Chạy lệnh `brew link mysql --force` rồi thử lại. |
| `php: command not found` | Chạy lệnh `brew link php@8.2 --force` |
| Lỗi quyền thư mục (Permission Denied) ở Backend | Chạy lệnh: `chmod -R 775 storage bootstrap/cache` trong thư mục backend |
| Không kết nối được Database MySQL | Khởi động lại MySQL bằng lệnh: `brew services restart mysql` |
| Mở nhiều project gây xung đột Port | Tắt các ứng dụng web khác đang chạy (vd: Docker, MAMP, Herd) |

---
### 💡 Tóm tắt lệnh chạy hàng ngày (Daily Workflow)
Mỗi lần mở máy lên code, bạn chỉ cần mở 2 tab Terminal:

**Tab 1 (Backend):**
```bash
cd /đường_dẫn_tới_project/eng_project/backend
php artisan serve
```

**Tab 2 (Frontend):**
```bash
cd /đường_dẫn_tới_project/eng_project/frontend
npm run dev
```
*(Lưu ý: MySQL đã được thiết lập tự chạy ngầm cùng hệ thống nhờ Homebrew).*
