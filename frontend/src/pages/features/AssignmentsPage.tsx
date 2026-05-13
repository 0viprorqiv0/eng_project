import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import { FileUpload } from '../../components/FileUpload';
import { StudentSubmitBox } from './components/StudentSubmitBox';
import { StudentFeedbackViewer } from './components/StudentFeedbackViewer';
import { TeacherMarkingBoard } from './components/TeacherMarkingBoard';
export function AssignmentsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const role = user?.role || 'student';

  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState('Tất cả');
  const [selectedAssignment, setSelectedAssignment] = useState<any|null>(null);
  
  // Student feedback state
  const [feedbackData, setFeedbackData] = useState<any|null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  // Teacher grading state
  const [gradingAssignment, setGradingAssignment] = useState<any|null>(null);

  // Teacher CRUD state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<any|null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any|null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    course_id: '', title: '', description: '', icon: 'assignment', due_date: '', max_score: '10',
  });

  const fetchAssignments = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/assignments');
        if (res && res.assignments) {
          setAssignments(res.assignments);
          setStats(res.stats || {});
        }
      } catch (error) {
        console.error('Failed to fetch assignments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
  useEffect(() => {
    fetchAssignments();
    if (role === 'teacher' || role === 'admin') {
      api.get('/my-courses').then((res: any) => setCourses(res || [])).catch(() => {});
    }
  }, []);

  // Teacher: Load submissions for an assignment
  const handleOpenGrading = (assignment: any) => {
    setGradingAssignment(assignment);
  };

  // Student: Load feedback for an assignment
  const handleViewFeedback = async (assignment: any) => {
    setLoadingFeedback(true);
    try {
      const res = await api.get(`/assignments/${assignment.id}/feedback`);
      if (res) {
        setFeedbackData(res);
      }
    } catch (err) {
      console.error('Failed to load feedback:', err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  // Teacher: Create assignment
  const handleCreateAssignment = async () => {
    if (!formData.course_id || !formData.title || !formData.due_date) return;
    try {
      await api.post('/assignments', {
        ...formData,
        max_score: parseInt(formData.max_score) || 10,
      });
      setShowCreateModal(false);
      setFormData({ course_id: '', title: '', description: '', icon: 'assignment', due_date: '', max_score: '10' });
      fetchAssignments();
    } catch (err: any) {
      alert(err?.message || 'Tạo bài tập thất bại.');
    }
  };

  // Teacher: Update assignment
  const handleUpdateAssignment = async () => {
    if (!editingAssignment || !formData.title) return;
    try {
      await api.put(`/assignments/${editingAssignment.id}`, {
        title: formData.title,
        description: formData.description,
        icon: formData.icon,
        due_date: formData.due_date,
        max_score: parseInt(formData.max_score) || 10,
      });
      setEditingAssignment(null);
      setFormData({ course_id: '', title: '', description: '', icon: 'assignment', due_date: '', max_score: '10' });
      fetchAssignments();
    } catch (err: any) {
      alert(err?.message || 'Cập nhật thất bại.');
    }
  };

  // Teacher: Delete assignment
  const handleDeleteAssignment = async (id: number) => {
    try {
      await api.delete(`/assignments/${id}`);
      setDeleteConfirm(null);
      fetchAssignments();
    } catch (err: any) {
      alert(err?.message || 'Xóa thất bại.');
    }
  };

  // Teacher: Open edit modal
  const openEditModal = (a: any) => {
    setFormData({
      course_id: '', title: a.title, description: '', icon: 'assignment',
      due_date: '', max_score: String(a.max_score || 10),
    });
    setEditingAssignment(a);
  };

  const location = useLocation();
  const initialCourseId = location.state?.courseId;

  const filteredAssignments = assignments.filter(a => {
    // Priority 1: Filter by courseId from navigation state
    if (initialCourseId && a.course_id !== initialCourseId) return false;
    
    // Priority 2: Standard tab filter
    if (filter === 'Tất cả') return true;
    return a.status === filter;
  });

  // Helper: get initials from name
  const getInitials = (name: string) => {
    if (!name) return '??';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };



  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-[#002143]">
            {role === 'student' ? 'Bài tập của tôi' : role === 'teacher' ? 'Quản lý Bài tập' : 'Tổng quan Bài tập'}
          </h1>
          <p className="text-[#43474e] mt-1">
            {role === 'student' ? 'Theo dõi và nộp bài tập đúng hạn' : 'Quản lý và chấm điểm bài tập học viên'}
          </p>
        </div>
        {(role === 'teacher' || role === 'admin') && (
          <button onClick={() => navigate('/dashboard/create-lecture?type=assignment')} className="bg-[#13375f] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-sm">add</span>
            Tạo bài tập mới
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {role === 'student' ? (
          <>
            <div className="bg-white p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-[#002143]">{stats.total || 0}</p><p className="text-xs text-[#43474e]">Tổng bài tập</p></div>
            <div className="bg-amber-50 p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-amber-600">{stats.notSubmitted || 0}</p><p className="text-xs text-[#43474e]">Chưa nộp</p></div>
            <div className="bg-green-50 p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-green-600">{stats.submitted || 0}</p><p className="text-xs text-[#43474e]">Đã nộp</p></div>
            <div className="bg-blue-50 p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-blue-600">{stats.graded || 0}</p><p className="text-xs text-[#43474e]">Đã chấm</p></div>
          </>
        ) : (
          <>
            <div className="bg-white p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-[#002143]">{stats.totalOpen || 0}</p><p className="text-xs text-[#43474e]">Bài tập đang mở</p></div>
            <div className="bg-amber-50 p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-amber-600">{stats.needGrading || 0}</p><p className="text-xs text-[#43474e]">Cần chấm điểm</p></div>
            <div className="bg-green-50 p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p><p className="text-xs text-[#43474e]">Đã hoàn thành</p></div>
            <div className="bg-[#ffdad6] p-5 rounded-2xl shadow-sm text-center"><p className="text-2xl font-bold text-[#73000a]">{stats.overdue || 0}</p><p className="text-xs text-[#43474e]">Quá hạn</p></div>
          </>
        )}
      </div>

      {/* Filters (Student) */}
      {role === 'student' && (
        <div className="flex gap-2 pb-2 overflow-x-auto">
            {['Tất cả', 'Chưa nộp', 'Đã nộp', 'Đã chấm'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${filter === f ? 'bg-[#13375f] text-white shadow-md' : 'bg-white text-[#43474e] border border-slate-200 hover:bg-slate-50'}`}
                >
                  {f}
                </button>
            ))}
        </div>
      )}

      {/* Student Assignments */}
      {role === 'student' && (
        <div className="space-y-4 min-h-[400px]">
          {isLoading && <div className="text-center py-12 text-slate-500 animate-pulse">Đang tải bài tập...</div>}
          {!isLoading && filteredAssignments.length === 0 && (
            <div className="text-center py-12 bg-[#f4f3f7] rounded-3xl border border-dashed border-slate-300">
                <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">done_all</span>
                <p className="font-bold text-[#002143]">Không có bài tập nào!</p>
                <p className="text-sm text-slate-500">Tuyệt vời, bạn đã hoàn thành hết mục tiêu trong bộ lọc này.</p>
            </div>
          )}
          {!isLoading && filteredAssignments.map((a, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow group">
              <div className="w-14 h-14 rounded-2xl bg-[#f4f3f7] flex items-center justify-center text-[#002143] group-hover:bg-[#13375f] group-hover:text-white transition-all">
                <span className="material-symbols-outlined text-2xl">{a.icon || 'assignment'}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-[#002143]">{a.title}</h3>
                <p className="text-xs text-[#43474e]">{a.course}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-[#43474e]">Hạn: {a.due}</p>
                {a.score && <p className="text-sm font-bold text-[#002143] mt-1">{a.score}</p>}
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${a.status === 'Chưa nộp' ? 'bg-amber-100 text-amber-700 border border-amber-200' : a.status === 'Đã nộp' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>{a.status}</span>
              {a.status === 'Chưa nộp' && (
                <button onClick={() => setSelectedAssignment(a)} className="bg-[#E24843] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-red-900/10">Nộp bài</button>
              )}
              {a.status === 'Đã nộp' && (
                <button className="bg-slate-100 text-slate-500 px-5 py-2.5 rounded-xl text-xs font-bold cursor-default flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  Chờ giáo viên chấm
                </button>
              )}
              {a.status === 'Đã chấm' && (
                <button 
                  onClick={() => handleViewFeedback(a)} 
                  className="bg-blue-50 text-blue-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  Xem kết quả
                </button>
              )}
              {a.status === 'Đã nộp' && (
                <button onClick={() => setSelectedAssignment(a)} className="bg-amber-50 text-amber-700 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-amber-100 transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Nộp lại
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Submission Modal (Student) */}
      {selectedAssignment && (
        <StudentSubmitBox 
            assignment={selectedAssignment}
            onClose={() => setSelectedAssignment(null)}
            onSuccess={fetchAssignments}
        />
      )}

      {/* ================================================ */}
      {/* Student Feedback Modal */}
      {/* ================================================ */}
      <StudentFeedbackViewer 
        feedbackData={feedbackData}
        onClose={() => setFeedbackData(null)}
      />

      {/* ================================================ */}
      {/* Teacher/Admin: Assignment Table */}
      {/* ================================================ */}
      {(role === 'teacher' || role === 'admin') && (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Bài tập</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider">Khóa học</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Đã nộp</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Cần chấm</th>
                <th className="px-6 py-4 text-xs font-bold text-[#43474e] uppercase tracking-wider text-center">Hạn nộp</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && <tr><td colSpan={6} className="text-center py-8">Đang tải...</td></tr>}
              {!isLoading && assignments.map((a, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#f4f3f7] flex items-center justify-center text-[#002143]"><span className="material-symbols-outlined text-xl">assignment</span></div>
                      <p className="text-sm font-bold text-[#002143]">{a.title}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#4b6076]">{a.course}</td>
                  <td className="px-6 py-5 text-center text-sm"><span className="font-bold text-[#002143]">{a.submitted}</span><span className="text-[#43474e]">/{a.total}</span></td>
                  <td className="px-6 py-5 text-center">
                    {a.needGrading > 0 ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">{a.needGrading} bài</span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">
                        <span className="material-symbols-outlined text-xs mr-1">check</span>Hoàn tất
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center text-xs text-[#43474e]">{a.dueDate}</td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleOpenGrading(a)} 
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold active:scale-95 transition-all ${
                          a.needGrading > 0 
                            ? 'bg-[#73000a] text-white hover:bg-[#4b0004] shadow-md shadow-[#73000a]/20' 
                            : 'bg-[#13375f] text-white hover:bg-[#002143]'
                        }`}
                      >
                        {a.needGrading > 0 ? 'Chấm điểm' : 'Xem chi tiết'}
                      </button>
                      <button onClick={() => openEditModal(a)} className="p-2 text-slate-400 hover:text-[#13375f] hover:bg-slate-100 rounded-lg transition-all" title="Sửa">
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button onClick={() => setDeleteConfirm(a)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Xóa">
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================================================ */}
      {/* Teacher Grading Fullscreen Modal */}
      {/* ================================================ */}
      <TeacherMarkingBoard 
        gradingAssignment={gradingAssignment}
        onClose={() => setGradingAssignment(null)}
        onGraded={fetchAssignments}
      />

      {/* Keyframe Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* ================================================ */}
      {/* Create/Edit Assignment Modal */}
      {/* ================================================ */}
      {(showCreateModal || editingAssignment) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" style={{animation: 'zoomIn 0.3s ease'}}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f4f3f7]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#13375f] rounded-lg text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">{editingAssignment ? 'edit' : 'add_circle'}</span>
                </div>
                <h3 className="font-bold text-[#002143] text-lg">{editingAssignment ? 'Sửa bài tập' : 'Tạo bài tập mới'}</h3>
              </div>
              <button onClick={() => { setShowCreateModal(false); setEditingAssignment(null); }} className="text-slate-400 hover:text-red-500 transition-colors p-2">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              {showCreateModal && (
                <div>
                  <label className="block text-sm font-bold text-[#002143] mb-2">Khóa học *</label>
                  <select value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 text-[#002143]">
                    <option value="">Chọn khóa học...</option>
                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-[#002143] mb-2">Tiêu đề bài tập *</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="Ví dụ: Writing Task 2 - Opinion Essay"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 text-[#002143]" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#002143] mb-2">Mô tả / Đề bài</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả yêu cầu bài tập..." rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 resize-none text-[#002143]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#002143] mb-2">Hạn nộp {showCreateModal ? '*' : ''}</label>
                  <input type="date" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 text-[#002143]" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#002143] mb-2">Thang điểm</label>
                  <input type="number" min="1" max="100" value={formData.max_score} onChange={e => setFormData({...formData, max_score: e.target.value})}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 text-[#002143]" />
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => { setShowCreateModal(false); setEditingAssignment(null); }} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
              <button onClick={editingAssignment ? handleUpdateAssignment : handleCreateAssignment}
                disabled={!formData.title || (showCreateModal && (!formData.course_id || !formData.due_date))}
                className="flex-1 py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-sm">{editingAssignment ? 'save' : 'add'}</span>
                {editingAssignment ? 'Lưu thay đổi' : 'Tạo bài tập'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================ */}
      {/* Delete Confirmation Modal */}
      {/* ================================================ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" style={{animation: 'zoomIn 0.3s ease'}}>
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center mb-5">
                <span className="material-symbols-outlined text-3xl text-red-500">delete_forever</span>
              </div>
              <h3 className="font-bold text-[#002143] text-xl mb-2">Xóa bài tập?</h3>
              <p className="text-sm text-[#43474e] mb-1">Bạn có chắc muốn xóa bài tập:</p>
              <p className="text-sm font-bold text-[#002143] mb-4">"{deleteConfirm.title}"</p>
              <p className="text-xs text-red-500 bg-red-50 p-3 rounded-xl">⚠️ Tất cả bài nộp của học sinh cũng sẽ bị xóa và không thể khôi phục.</p>
            </div>
            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
              <button onClick={() => handleDeleteAssignment(deleteConfirm.id)} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all active:scale-95 flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-sm">delete</span> Xóa vĩnh viễn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
