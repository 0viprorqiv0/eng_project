import React, { useState, useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import {
  Video, FileText, HelpCircle, ClipboardList,
  Upload, ChevronDown, ChevronRight, Lightbulb,
  Rocket, X, Check, Loader2, Clock, Mic,
  Settings2, Shield, Download, RotateCcw,
  Trophy, CalendarClock, FileCheck, Eye,
  Plus, Trash2, GripVertical, PenLine,
  CheckCircle2, MessageSquare, Paperclip, Image
} from 'lucide-react';
import { QuizBuilderForm, type QuizQuestion } from './components/QuizBuilderForm';
import { MediaUploader } from './components/MediaUploader';

/* Quiz types imported from QuizBuilderForm */

/* ─── Lesson type config ─── */
const LESSON_TYPES = [
  { key: 'video', label: 'VIDEO', icon: Video },
  { key: 'document', label: 'TÀI LIỆU', icon: FileText },
  { key: 'quiz', label: 'QUIZ', icon: HelpCircle },
  { key: 'assignment', label: 'B.TẬP', icon: ClipboardList },
];

/* ─── File accept per type ─── */
const FILE_ACCEPT: Record<string, string> = {
  video: '.mp4,.webm,.mov,.avi',
  document: '.pdf,.doc,.docx,.ppt,.pptx',
  quiz: '.json,.csv,.xlsx',
  assignment: '.pdf,.doc,.docx,.zip',
};

const FILE_LABEL: Record<string, string> = {
  video: 'Kéo và thả video hoặc tài liệu tại đây',
  document: 'Kéo và thả tài liệu PDF/Word tại đây',
  quiz: 'Kéo và thả file đề quiz tại đây',
  assignment: 'Kéo và thả đề bài tập tại đây',
};

/* ─── Reusable Toggle Option ─── */
function ToggleOption({ icon, label, description, value, onChange }: {
  icon: React.ReactNode; label: string; description: string;
  value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#f4f3f7] rounded-xl">
      <div className="flex items-center gap-3">
        <div className="text-[#002143]">{icon}</div>
        <div>
          <p className="text-sm font-bold text-[#002143]">{label}</p>
          <p className="text-[10px] text-[#73777f] mt-0.5">{description}</p>
        </div>
      </div>
      <button type="button" onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full p-0.5 transition-all duration-300 ${value ? 'bg-[#002143]' : 'bg-[#d4d6db]'}`}>
        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${value ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}

export function CreateLecturePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  /* ─── State ─── */
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [isCourseOpen, setIsCourseOpen] = useState(false);
  const [lessonType, setLessonType] = useState(() => {
    return new URLSearchParams(window.location.search).get('type') || 'video';
  });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Access control
  const [isFreePreview, setIsFreePreview] = useState(false);
  const [unlockCondition, setUnlockCondition] = useState<'immediate' | 'after_previous' | 'min_score'>('immediate');
  const [minScore, setMinScore] = useState(70);

  // Advanced — shared
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(true);
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [allowDownload, setAllowDownload] = useState(true);

  // Advanced — quiz-specific
  const [quizTimeLimit, setQuizTimeLimit] = useState(30);
  const [quizRetries, setQuizRetries] = useState(2);
  const [quizPassScore, setQuizPassScore] = useState(60);

  // Advanced — assignment-specific
  const [deadlineDays, setDeadlineDays] = useState(7);
  const [allowLateSubmit, setAllowLateSubmit] = useState(false);

  // Lesson Position
  const [courseLessons, setCourseLessons] = useState<any[]>([]);
  const [insertAfterLessonId, setInsertAfterLessonId] = useState<string>('');

  // File upload
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedPath, setUploadedPath] = useState('');
  const [subtitleFile, setSubtitleFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const subtitleInputRef = useRef<HTMLInputElement>(null);

  // Quiz builder
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    { id: '1', type: 'multiple_choice', text: '', options: [
      { id: 'a', text: '', isCorrect: true },
      { id: 'b', text: '', isCorrect: false },
      { id: 'c', text: '', isCorrect: false },
    ], prompt: '' },
  ]);



  // UI
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch courses for the dropdown and get query params
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/my-courses');
        setCourses(res || []);
        // Pre-select from URL query param ?course=ID
        const params = new URLSearchParams(window.location.search);
        const preselect = params.get('course');
        
        if (preselect && res?.some((c: any) => c.id?.toString() === preselect)) {
          setSelectedCourse(preselect);
        } else if (res?.length > 0) {
          setSelectedCourse(res[0].id.toString());
        }
      } catch (e) {
        console.error('Failed to load courses:', e);
      }
    };
    fetchCourses();
  }, []);

  const selectedCourseName = courses.find(c => c.id?.toString() === selectedCourse)?.name || 'Chọn khóa học...';

  // Fetch lessons for selected course to allow position selection
  useEffect(() => {
    if (!selectedCourse) {
      setCourseLessons([]);
      setInsertAfterLessonId('');
      return;
    }
    const fetchLessons = async () => {
      try {
        const res = await api.get(`/courses/${selectedCourse}/lessons`);
        // Backend returns { course: {...}, lessons: [...] }
        setCourseLessons(res?.lessons || res?.data || []);
        setInsertAfterLessonId(''); // Reset when course changes
      } catch (e) {
        console.error('Failed to load lessons for position selection', e);
      }
    };
    fetchLessons();
  }, [selectedCourse]);

  /* ─── Upload file to server ─── */
  const uploadFile = async (fileToUpload: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', fileToUpload);
      formData.append('type', lessonType === 'video' ? 'video' : 'material');
      formData.append('course_id', selectedCourse);
      const token = localStorage.getItem('token');

      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      });
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const result = JSON.parse(xhr.responseText);
          resolve(result.file_path || '');
        } else {
          reject(new Error('Upload thất bại'));
        }
      };
      xhr.onerror = () => reject(new Error('Lỗi kết nối'));
      xhr.open('POST', `${BASE_URL}/api/upload/lesson-media`);
      if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send(formData);
    });
  };

  /* ─── Submit ─── */
  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    if (!selectedCourse) errs.course = 'Vui lòng chọn khóa học';
    if (!title.trim()) errs.title = 'Vui lòng nhập tiêu đề bài giảng';
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      // Upload main file if selected
      let filePath = uploadedPath;
      if (file && !uploadedPath) {
        filePath = await uploadFile(file);
        setUploadedPath(filePath);
      }

      // Upload subtitle if selected
      let subtitlePath = '';
      if (subtitleFile) {
        subtitlePath = await uploadFile(subtitleFile);
      }

      let sortOrder;
      if (insertAfterLessonId) {
        const targetLesson = courseLessons.find(l => l.id?.toString() === insertAfterLessonId);
        if (targetLesson) {
          sortOrder = targetLesson.sort_order + 1; // Insert right after
        }
      }

      const payload: any = {
        title,
        lesson_type: lessonType,
        description,
        duration_minutes: durationMinutes,
        is_free_preview: isFreePreview,
        unlock_condition: unlockCondition,
        unlock_days: 0,
        sort_order: sortOrder,
      };

      // Assign file path based on lesson type
      if (lessonType === 'video') {
        payload.video_path = filePath;
        payload.video_type = 'upload';
      } else {
        payload.materials_path = filePath;
      }

      if (subtitlePath) {
        payload.subtitle_path = subtitlePath;
      }

      // Include quiz questions if quiz type
      if (lessonType === 'quiz' && questions.length > 0) {
        payload.questions_data = questions;
      }
      
      // Pass assignment fields to auto-create linked assignment
      if (lessonType === 'assignment') {
        payload.assignment_title = title;
        payload.assignment_max_score = 100;
        
        // Calculate due date (today + deadlineDays)
        const due = new Date();
        due.setDate(due.getDate() + (deadlineDays || 7));
        payload.assignment_due_date = due.toISOString().split('T')[0];
      }

      await api.post(`/courses/${selectedCourse}/lessons`, payload);
      setSubmitSuccess(true);
      setTimeout(() => navigate('/dashboard/courses'), 2000);
    } catch (err: any) {
      console.error(err);
      setErrors({ general: err?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 relative max-w-[1200px] mx-auto">
      {/* ═══ SUCCESS OVERLAY ═══ */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div initial={{ scale: 0.85, y: 30 }} animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md mx-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-[#002143] mb-2">Tải lên thành công! 🎉</h3>
              <p className="text-[#43474e] text-sm">Bài giảng đã được thêm vào khóa học.</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ BREADCRUMB + TITLE ═══ */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#73777f] uppercase tracking-wider mb-2">
          <button onClick={() => navigate('/dashboard/courses')} className="hover:text-[#002143] transition-colors">LECTURES</button>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#002143]">CREATE NEW</span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-headline text-3xl md:text-4xl font-extrabold text-[#002143] tracking-tight"
        >
          Tạo Bài Giảng Mới
        </motion.h2>
        <p className="text-[#43474e] mt-1.5 text-sm leading-relaxed">
          Xây dựng trải nghiệm học tập đỉnh cao cho học sinh lớp 12 với các công cụ soạn thảo thông minh.
        </p>
      </div>

      {/* ═══ ERROR BANNER ═══ */}
      {errors.general && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-sm font-medium">
          <span className="material-symbols-outlined text-red-500">error</span>
          {errors.general}
        </motion.div>
      )}

      {/* ═══ MAIN GRID ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ────── LEFT COLUMN (3/5) ────── */}
        <div className="lg:col-span-3 space-y-8">

          {/* Card: Thông tin cơ bản */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-7 shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-7">
              <div className="w-10 h-10 bg-[#f4f3f7] rounded-xl flex items-center justify-center">
                <Settings2 className="w-5 h-5 text-[#002143]" />
              </div>
              <h3 className="font-headline text-lg font-extrabold text-[#002143]">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-6">
              {/* Row: Course + Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Course selector */}
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">Chọn khóa học</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCourseOpen(!isCourseOpen)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 bg-[#f4f3f7] rounded-xl text-sm font-medium text-[#002143] hover:bg-[#eeedf1] transition-all border ${errors.course ? 'border-red-400' : 'border-transparent'}`}
                    >
                      <span className="truncate">{selectedCourseName}</span>
                      <ChevronDown className={`w-4 h-4 text-[#73777f] transition-transform ${isCourseOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isCourseOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-black/5 z-30 overflow-hidden max-h-52 overflow-y-auto"
                        >
                          {courses.map(c => (
                            <button
                              key={c.id}
                              onClick={() => { setSelectedCourse(c.id.toString()); setIsCourseOpen(false); }}
                              className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-[#f4f3f7] transition-colors ${
                                selectedCourse === c.id?.toString() ? 'bg-[#cee5ff] text-[#002143] font-bold' : 'text-[#43474e]'
                              }`}
                            >
                              {c.name}
                            </button>
                          ))}
                          {courses.length === 0 && (
                            <div className="px-4 py-5 text-center text-sm text-[#73777f]">Chưa có khóa học nào</div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  {errors.course && <p className="text-red-500 text-xs mt-1 font-medium">{errors.course}</p>}
                </div>

                {/* Lesson type selector */}
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">Loại bài học</label>
                  <div className="flex gap-1.5">
                    {LESSON_TYPES.map(t => {
                      const Icon = t.icon;
                      const isActive = lessonType === t.key;
                      return (
                        <button
                          key={t.key}
                          type="button"
                          onClick={() => { setLessonType(t.key); setFile(null); setUploadedPath(''); }}
                          className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all duration-200 ${
                            isActive
                              ? 'bg-[#002143] text-white shadow-lg shadow-[#002143]/20'
                              : 'bg-[#f4f3f7] text-[#73777f] hover:bg-[#eeedf1] hover:text-[#002143]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">Tiêu đề bài giảng</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ví dụ: Phân tích chiến thuật làm bài Reading - Matching Headings"
                  className={`w-full px-4 py-3.5 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all border ${
                    errors.title ? 'border-red-400 focus:ring-red-200' : 'border-transparent focus:ring-[#002143]/15'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors.title}</p>}
              </div>

              {/* Position selector */}
              {courseLessons.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">Vị trí bài học</label>
                  <div className="relative">
                    <select
                      value={insertAfterLessonId}
                      onChange={(e) => setInsertAfterLessonId(e.target.value)}
                      className="w-full px-4 py-3.5 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all border border-transparent appearance-none"
                    >
                      <option value="">Thêm vào cuối khóa học</option>
                      {courseLessons.map((l: any) => (
                        <option key={l.id} value={l.id?.toString()}>
                          Chèn vào sau: {l.title}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#73777f] pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-[#73777f] mt-1.5 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3 text-amber-500" />
                    Mẹo: Mọi nội dung phía dưới sẽ tự động được đẩy lùi 1 vị trí
                  </p>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">Mô tả chi tiết</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Nhập mục tiêu bài học, kiến thức trọng tâm..."
                  rows={3}
                  className="w-full px-4 py-3.5 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none border border-transparent"
                />
              </div>
            </div>
          </motion.div>

          {/* ═══ SPECIALIZED CONTENT SECTIONS ═══ */}
          <AnimatePresence mode="wait">
            {/* ── VIDEO / DOCUMENT UPLOAD ── */}
            {(lessonType === 'video' || lessonType === 'document') && (
              <MediaUploader
                lessonType={lessonType}
                file={file}
                onFileChange={setFile}
                uploadProgress={uploadProgress}
                uploadedPath={uploadedPath}
                onClearUpload={() => { setUploadedPath(''); setUploadProgress(0); }}
              />
            )}

            {/* ── QUIZ BUILDER ── */}
            {lessonType === 'quiz' && (
              <QuizBuilderForm questions={questions} onChange={setQuestions} />
            )}

            {/* ── ASSIGNMENT BUILDER ── */}
            {lessonType === 'assignment' && (
              <motion.div key="assignment" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl p-7 shadow-sm border border-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#002143] rounded-xl flex items-center justify-center">
                    <ClipboardList className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-headline text-lg font-extrabold text-[#002143]">Nội dung bài tập</h3>
                </div>

                {/* Assignment prompt */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">ĐỀ BÀI / YÊU CẦU</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Mô tả yêu cầu bài tập chi tiết cho học sinh..."
                    rows={5}
                    className="w-full px-4 py-3.5 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none border border-transparent" />
                </div>

                {/* Attachment upload */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider">TÀI LIỆU ĐÍNH KÈM</label>
                  {file ? (
                    <div className="flex items-center gap-3 p-4 bg-[#f4f3f7] rounded-xl">
                      <FileText className="w-5 h-5 text-[#002143] shrink-0" />
                      <span className="text-sm font-bold text-[#002143] truncate flex-1">{file.name}</span>
                      <span className="text-xs text-[#73777f]">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button onClick={() => { setFile(null); setUploadedPath(''); }} className="p-1 text-[#73777f] hover:text-red-500"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-3 p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all border-[#d4d6db] hover:border-[#002143]/30">
                      <Paperclip className="w-5 h-5 text-[#73777f] shrink-0" />
                      <span className="text-sm text-[#73777f]">Đính kèm đề bài, rubric hoặc tài liệu tham khảo</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.zip,.xlsx" className="hidden"
                    onChange={e => e.target.files?.[0] && setFile(e.target.files[0])} />
                </div>

                {/* Rubric hints */}
                <div className="bg-[#f4f3f7] rounded-xl p-4">
                  <p className="text-[10px] font-bold text-[#73777f] uppercase tracking-wider mb-2">GỢI Ý THANG ĐIỂM</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[{ label: 'Nội dung', pts: '40đ' }, { label: 'Trình bày', pts: '30đ' }, { label: 'Sáng tạo', pts: '30đ' }].map(r => (
                      <div key={r.label} className="bg-white rounded-lg p-3 text-center">
                        <p className="font-bold text-[#002143]">{r.pts}</p>
                        <p className="text-[#73777f] mt-0.5">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ────── RIGHT COLUMN (2/5) ────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Card: Kiểm soát truy cập */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#f4f3f7] rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#002143]" />
              </div>
              <h3 className="font-headline text-base font-extrabold text-[#002143]">Kiểm soát truy cập</h3>
            </div>

            {/* Free preview toggle */}
            <div className="flex items-center justify-between mb-6 p-4 bg-[#f4f3f7] rounded-xl">
              <div>
                <p className="text-sm font-bold text-[#002143]">Miễn phí học thử</p>
                <p className="text-[10px] text-[#73777f] mt-0.5">Mọi học sinh đều có thể xem</p>
              </div>
              <button
                type="button"
                onClick={() => setIsFreePreview(!isFreePreview)}
                className={`w-12 h-7 rounded-full p-0.5 transition-all duration-300 ${isFreePreview ? 'bg-[#002143]' : 'bg-[#d4d6db]'}`}
              >
                <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isFreePreview ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            {/* Unlock condition */}
            <div>
              <label className="block text-xs font-bold text-[#43474e] mb-3 uppercase tracking-wider">Điều kiện mở khóa</label>
              <div className="space-y-2">
                {/* Option 1: Free / No lock */}
                <label onClick={() => setUnlockCondition('immediate')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#f4f3f7] group">
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                    unlockCondition === 'immediate' ? 'border-[#002143] bg-[#002143]' : 'border-[#c8cad0] group-hover:border-[#73777f]'
                  }`}>
                    {unlockCondition === 'immediate' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#002143]">Không khóa</span>
                    <p className="text-[10px] text-[#73777f] mt-0.5">Học viên truy cập tự do, không cần điều kiện</p>
                  </div>
                </label>

                {/* Option 2: Sequential */}
                <label onClick={() => setUnlockCondition('after_previous')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#f4f3f7] group">
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                    unlockCondition === 'after_previous' ? 'border-[#002143] bg-[#002143]' : 'border-[#c8cad0] group-hover:border-[#73777f]'
                  }`}>
                    {unlockCondition === 'after_previous' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#002143]">Hoàn thành bài trước</span>
                    <p className="text-[10px] text-[#73777f] mt-0.5">Phải hoàn thành bài học trước đó mới mở khóa</p>
                  </div>
                </label>

                {/* Option 3: Min score on previous */}
                <label onClick={() => setUnlockCondition('min_score')} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#f4f3f7] group">
                  <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center transition-all ${
                    unlockCondition === 'min_score' ? 'border-[#002143] bg-[#002143]' : 'border-[#c8cad0] group-hover:border-[#73777f]'
                  }`}>
                    {unlockCondition === 'min_score' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[#002143]">Đạt điểm tối thiểu</span>
                    <p className="text-[10px] text-[#73777f] mt-0.5">Yêu cầu đạt điểm bài trước mới được học tiếp</p>
                  </div>
                </label>

                {/* Min score input — chỉ hiện khi chọn min_score */}
                <AnimatePresence>
                  {unlockCondition === 'min_score' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-9 mt-1 flex items-center gap-3 p-3 bg-[#f4f3f7] rounded-xl">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="text-xs font-medium text-[#43474e] whitespace-nowrap">Điểm tối thiểu:</span>
                        <input
                          type="number" min={0} max={100} value={minScore}
                          onChange={e => setMinScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                          className="w-16 px-2 py-1.5 bg-white rounded-lg text-sm text-center font-bold text-[#002143] border border-[#d4d6db] focus:outline-none focus:ring-1 focus:ring-[#002143]"
                        />
                        <span className="text-xs font-bold text-[#002143]">/100</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Card: Tùy chọn nâng cao — DYNAMIC BY LESSON TYPE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full flex items-center justify-between p-6 hover:bg-[#f4f3f7]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f4f3f7] rounded-xl flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-[#002143]" />
                </div>
                <h3 className="font-headline text-base font-extrabold text-[#002143]">Tùy chọn nâng cao</h3>
              </div>
              <ChevronDown className={`w-5 h-5 text-[#73777f] transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isAdvancedOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 space-y-5">

                    {/* ─ SHARED: Duration (all types) ─ */}
                    <div>
                      <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5" />
                        {lessonType === 'quiz' ? 'Thời gian làm bài (phút)' : lessonType === 'assignment' ? 'Thời lượng ước tính (phút)' : 'Thời lượng (phút)'}
                      </label>
                      <input
                        type="number" min={1}
                        value={lessonType === 'quiz' ? quizTimeLimit : durationMinutes}
                        onChange={e => {
                          const v = parseInt(e.target.value) || 0;
                          lessonType === 'quiz' ? setQuizTimeLimit(v) : setDurationMinutes(v);
                        }}
                        className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all border border-transparent"
                      />
                    </div>

                    {/* ─ VIDEO: Subtitle + Allow download ─ */}
                    {lessonType === 'video' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Mic className="w-3.5 h-3.5" /> Phụ đề (SRT/VTT)
                          </label>
                          <div className="flex gap-2">
                            <div
                              onClick={() => subtitleInputRef.current?.click()}
                              className="flex-1 px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#73777f] font-medium cursor-pointer hover:bg-[#eeedf1] transition-all flex items-center gap-2 border border-transparent"
                            >
                              {subtitleFile ? (
                                <span className="text-[#002143] font-bold truncate">{subtitleFile.name}</span>
                              ) : (
                                <span>Chưa chọn tệp...</span>
                              )}
                            </div>
                            <button type="button" onClick={() => subtitleInputRef.current?.click()}
                              className="w-11 h-11 bg-[#f4f3f7] rounded-xl flex items-center justify-center text-[#73777f] hover:bg-[#eeedf1] hover:text-[#002143] transition-all">
                              <Mic className="w-5 h-5" />
                            </button>
                            <input ref={subtitleInputRef} type="file" accept=".srt,.vtt" className="hidden"
                              onChange={e => e.target.files?.[0] && setSubtitleFile(e.target.files[0])} />
                          </div>
                        </div>
                        <ToggleOption
                          icon={<Download className="w-4 h-4" />}
                          label="Cho phép tải xuống"
                          description="Học viên có thể tải video về máy"
                          value={allowDownload} onChange={setAllowDownload}
                        />
                      </>
                    )}

                    {/* ─ DOCUMENT: Allow download ─ */}
                    {lessonType === 'document' && (
                      <ToggleOption
                        icon={<Download className="w-4 h-4" />}
                        label="Cho phép tải xuống"
                        description="Học viên có thể tải tài liệu về máy"
                        value={allowDownload} onChange={setAllowDownload}
                      />
                    )}

                    {/* ─ QUIZ: Retries + Pass score ─ */}
                    {lessonType === 'quiz' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5" /> Số lần làm lại tối đa
                          </label>
                          <input
                            type="number" min={0} max={10} value={quizRetries}
                            onChange={e => setQuizRetries(parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all border border-transparent"
                          />
                          <p className="text-[10px] text-[#73777f] mt-1.5">Đặt 0 = không giới hạn số lần làm</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5" /> Điểm đạt tối thiểu (/100)
                          </label>
                          <input
                            type="number" min={0} max={100} value={quizPassScore}
                            onChange={e => setQuizPassScore(Math.min(100, parseInt(e.target.value) || 0))}
                            className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all border border-transparent"
                          />
                        </div>
                      </>
                    )}

                    {/* ─ ASSIGNMENT: Deadline + Late submit ─ */}
                    {lessonType === 'assignment' && (
                      <>
                        <div>
                          <label className="block text-xs font-bold text-[#43474e] mb-2 uppercase tracking-wider flex items-center gap-2">
                            <CalendarClock className="w-3.5 h-3.5" /> Hạn nộp bài (ngày)
                          </label>
                          <input
                            type="number" min={1} value={deadlineDays}
                            onChange={e => setDeadlineDays(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all border border-transparent"
                          />
                          <p className="text-[10px] text-[#73777f] mt-1.5">Tính từ ngày mở khóa bài học</p>
                        </div>
                        <ToggleOption
                          icon={<FileCheck className="w-4 h-4" />}
                          label="Cho phép nộp muộn"
                          description="Chấp nhận bài nộp sau hạn (có thể trừ điểm)"
                          value={allowLateSubmit} onChange={setAllowLateSubmit}
                        />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="space-y-3"
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#002143] to-[#1e3a5f] text-white font-bold text-base rounded-2xl hover:from-[#1e3a5f] hover:to-[#2a4f7a] disabled:opacity-60 transition-all active:scale-[0.98] shadow-xl shadow-[#002143]/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Đang tải lên...</>
              ) : (
                <><Rocket className="w-5 h-5" /> Tải lên bài giảng</>
              )}
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full py-3 text-[#73777f] text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
          </motion.div>

          {/* Tips card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-black/5"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-[#e65540] rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-[#e65540]/20">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-headline text-sm font-extrabold text-[#002143] mb-1.5">Mẹo hay cho giảng viên</h4>
                <p className="text-xs text-[#43474e] leading-relaxed">
                  Video từ 15-20 phút giúp học sinh lớp 12 duy trì sự tập trung cao nhất. Đừng quên đính kèm Quiz để củng cố kiến thức!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
