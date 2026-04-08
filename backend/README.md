# BeeLearn Backend API 🐝

REST API cho nền tảng BeeLearn — PHP Laravel 12 + Sanctum Token Auth.

## Cài đặt

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate:fresh --seed    # Reset DB + tạo 3 user demo
php artisan serve --port=8000       # → http://localhost:8000
```

## Tài khoản demo (mật khẩu: `password`)

| Email | Role |
|---|---|
| `admin@beelearn.vn` | Admin |
| `teacher@beelearn.vn` | Teacher |
| `student@beelearn.vn` | Student |

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

### Sắp triển khai
| Phase | Endpoints |
|---|---|
| **2 — Courses** | CRUD `/api/courses`, `/api/my-courses`, `/api/courses/{id}/enroll` |
| **3 — Assignments** | CRUD `/api/assignments`, submit, grade |
| **4 — Schedule** | `/api/schedules` |
| **5 — Reports** | `/api/admin/stats`, `/api/student/stats`, `/api/reports/*` |
| **6 — Settings** | `/api/settings` |

## Cấu trúc backend

```
app/
├── Http/
│   ├── Controllers/
│   │   └── AuthController.php         ✅ login, register, me, logout
│   └── Middleware/
│       └── CheckRole.php              ✅ role:admin, role:teacher,admin
├── Models/
│   └── User.php                       ✅ HasApiTokens, role helpers
routes/
└── api.php                            ✅ Auth routes + scaffolded groups
database/
├── migrations/
│   ├── 000000_create_users_table.php
│   └── 185045_add_role_fields.php     ✅ role, phone, dob, bio, streak
└── seeders/
    └── DatabaseSeeder.php             ✅ 3 demo users
```

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Framework | Laravel 12 |
| Auth | Sanctum (Token-based) |
| Database | SQLite (dev) / MySQL (prod) |
| PHP | 8.2+ |

## Lệnh hữu ích

```bash
php artisan route:list              # Xem tất cả routes
php artisan migrate:fresh --seed    # Reset DB
php artisan tinker                  # PHP shell
php artisan make:controller Xxx     # Tạo controller
php artisan make:model Xxx -mcr     # Model + Migration + Controller
```
