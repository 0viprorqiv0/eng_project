import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';

interface TeacherMarkingBoardProps {
  gradingAssignment: any;
  onClose: () => void;
  onGraded: () => void;
}

export function TeacherMarkingBoard({ gradingAssignment, onClose, onGraded }: TeacherMarkingBoardProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [submissionStats, setSubmissionStats] = useState<any>({});
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [activeSubmission, setActiveSubmission] = useState<any|null>(null);
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradingInProgress, setGradingInProgress] = useState(false);

  useEffect(() => {
    if (gradingAssignment) {
      loadSubmissions();
    }
  }, [gradingAssignment]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    setActiveSubmission(null);
    try {
      const res = await api.get(`/assignments/${gradingAssignment.id}/submissions`);
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

  const handleGradeSubmission = async () => {
    if (!activeSubmission || !gradeScore) return;
    setGradingInProgress(true);
    try {
      await api.put(`/assignments/${gradingAssignment.id}/grade/${activeSubmission.id}`, {
        score: parseFloat(gradeScore),
        feedback: gradeFeedback.trim() || null,
      });
      // Refresh submissions list
      await loadSubmissions();
      // Notify parent to refresh main list
      onGraded();
      
      setActiveSubmission(null);
      setGradeScore('');
      setGradeFeedback('');
    } catch (err: any) {
      alert(err?.message || 'Chấm điểm thất bại. Vui lòng thử lại.');
    } finally {
      setGradingInProgress(false);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  };

  if (!gradingAssignment) return null;

  return (
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
              onClick={onClose} 
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
                      {s.submitted_at ? (
                        <p className="text-[10px] text-[#43474e] font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs">schedule</span>
                          {s.submitted_at}
                        </p>
                      ) : (
                          <p className="text-[10px] text-slate-400 italic">Trống</p>
                      )}
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
                    ) : s.status === 'pending' ? (
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-500 rounded-full text-[10px] font-bold border border-red-100">
                          <span className="material-symbols-outlined text-xs mr-1">history_toggle_off</span>
                          Chưa nộp bài
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
  );
}
