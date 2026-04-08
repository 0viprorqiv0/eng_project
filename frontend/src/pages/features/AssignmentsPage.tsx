import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import { FileUpload } from '../../components/FileUpload';

export function AssignmentsPage() {
  const { user } = useAuth();
  const role = user?.role || 'student';

  const [assignments, setAssignments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState('Tất cả');
  const [selectedAssignment, setSelectedAssignment] = useState<any|null>(null);
  const [submitText, setSubmitText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{file_path: string; file_name: string; file_url: string} | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Teacher grading state
  const [gradingAssignment, setGradingAssignment] = useState<any|null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionStats, setSubmissionStats] = useState<any>({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any|null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradingInProgress, setGradingInProgress] = useState(false);

  // Student feedback state
  const [feedbackData, setFeedbackData] = useState<any|null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

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

  const handleSubmitAssignment = async () => {
    if(!submitText.trim() && !uploadedFile) return;
    setSubmitting(true);
    try {
      await api.post(`/assignments/${selectedAssignment.id}/submit`, {
        content: submitText.trim() || null,
        file_url: uploadedFile?.file_url || null,
      });
      setAssignments(prev => prev.map(a => 
        a.id === selectedAssignment.id ? { ...a, status: 'Đã nộp' } : a
      ));
      if (stats.notSubmitted > 0) {
        setStats((prev: any) => ({ ...prev, notSubmitted: prev.notSubmitted - 1, submitted: prev.submitted + 1 }));
      }
      setSelectedAssignment(null);
      setSubmitText('');
      setUploadedFile(null);
    } catch (err: any) {
      alert(err?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // Teacher: Load submissions for an assignment
  const handleOpenGrading = async (assignment: any) => {
    setGradingAssignment(assignment);
    setLoadingSubmissions(true);
    setActiveSubmission(null);
    try {
      const res = await api.get(`/assignments/${assignment.id}/submissions`);
      if (res) {
        setSubmissions(res.submissions || []);
        setSubmissionStats(res.stats || {});
      }
    } catch (err) {
      console.error('Failed to load submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  // Teacher: Grade a submission
  const handleGradeSubmission = async () => {
    if (!activeSubmission || !gradeScore) return;
    setGradingInProgress(true);
    try {
      await api.put(`/assignments/${gradingAssignment.id}/grade/${activeSubmission.id}`, {
        score: parseFloat(gradeScore),
        feedback: gradeFeedback.trim() || null,
      });
      // Refresh submissions list
      const res = await api.get(`/assignments/${gradingAssignment.id}/submissions`);
      if (res) {
        setSubmissions(res.submissions || []);
        setSubmissionStats(res.stats || {});
      }
      // Refresh main assignments list
      fetchAssignments();
      setActiveSubmission(null);
      setGradeScore('');
      setGradeFeedback('');
    } catch (err: any) {
      alert(err?.message || 'Chấm điểm thất bại. Vui lòng thử lại.');
    } finally {
      setGradingInProgress(false);
    }
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

  const filteredAssignments = assignments.filter(a => {
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

  // Helper: score color
  const getScoreColor = (score: number, maxScore: number) => {
    const pct = (score / maxScore) * 100;
    if (pct >= 80) return { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200', ring: 'ring-emerald-100' };
    if (pct >= 60) return { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200', ring: 'ring-amber-100' };
    return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200', ring: 'ring-red-100' };
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
          <button onClick={() => { setShowCreateModal(true); setFormData({ course_id: courses[0]?.id?.toString() || '', title: '', description: '', icon: 'assignment', due_date: '', max_score: '10' }); }} className="bg-[#13375f] text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all active:scale-95">
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" style={{animation: 'zoomIn 0.3s ease'}}>
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f4f3f7]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#13375f] rounded-lg text-white flex items-center justify-center"><span className="material-symbols-outlined">{selectedAssignment.icon || 'assignment'}</span></div>
                        <div>
                            <h3 className="font-bold text-[#002143] text-lg">{selectedAssignment.title}</h3>
                            <p className="text-xs text-[#43474e]">Khóa: {selectedAssignment.course}</p>
                        </div>
                    </div>
                    <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-red-500 transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
                </div>
                <div className="p-6 space-y-4">
                    <p className="text-sm text-[#43474e] bg-amber-50 p-3 rounded-xl border border-amber-100">
                        <span className="font-bold text-amber-700">Hạn nộp:</span> {selectedAssignment.due}
                    </p>
                    <div>
                        <label className="block text-sm font-bold text-[#002143] mb-2">Nội dung bài làm</label>
                        <textarea 
                            value={submitText}
                            onChange={e => setSubmitText(e.target.value)}
                            placeholder="Nhập nội dung bài luận hoặc đáp án vào đây..."
                            className="w-full h-28 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/20 resize-none text-[#002143]"
                        ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-[#002143] mb-2">Hoặc tải file bài làm lên</label>
                        <FileUpload
                          onFileUploaded={(data) => setUploadedFile(data)}
                          uploadEndpoint="/upload/submission"
                          accept=".pdf,.doc,.docx,.zip,.jpg,.png,.mp3"
                          maxSizeMB={20}
                          label="Kéo thả file bài làm vào đây"
                        />
                    </div>
                </div>
                <div className="p-6 pt-0 flex gap-3">
                    <button onClick={() => {setSelectedAssignment(null); setUploadedFile(null);}} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                    <button onClick={handleSubmitAssignment} disabled={(!submitText.trim() && !uploadedFile) || submitting} className="flex-1 py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                        {submitting ? <><span className="animate-spin">⏳</span> Đang nộp...</> : <><span className="material-symbols-outlined text-sm">send</span> Nộp bài</>}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* ================================================ */}
      {/* Student Feedback Modal */}
      {/* ================================================ */}
      {feedbackData && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" style={{animation: 'zoomIn 0.3s ease'}}>
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#002143] to-[#13375f]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">{feedbackData.assignment?.icon || 'assignment'}</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">{feedbackData.assignment?.title}</h3>
                  <p className="text-xs text-[#82a1cf]">Khóa: {feedbackData.assignment?.course}</p>
                </div>
              </div>
              <button onClick={() => setFeedbackData(null)} className="text-white/60 hover:text-white transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="p-6 space-y-5">
              {feedbackData.submission?.status === 'graded' ? (
                <>
                  {/* Score Display */}
                  {(() => {
                    const sc = getScoreColor(parseFloat(feedbackData.submission.score), feedbackData.submission.max_score);
                    return (
                      <div className={`${sc.bg} ${sc.border} border rounded-2xl p-6 text-center ring-4 ${sc.ring}`}>
                        <p className="text-sm font-bold text-[#43474e] uppercase tracking-wider mb-2">Điểm số của bạn</p>
                        <div className={`text-5xl font-headline font-extrabold ${sc.text} mb-1`}>
                          {feedbackData.submission.score}<span className="text-2xl text-[#43474e] font-normal">/{feedbackData.submission.max_score}</span>
                        </div>
                        <div className="mt-3 flex items-center justify-center gap-2">
                          {parseFloat(feedbackData.submission.score) / feedbackData.submission.max_score >= 0.8 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                              <span className="material-symbols-outlined text-sm" style={{fontVariationSettings: "'FILL' 1"}}>emoji_events</span> Xuất sắc!
                            </span>
                          ) : parseFloat(feedbackData.submission.score) / feedbackData.submission.max_score >= 0.6 ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                              <span className="material-symbols-outlined text-sm">thumb_up</span> Khá tốt
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">
                              <span className="material-symbols-outlined text-sm">trending_up</span> Cần cải thiện
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })()}

                  {/* Teacher Feedback */}
                  {feedbackData.submission.feedback && (
                    <div className="bg-[#f4f3f7] rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="material-symbols-outlined text-[#13375f] text-lg">chat</span>
                        <p className="text-sm font-bold text-[#002143]">Nhận xét từ giáo viên</p>
                      </div>
                      <div className="bg-white rounded-xl p-4 text-sm text-[#002143] leading-relaxed border border-slate-100 shadow-sm">
                        <span className="text-3xl text-[#13375f]/20 font-serif leading-none">"</span>
                        <p className="mt-[-8px] ml-4">{feedbackData.submission.feedback}</p>
                      </div>
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-[#43474e] bg-slate-50 p-3 rounded-xl">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">schedule</span>
                      Nộp lúc: {feedbackData.submission.submitted_at}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">grading</span>
                      Chấm lúc: {feedbackData.submission.graded_at}
                    </span>
                  </div>
                </>
              ) : (
                // Not graded yet
                <div className="text-center py-8">
                  <div className="w-16 h-16 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
                    <span className="material-symbols-outlined text-3xl text-amber-500">hourglass_top</span>
                  </div>
                  <h4 className="font-bold text-[#002143] text-lg mb-2">Chờ giáo viên chấm bài</h4>
                  <p className="text-sm text-[#43474e]">Bài làm của bạn đã được nộp thành công. Giáo viên sẽ chấm điểm sớm nhất có thể.</p>
                  <p className="text-xs text-[#43474e] mt-3 flex items-center justify-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    Nộp lúc: {feedbackData.submission?.submitted_at}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 pt-0">
              <button onClick={() => setFeedbackData(null)} className="w-full py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] transition-all active:scale-[0.98]">Đóng</button>
            </div>
          </div>
        </div>
      )}

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
      {gradingAssignment && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{animation: 'zoomIn 0.3s ease'}}>
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-[#002143] to-[#13375f] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-lg text-white flex items-center justify-center">
                  <span className="material-symbols-outlined">grading</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Chấm điểm: {gradingAssignment.title}</h3>
                  <p className="text-xs text-[#82a1cf]">Khóa: {gradingAssignment.course} • Hạn: {gradingAssignment.dueDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-3 text-xs">
                  <span className="px-3 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-full font-bold">{submissionStats.total || 0} bài nộp</span>
                  <span className="px-3 py-1.5 bg-emerald-500/30 text-emerald-100 rounded-full font-bold">{submissionStats.graded || 0} đã chấm</span>
                  {(submissionStats.pending || 0) > 0 && (
                    <span className="px-3 py-1.5 bg-amber-500/30 text-amber-100 rounded-full font-bold">{submissionStats.pending} chờ chấm</span>
                  )}
                </div>
                <button 
                  onClick={() => {setGradingAssignment(null); setSubmissions([]); setActiveSubmission(null); setGradeScore(''); setGradeFeedback('');}} 
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingSubmissions ? (
                <div className="text-center py-12 text-slate-500 animate-pulse">Đang tải danh sách bài nộp...</div>
              ) : submissions.length === 0 ? (
                <div className="text-center py-12 bg-[#f4f3f7] rounded-3xl border border-dashed border-slate-300">
                  <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">inbox</span>
                  <p className="font-bold text-[#002143]">Chưa có học sinh nào nộp bài</p>
                  <p className="text-sm text-slate-500">Hãy chờ học sinh hoàn thành và nộp bài tập.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submissions.map((s) => (
                    <div key={s.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${activeSubmission?.id === s.id ? 'border-[#13375f] shadow-lg ring-2 ring-[#13375f]/10' : 'border-slate-200 hover:border-slate-300 shadow-sm'}`}>
                      {/* Submission Row */}
                      <div className="p-5 flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#13375f] to-[#002143] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                          {s.student.avatar_url ? (
                            <img src={s.student.avatar_url} alt={s.student.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            getInitials(s.student.name)
                          )}
                        </div>

                        {/* Student Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-[#002143] text-sm">{s.student.name}</p>
                          <p className="text-[10px] text-[#51667c] truncate">{s.student.email}</p>
                        </div>

                        {/* Submitted Time */}
                        <div className="text-right flex-shrink-0">
                          <p className="text-[10px] text-[#43474e] font-medium flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs">schedule</span>
                            {s.submitted_at}
                          </p>
                        </div>

                        {/* File Download */}
                        {s.file_url && (
                          <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors">
                            <span className="material-symbols-outlined text-sm">download</span>
                            Tải file
                          </a>
                        )}

                        {/* Status Badge */}
                        {s.status === 'graded' ? (
                          <div className="flex-shrink-0 flex items-center gap-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                              <span className="material-symbols-outlined text-xs mr-1">check</span>
                              {s.score}/{s.max_score}
                            </span>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setActiveSubmission(activeSubmission?.id === s.id ? null : s);
                              setGradeScore('');
                              setGradeFeedback('');
                            }}
                            className="flex-shrink-0 inline-flex items-center gap-1.5 px-4 py-2 bg-[#73000a] text-white rounded-xl text-[10px] font-bold hover:bg-[#4b0004] active:scale-95 transition-all shadow-md shadow-[#73000a]/20"
                          >
                            <span className="material-symbols-outlined text-sm">edit_note</span>
                            Chấm điểm
                          </button>
                        )}
                      </div>

                      {/* Submitted Content Preview */}
                      {s.content && (
                        <div className="px-5 pb-3">
                          <div className="bg-slate-50 rounded-xl p-3 text-xs text-[#002143] border border-slate-100">
                            <span className="text-[10px] font-bold text-[#51667c] uppercase tracking-wider block mb-1">Nội dung bài làm:</span>
                            <p className="leading-relaxed whitespace-pre-wrap">{s.content}</p>
                          </div>
                        </div>
                      )}

                      {/* Grading Form (expanded) */}
                      {activeSubmission?.id === s.id && s.status !== 'graded' && (
                        <div className="px-5 pb-5 border-t border-slate-100 pt-4" style={{animation: 'slideDown 0.3s ease'}}>
                          <div className="bg-[#f4f3f7] rounded-2xl p-5 space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="material-symbols-outlined text-[#73000a] text-lg">edit_note</span>
                              <p className="font-bold text-[#002143] text-sm">Chấm bài cho: {s.student.name}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-[#002143] mb-1.5">Điểm số (0 - {gradingAssignment.max_score || 10})</label>
                                <input 
                                  type="number"
                                  min="0"
                                  max={gradingAssignment.max_score || 10}
                                  step="0.5"
                                  value={gradeScore}
                                  onChange={e => setGradeScore(e.target.value)}
                                  placeholder={`Nhập điểm (tối đa ${gradingAssignment.max_score || 10})...`}
                                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#73000a]/20 font-bold text-[#002143]"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-bold text-[#002143] mb-1.5">Nhận xét & Feedback</label>
                                <textarea 
                                  value={gradeFeedback}
                                  onChange={e => setGradeFeedback(e.target.value)}
                                  placeholder="Nhập nhận xét cho bài làm..."
                                  className="w-full h-[42px] p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#73000a]/20 resize-none text-[#002143]"
                                ></textarea>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                              <button 
                                onClick={() => {setActiveSubmission(null); setGradeScore(''); setGradeFeedback('');}}
                                className="px-5 py-2.5 bg-white text-slate-600 font-bold rounded-xl text-xs hover:bg-slate-100 transition-colors"
                              >
                                Hủy
                              </button>
                              <button 
                                onClick={handleGradeSubmission}
                                disabled={!gradeScore || gradingInProgress}
                                className="px-6 py-2.5 bg-[#73000a] text-white font-bold rounded-xl text-xs hover:bg-[#4b0004] disabled:opacity-50 transition-all active:scale-95 flex items-center gap-2 shadow-md shadow-[#73000a]/20"
                              >
                                {gradingInProgress ? (
                                  <><span className="animate-spin">⏳</span> Đang lưu...</>
                                ) : (
                                  <><span className="material-symbols-outlined text-sm">check_circle</span> Lưu kết quả</>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show feedback if already graded */}
                      {s.status === 'graded' && s.feedback && (
                        <div className="px-5 pb-3">
                          <div className="bg-emerald-50 rounded-xl p-3 text-xs border border-emerald-100">
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block mb-1">Nhận xét đã gửi:</span>
                            <p className="text-[#002143] leading-relaxed">{s.feedback}</p>
                            {s.graded_at && <p className="text-[10px] text-emerald-600 mt-2">Chấm lúc: {s.graded_at}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
                    {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
