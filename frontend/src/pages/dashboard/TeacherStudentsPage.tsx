import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, UserPlus, CheckCircle, AlertTriangle, 
  Search, Filter, Download, Plus, MoreVertical,
  ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import { api } from '../../lib/api';

interface KPI {
  total_students: number;
  new_students: number;
  avg_completion: number;
  needs_help: number;
}

interface StudentItem {
  id: number;
  user_id: number;
  course_id: number;
  progress: number;
  status: string;
  enrolled_term: string;
  avg_score: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
  };
  course: {
    id: number;
    title: string;
  };
}

interface PageData {
  kpis: KPI;
  students: {
    data: StudentItem[];
    current_page: number;
    last_page: number;
    total: number;
  }
}

export function TeacherStudentsPage() {
  const [data, setData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const [courses, setCourses] = useState<any[]>([]);

  // Thêm debounce cho search field
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        search: debouncedSearch,
        course_id: courseFilter,
        status: statusFilter
      });
      const [res, coursesRes] = await Promise.all([
        api.get(`/teacher/students?${query.toString()}`),
        api.get('/my-courses')
      ]);
      setData(res);
      // only set courses if not already set to avoid re-renders
      if (courses.length === 0) setCourses(coursesRes);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, debouncedSearch, courseFilter, statusFilter]);

  const handleFilterChange = (setter: any, val: any) => {
    setter(val);
    setPage(1); // Reset trang 1 khi lọc
  };

  // UI Helpers
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold whitespace-nowrap">Đang học</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold whitespace-nowrap">Hoàn thành</span>;
      case 'paused':
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold whitespace-nowrap">Tạm dừng</span>;
    }
  };

  const renderScoreBadge = (score: number) => {
    if (score === 0) return <span className="text-gray-400 font-bold">--</span>;
    let colorClass = 'text-green-600 bg-green-50';
    if (score < 5) colorClass = 'text-red-600 bg-red-50';
    else if (score < 8) colorClass = 'text-orange-600 bg-orange-50';
    
    return <span className={`px-3 py-1.5 rounded-xl font-black ${colorClass}`}>{score.toFixed(1)}</span>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h3 className="text-beered font-bold text-sm tracking-widest uppercase mb-2">Hệ thống BeeLearn</h3>
          <h1 className="text-4xl font-black text-navy mb-3">Quản lý học sinh</h1>
          <p className="text-gray-500 font-medium max-w-xl">
            Theo dõi lộ trình học tập, điểm số và tương tác trực tiếp với các học sinh trong danh sách.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors shadow-sm">
            <Download size={18} />
            Xuất báo cáo
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-beered text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-[0_4px_14px_0_rgba(226,30,45,0.39)]">
            <Plus size={18} />
            Thêm học sinh mới
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-[0.03]">
            <Users size={120} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-2">Tổng số học sinh</p>
          <h2 className="text-4xl font-black text-navy">{data?.kpis.total_students.toLocaleString() || '...'}</h2>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded w-fit">
            ↗ +12% tháng này
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-[0.03]">
            <UserPlus size={120} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-2">Học sinh mới</p>
          <h2 className="text-4xl font-black text-navy">{data?.kpis.new_students.toLocaleString() || '...'}</h2>
          <p className="text-xs text-gray-400 font-medium mt-4">Tham gia trong 30 ngày qua</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 opacity-[0.03]">
            <CheckCircle size={120} />
          </div>
          <p className="text-sm font-bold text-gray-500 mb-2">Hoàn thành trung bình</p>
          <h2 className="text-4xl font-black text-navy">{data?.kpis.avg_completion || 0}%</h2>
          <div className="w-full bg-gray-100 h-2 rounded-full mt-4 overflow-hidden">
             <div className="bg-navy h-full rounded-full" style={{ width: `${data?.kpis.avg_completion || 0}%` }} />
          </div>
        </div>

        <div className="bg-red-50/50 p-6 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden flex flex-col justify-center">
          <div className="absolute -right-4 -top-4 text-beered opacity-[0.05]">
            <AlertTriangle size={120} />
          </div>
          <p className="text-sm font-bold text-red-800 mb-2">Cần hỗ trợ</p>
          <h2 className="text-4xl font-black text-beered">{data?.kpis.needs_help.toLocaleString() || '...'}</h2>
          <button className="text-xs font-bold text-beered mt-4 hover:underline text-left w-fit relative z-10">
            Xem danh sách ngay
          </button>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col min-h-[500px]">
        {/* Toolbar */}
        <div className="p-6 md:p-8 border-b border-gray-100 flex flex-col lg:flex-row gap-4 justify-between bg-white relative z-20">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text"
              placeholder="Tìm kiếm theo tên hoặc email học sinh..."
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-transparent focus:border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-colors focus:outline-none focus:ring-4 focus:ring-gray-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 items-center overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <select 
              value={courseFilter}
              onChange={(e) => handleFilterChange(setCourseFilter, e.target.value)}
              className="px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 min-w-[200px] outline-none hover:border-gray-300 focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all text-ellipsis"
            >
              <option value="all">Tất cả khóa học</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.title}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              className="px-4 py-3.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 min-w-[170px] outline-none hover:border-gray-300 focus:border-navy focus:ring-4 focus:ring-navy/5 transition-all"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang học</option>
              <option value="completed">Hoàn thành</option>
              <option value="paused">Tạm dừng</option>
            </select>
            
            <button className="p-3.5 border border-gray-200 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0">
              <Filter size={20} />
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto flex-grow bg-white">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="py-5 px-8 text-xs font-black text-gray-500 uppercase tracking-widest w-[30%]">Học viên</th>
                <th className="py-5 px-4 text-xs font-black text-gray-500 uppercase tracking-widest w-[25%]">Khóa học</th>
                <th className="py-5 px-4 text-xs font-black text-gray-500 uppercase tracking-widest w-[20%]">Tiến độ</th>
                <th className="py-5 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Điểm TB</th>
                <th className="py-5 px-4 text-xs font-black text-gray-500 uppercase tracking-widest">Trạng thái</th>
                <th className="py-5 px-8 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="w-10 h-10 border-4 border-navy/20 border-t-navy rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : !data || data.students.data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-500 font-medium">
                    Không tìm thấy học sinh nào phù hợp.
                  </td>
                </tr>
              ) : (
                data.students.data.map((item, index) => (
                  <tr key={`${item.id}-${index}`} className="border-b border-gray-50 hover:bg-[#fcfdfd] transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-4">
                        <img 
                          src={item.user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.user.name)}&background=random`} 
                          alt="" 
                          className="w-14 h-14 rounded-[14px] object-cover bg-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-navy text-base mb-0.5">{item.user.name}</p>
                          <p className="text-xs text-gray-500 font-medium truncate max-w-[180px]">{item.user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 pr-4 leading-tight">{item.course.title}</p>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Kỳ học: {item.enrolled_term}</p>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-navy w-8">{item.progress}%</span>
                        <div className="w-32 bg-gray-100 h-2.5 rounded-full overflow-hidden flex-shrink-0">
                          <div 
                            className={`h-full rounded-full transition-all duration-1000 ${
                              item.progress > 80 ? 'bg-emerald-500' : 
                              item.progress > 40 ? 'bg-navy' : 
                              'bg-beered'
                            }`}
                            style={{ width: `${item.progress}%` }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      {renderScoreBadge(item.avg_score)}
                    </td>
                    <td className="py-6 px-4">
                      {renderStatusBadge(item.status)}
                    </td>
                    <td className="py-6 px-8 text-right">
                      <button className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.students.last_page > 1 && (
          <div className="bg-[#f8fafc] border-t border-gray-100 px-8 py-5 flex items-center justify-between mt-auto">
            <p className="text-sm font-bold text-gray-500">
              Hiển thị <span className="text-navy">{(data.students.current_page - 1) * 10 + 1}</span> - <span className="text-navy">{Math.min(data.students.current_page * 10, data.students.total)}</span> trên <span className="text-navy">{data.students.total}</span> học viên
            </p>
            <div className="flex items-center gap-1">
              <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl font-bold bg-white border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-50 disabled:hover:border-gray-200 transition-colors shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              
              {Array.from({ length: Math.min(3, data.students.last_page) }).map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors shadow-sm ${
                    page === i + 1 
                      ? 'bg-navy text-white border border-navy' 
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              {data.students.last_page > 3 && (
                <>
                  <span className="w-8 flex justify-center text-gray-400 tracking-widest">...</span>
                  <button 
                    onClick={() => setPage(data.students.last_page)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-colors shadow-sm ${
                      page === data.students.last_page 
                        ? 'bg-navy text-white border border-navy' 
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {data.students.last_page}
                  </button>
                </>
              )}
              
              <button 
                disabled={page === data?.students.last_page}
                onClick={() => setPage(page + 1)}
                className="w-10 h-10 flex items-center justify-center rounded-xl font-bold bg-white border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-50 disabled:hover:border-gray-200 transition-colors shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Promotions / Alerts row */}
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2 bg-navy rounded-[2rem] p-8 md:p-12 text-white relative overflow-hidden flex flex-col justify-center shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4">
            <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#ffffff" d="M43.9,-70C57.4,-61.8,69,-49.5,76,-35C83,-20.5,85.5,-3.8,81.4,11.5C77.4,26.8,66.8,40.7,53.8,51.8C40.8,62.8,25.4,71.1,8.3,74.7C-8.8,78.3,-27.6,77.2,-41.8,68.8C-56,60.4,-65.7,44.7,-71.4,28.2C-77.2,11.7,-79,-5.6,-72.7,-19.9C-66.4,-34.2,-52,-45.5,-38.3,-53.8C-24.6,-62.1,-11.6,-67.4,2.3,-70.6C16.2,-73.8,30.3,-78.1,43.9,-70Z" transform="translate(100 100) scale(1.1)" />
            </svg>
          </div>
          <div className="relative z-10 w-full max-w-lg space-y-4">
            <h3 className="text-3xl font-black text-white">Phân tích chuyên sâu khóa mục tiêu 7.5+</h3>
            <p className="text-blue-100 font-medium leading-relaxed mb-6">
              Lớp đang có xu hướng tăng 15% về kỹ năng Writing format so với tháng trước. 
              Cân nhắc bổ sung thêm bài tập phần Reading tuần tới.
            </p>
            <button className="flex items-center gap-2 bg-white text-navy font-bold px-6 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg mt-2 group w-fit">
              Xem chi tiết phân tích 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        <div className="bg-beered rounded-[2rem] p-8 md:p-10 text-white relative overflow-hidden shadow-xl shadow-beered/20">
          <div className="relative z-10 h-full flex flex-col">
            <h3 className="text-2xl font-black mb-6">Nhắc nhở quan trọng</h3>
            
            <div className="space-y-5 flex-grow">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <AlertTriangle size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1"><span className="text-red-200">14</span> học sinh</p>
                  <p className="text-sm text-red-100 font-medium">chưa nộp bài tập Writing Task 2 khóa IELTS Masterclass.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                  <Clock size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-bold text-white mb-1">Họp phụ huynh</p>
                  <p className="text-sm text-red-100 font-medium">lớp SAT - Thứ 7 tuần này lúc 19:00.</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 border-2 border-white/30 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition-colors">
              Tạo nhắc nhở mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
