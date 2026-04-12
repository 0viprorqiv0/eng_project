# BeeLearn Backend API 🐝

REST API cho nền tảng BeeLearn — PHP Laravel 12 + Sanctum Token Auth + MySQL (XAMPP).

## Cài đặt

### 1. Yêu cầu
- **XAMPP** đã bật MySQL trên cổng 3306
- Database `beelearn` đã được tạo sẵn (xem hướng dẫn ở README gốc)

### 2. Cấu hình & Chạy
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve --port=8000       # → http://localhost:8000
```

> ⚠️ **Thứ tự rất quan trọng**: `key:generate` phải chạy **trước** `migrate:fresh --seed`.
> Nếu chạy sai thứ tự, hệ thống sẽ không thể đăng nhập.

File `.env.example` đã cấu hình sẵn cho XAMPP MySQL (root, không mật khẩu):
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=beelearn
DB_USERNAME=root
DB_PASSWORD=
```

## Tài khoản demo (mật khẩu: `password`)

| Email | Role |
|---|---|
| `admin@beelearn.vn` | Admin |
| `teacher@beelearn.vn` | Teacher |
| `student@beelearn.vn` | Student |

> Có tổng cộng 16 tài khoản demo (4 Teacher + 10 Student + 1 Admin + 1 Superuser). Xem chi tiết tại `docs/TESTING_ACCOUNTS.md`.

## API Endpoints

### Auth (Public)
| Method | Endpoint | Body | Response |
|---|---|---|---|
| `POST` | `/api/register` | `{ name, email, password, phone? }` | `{ user, token }` |
| `POST` | `/api/login` | `{ email, password }` | `{ user, token }` |

### Authenticated (Header: `Authorization: Bearer {token}`)
| Method | Endpoint | Mô tả |
|---|---|---|
| `GET` | `/api/me` | Thông tin user đang đăng nhập |
| `POST` | `/api/logout` | Đăng xuất (xóa token) |
| `GET` | `/api/my-courses` | Danh sách khóa học của user (theo role) |
| `GET` | `/api/courses/{id}` | Chi tiết khóa học |
| `POST` | `/api/courses/{id}/enroll` | Đăng ký khóa học |
| `GET` | `/api/lessons/{id}` | Chi tiết bài giảng |
| `POST` | `/api/lessons/{id}/quiz` | Nộp bài quiz |
| `GET` | `/api/assignments` | Danh sách bài tập |
| `POST` | `/api/assignments/{id}/submit` | Nộp bài tập |
| `GET` | `/api/notifications` | Danh sách thông báo |
| `GET` | `/api/schedules` | Lịch học |
| `GET` | `/api/reports/overview` | Báo cáo tổng quan |

### Teacher/Admin only
| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/courses` | Tạo khóa học mới |
| `POST` | `/api/courses/{id}/lessons` | Tạo bài giảng mới |
| `PUT` | `/api/lessons/{id}` | Sửa bài giảng |
| `DELETE` | `/api/lessons/{id}` | Xóa bài giảng |
| `POST` | `/api/upload/lesson-media` | Upload video/tài liệu bài giảng |
| `PUT` | `/api/assignments/{id}/grade/{submission}` | Chấm điểm bài tập |

## Cấu trúc Backend

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php          ✅ login, register, me, logout
│   │   ├── CourseController.php        ✅ CRUD courses, lessons, quiz submit
│   │   ├── AssignmentController.php    ✅ CRUD assignments, submit, grade
│   │   ├── LessonFeatureController.php ✅ progress, notes, discussions
│   │   ├── NotificationController.php  ✅ notifications CRUD
│   │   ├── FileController.php          ✅ file upload (submission, lesson-media)
│   │   ├── ScheduleController.php      ✅ schedules
│   │   ├── ReportsController.php       ✅ overview, skills, activity
│   │   ├── SettingsController.php      ✅ user settings, avatar
│   │   ├── AdminController.php         ✅ admin stats, revenue
│   │   └── StudentController.php       ✅ student/teacher stats
│   └── Middleware/
│       └── CheckRole.php               ✅ role:admin, role:teacher,admin
├── Models/
│   ├── User.php                        ✅ HasApiTokens, role helpers
│   ├── Course.php                      ✅ relationships, structures
│   ├── Lesson.php                      ✅ questions_data JSON cast
│   ├── Assignment.php                  ✅ lesson relationship
│   ├── QuizAttempt.php                 ✅ quiz scoring
│   ├── LessonProgress.php             ✅ completion tracking
│   ├── LessonNote.php                  ✅ student notes
│   ├── Discussion.php                  ✅ course discussions
│   └── Notification.php               ✅ notification system
routes/
└── api.php                             ✅ 125+ routes (public + auth + role-based)
database/
├── migrations/                         ✅ 21 migration files
└── seeders/
    ├── DatabaseSeeder.php              ✅ 16 demo users (admin, teachers, students)
    ├── CourseSeeder.php                 ✅ 8 courses with lessons
    ├── AssignmentSeeder.php            ✅ assignments data
    ├── ScheduleSeeder.php              ✅ schedules data
    └── StatsSeeder.php                 ✅ student statistics
```

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | Laravel 12 |
| Auth | Sanctum (Token-based) |
| Database | MySQL (XAMPP, cổng 3306) |
| PHP | 8.2+ |

## Lệnh hữu ích

```bash
php artisan route:list              # Xem tất cả routes
php artisan migrate:fresh --seed    # Reset DB + tạo dữ liệu mẫu
php artisan tinker                  # PHP shell
php artisan make:controller Xxx     # Tạo controller
php artisan make:model Xxx -mcr     # Model + Migration + Controller
```
