import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Users, User, GraduationCap, Bell, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';

export function SendNotificationPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    target: 'students',
    user_id: '',
    title: '',
    message: '',
    type: 'system'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/notifications/send', formData);
      setSuccess(true);
      setFormData({ ...formData, title: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Không thể gửi thông báo. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[#13375f] mb-2 font-headline">Gửi Thông Báo Thông Minh</h1>
        <p className="text-slate-500">Gửi thông báo tức thì đến học viên, giáo viên hoặc toàn bộ hệ thống.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Target Selection */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Đối tượng nhận tin</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'students', label: 'Học sinh', icon: GraduationCap },
                    { id: 'teachers', label: 'Giáo viên', icon: Users },
                    { id: 'all', label: 'Tất cả', icon: Bell },
                    { id: 'user', label: 'Cá nhân', icon: User },
                  ].map((target) => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, target: target.id })}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                        formData.target === target.id 
                          ? 'border-[#13375f] bg-[#13375f]/5 text-[#13375f]' 
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      <target.icon size={20} />
                      <span className="text-[11px] font-bold uppercase">{target.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.target === 'user' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">ID Người nhận</label>
                  <input 
                    type="number"
                    required
                    value={formData.user_id}
                    onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#13375f] focus:outline-none transition-all"
                    placeholder="VD: 5"
                  />
                </motion.div>
              )}

              {/* Notification Type */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Loại thông báo</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full select-form px-5 py-3 rounded-xl outline-none"
                >
                  <option value="system">Sự kiện & Hệ thống</option>
                  <option value="assignment">Bài tập & Điểm số</option>
                  <option value="course">Khóa học mới</option>
                  <option value="schedule">Thay đổi lịch học</option>
                  <option value="promotion">Khuyến mãi & Tin tức</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tiêu đề</label>
                <input 
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#13375f] focus:outline-none transition-all"
                  placeholder="Tiêu đề thông báo..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nội dung chi tiết</label>
                <textarea 
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-3 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-[#13375f] focus:outline-none transition-all resize-none"
                  placeholder="Nhập nội dung thông báo tại đây..."
                ></textarea>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100">
                  <AlertCircle size={20} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 text-green-600 rounded-xl flex items-center gap-3 border border-green-100">
                  <CheckCircle2 size={20} />
                  <p className="text-sm font-medium">Thông báo đã được gửi đi thành công!</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95 ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-[#13375f] text-white hover:bg-opacity-95'
                }`}
              >
                {loading ? 'Đang gửi...' : (
                  <>
                    <Send size={20} />
                    Gửi Thông Báo Ngay
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#13375f] text-white p-8 rounded-[2rem] shadow-xl">
            <h3 className="text-xl font-bold mb-4">Mẹo gửi tin "Smart"</h3>
            <ul className="space-y-4 text-sm text-white/80">
              <li className="flex gap-3 italic">
                <span className="text-white font-bold">#1</span>
                Sử dụng Tiêu đề ngắn gọn và gây chú ý.
              </li>
              <li className="flex gap-3 italic">
                <span className="text-white font-bold">#2</span>
                Gửi đúng đối tượng để tránh spam học viên.
              </li>
              <li className="flex gap-3 italic">
                <span className="text-white font-bold">#3</span>
                Nên gửi thông báo vào khung giờ vàng (8h sáng hoặc 8h tối).
              </li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold text-[#13375f] mb-4">Lịch sử gửi tin</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex gap-3 items-start border-b border-slate-50 pb-3 last:border-0">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                    <Bell size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Thông báo về lịch nghỉ lễ...</p>
                    <p className="text-[10px] text-slate-400 uppercase">2 ngày trước • Gửi bởi Admin</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 text-xs font-bold text-slate-400 hover:text-[#13375f] transition-colors">Xem tất cả lịch sử</button>
          </div>
        </div>
      </div>
    </div>
  );
}
