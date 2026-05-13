import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Link2,
  FileText,
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';
import { api } from '../../lib/api';

const JOB_LISTINGS = [
  { title: "Giáo viên Tiếng Anh THPT", type: "Toàn thời gian", location: "Hà Nội", salary: "15 - 25 triệu", desc: "Giảng dạy các lớp luyện thi THPT Quốc gia, bám sát chương trình của Bộ GD&ĐT." },
  { title: "Giáo viên luyện thi IELTS", type: "Bán thời gian", location: "Hồ Chí Minh", salary: "Thỏa thuận", desc: "Chuyên luyện kỹ năng Speaking & Writing cho học viên mục tiêu 6.5+." },
  { title: "Trợ giảng Tiếng Anh (TA)", type: "Bán thời gian", location: "Hà Nội", salary: "3 - 5 triệu", desc: "Hỗ trợ giáo viên trên lớp, chấm bài tập và giải đáp thắc mắc cho học viên." },
  { title: "Chuyên viên Tư vấn Tuyển sinh", type: "Toàn thời gian", location: "Đà Nẵng", salary: "10 - 20 triệu", desc: "Tư vấn lộ trình học tập, chăm sóc khách hàng và phát triển mạng lưới học viên." }
];

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  position: string;
  experience: string;
  achievements: string;
  cv_link: string;
  cover_letter: string;
}

const initialFormData: FormData = {
  full_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  position: '',
  experience: '',
  achievements: '',
  cv_link: '',
  cover_letter: '',
};

