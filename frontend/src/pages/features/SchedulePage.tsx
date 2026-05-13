import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { Plus, X, Loader2, Calendar, Clock, MapPin, Tag, User as UserIcon, BookOpen } from 'lucide-react';

export function SchedulePage() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const dates = [24, 25, 26, 27, 28, 29, 30];

  const [schedules, setSchedules] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    course_id: '',
    teacher_id: '',
    title: '',
    location: '',
    time_slot: '08:00 - 10:00',
    day_of_week: '1',
    color: 'border-[#13375f]',
    type: 'live'
  });
  
  // Dynamic real-time date
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(d.setDate(diff));
  });
  
  // Automatically select the current day of the week (0-6)
  const [selectedDayIndex, setSelectedDayIndex] = useState(() => {
      const today = new Date().getDay();
      return today === 0 ? 6 : today - 1; // 0 is Monday, 6 is Sunday
  });

  const getWeekDays = (baseMonday: Date) => {
    const daysArr = [];
    const datesArr = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(baseMonday);
        d.setDate(baseMonday.getDate() + i);
        daysArr.push(dayNames[d.getDay()]);
        datesArr.push(d.getDate());
    }
    return { daysArr, datesArr };
  };

  const { daysArr, datesArr } = getWeekDays(currentWeekStart);
  
  // Optional: formatted month for display (taking month from the middle of the week to be safe)
  const midWeekDate = new Date(currentWeekStart);
  midWeekDate.setDate(midWeekDate.getDate() + 3);
  const weekTitle = `Tuần ${datesArr[0]} - ${datesArr[6]} Tháng ${midWeekDate.getMonth() + 1}, ${midWeekDate.getFullYear()}`;

  const shiftWeek = (offset: number) => {
    const nextDate = new Date(currentWeekStart);
    nextDate.setDate(currentWeekStart.getDate() + offset * 7);
    setCurrentWeekStart(nextDate);
    // When shifting weeks, default to Monday
    setSelectedDayIndex(0);
  };

  const fetchSchedules = async () => {
    try {
      setIsLoading(true);
      const [schedRes, assignRes, notifRes] = await Promise.all([
          api.get('/schedules').catch(() => []),
          api.get('/assignments').catch(() => ({ assignments: [] })),
          api.get('/notifications').catch(() => ({ data: [] }))
      ]);
      
      setSchedules(schedRes || []);
      
      // Extract assignments from response
      const assignmentsData = assignRes && assignRes.assignments ? assignRes.assignments : [];
      setAssignments(assignmentsData);
      
      // Extract recent course/assignment notifications (max 2)
      const notificationsData = notifRes && notifRes.data ? (notifRes.data.notifications || notifRes.data) : [];
      const relevantNotifs = notificationsData
          .filter((n: any) => n.type === 'assignment' || n.type === 'course')
          .slice(0, 2);
      setNotifications(relevantNotifs);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const handleOpenCreateModal = async () => {
    setIsCreateModalOpen(true);
    try {
      const [coursesRes, teachersRes] = await Promise.all([
        role === 'admin' ? api.get('/admin/courses') : api.get('/my-courses'),
        role === 'admin' ? api.get('/admin/users?role=teacher') : Promise.resolve({ data: [] })
      ]);
      
      setCourses(coursesRes.data || coursesRes || []);
      if (role === 'admin') {
        setTeachers(teachersRes.data || []);
      }
    } catch (err) {
      toast.error('Không thể tải danh sách khóa học/giảng viên');
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.course_id) {
        toast.error('Vui lòng chọn khóa học');
        return;
    }
    
    setIsSubmitting(true);
    try {
      await api.post('/schedules', formData);
      toast.success('Đã tạo lịch dạy mới thành công');
      setIsCreateModalOpen(false);
      setFormData({
        course_id: '',
        teacher_id: '',
        title: '',
        location: '',
        time_slot: '08:00 - 10:00',
        day_of_week: '1',
        color: 'border-[#13375f]',
        type: 'live'
      });
      fetchSchedules();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Không thể tạo lịch dạy');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Map selectedIndex (0=Mon, 6=Sun) to backend seeder format (1=Mon, 7=Sun)
  const currentDisplayedDay = (selectedDayIndex + 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-[#002143]">
            {role === 'student' ? 'Lịch học của tôi' : 'Lịch dạy'}
          </h1>
          <p className="text-[#43474e] mt-1">{weekTitle}</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          {role !== 'student' && (
            <button 
                onClick={handleOpenCreateModal}
                className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-orange-600 text-white text-sm font-bold shadow-md hover:bg-orange-700 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                <Plus size={18} strokeWidth={3} />
                Tạo lịch dạy mới
            </button>
          )}
          <div className="flex gap-2">
            <button onClick={() => shiftWeek(-1)} className="p-3 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#002143]">chevron_left</span>
            </button>
            <button onClick={() => { 
                const d = new Date();
                const day = d.getDay();
                const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
                setCurrentWeekStart(new Date(d.setDate(diff))); 
                
                const today = new Date().getDay();
                setSelectedDayIndex(today === 0 ? 6 : today - 1); 
            }} className="px-5 py-3 rounded-xl bg-[#13375f] text-white text-sm font-bold shadow-md hover:bg-[#0f2a47] active:scale-95 transition-all">Hôm nay</button>
            <button onClick={() => shiftWeek(1)} className="p-3 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#002143]">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-[#002143]">
            <span className="material-symbols-outlined text-[#ba1a1a]">campaign</span>
            <h3 className="font-bold text-sm">Tin vắn học tập</h3>
          </div>
          <div className="flex flex-col gap-2">
            {notifications.map((notif: any, i: number) => (
              <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl shadow-sm text-sm border-l-4 border-[#002143]">
                <div className="flex-1">
                  <p className="font-bold text-[#002143]">{notif.title || 'Thông báo mới'}</p>
                  <p className="text-[#43474e] text-xs mt-1">{notif.message || 'Bạn có một hoạt động mới cần chú ý.'}</p>
                </div>
                <button className="text-[10px] bg-slate-100 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-200 text-[#002143] whitespace-nowrap">
                  Xem ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week Header */}
      <div className="grid grid-cols-7 gap-1 md:gap-3 overflow-x-auto pb-2">
        {daysArr.map((d, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedDayIndex(i)}
            className={`text-center py-3 md:py-4 rounded-xl md:rounded-2xl cursor-pointer transition-all min-w-[50px] ${i === selectedDayIndex ? 'bg-[#13375f] text-white shadow-lg shadow-[#13375f]/30 scale-105 transform' : 'bg-white shadow-sm hover:shadow-md hover:-translate-y-1'}`}
          >
            <p className={`text-[10px] md:text-sm font-bold uppercase tracking-wider mb-1 ${i === selectedDayIndex ? 'text-white/80' : 'text-[#43474e]'}`}>{d}</p>
            <p className={`text-lg md:text-2xl font-headline font-extrabold ${i === selectedDayIndex ? 'text-white' : 'text-[#002143]'}`}>{datesArr[i]}</p>
          </div>
        ))}
      </div>

      {/* Schedule Items */}
      <div className="space-y-4 min-h-[300px]">
        {isLoading && <div className="text-center py-12 text-[#43474e] animate-pulse">Đang tải lịch học...</div>}
        
        {!isLoading && (() => {
            const currentMonthStr = String(midWeekDate.getMonth() + 1).padStart(2, '0');
            const currentDateStr = `${String(datesArr[selectedDayIndex]).padStart(2, '0')}/${currentMonthStr}/${midWeekDate.getFullYear()}`;
            const todaysSchedules = schedules.filter(s => s.day === currentDisplayedDay);
            const todaysAssignments = assignments.filter(a => a.due === currentDateStr && a.status !== 'Đã chấm');

            return (
                <>
                <h3 className="text-lg font-bold text-[#002143] border-b border-slate-200 pb-2 mb-4">
                    {daysArr[selectedDayIndex]}, {datesArr[selectedDayIndex]}/{midWeekDate.getMonth() + 1}
                </h3>
                
                {todaysSchedules.length === 0 && todaysAssignments.length === 0 ? (
                    <div className="bg-[#f4f3f7] rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-300">
                        <span className="material-symbols-outlined text-4xl text-[#82a1cf] mb-3">event_busy</span>
                        <p className="font-bold text-[#002143]">Không có lịch trình</p>
                        <p className="text-sm text-[#43474e]">Bạn có thể thư giãn trong ngày này.</p>
                    </div>
                ) : (
                    <>
                        {/* Assignment Deadlines */}
                        {todaysAssignments.map((assignment, idx) => (
                            <div key={`assign-${idx}`} className={`bg-orange-50 p-5 md:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border-l-4 border-orange-500 hover:shadow-md transition-shadow group mb-4`}>
                                <div className="text-left md:text-center min-w-[80px] border-b md:border-b-0 md:border-r border-orange-200 pb-3 md:pb-0 md:pr-6">
                                    <span className="material-symbols-outlined text-3xl text-orange-600">alarm</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 flex items-center gap-1`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-600 animate-pulse"></span>
                                            Hạn nộp bài
                                        </span>
                                    </div>
                                    <p className="text-lg font-bold text-[#002143] group-hover:text-orange-700 transition-colors">{assignment.title}</p>
                                    <p className="text-sm text-[#43474e] mt-1 flex items-center gap-1">
                                        <span className="material-symbols-outlined text-sm">book</span>
                                        {assignment.course}
                                    </p>
                                </div>
                                <button className="mt-3 md:mt-0 w-full md:w-auto bg-orange-600 text-white px-8 py-3 rounded-xl text-sm md:text-[10px] font-bold shadow-md hover:bg-orange-700 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                    NỘP BÀI NGAY
                                </button>
                            </div>
                        ))}

                        {/* Regular Schedules */}
                        {todaysSchedules.map((item, idx) => (
                    <div key={idx} className={`bg-white p-5 md:p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border-l-4 ${item.color || 'border-[#13375f]'} hover:shadow-md transition-shadow group`}>
                        <div className="text-left md:text-center min-w-[80px] border-b md:border-b-0 md:border-r border-slate-100 pb-3 md:pb-0 md:pr-6">
                            <p className="text-xl md:text-sm font-headline font-bold text-[#002143]">{item.time.split(' - ')[0]}</p>
                            <p className="text-sm md:text-[10px] text-[#43474e] font-medium">{item.time.split(' - ')[1]}</p>
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.type === 'live' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                    {item.type === 'live' ? 'Online' : 'Trực tiếp'}
                                </span>
                            </div>
                            <p className="text-lg font-bold text-[#002143] group-hover:text-[#E24843] transition-colors">{item.title}</p>
                            <p className="text-sm text-[#43474e] mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">location_on</span>
                                {role === 'student' ? item.instructor + ' • ' : ''}{item.location}
                                {role !== 'student' && ` • ${item.students} học viên`}
                            </p>
                        </div>
                        {(role === 'student' ? item.type === 'live' : true) && (
                            <button onClick={() => alert('Đang mở nền tảng học trực tuyến...')} className="mt-3 md:mt-0 w-full md:w-auto bg-[#13375f] text-white px-8 py-3 rounded-xl text-sm md:text-[10px] font-bold shadow-md hover:bg-[#002143] hover:-translate-y-0.5 active:translate-y-0 transition-all">
                                VÀO LỚP
                            </button>
                        )}
                    </div>
                ))}
                    </>
                )}
                </>
            );
        })()}
      </div>

      {/* Create Schedule Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] animate-in zoom-in-95 duration-300">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#13375f] text-white flex items-center justify-center shadow-lg shadow-navy/20">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <h3 className="font-black text-2xl text-[#13375f]">Tạo lịch dạy mới</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Thiết lập buổi học trên hệ thống</p>
                        </div>
                    </div>
                    <button onClick={() => setIsCreateModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={24}/></button>
                </div>

                <form onSubmit={handleCreateSchedule} className="p-8 overflow-y-auto space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                <BookOpen size={14} /> Khóa học
                            </label>
                            <select 
                                required
                                value={formData.course_id}
                                onChange={e => {
                                    const selectedCourseId = e.target.value;
                                    const selectedCourse = courses.find(c => c.id.toString() === selectedCourseId);
                                    setFormData({
                                        ...formData, 
                                        course_id: selectedCourseId,
                                        teacher_id: selectedCourse?.teacher_id?.toString() || ''
                                    });
                                }}
                                className="w-full select-form px-5 py-4 rounded-2xl outline-none"
                            >
                                <option value="">-- Chọn khóa học --</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.title || c.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Teacher selection for Admin */}
                        {role === 'admin' && (
                            <div className="space-y-2">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                    <UserIcon size={14} /> Giảng viên
                                </label>
                                <select 
                                    value={formData.teacher_id}
                                    onChange={e => setFormData({...formData, teacher_id: e.target.value})}
                                    className="w-full select-form px-5 py-4 rounded-2xl outline-none"
                                >
                                    <option value="">-- Mặc định (Bản thân) --</option>
                                    {teachers.map(t => (
                                        <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                <Tag size={14} /> Tiêu đề buổi học
                            </label>
                            <input 
                                required
                                type="text"
                                placeholder="Ví dụ: Review bài viết IELTS hoặc Ôn tập từ vựng..."
                                value={formData.title}
                                onChange={e => setFormData({...formData, title: e.target.value})}
                                className="w-full bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-[#13375f] focus:bg-white transition-all outline-none font-bold text-slate-700"
                            />
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                <MapPin size={14} /> Địa điểm / Link
                            </label>
                            <input 
                                required
                                type="text"
                                placeholder="Phòng 302 hoặc Link Zoom/Meet..."
                                value={formData.location}
                                onChange={e => setFormData({...formData, location: e.target.value})}
                                className="w-full bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-[#13375f] focus:bg-white transition-all outline-none font-bold text-slate-700"
                            />
                        </div>

                        {/* Day of week */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                <Calendar size={14} /> Thứ trong tuần
                            </label>
                            <select 
                                value={formData.day_of_week}
                                onChange={e => setFormData({...formData, day_of_week: e.target.value})}
                                className="w-full select-form px-5 py-4 rounded-2xl outline-none"
                            >
                                <option value="1">Thứ 2</option>
                                <option value="2">Thứ 3</option>
                                <option value="3">Thứ 4</option>
                                <option value="4">Thứ 5</option>
                                <option value="5">Thứ 6</option>
                                <option value="6">Thứ 7</option>
                                <option value="7">Chủ Nhật</option>
                            </select>
                        </div>

                        {/* Time Slot */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-xs font-black text-slate-600 uppercase tracking-widest ml-1">
                                <Clock size={14} /> Khung giờ
                            </label>
                            <input 
                                required
                                type="text"
                                placeholder="Ví dụ: 08:00 - 10:00"
                                value={formData.time_slot}
                                onChange={e => setFormData({...formData, time_slot: e.target.value})}
                                className="w-full bg-slate-50 px-5 py-4 rounded-2xl border-2 border-transparent focus:border-[#13375f] focus:bg-white transition-all outline-none font-bold text-slate-700"
                            />
                        </div>

                        {/* Type & Color */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Loại</label>
                                <select 
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full select-form px-4 py-4 rounded-2xl outline-none"
                                >
                                    <option value="live">Online (Live)</option>
                                    <option value="offline">Trực tiếp (Offline)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-600 uppercase tracking-widest ml-1">Màu sắc</label>
                                <select 
                                    value={formData.color}
                                    onChange={e => setFormData({...formData, color: e.target.value})}
                                    className="w-full select-form px-4 py-4 rounded-2xl outline-none"
                                >
                                    <option value="border-[#13375f]">Navy (Mặc định)</option>
                                    <option value="border-emerald-500">Emerald (Xanh lá)</option>
                                    <option value="border-amber-500">Amber (Vàng)</option>
                                    <option value="border-red-500">Red (Đỏ)</option>
                                    <option value="border-purple-500">Purple (Tím)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex gap-4">
                        <button 
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => setIsCreateModalOpen(false)}
                            className="flex-1 px-8 py-4 bg-slate-100 text-slate-700 font-black rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-grow px-8 py-4 bg-[#13375f] text-white font-black rounded-2xl hover:bg-[#0f2a47] shadow-lg shadow-navy/20 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
                            Xác nhận tạo lịch
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
}
