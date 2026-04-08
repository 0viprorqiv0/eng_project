import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { FileUpload } from '../../components/FileUpload';

export function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.name || 'Thầy Minh';
  const nameLower = name.toLowerCase();
  const isFemale = nameLower.includes('ms.') || nameLower.includes('mrs.') || nameLower.includes('miss') || nameLower.includes('cô ');
  const pronoun = isFemale ? 'cô' : 'thầy';

  const [stats, setStats] = useState<any>({ total_students: 0, total_courses: 0, avg_rating: 0, live_sessions: 0 });
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalInput, setModalInput] = useState('');
  const [uploadedLessonFile, setUploadedLessonFile] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const [statsData, coursesData] = await Promise.all([
          api.get('/teacher/stats'),
          api.get('/my-courses')
        ]);
        if (statsData) setStats(statsData);
        if (coursesData) setCourses(coursesData.slice(0, 5)); // show top 5
      } catch (err) {
        console.error('Failed to load teacher dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002143] to-[#13375f] rounded-[2rem] p-10 text-white shadow-2xl shadow-[#002143]/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="font-headline text-3xl font-bold mb-3 tracking-tight">Chào buổi sáng, {name}!</h2>
          <p className="text-[#82a1cf] text-lg leading-relaxed opacity-90">
            Hôm nay bạn có <span className="text-white font-bold underline decoration-[#ffdad6] underline-offset-4">2 lớp học mới</span> và 15 bài tập cần chấm điểm. Chúc {pronoun} một ngày làm việc hiệu quả!
          </p>
        </div>
        <div className="absolute top-[-20%] right-[-5%] w-64 h-64 bg-[#73000a]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-30%] right-[10%] w-96 h-96 bg-[#cee5ff]/10 rounded-full blur-3xl"></div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#f4f3f7] p-6 rounded-2xl flex items-center gap-5 group hover:bg-white transition-all duration-300">
          <div className="w-14 h-14 bg-[#13375f]/10 rounded-2xl flex items-center justify-center text-[#13375f] group-hover:bg-[#002143] group-hover:text-white transition-all duration-300">
            <span className="material-symbols-outlined text-3xl">groups</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#51667c] mb-1">Học viên đang học</p>
            <h3 className="font-headline text-2xl font-extrabold text-[#002143]">{stats.total_students}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +12% tháng này
            </p>
          </div>
        </div>
        <div className="bg-[#f4f3f7] p-6 rounded-2xl flex items-center gap-5 group hover:bg-white transition-all duration-300">
          <div className="w-14 h-14 bg-[#73000a]/10 rounded-2xl flex items-center justify-center text-[#73000a] group-hover:bg-[#73000a] group-hover:text-white transition-all duration-300">
            <span className="material-symbols-outlined text-3xl">library_books</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#51667c] mb-1">Tổng khóa học</p>
            <h3 className="font-headline text-2xl font-extrabold text-[#002143]">{stats.total_courses}</h3>
            <p className="text-[10px] text-green-600 font-bold flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> Hoạt động tốt
            </p>
          </div>
        </div>
        <div className="bg-[#f4f3f7] p-6 rounded-2xl flex items-center gap-5 group hover:bg-white transition-all duration-300">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300">
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <div>
            <p className="text-sm font-medium text-[#51667c] mb-1">Đánh giá trung bình</p>
            <h3 className="font-headline text-2xl font-extrabold text-[#002143]">{stats.avg_rating}/5.0</h3>
            <p className="text-[10px] text-[#51667c] font-medium mt-1">Chất lượng giảng dạy</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="space-y-4">
        <h4 className="font-headline text-xl font-bold text-[#002143]">Thao tác nhanh</h4>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'upload', icon: 'upload_file', label: 'Upload bài giảng' },
            { id: 'create-course', icon: 'add_circle', label: 'Tạo khóa học mới' },
            { id: 'manage', icon: 'inventory_2', label: 'Quản lý khóa học' },
            { id: 'notify', icon: 'campaign', label: 'Gửi thông báo' },
          ].map((action, idx) => (
            <button 
                key={idx} 
                onClick={() => action.id === 'manage' ? navigate('/dashboard/courses') : action.id === 'create-course' ? navigate('/dashboard/create-course') : action.id === 'upload' ? navigate('/dashboard/create-lecture') : setActiveModal(action.id)}
                className="flex flex-col items-center justify-center p-6 bg-white border border-transparent hover:border-[#13375f]/30 rounded-2xl transition-all shadow-sm hover:shadow-md group active:scale-95"
            >
              <span className="material-symbols-outlined text-[#13375f] text-3xl mb-3 group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-sm font-bold text-[#002143]">{action.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Course Table */}
      <section className="bg-[#f4f3f7] rounded-3xl overflow-hidden p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="font-headline text-xl font-bold text-[#002143]">Danh sách khóa học của tôi</h4>
            <p className="text-xs text-[#51667c]">Đang hiển thị 5 khóa học hoạt động nhất</p>
          </div>
          <button onClick={() => navigate('/dashboard/courses')} className="px-5 py-2 text-[#002143] font-bold text-sm hover:bg-white rounded-xl transition-all flex items-center gap-2">
            Xem tất cả <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Tên khóa học</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Học viên</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Giá bán</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Đánh giá</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={6} className="text-center py-8">Đang tải biểu mẫu...</td></tr>}
              {!isLoading && courses.map((course, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#13375f] flex items-center justify-center text-white">
                        <span className="material-symbols-outlined">menu_book</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#002143] group-hover:text-[#13375f] transition-colors">{course.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-medium text-sm text-[#4b6076]">{course.students}</td>
                  <td className="px-6 py-5 text-center font-bold text-sm text-[#002143]">{course.price}</td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500">
                      <span className="text-sm font-bold">{course.rating || '--'}</span>
                      {course.rating > 0 && <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${course.status === 'Đang bán' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{course.status}</span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-[#51667c] hover:text-[#002143] transition-colors">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Schedule */}
        <div className="bg-[#f4f3f7] p-8 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline text-xl font-bold text-[#002143]">Lịch dạy sắp tới</h4>
            <span className="text-xs font-bold text-[#13375f]">Thứ 3, 24 Tháng 10</span>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border-l-4 border-[#13375f] shadow-sm">
              <div className="text-center min-w-[50px]">
                <p className="text-sm font-bold text-[#002143]">08:00</p>
                <p className="text-[10px] text-[#51667c]">09:30</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#002143]">IELTS Speaking Practice</p>
                <p className="text-xs text-[#51667c]">Phòng trực tuyến 04 • 12 học viên</p>
              </div>
              <button onClick={() => alert('Đang hệ thống học phòng trực tuyến...')} className="ml-auto bg-[#13375f] text-white px-4 py-2 rounded-xl text-[10px] font-bold active:scale-95 transition-transform hover:bg-[#0f2a47]">VÀO LỚP</button>
            </div>
            <div className="bg-white p-4 rounded-2xl flex items-center gap-4 border-l-4 border-[#73000a] shadow-sm opacity-80">
              <div className="text-center min-w-[50px]">
                <p className="text-sm font-bold text-[#002143]">14:00</p>
                <p className="text-[10px] text-[#51667c]">16:00</p>
              </div>
              <div>
                <p className="text-sm font-bold text-[#002143]">Business English Seminar</p>
                <p className="text-xs text-[#51667c]">Hội trường A • 45 học viên</p>
              </div>
            </div>
          </div>
        </div>

        {/* Grading */}
        <div className="bg-[#f4f3f7] p-8 rounded-3xl relative">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-headline text-xl font-bold text-[#002143]">Cần chấm điểm</h4>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="-mt-12 mb-4 w-20 h-20 bg-[#ffdad6] rounded-full flex items-center justify-center text-[#4b0004] ring-8 ring-[#f4f3f7]">
              <span className="material-symbols-outlined text-4xl">edit_note</span>
            </div>
            <h5 className="font-bold text-[#002143] mb-1">Bài tập Writing Task 2</h5>
            <p className="text-xs text-[#51667c] mb-4">Có 8 bài mới nộp quá hạn cần ưu tiên</p>
            <div className="w-full bg-[#e8e8ec] h-2 rounded-full mb-6 overflow-hidden">
              <div className="bg-[#4b0004] w-[65%] h-full rounded-full"></div>
            </div>
            <button onClick={() => navigate('/dashboard/assignments')} className="w-full bg-[#73000a] text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-[#73000a]/20 hover:scale-[1.02] active:scale-95 transition-transform">
              Bắt đầu chấm điểm ngay
            </button>
          </div>
        </div>
      </div>

      {/* Action Modals */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f4f3f7]">
                    <h3 className="font-bold text-[#002143] text-lg flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#13375f]">
                            {activeModal === 'upload' ? 'upload_file' : activeModal === 'quiz' ? 'quiz' : 'campaign'}
                        </span>
                        {activeModal === 'upload' ? 'Upload Bài Giảng Mới' : activeModal === 'quiz' ? 'Tạo Quiz Nhanh' : 'Gửi Thông Báo Lớp'}
                    </h3>
                    <button onClick={() => {setActiveModal(null); setModalInput('');}} className="text-slate-400 hover:text-red-500 transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-6 space-y-4">
                    {activeModal === 'upload' && (
                        <>
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Chọn khóa học</label>
                            <select
                                value={selectedCourseId}
                                onChange={e => setSelectedCourseId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none"
                            >
                                <option value="">-- Chọn khóa học --</option>
                                {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Tải lên Video hoặc Tài liệu</label>
                            <FileUpload
                              onFileUploaded={(data) => setUploadedLessonFile(data)}
                              uploadEndpoint="/upload/lesson-media"
                              accept=".mp4,.webm,.mov,.pdf,.doc,.docx,.pptx"
                              maxSizeMB={200}
                              extraData={{ type: 'video', course_id: selectedCourseId }}
                              label="Kéo thả video hoặc tài liệu vào đây"
                            />
                        </div>
                        </>
                    )}
                    {activeModal === 'quiz' && (
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Chủ đề Quiz (AI sẽ tự tạo câu hỏi)</label>
                            <input 
                                value={modalInput}
                                onChange={e => setModalInput(e.target.value)}
                                placeholder="Ví dụ: Conditionals Type 2..." 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20" 
                            />
                        </div>
                    )}
                    {activeModal === 'notify' && (
                        <div>
                            <label className="block text-sm font-bold text-[#002143] mb-2">Nội dung thông báo (gửi Email & App)</label>
                            <textarea 
                                value={modalInput}
                                onChange={e => setModalInput(e.target.value)}
                                placeholder="Nhập nội dung nhắc nhở học viên..."
                                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 resize-none text-[#002143]"
                            ></textarea>
                        </div>
                    )}
                </div>
                <div className="p-6 pt-0 flex gap-3">
                    <button onClick={() => {setActiveModal(null); setModalInput(''); setUploadedLessonFile(null); setSelectedCourseId('');}} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                    <button 
                        onClick={() => {
                            if(activeModal === 'upload') {
                                if (uploadedLessonFile) {
                                    alert(`Tải lên thành công: ${uploadedLessonFile.file_name}`);
                                    setActiveModal(null);
                                    setUploadedLessonFile(null);
                                    setSelectedCourseId('');
                                } else {
                                    alert('Vui lòng chọn và tải file lên trước.');
                                }
                                return;
                            }
                            if(!modalInput.trim()) return;
                            alert(`Đã thực hiện: ${activeModal === 'quiz' ? 'Tạo bộ câu hỏi Quiz' : 'Thông báo đã gửi thành công'}!`);
                            setActiveModal(null); 
                            setModalInput('');
                        }} 
                        disabled={activeModal === 'upload' ? !uploadedLessonFile : !modalInput.trim()}
                        className="flex-1 py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] disabled:opacity-50 transition-all"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
