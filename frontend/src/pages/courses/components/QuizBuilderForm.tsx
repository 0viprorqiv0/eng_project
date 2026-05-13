import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  HelpCircle, Plus, Trash2, PenLine, Check, X, Paperclip,
} from 'lucide-react';

/* ─── Quiz question types ─── */
export interface QuizOption { id: string; text: string; isCorrect: boolean; }
export interface QuizQuestion {
  id: string; type: 'multiple_choice' | 'essay';
  text: string; options: QuizOption[];
  prompt?: string; attachmentHint?: string;
}

interface QuizBuilderFormProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

export function QuizBuilderForm({ questions, onChange }: QuizBuilderFormProps) {

  const addQuestion = useCallback((type: 'multiple_choice' | 'essay') => {
    onChange([...questions, {
      id: Date.now().toString(), type, text: '',
      options: type === 'multiple_choice' ? [
        { id: 'a', text: '', isCorrect: true },
        { id: 'b', text: '', isCorrect: false },
        { id: 'c', text: '', isCorrect: false },
      ] : [],
      prompt: type === 'essay' ? '' : undefined,
    }]);
  }, [questions, onChange]);

  const removeQuestion = useCallback((qId: string) => {
    onChange(questions.filter(q => q.id !== qId));
  }, [questions, onChange]);

  const updateQuestion = useCallback((qId: string, updates: Partial<QuizQuestion>) => {
    onChange(questions.map(q => q.id === qId ? { ...q, ...updates } : q));
  }, [questions, onChange]);

  const addOption = useCallback((qId: string) => {
    onChange(questions.map(q => q.id === qId ? {
      ...q, options: [...q.options, { id: Date.now().toString(), text: '', isCorrect: false }]
    } : q));
  }, [questions, onChange]);

  const removeOption = useCallback((qId: string, oId: string) => {
    onChange(questions.map(q => q.id === qId ? {
      ...q, options: q.options.filter(o => o.id !== oId)
    } : q));
  }, [questions, onChange]);

  const toggleCorrect = useCallback((qId: string, oId: string) => {
    onChange(questions.map(q => q.id === qId ? {
      ...q, options: q.options.map(o => ({ ...o, isCorrect: o.id === oId }))
    } : q));
  }, [questions, onChange]);

  const updateOptionText = useCallback((qId: string, oId: string, text: string) => {
    onChange(questions.map(q => q.id === qId ? {
      ...q, options: q.options.map(o => o.id === oId ? { ...o, text } : o)
    } : q));
  }, [questions, onChange]);

  return (
    <motion.div key="quiz-builder" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#002143] rounded-xl flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-headline text-lg font-extrabold text-[#002143]">Soạn câu hỏi</h3>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => addQuestion('multiple_choice')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#002143] text-white text-xs font-bold rounded-xl hover:bg-[#1e3a5f] active:scale-95 transition-all">
            <Plus className="w-4 h-4" /> Trắc nghiệm
          </button>
          <button type="button" onClick={() => addQuestion('essay')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#e65540] text-white text-xs font-bold rounded-xl hover:bg-[#d94432] active:scale-95 transition-all">
            <PenLine className="w-4 h-4" /> Tự luận
          </button>
        </div>
      </div>

      {/* Question cards */}
      {questions.map((q, idx) => (
        <motion.div key={q.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-black/5 relative">
          {/* Question header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 bg-[#002143] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-extrabold">{String(idx + 1).padStart(2, '0')}</span>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
              q.type === 'multiple_choice' ? 'bg-[#cee5ff] text-[#002143]' : 'bg-[#fef2f0] text-[#e65540]'
            }`}>
              {q.type === 'multiple_choice' ? 'TRẮC NGHIỆM' : 'TỰ LUẬN / WRITING'}
            </span>
            <div className="flex-1" />
            {questions.length > 1 && (
              <button onClick={() => removeQuestion(q.id)}
                className="p-1.5 text-[#c8cad0] hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {q.type === 'multiple_choice' ? (
            <>
              {/* Question text */}
              <textarea value={q.text} onChange={e => updateQuestion(q.id, { text: e.target.value })}
                placeholder="Nhập câu hỏi trắc nghiệm..."
                rows={2}
                className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium placeholder-[#73777f] focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none border border-transparent mb-4" />
              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map(opt => (
                  <div key={opt.id} className="flex items-center gap-3 group">
                    <button type="button" onClick={() => toggleCorrect(q.id, opt.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                        opt.isCorrect ? 'border-green-500 bg-green-500' : 'border-[#d4d6db] hover:border-[#73777f]'
                      }`}>
                      {opt.isCorrect && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <input type="text" value={opt.text} onChange={e => updateOptionText(q.id, opt.id, e.target.value)}
                      placeholder="Nhập lựa chọn..."
                      className="flex-1 px-3 py-2.5 bg-[#f4f3f7] rounded-lg text-sm text-[#002143] font-medium placeholder-[#73777f] focus:outline-none focus:ring-1 focus:ring-[#002143]/15 focus:bg-white border border-transparent transition-all" />
                    {opt.isCorrect && (
                      <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase whitespace-nowrap">Đáp án đúng</span>
                    )}
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(q.id, opt.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#c8cad0] hover:text-red-500 transition-all">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addOption(q.id)}
                className="mt-3 flex items-center gap-2 text-xs font-bold text-[#002143] hover:text-[#e65540] transition-colors">
                <Plus className="w-3.5 h-3.5" /> Thêm lựa chọn
              </button>
            </>
          ) : (
            /* Essay question */
            <>
              <div className="mb-3">
                <label className="block text-[10px] font-bold text-[#73777f] mb-2 uppercase tracking-wider">PROMPT ĐỀ BÀI</label>
                <textarea value={q.prompt || ''} onChange={e => updateQuestion(q.id, { prompt: e.target.value })}
                  placeholder="In some countries, young people are encouraged to work or travel for a year between finishing high school and starting university. Discuss the advantages and disadvantages."
                  rows={4}
                  className="w-full px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#002143] font-medium placeholder-[#73777f] focus:outline-none focus:ring-2 focus:ring-[#002143]/15 focus:bg-white transition-all resize-none border border-transparent" />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-[#f4f3f7] rounded-xl text-sm text-[#73777f]">
                <Paperclip className="w-4 h-4 shrink-0" />
                <span>Đính kèm tài liệu tham khảo hoặc hình ảnh (Không bắt buộc)</span>
              </div>
            </>
          )}
        </motion.div>
      ))}

      {/* Quiz summary card */}
      <div className="bg-[#f4f3f7] rounded-2xl p-5">
        <p className="text-[10px] font-bold text-[#73777f] uppercase tracking-wider mb-3">TỔNG QUAN BÀI THI</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between"><span className="text-[#73777f]">Số câu hỏi</span><span className="font-bold text-[#002143]">{questions.length} câu</span></div>
          <div className="flex justify-between"><span className="text-[#73777f]">Trắc nghiệm</span><span className="font-bold text-[#002143]">{questions.filter(q => q.type === 'multiple_choice').length}</span></div>
          <div className="flex justify-between"><span className="text-[#73777f]">Tự luận</span><span className="font-bold text-[#002143]">{questions.filter(q => q.type === 'essay').length}</span></div>
          <div className="flex justify-between"><span className="text-[#73777f]">Tổng điểm</span><span className="font-bold text-[#002143]">100 điểm</span></div>
        </div>
      </div>
    </motion.div>
  );
}
