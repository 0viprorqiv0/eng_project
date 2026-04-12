import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Play, ChevronLeft, 
  BookOpen, FileText, Download, Clock, CheckCircle, ClipboardList,
  ChevronRight, List, X, Loader2, Send, Upload, CheckCircle2
} from 'lucide-react';
import { api } from '../../lib/api';

interface AssignmentData {
  id: number;
  title: string;
  description: string | null;
  max_score: number;
  due_date: string;
}

interface LessonData {
  id: number;
  title: string;
  content: string;
  video_url: string | null;
  video_path: string | null;
  video_full_url: string | null;
  materials_full_url: string | null;
  duration_minutes: number;
  sort_order: number;
  course: { id: number; title: string; color: string; slug: string };
  assignment: AssignmentData | null;
}

interface SiblingLesson {
  id: number;
  title: string;
  sort_order: number;
  duration_minutes: number;
  video_path: string | null;
}

export function LessonPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [siblings, setSiblings] = useState<SiblingLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'materials' | 'homework'>('content');
  const [sidebarOpen, setSidebarOpen] = useState(true);


  // Homework/Assignment state
  const [homeworkContent, setHomeworkContent] = useState('');
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lessons/${id}`);
        setLesson(res.lesson);
        setSiblings(res.siblings || []);
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLesson();
  }, [id]);



  const currentIdx = siblings.findIndex(s => s.id === lesson?.id);
  const prevLesson = currentIdx > 0 ? siblings[currentIdx - 1] : null;
  const nextLesson = currentIdx < siblings.length - 1 ? siblings[currentIdx + 1] : null;

  const hasAssignment = !!lesson?.assignment;

  // Homework submit
  const handleHomeworkSubmit = async () => {
    if (!lesson?.assignment || (!homeworkContent.trim() && !homeworkFile)) return;
    setIsSubmitting(true);
    try {
      let fileUrl: string | null = null;
      if (homeworkFile) {
        const uploadData = await api.uploadFile('/upload/submission', homeworkFile);
        fileUrl = uploadData.file_path || null;
      }

      await api.post(`/assignments/${lesson.assignment.id}/submit`, {
        content: homeworkContent.trim() || null,
        file_url: fileUrl,
      });
      setSubmitSuccess(true);
      setHomeworkContent('');
      setHomeworkFile(null);
    } catch (err: any) {
      alert(err?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#E24843] animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl font-bold mb-2">Không tìm thấy bài học</p>
          <button onClick={() => navigate(-1)} className="text-[#E24843] hover:underline">Quay lại</button>
        </div>
      </div>
    );
  }

  const hasVideo = lesson.video_full_url;

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col">
      {/* Top Nav Bar */}
      <header className="bg-[#0d1f3c] border-b border-white/10 px-4 py-3 flex items-center gap-4 z-20">
        <button onClick={() => navigate(`/course/${lesson.course.id}`)} className="text-white/60 hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-medium hidden sm:inline">Quay lại khóa học</span>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white/40 text-xs truncate">{lesson.course.title}</p>
          <h1 className="text-white font-bold text-sm truncate">{lesson.title}</h1>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-white/60 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-all lg:hidden"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player */}
          {hasVideo ? (
            <div className="bg-black aspect-video w-full max-h-[70vh]">
              <video
                ref={videoRef}
                src={lesson.video_full_url!}
                className="w-full h-full object-contain"
                controls
                controlsList="nodownload"
                preload="metadata"
              />
            </div>
          ) : (
            <div className="bg-gradient-to-br from-[#13375f] to-[#0a1628] aspect-video w-full max-h-[40vh] flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/40 text-sm">Bài học này chỉ có nội dung văn bản</p>
              </div>
            </div>
          )}

          {/* Content Tabs */}
          <div className="bg-[#0d1f3c] border-b border-white/10">
            <div className="flex gap-1 px-4">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'content'
                    ? 'text-[#E24843] border-[#E24843]'
                    : 'text-white/50 border-transparent hover:text-white/80'
                }`}
              >
                <BookOpen className="w-4 h-4 inline mr-2" />
                Nội dung bài học
              </button>
              <button
                onClick={() => setActiveTab('materials')}
                className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${
                  activeTab === 'materials'
                    ? 'text-[#E24843] border-[#E24843]'
                    : 'text-white/50 border-transparent hover:text-white/80'
                }`}
              >
                <FileText className="w-4 h-4 inline mr-2" />
                Tài liệu đính kèm
              </button>
              {hasAssignment && (
                <button
                  onClick={() => setActiveTab('homework')}
                  className={`px-5 py-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                    activeTab === 'homework'
                      ? 'text-[#E24843] border-[#E24843]'
                      : 'text-white/50 border-transparent hover:text-white/80'
                  }`}
                >
                  <ClipboardList className="w-4 h-4" />
                  Bài tập về nhà
                  <span className="text-[10px] bg-[#E24843] text-white px-1.5 py-0.5 rounded-full font-bold leading-none">!</span>
                </button>
              )}
            </div>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 bg-[#0a1628]">
            {activeTab === 'content' && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#0d1f3c] rounded-2xl p-8 border border-white/5">
                  <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
                  <div className="flex items-center gap-4 text-white/40 text-sm mb-6">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {lesson.duration_minutes} phút</span>
                    <span>Bài {lesson.sort_order} / {siblings.length}</span>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <div className="text-white/80 leading-relaxed whitespace-pre-line text-sm">
                      {lesson.content}
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6 gap-4">
                  {prevLesson ? (
                    <Link
                      to={`/lesson/${prevLesson.id}`}
                      className="flex items-center gap-3 bg-[#0d1f3c] hover:bg-[#13375f] border border-white/10 rounded-2xl px-5 py-4 transition-all group flex-1"
                    >
                      <ChevronLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                      <div className="min-w-0">
                        <p className="text-white/40 text-xs">Bài trước</p>
                        <p className="text-white text-sm font-bold truncate">{prevLesson.title}</p>
                      </div>
                    </Link>
                  ) : <div className="flex-1" />}

                  {nextLesson ? (
                    <Link
                      to={`/lesson/${nextLesson.id}`}
                      className="flex items-center gap-3 bg-[#0d1f3c] hover:bg-[#13375f] border border-white/10 rounded-2xl px-5 py-4 transition-all group flex-1 text-right justify-end"
                    >
                      <div className="min-w-0">
                        <p className="text-white/40 text-xs">Bài tiếp theo</p>
                        <p className="text-white text-sm font-bold truncate">{nextLesson.title}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                    </Link>
                  ) : <div className="flex-1" />}
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="max-w-3xl mx-auto">
                {lesson.materials_full_url ? (
                  <div className="bg-[#0d1f3c] rounded-2xl p-8 border border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#E24843]/10 flex items-center justify-center">
                        <FileText className="w-7 h-7 text-[#E24843]" />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">Tài liệu bài học</h3>
                        <p className="text-white/40 text-sm">Tải về để học ngoại tuyến</p>
                      </div>
                    </div>
                    <a
                      href={lesson.materials_full_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#E24843] hover:bg-[#c93e39] text-white px-6 py-3.5 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-red-900/20"
                    >
                      <Download className="w-5 h-5" />
                      Tải tài liệu PDF
                    </a>
                  </div>
                ) : (
                  <div className="bg-[#0d1f3c] rounded-2xl p-12 border border-white/5 text-center">
                    <FileText className="w-12 h-12 text-white/15 mx-auto mb-4" />
                    <p className="text-white/40 text-sm">Bài học này chưa có tài liệu đính kèm</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'homework' && hasAssignment && lesson.assignment && (
              <div className="max-w-3xl mx-auto">
                <div className="bg-[#0d1f3c] rounded-2xl p-8 border border-white/5">
                  {/* Assignment header */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <ClipboardList className="w-7 h-7 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">{lesson.assignment.title}</h3>
                      <div className="flex items-center gap-4 text-white/40 text-xs mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Hạn nộp: {new Date(lesson.assignment.due_date).toLocaleDateString('vi-VN')}</span>
                        <span>Điểm tối đa: {lesson.assignment.max_score}</span>
                      </div>
                    </div>
                  </div>

                  {/* Assignment description */}
                  {lesson.assignment.description && (
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-5 mb-6">
                      <p className="text-amber-200/80 text-sm leading-relaxed whitespace-pre-wrap">{lesson.assignment.description}</p>
                    </div>
                  )}

                  {submitSuccess ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center">
                      <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-emerald-300 mb-2">Nộp bài thành công! 🎉</h3>
                      <p className="text-emerald-400/60 text-sm">Giáo viên sẽ chấm bài sớm nhất có thể.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {/* Text input */}
                      <div>
                        <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Nội dung bài làm</label>
                        <textarea
                          value={homeworkContent}
                          onChange={e => setHomeworkContent(e.target.value)}
                          placeholder="Nhập câu trả lời, bài luận hoặc đáp án..."
                          rows={6}
                          className="w-full p-4 bg-white/5 border border-white/10 text-white rounded-xl focus:ring-2 focus:ring-[#E24843]/30 outline-none transition-all resize-none text-sm placeholder-white/30"
                        />
                      </div>

                      {/* File upload */}
                      <div>
                        <label className="block text-xs font-bold text-white/50 mb-2 uppercase tracking-wider">Tệp đính kèm</label>
                        {homeworkFile ? (
                          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                            <FileText className="w-5 h-5 text-[#E24843] shrink-0" />
                            <span className="text-sm font-medium text-white truncate flex-1">{homeworkFile.name}</span>
                            <span className="text-xs text-white/40">{(homeworkFile.size / 1024 / 1024).toFixed(1)} MB</span>
                            <button onClick={() => setHomeworkFile(null)} className="p-1 text-white/40 hover:text-red-400"><X className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <label className="flex items-center gap-3 p-4 border border-dashed border-white/15 rounded-xl cursor-pointer hover:border-white/30 transition-colors">
                            <Upload className="w-5 h-5 text-white/40 shrink-0" />
                            <span className="text-sm text-white/40">Chọn tệp hoặc kéo thả vào đây (PDF, DOCX, ZIP)</span>
                            <input type="file" accept=".pdf,.doc,.docx,.zip,.xlsx,.txt" className="hidden"
                              onChange={e => e.target.files?.[0] && setHomeworkFile(e.target.files[0])} />
                          </label>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        onClick={handleHomeworkSubmit}
                        disabled={(!homeworkContent.trim() && !homeworkFile) || isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-[#E24843] to-[#e65540] text-white font-bold text-base rounded-xl shadow-xl hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        {isSubmitting ? (
                          <><Loader2 className="w-5 h-5 animate-spin" /> Đang nộp...</>
                        ) : (
                          <><Send className="w-5 h-5" /> Nộp bài</>  
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Course Content */}
        <aside className={`w-80 bg-[#0d1f3c] border-l border-white/10 overflow-y-auto flex-shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full hidden'
        } fixed right-0 top-0 bottom-0 z-10 lg:relative lg:translate-x-0 lg:block pt-[57px] lg:pt-0`}>
          <div className="p-4 border-b border-white/10">
            <h3 className="text-white font-bold text-sm">Nội dung khóa học</h3>
            <p className="text-white/40 text-xs mt-1">{siblings.length} bài học</p>
          </div>
          <div className="divide-y divide-white/5">
            {siblings.map((s) => (
              <Link
                key={s.id}
                to={`/lesson/${s.id}`}
                className={`flex items-center gap-3 px-4 py-3.5 transition-all group ${
                  s.id === lesson.id
                    ? 'bg-[#E24843]/10 border-l-3 border-[#E24843]'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  s.id === lesson.id
                    ? 'bg-[#E24843] text-white'
                    : 'bg-white/5 text-white/40 group-hover:bg-white/10'
                }`}>
                  {s.video_path ? <Play className="w-3.5 h-3.5" /> : s.sort_order}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${
                    s.id === lesson.id ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                  }`}>
                    {s.title}
                  </p>
                  <p className="text-white/30 text-[10px] mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {s.duration_minutes} phút
                  </p>
                </div>
                {s.id === lesson.id && (
                  <div className="w-2 h-2 rounded-full bg-[#E24843] animate-pulse flex-shrink-0" />
                )}
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
