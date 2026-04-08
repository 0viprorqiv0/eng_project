import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Download, 
  FileText, 
  Video, 
  Headphones, 
  BookOpen
} from 'lucide-react';
import { BeeDecoration } from '../../components/BeeDecoration';

export function LibraryPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tất cả', 'Tài liệu PDF', 'Video bài giảng', 'Audio luyện nghe', 'Đề thi thử'];
  
  const libraryItems = [
    { id: 1, title: "Bộ 50 đề thi thử THPT Quốc Gia 2024", type: "Tài liệu PDF", icon: <FileText />, size: "15MB", downloads: 1250 },
    { id: 2, title: "Tổng hợp ngữ pháp Tiếng Anh cơ bản", type: "Tài liệu PDF", icon: <FileText />, size: "5MB", downloads: 3400 },
    { id: 3, title: "Video chữa đề minh họa BGD 2024", type: "Video bài giảng", icon: <Video />, size: "250MB", downloads: 890 },
    { id: 4, title: "100 bài nghe IELTS Listening Part 1", type: "Audio luyện nghe", icon: <Headphones />, size: "120MB", downloads: 2100 },
    { id: 5, title: "Từ vựng chuyên ngành Kinh tế", type: "Tài liệu PDF", icon: <FileText />, size: "3MB", downloads: 560 },
    { id: 6, title: "Đề thi thử IELTS Reading Academic", type: "Đề thi thử", icon: <BookOpen />, size: "8MB", downloads: 1500 },
    { id: 7, title: "Video hướng dẫn phát âm chuẩn Anh-Mỹ", type: "Video bài giảng", icon: <Video />, size: "180MB", downloads: 3200 },
    { id: 8, title: "Audio luyện nghe TOEIC Part 3, 4", type: "Audio luyện nghe", icon: <Headphones />, size: "90MB", downloads: 1800 },
  ];

  const filteredItems = libraryItems.filter(item => {
    const matchesCategory = activeCategory === 'Tất cả' || item.type === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20">
      {/* Hero Library */}
      <section className="relative py-32 bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/library/1920/1080')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <BeeDecoration className="absolute top-20 right-20 opacity-30" size={60} delay={0} />
        <BeeDecoration className="absolute bottom-20 left-20 opacity-20" size={40} delay={1.5} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6">Thư Viện <span className="text-beered">Tài Liệu</span></h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-10">
              Kho tàng tri thức khổng lồ với hàng ngàn tài liệu học tập, đề thi thử và video bài giảng được cập nhật liên tục.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Tìm kiếm tài liệu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-4 rounded-full text-navy font-medium focus:outline-none focus:ring-2 focus:ring-beered shadow-xl"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Library Content */}
      <section className="py-24 bg-gray-50 relative min-h-[600px]">
        <BeeDecoration className="absolute top-1/2 left-10 opacity-10" size={80} delay={2} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${
                  activeCategory === cat 
                    ? 'bg-beered text-white shadow-lg' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-beered mb-4 group-hover:bg-beered group-hover:text-white transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-navy mb-2 line-clamp-2 flex-grow">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="bg-gray-100 px-2 py-1 rounded-md">{item.type}</span>
                    <span>{item.size}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                    <span className="text-xs text-gray-400">{item.downloads} lượt tải</span>
                    <button className="text-navy hover:text-beered transition-colors flex items-center gap-1 font-bold text-sm">
                      Tải xuống <Download size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                Không tìm thấy tài liệu phù hợp với từ khóa "{searchQuery}".
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
