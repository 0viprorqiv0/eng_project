import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { BookOpen, PenTool, Globe, History } from 'lucide-react';

export function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || 'Admin';

  const [stats, setStats] = useState<any>({ 
    total_students: 0, total_courses: 0, monthly_revenue: 0, new_enrollment_rate: 0, new_students_this_month: 0, upcoming_sessions: 0
  });
  const [revenue, setRevenue] = useState<any[]>([]);
  const [recentEnrollments, setRecentEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonthData, setSelectedMonthData] = useState<any>(null);

  // Modal
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', slug: '', category: 'Lớp 12', level: '', price: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [statsData, revenueData, recentData] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/revenue'),
          api.get('/admin/recent-enrollments')
        ]);
        if (statsData) setStats(statsData);
        if (revenueData) setRevenue(revenueData);
        if (recentData) setRecentEnrollments(recentData);
      } catch (err) {
        console.error('Failed to load admin dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-10">
      {/* Welcome Header */}
      <section className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-headline font-extrabold text-[#002143] tracking-tight">Chào mừng trở lại, {name}!</h2>
          <p className="text-[#43474e] mt-1">Hôm nay là một ngày tuyệt vời để quản lý sự tiến bộ của học viên.</p>
        </div>
        <button onClick={() => navigate('/dashboard/create-course')} className="bg-[#73000a] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-[#73000a]/20 transition-all active:scale-95">
          <span className="material-symbols-outlined text-sm">add</span>
          Tạo khóa học mới
        </button>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: 'group', label: 'Tổng số học viên', value: isLoading ? '...' : stats.total_students, trend: `${stats.new_enrollment_rate}%`, trendIcon: stats.new_enrollment_rate >= 0 ? 'trending_up' : 'trending_down', iconBg: 'bg-[#d4e3ff]', iconColor: 'text-[#002143]' },
          { icon: 'book', label: 'Tổng số khóa học', value: isLoading ? '...' : stats.total_courses, trend: 'Tháng này', trendIcon: '', iconBg: 'bg-[#cee5ff]', iconColor: 'text-[#041d30]' },
          { icon: 'payments', label: 'Doanh thu tháng', value: isLoading ? '...' : `${Number(stats.monthly_revenue).toLocaleString()}đ`, trend: 'Mục tiêu 80%', trendIcon: '', iconBg: 'bg-[#ffdad6]', iconColor: 'text-[#410003]' },
          { icon: 'person_add', label: 'Học viên mới tháng này', value: isLoading ? '...' : stats.new_students_this_month, trend: `${stats.new_enrollment_rate}%`, trendIcon: 'arrow_upward', iconBg: 'bg-[#fff4e5]', iconColor: 'text-[#b45d00]' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm hover:-translate-y-1 transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 ${stat.iconBg} flex items-center justify-center rounded-xl ${stat.iconColor}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              {stat.trendIcon && (
                <span className="text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">{stat.trendIcon}</span> {stat.trend}
                </span>
              )}
            </div>
            <p className="text-[#43474e] text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-headline font-bold text-[#002143] mt-1">{stat.value}</h3>
          </div>
        ))}
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart Section */}
        <section className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#002143]">Phân tích doanh thu</h3>
                <p className="text-sm text-[#43474e] mt-1">Tăng trưởng doanh thu 6 tháng gần nhất</p>
              </div>
              <div className="cursor-pointer text-[11px] px-3 py-1.5 bg-slate-100/80 hover:bg-slate-200 rounded-lg font-bold text-[#002143] flex items-center gap-1 transition-colors">
                Năm {new Date().getFullYear()} <span className="material-symbols-outlined text-[14px]">keyboard_arrow_down</span>
              </div>
            </div>
            
            <div className="flex items-end justify-between gap-2 h-56 px-2">
              {isLoading ? (
                  <div className="w-full flex items-center justify-center text-[#51667c] text-sm italic">Đang tải dữ liệu...</div>
              ) : revenue.length > 0 ? (
                  revenue.map((m, i) => {
                      const maxRevenue = Math.max(...revenue.map(d => d.revenue), 1);
                      const h = (m.revenue / maxRevenue) * 100;
                      const isMax = h >= 99.9;
                      const monthsMap = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
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

          {/* New Students Table */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-[#002143]">Học viên mới nhất</h3>
              <button 
                onClick={() => navigate('/dashboard/admin/users')}
                className="text-xs font-bold text-[#002143] hover:text-[#73000a] flex items-center gap-1 transition-colors group"
              >
                Xem tất cả <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#73777f] text-xs uppercase tracking-wider">
                    <th className="pb-4 font-bold">Học viên</th>
                    <th className="pb-4 font-bold">Khóa học</th>
                    <th className="pb-4 font-bold">Ngày đăng ký</th>
                    <th className="pb-4 font-bold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoading && <tr><td colSpan={4} className="py-4 text-center text-sm text-[#43474e]">Đang tải...</td></tr>}
                  {!isLoading && recentEnrollments.length === 0 && <tr><td colSpan={4} className="py-4 text-center text-sm text-[#43474e]">Chưa có lượt đăng ký nào</td></tr>}
                  {!isLoading && recentEnrollments.map((s, i) => (
                    <tr key={i} className="group hover:bg-slate-50 transition-colors">
                      <td className="py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#13375f] flex items-center justify-center text-white text-xs font-bold">{s.student[0]}</div>
                        <span className="font-bold text-[#002143]">{s.student}</span>
                      </td>
                      <td className="py-4 text-[#43474e]">{s.course}</td>
                      <td className="py-4 text-[#43474e]">{s.date}</td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.status === 'Mới' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Sidebar Content */}
        <section className="space-y-8">
          <div className="bg-[#002143] p-8 rounded-[2rem] text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-bold mb-2">BeeLearn Insights</h3>
              <p className="text-[#13375f] text-sm leading-relaxed mb-6 text-[#82a1cf]">Bạn có 3 phiên trực tuyến sắp bắt đầu trong 30 phút tới. Đừng quên kiểm tra phòng chờ!</p>
              <div className="flex -space-x-3">
                {['N', 'T', 'L'].map((l, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-[#002143] bg-[#13375f] flex items-center justify-center text-white text-xs font-bold">{l}</div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-[#002143] bg-[#13375f] flex items-center justify-center text-[10px] font-bold text-white">+12</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#73000a]/30 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          </div>

          <div className="bg-[#f4f3f7] p-8 rounded-[2rem]">
            <h3 className="text-lg font-headline font-bold text-[#002143] mb-6">Khóa học phổ biến nhất</h3>
            <div className="space-y-6">
              {stats.popular_courses && stats.popular_courses.length > 0 ? (
                stats.popular_courses.map((course: any, i: number) => (
                  <div key={i} className="flex gap-4 items-center group cursor-pointer">
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
                        <div className={`w-14 h-14 rounded-2xl ${color} flex-shrink-0 flex items-center justify-center`}>
                          <Icon size={24} className="group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      );
                    })()}
                    <div className="flex-1">
                      <h4 className="font-bold text-[#002143] text-sm line-clamp-1">{course.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[#4b0004] font-bold text-xs">{course.students} học viên</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className="text-[#43474e] text-[10px]">{course.rating}/5 ★</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-[#43474e] text-center py-4">Chưa có dữ liệu khóa học</p>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="bg-white p-6 rounded-[2rem] shadow-sm relative overflow-visible">
            <div className="-mt-12 mb-4 w-12 h-12 bg-[#4b0004] flex items-center justify-center rounded-2xl text-white shadow-xl shadow-[#4b0004]/20">
              <span className="material-symbols-outlined">support_agent</span>
            </div>
            <h4 className="font-headline font-bold text-[#002143]">Cần hỗ trợ kỹ thuật?</h4>
            <p className="text-[#43474e] text-xs mt-2 leading-relaxed">Đội ngũ kỹ thuật của chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7.</p>
            <a className="inline-block mt-4 text-[#4b0004] text-xs font-bold hover:underline" href="#">Liên hệ ngay →</a>
          </div>
        </section>
      </div>

      {/* Detail Modal */}
      {selectedMonthData && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedMonthData(null)}>
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

      {/* Admin Modals */}
      {showCreateCourse && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f4f3f7]">
                    <h3 className="font-bold text-[#002143] text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#73000a]">add_circle</span>
                        Tạo Khóa Học Mới
                    </h3>
                    <button onClick={() => {setShowCreateCourse(false); setNewCourse({ title: '', slug: '', category: 'Lớp 12', level: '', price: '', description: '' });}} className="text-slate-400 hover:text-red-500 transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-bold text-[#002143] mb-2">Tên khóa học *</label>
                        <input 
                            value={newCourse.title}
                            onChange={e => setNewCourse(p => ({ ...p, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }))}
                            placeholder="Ví dụ: IELTS Mastery Band 8.0..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#73000a]/20" 
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Danh mục</label>
                            <select
                                value={newCourse.category}
                                onChange={e => setNewCourse(p => ({ ...p, category: e.target.value }))}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none"
                            >
                                <option>Lớp 12</option>
                                <option>IELTS</option>
                                <option>Người đi làm</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Mục tiêu</label>
                            <input 
                                value={newCourse.level}
                                onChange={e => setNewCourse(p => ({ ...p, level: e.target.value }))}
                                placeholder="VD: Mục tiêu 7+" 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#002143] mb-2">Giá khóa học</label>
                        <input 
                            value={newCourse.price}
                            onChange={e => setNewCourse(p => ({ ...p, price: e.target.value }))}
                            placeholder="VD: 2.500.000đ" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#002143] mb-2">Mô tả ngắn</label>
                        <textarea 
                            value={newCourse.description}
                            onChange={e => setNewCourse(p => ({ ...p, description: e.target.value }))}
                            placeholder="Mô tả nội dung và mục tiêu khóa học..."
                            className="w-full h-24 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none resize-none"
                        ></textarea>
                    </div>
                </div>
                <div className="p-6 pt-0 flex gap-3">
                    <button onClick={() => {setShowCreateCourse(false); setNewCourse({ title: '', slug: '', category: 'Lớp 12', level: '', price: '', description: '' });}} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                    <button 
                        onClick={async () => {
                            if(!newCourse.title.trim()) return;
                            setCreating(true);
                            try {
                                await api.post('/courses', {
                                    title: newCourse.title,
                                    slug: newCourse.slug || newCourse.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                                    category: newCourse.category,
                                    level: newCourse.level || null,
                                    price: newCourse.price || null,
                                    description: newCourse.description || null,
                                    status: 'draft',
                                });
                                setShowCreateCourse(false);
                                setNewCourse({ title: '', slug: '', category: 'Lớp 12', level: '', price: '', description: '' });
                                alert('Đã tạo khóa học thành công!');
                                window.location.reload();
                            } catch (err: any) {
                                alert(err?.message || 'Tạo khóa học thất bại. Vui lòng thử lại.');
                            } finally {
                                setCreating(false);
                            }
                        }} 
                        disabled={!newCourse.title.trim() || creating}
                        className="flex-1 py-3 bg-[#73000a] text-white font-bold rounded-xl hover:bg-[#4b0004] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        {creating ? <><span className="animate-spin">⏳</span> Đang tạo...</> : 'Khởi tạo khóa học'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
