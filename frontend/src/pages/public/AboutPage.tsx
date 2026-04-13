import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Heart, 
  Target, 
  Eye, 
  ChevronRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';

export function AboutPage() {
  const navigate = useNavigate();
  const navigateToCourses = () => navigate('/courses');
  return (
    <div className="pt-20">
      {/* Hero About */}
      <section className="relative py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('/about_hero.png')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <BeeDecoration className="absolute top-20 right-20 opacity-30" size={60} delay={0} />
        <BeeDecoration className="absolute bottom-20 left-20 opacity-20" size={40} delay={1.5} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">Câu Chuyện Của <span className="text-beered">BeeLearn</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Từ một lớp học nhỏ với 5 học viên, BeeLearn đã vươn lên trở thành tổ chức giáo dục hàng đầu, chắp cánh ước mơ chinh phục tiếng Anh cho hàng ngàn học sinh Việt Nam.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white relative">
        <BeeDecoration className="absolute top-1/2 left-10 opacity-10" size={80} delay={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -inset-4 bg-beered/5 rounded-[3rem] blur-2xl"></div>
              <img src="/story.png" alt="Our Story" className="relative rounded-[3rem] shadow-2xl" />
              <div className="absolute -bottom-10 -right-10 bg-navy p-10 rounded-[2.5rem] text-white shadow-2xl hidden md:block border border-white/10">
                <p className="text-5xl font-black text-beered mb-2">10+</p>
                <p className="font-bold uppercase tracking-wider text-sm">Năm kinh nghiệm</p>
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-bold text-navy mb-8">Hành trình 10 năm kiến tạo tương lai</h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
                <p>
                  Được thành lập vào năm 2014 bởi một nhóm giáo viên tâm huyết, BeeLearn bắt đầu với một niềm tin mãnh liệt: Tiếng Anh không phải là một môn học để thi, mà là công cụ để mở ra thế giới.
                </p>
                <p>
                  Chúng tôi nhận thấy học sinh Việt Nam rất chăm chỉ, nhưng thường gặp khó khăn trong việc giao tiếp thực tế và áp dụng ngôn ngữ vào đời sống. Phương pháp học truyền thống quá chú trọng vào ngữ pháp khô khan đã làm mất đi niềm vui học tập.
                </p>
                <p>
                  Vì vậy, BeeLearn ra đời với sứ mệnh mang đến một phương pháp học tập hoàn toàn mới: <strong>Trực quan, Tương tác và Thực tiễn</strong>. Giống như những chú ong chăm chỉ xây tổ, chúng tôi kiên nhẫn xây dựng nền tảng vững chắc cho từng học viên.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Letter */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <BeeDecoration className="absolute top-0 right-0 opacity-10" size={100} delay={0.5} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Heart className="w-16 h-16 text-beered mx-auto mb-8 opacity-50" />
          <h2 className="text-3xl font-bold text-navy mb-10">Thư ngỏ từ Founder</h2>
          <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-gray-100 relative">
            <div className="absolute -top-6 -left-6 text-8xl text-beered/20 font-serif">"</div>
            <p className="text-xl text-gray-600 italic leading-relaxed mb-8 relative z-10">
              Chào các bạn, tôi là người sáng lập BeeLearn. Khi bắt đầu hành trình này, tôi chỉ có một ước mơ giản dị: giúp các em học sinh không còn sợ môn Tiếng Anh. Hôm nay, nhìn thấy hàng ngàn học viên tự tin thuyết trình, đạt điểm cao trong các kỳ thi quốc tế và giành học bổng du học, tôi biết chúng tôi đang đi đúng hướng. BeeLearn cam kết sẽ luôn là người bạn đồng hành đáng tin cậy nhất trên con đường chinh phục tri thức của các bạn.
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src="/founder.png" alt="Founder" className="w-16 h-16 rounded-full border-2 border-beered" />
              <div className="text-left">
                <p className="font-bold text-navy text-lg">Nguyễn Văn A</p>
                <p className="text-beered text-sm font-medium">Founder & CEO BeeLearn</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-24 bg-navy text-white relative overflow-hidden">
        <BeeDecoration className="absolute bottom-10 left-10 opacity-20" size={60} delay={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
              <Target className="w-16 h-16 text-beered mb-8" />
              <h3 className="text-2xl font-bold mb-4">Tầm nhìn</h3>
              <p className="text-gray-300 leading-relaxed">
                Trở thành hệ thống giáo dục Anh ngữ hàng đầu Việt Nam, tiên phong ứng dụng công nghệ vào giảng dạy và cá nhân hóa trải nghiệm học tập.
              </p>
            </div>
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
              <Eye className="w-16 h-16 text-beered mb-8" />
              <h3 className="text-2xl font-bold mb-4">Sứ mệnh</h3>
              <p className="text-gray-300 leading-relaxed">
                Trang bị cho thế hệ trẻ Việt Nam công cụ ngôn ngữ sắc bén và tư duy toàn cầu để tự tin hội nhập và kiến tạo tương lai.
              </p>
            </div>
            <div className="bg-white/5 p-10 rounded-[2.5rem] border border-white/10 hover:bg-white/10 transition-colors">
              <Heart className="w-16 h-16 text-beered mb-8" />
              <h3 className="text-2xl font-bold mb-4">Giá trị cốt lõi</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-beered" /> Tận tâm (Dedication)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-beered" /> Đổi mới (Innovation)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-beered" /> Chất lượng (Quality)</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={18} className="text-beered" /> Chính trực (Integrity)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="py-24 bg-white relative">
        <BeeDecoration className="absolute top-20 right-20 opacity-10" size={80} delay={0} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Đội ngũ Giảng viên Chuyên gia</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">100% giáo viên tại BeeLearn sở hữu chứng chỉ giảng dạy quốc tế (TESOL/CELTA) và có ít nhất 3 năm kinh nghiệm thực chiến.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "Mr. Tuấn", role: "Thạc sĩ Ngôn ngữ Anh (Melbourne)", exp: "IELTS 8.5 Writing & Speaking", img: "/Tuấn.png", quote: "Kỹ năng viết không khó, quan trọng là tư duy phản biện." },
              { name: "Ms. Linh", role: "Tiến sĩ Giáo dục học (Cambridge)", exp: "IELTS 9.0 & C2 Proficiency", img: "/Linh.png", quote: "Hãy biến tiếng Anh thành hơi thở, đừng coi nó là gánh nặng." },
              { name: "Ms. Ngọc", role: "Tiến sĩ Ngôn ngữ học (NUS)", exp: "Chứng chỉ C2 - 10 năm kinh nghiệm", img: "/Ngọc.png", quote: "Giao tiếp là sự kết nối tâm hồn, không chỉ là phát âm đúng." },
              { name: "Mr. Hoàng", role: "Thạc sĩ Sư phạm Anh (Oxford)", exp: "Tác giả sách luyện thi - IELTS 8.0", img: "/Hoang.png", quote: "Nắm vững quy luật, bạn sẽ thấy ngữ pháp đẹp như bài thơ." }
            ].map((teacher, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-[3/4]">
                  <img 
                    src={teacher.img} 
                    alt={teacher.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <p className="text-white text-sm italic">"{teacher.quote}"</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-navy mb-1">{teacher.name}</h3>
                <p className="text-beered font-medium text-sm mb-1">{teacher.role}</p>
                <p className="text-gray-500 text-sm">{teacher.exp}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <BeeDecoration className="absolute bottom-0 left-0 opacity-10" size={120} delay={1.5} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-8">Sự khác biệt mang tên BeeLearn</h2>
              <div className="space-y-8">
                {[
                  { title: "Sĩ số vàng", desc: "Tối đa 12 học viên/lớp, đảm bảo giáo viên có thể theo sát và tương tác với từng cá nhân." },
                  { title: "Giáo trình độc quyền", desc: "Biên soạn bởi đội ngũ chuyên gia, cập nhật liên tục theo xu hướng đề thi mới nhất." },
                  { title: "Môi trường 100% Tiếng Anh", desc: "Khuyến khích học viên sử dụng tiếng Anh trong mọi hoạt động tại trung tâm." },
                  { title: "Hỗ trợ học thuật 24/7", desc: "Hệ thống BeeBot AI và đội ngũ trợ giảng luôn sẵn sàng giải đáp thắc mắc ngoài giờ lên lớp." }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-6">
                    <div className="w-12 h-12 bg-beered/10 rounded-xl flex items-center justify-center shrink-0">
                      <CheckCircle2 className="text-beered" size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-navy mb-2">{item.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <img src="/classroom_about.png" alt="Classroom" className="rounded-[2rem] shadow-lg mt-12" />
              <img src="/students_about.png" alt="Students" className="rounded-[2rem] shadow-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-beered text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/about_hero.png')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <BeeDecoration className="absolute top-10 left-10 opacity-20" size={50} delay={0} />
        <BeeDecoration className="absolute bottom-10 right-10 opacity-20" size={70} delay={2} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black mb-8">Sẵn sàng bắt đầu hành trình của bạn?</h2>
          <p className="text-xl mb-12 opacity-90">Đăng ký kiểm tra trình độ miễn phí ngay hôm nay để nhận lộ trình học tập cá nhân hóa từ chuyên gia BeeLearn.</p>
          <button 
            onClick={() => navigateToCourses()}
            className="px-12 py-5 bg-white text-beered font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-xl"
          >
            Đăng ký ngay
          </button>
        </div>
      </section>
    </div>
  );
};
