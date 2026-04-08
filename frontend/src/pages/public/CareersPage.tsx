import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Send
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';

export function CareersPage() {
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
            {[
              { title: "Giáo viên Tiếng Anh THPT", type: "Toàn thời gian", location: "Hà Nội", salary: "15 - 25 triệu", desc: "Giảng dạy các lớp luyện thi THPT Quốc gia, bám sát chương trình của Bộ GD&ĐT." },
              { title: "Giáo viên luyện thi IELTS", type: "Bán thời gian", location: "Hồ Chí Minh", salary: "Thỏa thuận", desc: "Chuyên luyện kỹ năng Speaking & Writing cho học viên mục tiêu 6.5+." },
              { title: "Trợ giảng Tiếng Anh (TA)", type: "Bán thời gian", location: "Hà Nội", salary: "3 - 5 triệu", desc: "Hỗ trợ giáo viên trên lớp, chấm bài tập và giải đáp thắc mắc cho học viên." },
              { title: "Chuyên viên Tư vấn Tuyển sinh", type: "Toàn thời gian", location: "Đà Nẵng", salary: "10 - 20 triệu", desc: "Tư vấn lộ trình học tập, chăm sóc khách hàng và phát triển mạng lưới học viên." }
            ].map((job, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
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
                <button className="px-8 py-4 bg-navy text-white font-bold rounded-full hover:bg-beered transition-colors shrink-0">
                  Ứng tuyển ngay
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <BeeDecoration className="absolute bottom-20 right-10 opacity-10" size={100} delay={0.5} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 text-center">
            <h2 className="text-3xl font-bold text-navy mb-4">Không tìm thấy vị trí phù hợp?</h2>
            <p className="text-gray-600 mb-8">Đừng ngần ngại gửi CV cho chúng tôi. BeeLearn luôn chào đón những nhân tài mới.</p>
            
            <form className="space-y-6 text-left max-w-2xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Họ và tên</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered" placeholder="Nguyễn Văn A" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered" placeholder="email@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-2">Vị trí mong muốn</label>
                <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered" placeholder="VD: Marketing Manager" />
              </div>
              <div>
                <label className="block text-sm font-bold text-navy mb-2">Link CV (Google Drive, LinkedIn...)</label>
                <input type="url" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered" placeholder="https://" />
              </div>
              <button type="submit" className="w-full py-4 bg-beered text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-lg">
                Gửi hồ sơ <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
