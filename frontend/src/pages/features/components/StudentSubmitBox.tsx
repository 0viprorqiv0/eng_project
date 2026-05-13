import React, { useState } from 'react';
import { api } from '../../../lib/api';
import { FileUpload } from '../../../components/FileUpload';

interface StudentSubmitBoxProps {
  assignment: any;
  onClose: () => void;
  onSuccess: () => void;
}

export function StudentSubmitBox({ assignment, onClose, onSuccess }: StudentSubmitBoxProps) {
  const [submitText, setSubmitText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<{file_path: string; file_name: string; file_url: string} | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitAssignment = async () => {
    if(!submitText.trim() && !uploadedFile) return;
    setSubmitting(true);
    try {
      await api.post(`/assignments/${assignment.id}/submit`, {
        content: submitText.trim() || null,
        file_url: uploadedFile?.file_url || null,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm" style={{animation: 'fadeIn 0.2s ease'}}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" style={{animation: 'zoomIn 0.3s ease'}}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-[#f4f3f7]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#13375f] rounded-lg text-white flex items-center justify-center"><span className="material-symbols-outlined">{assignment.icon || 'assignment'}</span></div>
                    <div>
                        <h3 className="font-bold text-[#002143] text-lg">{assignment.title}</h3>
                        <p className="text-xs text-[#43474e]">Khóa: {assignment.course}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors p-2"><span className="material-symbols-outlined">close</span></button>
            </div>
            <div className="p-6 space-y-4">
                <p className="text-sm text-[#43474e] bg-amber-50 p-3 rounded-xl border border-amber-100 mb-4">
                    <span className="font-bold text-amber-700">Hạn nộp:</span> {assignment.due}
                </p>
                
                {assignment.description && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                    <label className="block text-xs font-bold text-[#002143] mb-1 uppercase tracking-wider">Đề bài</label>
                    <p className="text-sm text-[#43474e] whitespace-pre-wrap">{assignment.description}</p>
                  </div>
                )}

                {assignment.teacher_file_url && (
                    <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                          <span className="material-symbols-outlined text-xl">description</span>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-0.5">Tài liệu đính kèm</p>
                          <p className="text-sm font-semibold text-[#002143] line-clamp-1">{assignment.teacher_file_name || 'Tai-lieu-dinh-kem'}</p>
                        </div>
                      </div>
                      <a href={assignment.teacher_file_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm">
                        <span className="material-symbols-outlined text-[16px]">download</span>
                        Tải về
                      </a>
                    </div>
                )}
                
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
                <button onClick={onClose} className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Hủy</button>
                <button onClick={handleSubmitAssignment} disabled={(!submitText.trim() && !uploadedFile) || submitting} className="flex-1 py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#0f2a47] disabled:opacity-50 transition-all flex justify-center items-center gap-2">
                    {submitting ? <><span className="animate-spin">⏳</span> Đang nộp...</> : <><span className="material-symbols-outlined text-sm">send</span> Nộp bài</>}
                </button>
            </div>
        </div>
    </div>
  );
}
