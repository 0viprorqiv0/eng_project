import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

const GoalCard = ({ goal, updateGoal, removeGoal }: { goal: any, updateGoal: any, removeGoal: any }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!sliderRef.current || isEditing) return;
    const rect = sliderRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.max(0, Math.min(rect.width, x));
    const percentage = (x / rect.width) * 100;
    updateGoal(goal.id, { progress: Math.round(percentage) });
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isEditing) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const numericProgress = typeof goal.progress === 'number' ? goal.progress : parseInt(goal.progress as string) || 0;

  return (
    <div className="flex items-center gap-3 w-full mb-3 group">
      <div
        ref={sliderRef}
        onPointerDown={handlePointerDown}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && handlePointerMove(e)}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative flex-1 h-16 bg-[#73000a] rounded-2xl shadow-sm cursor-ew-resize touch-none overflow-hidden select-none"
      >
        <div
          className="absolute top-0 left-0 h-full bg-[#002143]"
          style={{
            width: `${numericProgress}%`,
            transition: isDragging ? 'none' : 'width 0.3s ease-out'
          }}
        >
          <div className="absolute top-0 right-0 w-1.5 h-full bg-white/20"></div>
        </div>

        <div className="absolute inset-0 flex items-center px-4 z-10 pointer-events-none">
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <div className="flex-1 overflow-hidden pr-4">
              {isEditing ? (
                <input
                  ref={inputRef}
                  type="text"
                  value={goal.title}
                  onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                  onBlur={() => setIsEditing(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                  placeholder="Nhập mục tiêu..."
                  className="bg-transparent text-white font-bold text-sm outline-none w-full border-b border-white mb-1"
                />
              ) : (
                <div className="text-white text-sm font-bold w-full truncate text-left">
                  {goal.title || "Nhập mục tiêu..."}
                </div>
              )}
            </div>
            
            <div className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-xl font-black tabular-nums text-white">
                {Math.round(numericProgress)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 shrink-0">
        <button 
          onClick={() => {
            setIsEditing(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }} 
          className="text-slate-500 bg-slate-100 hover:bg-blue-100 hover:text-blue-600 w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          title="Sửa mục tiêu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>

        <button 
          onClick={() => removeGoal(goal.id)} 
          className="text-slate-500 bg-slate-100 hover:bg-red-100 hover:text-red-600 w-10 h-10 flex items-center justify-center rounded-xl transition-colors"
          title="Xóa mục tiêu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || 'Minh';

  const [stats, setStats] = useState<any>({ total_courses: 0, completed_lessons: 0, avg_score: 0, streak: 0 });
  const [learningTime, setLearningTime] = useState<any[]>([]);
  const [dailyGoals, setDailyGoals] = useState<any[]>([]);
  const [newGoalValue, setNewGoalValue] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeIdx, setSelectedTimeIdx] = useState<number | null>(null);
  const debounceTimers = useRef<Record<number, NodeJS.Timeout>>({});

  const updateGoal = (id: any, updates: any) => {
    setDailyGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
    
    // Debounce API call (save after 500ms of no changes)
    if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
    debounceTimers.current[id] = setTimeout(() => {
      api.put(`/student/daily-goals/${id}`, updates).catch(console.error);
    }, 500);
  };

  const removeGoal = async (id: any) => {
    setDailyGoals(prev => prev.filter(g => g.id !== id));
    try {
      await api.delete(`/student/daily-goals/${id}`);
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  const addGoal = async (title: string) => {
    try {
      const newGoal = await api.post('/student/daily-goals', { title, progress: '0' });
      if (newGoal) {
        setDailyGoals(prev => [...prev, newGoal]);
      }
    } catch (err) {
      console.error('Failed to create goal:', err);
    }
  };

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
        {/* Left Column: Recent Courses + Live Session */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-headline font-bold text-[#002143]">Khóa học gần đây</h2>
              <button onClick={() => navigate('/dashboard/courses')} className="text-[#002143] text-sm font-bold flex items-center gap-1 hover:underline">Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span></button>
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

          {/* Live Session — moved to left, wider */}
          <div className="bg-gradient-to-r from-[#73000a]/10 to-[#73000a]/5 p-8 rounded-[2.5rem] border border-[#73000a]/10 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-40 h-40 bg-[#73000a]/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute right-16 bottom-0 w-24 h-24 bg-[#73000a]/5 rounded-full translate-y-1/2"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#4b0004] animate-pulse"></div>
                  <p className="text-xs font-bold text-[#4b0004] uppercase tracking-widest">Live Session</p>
                </div>
                <h3 className="text-xl font-headline font-bold text-[#002143] mb-2">Speaking Part 2 Workshop</h3>
                <p className="text-sm text-[#43474e]">Bắt đầu lúc 20:00 tối nay cùng Ms. Linh</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#43474e]">
                    <span className="material-symbols-outlined text-sm">schedule</span> 60 phút
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-[#43474e]">
                    <span className="material-symbols-outlined text-sm">group</span> 24 tham gia
                  </span>
                </div>
              </div>
              <button 
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSfyTSVSKtFK6rSKwKs-PNTQBAVYix72DxvpbAs4Aq57lvukXg/viewform?usp=dialog', '_blank')}
                className="px-8 py-4 bg-[#73000a] text-white rounded-2xl text-sm font-bold hover:bg-[#4b0004] transition-all shadow-lg shadow-[#73000a]/20 active:scale-95 whitespace-nowrap"
              >
                Đăng ký tham gia
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Goals + Learning Time */}
        <div className="space-y-8">
          <div className="bg-[#f4f3f7] p-8 rounded-[2.5rem]">
            <h2 className="text-xl font-headline font-bold text-[#002143] mb-6">Mục tiêu hôm nay</h2>
            <div className="space-y-4">
              {dailyGoals.length === 0 && <p className="text-sm text-[#43474e]">Chưa có mục tiêu nào hôm nay.</p>}
              {dailyGoals.map((g, i) => (
                <GoalCard 
                  key={g.id || i} 
                  goal={g} 
                  updateGoal={updateGoal} 
                  removeGoal={removeGoal} 
                />
              ))}
            </div>
            
            {isAddingGoal ? (
              <div className="mt-6 flex flex-col gap-2">
                <input 
                  type="text" 
                  autoFocus
                  value={newGoalValue}
                  onChange={(e) => setNewGoalValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newGoalValue.trim()) {
                      addGoal(newGoalValue.trim());
                      setNewGoalValue('');
                      setIsAddingGoal(false);
                    } else if (e.key === 'Escape') {
                      setIsAddingGoal(false);
                    }
                  }}
                  placeholder="Nhập tên mục tiêu (Enter để lưu)"
                  className="w-full px-4 py-3 border border-[#13375f]/20 rounded-xl text-sm focus:outline-none focus:border-[#13375f]"
                />
                <p className="text-[10px] text-slate-500">Bấm Enter để lưu, ESC để hủy</p>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingGoal(true)} 
                className="w-full mt-6 py-4 border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-100 rounded-2xl flex items-center justify-center gap-2 text-[#43474e] text-sm font-bold transition-all"
              >
                <span>+</span> Thêm mục tiêu mới
              </button>
            )}
          </div>

          {/* Learning Time Chart — Interactive */}
          <div className="bg-[#002143] p-8 rounded-[2.5rem] text-white">
            <h2 className="text-xl font-headline font-bold mb-2">Thời gian học tập</h2>
            <p className="text-[#82a1cf] text-xs mb-6">
              {selectedTimeIdx !== null 
                ? `${(learningTime[selectedTimeIdx]?.day || ['T2','T3','T4','T5','T6','T7','CN'][selectedTimeIdx])}: ${learningTime[selectedTimeIdx]?.minutes || [48, 72, 36, 108, 60, 90, 12][selectedTimeIdx]} phút`
                : `Bạn đã học được ${((learningTime.length > 0 ? learningTime : [{minutes:48},{minutes:72},{minutes:36},{minutes:108},{minutes:60},{minutes:90},{minutes:12}]).reduce((sum, d) => sum + (d.minutes || 0), 0) / 60).toFixed(1)} giờ trong tuần này.`
              }
            </p>
            <div className="flex items-end gap-2 h-32 mb-4">
              {(learningTime.length > 0 ? learningTime : [{minutes:48},{minutes:72},{minutes:36},{minutes:108},{minutes:60},{minutes:90},{minutes:12}]).map((d: any, i: number) => {
                const h = Math.min((d.minutes / 120) * 100, 100);
                const isSelected = selectedTimeIdx === i;
                return (
                  <div 
                    key={i} 
                    className={`w-full rounded-t-lg cursor-pointer transition-all duration-200 hover:opacity-100 ${isSelected ? 'bg-[#ffdad6] scale-105' : i === 6 ? 'bg-[#ffdad6]/60' : 'bg-[#82a1cf]/20'} ${selectedTimeIdx !== null && !isSelected ? 'opacity-40' : ''}`}
                    style={{ height: `${h || 2}%` }}
                    onClick={() => setSelectedTimeIdx(isSelected ? null : i)}
                  ></div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-[#82a1cf] font-bold uppercase tracking-wider">
              {(learningTime.length > 0 ? learningTime : [{day:'T2'},{day:'T3'},{day:'T4'},{day:'T5'},{day:'T6'},{day:'T7'},{day:'CN'}]).map((d: any, i: number) => (
                <span 
                  key={i} 
                  className={`cursor-pointer transition-colors ${selectedTimeIdx === i ? 'text-[#ffdad6]' : i === 6 ? 'text-white' : ''}`}
                  onClick={() => setSelectedTimeIdx(selectedTimeIdx === i ? null : i)}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
