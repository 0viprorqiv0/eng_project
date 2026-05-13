import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Filter, Download, MoreVertical, Edit2, Trash2, BookOpen, PenTool, Globe, History, Users, Plus, X } from 'lucide-react';

export const AdminCoursesPage = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [editForm, setEditForm] = useState({ teacher_id: '', price_amount: 0 });

  const fetchCourses = async (page = 1) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({ page: page.toString() });
      if (search) queryParams.append('search', search);
      const res: any = await api.get(`/admin/courses?${queryParams.toString()}`);
      setCourses(res.data || []);
      setPagination({
        current_page: res.current_page || 1,
        last_page: res.last_page || 1,
        total: res.total || 0
      });
    } catch (err: any) {
      toast.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => fetchCourses(1), 300);
    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res: any = await api.get('/admin/users?role=teacher&per_page=100');
        setTeachers(res.data || []);
      } catch (err) {
        console.error('Failed to load teachers');
      }
    };
    fetchTeachers();
  }, []);

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;
    try {
      // Create price string from amount for consistency (e.g. 2500000 -> "2.500.000đ")
      const formattedPrice = editForm.price_amount > 0 
        ? new Intl.NumberFormat('vi-VN').format(editForm.price_amount) + 'đ'
        : 'Miễn phí';

      await api.put(`/courses/${editingCourse.id}`, {
        ...editForm,
        price: formattedPrice
      });
      toast.success('Cập nhật khóa học thành công');
      setEditingCourse(null);
      fetchCourses(pagination.current_page);
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cập nhật khóa học');
    }
  };

  const handleDeleteCourse = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/admin/courses/${deleteTarget.id}`);
      toast.success(`Đã xóa khóa học "${deleteTarget.title}"`);
      setDeleteTarget(null);
      fetchCourses(pagination.current_page);
    } catch (err: any) {
      toast.error(err.message || 'Không thể xóa khóa học');
    }
  };

  const courseIcons = [BookOpen, PenTool, Globe, History];
  const courseColors = ['bg-blue-50 text-blue-600', 'bg-indigo-50 text-indigo-600', 'bg-cyan-50 text-cyan-600', 'bg-amber-50 text-amber-600'];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="max-w-2xl">
          <p className="text-xs font-bold text-[#ba1a1a] tracking-widest uppercase mb-2">DANH MỤC HỌC THUẬT</p>
          <h1 className="font-headline text-[2.5rem] leading-tight font-extrabold text-[#002143] tracking-tight">
            Quản lý khóa học
          </h1>
          <p className="text-[#51667c] text-[15px] mt-3 leading-relaxed max-w-xl">
            Tổng quan toàn bộ {pagination.total} khóa học trên hệ thống. Thêm, sửa, xóa và quản lý trạng thái khóa học.
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button
            onClick={() => navigate('/dashboard/create-course')}
            className="bg-[#ba1a1a] hover:bg-[#93000a] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-[#ba1a1a]/20 transition-all text-sm flex items-center gap-2 active:scale-95"
          >
            <Plus size={18} strokeWidth={2.5} /> Tạo khóa học mới
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#73777f] text-xl">search</span>
          <input
            type="text"
            placeholder="Tìm theo tên khóa học..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 text-[#002143]"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-[#002143] hover:bg-slate-50 transition-colors">
          <Filter size={16} /> Bộ lọc
        </button>
        {/* <button className="flex items-center gap-2 px-5 py-3 bg-[#002143] text-white rounded-xl text-sm font-bold hover:bg-[#13375f] transition-colors shadow-md">
          <Download size={16} /> Xuất dữ liệu
        </button> */}
      </div>

      {/* Course Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
        {loading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13375f]"></div>
          </div>
        )}
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Khóa học</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100">Giảng viên</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Giá</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {courses.map((course, idx) => {
              const IconComponent = courseIcons[idx % courseIcons.length];
              const colorClass = courseColors[idx % courseColors.length];
              return (
                <tr 
                  key={course.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/course/${course.id}`)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center shrink-0`}>
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <p className="font-bold text-[15px] text-[#002143] group-hover:text-[#13375f] transition-colors">{course.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-xs">{course.description || 'Chưa có mô tả'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${course.teacher?.name || 'T'}&background=002143&color=fff&size=28`}
                        className="w-7 h-7 rounded-full" alt=""
                      />
                      <span className="text-sm font-medium text-slate-700">{course.teacher?.name || 'Chưa gán'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-bold text-sm text-[#002143]">
                      {!course.price_amount || course.price_amount === 0 ? 'Miễn phí' : `${Number(course.price_amount).toLocaleString()}đ`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      course.is_published !== false ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${course.is_published !== false ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                      {course.is_published !== false ? 'Hoạt động' : 'Nháp'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingCourse(course);
                          setEditForm({ 
                            teacher_id: course.teacher_id || '', 
                            price_amount: course.price_amount || 0 
                          });
                        }}
                        title="Điều phối & Chỉnh sửa"
                        className="p-2 text-slate-400 hover:text-[#002143] transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget(course); }}
                        title="Xóa khóa học"
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {!loading && courses.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  <span className="material-symbols-outlined text-4xl text-slate-300 mb-3 block">inventory_2</span>
                  <p className="font-medium">Chưa có khóa học nào</p>
                  <p className="text-xs mt-1">Bấm "Thêm khóa học" để bắt đầu.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 font-medium">
          Trang {pagination.current_page} / {pagination.last_page} ({pagination.total} khóa học)
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={pagination.current_page === 1}
            onClick={() => fetchCourses(pagination.current_page - 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            ← Trước
          </button>
          {Array.from({ length: Math.min(pagination.last_page, 5) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => fetchCourses(p)}
              className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                p === pagination.current_page ? 'bg-[#002143] text-white' : 'bg-white border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() => fetchCourses(pagination.current_page + 1)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium disabled:opacity-40 hover:bg-slate-50 transition-colors"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-bold text-lg text-[#002143]">Điều phối khóa học</h3>
                <p className="text-xs text-slate-500 mt-0.5">{editingCourse.title}</p>
              </div>
              <button 
                onClick={() => setEditingCourse(null)} 
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-200 transition-colors text-slate-400"
              >
                <X size={18}/>
              </button>
            </div>
            
            <form onSubmit={handleUpdateCourse} className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giảng viên phụ trách</label>
                <div className="relative">
                  <select 
                    value={editForm.teacher_id} 
                    onChange={e => setEditForm({ ...editForm, teacher_id: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#002143]/20 appearance-none"
                  >
                    <option value="">-- Chọn giảng viên --</option>
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>{t.name} ({t.email})</option>
                    ))}
                  </select>
                  <Users size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Giá khóa học (VNĐ)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={editForm.price_amount} 
                    onChange={e => setEditForm({ ...editForm, price_amount: parseInt(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#002143]/20"
                    placeholder="Nhập giá (0 nếu miễn phí)"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₫</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                  * Giá hiển thị sẽ là: {editForm.price_amount > 0 ? new Intl.NumberFormat('vi-VN').format(editForm.price_amount) + 'đ' : 'Miễn phí'}
                </p>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingCourse(null)} 
                  className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-4 py-3 bg-[#002143] hover:bg-[#13375f] transition-all text-white rounded-xl font-bold text-sm shadow-lg shadow-[#002143]/20"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 animate-fade-in text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="font-extrabold text-xl text-[#002143] mb-2">Xóa khóa học?</h3>
            <p className="text-sm text-slate-500 mb-6 px-2">
              Bạn có chắc muốn xóa "<span className="font-bold text-[#002143]">{deleteTarget.title}</span>"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                Hủy
              </button>
              <button onClick={handleDeleteCourse} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors">
                Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