export function CareersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const openModal = (position?: string) => {
    setFormData({ ...initialFormData, position: position || '' });
    setErrors({});
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setFormData(initialFormData);
      setErrors({});
      setIsSuccess(false);
    }, 300);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Vui lòng nhập họ và tên';
    if (!formData.email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email không hợp lệ';
    if (!formData.phone.trim()) newErrors.phone = 'Vui lòng nhập số điện thoại';
    if (!formData.position.trim()) newErrors.position = 'Vui lòng chọn vị trí ứng tuyển';
    if (formData.cv_link && !/^https?:\/\/.+/.test(formData.cv_link)) newErrors.cv_link = 'Link không hợp lệ (bắt đầu bằng http:// hoặc https://)';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await api.post('/job-applications', formData);
      setIsSuccess(true);
    } catch (err: any) {
      if (err.errors) {
        const serverErrors: Record<string, string> = {};
        Object.keys(err.errors).forEach(key => {
          serverErrors[key] = err.errors[key][0];
        });
        setErrors(serverErrors);
      } else {
        setErrors({ general: err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* Hero Careers */}
      <section className="relative py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/careers/1920/1080')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <BeeDecoration className="absolute top-20 right-20 opacity-30" size={60} delay={0} />
        <BeeDecoration className="absolute bottom-20 left-20 opacity-20" size={40} delay={1.5} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">Gia Nhập <span className="text-beered">Tổ Ong</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Trở thành một phần của đội ngũ BeeLearn, nơi đam mê giáo dục được nuôi dưỡng và phát triển trong một môi trường làm việc chuyên nghiệp, năng động.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-24 bg-white relative">
        <BeeDecoration className="absolute top-1/2 left-10 opacity-10" size={80} delay={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Vị trí đang tuyển dụng</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-6"></div>
          </div>
          
          <div className="space-y-6">
            {JOB_LISTINGS.map((job, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-grow">
                  <h3 className="text-2xl font-bold text-navy mb-4 group-hover:text-beered transition-colors">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                      <Briefcase size={16} className="text-beered" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                      <MapPin size={16} className="text-beered" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200">
                      <DollarSign size={16} className="text-beered" /> {job.salary}
                    </span>
                  </div>
                  <p className="text-gray-500">{job.desc}</p>
                </div>
                <button
                  onClick={() => openModal(job.title)}
                  className="px-8 py-4 bg-navy text-white font-bold rounded-full hover:bg-beered transition-colors shrink-0 flex items-center gap-2 group/btn"
                >
                  Ứng tuyển ngay
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* General Application CTA */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <BeeDecoration className="absolute bottom-20 right-10 opacity-10" size={100} delay={0.5} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">Không tìm thấy vị trí phù hợp?</h2>
            <p className="text-gray-600 mb-8">Đừng ngần ngại gửi hồ sơ cho chúng tôi. BeeLearn luôn chào đón những nhân tài mới.</p>
            <button
              onClick={() => openModal()}
              className="px-10 py-4 bg-beered text-white font-bold rounded-full hover:bg-opacity-90 transition-all text-lg flex items-center gap-3 mx-auto hover:scale-105 hover:shadow-lg hover:shadow-red-200"
            >
              <Send size={20} /> Gửi hồ sơ ứng tuyển
            </button>
          </div>
        </div>
      </section>

      {/* Application Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl"
              style={{ scrollbarWidth: 'thin' }}
            >
              {/* Success State */}
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="p-12 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.2, damping: 10 }}
                      className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle size={48} className="text-green-500" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-2xl font-bold text-navy mb-3"
                    >
                      Gửi hồ sơ thành công! 🎉
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-gray-500 mb-2 max-w-md mx-auto"
                    >
                      Cảm ơn bạn đã quan tâm đến BeeLearn. Chúng tôi đã nhận được hồ sơ ứng tuyển của bạn và sẽ phản hồi trong thời gian sớm nhất.
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="text-sm text-gray-400 mb-8"
                    >
                      Thư xác nhận đã được ghi nhận vào hệ thống. Vui lòng kiểm tra email để cập nhật tình trạng.
                    </motion.p>
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      onClick={closeModal}
                      className="px-8 py-3 bg-navy text-white font-bold rounded-full hover:bg-beered transition-colors"
                    >
                      Đóng
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-8 py-6 rounded-t-[2rem] flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-navy flex items-center gap-2">
                          <Sparkles size={24} className="text-beered" />
                          Form Ứng Tuyển
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Điền đầy đủ thông tin để nộp hồ sơ ứng tuyển</p>
                      </div>
                      <button
                        onClick={closeModal}
                        className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                      {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                          {errors.general}
                        </div>
                      )}

                      {/* Section: Thông tin cá nhân */}
                      <div>
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                          <User size={16} className="text-beered" />
                          Thông tin cá nhân
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Họ và tên <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.full_name ? 'border-red-400 bg-red-50/50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all`}
                                placeholder="Nguyễn Văn A"
                              />
                            </div>
                            {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400 bg-red-50/50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all`}
                                placeholder="email@example.com"
                              />
                            </div>
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400 bg-red-50/50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all`}
                                placeholder="0912 345 678"
                              />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Ngày sinh
                            </label>
                            <div className="relative">
                              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                type="date"
                                name="date_of_birth"
                                value={formData.date_of_birth}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Section: Vị trí & Kinh nghiệm */}
                      <div>
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Briefcase size={16} className="text-beered" />
                          Vị trí & Kinh nghiệm
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Vị trí ứng tuyển <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="position"
                              value={formData.position}
                              onChange={handleChange}
                              className={`w-full px-4 py-3 rounded-xl border ${errors.position ? 'border-red-400 bg-red-50/50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all bg-white`}
                            >
                              <option value="">-- Chọn vị trí --</option>
                              {JOB_LISTINGS.map((job, idx) => (
                                <option key={idx} value={job.title}>{job.title}</option>
                              ))}
                              <option value="Khác">Khác (ghi rõ trong thư giới thiệu)</option>
                            </select>
                            {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                              Kinh nghiệm
                            </label>
                            <select
                              name="experience"
                              value={formData.experience}
                              onChange={handleChange}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all bg-white"
                            >
                              <option value="">-- Chọn kinh nghiệm --</option>
                              <option value="Chưa có kinh nghiệm">Chưa có kinh nghiệm</option>
                              <option value="Dưới 1 năm">Dưới 1 năm</option>
                              <option value="1 - 2 năm">1 - 2 năm</option>
                              <option value="2 - 3 năm">2 - 3 năm</option>
                              <option value="3 - 5 năm">3 - 5 năm</option>
                              <option value="Trên 5 năm">Trên 5 năm</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section: Thành tích */}
                      <div>
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Award size={16} className="text-beered" />
                          Thành tích nổi bật
                        </h3>
                        <textarea
                          name="achievements"
                          value={formData.achievements}
                          onChange={handleChange}
                          rows={3}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all resize-none"
                          placeholder="VD: IELTS 8.0, Giải nhất Olympic Tiếng Anh cấp tỉnh, 5 năm kinh nghiệm giảng dạy IELTS..."
                        />
                      </div>

                      {/* Section: Link CV / Portfolio */}
                      <div>
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                          <Link2 size={16} className="text-beered" />
                          CV / Portfolio
                        </h3>
                        <div className="relative">
                          <Link2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="url"
                            name="cv_link"
                            value={formData.cv_link}
                            onChange={handleChange}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.cv_link ? 'border-red-400 bg-red-50/50' : 'border-gray-200'} focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all`}
                            placeholder="https://drive.google.com/... hoặc https://linkedin.com/in/..."
                          />
                        </div>
                        {errors.cv_link && <p className="text-red-500 text-xs mt-1">{errors.cv_link}</p>}
                        <p className="text-xs text-gray-400 mt-1.5">Hỗ trợ: Google Drive, LinkedIn, Behance, Portfolio cá nhân...</p>
                      </div>

                      {/* Section: Thư giới thiệu */}
                      <div>
                        <h3 className="text-sm font-bold text-navy uppercase tracking-wider mb-4 flex items-center gap-2">
                          <FileText size={16} className="text-beered" />
                          Thư giới thiệu ngắn
                        </h3>
                        <textarea
                          name="cover_letter"
                          value={formData.cover_letter}
                          onChange={handleChange}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered/50 focus:border-beered transition-all resize-none"
                          placeholder="Hãy chia sẻ về bản thân, động lực ứng tuyển và những gì bạn có thể đóng góp cho BeeLearn..."
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-gradient-to-r from-navy to-[#1e4a7a] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-navy/30 transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Đang gửi hồ sơ...
                            </>
                          ) : (
                            <>
                              <Send size={20} />
                              Gửi hồ sơ ứng tuyển
                            </>
                          )}
                        </button>
                        <p className="text-xs text-center text-gray-400 mt-3">
                          Bằng việc gửi hồ sơ, bạn đồng ý cho BeeLearn lưu trữ thông tin để phục vụ quá trình tuyển dụng.
                        </p>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
