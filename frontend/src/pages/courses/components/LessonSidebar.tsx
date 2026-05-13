import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Search, ArrowRight, Plus, CheckCircle2,
  PlayCircle, FileText, Upload, ChevronDown, ChevronRight, Lock
} from 'lucide-react';
import { useAuth } from '../../../components/AuthContext';

type LessonType = 'video' | 'document' | 'quiz' | 'assignment';

interface LessonSidebarProps {
  courseId: string;
  modules: any[];
  selectedModule: any;
  onSelectModule: (module: any) => void;
  onMarkComplete?: (moduleId: number) => void;
  progressPercentage: number;
  userEnrolled?: boolean;
}

const getModuleIcon = (type: LessonType) => {
  switch (type) {
    case 'video': return PlayCircle;
    case 'document': return FileText;
    case 'quiz': return CheckCircle2;
    case 'assignment': return Upload;
    default: return PlayCircle;
  }
};

export function LessonSidebar({
  courseId,
  modules,
  selectedModule,
  onSelectModule,
  onMarkComplete,
  progressPercentage,
  userEnrolled
}: LessonSidebarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Local state for sidebar only, doesn't re-render parent CourseDetailPage!
  const [lessonSearch, setLessonSearch] = useState('');
  const [lessonTypeFilter, setLessonTypeFilter] = useState<string>('all');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({});

  const toggleChapter = (chapter: string) => {
    setExpandedChapters(prev => ({ ...prev, [chapter]: !prev[chapter] }));
  };

  // Group modules by contiguous chapters
  let currentChap = 'Chung';
  const groupedModules = modules.reduce((acc, m) => {
    const isSupplemental = m.title?.toLowerCase().includes('tài liệu bổ trợ');
    
    // Hide supplemental materials from the sidebar
    if (isSupplemental) return acc;

    let displayTitle = m.title;
    
    // Establishing a new chapter
    if (m.title.includes(' - ')) {
      const parts = m.title.split(' - ');
      currentChap = parts[0].trim();
      displayTitle = parts.slice(1).join(' - ').trim();
    }
    
    if (!acc[currentChap]) acc[currentChap] = [];
    acc[currentChap].push({ ...m, displayTitle });
    
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <aside className="w-full lg:w-80 lg:bottom-0 left-0 lg:top-[60px] bg-slate-50 dark:bg-slate-900 flex flex-col gap-2 px-4 py-6 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 lg:h-[calc(100vh-60px)] lg:fixed overflow-y-auto shrink-0 z-40">
      <div className="mb-6 px-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-[#13375f] rounded-xl flex items-center justify-center">
            <BookOpen className="text-white w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-[#13375F] dark:text-white font-headline">Lộ trình học</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium italic">{modules.filter(m => m.completed && !m.title?.toLowerCase().includes('tài liệu bổ trợ')).length}/{modules.filter(m => !m.title?.toLowerCase().includes('tài liệu bổ trợ')).length} bài đã xong</p>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="space-y-1 z-10 flex-grow">
        <div className="px-2 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">Nội dung khóa học</div>
        {/* Search input */}
        <div className="px-2 mb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={lessonSearch}
              onChange={e => setLessonSearch(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full pl-8 pr-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#13375F]/30 transition-all"
            />
          </div>
        </div>
        {/* Type filter */}
        <div className="flex gap-1 px-2 mb-3">
          {[{key:'all',label:'Tất cả'},{key:'video',label:'Video'},{key:'quiz',label:'Quiz'},{key:'document',label:'Tài liệu'},{key:'assignment',label:'Bài tập'}].map(f => (
            <button key={f.key} onClick={() => setLessonTypeFilter(f.key)}
              className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all ${lessonTypeFilter === f.key ? 'bg-[#13375F] text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-300'}`}>
              {f.label}
            </button>
          ))}
        </div>
        {Object.entries(groupedModules).map(([chapter, chapterModules]) => {
          // Check if any modules in this chapter match filters
          const filteredChapterModules = chapterModules.filter(m => {
            const matchSearch = !lessonSearch || m.displayTitle.toLowerCase().includes(lessonSearch.toLowerCase()) || chapter.toLowerCase().includes(lessonSearch.toLowerCase());
            const matchType = lessonTypeFilter === 'all' || m.lesson_type === lessonTypeFilter;
            return matchSearch && matchType;
          });

          if (filteredChapterModules.length === 0) return null;

          // By default, if there is a search or filter, expand everything matching. Otherwise use state. Default to true if not set.
          const isExpanded = (lessonSearch || lessonTypeFilter !== 'all') ? true : (expandedChapters[chapter] !== false);

          return (
            <div key={chapter} className="mb-2">
              <button 
                onClick={() => toggleChapter(chapter)}
                className="w-full flex items-center justify-between px-2 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors group"
              >
                <span className="flex-1 text-left truncate pr-2">{chapter}</span>
                {isExpanded ? <ChevronDown className="w-4 h-4 shrink-0 text-slate-400" /> : <ChevronRight className="w-4 h-4 shrink-0 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />}
              </button>

              {isExpanded && (
                <div className="mt-1 space-y-1 pl-2 border-l-2 border-slate-200 dark:border-slate-800 ml-3">
                  {filteredChapterModules.map((m) => {
                    const isLocked = !userEnrolled && !m.is_free_preview;
                    const Icon = isLocked ? Lock : getModuleIcon(m.lesson_type);
                    const isSelected = selectedModule?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => onSelectModule(m)}
                        className={`flex items-center gap-3 font-body rounded-xl p-3 cursor-pointer group transition-all ${isLocked ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0' : ''} ${isSelected ? 'bg-white dark:bg-slate-800/80 text-[#13375F] dark:text-white shadow-sm border-l-4 border-[#13375F] dark:border-blue-400 ml-[-2px]' : 'text-slate-600 dark:text-slate-300 hover:translate-x-1 hover:bg-slate-100 dark:hover:bg-slate-800/50'}`}
                      >
                        <Icon className={`${isSelected ? 'text-[#13375F] dark:text-blue-400' : 'group-hover:text-[#13375F] dark:group-hover:text-blue-400'} w-5 h-5 shrink-0 transition-colors`} />
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm line-clamp-2 ${isSelected ? 'font-bold' : ''}`} title={m.displayTitle}>{m.displayTitle}</span>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500">{m.lesson_type === 'video' ? 'Video' : m.lesson_type === 'document' ? 'Tài liệu' : m.lesson_type === 'quiz' ? 'Quiz' : 'Bài tập'}</p>
                        </div>
                        {isLocked ? (
                          <Lock className="w-4 h-4 text-slate-400" />
                        ) : m.completed ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMarkComplete?.(m.id); }}
                            title="Hoàn tác hoàn thành"
                            className="ml-auto shrink-0 hover:opacity-60 transition-opacity"
                          >
                            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400 w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={(e) => { e.stopPropagation(); onMarkComplete?.(m.id); }}
                            title="Đánh dấu hoàn thành"
                            className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 ml-auto shrink-0 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Teacher/Admin: Add Lecture Button */}
      {(user?.role === 'teacher' || user?.role === 'admin') && (
        <div className="px-2 mt-4">
          <button
            onClick={() => navigate(`/dashboard/create-lecture?course=${courseId}`)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-[#E24843] to-[#e65540] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:brightness-110 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Thêm bài giảng
          </button>
        </div>
      )}

      <div className="mt-8 lg:mt-auto pt-6 border-t border-slate-200 z-10 shrink-0">
        <button onClick={() => navigate(-1)} className="w-full bg-[#13375F] text-white py-3 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4 rotate-180" /> Quay lại
        </button>
      </div>
    </aside>
  );
}
