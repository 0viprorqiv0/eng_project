import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

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
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-xl font-headline font-bold text-[#002143]">Phân tích doanh thu</h3>
                <p className="text-sm text-[#43474e]">Tăng trưởng doanh thu 6 tháng gần nhất</p>
              </div>
              <select className="bg-[#f4f3f7] border-none rounded-xl text-xs font-bold text-[#002143] px-4 py-2 focus:ring-0">
                <option>Năm 2024</option>
                <option>Năm 2023</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-4 px-2 relative">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(i => <div key={i} className="w-full border-t border-slate-100 h-0"></div>)}
              </div>
              {revenue.length > 0 ? revenue.map((item, i) => {
                const maxRev = Math.max(...revenue.map(r => r.revenue), 1);
                const h = (item.revenue / maxRev) * 100;
                const months = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
                return (
                  <div key={i} className="flex-1 bg-[#d4e3ff]/30 rounded-t-lg relative group" style={{ height: `${Math.max(h, 2) + 10}%` }}>
                    <div className="absolute inset-x-0 bottom-0 bg-[#002143] rounded-t-lg group-hover:opacity-80 transition-all duration-500" style={{ height: `${h}%` }}></div>
                    <div className="absolute opacity-0 group-hover:opacity-100 -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap z-10">{Number(item.revenue).toLocaleString()}đ</div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#73777f]">{months[i]}</span>
                  </div>
                );
              }) : [
                { h: 60, label: 'JAN' }, { h: 40, label: 'FEB' }, { h: 85, label: 'MAR' },
                { h: 30, label: 'APR' }, { h: 75, label: 'MAY' }, { h: 95, label: 'JUN' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 bg-[#d4e3ff]/30 rounded-t-lg relative group" style={{ height: `${bar.h + 20}%` }}>
                  <div className={`absolute inset-x-0 bottom-0 ${i === 5 ? 'bg-[#73000a]' : 'bg-[#002143]'} rounded-t-lg group-hover:opacity-80 transition-all duration-500`} style={{ height: `${bar.h}%` }}></div>
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-[#73777f]">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Students Table */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-[#002143]">Học viên mới nhất</h3>
              <button onClick={() => navigate('/dashboard/reports')} className="text-[#002143] text-sm font-bold hover:underline">Xem tất cả</button>
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
              {[
                { name: 'IELTS Listening Strategies', students: '850 học viên', rating: '4.9/5 ★' },
                { name: 'Academic Writing 101', students: '620 học viên', rating: '4.7/5 ★' },
                { name: 'TOEIC Vocabulary Pro', students: '540 học viên', rating: '4.8/5 ★' },
              ].map((course, i) => (
                <div key={i} className="flex gap-4 items-center group cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-white flex-shrink-0 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#002143] text-2xl group-hover:scale-110 transition-transform duration-500">menu_book</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-[#002143] text-sm line-clamp-1">{course.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[#4b0004] font-bold text-xs">{course.students}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span className="text-[#43474e] text-[10px]">{course.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/dashboard/reports')} className="w-full mt-8 py-3 rounded-xl border border-[#002143]/10 text-[#002143] font-bold text-sm hover:bg-white transition-colors active:scale-95">
              Xem tất cả báo cáo
            </button>
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
