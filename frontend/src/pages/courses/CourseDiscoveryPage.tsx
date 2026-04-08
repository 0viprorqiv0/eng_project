import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, 
  Trophy, 
  ChevronRight,
  CheckCircle2,
  Clock,
  Star,
  Users
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';
import { COURSES_DATA } from '../../data/courses';
import { api } from '../../lib/api';

export function CourseDiscoveryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const selectedCourseId = searchParams.get('id');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  
  const [courses, setCourses] = useState<any[]>(COURSES_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedCourseId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedCourseId]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const res = await api.get('/courses');
        
        const mapBackendCourse = (c: any) => ({
          id: c.id.toString(),
          title: c.title,
          subtitle: c.subtitle || c.description?.substring(0, 100) || '',
          category: c.category || 'Tất cả',
          level: c.level || 'Mọi cấp độ',
          duration: c.duration ? `${c.duration} Buổi` : 'Liên hệ',
          price: c.price || 'Miễn phí',
          desc: c.description || '',
          color: c.category === 'IELTS' ? 'navy' : 'beered',
          outcome: c.outcome || 'Đạt mục tiêu đề ra',
          structure: c.structures && c.structures.length > 0 ? c.structures.map((s: any) => s.content) : ['Đang cập nhật lộ trình chi tiết...']
        });

        if (res && res.data) {
          setCourses(res.data.map(mapBackendCourse));
        }
      } catch (err) {
        console.error('Failed to load courses', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = ['Tất cả', 'Lớp 12', 'IELTS', 'Người đi làm'];
  const filteredCourses = activeCategory === 'Tất cả' 
    ? courses 
    : courses.filter(c => c.category === activeCategory);

  return (
    <div className="pt-20">
      {/* Hero Courses */}
      <section className="relative py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/courses/1920/1080')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <BeeDecoration className="absolute top-20 right-20 opacity-30" size={60} delay={0} />
        <BeeDecoration className="absolute bottom-20 left-20 opacity-20" size={40} delay={1.5} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">Chương Trình <span className="text-beered">Đào Tạo</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Từ mất gốc đến chinh phục đỉnh cao ngôn ngữ, BeeLearn có lộ trình phù hợp với mọi mục tiêu của bạn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* General Description */}
      <section className="py-24 bg-white relative">
        <BeeDecoration className="absolute top-1/2 left-10 opacity-10" size={80} delay={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Lộ trình học tập cá nhân hóa</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Mỗi học viên khi đến với BeeLearn đều được làm bài kiểm tra năng lực đầu vào và tư vấn lộ trình học tập riêng biệt. Chúng tôi không dạy đại trà, chúng tôi tập trung vào sự tiến bộ của từng cá nhân.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "01", title: "Đánh giá năng lực", desc: "Bài test 4 kỹ năng chuẩn quốc tế giúp xác định chính xác điểm mạnh, điểm yếu." },
              { step: "02", title: "Xây dựng lộ trình", desc: "Chuyên gia học thuật thiết kế lộ trình tối ưu thời gian và chi phí dựa trên mục tiêu." },
              { step: "03", title: "Học tập & Đánh giá", desc: "Theo dõi tiến độ sát sao qua từng buổi học, điều chỉnh phương pháp kịp thời." }
            ].map((item, idx) => (
              <div key={idx} className="relative p-10 bg-gray-50 rounded-[2.5rem] border border-gray-100 hover:shadow-xl transition-shadow group">
                <div className="absolute -top-6 -left-6 text-8xl font-black text-beered/10 group-hover:text-beered/20 transition-colors">{item.step}</div>
                <h3 className="text-2xl font-bold text-navy mb-4 relative z-10">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses (If a specific course is selected) */}
      {selectedCourseId && (
        <section className="py-24 bg-gray-50 relative overflow-hidden" id="featured-course">
          <BeeDecoration className="absolute top-0 right-0 opacity-10" size={100} delay={0.5} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Khóa học bạn đang quan tâm</h2>
              <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
            </div>
            
            {COURSES_DATA.filter(c => c.id === selectedCourseId).map(course => (
              <div key={course.id} className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
                <div className={`lg:w-1/3 ${course.color === 'navy' ? 'bg-navy' : 'bg-beered'} p-12 flex flex-col justify-center text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="relative z-10">
                    <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full text-sm font-bold mb-6 tracking-wider uppercase backdrop-blur-sm">
                      {course.category}
                    </span>
                    <h3 className="text-3xl font-black mb-4 leading-tight">{course.title}</h3>
                    <p className="text-xl opacity-90 font-medium italic">{course.subtitle}</p>
                    <div className="mt-12 space-y-4">
                      <div className="flex items-center gap-3">
                        <Clock className="text-white/70" size={20} />
                        <span className="font-medium">{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="text-white/70" size={20} />
                        <span className="font-medium">Tối đa 12 học viên</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Star className="text-white/70" size={20} />
                        <span className="font-medium">Cam kết đầu ra: {course.level}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-2/3 p-12 flex flex-col">
                  <p className="text-gray-600 text-lg leading-relaxed mb-8">{course.desc}</p>
                  
                  <div className="mb-8 p-6 bg-red-50 rounded-2xl border border-red-100">
                    <h4 className="font-bold text-navy mb-3 flex items-center gap-2 text-lg"><Trophy size={24} className="text-beered" /> Đầu ra kỳ vọng:</h4>
                    <p className="text-gray-700 font-medium">{course.outcome}</p>
                  </div>
                  
                  <div className="space-y-6 flex-grow">
                    <h4 className="font-bold text-navy mb-4 flex items-center gap-2 text-lg"><BookOpen size={24} className="text-beered" /> Cấu trúc chương trình chi tiết:</h4>
                    <ul className="space-y-4">
                      {course.structure.map((item, i) => (
                        <li key={i} className="flex items-start gap-4 text-gray-600">
                          <div className="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0 mt-1">
                            <span className="font-bold text-navy text-sm">{i+1}</span>
                          </div>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">Học phí ưu đãi</p>
                      <p className="text-3xl font-black text-beered">{course.price}</p>
                    </div>
                    <button 
                      onClick={() => navigate('/register')}
                      className={`px-10 py-4 ${course.color === 'navy' ? 'bg-navy' : 'bg-beered'} text-white font-bold rounded-full hover:scale-105 transition-transform shadow-xl text-lg`}
                    >
                      Đăng ký học thử
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Courses List */}
      <section className="py-24 bg-white relative">
        <BeeDecoration className="absolute top-20 left-10 opacity-10" size={60} delay={1} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Khám phá tất cả khóa học</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-10"></div>
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full font-bold transition-all ${
                    activeCategory === cat 
                      ? 'bg-navy text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => (
                <motion.div 
                  key={course.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 flex flex-col group"
                >
                  <div className={`h-32 ${course.color === 'navy' ? 'bg-navy' : 'bg-beered'} p-6 flex items-center justify-center text-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
                    <h3 className="text-lg font-bold text-white uppercase leading-tight relative z-10">{course.title}</h3>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{course.category}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-beered">{course.level}</span>
                    </div>
                    <p className="text-gray-600 mb-6 font-medium italic line-clamp-3">{course.desc}</p>
                    
                    <div className="space-y-3 mt-auto">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} /> <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users size={16} /> <span>Tối đa 12 học viên</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-8 pt-0 border-t border-gray-100 mt-6 flex items-center justify-between">
                    <span className="font-black text-navy text-xl">{course.price}</span>
                    <button 
                      onClick={() => navigate(`/course-intro/${course.id}`)}
                      className="text-beered font-bold hover:text-navy transition-colors flex items-center gap-1"
                    >
                      Chi tiết <ChevronRight size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Roadmap CTA */}
      <section className="py-24 bg-navy text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/roadmap/1920/1080')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <BeeDecoration className="absolute top-10 right-10 opacity-20" size={50} delay={0} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black mb-8">Chưa biết bắt đầu từ đâu?</h2>
          <p className="text-xl mb-12 opacity-90">Làm bài test năng lực miễn phí ngay để nhận lộ trình học tập được thiết kế riêng cho bạn.</p>
          <button className="px-12 py-5 bg-beered text-white font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-xl">
            Test năng lực ngay
          </button>
        </div>
      </section>
    </div>
  );
};
