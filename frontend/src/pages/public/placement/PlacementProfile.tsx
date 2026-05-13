import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Profile {
  type: 'student_11_12' | 'ielts' | 'working';
  currentLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  goal: string;
}
interface Contact { name: string; email: string; consent: boolean; }
interface Props {
  profile: Profile; setProfile: (p: Profile) => void;
  contact: Contact; setContact: (c: Contact) => void;
  onNext: () => void; onBack: () => void;
}

const PROFILES = [
  { value: 'student_11_12', icon: 'school', label: 'Học sinh Lớp 11–12', desc: 'Chuẩn bị cho kỳ thi Đại học và chứng chỉ quốc tế.' },
  { value: 'ielts', icon: 'menu_book', label: 'Luyện thi IELTS', desc: 'Tập trung nâng cao kỹ năng cho kỳ thi IELTS.' },
  { value: 'working', icon: 'work', label: 'Người đi làm', desc: 'Nâng cao tiếng Anh phục vụ cho công việc và giao tiếp.' },
];
const LEVELS = [
  { value: 'beginner', label: 'Mất gốc' },
  { value: 'elementary', label: 'Cơ bản' },
  { value: 'intermediate', label: 'Trung bình' },
  { value: 'advanced', label: 'Khá/Giỏi' },
];

export function PlacementProfile({ profile, setProfile, contact, setContact, onNext, onBack }: Props) {
  const canSubmit = contact.name.trim() && contact.email.includes('@') && contact.consent;
  const goalPlaceholder =
    profile.type === 'ielts' ? 'VD: IELTS 6.5 để du học' :
    profile.type === 'working' ? 'VD: Giao tiếp tự tin trong cuộc họp' :
    'VD: IELTS 6.5, Giao tiếp cơ bản...';

  return (
    <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
      className="min-h-screen py-16 px-6" style={{ background: '#faf9fd', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold mb-3" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Thông tin Thí sinh &amp; Mục tiêu học tập
          </h1>
          <p style={{ color: '#43474e' }}>Vui lòng cung cấp thông tin để chúng tôi có thể thiết kế lộ trình học tập phù hợp nhất với bạn.</p>
        </div>

        <div className="space-y-12">
          {/* Section 1: Who are you */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-bold mb-6" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#a9c8f8', color: '#001c39' }}>1</span>
              Bạn là ai?
            </h2>
            <div className="grid grid-cols-3 gap-5 items-stretch">
              {PROFILES.map((p) => (
                <label key={p.value} className="cursor-pointer group" onClick={() => setProfile({ ...profile, type: p.value as any })}>
                  <div className={`border-2 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 relative h-full ${profile.type === p.value ? 'border-[#002143]' : 'border-transparent bg-white shadow-sm hover:bg-gray-50'}`}>
                    {profile.type === p.value && (
                      <span className="material-symbols-outlined absolute top-3 right-3 text-[#002143]" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    )}
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                      style={{ background: p.value === 'ielts' ? '#b2c9e2' : p.value === 'working' ? '#e3e2e6' : '#a9c8f8' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#002143' }}>{p.icon}</span>
                    </div>
                    <h3 className="font-bold text-sm mb-1" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{p.label}</h3>
                    <p className="text-xs" style={{ color: '#43474e' }}>{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Section 2: Level */}
          <section className="rounded-xl p-8 relative overflow-hidden" style={{ background: '#f4f3f7' }}>
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-50" style={{ background: '#d4e3ff', filter: 'blur(32px)' }} />
            <h2 className="flex items-center gap-3 text-xl font-bold mb-6 relative" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#d4e3ff', color: '#001c39' }}>2</span>
              Trình độ hiện tại của bạn?
            </h2>
            <div className="flex flex-wrap gap-3 relative">
              {LEVELS.map((l) => (
                <button key={l.value} onClick={() => setProfile({ ...profile, currentLevel: l.value as any })}
                  className="px-6 py-3 rounded-full font-medium text-sm transition-all duration-200"
                  style={{
                    background: profile.currentLevel === l.value ? '#13375f' : '#fff',
                    color: profile.currentLevel === l.value ? '#fff' : '#1a1c1f',
                    border: `1px solid ${profile.currentLevel === l.value ? '#13375f' : '#c3c6cf'}`,
                    fontFamily: 'Inter, sans-serif',
                  }}>
                  {l.label}
                </button>
              ))}
            </div>
          </section>

          {/* Section 3: Goal + Contact */}
          <section>
            <h2 className="flex items-center gap-3 text-xl font-bold mb-6" style={{ color: '#002143', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#d4e3ff', color: '#001c39' }}>3</span>
              Mục tiêu &amp; Thông tin liên hệ
            </h2>
            <div className="bg-white rounded-xl p-8 space-y-5 relative">
              <div className="absolute inset-0 border-2 border-transparent rounded-xl pointer-events-none transition-all" />
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1a1c1f' }}>Mục tiêu điểm số (nếu có)</label>
                <input value={profile.goal} onChange={e => setProfile({ ...profile, goal: e.target.value })}
                  placeholder={goalPlaceholder}
                  className="w-full px-4 py-3 rounded-xl outline-none transition-colors text-sm"
                  style={{ background: '#e8e8ec', color: '#1a1c1f', border: 'none', fontFamily: 'Inter, sans-serif' }} />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1a1c1f' }}>Họ và tên *</label>
                  <input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })}
                    placeholder="Nhập họ và tên của bạn"
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors"
                    style={{ background: '#e8e8ec', color: '#1a1c1f', border: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#1a1c1f' }}>Email *</label>
                  <input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                    placeholder="example@email.com" type="email"
                    className="w-full px-4 py-3 rounded-xl outline-none text-sm transition-colors"
                    style={{ background: '#e8e8ec', color: '#1a1c1f', border: 'none', fontFamily: 'Inter, sans-serif' }} />
                </div>
              </div>
              <div className="flex items-start gap-3 pt-2">
                <input type="checkbox" id="consent" checked={contact.consent}
                  onChange={e => setContact({ ...contact, consent: e.target.checked })}
                  className="w-5 h-5 mt-0.5 cursor-pointer rounded" style={{ accentColor: '#002143' }} />
                <label htmlFor="consent" className="text-sm cursor-pointer" style={{ color: '#43474e' }}>
                  Tôi đồng ý với các <a href="/terms" className="font-medium hover:underline" style={{ color: '#002143' }}>Điều khoản dịch vụ</a> và <a href="/privacy" className="font-medium hover:underline" style={{ color: '#002143' }}>Chính sách bảo mật</a>.
                </label>
              </div>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <button onClick={onNext} disabled={!canSubmit}
            className="flex items-center gap-3 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300"
            style={{
              background: canSubmit ? '#C8493B' : '#c3c6cf',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              boxShadow: canSubmit ? '0 16px 32px -12px rgba(200,73,59,0.4)' : 'none',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transform: canSubmit ? undefined : undefined,
            }}>
            Bắt đầu làm bài kiểm tra
            <span className="material-symbols-outlined" style={{ fontSize: 22 }}>arrow_forward</span>
          </button>
          <button onClick={onBack} className="text-sm hover:underline" style={{ color: '#43474e' }}>← Quay lại</button>
        </div>
      </div>
    </motion.div>
  );
}
