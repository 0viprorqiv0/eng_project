import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';
import { FileUpload } from '../../components/FileUpload';
import {
  Plus, Trash2, Upload, CheckCircle2,
  Rocket, Save, RotateCcw, ChevronDown,
  Video, FileText, FileSpreadsheet,
  GraduationCap, Pen, User, X, Paperclip
} from 'lucide-react';

const CATEGORIES = ['Tiếng Anh', 'Toán', 'Vật Lý', 'Hóa Học', 'Sinh Học', 'Lịch Sử', 'Địa Lý', 'Tin Học', 'IELTS', 'TOEIC'];
const LEVELS = [
  { key: 'basic', label: 'Cơ bản', icon: '📗' },
  { key: 'advanced', label: 'Nâng cao', icon: '📘' },
  { key: 'exam', label: 'Luyện thi', icon: '📕' },
];

const MATERIAL_TYPES = [
  { key: 'ebook', label: 'Ebook lý thuyết', desc: 'PDF, 120 trang', icon: FileText },
  { key: 'quiz', label: 'Bộ đề trắc nghiệm', desc: 'File Word/Excel', icon: FileSpreadsheet },
  { key: 'video', label: 'Video bài giảng mẫu', desc: 'MP4 1080p', icon: Video },
];

export function CreateCoursePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Tiếng Anh');
  const [level, setLevel] = useState('basic');
  const [priceAmount, setPriceAmount] = useState(0);
  const [duration, setDuration] = useState('');
  const [color] = useState('#002143');
  const [structures, setStructures] = useState<string[]>([]);
  const [newStructure, setNewStructure] = useState('');
  const [materials, setMaterials] = useState<Record<string, boolean>>({
    ebook: true,
    quiz: false,
    video: true,
  });

  // Uploaded Files
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ file_path: string; file_name: string; file_url: string }>>([]);
  const [showUploadArea, setShowUploadArea] = useState(false);

  // Teacher info
  const [teacherName, setTeacherName] = useState(user?.name || '');
  const [teacherBio, setTeacherBio] = useState(user?.bio || '');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    const generated = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .substring(0, 100);
    setSlug(generated);
  };

  const addStructure = () => {
    if (newStructure.trim()) {
      setStructures(prev => [...prev, newStructure.trim()]);
      setNewStructure('');
    }
  };

  const removeStructure = (index: number) => {
    setStructures(prev => prev.filter((_, i) => i !== index));
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = 'Vui lòng nhập tên khóa học';
    if (!slug.trim()) errs.slug = 'Slug không hợp lệ';
    if (!category) errs.category = 'Vui lòng chọn danh mục';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        slug,
        subtitle: description.substring(0, 255),
        description,
        category,
        level: LEVELS.find(l => l.key === level)?.label || level,
        price: priceAmount > 0 ? `${formatPrice(priceAmount)}đ` : 'Miễn phí',
        price_amount: priceAmount,
        duration,
        color,
        status,
        structures: structures.length > 0 ? structures : undefined,
      };

      const newCourse = await api.post('/courses', payload);

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate('/courses');
      }, 1800);
    } catch (err: any) {
      console.error('Failed to create course:', err);
      if (err.errors) {
        const flatErrors: Record<string, string> = {};
        for (const [key, val] of Object.entries(err.errors)) {
          flatErrors[key] = Array.isArray(val) ? val[0] : String(val);
        }
        setErrors(flatErrors);
      } else {
        setErrors({ general: err.message || 'Đã xảy ra lỗi khi tạo khóa học.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setCategory('Tiếng Anh');
    setLevel('basic');
    setPriceAmount(0);
    setDuration('');
    setStructures([]);
    setNewStructure('');
    setErrors({});
  };

  // ───────── BEE SVG ─────────
  const BeeMascot = () => (
    <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-xl">
      <circle cx="40" cy="34" r="22" fill="#FBBF24" stroke="#1E293B" strokeWidth="2.5"/>
      <path d="M40 16V52" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M28 20V48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M52 20V48" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M24 28C24 28 14 18 30 8C46 -2 50 24 50 24" fill="#E2E8F0" fillOpacity="0.6"/>
      <path d="M24 40C24 40 14 50 30 60C46 70 50 44 50 44" fill="#E2E8F0" fillOpacity="0.6"/>
      <path d="M30 18C30 18 27 12 24 12" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M50 18C50 18 53 12 56 12" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="22" cy="10" r="2.5" fill="#1E293B"/>
      <circle cx="58" cy="10" r="2.5" fill="#1E293B"/>
      <circle cx="35" cy="30" r="3" fill="#1E293B"/>
      <circle cx="45" cy="30" r="3" fill="#1E293B"/>
      <path d="M36 40C36 40 38 43 40 43C42 43 44 40 44 40" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
      {/* Waving hand */}
      <circle cx="64" cy="20" r="5" fill="#FBBF24" stroke="#1E293B" strokeWidth="1.5"/>
      <path d="M64 15V10" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M60 17L57 13" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M68 17L71 13" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  return (
    <div className="space-y-8 relative">
      {/* ═══════ SUCCESS OVERLAY ═══════ */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              className="bg-white rounded-3xl p-10 text-center shadow-2xl max-w-md mx-4"
            >
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="font-headline text-2xl font-extrabold text-[#002143] mb-2">Tạo khóa học thành công! 🎉</h3>
              <p className="text-[#43474e] text-sm">Đang chuyển hướng đến trang khóa học...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════ HERO HEADER ═══════ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#002143] via-[#13375f] to-[#1e4d80] rounded-[2rem] p-10 text-white shadow-2xl shadow-[#002143]/20">
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div className="max-w-xl">
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-headline text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.15]"
            >
              Tạo Khóa Học Mới
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#82a1cf] mt-3 text-sm leading-relaxed italic"
            >
              "Kiến thức là kho báu, nhưng thực hành chính là chìa khóa để mở nó."
              <br />
              <span className="not-italic opacity-80">Hãy cùng BeeLearn xây dựng những bài giảng tuyệt vời cho học sinh lớp 12.</span>
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:block shrink-0"
          >
            <BeeMascot />
          </motion.div>
        </div>
        {/* Decor blobs */}
        <div className="absolute top-[-20%] right-[-5%] w-52 h-52 bg-[#73000a]/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-30%] right-[10%] w-72 h-72 bg-[#cee5ff]/10 rounded-full blur-3xl pointer-events-none"></div>
      </section>

      {/* ═══════ ERROR BANNER ═══════ */}
      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3"
        >
          <span className="material-symbols-outlined text-red-500">error</span>
          <span className="text-sm font-medium">{errors.general}</span>
        </motion.div>
      )}

      {/* ═══════ MAIN GRID ═══════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ────── LEFT: Form (2/3) ────── */}
        <div className="lg:col-span-2 space-y-8">

          {/* Card: Thông tin cơ bản */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-[#002143] rounded-full"></div>
              <h3 className="font-headline text-xl font-extrabold text-[#002143]">Thông tin cơ bản</h3>
            </div>

            <div className="space-y-6">
              {/* Course Name */}
              <div>
                <label className="block text-sm font-bold text-[#002143] mb-2">Tên khóa học</label>
                <input
                  id="course-title"
                  type="text"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Ví dụ: Luyện thi Đại học môn Tiếng Anh cấp tốc"
                  className={`w-full px-5 py-4 bg-[#f4f3f7] border rounded-2xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.title ? 'border-red-400 focus:ring-red-200' : 'border-transparent focus:ring-[#002143]/15'
                  }`}
                />
                {errors.title && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.title}</p>}
              </div>

              {/* Category & Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Category */}
                <div>
                  <label className="block text-sm font-bold text-[#002143] mb-2">Danh mục</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-[#f4f3f7] border border-transparent rounded-2xl text-sm text-[#002143] font-medium hover:bg-[#eeedf1] transition-all"
                    >
                      <span>{category}</span>
                      <ChevronDown className={`w-4 h-4 text-[#73777f] transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isCategoryOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-black/5 z-30 overflow-hidden max-h-60 overflow-y-auto"
                        >
                          {CATEGORIES.map(cat => (
                            <button
                              key={cat}
                              onClick={() => { setCategory(cat); setIsCategoryOpen(false); }}
                              className={`w-full text-left px-5 py-3 text-sm font-medium hover:bg-[#f4f3f7] transition-colors ${
                                category === cat ? 'bg-[#cee5ff] text-[#002143] font-bold' : 'text-[#43474e]'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Level */}
                <div>
                  <label className="block text-sm font-bold text-[#002143] mb-2">Mức độ</label>
                  <div className="flex gap-2">
                    {LEVELS.map(l => (
                      <button
                        key={l.key}
                        type="button"
                        onClick={() => setLevel(l.key)}
                        className={`flex-1 px-3 py-3.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                          level === l.key
                            ? 'bg-[#002143] text-white shadow-lg shadow-[#002143]/20 scale-[1.03]'
                            : 'bg-[#f4f3f7] text-[#43474e] hover:bg-[#eeedf1]'
                        }`}
                      >
                        <span className="block text-base mb-0.5">{l.icon}</span>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-bold text-[#002143] mb-2">Giá khóa học (VND)</label>
                <div className="relative">
                  <input
                    id="course-price"
                    type="number"
                    min={0}
                    step={10000}
                    value={priceAmount}
                    onChange={e => setPriceAmount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-5 py-4 bg-[#f4f3f7] border border-transparent rounded-2xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all pr-16"
                  />
                  <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#73777f]">VND</span>
                </div>
                {priceAmount > 0 && (
                  <p className="text-xs text-[#43474e] mt-1.5">Hiển thị: <span className="font-bold text-[#002143]">{formatPrice(priceAmount)}đ</span></p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-[#002143] mb-2">Mô tả ngắn</label>
                <textarea
                  id="course-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Tóm tắt nội dung chính của khóa học..."
                  rows={3}
                  className="w-full px-5 py-4 bg-[#f4f3f7] border border-transparent rounded-2xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Card: Nội dung khóa học */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-[#e65540] rounded-full"></div>
              <h3 className="font-headline text-xl font-extrabold text-[#002143]">Nội dung khóa học</h3>
            </div>

            {/* Objectives */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-[#002143]">Mục tiêu chính của khóa học</label>

              <div className="space-y-2">
                <AnimatePresence>
                  {structures.map((s, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="flex items-center gap-3 bg-[#f4f3f7] px-5 py-3.5 rounded-xl group"
                    >
                      <div className="w-6 h-6 bg-[#002143] rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-[#002143] font-medium flex-1">{s}</span>
                      <button
                        onClick={() => removeStructure(idx)}
                        className="p-1.5 text-[#73777f] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <input
                  id="structure-input"
                  type="text"
                  value={newStructure}
                  onChange={e => setNewStructure(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStructure()}
                  placeholder="Thêm mục tiêu mới..."
                  className="flex-1 px-5 py-3.5 bg-[#f4f3f7] border border-transparent rounded-xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all"
                />
                <button
                  onClick={addStructure}
                  disabled={!newStructure.trim()}
                  className="px-6 py-3.5 bg-[#002143] text-white rounded-xl text-sm font-bold hover:bg-[#13375f] disabled:opacity-40 transition-all active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Thêm
                </button>
              </div>
            </div>

            {/* Materials */}
            <div className="mt-8">
              <label className="block text-sm font-bold text-[#002143] mb-4">Tài liệu đính kèm</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {MATERIAL_TYPES.map(mat => {
                  const Icon = mat.icon;
                  const isChecked = materials[mat.key];
                  return (
                    <button
                      key={mat.key}
                      type="button"
                      onClick={() => setMaterials(prev => ({ ...prev, [mat.key]: !prev[mat.key] }))}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isChecked
                          ? 'border-[#002143] bg-[#002143]/5'
                          : 'border-[#e3e2e6] bg-white hover:border-[#73777f]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 transition-colors ${
                        isChecked ? 'bg-[#002143] text-white' : 'bg-[#e3e2e6]'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#002143]">{mat.label}</p>
                        <p className="text-[10px] text-[#73777f]">{mat.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Uploaded file list */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-bold text-[#43474e] uppercase tracking-wider">File đã tải lên ({uploadedFiles.length})</p>
                  {uploadedFiles.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-green-50 border border-green-200 px-4 py-3 rounded-xl group">
                      <Paperclip className="w-4 h-4 text-green-600 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#002143] truncate">{f.file_name}</p>
                        {f.file_url && <a href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-green-600 hover:underline">Xem file</a>}
                      </div>
                      <button
                        type="button"
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1 text-[#73777f] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Toggle upload area */}
              {!showUploadArea ? (
                <button
                  type="button"
                  onClick={() => setShowUploadArea(true)}
                  className="mt-4 flex items-center gap-2 px-5 py-3 bg-[#f4f3f7] text-[#002143] rounded-xl text-sm font-bold hover:bg-[#eeedf1] transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4" /> Tải lên file mới
                </button>
              ) : (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#002143]">Chọn file để tải lên</p>
                    <button
                      type="button"
                      onClick={() => setShowUploadArea(false)}
                      className="text-xs text-[#73777f] hover:text-red-500 font-bold"
                    >
                      Đóng
                    </button>
                  </div>
                  <FileUpload
                    onFileUploaded={(data) => {
                      setUploadedFiles(prev => [...prev, data]);
                      setShowUploadArea(false);
                    }}
                    uploadEndpoint="/upload/lesson-media"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.zip,.jpg,.png"
                    maxSizeMB={200}
                    label="Kéo thả tài liệu vào đây hoặc nhấn để chọn file"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ────── RIGHT: Sidebar (1/3) ────── */}
        <div className="space-y-6">

          {/* Video Trailer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5"
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center group cursor-pointer">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative z-10 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-xl"
              >
                <Video className="w-7 h-7 text-[#002143] ml-0.5" />
              </motion.div>
              <div className="absolute top-3 left-3 z-10 bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                Xem Trailer
              </div>
            </div>
            <div className="p-5">
              <p className="text-sm font-bold text-[#002143] mb-2">Video Giới thiệu khóa học</p>
              <button className="flex items-center gap-2 text-xs font-bold text-[#43474e] hover:text-[#002143] transition-colors">
                <Upload className="w-3.5 h-3.5" /> Thay đổi Video Trailer
              </button>
            </div>
          </motion.div>

          {/* Teacher Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="bg-white rounded-3xl p-6 shadow-sm border border-black/5"
          >
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-[#002143]" />
              <h3 className="font-headline text-base font-extrabold text-[#002143]">Thông tin Giảng viên</h3>
            </div>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#cee5ff] to-[#d4e3ff] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
                  ) : (
                    <GraduationCap className="w-9 h-9 text-[#002143]" />
                  )}
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#002143] text-white rounded-full flex items-center justify-center shadow-md hover:bg-[#13375f] transition-colors">
                  <Pen className="w-3 h-3" />
                </button>
              </div>
              <p className="text-[10px] text-[#73777f] mt-3 text-center">Hỗ trợ định dạng JPG, PNG.<br/>Dung lượng tối đa 2MB.</p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase tracking-wider">Tên hiển thị</label>
                <input
                  id="teacher-name"
                  type="text"
                  value={teacherName}
                  onChange={e => setTeacherName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-3 bg-[#f4f3f7] border border-transparent rounded-xl text-sm text-[#002143] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#43474e] mb-1.5 uppercase tracking-wider">Chuyên môn / Kinh nghiệm</label>
                <textarea
                  id="teacher-bio"
                  value={teacherBio}
                  onChange={e => setTeacherBio(e.target.value)}
                  placeholder="Chia sẻ về hành trình giảng dạy của bạn..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f4f3f7] border border-transparent rounded-xl text-sm text-[#002143] placeholder-[#73777f] font-medium focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="space-y-3 sticky top-28"
          >
            {/* Primary: Publish */}
            <button
              id="submit-course-btn"
              onClick={() => handleSubmit('published')}
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-[#e65540] to-[#d94432] text-white font-bold text-base rounded-2xl hover:from-[#d94432] hover:to-[#c93d2d] disabled:opacity-60 transition-all active:scale-[0.98] shadow-xl shadow-[#e65540]/20 flex items-center justify-center gap-3 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <RotateCcw className="w-5 h-5" />
                  </motion.div>
                  Đang tạo...
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Khởi tạo khóa học
                </>
              )}
            </button>

            {/* Save Draft */}
            <button
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white text-[#002143] font-bold text-sm rounded-2xl border-2 border-[#e3e2e6] hover:border-[#002143]/20 hover:bg-[#f4f3f7] disabled:opacity-60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Lưu bản nháp
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="w-full py-2.5 text-[#73777f] text-sm font-medium hover:text-red-500 transition-colors cursor-pointer"
            >
              Hủy thiết lập
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
