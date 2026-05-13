import React, { useState } from 'react';
import { FileSignature, Lightbulb, Download, CheckCircle2, Upload, Send } from 'lucide-react';
import { api } from '../../../lib/api';

interface HomeworkUploaderProps {
  selectedModule: any;
  onComplete: (moduleId: number) => void;
}

export function HomeworkUploader({ selectedModule, onComplete }: HomeworkUploaderProps) {
  const [homeworkContent, setHomeworkContent] = useState('');
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleHomeworkSubmit = async () => {
    if (!selectedModule || (!homeworkContent.trim() && !homeworkFile)) return;
    if (!selectedModule.assignment_id) {
      alert('Bài học này chưa có bài tập được gán. Vui lòng liên hệ giáo viên.');
      return;
    }
    setIsSubmitting(true);
    try {
      let fileUrl: string | null = null;
      if (homeworkFile) {
        const uploadData = await api.uploadFile('/upload/submission', homeworkFile);
        fileUrl = uploadData.file_path || null;
      }

      await api.post(`/assignments/${selectedModule.assignment_id}/submit`, {
        content: homeworkContent.trim() || null,
        file_url: fileUrl,
      });

      setSubmitSuccess(true);
      onComplete(selectedModule.id);
      setTimeout(() => setSubmitSuccess(false), 3000);
      setHomeworkContent('');
      setHomeworkFile(null);
    } catch (err: any) {
      alert(err?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedModule || selectedModule.lesson_type !== 'assignment') return null;

  return (
    <div className="w-full text-center py-6">
      <div className="w-20 h-20 bg-amber-50 shadow-inner rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600 border border-amber-100">
        <FileSignature size={36} />
      </div>
      <h2 className="text-3xl font-black text-[#13375f] mb-4 font-headline">{selectedModule.title}</h2>

      {(selectedModule.description || selectedModule.content) && (
        <div className="bg-amber-50/70 p-6 rounded-2xl border border-amber-100 mb-6 max-w-2xl mx-auto text-left shadow-sm">
          <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2"><Lightbulb size={20}/> Yêu cầu bài tập:</h4>
          <p className="text-amber-700/90 leading-relaxed font-medium whitespace-pre-wrap">{selectedModule.content || selectedModule.description}</p>
        </div>
      )}

      {selectedModule.materials_full_url && (
        <div className="mb-8 max-w-2xl mx-auto">
          <a href={selectedModule.materials_full_url} target="_blank" rel="noopener noreferrer"
            className="w-full px-6 py-4 bg-amber-100/50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl border border-amber-200 transition-all flex items-center justify-center gap-3">
            <Download size={20} /> Tải bài tập đính kèm
          </a>
        </div>
      )}

      {submitSuccess ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 max-w-xl mx-auto animate-in zoom-in-95">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-700 mb-2">Nộp bài thành công! 🎉</h3>
          <p className="text-emerald-600 text-sm">Giáo viên sẽ chấm bài sớm nhất có thể.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6 text-left">
          <div>
            <label className="block text-sm font-bold text-[#002143] mb-2">Nội dung bài làm</label>
            <textarea
              value={homeworkContent}
              onChange={e => setHomeworkContent(e.target.value)}
              placeholder="Nhập câu trả lời, bài luận hoặc đáp án..."
              rows={6}
              className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13375f] outline-none transition-all resize-none text-sm mb-4"
            />
            <label className="block text-sm font-bold text-[#002143] mb-2">Hoặc tải lên tệp bài làm (nếu có)</label>
            <div className="relative">
              <input
                type="file"
                onChange={e => setHomeworkFile(e.target.files?.[0] || null)}
                className="hidden"
                id="homework-file-upload"
              />
              <label htmlFor="homework-file-upload" className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-[#13375f] transition-all text-slate-500 font-medium text-sm">
                <Upload size={20} /> 
                {homeworkFile ? <span className="text-[#13375f] font-bold">{homeworkFile.name}</span> : 'Chọn tệp...'}
              </label>
            </div>
          </div>
          <button
            onClick={handleHomeworkSubmit}
            disabled={(!homeworkContent.trim() && !homeworkFile) || isSubmitting}
            className="w-full py-4 bg-[#13375f] text-white font-bold text-lg rounded-xl shadow-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSubmitting ? (
              <><span className="animate-spin">⏳</span> Đang nộp...</>
            ) : (
              <><Send size={20} /> Nộp Bài</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
