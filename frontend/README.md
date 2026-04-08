# BeeLearn Frontend 🐝

Ứng dụng React cho nền tảng học tiếng Anh BeeLearn.

## Cài đặt

```bash
npm install
npm run dev            # → http://localhost:3000
```

## Tính năng

### Website công khai
- Landing Page (3D, hoạt ảnh, ong bay)
- Khóa học (danh mục, chi tiết, bài học thử)
- Thư viện, Bảng vàng, Tuyển dụng
- Đăng nhập / Đăng ký

### Dashboard (RBAC)
3 vai trò (Admin, Teacher, Student) × 6 trang:
Dashboard, My Courses, Assignments, Schedule, Reports, Settings

Mỗi trang tự động hiển thị nội dung phù hợp với vai trò.

## Tech Stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Framer Motion · Lucide React · Material Symbols · Vitest

## Cấu trúc

```
src/
├── components/
│   ├── AuthContext.tsx           # Auth state + role
│   ├── ProtectedRoute.tsx       # Guard route theo role
│   ├── DashboardLayout.tsx      # Sidebar + Header + Outlet
│   └── MainLayout.tsx           # Navbar + Footer
├── pages/
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── AdminDashboard.tsx
│   ├── TeacherDashboard.tsx
│   ├── StudentDashboard.tsx
│   ├── MyCoursesPage.tsx        # Role-adaptive
│   ├── AssignmentsPage.tsx      # Role-adaptive
│   ├── SchedulePage.tsx
│   ├── ReportsPage.tsx
│   ├── SettingsPage.tsx
│   └── ...
└── App.tsx                      # Routing
```

## Scripts

```bash
npm run dev            # Dev server (:3000)
npm run build          # Production build
npm run test           # Vitest
npm run test:watch     # Watch mode
npm run lint           # TypeScript check
```

## Mock Login

Tại `/login`, nhập email chứa từ khóa:
- `admin@...` → Admin Dashboard
- `teacher@...` → Teacher Dashboard
- Còn lại → Student Dashboard
