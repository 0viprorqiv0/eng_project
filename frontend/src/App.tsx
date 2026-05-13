import React from 'react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/MainLayout';
import { DashboardLayout } from './components/DashboardLayout';
import { AdminLayout } from './components/AdminLayout';
import { AuthProvider } from './components/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Unauthorized } from './pages/auth/Unauthorized';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { AboutPage } from './pages/public/AboutPage';
import { CareersPage } from './pages/public/CareersPage';

// Dashboard Pages
import { AdminOverviewPage } from './pages/admin/AdminOverviewPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminRecruitmentPage } from './pages/admin/AdminRecruitmentPage';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { TeacherStudentsPage } from './pages/dashboard/TeacherStudentsPage';

// Course Pages
import { CourseDiscoveryPage } from './pages/courses/CourseDiscoveryPage';
import { CourseIntroPage } from './pages/courses/CourseIntroPage';
import { CourseDetailPage } from './pages/courses/CourseDetailPage';
import { MyCoursesPage } from './pages/courses/MyCoursesPage';
import { LessonPage } from './pages/courses/LessonPage';
import { QuizPage } from './pages/courses/QuizPage';
import { CreateCoursePage } from './pages/courses/CreateCoursePage';
import { CreateLecturePage } from './pages/courses/CreateLecturePage';

// Feature Pages
import { AssignmentsPage } from './pages/features/AssignmentsPage';
import { SchedulePage } from './pages/features/SchedulePage';
import { SettingsPage } from './pages/features/SettingsPage';
import { AchievementsPage } from './pages/features/AchievementsPage';
import { LibraryPage } from './pages/features/LibraryPage';

// New Notification Pages
import { NotificationCenterPage } from './pages/dashboard/NotificationCenterPage';
import { SendNotificationPage } from './pages/dashboard/SendNotificationPage';
import { ConsultationRequestsPage } from './pages/dashboard/ConsultationRequestsPage';

// Legal Pages
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { PlacementTestPage } from './pages/public/PlacementTestPage';
import { AdminPlacementPage } from './pages/admin/AdminPlacementPage';

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <BrowserRouter>

      <Routes>
        {/* Main Website Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/courses" element={<CourseDiscoveryPage />} />
          <Route path="/course-intro/:id" element={<CourseIntroPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Route>

        {/* Dashboard Layout (for Student & Teacher) */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route element={<ProtectedRoute allowedRoles={['student', 'admin', 'teacher']} />}>
            <Route path="student" element={<StudentDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
            <Route path="teacher" element={<TeacherDashboard />} />
            <Route path="teacher/students" element={<TeacherStudentsPage />} />
            <Route path="create-course" element={<CreateCoursePage />} />
            <Route path="create-lecture" element={<CreateLecturePage />} />
            <Route path="send-notification" element={<SendNotificationPage />} />
          </Route>

          {/* Shared Sub-Pages (accessible by all authenticated users) */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'teacher', 'admin']} />}>
            <Route path="courses" element={<MyCoursesPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="notifications" element={<NotificationCenterPage />} />
            <Route path="consultations" element={<ConsultationRequestsPage />} />
          </Route>

          {/* Admin Pages (inside DashboardLayout) */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin" element={<AdminOverviewPage />} />
            <Route path="admin/users" element={<AdminUsersPage />} />
            <Route path="admin/courses" element={<AdminCoursesPage />} />
            <Route path="admin/recruitment" element={<AdminRecruitmentPage />} />
            <Route path="admin/consultations" element={<ConsultationRequestsPage />} />
            <Route path="admin/placement-results" element={<AdminPlacementPage />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Learning Layout (No Navbar/Footer) */}
        <Route path="/course/:id" element={<CourseDetailPage />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/quiz/:id" element={<QuizPage />} />
        <Route path="/placement-test" element={<PlacementTestPage />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
  );
}
