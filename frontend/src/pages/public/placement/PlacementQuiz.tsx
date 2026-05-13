import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { PlacementTestSet, PlacementQuestion } from '../../../data/placementQuestions';

interface Props {
  testSet: PlacementTestSet;
  currentQ: number; setCurrentQ: (i: number) => void;
  answers: (number | null)[];
  selectAnswer: (i: number) => void;
  onFinish: () => void;
}

const CAT_LABEL: Record<string, string> = { grammar: 'Ngữ pháp', vocabulary: 'Từ vựng', reading: 'Đọc hiểu' };
const CAT_COLOR: Record<string, string> = { grammar: '#dbeafe #1d4ed8', vocabulary: '#ede9fe #6d28d9', reading: '#dcfce7 #15803d' };
const LETTERS = ['A', 'B', 'C', 'D'];

export function PlacementQuiz({ testSet, currentQ, setCurrentQ, answers, selectAnswer, onFinish }: Props) {
  const q: PlacementQuestion = testSet.questions[currentQ];
  const total = testSet.questions.length;
  const answered = answers.filter(a => a !== null).length;
  const [bg, text] = (CAT_COLOR[q.category] || '#f3f4f6 #374151').split(' ');

  // Timer logic
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinish();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, onFinish]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f4f3f7', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-30 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
            className="text-gray-400 hover:text-[#002143] transition-colors disabled:opacity-30">
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_back</span>
          </button>
          
          <div className="flex-1">
            <div className="flex justify-between items-end text-sm mb-1.5">
              <div className="flex items-center gap-3">
                <span className="font-bold" style={{ color: '#002143' }}>Tiến độ</span>
                <span className="text-[10px] uppercase tracking-widest font-black opacity-30">|</span>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: timeLeft < 60 ? '#fee2e2' : '#f4f3f7' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: timeLeft < 60 ? '#ef4444' : '#002143', fontVariationSettings: "'FILL' 1" }}>timer</span>
                  <span className="font-mono font-bold" style={{ color: timeLeft < 60 ? '#ef4444' : '#002143' }}>{formatTime(timeLeft)}</span>
                </div>
              </div>
              <span style={{ color: '#43474e' }} className="font-medium">{answered}/{total} câu trả lời</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: '#e8e8ec' }}>
              <motion.div 
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQ + 1) / total) * 100}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ background: 'linear-gradient(90deg, #002143, #C8493B)' }} 
              />
            </div>
          </div>
          <span className="text-sm font-bold shrink-0" style={{ color: '#43474e' }}>Câu {currentQ + 1}/{total}</span>
        </div>
      </header>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center py-10 px-6">
        <motion.div 
          key={currentQ}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-black/5">
            {/* Q header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm text-white"
                style={{ background: '#002143' }}>
                {String(currentQ + 1).padStart(2, '0')}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: bg, color: text }}>
                {CAT_LABEL[q.category]}
              </span>
              <span className="text-xs font-medium px-2 py-0.5 rounded"
                style={{ background: q.difficulty === 'easy' ? '#dcfce7' : q.difficulty === 'medium' ? '#fef9c3' : '#fee2e2', color: q.difficulty === 'easy' ? '#15803d' : q.difficulty === 'medium' ? '#854d0e' : '#b91c1c' }}>
                {q.difficulty}
              </span>
            </div>

            {/* Context for reading */}
            {q.context && (
              <div className="mb-5 p-4 rounded-xl text-sm leading-relaxed italic"
                style={{ background: '#f4f3f7', color: '#43474e', borderLeft: '3px solid #002143' }}>
                {q.context}
              </div>
            )}

            <h3 className="text-lg font-bold mb-6 leading-relaxed" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {q.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => selectAnswer(i)}
                  className="text-left p-4 rounded-2xl border-2 flex items-center gap-3 transition-all font-medium group"
                  style={{
                    borderColor: answers[currentQ] === i ? '#13375f' : '#e8e8ec',
                    background: answers[currentQ] === i ? 'rgba(19,55,95,0.05)' : '#fff',
                  }}>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors"
                    style={{ background: answers[currentQ] === i ? '#13375f' : '#f4f3f7', color: answers[currentQ] === i ? '#fff' : '#43474e' }}>
                    {LETTERS[i]}
                  </span>
                  <span className="text-sm" style={{ color: '#1a1c1f' }}>{opt}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-6 flex items-center justify-between">
            <button onClick={() => setCurrentQ(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
              className="px-5 py-2.5 rounded-xl text-sm font-medium border transition-all disabled:opacity-30"
              style={{ borderColor: '#c3c6cf', color: '#43474e' }}>
              ← Trước
            </button>

            {/* Dots */}
            <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
              {testSet.questions.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrentQ(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === currentQ ? 12 : 8, height: i === currentQ ? 12 : 8,
                    background: i === currentQ ? '#002143' : answers[i] !== null ? '#C8493B' : '#c3c6cf',
                  }} />
              ))}
            </div>

            {currentQ < total - 1 ? (
              <button onClick={() => setCurrentQ(currentQ + 1)}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: '#C8493B' }}>
                Tiếp →
              </button>
            ) : (
              <button onClick={onFinish}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: '#002143', boxShadow: '0 4px 12px rgba(0,33,67,0.3)' }}>
                ✓ Nộp bài
              </button>
            )}
          </div>

          {/* Skip */}
          <div className="mt-3 text-center">
            <button onClick={() => setCurrentQ(Math.min(total - 1, currentQ + 1))}
              className="text-xs hover:underline" style={{ color: '#73777f' }}>
              Bỏ qua câu này
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
