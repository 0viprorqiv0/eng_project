import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'student';

  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/my-courses');
        setCourses(res || []);
      } catch (err) {
        console.error('Failed to load my courses:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-[#002143]">
            {role === 'admin' ? 'Quản lý Khóa học' : role === 'teacher' ? 'Khóa học của tôi' : 'Khóa học của tôi'}
          </h1>
          <p className="text-[#43474e] mt-1">
            {role === 'admin' ? 'Tổng quan tất cả khóa học trên hệ thống' : role === 'teacher' ? 'Quản lý và theo dõi các khóa học bạn giảng dạy' : 'Theo dõi tiến trình học tập của bạn'}
          </p>
        </div>
        {(role === 'admin' || role === 'teacher') && (
          <button
            onClick={() => navigate('/dashboard/create-course')}
            className="bg-[#13375f] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            {role === 'admin' ? 'Thêm khóa học' : 'Tạo khóa học mới'}
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
        <div className="flex items-center bg-[#f4f3f7] px-4 py-2 rounded-xl flex-1">
          <span className="material-symbols-outlined text-[#73777f] mr-2 text-lg">search</span>
          <input className="bg-transparent border-none outline-none focus:ring-0 text-sm w-full placeholder:text-[#43474e]/50" placeholder="Tìm kiếm khóa học..." />
        </div>
        <select className="bg-[#f4f3f7] border-none rounded-xl text-xs font-bold text-[#002143] px-4 py-3 focus:ring-0">
          <option>Tất cả trạng thái</option>
          <option>Đang bán</option>
          <option>Nháp</option>
        </select>
        <select className="bg-[#f4f3f7] border-none rounded-xl text-xs font-bold text-[#002143] px-4 py-3 focus:ring-0">
          <option>Sắp xếp: Mới nhất</option>
          <option>Nhiều học viên nhất</option>
          <option>Đánh giá cao nhất</option>
        </select>
      </div>

      {/* Student: Card Grid */}
      {role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading && <p>Đang tải...</p>}
          {!isLoading && courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-50 group hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-[#002143] to-[#13375f] flex items-center justify-center text-5xl relative">
                {course.image}
                <div className="absolute bottom-3 left-4">
                  <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white font-bold uppercase tracking-wider">{course.level}</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-[#002143] mb-1">{course.name}</h3>
                <p className="text-xs text-[#43474e] mb-4">{course.instructor}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#43474e] flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">play_circle</span> {course.lessons} bài học
                  </span>
                  <span className="text-xs font-bold text-[#002143]">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#eeedf1] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${course.progress === 100 ? 'bg-emerald-500' : 'bg-[#002143]'}`} style={{ width: `${course.progress}%` }}></div>
                </div>
                <button 
                  onClick={() => navigate(`/course/${course.course_id || course.id}`)}
                  className={`mt-5 w-full py-3 rounded-xl text-sm font-bold active:scale-95 transition-all ${course.progress === 100 ? 'bg-emerald-500 text-white' : 'bg-[#13375f] text-white'}`}>
                  {course.progress === 100 ? 'Đã hoàn thành ✓' : 'Tiếp tục học'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teacher: Table */}
      {role === 'teacher' && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Tên khóa học</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Học viên</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Giá bán</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Đánh giá</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Nội dung</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={7} className="px-6 py-5 text-center">Đang tải...</td></tr>}
              {!isLoading && courses.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#13375f] flex items-center justify-center text-white"><span className="material-symbols-outlined">menu_book</span></div>
                      <p className="text-sm font-bold text-[#002143]">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-medium text-sm text-[#4b6076]">{c.students}</td>
                  <td className="px-6 py-5 text-center font-bold text-sm text-[#002143]">{c.price}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <span className="text-sm font-bold">{c.rating || '--'}</span>
                      {c.rating > 0 && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="w-full max-w-[80px] mx-auto">
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#002143] rounded-full" style={{ width: `${c.progress}%` }}></div>
                      </div>
                      <p className="text-[10px] text-[#43474e] mt-1">{c.progress}%</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${c.status === 'Đang bán' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-[#51667c] hover:text-[#002143] transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Admin: Full Table */}
      {role === 'admin' && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Giảng viên</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Học viên</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Đánh giá</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Doanh thu</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={7} className="px-6 py-5 text-center">Đang tải...</td></tr>}
              {!isLoading && courses.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#13375f] flex items-center justify-center text-white"><span className="material-symbols-outlined">menu_book</span></div>
                      <p className="text-sm font-bold text-[#002143]">{c.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#4b6076]">{c.instructor}</td>
                  <td className="px-6 py-5 text-center font-medium text-sm text-[#4b6076]">{c.students}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <span className="text-sm font-bold">{c.rating || '--'}</span>
                      {c.rating > 0 && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-bold text-sm text-[#002143]">{c.revenue}</td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${c.status === 'Đang bán' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{c.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-[#51667c] hover:text-[#002143] transition-colors"><span className="material-symbols-outlined">more_vert</span></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
