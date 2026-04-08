import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';

export function ReportsPage() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const [overview, setOverview] = useState<any>({});
  const [skills, setSkills] = useState<any>({});
  const [activity, setActivity] = useState<any[]>([]);
  const [adminStats, setAdminStats] = useState<any>({});
  const [teacherStats, setTeacherStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7 Ngày');

  const fetchReports = async (range: string) => {
      try {
        setIsLoading(true);
        if (role === 'student') {
          const [ovData, skData, actData] = await Promise.all([
            api.get('/reports/overview'),
            api.get('/reports/skills'),
            api.get('/student/learning-time') // using student learning time for 7 days
          ]);
          if (ovData) setOverview(ovData);
          if (skData) setSkills(skData);
          if (actData) setActivity(actData);
        } else if (role === 'admin') {
          const [statsData, actData] = await Promise.all([
            api.get('/admin/stats'),
            api.get('/reports/activity') // 12 month activity
          ]);
          if (statsData) setAdminStats(statsData);
          if (actData) setActivity(actData);
        } else {
          // teacher
          const [statsData, actData] = await Promise.all([
            api.get('/teacher/stats'),
            api.get('/reports/activity')
          ]);
          if (statsData) setTeacherStats(statsData);
          if (actData) setActivity(actData);
        }
      } catch (err) {
        console.error('Failed to load reports:', err);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchReports(timeRange);
  }, [role, timeRange]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-[#002143]">
            {role === 'student' ? 'Báo cáo Học tập' : role === 'teacher' ? 'Báo cáo Giảng dạy' : 'Thống kê Hệ thống'}
          </h1>
          <p className="text-[#43474e] mt-1">
            {role === 'student' ? 'Tổng quan kết quả và tiến trình của bạn' : 'Phân tích hiệu suất tổng thể'}
          </p>
        </div>
        <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#002143] px-5 py-3 focus:ring-2 focus:ring-[#13375f]/20 outline-none shadow-sm hover:border-[#13375f]/30 transition-all cursor-pointer"
        >
            <option value="7 Ngày">7 Ngày qua</option>
            <option value="30 Ngày">30 Ngày qua</option>
            <option value="Tháng Này">Tháng này</option>
            <option value="Tất Cả">Tất cả thời gian</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {role === 'student' ? (
          <>
            <div className="bg-[#13375f] p-6 rounded-[2rem] text-white">
              <span className="material-symbols-outlined text-[#82a1cf] text-2xl">schedule</span>
              <h3 className="text-3xl font-bold mt-4">{overview.total_hours || 0}h</h3>
              <p className="text-[#82a1cf] text-sm">Tổng giờ học</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-[#002143] text-2xl">emoji_events</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">{overview.avg_score || 0}<span className="text-base text-[#43474e] font-normal">/10</span></h3>
              <p className="text-[#43474e] text-sm">Điểm TB</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-emerald-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">{overview.completion_rate || 0}%</h3>
              <p className="text-[#43474e] text-sm">Tỷ lệ hoàn thành</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-[#73000a] text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">{overview.streak || 0}</h3>
              <p className="text-[#43474e] text-sm">Streak hiện tại</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-[#13375f] p-6 rounded-[2rem] text-white">
              <span className="material-symbols-outlined text-[#82a1cf] text-2xl">group</span>
              <h3 className="text-3xl font-bold mt-4">{role === 'admin' ? adminStats.total_students || 0 : teacherStats.total_students || 0}</h3>
              <p className="text-[#82a1cf] text-sm">Tổng học viên</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-emerald-500 text-2xl">trending_up</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">+{role === 'admin' ? adminStats.new_enrollment_rate || 0 : 12}%</h3>
              <p className="text-[#43474e] text-sm">Tăng trưởng</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-amber-500 text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">{role === 'admin' ? '4.8' : teacherStats.avg_rating || '0.0'}</h3>
              <p className="text-[#43474e] text-sm">Đánh giá TB</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm">
              <span className="material-symbols-outlined text-[#002143] text-2xl">payments</span>
              <h3 className="text-3xl font-bold text-[#002143] mt-4">{role === 'admin' ? `${Number(adminStats.monthly_revenue || 0).toLocaleString()}đ` : 'Chưa cập nhật'}</h3>
              <p className="text-[#43474e] text-sm">Doanh thu (VNĐ)</p>
            </div>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        {isLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-[2rem]">
                <div className="w-8 h-8 border-4 border-[#13375f] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
        
        {/* Learning Time / Activity Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-lg font-headline font-bold text-[#002143] mb-6 flex justify-between items-center">
            {role === 'student' ? 'Thời gian học tập' : 'Hoạt động'}
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{timeRange}</span>
          </h3>
          <div className="flex items-end gap-3 h-48 mb-4">
            {(role === 'student' ? activity : activity.slice(activity.length - 6)).map((a, i) => {
              const val = a.minutes || a.hours || 0;
              const h = Math.min((val / (role === 'student' ? 120 : 100)) * 100, 100);
              return (
                <div key={i} className="flex-1 rounded-t-lg transition-all duration-500 hover:opacity-80" style={{ height: `${Math.max(h, 5)}%`, backgroundColor: i === (role === 'student' ? 3 : 5) ? '#73000a' : '#002143' }}></div>
              );
            })}
          </div>
          <div className="flex justify-between text-[10px] text-[#73777f] font-bold uppercase tracking-wider">
            {role === 'student'
              ? activity.map((d, i) => <span key={i}>{d.day || d.date}</span>)
              : activity.slice(activity.length - 6).map((d, i) => <span key={i}>T{d.month}</span>)
            }
          </div>
        </div>

        {/* Skills / Performance Breakdown */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm">
          <h3 className="text-lg font-headline font-bold text-[#002143] mb-6">
            {role === 'student' ? 'Phân tích kỹ năng' : 'Phân bổ khóa học'}
          </h3>
          <div className="space-y-5">
            {role === 'student' ? (
              <>
                {[
                  { skill: 'Listening', percent: skills.listening || 0, color: 'bg-[#002143]' },
                  { skill: 'Reading', percent: skills.reading || 0, color: 'bg-[#13375f]' },
                  { skill: 'Writing', percent: skills.writing || 0, color: 'bg-[#73000a]' },
                  { skill: 'Speaking', percent: skills.speaking || 0, color: 'bg-amber-500' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-[#002143]">{s.skill}</span>
                      <span className="text-sm font-bold text-[#002143]">{s.percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f4f3f7] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {[
                  { label: 'IELTS Preparation', percent: 45, color: 'bg-[#002143]' },
                  { label: 'Business English', percent: 25, color: 'bg-[#13375f]' },
                  { label: 'TOEIC', percent: 18, color: 'bg-[#73000a]' },
                  { label: 'Grammar & Vocab', percent: 12, color: 'bg-amber-500' },
                ].map((s, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-[#002143]">{s.label}</span>
                      <span className="text-sm font-bold text-[#002143]">{s.percent}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-[#f4f3f7] rounded-full overflow-hidden">
                      <div className={`h-full ${s.color} rounded-full transition-all duration-700`} style={{ width: `${s.percent}%` }}></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm">
        <h3 className="text-lg font-headline font-bold text-[#002143] mb-6">Hoạt động gần đây</h3>
        <div className="space-y-4">
          {[
            { icon: 'check_circle', text: role === 'student' ? 'Hoàn thành bài Listening Test 4' : 'Chấm 15 bài Writing Task 2', time: '2 giờ trước', color: 'text-emerald-500' },
            { icon: 'quiz', text: role === 'student' ? 'Làm quiz Vocabulary: 9/10 điểm' : 'Tạo Quiz: Academic Vocabulary Set 3', time: '5 giờ trước', color: 'text-[#002143]' },
            { icon: 'upload_file', text: role === 'student' ? 'Nộp bài Writing Task 1' : 'Upload slide bài giảng Speaking', time: '1 ngày trước', color: 'text-[#13375f]' },
            { icon: 'star', text: role === 'student' ? 'Nhận badge "Vocabulary Master"' : 'Nhận đánh giá 5 sao từ học viên', time: '2 ngày trước', color: 'text-amber-500' },
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-[#f4f3f7] rounded-2xl">
              <span className={`material-symbols-outlined ${a.color} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{a.icon}</span>
              <p className="flex-1 text-sm text-[#002143]">{a.text}</p>
              <p className="text-xs text-[#43474e]">{a.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
