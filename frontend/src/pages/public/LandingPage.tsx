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
      <section className="relative pt-6 pb-3 lg:pt-10 lg:pb-5 flex items-center overflow-hidden bg-navy">
        {/* Deep Navy Background */}
        <div className="absolute inset-0 bg-navy z-0"></div>
        
        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-navy via-navy/90 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-linear-to-t from-navy via-transparent to-transparent z-10"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          {/* Floating Bees in Hero */}
          <BeeDecoration className="absolute top-[15%] left-[6%] opacity-40" size={36} delay={0.5} />
          <BeeDecoration className="absolute top-[25%] right-[2%] opacity-40" size={48} delay={0} />
          <BeeDecoration className="absolute bottom-[15%] left-[12%] opacity-30" size={40} delay={1.5} />
          <BeeDecoration className="absolute top-[45%] right-[8%] opacity-25 hidden md:block" size={44} delay={2.2} />
          <BeeDecoration className="absolute bottom-[25%] right-[45%] opacity-20 hidden md:block" size={32} delay={3.5} />
          <BeeDecoration className="absolute top-[35%] left-[40%] opacity-15 hidden lg:block" size={40} delay={1} />

          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              <div className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-beered text-xs font-bold mb-8 tracking-[0.2em] uppercase">
                Học viện ngôn ngữ hàng đầu
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-[4.5rem] font-extrabold text-white leading-[1.15] mb-8 tracking-tight">
                Chinh <br />
                Phục <br />
                <span className="text-beered">Tiếng Anh</span> <br />
                Cùng <br />
                BeeLearn
              </h1>
              <p className="text-sm lg:text-base text-gray-300 mb-10 max-w-sm leading-relaxed font-medium">
                Lộ trình học cá nhân hóa, đội ngũ giáo viên tận tâm và môi trường học tập hiện đại giúp bạn tự tin giao tiếp chỉ sau 3 tháng.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mt-12 lg:mt-0 flex flex-col items-center lg:items-end w-full"
            >
              <div className="relative w-full max-w-2xl">
                <div className="absolute -inset-6 bg-beered/20 rounded-[3rem] blur-3xl"></div>
                <div className="relative rounded-[2rem] overflow-hidden border-2 border-white/10 shadow-2xl aspect-video bg-navy group">
                  <video 
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster="/study.png"
                  >
                    <source src="/Video Project.mp4" type="video/mp4" />
                    Trình duyệt không hỗ trợ video.
                  </video>
                  <div className="absolute inset-0 bg-beered/10 pointer-events-none group-hover:bg-transparent transition-colors"></div>
                </div>
              </div>
              
              <div className="w-full max-w-2xl flex justify-center lg:justify-end mt-12 lg:pr-4">
                <div className="flex flex-col items-center gap-8 w-max">
                  {/* Avatars and Stats */}
                  <div className="flex items-center gap-6">
                    <div className="flex -space-x-4">
                      {[
                        "https://images.pexels.com/photos/35131346/pexels-photo-35131346.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
                        "https://images.pexels.com/photos/12717733/pexels-photo-12717733.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
                        "https://images.pexels.com/photos/3616939/pexels-photo-3616939.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
                        "https://images.pexels.com/photos/5319510/pexels-photo-5319510.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop",
                        "https://images.pexels.com/photos/2770972/pexels-photo-2770972.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&fit=crop"
                      ].map((img, i) => (
                        <img key={i} src={img} className="w-12 h-12 rounded-full border-[3px] border-navy shadow-lg object-cover" alt="Student" referrerPolicy="no-referrer" />
                      ))}
                    </div>
                    <div className="h-10 w-[1px] bg-white/20"></div>
                    <div className="text-left text-white">
                      <p className="text-xl font-black text-beered leading-none mb-1">5000+</p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-60">Học viên tin tưởng</p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-4">
                    <div className="relative group">
                      <BeeDecoration className="absolute -top-4 -left-4 z-20 group-hover:scale-125 group-hover:-translate-y-2 group-hover:-rotate-12 transition-all duration-300 drop-shadow-lg pointer-events-none" size={28} delay={0.2} />
                      <button className="px-8 py-3.5 bg-beered text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl shadow-beered/30 flex items-center gap-2 text-sm">
                        Khám phá ngay <ChevronRight size={18} />
                      </button>
                    </div>
                    <div className="relative group">
                      <BeeDecoration className="absolute -bottom-4 -right-4 z-20 opacity-80 group-hover:-translate-y-1 group-hover:rotate-12 transition-all duration-300 drop-shadow-md pointer-events-none" size={24} delay={1.5} />
                      <button 
                        onClick={() => navigateToCourses()}
                        className="px-8 py-3.5 border border-white/30 text-white font-bold rounded-full hover:bg-white hover:text-navy transition-all text-sm backdrop-blur-sm"
                      >
                        Xem khóa học
                      </button>
                    </div>
                  </div>
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
                      { name: "Nguyễn Minh Anh", score: "8.5 IELTS", school: "ĐH Ngoại Thương", img: "https://images.pexels.com/photos/3616939/pexels-photo-3616939.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Trần Đức Nam", score: "29.5 Điểm", school: "ĐH Bách Khoa", img: "https://images.pexels.com/photos/12717733/pexels-photo-12717733.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Lê Thu Hà", score: "8.0 IELTS", school: "ĐH Kinh Tế Quốc Dân", img: "https://images.pexels.com/photos/2770972/pexels-photo-2770972.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Phạm Hoàng Long", score: "9.8 Tiếng Anh", school: "THPT Chuyên HN-Amsterdam", img: "https://images.pexels.com/photos/5319510/pexels-photo-5319510.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Vũ Phương Thảo", score: "8.5 IELTS", school: "ĐH Ngoại Ngữ", img: "https://images.pexels.com/photos/7667086/pexels-photo-7667086.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Đặng Tiến Dũng", score: "28.75 Điểm", school: "ĐH Y Hà Nội", img: "https://images.pexels.com/photos/9602115/pexels-photo-9602115.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" }
                    ].map((student, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 shrink-0 group">
                        <img
                          src={student.img}
                          alt={student.name}
                          className="w-full h-40 object-cover bg-gray-100 transition-all duration-700 ease-out group-hover:h-100 group-hover:object-contain"
                          referrerPolicy="no-referrer"
                        />
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
                      { name: "Hoàng Minh Đức", score: "8.0 IELTS", school: "ĐH FPT", img: "https://images.pexels.com/photos/7417185/pexels-photo-7417185.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Nguyễn Bảo Ngọc", score: "9.6 Tiếng Anh", school: "THPT Chu Văn An", img: "https://images.pexels.com/photos/33758137/pexels-photo-33758137.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Trần Thanh Tâm", score: "8.5 IELTS", school: "ĐH RMIT", img: "https://images.pexels.com/photos/27059202/pexels-photo-27059202.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Lê Văn Tùng", score: "29.0 Điểm", school: "ĐH Dược Hà Nội", img: "https://images.pexels.com/photos/6754845/pexels-photo-6754845.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Phạm Thùy Chi", score: "7.0 IELTS", school: "THCS Nghĩa Tân", img: "https://images.pexels.com/photos/35108649/pexels-photo-35108649.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" },
                      { name: "Nguyễn Kim Anh", score: "9.4 Tiếng Anh", school: "THPT Kim Liên", img: "https://images.pexels.com/photos/7121557/pexels-photo-7121557.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop" }
                    ].map((student, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-3xl overflow-hidden shadow-lg border border-gray-100 shrink-0 group">
                        <img
                          src={student.img}
                          alt={student.name}
                          className="w-full h-40 object-cover bg-gray-100 transition-all duration-700 ease-out group-hover:h-100 group-hover:object-contain"
                          referrerPolicy="no-referrer"
                        />
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
                    { name: "Chị Mai Lan", role: "Phụ huynh", text: "Tôi rất yên tâm khi cho con theo học tại BeeLearn. Lộ trình học rõ ràng, giáo viên rất sát sao.", img: "https://images.pexels.com/photos/35341074/pexels-photo-35341074.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Bạn Minh Tú", role: "Học viên IELTS 7.5", text: "Phương pháp học tại đây cực kỳ hiệu quả, đặc biệt là các buổi luyện Speaking 1-1.", img: "https://images.pexels.com/photos/31981457/pexels-photo-31981457.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Anh Hoàng Bách", role: "Phụ huynh", text: "Con tôi từ một đứa trẻ sợ tiếng Anh giờ đã rất tự tin giao tiếp. Cảm ơn BeeLearn.", img: "https://images.pexels.com/photos/2955792/pexels-photo-2955792.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Chị Thu Thủy", role: "Phụ huynh", text: "Trung tâm có môi trường học tập rất chuyên nghiệp, con tôi tiến bộ vượt bậc.", img: "https://images.pexels.com/photos/35108638/pexels-photo-35108638.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Bạn Đức Anh", role: "Học viên 9.5 THPT", text: "Tài liệu ôn thi cực kỳ sát thực tế, giúp mình tự tin hơn rất nhiều khi đi thi.", img: "https://images.pexels.com/photos/36507127/pexels-photo-36507127.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Chị Ngọc Diệp", role: "Phụ huynh", text: "Đội ngũ tư vấn nhiệt tình, luôn lắng nghe và hỗ trợ phụ huynh kịp thời.", img: "https://images.pexels.com/photos/35108631/pexels-photo-35108631.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Bạn Phương Linh", role: "Học viên IELTS 8.0", text: "Môi trường học tập năng động, giúp mình không còn ngại ngùng khi nói tiếng Anh.", img: "https://images.pexels.com/photos/35131346/pexels-photo-35131346.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Anh Minh Quân", role: "Phụ huynh", text: "Chất lượng giảng dạy xứng đáng với chi phí bỏ ra. Rất hài lòng!", img: "https://images.pexels.com/photos/29585803/pexels-photo-29585803.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Chị Thanh Hương", role: "Phụ huynh", text: "Con mình rất thích đi học ở BeeLearn vì các bài giảng luôn thú vị.", img: "https://images.pexels.com/photos/35108646/pexels-photo-35108646.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" },
                    { name: "Bạn Tuấn Kiệt", role: "Học viên 28.5 điểm", text: "Cảm ơn các thầy cô đã luôn đồng hành và động viên mình trong giai đoạn nước rút.", img: "https://images.pexels.com/photos/33970125/pexels-photo-33970125.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop" }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-[2.5rem] relative w-100 shrink-0">
                      <div className="text-beered mb-6">
                        <MessageSquare size={32} fill="currentColor" className="opacity-20" />
                      </div>
                      <p className="text-gray-300 italic mb-8 leading-relaxed h-24 overflow-hidden">"{item.text}"</p>
                      <div className="flex items-center gap-4">
                        <img src={item.img} alt={item.name} className="w-12 h-12 rounded-full border-2 border-beered object-cover" referrerPolicy="no-referrer" />
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
                  { name: "ĐH Ngoại Thương", logo: "/ftu.png.png" },
                  { name: "ĐH Bách Khoa Hà Nội", logo: "/Logo_Đại_học_Bách_Khoa_Hà_Nội.png" },
                  { name: "ĐH Kinh Tế Quốc Dân", logo: "/logo-neu-inkythuatso-01-09-10-41-01.jpg" },
                  { name: "THPT Chuyên Hà Nội - Amsterdam", logo: "/Logo_THPT_Chuyên_Hà_Nội_-_Amsterdam.svg.png" },
                  { name: "THPT Chu Văn An", logo: "/logo-truong-thpt-chu-van-an.jpg" }
                ].map((partner, idx) => (
                  <div key={idx} className="flex items-center gap-4 transition-transform duration-300 hover:-translate-y-0.5 cursor-pointer">
                    <div className="w-14 h-14 bg-white rounded-xl border border-gray-100 shadow-sm p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={partner.logo}
                        alt={partner.name}
                        className="w-full h-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-xl font-bold text-navy">{partner.name}</span>
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
                src="/hesinhthaihoctienganh.png" 
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
