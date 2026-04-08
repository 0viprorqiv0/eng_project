import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || 'Minh';

  const [stats, setStats] = useState<any>({ total_courses: 0, completed_lessons: 0, avg_score: 0, streak: 0 });
  const [learningTime, setLearningTime] = useState<any[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [statsData, timeData, goalsData, coursesData] = await Promise.all([
          api.get('/student/stats'),
          api.get('/student/learning-time'),
          api.get('/student/daily-goals'),
          api.get('/my-courses')
        ]);
        if (statsData) setStats(statsData);
        if (timeData) setLearningTime(timeData);
        if (goalsData) setDailyGoals(goalsData);
        if (coursesData) setRecentCourses((coursesData || []).slice(0, 2));
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <h1 className="text-4xl lg:text-5xl font-headline font-extrabold text-[#002143] tracking-tight mb-4 leading-tight">
            Chào mừng trở lại, {name}!
          </h1>
          <p className="text-lg text-[#43474e] max-w-xl">
            Hôm nay là một ngày tuyệt vời để học từ mới. Bạn đã sẵn sàng chinh phục mục tiêu IELTS 7.5 chưa?
          </p>
        </div>
        <div className="lg:col-span-4 flex justify-end">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5 w-full max-w-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#ffdad6] flex items-center justify-center text-[#73000a]">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <p className="text-3xl font-headline font-extrabold text-[#002143]">{stats.streak} Ngày</p>
              <p className="text-sm font-medium text-[#73000a]">Chuỗi học tập (Streak)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#13375f] p-6 rounded-[2rem] text-white flex flex-col justify-between h-40">
          <span className="material-symbols-outlined text-[#82a1cf] text-3xl">school</span>
          <div>
            <h3 className="text-3xl font-bold">{stats.total_courses}</h3>
            <p className="text-[#82a1cf] text-sm font-medium">Khóa học của tôi</p>
          </div>
        </div>
        <div className="bg-[#f4f3f7] p-6 rounded-[2rem] flex flex-col justify-between h-40">
          <span className="material-symbols-outlined text-[#4b0004] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <div>
            <h3 className="text-3xl font-bold text-[#002143]">{stats.completed_lessons}</h3>
            <p className="text-[#43474e] text-sm font-medium">Bài học hoàn thành</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between h-40">
          <span className="material-symbols-outlined text-[#002143] text-3xl">grade</span>
          <div>
            <h3 className="text-3xl font-bold text-[#002143]">{stats.avg_score}<span className="text-base text-[#43474e] font-normal">/10</span></h3>
            <p className="text-[#43474e] text-sm font-medium">Điểm trung bình Quiz</p>
          </div>
        </div>
      </section>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Courses */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-headline font-bold text-[#002143]">Khóa học gần đây</h2>
              <button onClick={() => navigate('/my-courses')} className="text-[#002143] text-sm font-bold flex items-center gap-1 hover:underline">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentCourses.length === 0 && !isLoading && (
                <p className="text-sm text-[#43474e] col-span-2">Bạn chưa tham gia khóa học nào. <button onClick={() => navigate('/courses')} className="text-[#13375f] font-bold hover:underline">Bắt đầu học ngay!</button></p>
              )}
              {recentCourses.map((course, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50 group hover:shadow-md transition-shadow">
                  <div className={`h-40 relative bg-gradient-to-br ${idx % 2 === 0 ? 'from-[#002143] to-[#13375f]' : 'from-[#4b6076] to-[#13375f]'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 z-10">
                      <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wider">{course.level}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-[#002143] mb-2 line-clamp-1">{course.name}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs text-[#43474e] flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">play_circle</span> {course.lessons} bài học
                      </span>
                      <span className="text-xs font-bold text-[#002143]">{course.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#eeedf1] rounded-full overflow-hidden">
                      <div className="h-full bg-[#002143] rounded-full transition-all" style={{ width: `${course.progress}%` }}></div>
                    </div>
                    <button onClick={() => navigate(`/course/${course.course_id || course.id}`)} className="mt-6 w-full py-3 bg-[#13375f] text-white rounded-xl text-sm font-bold active:scale-95 transition-all">Tiếp tục học</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div>
            <h2 className="text-2xl font-headline font-bold text-[#002143] mb-6">Gợi ý cho bạn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative bg-white p-6 pt-10 rounded-[2rem] border border-slate-100 shadow-sm mt-6">
                <div className="absolute -top-6 left-6 w-12 h-12 bg-[#73000a] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined">menu_book</span>
                </div>
                <h3 className="font-bold text-[#002143] mb-2">Cách sử dụng "Will" và "Be going to"</h3>
                <p className="text-sm text-[#43474e] mb-4 line-clamp-2">Nắm vững sự khác biệt để không bao giờ nhầm lẫn trong bài thi Speaking & Writing.</p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#43474e]">
                  <span className="flex items-center gap-1 uppercase tracking-wider"><span className="material-symbols-outlined text-xs">schedule</span> 15 min</span>
                  <span className="flex items-center gap-1 uppercase tracking-wider"><span className="material-symbols-outlined text-xs">auto_awesome</span> New</span>
                </div>
              </div>
              <div className="relative bg-white p-6 pt-10 rounded-[2rem] border border-slate-100 shadow-sm mt-6">
                <div className="absolute -top-6 left-6 w-12 h-12 bg-[#4b6076] rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <span className="material-symbols-outlined">translate</span>
                </div>
                <h3 className="font-bold text-[#002143] mb-2">100 Từ vựng Topic Du lịch</h3>
                <p className="text-sm text-[#43474e] mb-4 line-clamp-2">Bộ từ vựng "must-have" cho chủ đề Travel & Tourism thường gặp trong Part 1.</p>
                <div className="flex items-center gap-4 text-[10px] font-bold text-[#43474e]">
                  <span className="flex items-center gap-1 uppercase tracking-wider"><span className="material-symbols-outlined text-xs">schedule</span> 25 min</span>
                  <span className="flex items-center gap-1 uppercase tracking-wider"><span className="material-symbols-outlined text-xs">download</span> PDF</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Goals & Stats */}
        <div className="space-y-8">
          <div className="bg-[#f4f3f7] p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-headline font-bold text-[#002143] mb-6">Mục tiêu hôm nay</h2>
            <div className="space-y-4">
              {dailyGoals.length === 0 && <p className="text-sm text-[#43474e]">Chưa có mục tiêu nào hôm nay.</p>}
              {dailyGoals.map((g, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 bg-white rounded-2xl border border-slate-50 ${g.is_completed ? 'opacity-60' : ''}`}>
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5 ${g.is_completed ? 'bg-[#13375f]' : 'border-2 border-[#13375f]'}`}>
                    {g.is_completed && <span className="material-symbols-outlined text-xs font-bold text-white">check</span>}
                    {!g.is_completed && g.progress && <span className="material-symbols-outlined text-[10px] font-bold text-[#13375f]">trending_up</span>}
                  </div>
                  <div>
                    <p className={`text-sm font-bold text-[#002143] ${g.is_completed ? 'line-through' : ''}`}>{g.title}</p>
                    {g.progress && <p className="text-xs text-[#43474e]">{g.progress}</p>}
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-2xl text-[#43474e] text-xs font-bold hover:bg-white transition-colors">+ Thêm mục tiêu mới</button>
          </div>

          {/* Learning Time Chart */}
          <div className="bg-[#002143] p-8 rounded-[2.5rem] text-white">
            <h2 className="text-xl font-headline font-bold mb-4">Thời gian học tập</h2>
            <p className="text-[#82a1cf] text-xs mb-6">Bạn đã học được 12.5 giờ trong tuần này.</p>
            <div className="flex items-end gap-2 h-32 mb-4">
              {learningTime.length > 0 ? learningTime.map((d, i) => {
                const h = Math.min((d.minutes / 120) * 100, 100);
                return (
                  <div key={i} className={`w-full rounded-t-lg ${i === 6 ? 'bg-[#ffdad6]' : 'bg-[#82a1cf]/20'}`} style={{ height: `${h || 2}%` }}></div>
                );
              }) : [40, 60, 30, 90, 50, 75, 10].map((h, i) => (
                <div key={i} className={`w-full rounded-t-lg ${i === 6 ? 'bg-[#ffdad6]' : 'bg-[#82a1cf]/20'}`} style={{ height: `${h}%` }}></div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-[#82a1cf] font-bold uppercase tracking-wider">
              {learningTime.length > 0 ? learningTime.map((d, i) => (
                <span key={i} className={i === 6 ? 'text-white' : ''}>{d.day}</span>
              )) : ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((d, i) => (
                <span key={i} className={i === 6 ? 'text-white' : ''}>{d}</span>
              ))}
            </div>
          </div>

          {/* Live Session */}
          <div className="bg-[#73000a]/5 p-6 rounded-[2.5rem] border border-[#73000a]/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#4b0004] animate-pulse"></div>
              <p className="text-xs font-bold text-[#4b0004] uppercase tracking-widest">Live Session</p>
            </div>
            <h3 className="font-bold text-[#002143] mb-1">Speaking Part 2 Workshop</h3>
            <p className="text-xs text-[#43474e] mb-4">Bắt đầu lúc 20:00 tối nay cùng Ms. Linh</p>
            <button className="w-full py-3 bg-[#73000a] text-white rounded-xl text-sm font-bold hover:bg-[#4b0004] transition-colors">Đăng ký tham gia</button>
          </div>
        </div>
      </div>
    </div>
  );
}
