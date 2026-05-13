import React from 'react';

interface StudentFeedbackViewerProps {
  feedbackData: any;
  onClose: () => void;
}

export function StudentFeedbackViewer({ feedbackData, onClose }: StudentFeedbackViewerProps) {
  if (!feedbackData) return null;

  const getScoreColor = (score: number, max: number) => {
    const ratio = score / max;
    if (ratio >= 0.8) return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', ring: 'ring-emerald-100' };
    if (ratio >= 0.5) return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', ring: 'ring-amber-100' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', ring: 'ring-red-100' };
  };

  return (
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
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
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
          <button onClick={onClose} className="w-full py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] transition-all active:scale-[0.98]">Đóng</button>
        </div>
      </div>
    </div>
  );
}
