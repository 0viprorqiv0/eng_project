import React, { useEffect, useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { BookOpen, PenTool, Globe, History } from 'lucide-react';

export const AdminOverviewPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || 'Admin';

  const [stats, setStats] = useState<any>({ total_students: 0, total_courses: 0, monthly_revenue: 0, new_enrollment_rate: 0, student_trend: 0, course_trend: 0 });
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(true);
  const [selectedMonthData, setSelectedMonthData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, activitiesRes] = await Promise.all([
          api.get('/admin/stats').catch(() => null),
          api.get('/admin/recent-enrollments?limit=5').catch(() => [])
        ]);
        if (statsRes) setStats(statsRes);
        if (Array.isArray(activitiesRes)) setRecentActivities(activitiesRes);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRevenue = async () => {
      try {
        setIsChartLoading(true);
        const revenueRes = await api.get('/admin/revenue').catch(() => []);
        if (Array.isArray(revenueRes)) {
            setRevenueData(revenueRes);
        }
      } catch (err) {
        console.error('Failed to load revenue data:', err);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchData();
    fetchRevenue();
  }, []);

  const monthsMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="flex flex-col lg:flex-row items-start justify-between gap-6">
        <div>
          <h2 className="font-headline text-[2rem] font-extrabold text-[#002143] tracking-tight leading-tight italic">
            Chào mừng trở lại, {name}!
          </h2>
          <p className="text-[#51667c] text-base mt-2 leading-relaxed">
            Hôm nay là một ngày tuyệt vời để quản lý sự tiến bộ của học viên.
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/create-course')}
          className="bg-[#ba1a1a] hover:bg-[#93000a] text-white px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-[#ba1a1a]/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Tạo khóa học mới
        </button>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1 - Total Students */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#13375f]/10 rounded-2xl flex items-center justify-center text-[#13375f] group-hover:bg-[#13375f] group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">school</span>
            </div>
            <span className={`text-[11px] font-bold ${stats.student_trend >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full flex items-center gap-1`}>
              <span className="material-symbols-outlined text-xs">{stats.student_trend >= 0 ? 'trending_up' : 'trending_down'}</span> {Math.abs(stats.student_trend)}%
            </span>
          </div>
          <p className="text-xs text-[#51667c] font-medium mb-1">Tổng số học viên</p>
          <h3 className="font-headline text-3xl font-extrabold text-[#002143]">
            {stats.total_students?.toLocaleString() || '12,450'}
          </h3>
        </div>

        {/* Card 2 - Total Courses */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#002143]/10 rounded-2xl flex items-center justify-center text-[#002143] group-hover:bg-[#002143] group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">library_books</span>
            </div>
            <span className={`text-[11px] font-bold ${stats.course_trend >= 0 ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'} px-2 py-1 rounded-full flex items-center gap-1`}>
              <span className="material-symbols-outlined text-xs">{stats.course_trend >= 0 ? 'trending_up' : 'trending_down'}</span> {Math.abs(stats.course_trend)}%
            </span>
          </div>
          <p className="text-xs text-[#51667c] font-medium mb-1">Tổng số khóa học</p>
          <h3 className="font-headline text-3xl font-extrabold text-[#002143]">
            {stats.total_courses || '156'}
          </h3>
        </div>

        {/* Card 3 - Revenue */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-[#ba1a1a]/10 rounded-2xl flex items-center justify-center text-[#ba1a1a] group-hover:bg-[#ba1a1a] group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">payments</span>
            </div>
            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Mục tiêu 80%</span>
          </div>
          <p className="text-xs text-[#51667c] font-medium mb-1">Doanh thu tháng</p>
          <h3 className="font-headline text-3xl font-extrabold text-[#002143]">
            {stats.monthly_revenue ? `${Number(stats.monthly_revenue).toLocaleString('vi-VN')} VNĐ` : '0 VNĐ'}
          </h3>
        </div>

        {/* Card 4 - New Enrollment */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 group hover:shadow-md transition-all">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              <span className="material-symbols-outlined text-2xl">person_add</span>
            </div>
            <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">arrow_upward</span> 25%
            </span>
          </div>
          <p className="text-xs text-[#51667c] font-medium mb-1">Tỷ lệ đăng ký mới</p>
          <h3 className="font-headline text-3xl font-extrabold text-[#002143]">
            {stats.new_enrollment_rate >= 0 ? '+' : ''}{stats.new_enrollment_rate}%
          </h3>
        </div>
      </section>

      {/* Revenue Chart + Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <h4 className="font-headline text-xl font-bold text-[#002143]">Phân tích doanh thu</h4>
              <p className="text-xs text-[#51667c] mt-1">Tăng trưởng doanh thu 6 tháng gần nhất</p>
            </div>
            <div className="cursor-pointer text-[11px] px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 rounded-lg font-bold text-[#002143] flex items-center gap-1 transition-colors">
              Năm {new Date().getFullYear()} <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>
            </div>
          </div>
          <div className="flex items-end justify-between gap-2 h-56 px-2">
            {isChartLoading ? (
                <div className="w-full flex items-center justify-center text-[#51667c] text-sm italic">Đang tải dữ liệu...</div>
            ) : revenueData.length > 0 ? (
                revenueData.map((m, i) => {
                    const maxRevenue = Math.max(...revenueData.map(d => d.revenue), 1);
                    const h = (m.revenue / maxRevenue) * 100;
                    const isMax = h >= 99.9;
                    return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                            <div className="w-full relative flex items-end justify-center h-48">
                                {/* Track background */}
                                <div className="absolute inset-x-0 bottom-0 top-0 bg-[#f4f7fb] rounded-t-md"></div>
                                
                                {/* Fill bar */}
                                <div
                                    onClick={() => setSelectedMonthData(m)}
                                    className={`relative z-10 w-full rounded-t-md transition-all duration-700 cursor-pointer ${isMax ? 'bg-[#6b1418] hover:bg-[#4d0c10]' : 'bg-[#18283f] hover:bg-[#0c141d]'}`}
                                    style={{ height: `${Math.max(h, 1)}%` }}
                                />
                                
                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-3 opacity-0 group-hover:opacity-100 bg-[#002143] text-white text-[11px] font-bold py-1.5 px-2.5 rounded-lg whitespace-nowrap z-20 pointer-events-none transition-all shadow-xl shadow-[#002143]/20 translate-y-2 group-hover:translate-y-0">
                                    {Number(m.revenue).toLocaleString('vi-VN')} VNĐ
                                </div>
                            </div>
                            <span className="text-[10px] font-extrabold tracking-widest text-[#51667c] uppercase">{monthsMap[m.month - 1]}</span>
                        </div>
                    );
                })
            ) : (
                <div className="w-full flex items-center justify-center text-[#51667c] text-sm italic border-t border-slate-100 h-full">Không có dữ liệu doanh thu</div>
            )}
          </div>
        </div>

        {/* BeeLearn Insights */}
        <div className="bg-[#002143] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <h4 className="font-headline text-xl font-bold">Thông tin BeeLearn</h4>
            <p className="text-[#82a1cf] text-sm mt-3 leading-relaxed">
              Bạn có {stats.upcoming_sessions || 0} lịch học/tư vấn sẽ diễn ra trong tuần này. Chuẩn bị tài liệu kỹ càng nhé!
            </p>
          </div>
          <div className="flex items-center gap-2 mt-6 relative z-10">
            <div className="flex -space-x-2">
              <img src="https://ui-avatars.com/api/?name=A&background=ba1a1a&color=fff&size=32" className="w-8 h-8 rounded-full border-2 border-[#002143]" alt="" />
              <img src="https://ui-avatars.com/api/?name=B&background=13375f&color=fff&size=32" className="w-8 h-8 rounded-full border-2 border-[#002143]" alt="" />
              <img src="https://ui-avatars.com/api/?name=C&background=73000a&color=fff&size=32" className="w-8 h-8 rounded-full border-2 border-[#002143]" alt="" />
            </div>
            <span className="text-xs font-bold text-[#82a1cf] bg-white/10 px-2 py-1 rounded-full">+12</span>
          </div>
          {/* Decorative shapes */}
          <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-[#73000a]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-48 h-48 bg-[#cee5ff]/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Recent Students + Popular Courses */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Students Table */}
        <div className="lg:col-span-2 bg-[#f4f3f7] rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-headline text-xl font-bold text-[#002143]">Học viên mới nhất</h4>
            <button onClick={() => navigate('/dashboard/admin/users')} className="text-sm font-bold text-[#13375f] hover:text-[#002143] flex items-center gap-1 transition-colors">
              Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-6 py-4 text-[10px] font-bold text-[#43474e] uppercase tracking-widest">Học viên</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#43474e] uppercase tracking-widest">Khóa học</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#43474e] uppercase tracking-widest">Ngày đăng ký</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-[#43474e] uppercase tracking-widest">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr><td colSpan={4} className="text-center py-8 text-[#51667c]">Đang tải...</td></tr>
                ) : recentActivities.length > 0 ? (
                  recentActivities.map((act, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${act.student}&background=f1f5f9&color=002143&size=36`} className="w-9 h-9 rounded-full" alt="" />
                          <span className="text-sm font-bold text-[#002143]">{act.student}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#51667c] font-medium">{act.course}</td>
                      <td className="px-6 py-4 text-sm text-[#51667c]">{act.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          act.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>{act.status}</span>
                      </td>
                    </tr>
                  ))
                ) : (
                  /* Fallback mock data */
                  [
                    { name: 'Nguyễn Văn An', course: 'Làm chủ IELTS 7.5+', date: '24/05/2024', status: 'Đã hoàn thành' },
                    { name: 'Lê Thị Mai', course: 'Giao tiếp trong kinh doanh', date: '23/05/2024', status: 'Đang xử lý' },
                    { name: 'Trần Minh Quân', course: 'Luyện cấp tốc TOEIC 800', date: '22/05/2024', status: 'Đã hoàn thành' },
                  ].map((s, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${s.name}&background=f1f5f9&color=002143&size=36`} className="w-9 h-9 rounded-full" alt="" />
                          <span className="text-sm font-bold text-[#002143]">{s.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#51667c] font-medium">{s.course}</td>
                      <td className="px-6 py-4 text-sm text-[#51667c]">{s.date}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${
                          s.status === 'Đã hoàn thành' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>{s.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Popular Courses + Support */}
        <div className="space-y-6">
          {/* Popular Courses */}
          <div className="bg-[#f4f3f7] p-6 rounded-3xl">
            <h4 className="font-headline text-lg font-bold text-[#002143] mb-5">Khóa học phổ biến nhất</h4>
            <div className="space-y-4">
              {stats.popular_courses && stats.popular_courses.length > 0 ? (
                stats.popular_courses.map((c: any, i: number) => (
                  <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                    {(() => {
                      const icons = [BookOpen, PenTool, Globe, History];
                      const colors = [
                        'bg-blue-50 text-blue-600',
                        'bg-indigo-50 text-indigo-600',
                        'bg-cyan-50 text-cyan-600',
                        'bg-amber-50 text-amber-600',
                      ];
                      const Icon = icons[i % icons.length];
                      const color = colors[i % colors.length];
                      return (
                        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon size={22} />
                        </div>
                      );
                    })()}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#002143] truncate">{c.name}</p>
                      <p className="text-[11px] text-[#51667c]">{c.students} học viên • {c.rating}/5 ⭐</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#51667c] text-center py-4">Chưa có dữ liệu khóa học</p>
              )}
            </div>
          </div>

          {/* Technical Support */}
          <div className="bg-[#f4f3f7] p-6 rounded-3xl">
            <div className="w-12 h-12 bg-[#13375f] rounded-xl flex items-center justify-center text-white mb-4">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <h4 className="font-bold text-[#002143] text-base">Cần hỗ trợ kỹ thuật?</h4>
            <p className="text-xs text-[#51667c] mt-2 leading-relaxed">
              Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.
            </p>
            <button className="mt-4 text-[#13375f] font-bold text-sm flex items-center gap-1 hover:text-[#002143] transition-colors">
              Liên hệ ngay <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedMonthData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMonthData(null)}>
          <div className="bg-white rounded-[2rem] w-full max-w-sm p-8 shadow-2xl relative" onClick={e => e.stopPropagation()}>
             <button onClick={() => setSelectedMonthData(null)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
               <span className="material-symbols-outlined">close</span>
             </button>
             <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-2xl">insights</span>
             </div>
             <h3 className="font-headline text-2xl font-bold text-[#002143] mb-6">Chi tiết Tháng {selectedMonthData.month}/{selectedMonthData.year}</h3>
             <div className="space-y-4">
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                     <p className="text-xs text-[#51667c] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">payments</span> Doanh thu
                     </p>
                     <p className="font-extrabold text-[#ba1a1a] text-xl">{Number(selectedMonthData.revenue).toLocaleString('vi-VN')} VNĐ</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                     <p className="text-xs text-[#51667c] font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">school</span> Học viên đăng ký
                     </p>
                     <p className="font-extrabold text-[#002143] text-xl">{selectedMonthData.enrollments || 0} học viên</p>
                 </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
