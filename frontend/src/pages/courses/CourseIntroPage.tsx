import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { BeeDecoration } from '../../components/BeeDecoration';
import { 
  ShieldCheck, Clock, Users, Play, CheckCircle2, BookOpen, 
  Gauge, Brain, Award, Medal, Heart, GraduationCap, 
  PlayCircle, Lock, ChevronDown, ChevronRight 
} from 'lucide-react';

export function CourseIntroPage() {
  const { id } = useParams();
  const [openStep, setOpenStep] = useState<number>(0);
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  const itemAnim = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourse(res);
      } catch (err) {
        console.error("Failed to load course details", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) fetchCourse();
  }, [id]);

  if (isLoading) return <div className="pt-32 text-center text-xl font-bold min-h-screen">Đang tải thông tin khóa học...</div>;
  if (!course) return <div className="pt-32 text-center text-xl font-bold min-h-screen">Không tìm thấy khóa học.</div>;

  const IconMap: any = {
    BookOpen: BookOpen,
    Gauge: Gauge,
    Brain: Brain,
    Award: Award,
    Clock: Clock,
    Users: Users,
    ShieldCheck: ShieldCheck,
    Medal: Medal,
    Heart: Heart,
    GraduationCap: GraduationCap
  };

  return (
    <div className="bg-background text-on-surface font-body w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 py-16 md:py-24 overflow-hidden">
        {/* Flying Bees */}
        <BeeDecoration size={60} className="top-[10%] left-[5%]" delay={0.5} />
        <BeeDecoration size={40} className="bottom-[15%] left-[20%]" delay={2.5} />
        <BeeDecoration size={50} className="top-[25%] right-[8%]" delay={1.5} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7 space-y-8 relative z-10"
          >
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-wide uppercase">
              {course.category || 'Khóa học'}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-primary font-headline leading-[1.1] tracking-tight">
              {course.title}
            </h1>
            <p className="text-xl text-on-surface-variant font-medium max-w-xl leading-relaxed">
              {course.subtitle || course.description || 'Lộ trình tinh gọn dành riêng cho học sinh chinh phục mục tiêu cá nhân.'}
            </p>
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center space-x-3">
                <ShieldCheck className="text-[#E24843] w-6 h-6" />
                <span className="font-semibold text-primary">Cam kết đầu ra: {course.level || 'Chuẩn xác'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="text-[#E24843] w-6 h-6" />
                <span className="font-semibold text-primary">{course.duration ? course.duration + ' Buổi học trực tiếp' : 'Thời gian linh hoạt'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-[#E24843] w-6 h-6" />
                <span className="font-semibold text-primary">Hỗ trợ 24/7</span>
              </div>
            </div>
          </motion.div>

          {/* Price & Registration Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ perspective: 1200 }}
            className="lg:col-span-5 lg:sticky lg:top-32 relative z-20"
          >
            <motion.div 
              whileHover={{ scale: 1.02, rotateX: 3, rotateY: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              style={{ transformStyle: "preserve-3d" }}
              className="bg-surface-container-lowest rounded-2xl p-8 shadow-[0_32px_64px_-16px_rgba(0,33,67,0.08)] border border-outline-variant/10"
            >
              <div className="relative rounded-xl overflow-hidden mb-6 aspect-video group">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  alt="Sinh viên đang học tập trung" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1qP14458DD8mSHZO0OZKQJ8W8dWl6y3AnI6cTLE1TYlqKGx2EXKugJOhc67Ge8BHx8fsNP5tev6EEM7u5OThMLdlwGgrYYCgpgvp2TbqzWMptoGXIBjuNv3Oq5Me4e_IZPpRQ7dXjnqcPRMs5jxCQPDjn8aupdUy1s_4iPtMZwcx6PEvS74KzNUM6osUtDZTejriwCaE0Fa40PiqWqZ-ZS2kZu8GBVeYY5vi7rylgWp14IdJEYxzq-hzW9PrGSqT9_Xi5q2uPurYX"
                />
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center cursor-pointer transition-colors group-hover:bg-primary/30">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-xl group-hover:scale-110 transition-transform">
                    <Play size={32} className="fill-current ml-1" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-baseline space-x-3">
                  <span className="text-4xl font-extrabold font-headline text-primary">{course.price ? course.price : 'Miễn phí'}</span>
                  {course.price && <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded text-xs font-bold ml-2">Hot</span>}
                </div>
                
                <div className="space-y-4">
                  <Link 
                    to="/register"
                    className="w-full py-4 bg-primary text-white font-bold text-lg rounded-xl hover:bg-[#DF312B] transition-colors shadow-lg shadow-primary/10 active:scale-95 text-center block"
                  >
                    Đăng ký ngay
                  </Link>
                  <Link 
                    to={`/course/${id || 'c1'}`}
                    className="w-full py-4 border-2 border-primary/10 text-primary font-bold text-lg rounded-xl hover:bg-surface-container-low transition-all text-center block"
                  >
                    Học thử miễn phí
                  </Link>
                </div>
                
                <ul className="space-y-3 pt-4 border-t border-outline-variant/20">
                  <li className="flex items-center space-x-3 text-sm text-on-surface-variant">
                    <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0" />
                    <span>Truy cập kho tài liệu vĩnh viễn</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-on-surface-variant">
                    <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0" />
                    <span>Tặng kèm 5 bộ đề thi thử sát thực tế</span>
                  </li>
                  <li className="flex items-center space-x-3 text-sm text-on-surface-variant">
                    <CheckCircle2 className="text-green-600 w-5 h-5 shrink-0" />
                    <span>Sửa bài writing 1-1 với giảng viên</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 z-0 w-1/3 h-full bg-gradient-to-l from-secondary-container/20 to-transparent blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 z-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
      </section>

      {/* Giá trị nhận được Section */}
      <section className="px-4 sm:px-8 py-20 bg-surface-container-low relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-primary font-headline tracking-tight">Giá trị bạn nhận được</h2>
            <p className="text-on-surface-variant max-w-2xl mx-auto">Khóa học được thiết kế để tối ưu hóa thời gian và hiệu quả học tập cho học sinh cuối cấp.</p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(course.features || []).map((feature: any, idx: number) => {
              const IconComp = IconMap[feature.icon] || BookOpen;
              return (
                <motion.div key={idx} variants={itemAnim} className="bg-surface-container-lowest p-8 rounded-2xl hover:scale-[1.03] transition-transform duration-300 shadow-sm border border-black/5 group">
                  <div className="w-14 h-14 bg-primary-fixed rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-[#E24843] group-hover:text-white transition-colors">
                    <IconComp className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold font-headline text-primary mb-3">{feature.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              );
            })}
            {(!course.features || course.features.length === 0) && [1,2,3,4].map(idx => (
              <motion.div key={idx} variants={itemAnim} className="bg-surface-container-lowest p-8 rounded-2xl opacity-50 border border-dashed animate-pulse h-48"></motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Giảng viên Section */}
      <section className="px-4 sm:px-8 py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-primary-container relative z-10 shadow-2xl">
                <img 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                  alt={`Chân dung giảng viên ${course.teacher?.name}`} 
                  src={course.teacher?.avatar_url || "/lan-anh.png"}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-[#E24843] rounded-2xl z-0"></div>
              
              {/* Badges floating */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-6 z-20 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-gray-100"
              >
                <div className="w-10 h-10 bg-secondary-container rounded-full flex items-center justify-center text-primary">
                  <Medal className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary font-headline">10+ Năm</div>
                  <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Kinh nghiệm</div>
                </div>
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 -right-10 z-20 bg-white p-4 rounded-xl shadow-xl flex items-center space-x-3 border border-gray-100"
              >
                <div className="w-10 h-10 bg-[#ffdad6] rounded-full flex items-center justify-center text-[#910612]">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-bold text-primary font-headline">5.000+</div>
                  <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Học viên tin tưởng</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-primary text-4xl font-extrabold font-headline tracking-tight">Người dẫn dắt bạn</h2>
                <p className="text-[#E24843] font-bold text-xl font-headline">{course.teacher?.name || 'Đội ngũ giáo viên BeeLearn'}</p>
              </div>
              <p className="text-on-surface-variant text-lg leading-relaxed">
                {course.teacher?.bio || 'Với nhiều năm kinh nghiệm giảng dạy, chúng tôi cam kết mang lại chất lượng và sự truyền cảm hứng tốt nhất cho mỗi học viên.'}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {course.teacher?.qualifications && course.teacher.qualifications.length > 0 ? (
                  course.teacher.qualifications.map((q: any, idx: number) => (
                    <div key={idx} className="flex items-start space-x-4 p-5 rounded-xl bg-surface-container-low border border-black/5 hover:bg-surface-container transition-colors">
                      {idx === 0 ? (
                        <GraduationCap className="text-primary w-6 h-6 mt-0.5 shrink-0" />
                      ) : (
                        <Award className="text-primary w-6 h-6 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <p className="font-bold text-primary">{q.title}</p>
                        <p className="text-sm text-on-surface-variant mt-1">{q.subtitle}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-start space-x-4 p-5 rounded-xl bg-surface-container-low border border-black/5 hover:bg-surface-container transition-colors">
                      <GraduationCap className="text-primary w-6 h-6 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-primary">Thạc sĩ Giảng dạy Tiếng Anh (TESOL)</p>
                        <p className="text-sm text-on-surface-variant mt-1">Đại học Queensland, Úc</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 p-5 rounded-xl bg-surface-container-low border border-black/5 hover:bg-surface-container transition-colors">
                      <Award className="text-primary w-6 h-6 mt-0.5 shrink-0" />
                      <div>
                        <p className="font-bold text-primary">Cựu giáo viên chuyên Anh</p>
                        <p className="text-sm text-on-surface-variant mt-1">Đã đào tạo hàng trăm học viên đạt 8.0+ IELTS</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lộ trình học Section (Accordion) */}
      <section className="px-4 sm:px-8 py-20 bg-surface-container-lowest border-y border-black/5 relative z-10">
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="text-center mb-16">
            <h2 className="text-3xl font-extrabold font-headline text-primary mb-4">Lộ trình học chi tiết</h2>
            <p className="text-on-surface-variant">Chiến lược học tập được thiết kế tối ưu theo từng giai đoạn</p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="space-y-2">
            
            {course.structures && course.structures.length > 0 ? course.structures.map((struct: any, index: number) => (
              <div key={struct.id || index} className="border border-outline-variant/30 bg-surface rounded-2xl overflow-hidden transition-all duration-300 hover:border-outline-variant/60 shadow-sm">
                <button 
                  onClick={() => setOpenStep(openStep === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left group"
                >
                  <div className="flex items-center space-x-4 sm:space-x-6">
                    <div className={`w-12 h-12 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${openStep === index ? 'border-[#E24843] text-[#E24843]' : 'border-primary text-primary'}`}>
                      <PlayCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Giai đoạn {index + 1}</span>
                      <h3 className="text-lg sm:text-xl font-bold font-headline text-primary">Nội dung chiến lược</h3>
                    </div>
                  </div>
                  <ChevronDown className={`text-primary transition-transform duration-300 ${openStep === index ? "rotate-180" : ""}`} />
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${openStep === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}
                >
                  <div className="px-6 pb-6 pt-0 sm:pl-[88px] text-on-surface-variant leading-relaxed font-semibold text-lg">
                    {struct.content}
                  </div>
                </div>
              </div>
            )) : (
              <div className="border border-outline-variant/30 bg-surface rounded-2xl overflow-hidden opacity-80 p-8 text-center text-on-surface-variant font-medium">
                Đang cập nhật lộ trình học tập...
              </div>
            )}

          </motion.div>
        </div>
      </section>

      {/* Cảm hứng thành công Section */}
      <section className="px-4 sm:px-8 py-24 bg-primary text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div variants={fadeInUp} initial="initial" whileInView="whileInView" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold font-headline mb-4">Cảm hứng thành công</h2>
            <p className="text-primary-fixed opacity-90 text-lg">Kết quả thực tế từ những học viên đã tham gia khóa học</p>
          </motion.div>
          
          <motion.div variants={staggerContainer} initial="initial" whileInView="whileInView" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(course.testimonials || []).map((t: any, idx: number) => (
              <motion.div key={idx} variants={itemAnim} className="bg-primary-container p-8 rounded-2xl relative shadow-xl border border-white/5 hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-14 h-14 shrink-0 rounded-full overflow-hidden border-2 border-[#E24843] bg-surface-container">
                    <img 
                      className="w-full h-full object-cover" 
                      alt={t.name} 
                      src={`https://i.pravatar.cc/150?u=${t.name}`}
                    />
                  </div>
                  <div>
                    <h4 className="font-bold font-headline text-lg">{t.name}</h4>
                    <p className="text-xs text-on-primary-container font-medium">{t.role}</p>
                  </div>
                </div>
                <p className="text-sm italic opacity-90 leading-relaxed mb-8">
                  "{t.text}"
                </p>
                <div className="flex gap-2">
                  <span className="bg-tertiary-container text-[#ffdad6] px-3 py-1.5 rounded-full text-xs font-bold leading-none">{t.stats}</span>
                </div>
              </motion.div>
            ))}
            {(!course.testimonials || course.testimonials.length === 0) && [1,2,3].map(idx => (
              <motion.div key={idx} className="bg-primary-container/20 p-8 rounded-2xl h-64 border border-dashed border-white/10 flex items-center justify-center italic text-white/40">
                Đang thu thập đánh giá...
              </motion.div>
            ))}
          </motion.div>
        </div>
        
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E24843]/10 rounded-full blur-[120px] pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
      </section>
      
    </div>
  );
}
