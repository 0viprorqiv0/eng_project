import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Bell, Settings, BookOpen, PlayCircle, Headphones, FileSignature, Lock,
  CheckCircle2, FileText, HelpCircle, Moon, ArrowRight, Plus, Search,
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize, Monitor, Lightbulb,
  FolderArchive, Download, Table2, GraduationCap, Upload, MessageSquare, User, Clock, Send, X
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../components/AuthContext';

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

  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');

  // Video state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizResult, setQuizResult] = useState<number | null>(null);

  // Homework/Assignment state
  const [homeworkContent, setHomeworkContent] = useState('');
  const [homeworkFile, setHomeworkFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Notes
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState<{id: number; time: string; text: string}[]>([]);
  const [newNote, setNewNote] = useState('');

  // Discussion
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');

  // Search & filter
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonTypeFilter, setLessonTypeFilter] = useState<string>('all');

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

  // Mark lesson as complete (persisted to API)
  const markModuleComplete = async (moduleId: number) => {
    setModules(prev => prev.map(m => m.id === moduleId ? { ...m, completed: true } : m));
    try { await api.post(`/lessons/${moduleId}/complete`, {}); } catch (e) { console.warn('[BeeLearn] Progress save failed:', e); }
  };

  // Video controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };
  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    if (videoRef.current) { videoRef.current.currentTime = t; setCurrentTime(t); }
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

  // Homework/Assignment submit via real API
  const handleHomeworkSubmit = async () => {
    if (!selectedModule || (!homeworkContent.trim() && !homeworkFile)) return;
    if (!selectedModule.assignment_id) {
      alert('Bài học này chưa có bài tập được gán. Vui lòng liên hệ giáo viên.');
      return;
    }
    setIsSubmitting(true);
    try {
      // Upload file if present — uses shared uploadFile helper, no hardcoded URL
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
      markModuleComplete(selectedModule.id);
      setTimeout(() => setSubmitSuccess(false), 3000);
      setHomeworkContent('');
      setHomeworkFile(null);
    } catch (err: any) {
      alert(err?.message || 'Nộp bài thất bại. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Discussion — API-backed
  useEffect(() => {
    if (!id || !selectedModule || selectedModule.id === 0) return;
    const fetchDiscussions = async () => {
      try {
        const res = await api.get(`/courses/${id}/discussions?lesson_id=${selectedModule.id}`);
        const items = res?.data || res || [];
        setForumPosts(items.map((d: any) => ({
          id: d.id.toString(),
          author: d.author,
          content: d.content,
          date: d.date,
          replies: d.replies_count || 0,
        })));
      } catch (e) { console.warn('[BeeLearn] Discussions fetch failed:', e); }
    };
    fetchDiscussions();
  }, [id, selectedModule?.id]);

  const handleAddPost = async () => {
    if (!newPost.trim() || !id || !selectedModule) return;
    try {
      const res = await api.post(`/courses/${id}/discussions`, {
        lesson_id: selectedModule.id,
        content: newPost.trim(),
      });
      setForumPosts(prev => [{
        id: res.id.toString(),
        author: res.author,
        content: res.content,
        date: res.date,
        replies: 0,
      }, ...prev]);
      setNewPost('');
    } catch (e) { console.warn('[BeeLearn] Discussion post failed:', e); }
  };

  const progressPercentage = modules.length > 0
    ? Math.round((modules.filter(m => m.completed).length / modules.length) * 100) : 0;

  if (isLoading) return <div className="pt-32 text-center text-xl font-bold min-h-screen bg-surface">Đang tải khóa học...</div>;
  if (!course || !selectedModule) return <div className="pt-32 text-center text-xl font-bold min-h-screen bg-surface">Không tìm thấy khóa học</div>;

  const hasVideo = selectedModule.lesson_type === 'video' && (selectedModule.video_full_url || selectedModule.video_path || selectedModule.video_url);

  const getModuleIcon = (type: LessonType) => {
    switch (type) {
      case 'video': return PlayCircle;
      case 'document': return FileText;
      case 'quiz': return CheckCircle2;
      case 'assignment': return Upload;
      default: return PlayCircle;
    }
  };

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
              <span className="font-headline font-semibold tracking-tight text-[#13375F] border-b-2 border-[#13375F] pb-1 cursor-pointer">Dashboard</span>
              <span onClick={() => navigate('/courses')} className="font-headline font-semibold tracking-tight text-slate-500 hover:text-[#13375F] transition-colors cursor-pointer">Khóa học</span>
            </nav>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest">Tiến độ</span>
              <span className="text-[#13375F] font-bold">{progressPercentage}% Hoàn thành</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row relative">
        {/* SideNavBar */}
        <aside className="w-full lg:w-80 lg:bottom-0 left-0 lg:top-[60px] bg-slate-50 dark:bg-slate-900 flex flex-col gap-2 px-4 py-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 lg:h-[calc(100vh-60px)] lg:fixed overflow-y-auto shrink-0 z-40">
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary-container rounded-xl flex items-center justify-center">
                <BookOpen className="text-white w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#13375F] font-headline">Lộ trình học</h2>
                <p className="text-xs text-slate-500 font-medium italic">{modules.filter(m => m.completed).length}/{modules.length} bài đã xong</p>
              </div>
            </div>
            <div className="w-full bg-surface-container-highest h-1.5 rounded-full mt-4 overflow-hidden">
              <div className="bg-tertiary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>

          <div className="space-y-1 z-10 flex-grow">
            <div className="px-2 py-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-[0.15em]">Nội dung khóa học</div>
            {/* Search input */}
            <div className="px-2 mb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={lessonSearch}
                  onChange={e => setLessonSearch(e.target.value)}
                  placeholder="Tìm bài học..."
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#13375F]/30 transition-all"
                />
              </div>
            </div>
            {/* Type filter */}
            <div className="flex gap-1 px-2 mb-3">
              {[{key:'all',label:'Tất cả'},{key:'video',label:'Video'},{key:'quiz',label:'Quiz'},{key:'document',label:'Tài liệu'},{key:'assignment',label:'Bài tập'}].map(f => (
                <button key={f.key} onClick={() => setLessonTypeFilter(f.key)}
                  className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${lessonTypeFilter === f.key ? 'bg-[#13375F] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300'}`}>
                  {f.label}
                </button>
              ))}
            </div>
            {modules.filter(m => {
              const matchSearch = !lessonSearch || m.title.toLowerCase().includes(lessonSearch.toLowerCase());
              const matchType = lessonTypeFilter === 'all' || m.lesson_type === lessonTypeFilter;
              return matchSearch && matchType;
            }).map((m) => {
              const Icon = getModuleIcon(m.lesson_type);
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedModule(m);
                    setQuizResult(null);
                    setQuizAnswers({});
                    setIsPlaying(false);
                    setSubmitSuccess(false);
                    setHomeworkContent('');
                    setHomeworkFile(null);
                  }}
                  className={`flex items-center gap-3 font-body rounded-xl p-3 cursor-pointer group transition-all ${selectedModule?.id === m.id ? 'bg-white dark:bg-slate-800 text-[#13375F] dark:text-blue-300 shadow-sm border-l-4 border-[#13375F]' : 'text-slate-600 dark:text-slate-400 hover:translate-x-1 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Icon className={`${selectedModule?.id === m.id ? 'text-[#13375F]' : 'group-hover:text-[#13375F]'} w-5 h-5 shrink-0 transition-colors`} />
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm line-clamp-1 ${selectedModule?.id === m.id ? 'font-bold' : ''}`} title={m.title}>{m.title}</span>
                    <p className="text-[10px] text-slate-400">{m.lesson_type === 'video' ? 'Video' : m.lesson_type === 'document' ? 'Tài liệu' : m.lesson_type === 'quiz' ? 'Quiz' : 'Bài tập'} • {m.duration_minutes}p</p>
                  </div>
                  {m.completed ? (
                    <CheckCircle2 className="text-emerald-600 ml-auto w-4 h-4 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 ml-auto shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Teacher/Admin: Add Lecture Button */}
          {(user?.role === 'teacher' || user?.role === 'admin') && (
            <div className="px-2 mt-4">
              <button
                onClick={() => navigate(`/dashboard/lectures/create?course=${id}`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#E24843] to-[#e65540] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Thêm bài giảng
              </button>
            </div>
          )}

          <div className="mt-8 lg:mt-auto pt-6 border-t border-slate-200 z-10 shrink-0">
            <button onClick={() => navigate(-1)} className="w-full bg-[#13375F] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4">
              <ArrowRight className="w-4 h-4 rotate-180" /> Quay lại
            </button>
          </div>
        </aside>

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
                {selectedModule.lesson_type === 'video' && (
                  hasVideo ? (
                    <video
                      ref={videoRef}
                      controls
                      controlsList="nodownload"
                      src={selectedModule.video_full_url || ''}
                      className="w-full h-full object-contain rounded-2xl"
                      onEnded={() => markModuleComplete(selectedModule.id)}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#13375f] to-[#0a1628]">
                      <div className="text-center">
                        <PlayCircle className="w-16 h-16 text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 text-sm">Video đang được cập nhật</p>
                      </div>
                    </div>
                  )
                )}

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

                {/* ═══ ASSIGNMENT TYPE ═══ */}
                {selectedModule.lesson_type === 'assignment' && (
                  <div className="w-full text-center py-6">
                    <div className="w-20 h-20 bg-amber-50 shadow-inner rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-600 border border-amber-100">
                      <FileSignature size={36} />
                    </div>
                    <h2 className="text-3xl font-black text-primary mb-4 font-headline">{selectedModule.title}</h2>

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
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 max-w-xl mx-auto">
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
                            className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13375F] outline-none transition-all resize-none text-sm mb-4"
                          />
                          <label className="block text-sm font-bold text-[#002143] mb-2">Hoặc tải lên tệp bài làm (nếu có)</label>
                          <div className="relative">
                            <input
                              type="file"
                              onChange={e => setHomeworkFile(e.target.files?.[0] || null)}
                              className="hidden"
                              id="homework-file-upload"
                            />
                            <label htmlFor="homework-file-upload" className="w-full p-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 hover:border-[#13375F] transition-all text-slate-500 font-medium text-sm">
                              <Upload size={20} /> 
                              {homeworkFile ? <span className="text-[#13375F] font-bold">{homeworkFile.name}</span> : 'Chọn tệp...'}
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={handleHomeworkSubmit}
                          disabled={(!homeworkContent.trim() && !homeworkFile) || isSubmitting}
                          className="w-full py-4 bg-[#13375F] text-white font-bold text-lg rounded-xl shadow-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
                )}
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

                {activeTab === 'resources' && (
                  <div className="p-8 bg-surface-container-highest rounded-2xl border border-dashed border-outline/30">
                    <h4 className="font-bold text-primary mb-6 flex items-center gap-2 font-headline text-xl">
                      <FolderArchive className="w-6 h-6 text-primary" /> Tài liệu khóa học
                    </h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {modules.filter(m => m.materials_full_url).map(m => (
                        <li key={m.id} className="flex items-center gap-4 bg-white p-4 rounded-xl group cursor-pointer hover:shadow-md transition-all border border-transparent hover:border-primary/20">
                          <div className="p-3 bg-red-50 text-error rounded-xl group-hover:bg-error group-hover:text-white transition-colors shrink-0">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-primary truncate">{m.title}</p>
                            <p className="text-xs text-on-surface-variant mt-1">Tài liệu đính kèm</p>
                          </div>
                          <a href={m.materials_full_url!} target="_blank" rel="noopener noreferrer">
                            <Download className="text-slate-400 group-hover:text-primary transition-colors w-5 h-5 shrink-0 mr-2" />
                          </a>
                        </li>
                      ))}
                      {modules.filter(m => m.materials_full_url).length === 0 && (
                        <div className="col-span-2 text-center py-8 text-slate-400">
                          <FolderArchive className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <p>Chưa có tài liệu bổ trợ</p>
                        </div>
                      )}
                    </ul>
                  </div>
                )}

                {activeTab === 'discussion' && (
                  <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5">
                    <h3 className="text-xl sm:text-2xl font-bold text-primary mb-6 font-headline">Hỏi đáp & Thảo luận</h3>
                    <div className="mb-8 p-6 bg-surface-container-low rounded-2xl border border-outline-variant/30">
                      <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
                        placeholder="Bạn có câu hỏi gì cho bài học này?"
                        className="w-full p-4 bg-white border border-outline/20 rounded-xl focus:ring-2 focus:ring-[#13375F] outline-none transition-all resize-none h-32 text-on-surface text-base" />
                      <button onClick={handleAddPost}
                        className="mt-4 float-right bg-[#E24843] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:brightness-110 shadow-lg transition-all">
                        <Send size={18} /> Gửi câu hỏi
                      </button>
                      <div className="clear-both" />
                    </div>
                    <div className="space-y-4">
                      {forumPosts.length === 0 && (
                        <div className="text-center py-8 text-slate-400">
                          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                          <p>Chưa có câu hỏi nào. Hãy là người đầu tiên!</p>
                        </div>
                      )}
                      {forumPosts.map(post => (
                        <div key={post.id} className="p-6 rounded-2xl border border-outline-variant/20 hover:border-primary/30 transition-all bg-white hover:shadow-md">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#13375F]/10 flex items-center justify-center text-[#13375F] border border-[#13375F]/20">
                              <User size={24} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-bold text-lg text-[#13375F] font-headline">{post.author}</h4>
                                <span className="text-sm text-slate-400 flex items-center gap-1 font-medium"><Clock size={14} /> {post.date}</span>
                              </div>
                              <p className="text-on-surface-variant text-base font-medium leading-relaxed p-4 bg-slate-50 rounded-xl">{post.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
