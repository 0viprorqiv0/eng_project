import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Trophy, 
  Star, 
  Award, 
  ChevronRight,
  Medal,
  TrendingUp,
  Users
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';

export function AchievementsPage() {
  const navigate = useNavigate();
  const navigateToCourses = () => navigate('/courses');
  return (
    <div className="pt-20">
      {/* Hero Achievements */}
      <section className="relative py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/achievements/1920/1080')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <BeeDecoration className="absolute top-20 right-20 opacity-30" size={60} delay={0} />
        <BeeDecoration className="absolute bottom-20 left-20 opacity-20" size={40} delay={1.5} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">Bảng Vàng <span className="text-beered">Thành Tích</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Tự hào với hơn 5000+ học viên đạt điểm cao trong các kỳ thi quốc gia và quốc tế. Sự thành công của bạn là minh chứng rõ ràng nhất cho chất lượng đào tạo tại BeeLearn.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-16 bg-white relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 grid md:grid-cols-4 gap-8 border border-gray-100">
            {[
              { label: "Học viên", value: "5000+", icon: <Users className="text-beered" size={32} /> },
              { label: "Điểm 9+ THPT", value: "1200+", icon: <TrendingUp className="text-beered" size={32} /> },
              { label: "IELTS 7.0+", value: "850+", icon: <Award className="text-beered" size={32} /> },
              { label: "Thủ khoa/Á khoa", value: "50+", icon: <Medal className="text-beered" size={32} /> }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <h3 className="text-4xl font-black text-navy mb-2">{stat.value}</h3>
                <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Achievers */}
      <section className="py-24 bg-gray-50 relative">
        <BeeDecoration className="absolute top-1/2 left-10 opacity-10" size={80} delay={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Gương mặt Thủ khoa & Á khoa</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-6"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Nguyễn Minh Anh", score: "29.5", subject: "Khối D01", school: "Thủ khoa toàn quốc 2023", img: "stu1" },
              { name: "Trần Đức Nam", score: "8.5", subject: "IELTS Academic", school: "Học bổng 100% RMIT", img: "stu2" },
              { name: "Lê Thu Hà", score: "10.0", subject: "Tiếng Anh THPT", school: "Á khoa khối A1 Hà Nội", img: "stu3" }
            ].map((student, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 group">
                <div className="h-64 overflow-hidden relative">
                  <img src={`https://picsum.photos/seed/${student.img}/600/400`} alt={student.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute top-4 right-4 bg-beered text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
                    <Trophy size={24} />
                  </div>
                </div>
                <div className="p-8 text-center relative">
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
                    <span className="text-2xl font-black text-navy">{student.score}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-navy mt-8 mb-2">{student.name}</h3>
                  <p className="text-beered font-bold mb-4">{student.subject}</p>
                  <p className="text-gray-600 bg-gray-50 py-2 px-4 rounded-full inline-block text-sm font-medium">{student.school}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ranking Table */}
      <section className="py-24 bg-white relative overflow-hidden">
        <BeeDecoration className="absolute top-20 right-10 opacity-10" size={100} delay={0.5} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Top 10 Học viên xuất sắc tháng</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full"></div>
          </div>
          
          <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="p-6 font-bold uppercase tracking-wider text-sm">Hạng</th>
                    <th className="p-6 font-bold uppercase tracking-wider text-sm">Học viên</th>
                    <th className="p-6 font-bold uppercase tracking-wider text-sm">Khóa học</th>
                    <th className="p-6 font-bold uppercase tracking-wider text-sm text-right">Điểm số</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, name: "Phạm Hoàng Long", course: "Chuyên sâu 12", score: "9.8" },
                    { rank: 2, name: "Vũ Phương Thảo", course: "IELTS Master", score: "8.0" },
                    { rank: 3, name: "Đặng Tiến Dũng", course: "Luyện đề cấp tốc", score: "9.6" },
                    { rank: 4, name: "Hoàng Minh Đức", course: "Tổng ôn ngữ pháp", score: "9.4" },
                    { rank: 5, name: "Nguyễn Bảo Ngọc", course: "Chuyên sâu 12", score: "9.2" },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-50 hover:bg-red-50/50 transition-colors">
                      <td className="p-6">
                        {row.rank <= 3 ? (
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${row.rank === 1 ? 'bg-yellow-400' : row.rank === 2 ? 'bg-gray-400' : 'bg-amber-600'}`}>
                            {row.rank}
                          </div>
                        ) : (
                          <span className="font-bold text-gray-400 ml-3">{row.rank}</span>
                        )}
                      </td>
                      <td className="p-6 font-bold text-navy">{row.name}</td>
                      <td className="p-6 text-gray-500">{row.course}</td>
                      <td className="p-6 text-right font-black text-beered text-xl">{row.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-gray-50 text-center border-t border-gray-100">
              <button className="text-navy font-bold hover:text-beered transition-colors flex items-center gap-2 mx-auto">
                Xem toàn bộ bảng xếp hạng <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-24 bg-gray-50 relative">
        <BeeDecoration className="absolute bottom-20 left-10 opacity-10" size={60} delay={1.5} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-navy mb-6">Câu chuyện truyền cảm hứng</h2>
            <div className="w-24 h-2 bg-beered mx-auto rounded-full mb-6"></div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative">
              <div className="absolute top-10 right-10 text-6xl text-gray-100 font-serif">"</div>
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <img src="https://picsum.photos/seed/story1/150/150" alt="Student" className="w-24 h-24 rounded-full border-4 border-beered object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="text-2xl font-bold text-navy">Nguyễn Tuấn Anh</h3>
                  <p className="text-beered font-medium">Từ mất gốc đến 8.5 Tiếng Anh THPT</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic relative z-10">
                "Năm lớp 11, điểm phẩy tiếng Anh của em chỉ lẹt đẹt 4-5 điểm. Em rất sợ môn này và nghĩ mình không có năng khiếu. Nhưng khi đến với BeeLearn, thầy cô đã kiên nhẫn giảng lại từ những kiến thức cơ bản nhất. Phương pháp học qua sơ đồ tư duy giúp em nhớ lâu hơn. Kết quả thi THPT Quốc gia đạt 8.5 là một điều em chưa từng dám mơ tới."
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100 relative">
              <div className="absolute top-10 right-10 text-6xl text-gray-100 font-serif">"</div>
              <div className="flex items-center gap-6 mb-8 relative z-10">
                <img src="https://picsum.photos/seed/story2/150/150" alt="Student" className="w-24 h-24 rounded-full border-4 border-beered object-cover" referrerPolicy="no-referrer" />
                <div>
                  <h3 className="text-2xl font-bold text-navy">Trần Mai Phương</h3>
                  <p className="text-beered font-medium">Chinh phục IELTS 7.5 trong 6 tháng</p>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed italic relative z-10">
                "Mục tiêu của em là đi du học nên cần chứng chỉ IELTS gấp. Khóa học IELTS Intensive tại BeeLearn thực sự là cứu cánh. Lịch học dày đặc nhưng không hề nhàm chán. Các buổi luyện Speaking 1-1 với giáo viên bản ngữ giúp em cải thiện sự tự tin và phản xạ rất nhiều. Cảm ơn BeeLearn đã giúp em chạm tay vào ước mơ du học."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-beered text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/cta2/1920/1080')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <BeeDecoration className="absolute top-10 left-10 opacity-20" size={50} delay={0} />
        <BeeDecoration className="absolute bottom-10 right-10 opacity-20" size={70} delay={2} />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-4xl lg:text-6xl font-black mb-8">Bạn sẽ là người tiếp theo ghi danh vào Bảng Vàng?</h2>
          <p className="text-xl mb-12 opacity-90">Hãy để BeeLearn đồng hành cùng bạn trên con đường chinh phục những đỉnh cao mới.</p>
          <button 
            onClick={() => navigateToCourses()}
            className="px-12 py-5 bg-white text-beered font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-xl"
          >
            Bắt đầu ngay hôm nay
          </button>
        </div>
      </section>
    </div>
  );
};


