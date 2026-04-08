import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';

export function SchedulePage() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const dates = [24, 25, 26, 27, 28, 29, 30];

  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/schedules');
        setSchedules(res || []);
      } catch (error) {
        console.error('Failed to fetch schedules:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedules();
  }, []);

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
          }} className="flex-1 md:flex-none px-5 py-3 rounded-xl bg-[#13375f] text-white text-sm font-bold shadow-md hover:bg-[#0f2a47] active:scale-95 transition-all">Hôm nay</button>
          <button onClick={() => shiftWeek(1)} className="p-3 rounded-xl bg-white shadow-sm hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-[#002143]">chevron_right</span>
          </button>
        </div>
      </div>

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
        
        {!isLoading && (
            <>
            <h3 className="text-lg font-bold text-[#002143] border-b border-slate-200 pb-2 mb-4">
                {daysArr[selectedDayIndex]}, {datesArr[selectedDayIndex]}/{midWeekDate.getMonth() + 1}
            </h3>
            
            {schedules.filter(s => s.day === currentDisplayedDay).length === 0 ? (
                <div className="bg-[#f4f3f7] rounded-3xl p-12 text-center flex flex-col items-center justify-center border border-dashed border-slate-300">
                    <span className="material-symbols-outlined text-4xl text-[#82a1cf] mb-3">event_busy</span>
                    <p className="font-bold text-[#002143]">Không có lịch trình</p>
                    <p className="text-sm text-[#43474e]">Bạn có thể thư giãn trong ngày này.</p>
                </div>
            ) : (
                schedules.filter(s => s.day === currentDisplayedDay).map((item, idx) => (
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
                ))
            )}
            </>
        )}
      </div>
    </div>
  );
}
