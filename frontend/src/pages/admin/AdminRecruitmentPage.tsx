import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

interface JobApplication {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  position: string;
  experience: string | null;
  achievements: string | null;
  cv_link: string | null;
  cover_letter: string | null;
  status: 'new' | 'reviewing' | 'interview' | 'accepted' | 'rejected';
  admin_notes: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null;
  reviewer?: { id: number; name: string } | null;
  created_at: string;
}

interface Stats {
  total: number;
  new: number;
  reviewing: number;
  interview: number;
  accepted: number;
  rejected: number;
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: string; gradient: string }> = {
  new:       { label: 'Mới',          color: 'text-blue-700',   bg: 'bg-blue-100',   icon: 'fiber_new',    gradient: 'from-blue-500 to-blue-600' },
  reviewing: { label: 'Đang xem xét', color: 'text-amber-700',  bg: 'bg-amber-100',  icon: 'visibility',   gradient: 'from-amber-500 to-amber-600' },
  interview: { label: 'Phỏng vấn',    color: 'text-purple-700', bg: 'bg-purple-100', icon: 'groups',       gradient: 'from-purple-500 to-purple-600' },
  accepted:  { label: 'Đã tuyển',     color: 'text-green-700',  bg: 'bg-green-100',  icon: 'check_circle', gradient: 'from-green-500 to-green-600' },
  rejected:  { label: 'Từ chối',      color: 'text-red-700',    bg: 'bg-red-100',    icon: 'cancel',       gradient: 'from-red-500 to-red-600' },
};

