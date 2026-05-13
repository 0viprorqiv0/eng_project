# Sơ đồ Workflow Phân quyền (RBAC)

Dự án sử dụng cơ chế Role-Based Access Control (RBAC) để quản lý quyền hạn của người dùng. Mỗi vai trò (Admin, Teacher, Student) sẽ có các quyền truy cập khác nhau vào các tài nguyên của hệ thống.

## User Review Required

> [!IMPORTANT]
> Sơ đồ sẽ được thêm trực tiếp vào `README.md` dưới mục **Architecture & Structure** hoặc một mục mới có tên **Workflow & Permissions**. Bạn có muốn đặt nó ở vị trí cụ thể nào khác không?

## Proposed Changes

### Documentation

#### [MODIFY] [README.md](file:///c:/eng_project/README.md)
- Thêm một section mới "🔐 Workflow & Permissions" chứa sơ đồ Mermaid.
- Sơ đồ sẽ mô tả luồng kiểm tra:
    1. **Authentication**: Kiểm tra token (Sanctum).
    2. **Banned Check**: Kiểm tra xem user có bị ban hay không (`CheckIfNotBanned`).
    3. **Role Check**: Kiểm tra role (`CheckRole`) - Admin, Teacher, Student.
    4. **Resource Access**: Quyền truy cập cụ thể (CRUD khóa học, bài học, chấm điểm, v.v.).

## Mermaid Diagram Preview (Enhanced)

```mermaid
graph TD
    %% Tùy chỉnh Style
    classDef auth fill:#f9f,stroke:#333,stroke-width:2px;
    classDef guest fill:#eee,stroke:#999,dasharray: 5 5;
    classDef student fill:#dcfce7,stroke:#166534,stroke-width:2px;
    classDef teacher fill:#dbeafe,stroke:#1e40af,stroke-width:2px;
    classDef admin fill:#fee2e2,stroke:#991b1b,stroke-width:2px;
    classDef resource fill:#fafaf9,stroke:#444,stroke-width:1px;

    %% Luồng chính
    Start((Bắt đầu)) --> Landing[Landing Page / Public]
    Landing --> Login[Đăng nhập / Đăng ký]
    
    subgraph "Hệ thống Xác thực & Bảo mật (Middleware)"
        Login --> AuthCheck{Check Sanctum Token}
        AuthCheck -- No --> Guest[Khách: Xem Course Intro]
        AuthCheck -- Yes --> BanCheck{Bị Khóa?}
        BanCheck -- Yes --> Banned[Hiện thông báo: Tài khoản bị khóa]
        BanCheck -- No --> RoleRouter{Điều hướng Dashboard}
    end

    %% Nhánh Student
    RoleRouter -- "role: student" --> SDash[Student Dashboard]
    subgraph "Phân quyền: Học sinh"
        SDash --> SLessons[Học bài / Xem Video]
        SDash --> SAssignments[Nộp bài / Làm Quiz]
        SDash --> SNotes[Ghi chú / Thảo luận]
    end

    %% Nhánh Teacher
    RoleRouter -- "role: teacher" --> TDash[Teacher Dashboard]
    subgraph "Phân quyền: Giáo viên"
        TDash --> TManage[Quản lý bài giảng]
        TDash --> TGrade[Chấm điểm / Feedback]
        TDash --> TStudents[Theo dõi tiến rình học sinh]
    end

    %% Nhánh Admin
    RoleRouter -- "role: admin" --> ADash[Admin Dashboard]
    subgraph "Phân quyền: Quản trị viên"
        ADash --> AUsers[Quản lý Users / Bulk Action]
        ADash --> ACourses[Phê duyệt / SQL Courses]
        ADash --> ARevenue[Thống kê doanh thu / Chart]
    end

    %% Liên kết tài nguyên
    SLessons & TManage & ACourses --> DB[Database / Storage]
    
    %% Áp dụng Style
    class Landing,Guest,Start guest;
    class Login,AuthCheck,BanCheck,RoleRouter auth;
    class SDash,SLessons,SAssignments,SNotes student;
    class TDash,TManage,TGrade,TStudents teacher;
    class ADash,AUsers,ACourses,ARevenue admin;
    class DB resource;
```

## Verification Plan

### Manual Verification
- Xem trước file `README.md` trong trình chỉnh sửa để đảm bảo sơ đồ hiển thị đúng.
- Kiểm tra nội dung sơ đồ có khớp với logic trong `backend/routes/api.php` hay không.
