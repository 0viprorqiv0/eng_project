import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bell, Settings, BookOpen, PlayCircle, Headphones, FileSignature, Lock,
  CheckCircle2, FileText, HelpCircle, Moon, ArrowRight, Plus, Search,
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Monitor, Lightbulb,
  FolderArchive, Download, Table2, GraduationCap, Upload, MessageSquare, User, Clock, Send, X, Trash2
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../components/AuthContext';
import { DiscussionForum } from './components/DiscussionForum';
import { LessonSidebar } from './components/LessonSidebar';
import { HomeworkUploader } from './components/HomeworkUploader';
import { VideoPlayerBlock } from './components/VideoPlayerBlock';

type LessonType = 'video' | 'document' | 'quiz' | 'assignment';

interface LessonModule {
  id: number;
  title: string;
  lesson_type: LessonType;
  content?: string;
  description?: string;
  video_path?: string;
  video_url?: string;
  video_full_url?: string;
  materials_path?: string;
  materials_full_url?: string;
  questions_data?: any[];
  duration_minutes: number;
  sort_order: number;
  completed?: boolean;
  assignment_id?: number;  // linked assignment FK — direct submit, no title matching
  is_free_preview?: boolean;
}

export function CourseDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<LessonModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<LessonModule | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userEnrolled, setUserEnrolled] = useState(false);

  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');

  // Video state removed to VideoPlayerBlock.tsx

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);

  // Homework/Assignment state and logic removed to HomeworkUploader.tsx

  // Notes
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<{id: number; time: string; text: string}[]>([]);
  const [newNote, setNewNote] = useState('');

  const handleDeleteLesson = async () => {
    if (!selectedModule) return;
    if (!window.confirm(`Bạn có chắc chắn muốn xóa bài giảng: "${selectedModule.title}"?\nThao tác này rất nguy hiểm và không thể hoàn tác.`)) {
      return;
    }

    try {
      await api.delete(`/lessons/${selectedModule.id}`);
      setModules(prev => prev.filter(m => m.id !== selectedModule.id));
      setSelectedModule(null);
      alert('Đã xóa bài giảng thành công.');
    } catch (e: any) {
      alert(e?.message || 'Có lỗi khi xóa bài giảng');
    }
  };

  // Discussion State removed to DiscussionForum.tsx

  // Local state for sidebar removed to LessonSidebar.tsx

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourse({
          ...res,
          category: res.category || 'Tất cả',
          level: res.level || 'Mọi cấp độ'
        });
        setUserEnrolled(!!res.user_enrolled);

        const loadedModules: LessonModule[] = (res.lessons || []).map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          lesson_type: lesson.lesson_type || 'video',
          content: lesson.content,
          description: lesson.description,
          video_path: lesson.video_path,
          video_url: lesson.video_url,
          video_full_url: lesson.video_path ? `${window.location.protocol}//127.0.0.1:8000/storage/${lesson.video_path}` : lesson.video_url,
          materials_path: lesson.materials_path,
          materials_full_url: lesson.materials_path ? `${window.location.protocol}//127.0.0.1:8000/storage/${lesson.materials_path}` : null,
          questions_data: lesson.questions_data || [],
          duration_minutes: lesson.duration_minutes || 0,
          sort_order: lesson.sort_order,
          completed: false,
          assignment_id: lesson.assignment?.id ?? undefined,
          is_free_preview: !!lesson.is_free_preview,
        }));

        if (loadedModules.length === 0) {
          loadedModules.push({
            id: 0, title: 'Bài học đang cập nhật', lesson_type: 'video',
            duration_minutes: 0, sort_order: 1, completed: false,
          });
        }

        // Fetch progress from API and merge
        try {
          const progress = await api.get(`/courses/${id}/progress`);
          if (progress && typeof progress === 'object') {
            loadedModules.forEach(m => {
              if (progress[m.id]?.completed) {
                m.completed = true;
              }
            });
          }
        } catch (e) { console.warn('[BeeLearn] Progress fetch failed:', e); }

        setModules(loadedModules);
        setSelectedModule(loadedModules[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  // Toggle lesson completion (persisted to API)
  const markModuleComplete = async (moduleId: number) => {
    const target = modules.find(m => m.id === moduleId);
    if (!target) return;
    const newCompleted = !target.completed;
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, completed: newCompleted } : m));
    try {
      if (newCompleted) {
        await api.post(`/lessons/${moduleId}/complete`, {});
      } else {
        await api.delete(`/lessons/${moduleId}/complete`);
      }
    } catch (e) { console.warn('[BeeLearn] Progress save failed:', e); }
  };


  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Quiz handlers
  const handleQuizSubmit = () => {
    if (!selectedModule?.questions_data?.length) return;
    let correct = 0;
    selectedModule.questions_data.forEach((q: any) => {
      if (q.type === 'multiple_choice') {
        const correctIdx = q.options?.findIndex((o: any) => o.isCorrect);
        if (quizAnswers[q.id] === correctIdx) correct++;
      }
    });
    const mcCount = selectedModule.questions_data.filter((q: any) => q.type === 'multiple_choice').length;
    setQuizResult(mcCount > 0 ? Math.round((correct / mcCount) * 100) : 100);
    markModuleComplete(selectedModule.id); // FIX: persist quiz completion
  };

  // Homework/Assignment submit logic removed to HomeworkUploader.tsx

  // Notes — API-backed
  useEffect(() => {
    if (!selectedModule || selectedModule.id === 0) return;
    const fetchNotes = async () => {
      try {
        const res = await api.get(`/lessons/${selectedModule.id}/notes`);
        setNotes((res || []).map((n: any) => ({ id: n.id, time: n.timestamp, text: n.content })));
      } catch (e) { console.warn('[BeeLearn] Notes fetch failed:', e); }
    };
    fetchNotes();
  }, [selectedModule?.id]);

  const handleAddNote = async () => {
    if (!newNote.trim() || !selectedModule) return;
    const time = videoRef.current ? formatTime(videoRef.current.currentTime) : '00:00';
    try {
      const res = await api.post(`/lessons/${selectedModule.id}/notes`, {
        timestamp: time,
        content: newNote.trim(),
      });
      setNotes(prev => [...prev, { id: res.id, time: res.timestamp, text: res.content }]);
      setNewNote('');
    } catch (e) { console.warn('[BeeLearn] Note save failed:', e); }
  };

  const handleDeleteNote = async (nid: number) => {
    setNotes(notes.filter(n => n.id !== nid));
    try { await api.delete(`/notes/${nid}`); } catch (e) { console.warn('[BeeLearn] Note delete failed:', e); }
  };

  // Discussion handlers removed to DiscussionForum.tsx


  const mainModules = modules.filter(m => !m.title?.toLowerCase().includes('tài liệu bổ trợ'));
  const progressPercentage = mainModules.length > 0
    ? Math.round((mainModules.filter(m => m.completed).length / mainModules.length) * 100) : 0;

  if (isLoading) return <div className="pt-32 text-center text-xl font-bold min-h-screen bg-surface">Đang tải khóa học...</div>;
  if (!course || !selectedModule) return <div className="pt-32 text-center text-xl font-bold min-h-screen bg-surface">Không tìm thấy khóa học</div>;

  const hasVideo = selectedModule.lesson_type === 'video' && (selectedModule.video_full_url || selectedModule.video_path || selectedModule.video_url);

  // getModuleIcon removed to LessonSidebar.tsx

  return (
    <div className="bg-surface text-on-surface min-h-[calc(100vh)] font-body w-full">
      {/* TopNavBar */}
      <header className="w-full sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm border-b border-outline-variant/20">
        <div className="flex justify-between items-center px-4 sm:px-8 py-3 w-full">
          <div className="flex items-center gap-6 lg:gap-8">
            <span onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <ellipse cx="24" cy="14" rx="6" ry="10" transform="rotate(30 24 14)" className="fill-navy/20" />
                  <ellipse cx="16" cy="14" rx="6" ry="10" transform="rotate(-30 16 14)" className="fill-navy/30" />
                  <path d="M8 24L2 24" strokeWidth="3" strokeLinecap="round" className="stroke-navy" />
                  <rect x="6" y="16" width="28" height="16" rx="8" className="fill-beered" />
                  <line x1="14" y1="16" x2="14" y2="32" strokeWidth="4" className="stroke-navy" />
                  <line x1="22" y1="16" x2="22" y2="32" strokeWidth="4" className="stroke-navy" />
                  <circle cx="28" cy="22" r="2.5" className="fill-navy" />
                  <circle cx="29" cy="21" r="1" className="fill-white" />
                  <path d="M26 16 Q 28 8 32 10" strokeWidth="2.5" fill="none" strokeLinecap="round" className="stroke-navy" />
                  <circle cx="32" cy="10" r="1.5" className="fill-navy" />
                </svg>
              </div>
              <span className="text-xl lg:text-2xl font-extrabold text-[#13375F] dark:text-blue-200 tracking-tight font-headline">Bee<span className="text-beered">Learn</span></span>
            </span>
            <nav className="hidden md:flex gap-6">
              <span className="font-headline font-semibold tracking-tight text-[#13375F] dark:text-white border-b-2 border-[#13375F] dark:border-white pb-1 cursor-pointer">Dashboard</span>
              <span onClick={() => navigate('/courses')} className="font-headline font-semibold tracking-tight text-slate-500 dark:text-slate-400 hover:text-[#13375F] dark:hover:text-white transition-colors cursor-pointer">Khóa học</span>
            </nav>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-secondary dark:text-slate-400 uppercase tracking-widest">Tiến độ</span>
              <span className="text-[#13375F] dark:text-white font-bold">{progressPercentage}% Hoàn thành</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row relative">
        {/* SideNavBar */}
        <LessonSidebar
          courseId={id as string}
          modules={modules}
          selectedModule={selectedModule}
          progressPercentage={progressPercentage}
          userEnrolled={userEnrolled}
          onSelectModule={(m) => {
            if (!userEnrolled && !m.is_free_preview) {
              alert('Vui lòng đăng ký khóa học để tham gia bài học này!');
              return;
            }
            setSelectedModule(m);
            setQuizResult(null);
            setQuizAnswers({});
          }}
          onMarkComplete={markModuleComplete}
        />

        {/* Main Content Area */}
        <main className="lg:ml-80 flex-1 p-4 sm:p-8 overflow-x-hidden min-h-screen relative">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mb-2 font-headline">{course.title}</h1>
                <p className="text-on-surface-variant font-medium flex items-center gap-2 text-sm sm:text-base">
                  <span className="text-tertiary-container font-bold">Lộ trình:</span> {course.category} • {course.level}
                </p>
              </div>
              <div className="flex gap-2 sm:gap-3 w-full md:w-auto">
                {(user?.role === 'admin' || user?.role === 'teacher') && selectedModule && (
                  <button
                    onClick={handleDeleteLesson}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-colors text-sm bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 hover:border-red-200"
                  >
                    <Trash2 className="w-5 h-5" /> Xóa bài giảng
                  </button>
                )}
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`flex-1 md:flex-none flex justify-center items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold transition-colors text-sm ${showNotes ? 'bg-[#13375F] text-white' : 'bg-surface-container-high text-primary hover:bg-surface-container-highest'}`}>
                  <FileText className="w-5 h-5" /> Ghi chú
                </button>
              </div>
            </div>

            {/* Dynamic Module Content */}
            <div className="flex flex-col xl:flex-row gap-6 mx-auto w-full transition-all">
              <div className={`relative flex-1 rounded-3xl shadow-xl ring-1 ring-white/10 overflow-hidden transition-all ${
                selectedModule.lesson_type === 'video' ? 'aspect-video group bg-slate-950 min-h-[400px]' :
                'bg-white p-6 sm:p-12 border border-slate-100 min-h-[400px] flex items-center justify-center'
              }`}>

                {/* ═══ VIDEO TYPE ═══ */}
                <VideoPlayerBlock 
                  ref={videoRef}
                  selectedModule={selectedModule}
                  hasVideo={!!hasVideo}
                  onEnded={() => markModuleComplete(selectedModule.id)}
                />

                {/* ═══ DOCUMENT TYPE ═══ */}
                {selectedModule.lesson_type === 'document' && (
                  <div className="text-center w-full animate-in zoom-in-95 duration-500">
                    <div className="w-24 h-24 bg-blue-50 shadow-inner border border-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                      <FileText size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-[#13375F] mb-4 font-headline">{selectedModule.title}</h2>
                    <p className="text-slate-500 mb-8 max-w-lg mx-auto leading-relaxed text-lg">
                      {selectedModule.content || selectedModule.description || 'Tài liệu hướng dẫn chi tiết phương pháp làm bài.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                      {selectedModule.materials_full_url && (
                        <a href={selectedModule.materials_full_url} target="_blank" rel="noopener noreferrer"
                          className="px-10 py-4 bg-[#13375F] text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all flex items-center gap-3">
                          <Download size={20} /> Tải Xuống Tài Liệu
                        </a>
                      )}
                      <button onClick={() => markModuleComplete(selectedModule.id)}
                        className="px-8 py-4 border-2 border-[#13375F] text-[#13375F] font-bold rounded-xl hover:bg-[#13375F] hover:text-white transition-all flex items-center gap-3">
                        <CheckCircle2 size={20} /> Đánh dấu hoàn thành
                      </button>
                    </div>
                  </div>
                )}

                {/* ═══ QUIZ TYPE ═══ */}
                {selectedModule.lesson_type === 'quiz' && (
                  <div className="w-full text-left flex-1 duration-500">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-primary mb-1 font-headline">{selectedModule.title}</h2>
                          <p className="text-slate-500 text-sm">
                            {selectedModule.questions_data?.length
                              ? `${selectedModule.questions_data.length} câu hỏi`
                              : 'Chưa có câu hỏi nào'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {(!selectedModule.questions_data || selectedModule.questions_data.length === 0) ? (
                      <div className="text-center py-12">
                        <HelpCircle className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg font-bold">Giáo viên chưa thêm câu hỏi cho bài quiz này</p>
                        <p className="text-slate-400 text-sm mt-2">Vui lòng quay lại sau.</p>
                      </div>
                    ) : (
                      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                        <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                          <CheckCircle2 size={36} />
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-3">Sẵn sàng kiểm tra?</h3>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                          Bài kiểm tra này sẽ giúp bạn hệ thống lại các kiến thức quan trọng. Kết quả sẽ được lưu lại để đánh giá tiến độ của bạn.
                        </p>
                        <Link 
                          to={`/quiz/${selectedModule.id}`}
                          className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold text-lg rounded-xl shadow-lg hover:brightness-110 transition-all hover:scale-105 active:scale-95"
                        >
                          <PlayCircle size={20} />
                          Bắt Đầu Làm Bài
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                <HomeworkUploader 
                  selectedModule={selectedModule} 
                  onComplete={markModuleComplete} 
                />
              </div>

              {/* Notes Side Panel */}
              {showNotes && (
                <div className="w-full xl:w-96 bg-white rounded-3xl shadow-xl border border-slate-100 p-6 flex flex-col h-[600px] xl:h-auto shrink-0">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-[#13375F] text-xl flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Ghi chú bài học
                    </h3>
                    <button onClick={() => setShowNotes(false)} className="text-slate-400 hover:text-[#E24843] p-1"><X className="w-5 h-5" /></button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
                    {notes.length === 0 ? (
                      <div className="text-center text-slate-500 text-sm mt-10">
                        <FileText size={24} className="text-slate-300 mx-auto mb-3" />
                        Chưa có ghi chú nào.
                      </div>
                    ) : (
                      notes.map(note => (
                        <div key={note.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 group relative">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#E24843] bg-red-50 px-2 py-1 rounded-md">{note.time}</span>
                            <button onClick={() => handleDeleteNote(note.id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-[#333] break-words">{note.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="pt-4 border-t border-slate-100 space-y-3 shrink-0">
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
                      placeholder="Nhập ghi chú..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#13375F]/20 resize-none h-24" />
                    <button onClick={handleAddNote} disabled={!newNote.trim()}
                      className="w-full bg-[#13375F] text-white font-bold py-3 text-sm rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs Section */}
            <div className="mt-8 max-w-5xl mx-auto w-full">
              <div className="flex gap-6 sm:gap-10 border-b border-surface-container-high pb-4 overflow-x-auto">
                {[
                  { key: 'content', label: 'Nội dung chung' },
                  { key: 'resources', label: 'Tài liệu bổ trợ' },
                  { key: 'discussion', label: 'Thảo luận & Hỏi đáp' },
                ].map(tab => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
                    className={`text-base sm:text-lg pb-3 transition-all ${activeTab === tab.key ? 'font-bold text-primary border-b-4 border-primary -mb-[18px]' : 'font-medium text-on-surface-variant hover:text-primary'}`}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="mt-8">
                {activeTab === 'content' && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="col-span-1 lg:col-span-8">
                      <article className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5">
                        <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6 font-headline">Mục tiêu chương học</h3>
                        <div className="text-on-surface leading-relaxed">
                          <p className="text-base sm:text-lg mb-6">{course.outcome || course.description || 'Chương học này giúp bạn nắm vững kiến thức trọng tâm.'}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-primary-container hover:-translate-y-1 transition-transform">
                              <CheckCircle2 className="text-primary-container mb-2 w-6 h-6" />
                              <h4 className="font-bold text-primary mb-1">Thực hành bám sát</h4>
                              <p className="text-sm text-on-surface-variant">Lý thuyết luôn đi kèm bài tập thực tế.</p>
                            </div>
                            <div className="p-6 bg-surface-container-low rounded-xl border-l-4 border-tertiary-container hover:-translate-y-1 transition-transform">
                              <Lightbulb className="text-tertiary-container mb-2 w-6 h-6" />
                              <h4 className="font-bold text-primary mb-1">Mẹo tối ưu thời gian</h4>
                              <p className="text-sm text-on-surface-variant">Chiến thuật nhận diện đáp án chuẩn xác.</p>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div className="col-span-1 lg:col-span-4">
                      <div className="bg-primary-container text-white p-6 rounded-2xl relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                          <GraduationCap className="w-40 h-40" />
                        </div>
                        <h4 className="text-xl font-bold mb-4 relative z-10 font-headline">Thông tin khóa học</h4>
                        <div className="space-y-3 relative z-10 text-sm">
                          <p><span className="opacity-70">Giáo viên:</span> <strong>{course.teacher?.name || 'N/A'}</strong></p>
                          <p><span className="opacity-70">Số bài học:</span> <strong>{modules.length} bài</strong></p>
                          <p><span className="opacity-70">Cấp độ:</span> <strong>{course.level}</strong></p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'resources' && (() => {
                  // Build array mapping every module to its logical chapter based on sort order
                  let currentChap = 'Chung';
                  const modulesWithChapter = modules.map(m => {
                    const isSupplemental = m.title?.toLowerCase().includes('tài liệu bổ trợ');
                    if (m.title?.includes(' - ') && !isSupplemental) {
                      currentChap = m.title.split(' - ')[0].trim();
                    }
                    return { ...m, inferredChapter: currentChap };
                  });

                  // Identify the logical chapter of the currently selected module
                  const activeModuleWithChap = modulesWithChapter.find(m => m.id === selectedModule.id);
                  const activeChapter = activeModuleWithChap?.inferredChapter || 'Chung';
                  
                  // Filter materials to ONLY those matching the active chapter
                  const chapterMaterials = modulesWithChapter.filter(
                    m => m.materials_full_url && m.inferredChapter === activeChapter
                  );
                  
                  // For UI display
                  const currentChapter = activeChapter !== 'Chung' ? activeChapter : null;

                  return (
                  <div className="p-8 bg-surface-container-highest rounded-2xl border border-dashed border-outline/30">
                    <h4 className="font-bold text-primary mb-6 flex items-center gap-2 font-headline text-xl">
                      <FolderArchive className="w-6 h-6 text-primary" /> Tài liệu {currentChapter || 'khóa học'}
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {chapterMaterials.map(m => {
                        const displayName = m.title?.includes(' - ') ? m.title.split(' - ').slice(1).join(' - ').trim() : m.title;
                        return (
                        <li key={m.id} className="flex items-center gap-4 bg-white p-4 rounded-xl group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-primary/20">
                          <div className="p-3 bg-red-50 text-error rounded-xl group-hover:bg-error group-hover:text-white transition-colors shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary truncate">{displayName}</p>
                            <p className="text-xs text-on-surface-variant mt-1">Tài liệu đính kèm</p>
                          </div>
                          <a href={m.materials_full_url!} target="_blank" rel="noopener noreferrer">
                            <Download className="text-slate-400 group-hover:text-primary transition-colors w-5 h-5 shrink-0 mr-2" />
                          </a>
                        </li>
                        );
                      })}
                      {chapterMaterials.length === 0 && (
                        <div className="col-span-2 text-center py-8 text-slate-400">
                          <FolderArchive className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <p>Chưa có tài liệu bổ trợ</p>
                        </div>
                      )}
                    </ul>
                  </div>
                  );
                })()}

                {activeTab === 'discussion' && (
                  <DiscussionForum courseId={id as string} lessonId={selectedModule.id} />
                )}
              </div>
            </div>
          </div>

          <footer className="mt-20 pt-8 border-t border-outline-variant/30 text-center max-w-5xl mx-auto">
            <p className="text-sm text-on-surface-variant font-medium">© 2024 BeeLearn Education • Tự hào nâng bước thế hệ trẻ Việt Nam</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