export function AdminRecruitmentPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, new: 0, reviewing: 0, interview: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState<JobApplication | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'review'>('info');

  const fetchApplications = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (search) params.append('search', search);
      const res = await api.get(`/admin/job-applications?${params.toString()}`);
      setApplications(res.data || []);
      setStats(res.stats || { total: 0, new: 0, reviewing: 0, interview: 0, accepted: 0, rejected: 0 });
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [filterStatus, search]);

  const openDetail = (app: JobApplication) => {
    setSelectedApp(app);
    setAdminNotes(app.admin_notes || '');
    setActiveTab('info');
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedApp(null), 300);
  };

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedApp) return;
    setUpdatingStatus(true);
    try {
      const res = await api.put(`/admin/job-applications/${selectedApp.id}`, {
        status: newStatus,
        admin_notes: adminNotes,
      });
      toast.success('Cập nhật trạng thái thành công');
      setSelectedApp(res.data);
      fetchApplications();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi cập nhật');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn chắc chắn muốn xóa hồ sơ này?')) return;
    try {
      await api.delete(`/admin/job-applications/${id}`);
      toast.success('Đã xóa hồ sơ');
      closeDetail();
      fetchApplications();
    } catch (err: any) {
      toast.error(err.message || 'Lỗi khi xóa');
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  };

  const statCards = [
    { label: 'Tổng số ứng viên', value: stats.total, icon: 'groups', gradient: 'from-[#13375f] to-[#1e4a7a]' },
    { label: 'Hồ sơ mới', value: stats.new, icon: 'fiber_new', gradient: 'from-blue-500 to-blue-600' },
    { label: 'Chờ phỏng vấn', value: stats.interview, icon: 'event', gradient: 'from-purple-500 to-purple-600' },
    { label: 'Đã tuyển', value: stats.accepted, icon: 'verified', gradient: 'from-green-500 to-green-600' },
  ];

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#002143] tracking-tight">Quản lý Hồ sơ Ứng tuyển</h1>
          <p className="text-[#51667c] mt-1">Theo dõi và xử lý hồ sơ ứng viên tiềm năng cho đội ngũ BeeLearn.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <span className="material-symbols-outlined text-white text-xl">{card.icon}</span>
              </div>
            </div>
            <p className="text-[11px] font-bold text-[#51667c] uppercase tracking-wider">{card.label}</p>
            <p className="text-3xl font-black text-[#002143] mt-1">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center bg-[#e8e8ec] px-4 py-2 rounded-xl flex-grow max-w-md">
          <span className="material-symbols-outlined text-[#73777f] text-xl mr-2">search</span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#43474e]/50 outline-none"
            placeholder="Tìm theo tên, vị trí..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { value: 'all', label: 'Tất cả' },
            { value: 'new', label: 'Mới' },
            { value: 'reviewing', label: 'Đang xem xét' },
            { value: 'interview', label: 'Phỏng vấn' },
            { value: 'accepted', label: 'Đã tuyển' },
            { value: 'rejected', label: 'Từ chối' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilterStatus(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                filterStatus === opt.value
                  ? 'bg-[#13375f] text-white shadow-lg shadow-[#13375f]/20'
                  : 'bg-slate-50 text-[#51667c] hover:bg-slate-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-3 border-[#13375f]/20 border-t-[#13375f] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#51667c] text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-16 text-center">
            <span className="material-symbols-outlined text-5xl text-slate-200 mb-4">inbox</span>
            <p className="text-[#51667c] font-medium">Không tìm thấy hồ sơ ứng tuyển nào</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr] gap-4 px-6 py-3 bg-slate-50 text-[10px] font-black text-[#51667c] uppercase tracking-widest border-b border-slate-100">
              <span>Ứng viên</span>
              <span>Vị trí</span>
              <span>Ngày nộp</span>
              <span>Kinh nghiệm</span>
              <span>Trạng thái</span>
            </div>

            {/* Table Rows */}
            {applications.map((app, idx) => {
              const status = STATUS_MAP[app.status] || STATUS_MAP.new;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => openDetail(app)}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1.2fr_1fr_1fr_0.8fr] gap-3 md:gap-4 px-6 py-4 border-b border-slate-50 hover:bg-blue-50/30 cursor-pointer transition-colors items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#13375f] to-[#1e4a7a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                      {app.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#002143] text-sm truncate">{app.full_name}</p>
                      <p className="text-xs text-[#51667c] truncate">{app.email}</p>
                    </div>
                  </div>
                  <div><p className="text-sm text-[#002143] font-medium truncate">{app.position}</p></div>
                  <div><p className="text-sm text-[#51667c]">{formatDate(app.created_at)}</p></div>
                  <div><p className="text-sm text-[#51667c]">{app.experience || '—'}</p></div>
                  <div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                      <span className="material-symbols-outlined text-[14px]">{status.icon}</span>
                      {status.label}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            <div className="px-6 py-4 bg-slate-50 text-xs text-[#51667c] font-medium">
              Hiển thị {applications.length} trên {stats.total} hồ sơ
            </div>
          </>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CENTERED DETAIL MODAL — Full Profile View
          ═══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isDetailOpen && selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            onClick={closeDetail}
          >
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#002143]/50 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 30 }}
              transition={{ type: 'spring', damping: 28, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* ── Hero Header with gradient ── */}
              <div className={`relative bg-gradient-to-r ${STATUS_MAP[selectedApp.status]?.gradient || 'from-[#13375f] to-[#1e4a7a]'} px-8 pt-8 pb-20 overflow-hidden`}>
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

                {/* Close button */}
                <button
                  onClick={closeDetail}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors backdrop-blur-sm"
                >
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>

                {/* Status + Position */}
                <div className="relative z-10 flex items-start gap-2">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-white/20 text-white backdrop-blur-sm`}>
                    <span className="material-symbols-outlined text-[14px]">{STATUS_MAP[selectedApp.status]?.icon}</span>
                    {STATUS_MAP[selectedApp.status]?.label}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white/80 backdrop-blur-sm">
                    Nộp ngày {formatDate(selectedApp.created_at)}
                  </span>
                </div>
              </div>

              {/* ── Profile Card (floated over header) ── */}
              <div className="relative px-8 -mt-14 mb-4 z-10">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col sm:flex-row items-center sm:items-start gap-5">
                  {/* Avatar */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#13375f] to-[#2a5a8f] flex items-center justify-center text-white font-black text-3xl shadow-lg flex-shrink-0 ring-4 ring-white">
                    {selectedApp.full_name.charAt(0).toUpperCase()}
                  </div>
                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left min-w-0">
                    <h2 className="text-2xl font-black text-[#002143] tracking-tight">{selectedApp.full_name}</h2>
                    <p className="text-[#51667c] font-medium mt-0.5">{selectedApp.position}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                      <a href={`mailto:${selectedApp.email}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13375f] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        {selectedApp.email}
                      </a>
                      <a href={`tel:${selectedApp.phone}`} className="inline-flex items-center gap-1.5 text-xs font-bold text-[#13375f] bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                        <span className="material-symbols-outlined text-[14px]">phone</span>
                        {selectedApp.phone}
                      </a>
                      {selectedApp.date_of_birth && (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#51667c] bg-slate-50 px-3 py-1.5 rounded-lg">
                          <span className="material-symbols-outlined text-[14px]">cake</span>
                          {formatDate(selectedApp.date_of_birth)}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Quick Actions */}
                  {selectedApp.cv_link && (
                    <a
                      href={selectedApp.cv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#13375f] text-white text-sm font-bold rounded-xl hover:bg-[#1e4a7a] transition-colors shadow-lg shadow-[#13375f]/20 flex-shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">open_in_new</span>
                      Xem CV
                    </a>
                  )}
                </div>
              </div>

              {/* ── Tab Navigation ── */}
              <div className="px-8 flex gap-1 border-b border-slate-100">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all relative ${
                    activeTab === 'info'
                      ? 'text-[#13375f] bg-blue-50/50'
                      : 'text-[#51667c] hover:text-[#002143] hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person</span>
                    Hồ sơ ứng viên
                  </span>
                  {activeTab === 'info' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#13375f] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('review')}
                  className={`px-5 py-3 text-sm font-bold rounded-t-xl transition-all relative ${
                    activeTab === 'review'
                      ? 'text-[#13375f] bg-blue-50/50'
                      : 'text-[#51667c] hover:text-[#002143] hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">rate_review</span>
                    Đánh giá & Trạng thái
                  </span>
                  {activeTab === 'review' && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#13375f] rounded-full" />
                  )}
                </button>
              </div>

              {/* ── Tab Content (Scrollable) ── */}
              <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: 'thin' }}>
                <AnimatePresence mode="wait">
                  {activeTab === 'info' ? (
                    <motion.div
                      key="info"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* Info Grid */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Kinh nghiệm */}
                        <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-[#13375f] flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">work_history</span>
                            </div>
                            <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest">Kinh nghiệm</h4>
                          </div>
                          <p className="text-[#002143] font-semibold text-lg">{selectedApp.experience || 'Chưa cung cấp'}</p>
                        </div>

                        {/* Vị trí */}
                        <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-100">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">badge</span>
                            </div>
                            <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest">Vị trí ứng tuyển</h4>
                          </div>
                          <p className="text-[#002143] font-semibold text-lg">{selectedApp.position}</p>
                        </div>

                        {/* Thành tích */}
                        <div className="md:col-span-2 bg-gradient-to-br from-amber-50/80 to-orange-50/50 p-5 rounded-2xl border border-amber-100/60">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                              <span className="material-symbols-outlined text-white text-lg">emoji_events</span>
                            </div>
                            <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest">Thành tích nổi bật</h4>
                          </div>
                          <p className="text-[#002143] leading-relaxed whitespace-pre-wrap">
                            {selectedApp.achievements || 'Ứng viên chưa cung cấp thông tin thành tích.'}
                          </p>
                        </div>

                        {/* CV/Portfolio Link */}
                        {selectedApp.cv_link && (
                          <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">link</span>
                              </div>
                              <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest">CV / Portfolio</h4>
                            </div>
                            <a
                              href={selectedApp.cv_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 bg-blue-50 hover:bg-blue-100 p-4 rounded-xl border border-blue-100 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-white">description</span>
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-bold text-blue-700 truncate">{selectedApp.cv_link}</p>
                                <p className="text-xs text-blue-500">Nhấp để mở trong tab mới</p>
                              </div>
                              <span className="material-symbols-outlined text-blue-400 group-hover:text-blue-600 transition-colors">arrow_outward</span>
                            </a>
                          </div>
                        )}

                        {/* Thư giới thiệu */}
                        {selectedApp.cover_letter && (
                          <div className="md:col-span-2 bg-gradient-to-br from-slate-50 to-white p-5 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="w-8 h-8 rounded-lg bg-[#13375f] flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-lg">draft</span>
                              </div>
                              <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest">Thư giới thiệu</h4>
                            </div>
                            <p className="text-[#002143] leading-relaxed whitespace-pre-wrap text-[15px]">
                              {selectedApp.cover_letter}
                            </p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Status Pipeline */}
                      <div>
                        <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#13375f] text-lg">timeline</span>
                          Quy trình tuyển dụng
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          {Object.entries(STATUS_MAP).map(([key, val], idx) => {
                            const isActive = selectedApp.status === key;
                            const isPast = Object.keys(STATUS_MAP).indexOf(selectedApp.status) > idx;
                            return (
                              <React.Fragment key={key}>
                                {idx > 0 && (
                                  <div className={`hidden sm:block w-8 h-[2px] rounded-full ${isPast ? 'bg-green-400' : 'bg-slate-200'}`} />
                                )}
                                <button
                                  onClick={() => handleUpdateStatus(key)}
                                  disabled={updatingStatus || isActive}
                                  className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all border-2 disabled:cursor-not-allowed ${
                                    isActive
                                      ? `bg-gradient-to-r ${val.gradient} text-white border-transparent shadow-lg scale-105`
                                      : isPast
                                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                                      : 'bg-white text-[#51667c] border-slate-200 hover:border-[#13375f] hover:text-[#13375f]'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[18px]">{val.icon}</span>
                                  <span className="hidden sm:inline">{val.label}</span>
                                </button>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reviewer Info */}
                      {selectedApp.reviewer && (
                        <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {selectedApp.reviewer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#002143]">Đã xem xét bởi: {selectedApp.reviewer.name}</p>
                            {selectedApp.reviewed_at && (
                              <p className="text-xs text-[#51667c]">Lúc {formatDate(selectedApp.reviewed_at)}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Admin Notes */}
                      <div>
                        <h4 className="text-xs font-black text-[#002143] uppercase tracking-widest mb-3 flex items-center gap-2">
                          <span className="material-symbols-outlined text-[#13375f] text-lg">edit_note</span>
                          Ghi chú nội bộ
                        </h4>
                        <textarea
                          rows={4}
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#13375f]/30 focus:border-[#13375f] resize-none transition-all bg-slate-50/50"
                          placeholder="Thêm nhận xét, đánh giá về ứng viên này..."
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={() => handleUpdateStatus(selectedApp.status)}
                            disabled={updatingStatus}
                            className="px-5 py-2 bg-[#13375f] text-white text-sm font-bold rounded-xl hover:bg-[#1e4a7a] transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {updatingStatus ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <span className="material-symbols-outlined text-lg">save</span>
                            )}
                            Lưu ghi chú
                          </button>
                        </div>
                      </div>

                      {/* Danger Zone */}
                      <div className="pt-4 border-t border-slate-100">
                        <button
                          onClick={() => handleDelete(selectedApp.id)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors"
                        >
                          <span className="material-symbols-outlined text-lg">delete_forever</span>
                          Xóa hồ sơ ứng tuyển này
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
