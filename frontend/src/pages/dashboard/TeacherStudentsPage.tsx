import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, UserPlus, CheckCircle, AlertTriangle, 
  Search, Filter, Download, Plus, MoreVertical,
  ChevronLeft, ChevronRight, Clock, Shield
} from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

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
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const [courses, setCourses] = useState<any[]>([]);

  // Thêm debounce cho search field
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleWarn = async (item: any) => {
    if (!window.confirm(`Bạn có chắc muốn gửi cảnh cáo thái độ học tập tới học sinh ${item.user.name}?`)) return;
    try {
      await api.post(`/teacher/students/${item.user.id}/warn`);
      toast.success(`Đã gửi cảnh cáo tới học sinh ${item.user.name}`);
    } catch (err: any) {
      toast.error('Không thể gửi cảnh cáo');
    }
  };

  const handleReportAdmin = async (item: any) => {
    if (!window.confirm(`Bạn có chắc muốn báo cáo học sinh ${item.user.name} lên Admin?`)) return;
    try {
      await api.post(`/teacher/students/${item.user.id}/report`);
      toast.success(`Đã gửi báo cáo học sinh ${item.user.name} lên Admin`);
    } catch (err: any) {
      toast.error('Không thể gửi báo cáo');
    }
  };

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
              className="select-filter px-4 py-3.5 rounded-xl min-w-[200px]"
            >
              <option value="all">Tất cả khóa học</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name || c.title}</option>
              ))}
            </select>
            
            <select 
              value={statusFilter}
              onChange={(e) => handleFilterChange(setStatusFilter, e.target.value)}
              className="select-filter px-4 py-3.5 rounded-xl min-w-[170px]"
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
                    <td className="py-6 px-8 text-right relative">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === item.id ? null : item.id); }}
                        className="p-2 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {activeDropdown === item.id && (
                        <div className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-fade-in origin-top-right">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleWarn(item); setActiveDropdown(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-amber-600 hover:bg-amber-50 transition-colors flex items-center gap-2"
                          >
                            <AlertTriangle size={16} />
                            Cảnh cáo thái độ học
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleReportAdmin(item); setActiveDropdown(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm font-bold text-beered hover:bg-red-50 transition-colors flex items-center gap-2"
                          >
                            <Shield size={16} />
                            Báo cáo với Admin
                          </button>
                        </div>
                      )}
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


    </div>
  );
}
