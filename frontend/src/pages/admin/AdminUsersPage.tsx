import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { 
  ShieldAlert, Edit2, Trash2, X, XCircle, Users, AlertTriangle, 
  Filter, Download, ChevronLeft, ChevronRight, Lock, EyeOff, Upload, Settings, UserPlus, RotateCcw,
  Search, BookOpen, Plus, Check, Loader2, Book, PenTool, Globe, History
} from 'lucide-react';
import { useAuth } from '../../components/AuthContext';

export const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');
  const [availableCourses, setAvailableCourses] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({ total_students: 0, total_teachers: 0, active_teachers: 0, new_enrollment_rate: 0 });

  // Modals
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  
  // Enrollment State
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [newEnrollCourseId, setNewEnrollCourseId] = useState('');

  // Form States
  const [banDuration, setBanDuration] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  const fetchUsers = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ 
        page: page.toString(),
        search: searchTerm,
        role: roleFilter === 'all' ? '' : roleFilter,
        course_id: courseFilter === 'all' ? '' : courseFilter
      });
      
      const res: any = await api.get(`/admin/users?${queryParams.toString()}`);
      setUsers(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || 0
      });
    } catch (err: any) {
      toast.error('Không thể tải danh bạ người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [coursesRes, statsRes] = await Promise.all([
          api.get('/admin/courses'),
          api.get('/admin/stats')
        ]);
        setAvailableCourses(coursesRes.data || []);
        if (statsRes) {
          setUserStats({
            total_students: statsRes.total_students || 0,
            total_teachers: statsRes.total_teachers || 0,
            active_teachers: statsRes.active_teachers || 0,
            new_enrollment_rate: statsRes.new_enrollment_rate || 0,
          });
        }
      } catch (err) {
        console.error('Failed to load initial data');
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm, roleFilter, courseFilter]);

  // Actions
  const openEnrollModal = async (u: any) => {
    setSelectedUser(u);
    setIsEnrollModalOpen(true);
    setUserEnrollments([]);
    setEnrollLoading(true);
    try {
      const res = await api.get(`/admin/users/${u.id}/enrollments`);
      setUserEnrollments(res || []);
    } catch (err: any) {
      toast.error('Không thể tải danh sách ghi danh');
    } finally {
      setEnrollLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!newEnrollCourseId) return;
    try {
      setIsEnrolling(true);
      const res = await api.post(`/admin/users/${selectedUser.id}/enroll`, { course_id: newEnrollCourseId });
      toast.success('Ghi danh thành công');
      setUserEnrollments(prev => [...prev, res.enrollment]);
      setNewEnrollCourseId('');
      fetchUsers(pagination.current_page); // Update the user row if needed (e.g. if we add course list to row)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ghi danh thất bại');
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleUnenroll = async (courseId: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy ghi danh học viên khỏi khóa học này?')) return;
    try {
      await api.delete(`/admin/users/${selectedUser.id}/enroll/${courseId}`);
      toast.success('Đã hủy ghi danh');
      setUserEnrollments(prev => prev.filter(e => e.course_id !== courseId));
    } catch (err: any) {
      toast.error('Hủy ghi danh thất bại');
    }
  };

  const handleToggleBan = async () => {
    if (!selectedUser) return;
    try {
      const res = await api.put(`/admin/users/${selectedUser.id}/ban`, {
        duration_days: banDuration ? parseInt(banDuration) : null
      });
      toast.success(res.message || 'Đã áp dụng hành động bảo mật');
      setIsBanModalOpen(false);
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Hành động thất bại');
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    try {
      await api.put(`/admin/users/${selectedUser.id}/role`, { role: selectedRole });
      toast.success(`Đã đổi quyền thành ${selectedRole}`);
      setIsRoleModalOpen(false);
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      toast.error(err.message || 'Không có quyền thao tác');
    }
  };

  const softDeleteUser = async (user: any) => {
    if (!window.confirm(`Bạn có chắc muốn xóa tài khoản ${user.name}?`)) return;
    try {
      await api.delete(`/admin/users/${user.id}`);
      toast.success('Đã vô hiệu hóa tài khoản');
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa');
    }
  };

  const restoreUser = async (user: any) => {
    try {
      await api.post(`/admin/users/${user.id}/restore`);
      toast.success('Đã khôi phục tài khoản');
      fetchUsers(pagination.current_page);
    } catch (err: any) {
      toast.error('Không thể khôi phục');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="max-w-2xl">
          <h1 className="text-[40px] leading-tight font-extrabold text-[#0f172a] tracking-tight">Trung tâm Kiểm soát Người dùng</h1>
          <p className="text-slate-600 text-[15px] mt-2 leading-relaxed">
            Quản lý quyền hạn, theo dõi hoạt động và đảm bảo tính toàn vẹn của cộng đồng BeeLearn.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Tổng số học viên</p>
          <h3 className="text-4xl font-extrabold text-[#0f172a]">{userStats.total_students.toLocaleString()}</h3>
          <p className="text-sm font-medium text-emerald-600 mt-2 flex items-center gap-1">
            <TrendingUpIcon size={14}/> +{userStats.new_enrollment_rate}% tháng này
          </p>
          {/* Decorative faint icon */}
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9L5 11.18V17.18L12 21L19 17.18V11.18L21 10.09V17H23V9L12 3ZM18.82 9L12 12.72L5.18 9L12 5.28L18.82 9Z"/></svg>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Giảng viên đang hoạt động</p>
          <h3 className="text-4xl font-extrabold text-blue-600">{userStats.total_teachers.toLocaleString()}</h3>
          <p className="text-sm font-medium text-blue-600/80 mt-2">{userStats.active_teachers} đang trực tuyến</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
          <p className="text-xs font-bold text-slate-500 tracking-wider uppercase mb-2">Trạng thái hệ thống</p>
          <h3 className="text-4xl font-extrabold text-emerald-600">Ổn định</h3>
          <p className="text-sm font-medium text-slate-500 mt-2">Mọi thứ hoạt động bình thường</p>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Table Toolbar / Filter Section */}
        <div className="px-6 py-6 border-b border-slate-100 bg-[#fcfdfe]">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="relative w-full lg:w-[400px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0f172a] transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Tìm tên hoặc email học viên..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:border-slate-300 focus:ring-4 focus:ring-slate-50 rounded-xl text-sm font-medium transition-all outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
                <Filter size={14} className="text-slate-500" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Bộ lọc</span>
              </div>
              
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="select-filter px-4 py-2.5 rounded-xl min-w-[140px]"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="student">Học sinh</option>
                <option value="teacher">Giáo viên</option>
                <option value="admin">Quản trị viên</option>
              </select>

              <select 
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="select-filter px-4 py-2.5 rounded-xl min-w-[200px] max-w-[280px]"
              >
                <option value="all">Tất cả khóa học</option>
                {availableCourses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>

              <button className="p-2.5 h-[42px] bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 hover:text-slate-700 transition-all border border-slate-200" title="Xuất báo cáo">
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto min-h-[300px] relative">
          {loading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f172a]"></div>
            </div>
          )}
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Tên người dùng</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Vai trò</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Khóa học</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Trạng thái</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Ngày tham gia</th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={u.avatar_url || `https://ui-avatars.com/api/?name=${u.name}&background=f1f5f9&color=0f172a`} alt="" className="w-10 h-10 rounded-full bg-slate-100" />
                      <div>
                        <p className={`font-bold text-[15px] ${u.deleted_at ? 'text-slate-400 line-through' : 'text-[#0f172a]'}`}>{u.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-3 py-1 font-semibold text-xs rounded-full capitalize ${
                      u.role === 'admin' ? 'bg-red-50 text-red-700' : u.role === 'teacher' ? 'bg-amber-50 text-amber-700' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'teacher' ? 'Teacher' : 'Student'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {(() => {
                        const courses = [
                          ...(u.enrollments || []).map((e: any) => ({ id: e.id, title: e.course?.title, type: 'learning' })),
                          ...(u.taughtCourses || []).map((c: any) => ({ id: c.id, title: c.title, type: 'teaching' }))
                        ];
                        
                        if (courses.length === 0) return <span className="text-slate-400 text-[10px] italic">Chưa tham gia</span>;

                        return (
                          <>
                            {courses.slice(0, 2).map((c: any, idx: number) => (
                              <span 
                                key={idx} 
                                className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold truncate max-w-[150px] ${
                                  c.type === 'teaching' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                }`} 
                                title={c.title}
                              >
                                {c.title}
                              </span>
                            ))}
                            {courses.length > 2 && (
                              <span className="text-[10px] font-bold text-slate-400">+{courses.length - 2}</span>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {u.banned_until ? (
                      <span className="inline-flex items-center gap-1.5 font-bold text-xs text-red-600">
                        <Lock size={12} strokeWidth={3}/> Đã khóa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Đang hoạt động
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       {u.deleted_at ? (
                         <button onClick={() => restoreUser(u)} title="Khôi phục" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                           <RotateCcw size={16} />
                         </button>
                       ) : (
                         <>
                           <button 
                             onClick={() => openEnrollModal(u)}
                             title="Quản lý khóa học"
                             className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                           >
                             <BookOpen size={16} />
                           </button>
                           <button 
                             onClick={() => { setSelectedUser(u); setSelectedRole(u.role); setIsRoleModalOpen(true); }}
                             title="Phân quyền"
                             className="p-2 text-slate-400 hover:text-[#0f172a] transition-colors"
                           ><Edit2 size={16} /></button>
                           <button 
                             onClick={() => { setSelectedUser(u); setBanDuration(''); setIsBanModalOpen(true); }}
                             className={`p-2 transition-colors ${u.banned_until ? 'text-emerald-500 bg-emerald-50 rounded' : 'text-slate-400 hover:text-red-700'}`}
                             title={u.banned_until ? "Gỡ cấm" : "Cấm tài khoản"}
                           >
                             <EyeOff size={16} />
                           </button>
                           <button onClick={() => softDeleteUser(u)} title="Xóa tài khoản" className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                             <Trash2 size={16} />
                           </button>
                         </>
                       )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-100">
          <p className="text-sm text-slate-500 font-medium">
            Hiển thị {(pagination.current_page - 1) * 10 + 1} đến {Math.min(pagination.current_page * 10, pagination.total)} trong tổng số {pagination.total.toLocaleString()} mục
          </p>
          <div className="flex items-center gap-1">
            <button 
              disabled={pagination.current_page === 1}
              onClick={() => fetchUsers(pagination.current_page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            ><ChevronLeft size={18}/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0f172a] text-white font-medium text-sm">
              {pagination.current_page}
            </button>
            <button 
              disabled={pagination.current_page === pagination.last_page}
              onClick={() => fetchUsers(pagination.current_page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30"
            ><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>



      {/* Enrollment Management Modal */}
      {isEnrollModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsEnrollModalOpen(false)}>
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
            <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-[#f8fafc]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0f172a] text-white flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <Book size={24} />
                </div>
                <div>
                  <h3 className="font-black text-2xl text-[#0f172a]">Quản lý Ghi danh</h3>
                  <p className="text-sm font-bold text-slate-500">{selectedUser.name} • {selectedUser.email}</p>
                </div>
              </div>
              <button onClick={() => setIsEnrollModalOpen(false)} className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"><X size={24}/></button>
            </div>

            <div className="p-10 flex-grow overflow-y-auto space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
              {/* Add New Enrollment Section */}
              <div className="bg-slate-50 rounded-[2rem] p-6 border border-dashed border-slate-200">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4">Ghi danh vào khóa học mới</label>
                <div className="flex gap-3">
                  <select 
                    value={newEnrollCourseId}
                    onChange={(e) => setNewEnrollCourseId(e.target.value)}
                    className="flex-grow bg-white px-5 py-4 rounded-2xl border-2 border-slate-100 font-bold text-slate-700 text-[15px] focus:border-[#0f172a] focus:ring-0 transition-all outline-none"
                  >
                    <option value="">-- Chọn khóa học học viên chưa tham gia --</option>
                    {availableCourses
                      .filter(c => !userEnrollments.some(e => e.course_id === c.id))
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))
                    }
                  </select>
                  <button 
                    onClick={handleEnroll}
                    disabled={!newEnrollCourseId || isEnrolling}
                    className="px-8 py-4 bg-[#0f172a] text-white font-black rounded-2xl flex items-center gap-3 hover:bg-slate-800 disabled:opacity-40 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                  >
                    {isEnrolling ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                    Ghi danh
                  </button>
                </div>
              </div>

              {/* Current Enrollments List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                   <h4 className="text-sm font-black text-[#0f172a] uppercase tracking-widest">Khóa học đang tham gia ({userEnrollments.length})</h4>
                </div>
                
                {enrollLoading ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-slate-100 border-t-[#0f172a] rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-slate-400">Đang tải dữ liệu giảng dạy...</p>
                  </div>
                ) : userEnrollments.length === 0 ? (
                  <div className="py-16 text-center bg-white border border-slate-100 rounded-[2rem] border-dashed">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen size={32} />
                    </div>
                    <p className="font-bold text-slate-400">Chưa có bản ghi ghi danh nào cho người dùng này.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {userEnrollments.map((e, idx) => {
                      const icons = [BookOpen, PenTool, Globe, History];
                      const colors = ['bg-blue-50 text-blue-600', 'bg-indigo-50 text-indigo-600', 'bg-cyan-50 text-cyan-600', 'bg-amber-50 text-amber-600'];
                      const IconComponent = icons[e.course?.id ? e.course.id % 4 : idx % 4];
                      const colorClass = colors[e.course?.id ? e.course.id % 4 : idx % 4];
                      
                      return (
                      <div key={e.id} className="group bg-white border border-slate-100 p-5 rounded-2xl flex items-center justify-between hover:border-slate-200 hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                            <IconComponent size={24} />
                          </div>
                          <div>
                            <p className="font-black text-[#0f172a] leading-tight">{e.course?.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">Tiến độ: {Math.round(e.progress || 0)}%</span>
                               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2 py-0.5 bg-emerald-50 rounded-full border border-emerald-100">Đang học</span>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleUnenroll(e.course_id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2"
                        >
                          <Trash2 size={14} /> Hủy ghi danh
                        </button>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="px-10 py-6 border-t border-slate-100 bg-[#f8fafc] text-right">
              <button 
                onClick={() => setIsEnrollModalOpen(false)}
                className="px-8 py-3.5 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                Hoàn tất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {isBanModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 animate-fade-in text-center" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="font-extrabold text-2xl text-[#0f172a] mb-2">Hạn chế tài khoản</h3>
            <p className="text-sm font-medium text-slate-500 mb-6 px-4">
              {selectedUser.banned_until 
                ? `Gỡ bỏ lệnh cấm hiện tại cho ${selectedUser.name}?` 
                : `Xác định thời gian tạm đình chỉ cho ${selectedUser.name}.`}
            </p>
            
            {!selectedUser.banned_until && (
              <div className="mb-8 text-left">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thời gian (Ngày)</label>
                <input 
                  type="number" 
                  min="1"
                  placeholder="Để trống nếu cấm vĩnh viễn"
                  value={banDuration} 
                  onChange={e => setBanDuration(e.target.value)} 
                  className="w-full rounded-xl font-medium border-slate-200 text-sm focus:ring-2 focus:ring-red-500" 
                />
              </div>
            )}

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsBanModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Hủy</button>
              <button 
                onClick={handleToggleBan}
                className={`flex-1 px-4 py-3 text-white rounded-xl font-bold text-sm shadow-lg ${selectedUser.banned_until ? 'bg-[#0f172a] shadow-slate-900/20' : 'bg-red-600 hover:bg-red-700 shadow-red-600/20'}`}
              >
                {selectedUser.banned_until ? 'Khôi phục truy cập' : 'Thực thi cấm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Change Modal */}
      {isRoleModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 animate-fade-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-6">
              <img src={selectedUser.avatar_url || `https://ui-avatars.com/api/?name=${selectedUser.name}&background=f1f5f9&color=002143`} className="w-14 h-14 rounded-full" alt="" />
              <div>
                <p className="font-bold text-lg text-[#002143]">{selectedUser.name}</p>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
            </div>
            
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Phân quyền hệ thống</label>
            <div className="space-y-3 mb-8">
              {[
                { value: 'student', label: 'Học sinh', desc: 'Truy cập khóa học, làm bài tập, quiz', icon: '🎓' },
                { value: 'teacher', label: 'Giáo viên', desc: 'Tạo khóa học, chấm bài, quản lý lớp', icon: '👨‍🏫' },
                { value: 'admin', label: 'Quản trị viên', desc: 'Toàn quyền quản lý hệ thống', icon: '🛡️' },
              ].map(r => (
                <button
                  key={r.value}
                  onClick={() => setSelectedRole(r.value)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                    selectedRole === r.value 
                      ? 'border-[#002143] bg-[#002143]/5 shadow-sm' 
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <span className="text-2xl">{r.icon}</span>
                  <div>
                    <p className={`font-bold text-sm ${selectedRole === r.value ? 'text-[#002143]' : 'text-slate-700'}`}>{r.label}</p>
                    <p className="text-[11px] text-slate-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setIsRoleModalOpen(false)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">Hủy</button>
              <button 
                onClick={handleUpdateRole}
                disabled={selectedRole === selectedUser.role}
                className="flex-1 px-4 py-3 bg-[#002143] text-white rounded-xl font-bold text-sm shadow-lg shadow-[#002143]/20 disabled:opacity-40 transition-all"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

// Local component utility
const TrendingUpIcon = ({size}:{size:number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
);
