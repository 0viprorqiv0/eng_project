import React from 'react';
import { motion } from 'framer-motion';

interface Props { onStart: () => void; }

export function PlacementWelcome({ onStart }: Props) {
  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #002143 0%, #13375f 60%, #4b0004 100%)' }}>
      {/* Honeycomb texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/honeycomb.png')" }} />
      {/* Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(169,200,248,0.15) 0%, transparent 70%)' }} />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-8 py-5">
        <span className="text-white font-bold text-xl" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>BeeLearn</span>
        <a href="/" className="flex items-center gap-2 text-white text-sm font-medium px-4 py-2 rounded-full transition-all hover:-translate-y-0.5"
          style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', fontFamily: 'Inter, sans-serif' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 0, 'wght' 300" }}>home</span>
          Trang chủ
        </a>
      </header>

      {/* Main */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="max-w-3xl w-full flex flex-col items-center gap-8">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, color: '#a9c8f8', fontVariationSettings: "'FILL' 1" }}>verified</span>
            Miễn phí • 100% Online
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '-0.02em' }}>
            Khám phá trình độ<br />Tiếng Anh của bạn
          </h1>

          <p className="text-lg max-w-xl" style={{ color: '#b2c9e2', fontFamily: 'Inter, sans-serif' }}>
            Làm bài test 20 câu — Trí tuệ nhân tạo BeeBot sẽ phân tích điểm mạnh, điểm yếu và gợi ý lộ trình học phù hợp nhất.
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
            {[
              { icon: 'edit_note', label: '20 câu hỏi' },
              { icon: 'schedule', label: '~20 phút' },
              { icon: 'psychology', label: 'AI phân tích' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-center gap-3 py-4 px-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: 22, color: '#a9c8f8', fontVariationSettings: "'FILL' 0, 'wght' 300" }}>{item.icon}</span>
                <span className="text-white font-medium text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={onStart}
            className="group relative flex items-center gap-3 px-10 py-4 rounded-full font-bold text-lg text-white overflow-hidden transition-all duration-300 hover:-translate-y-1"
            style={{
              background: '#73000a',
              boxShadow: '0 0 40px rgba(115,0,10,0.5)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-white" />
            <span className="relative">Bắt đầu kiểm tra</span>
            <span className="material-symbols-outlined relative group-hover:translate-x-1 transition-transform" style={{ fontSize: 22 }}>arrow_forward</span>
          </button>
        </motion.div>
      </main>
    </div>
  );
}
