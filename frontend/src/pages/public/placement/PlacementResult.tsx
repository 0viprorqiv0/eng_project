import React from 'react';
import { motion } from 'framer-motion';

interface AiResult { analysis: string; strengths: string[]; weaknesses: string[]; suggestedCourse: string | null; advice: string; }
interface Props {
  result: any; loading: boolean;
  onRetry: () => void;
}

function ScoreRing({ pct }: { pct: number }) {
  const r = 45, circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="relative w-44 h-44 flex items-center justify-center">
      <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle cx="50" cy="50" r={r} fill="none" stroke="#ffb3ac" strokeWidth="8"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div className="flex flex-col items-center">
        <span className="text-5xl font-black text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.03em' }}>{pct}%</span>
        <span className="text-xs font-medium mt-1" style={{ color: '#82a1cf' }}>{Math.round(pct / 5)}/20 Câu đúng</span>
      </div>
    </div>
  );
}

function RadarChart({ cats }: { cats: Record<string, number> }) {
  const g = (cats?.grammar || 0) / 8;
  const v = (cats?.vocabulary || 0) / 6;
  const r = (cats?.reading || 0) / 6;
  // Triangle points: top=Reading, bottom-right=Grammar, bottom-left=Vocab
  const cx = 50, cy = 50, size = 40;
  const topX = cx, topY = cy - size;
  const brX = cx + size * 0.866, brY = cy + size * 0.5;
  const blX = cx - size * 0.866, blY = cy + size * 0.5;
  // Data points
  const dTopX = cx, dTopY = cy - size * r;
  const dBrX = cx + size * 0.866 * g, dBrY = cy + size * 0.5 * g;
  const dBlX = cx - size * 0.866 * v, dBlY = cy + size * 0.5 * v;

  return (
    <div className="relative w-full" style={{ maxWidth: 240, aspectRatio: '1' }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {/* Grid */}
        {[1, 0.67, 0.33].map((s, i) => (
          <polygon key={i} fill="none" stroke="#e8e8ec" strokeWidth="0.8"
            points={`${cx},${cy - size * s} ${cx + size * 0.866 * s},${cy + size * 0.5 * s} ${cx - size * 0.866 * s},${cy + size * 0.5 * s}`} />
        ))}
        {/* Axes */}
        {[[cx, cy, topX, topY], [cx, cy, brX, brY], [cx, cy, blX, blY]].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c3c6cf" strokeWidth="0.8" strokeDasharray="2 2" />
        ))}
        {/* Data */}
        <polygon fill="rgba(75,0,4,0.2)" stroke="#4b0004" strokeWidth="2" strokeLinejoin="round"
          points={`${dTopX},${dTopY} ${dBrX},${dBrY} ${dBlX},${dBlY}`} />
        {[[dTopX, dTopY], [dBrX, dBrY], [dBlX, dBlY]].map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r="3" fill="#4b0004" />
        ))}
      </svg>
      {/* Labels */}
      <span className="absolute text-xs font-bold whitespace-nowrap" style={{ top: -20, left: '50%', transform: 'translateX(-50%)', color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Reading ({Math.round(r * 100)}%)
      </span>
      <span className="absolute text-xs font-bold whitespace-nowrap" style={{ bottom: -20, right: -20, color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Grammar ({Math.round(g * 100)}%)
      </span>
      <span className="absolute text-xs font-bold whitespace-nowrap" style={{ bottom: -20, left: -20, color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Vocabulary ({Math.round(v * 100)}%)
      </span>
    </div>
  );
}

const LEVEL_LABEL: Record<string, string> = {
  'Beginner': 'Beginner', 'Elementary': 'Elementary',
  'Intermediate': 'Intermediate', 'Upper-Intermediate': 'Upper-Intermediate', 'Advanced': 'Advanced',
};

export function PlacementResult({ result, loading, onRetry }: Props) {
  const pct = result?.percentage || 0;
  const score = result?.score || 0;
  const total = result?.total || 20;
  const level = result?.levelResult || (pct <= 30 ? 'Beginner' : pct <= 50 ? 'Elementary' : pct <= 70 ? 'Intermediate' : pct <= 85 ? 'Upper-Intermediate' : 'Advanced');
  const ai: AiResult | null = result?.ai || null;
  const cats = result?.categories;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen" style={{ background: '#faf9fd', fontFamily: 'Inter, sans-serif' }}>
      {/* Navy top half */}
      <div className="relative" style={{ background: 'linear-gradient(135deg, #002143 0%, #13375f 100%)', paddingTop: 48, paddingBottom: 64 }}>
        {/* Close button */}
        <div className="max-w-5xl mx-auto px-6 flex justify-start mb-6">
          <button onClick={onRetry} className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>close</span>
          </button>
        </div>

        <div className="flex flex-col items-center text-center px-6 gap-6">
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.01em' }}>
            Kết Quả Bài Kiểm Tra
          </h1>
          <ScoreRing pct={pct} />
          <div className="px-6 py-2 rounded-full" style={{ background: 'rgba(178,201,226,0.2)', border: '1px solid rgba(178,201,226,0.3)' }}>
            <span className="font-bold text-lg" style={{ color: '#cee5ff', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{level}</span>
          </div>
          <p className="text-sm" style={{ color: '#82a1cf' }}>{score}/{total} câu đúng</p>
        </div>
      </div>

      {/* Light content */}
      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col gap-10">
        {/* AI + Radar row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* AI Card */}
          <div className="md:col-span-7 bg-white rounded-3xl p-8 relative overflow-hidden flex flex-col gap-5"
            style={{ boxShadow: '0 16px 32px rgba(0,33,67,0.06)', border: '1px solid rgba(195,198,207,0.15)' }}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full" style={{ background: 'rgba(0,33,67,0.05)', filter: 'blur(24px)' }} />
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid #e8e8ec' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ background: '#13375f' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
              </div>
              <h2 className="text-xl font-bold" style={{ color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>🐝 BeeBot AI nhận xét</h2>
            </div>

            {loading ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center animate-spin" style={{ background: '#f4f3f7' }}>🐝</div>
                <p style={{ color: '#43474e' }}>BeeBot đang phân tích kết quả của bạn...</p>
              </div>
            ) : ai ? (
              <>
                <p className="text-base leading-relaxed" style={{ color: '#43474e' }}>{ai.analysis}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl p-5" style={{ background: '#f4f3f7' }}>
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-sm" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1", color: '#002143' }}>check_circle</span>
                      Điểm mạnh
                    </h3>
                    <ul className="space-y-1.5">
                      {ai.strengths?.map((s, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: '#43474e' }}>
                          <span style={{ color: '#002143' }}>•</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: '#f4f3f7' }}>
                    <h3 className="font-bold mb-3 flex items-center gap-2 text-sm" style={{ color: '#4b0004', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1", color: '#4b0004' }}>error</span>
                      Cần cải thiện
                    </h3>
                    <ul className="space-y-1.5">
                      {ai.weaknesses?.map((w, i) => (
                        <li key={i} className="flex gap-2 text-sm" style={{ color: '#43474e' }}>
                          <span style={{ color: '#4b0004' }}>•</span>{w}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                {ai.advice && (
                  <p className="text-sm px-4 py-3 rounded-xl" style={{ background: '#f4f3f7', color: '#43474e' }}>💡 {ai.advice}</p>
                )}
              </>
            ) : (
              <div className="py-4">
                <p style={{ color: '#43474e' }}>Kết quả của bạn đã được lưu. Hãy xem thêm tại dashboard.</p>
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="md:col-span-5 bg-white rounded-3xl p-8 flex flex-col items-center justify-center"
            style={{ boxShadow: '0 4px 16px rgba(0,33,67,0.04)', border: '1px solid rgba(195,198,207,0.15)' }}>
            <h3 className="font-bold text-center mb-8 w-full" style={{ color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Phân tích kỹ năng</h3>
            {cats ? <RadarChart cats={cats} /> : (
              <div className="text-center py-8" style={{ color: '#73777f' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 48 }}>bar_chart</span>
                <p className="mt-2 text-sm">Đang tải dữ liệu...</p>
              </div>
            )}
          </div>
        </div>

        {/* Category breakdown */}
        {cats && (
          <div className="grid grid-cols-3 gap-4">
            {[['grammar', 'Ngữ pháp', '📝', 8], ['vocabulary', 'Từ vựng', '📚', 6], ['reading', 'Đọc hiểu', '📖', 6]].map(([k, l, e, max]) => (
              <div key={String(k)} className="bg-white rounded-2xl p-5 text-center" style={{ boxShadow: '0 2px 8px rgba(0,33,67,0.04)' }}>
                <div className="text-2xl mb-2">{e}</div>
                <div className="text-xs mb-1" style={{ color: '#73777f' }}>{l}</div>
                <div className="text-2xl font-bold" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {cats[String(k)] || 0}/{max}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course recommendation */}
        {ai?.suggestedCourse && (
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#1a1c1f', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              📚 Khóa học đề xuất cho bạn
            </h2>
            <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8"
              style={{ background: '#002143', boxShadow: '0 16px 32px rgba(0,33,67,0.1)' }}>
              <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 bg-cover bg-center pointer-events-none"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80')" }} />
              <div className="flex flex-col items-start z-10 w-full md:w-2/3">
                <span className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#ffdad6' }}>Được thiết kế riêng</span>
                <h3 className="text-2xl font-extrabold text-white mb-3 uppercase" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {ai.suggestedCourse}
                </h3>
                {ai.advice && <p className="text-sm mb-6 max-w-lg" style={{ color: '#a9c8f8' }}>{ai.advice}</p>}
                <a href="/courses"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-colors"
                  style={{ background: '#73000a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Đăng ký ngay
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <a href="/courses" className="flex-1 py-3.5 rounded-xl font-bold text-center text-white transition-all hover:brightness-110"
            style={{ background: '#C8493B', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Xem tất cả khóa học →
          </a>
          <button onClick={onRetry}
            className="flex-1 py-3.5 rounded-xl font-bold text-center transition-all"
            style={{ background: '#fff', color: '#43474e', border: '1px solid #c3c6cf', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Làm lại bài test
          </button>
        </div>
      </div>
    </motion.div>
  );
}
