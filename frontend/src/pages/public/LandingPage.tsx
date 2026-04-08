import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  GraduationCap, 
  Trophy, 
  ChevronRight,
  CheckCircle2,
  MessageSquare,
  Bot,
  Award,
  type LucideIcon
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';
import { COURSES_DATA } from '../../data/courses';

export function LandingPage() {
  const navigate = useNavigate();
  const navigateToCourses = (id?: string) => navigate(id ? `/courses?id=${id}` : '/courses');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const features: { icon: LucideIcon; title: string; desc: string }[] = [
    {
      icon: BookOpen,
      title: 'Lộ trình bài bản',
      desc: 'Hệ thống bài giảng được thiết kế chuẩn quốc tế, phù hợp mọi trình độ từ cơ bản đến nâng cao.'
    },
    {
      icon: GraduationCap,
      title: 'Giảng viên chuyên gia',
      desc: 'Đội ngũ giáo viên bản ngữ và Việt Nam giàu kinh nghiệm, sở hữu các chứng chỉ quốc tế uy tín.'
    },
    {
      icon: Trophy,
      title: 'Cam kết đầu ra',
      desc: 'Chúng tôi cam kết kết quả học tập bằng văn bản, hỗ trợ học lại miễn phí nếu không đạt mục tiêu.'
    }
  ];

  return (
    <>
      {/* Hero Section with Submerged Video Background */}
      <section className="relative min-h-150 lg:min-h-200 flex items-center overflow-hidden bg-navy">
        {/* Background Video with Blend Mode */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-girl-studying-with-a-laptop-and-headphones-40430-large.mp4" type="video/mp4" />
          </video>
        </div>
        
        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/90 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-navy via-transparent to-transparent z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* Floating Bees in Hero */}
          <BeeDecoration className="absolute top-20 right-[10%] opacity-40 hidden lg:block" size={48} delay={0} />
          <BeeDecoration className="absolute bottom-40 left-[5%] opacity-30 hidden lg:block" size={32} delay={1} />
          <BeeDecoration className="absolute top-1/2 right-[20%] opacity-20 hidden lg:block" size={40} delay={2} />

          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-block px-4 py-1.5 bg-beered/20 border border-beered/30 rounded-full text-beered text-sm font-bold mb-6 tracking-wider uppercase">
                Học viện ngôn ngữ hàng đầu
              </div>
              <h1 className="text-5xl lg:text-8xl font-extrabold text-white leading-[1.1] mb-8">
                Chinh Phục <br />
                <span className="text-beered">Tiếng Anh</span> <br />
                Cùng BeeLearn
              </h1>
              <p className="text-xl text-gray-300 mb-12 max-w-xl leading-relaxed font-medium">
                Lộ trình học cá nhân hóa, đội ngũ giáo viên tận tâm và môi trường học tập hiện đại giúp bạn tự tin giao tiếp chỉ sau 3 tháng.
              </p>
              <div className="flex flex-wrap gap-6">
                <button className="px-12 py-5 bg-beered text-white font-bold rounded-full hover:scale-105 transition-transform shadow-2xl shadow-beered/40 flex items-center gap-3 text-xl">
                  Khám phá ngay <ChevronRight size={24} />
                </button>
                <button 
                  onClick={() => navigateToCourses()}
                  className="px-12 py-5 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-navy transition-all text-xl backdrop-blur-sm"
                >
                  Xem khóa học
                </button>
              </div>
              <div className="mt-16 flex items-center gap-10">
                <div className="flex -space-x-5">
                  {[1,2,3,4,5].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/student${i}/120/120`} className="w-16 h-16 rounded-full border-4 border-navy shadow-2xl" alt="Student" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <div className="text-white border-l border-white/20 pl-10">
                  <p className="text-3xl font-black text-beered">5000+</p>
                  <p className="text-sm font-bold uppercase tracking-widest opacity-60">Học viên tin tưởng</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute bottom-0 right-0 w-1/3 h-1/2 bg-beered/5 blur-[120px] rounded-full -mr-20 -mb-20"></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative">
            <BeeDecoration className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-60" size={40} />
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Tại sao chọn BeeLearn?</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((item, idx) => (
              <div key={idx} className="p-10 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all group hover:-translate-y-2 bg-white">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-beered group-hover:text-white transition-colors">
                  <item.icon size={36} className="text-beered" />
                </div>
                <h3 className="text-2xl font-bold text-navy mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section - New */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative">
            <BeeDecoration className="absolute -top-8 right-[30%] opacity-40 rotate-12" size={32} />
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Tinh thông ngôn ngữ với bộ chương trình đào tạo chất lượng cao</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {COURSES_DATA.filter(c => ['advanced', 'ielts-mastery', 'business-english'].includes(c.id)).map((course, idx) => (
              <motion.div 
                key={course.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 flex flex-col group relative cursor-pointer"
                onClick={() => navigateToCourses(course.id)}
              >
                <div className={`h-40 ${course.color === 'navy' ? 'bg-navy' : 'bg-beered'} p-8 flex items-center justify-center text-center transition-all duration-500 group-hover:h-24`}>
                  <h3 className="text-lg font-bold text-white uppercase leading-tight">{course.title}</h3>
                </div>
                <div className="p-8 grow flex flex-col">
                  <p className="text-gray-600 mb-6 font-medium italic">{course.desc}</p>
                  
                  <div className="overflow-hidden max-h-0 group-hover:max-h-125 transition-all duration-700 ease-in-out opacity-0 group-hover:opacity-100">
                    <div className="mb-6 pt-4 border-t border-gray-100">
                      <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><Trophy size={18} className="text-beered" /> Đầu ra kỳ vọng:</h4>
                      <p className="text-sm text-gray-600">{course.outcome}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-navy mb-2 flex items-center gap-2"><BookOpen size={18} className="text-beered" /> Cấu trúc chương trình:</h4>
                      <ul className="space-y-2">
                        {course.structure.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle2 size={16} className="text-beered shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-0 mt-auto">
                  <button 
                    onClick={() => navigateToCourses(course.id)}
                    className={`w-full py-4 ${course.color === 'navy' ? 'bg-beered' : 'bg-navy'} text-white font-bold rounded-2xl hover:bg-opacity-90 transition-all shadow-lg`}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section - New */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 relative">
            <BeeDecoration className="absolute top-0 left-[20%] opacity-30 -rotate-12" size={36} />
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Bảng Vàng Thành Tích</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
            <p className="mt-6 text-gray-500 text-lg">Những "chú ong" xuất sắc đã chinh phục mục tiêu cùng BeeLearn</p>
          </div>
          
          <div className="h-150 overflow-hidden relative flex gap-8">
            {/* Row 1: Scrolling Down */}
            <div className="flex-1 relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, -1200] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="flex flex-col gap-6"
              >
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    {[
                      { name: "Nguyễn Minh Anh", score: "8.5 IELTS", school: "ĐH Ngoại Thương", img: "https://picsum.photos/seed/stu1/400/400" },
                      { name: "Trần Đức Nam", score: "29.5 Điểm", school: "ĐH Bách Khoa", img: "https://picsum.photos/seed/stu2/400/400" },
                      { name: "Lê Thu Hà", score: "8.0 IELTS", school: "ĐH Kinh Tế Quốc Dân", img: "https://picsum.photos/seed/stu3/400/400" },
                      { name: "Phạm Hoàng Long", score: "9.8 Tiếng Anh", school: "THPT Chuyên HN-Amsterdam", img: "https://picsum.photos/seed/stu4/400/400" },
                      { name: "Vũ Phương Thảo", score: "8.5 IELTS", school: "ĐH Ngoại Ngữ", img: "https://picsum.photos/seed/stu5/400/400" },
                      { name: "Đặng Tiến Dũng", score: "28.75 Điểm", school: "ĐH Y Hà Nội", img: "https://picsum.photos/seed/stu6/400/400" }
                    ].map((student, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                        <img src={student.img} alt={student.name} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                        <div className="p-6 text-center">
                          <h4 className="font-bold text-navy text-lg">{student.name}</h4>
                          <p className="text-beered font-black text-2xl my-2">{student.score}</p>
                          <p className="text-gray-500 text-sm">{student.school}</p>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            </div>

            {/* Row 2: Scrolling Up */}
            <div className="flex-1 relative overflow-hidden">
              <motion.div 
                animate={{ y: [-1200, 0] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="flex flex-col gap-6"
              >
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    {[
                      { name: "Hoàng Minh Đức", score: "8.0 IELTS", school: "ĐH FPT", img: "https://picsum.photos/seed/stu7/400/400" },
                      { name: "Nguyễn Bảo Ngọc", score: "9.6 Tiếng Anh", school: "THPT Chu Văn An", img: "https://picsum.photos/seed/stu8/400/400" },
                      { name: "Trần Thanh Tâm", score: "8.5 IELTS", school: "ĐH RMIT", img: "https://picsum.photos/seed/stu9/400/400" },
                      { name: "Lê Văn Tùng", score: "29.0 Điểm", school: "ĐH Dược Hà Nội", img: "https://picsum.photos/seed/stu10/400/400" },
                      { name: "Phạm Thùy Chi", score: "8.0 IELTS", school: "ĐH Luật", img: "https://picsum.photos/seed/stu11/400/400" },
                      { name: "Ngô Quốc Anh", score: "9.4 Tiếng Anh", school: "THPT Kim Liên", img: "https://picsum.photos/seed/stu12/400/400" }
                    ].map((student, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 shrink-0">
                        <img src={student.img} alt={student.name} className="w-full h-40 object-cover" referrerPolicy="no-referrer" />
                        <div className="p-6 text-center">
                          <h4 className="font-bold text-navy text-lg">{student.name}</h4>
                          <p className="text-beered font-black text-2xl my-2">{student.score}</p>
                          <p className="text-gray-500 text-sm">{student.school}</p>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - New */}
      <section className="py-24 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-beered/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">Phản hồi từ Học viên & Phụ huynh</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
          </div>
          
          <div className="relative overflow-hidden pb-10">
            <motion.div 
              animate={{ x: [0, -2500] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex gap-8"
            >
              {[...Array(2)].map((_, i) => (
                <React.Fragment key={i}>
                  {[
                    { name: "Chị Mai Lan", role: "Phụ huynh", text: "Tôi rất yên tâm khi cho con theo học tại BeeLearn. Lộ trình học rõ ràng, giáo viên rất sát sao.", img: "parent1" },
                    { name: "Bạn Minh Tú", role: "Học viên IELTS 7.5", text: "Phương pháp học tại đây cực kỳ hiệu quả, đặc biệt là các buổi luyện Speaking 1-1.", img: "student5" },
                    { name: "Anh Hoàng Bách", role: "Phụ huynh", text: "Con tôi từ một đứa trẻ sợ tiếng Anh giờ đã rất tự tin giao tiếp. Cảm ơn BeeLearn.", img: "parent2" },
                    { name: "Chị Thu Thủy", role: "Phụ huynh", text: "Trung tâm có môi trường học tập rất chuyên nghiệp, con tôi tiến bộ vượt bậc.", img: "parent3" },
                    { name: "Bạn Đức Anh", role: "Học viên 9.5 THPT", text: "Tài liệu ôn thi cực kỳ sát thực tế, giúp mình tự tin hơn rất nhiều khi đi thi.", img: "student6" },
                    { name: "Chị Ngọc Diệp", role: "Phụ huynh", text: "Đội ngũ tư vấn nhiệt tình, luôn lắng nghe và hỗ trợ phụ huynh kịp thời.", img: "parent4" },
                    { name: "Bạn Phương Linh", role: "Học viên IELTS 8.0", text: "Môi trường học tập năng động, giúp mình không còn ngại ngùng khi nói tiếng Anh.", img: "student7" },
                    { name: "Anh Minh Quân", role: "Phụ huynh", text: "Chất lượng giảng dạy xứng đáng với chi phí bỏ ra. Rất hài lòng!", img: "parent5" },
                    { name: "Chị Thanh Hương", role: "Phụ huynh", text: "Con mình rất thích đi học ở BeeLearn vì các bài giảng luôn thú vị.", img: "parent6" },
                    { name: "Bạn Tuấn Kiệt", role: "Học viên 28.5 điểm", text: "Cảm ơn các thầy cô đã luôn đồng hành và động viên mình trong giai đoạn nước rút.", img: "student8" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] relative w-100 shrink-0">
                      <div className="text-beered mb-6">
                        <MessageSquare size={32} fill="currentColor" className="opacity-20" />
                      </div>
                      <p className="text-gray-300 italic mb-8 leading-relaxed h-24 overflow-hidden">"{item.text}"</p>
                      <div className="flex items-center gap-4">
                        <img src={`https://picsum.photos/seed/${item.img}/100/100`} alt={item.name} className="w-12 h-12 rounded-full border-2 border-beered" referrerPolicy="no-referrer" />
                        <div>
                          <h4 className="font-bold text-white">{item.name}</h4>
                          <p className="text-beered text-xs font-medium">{item.role}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section - Moved */}
      <section className="py-16 bg-white overflow-hidden border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <h3 className="text-xl font-bold text-navy/60 uppercase tracking-[0.2em]">Được đồng hành bởi những đơn vị giáo dục uy tín hàng đầu Việt Nam</h3>
        </div>
        <div className="relative flex overflow-hidden">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 items-center whitespace-nowrap"
          >
            {[...Array(3)].map((_, i) => (
              <React.Fragment key={i}>
                {[
                  "ĐH Ngoại Thương", 
                  "ĐH Bách Khoa Hà Nội", 
                  "ĐH Kinh Tế Quốc Dân", 
                  "THPT Chuyên Hà Nội - Amsterdam", 
                  "THPT Chu Văn An"
                ].map((partner, idx) => (
                  <div key={idx} className="flex items-center gap-4 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-navy rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      {partner.split(' ').map(w => w[0]).join('')}
                    </div>
                    <span className="text-xl font-bold text-navy">{partner}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <BeeDecoration className="top-20 left-10 opacity-10" size={60} delay={1} />
        <BeeDecoration className="bottom-20 right-10 opacity-10 rotate-45" size={80} delay={2.5} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Được ghi nhận với nhiều giải thưởng trong nước và quốc tế</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { title: "Top 10 Trung tâm Anh ngữ uy tín", year: "2023", org: "Hiệp hội Giáo dục Việt Nam" },
              { title: "Giải thưởng Sáng tạo trong Giảng dạy", year: "2022", org: "Global Education Awards" },
              { title: "Thương hiệu tin cậy vì người tiêu dùng", year: "2023", org: "Tạp chí Kinh tế" },
              { title: "Đối tác Kim cương của IDP & BC", year: "2024", org: "IELTS Australia & British Council" }
            ].map((award, idx) => (
              <div key={idx} className="bg-white p-8 rounded-4xl border border-gray-100 shadow-lg hover:shadow-xl transition-all text-center group">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-beered group-hover:text-white transition-colors">
                  <Award size={32} />
                </div>
                <h4 className="font-bold text-navy mb-2">{award.title}</h4>
                <p className="text-beered font-bold text-sm mb-1">{award.year}</p>
                <p className="text-gray-500 text-xs">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <BeeDecoration className="top-1/4 right-10 opacity-10 -rotate-12" size={70} delay={0.5} />
        <BeeDecoration className="bottom-1/4 left-10 opacity-10 rotate-12" size={50} delay={3} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-8">Hệ sinh thái học tiếng anh cùng BEELEARN</h2>
              <p className="text-gray-600 text-lg mb-10">
                Chúng tôi không chỉ cung cấp các khóa học, mà còn xây dựng một môi trường học tập toàn diện giúp bạn tiếp xúc với tiếng Anh mọi lúc mọi nơi.
              </p>
              <div className="space-y-4">
                {[
                  { 
                    q: "Lộ trình học tại BeeLearn có gì đặc biệt?", 
                    a: "Lộ trình được cá nhân hóa 100% dựa trên bài kiểm tra đầu vào và mục tiêu riêng của từng học viên, kết hợp giữa học trên lớp và luyện tập qua app AI." 
                  },
                  { 
                    q: "Tôi có được hỗ trợ ngoài giờ học không?", 
                    a: "Có, đội ngũ trợ giảng và BeeBot AI luôn sẵn sàng hỗ trợ giải đáp thắc mắc 24/7. Ngoài ra còn có các câu lạc bộ Speaking hàng tuần." 
                  },
                  { 
                    q: "BeeLearn cam kết đầu ra như thế nào?", 
                    a: "Chúng tôi cam kết bằng văn bản. Nếu học viên đi học đầy đủ và làm bài tập đúng hạn nhưng không đạt mục tiêu, trung tâm sẽ hỗ trợ học lại hoàn toàn miễn phí." 
                  },
                  { 
                    q: "Hệ thống học liệu của trung tâm bao gồm những gì?", 
                    a: "Bao gồm giáo trình chuẩn quốc tế, kho video bài giảng độc quyền, hệ thống luyện đề online và ứng dụng di động theo dõi tiến độ." 
                  }
                ].map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                    >
                      <span className="font-bold text-navy">{item.q}</span>
                      <ChevronRight 
                        size={20} 
                        className={`text-beered transition-transform duration-300 ${openFaq === idx ? 'rotate-90' : ''}`} 
                      />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 text-gray-600 border-t border-gray-50 bg-gray-50/30">
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-beered/5 rounded-[3rem] blur-2xl"></div>
              <img 
                src="https://picsum.photos/seed/eco/800/800" 
                alt="Ecosystem" 
                className="relative rounded-[3rem] shadow-2xl z-10"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-8 -right-8 bg-white p-8 rounded-3xl shadow-xl z-20 hidden sm:block border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-beered rounded-full flex items-center justify-center text-white">
                    <Bot size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-navy">BeeBot AI</p>
                    <p className="text-xs text-green-500 font-bold">Online 24/7</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Hỗ trợ học tập tức thì <br /> mọi lúc mọi nơi.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
