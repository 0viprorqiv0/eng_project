import React, { useState } from 'react';
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { BeeDecoration } from './BeeDecoration';
import { api } from '../lib/api';

export function Footer() {
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      setError('Vui lòng điền đủ họ tên và số điện thoại');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await api.post('/consultations', formData);
      setSuccess(true);
      setFormData({ name: '', phone: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-navy text-white pt-24 pb-12 relative overflow-hidden">
      <BeeDecoration className="top-10 right-10 opacity-5" size={100} delay={1.5} />
      <BeeDecoration className="bottom-10 left-10 opacity-5 -rotate-45" size={120} delay={4} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 mb-20">
          {/* Contact Info */}
          <div>
            <div className="flex items-center gap-3 mb-10 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
                  <ellipse cx="24" cy="14" rx="6" ry="10" transform="rotate(30 24 14)" className="fill-white/20" />
                  <ellipse cx="16" cy="14" rx="6" ry="10" transform="rotate(-30 16 14)" className="fill-white/30" />
                  <path d="M8 24L2 24" strokeWidth="3" strokeLinecap="round" className="stroke-white" />
                  <rect x="6" y="16" width="28" height="16" rx="8" className="fill-beered" />
                  <line x1="14" y1="16" x2="14" y2="32" strokeWidth="4" className="stroke-white" />
                  <line x1="22" y1="16" x2="22" y2="32" strokeWidth="4" className="stroke-white" />
                  <circle cx="28" cy="22" r="2.5" className="fill-white" />
                  <circle cx="29" cy="21" r="1" className="fill-navy" />
                  <path d="M26 16 Q 28 8 32 10" strokeWidth="2.5" fill="none" strokeLinecap="round" className="stroke-white" />
                  <circle cx="32" cy="10" r="1.5" className="fill-white" />
                </svg>
              </div>
              <span className="text-3xl font-extrabold text-white tracking-tight">Bee<span className="text-beered">Learn</span></span>
            </div>
            <p className="text-gray-400 mb-10 text-lg leading-relaxed max-w-md">
              Trung tâm Anh ngữ BeeLearn - Nơi khơi nguồn đam mê ngôn ngữ và kiến tạo tương lai vững chắc cho thế hệ trẻ Việt Nam.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                <Phone size={20} className="text-beered" />
                <span className="text-sm">1900 6789</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                <Mail size={20} className="text-beered" />
                <span className="text-sm">contact@beelearn.edu.vn</span>
              </div>
              <div className="flex items-center gap-4 text-gray-300 hover:text-white transition-colors">
                <MapPin size={20} className="text-beered" />
                <span className="text-sm">123 Cầu Giấy, Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Form */}
          <div className="bg-[#13284b] p-8 md:p-10 rounded-2xl relative">
            <h3 className="text-xl font-bold mb-8">Nhận tư vấn miễn phí</h3>
            {success ? (
              <div className="absolute inset-0 bg-[#13284b] rounded-2xl flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                  <CheckCircle2 className="text-green-400 w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Đăng ký thành công!</h4>
                <p className="text-gray-400 text-sm">Chuyên viên tư vấn của BeeLearn sẽ liên hệ với bạn trong thời gian sớm nhất.</p>
              </div>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-[10px] font-bold mb-2 text-gray-300 uppercase tracking-widest">Họ và tên</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nguyễn Văn A" 
                    className="w-full px-5 py-4 rounded-xl bg-[#283b5c] border-none focus:ring-2 focus:ring-beered/50 outline-none transition-all text-white placeholder-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold mb-2 text-gray-300 uppercase tracking-widest">Số điện thoại</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="09xx xxx xxx" 
                    className="w-full px-5 py-4 rounded-xl bg-[#283b5c] border-none focus:ring-2 focus:ring-beered/50 outline-none transition-all text-white placeholder-gray-500 text-sm"
                  />
                </div>
                {error && <p className="text-red-400 text-xs font-bold">{error}</p>}
                <button 
                  disabled={loading}
                  className="w-full py-4 mt-2 bg-[#f05136] text-white font-bold rounded-xl hover:bg-[#d8462f] transition-all shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang gửi...' : 'Đăng ký ngay'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>© 2026 Trung tâm Anh ngữ BeeLearn. Bảo lưu mọi quyền.</p>
        </div>
      </div>
    </footer>
  );
}
