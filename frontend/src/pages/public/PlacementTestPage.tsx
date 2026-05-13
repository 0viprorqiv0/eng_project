import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getRandomTestSet } from '../../data/placementQuestions';
import type { PlacementTestSet } from '../../data/placementQuestions';
import { PlacementWelcome } from './placement/PlacementWelcome';
import { PlacementProfile } from './placement/PlacementProfile';
import { PlacementQuiz } from './placement/PlacementQuiz';
import { PlacementResult } from './placement/PlacementResult';
import { api } from '../../lib/api';

interface Profile {
  type: 'student_11_12' | 'ielts' | 'working';
  currentLevel: 'beginner' | 'elementary' | 'intermediate' | 'advanced';
  goal: string;
}
interface Contact { name: string; email: string; consent: boolean; }
interface Answer { category: string; isCorrect: boolean; difficulty: string; }

export function PlacementTestPage() {
  const [phase, setPhase] = useState(0);
  const [profile, setProfile] = useState<Profile>({ type: 'student_11_12', currentLevel: 'beginner', goal: '' });
  const [contact, setContact] = useState<Contact>({ name: '', email: '', consent: false });
  const [testSet, setTestSet] = useState<PlacementTestSet | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = () => {
    const ts = getRandomTestSet();
    setTestSet(ts);
    setAnswers(new Array(ts.questions.length).fill(null));
    setCurrentQ(0);
    setPhase(2);
  };

  const selectAnswer = (idx: number) => {
    const a = [...answers]; a[currentQ] = idx; setAnswers(a);
  };

  const finishQuiz = async () => {
    if (!testSet) return;
    const qs = testSet.questions;
    const ansData: Answer[] = qs.map((q, i) => ({
      category: q.category, difficulty: q.difficulty,
      isCorrect: answers[i] === q.correctIndex,
    }));
    const score = ansData.filter(a => a.isCorrect).length;
    const total = qs.length;
    const pct = Math.round((score / total) * 100);
    const levelResult = pct <= 30 ? 'Beginner' : pct <= 50 ? 'Elementary' : pct <= 70 ? 'Intermediate' : pct <= 85 ? 'Upper-Intermediate' : 'Advanced';

    // Count by category
    const cats: Record<string, number> = { grammar: 0, vocabulary: 0, reading: 0 };
    ansData.forEach(a => { if (a.isCorrect) cats[a.category] = (cats[a.category] || 0) + 1; });

    setResult({ score, total, percentage: pct, levelResult, ansData, categories: cats });
    setPhase(3);

    // Save to localStorage
    const resultData = { score, total, pct, levelResult, cats, timestamp: Date.now() };
    localStorage.setItem('placement_result', JSON.stringify(resultData));

    // Call AI via api helper (handles auth headers, CORS properly)
    setLoading(true);
    try {
      const json = await api.post('/placement-evaluate', {
        name: contact.name, email: contact.email, consent: contact.consent,
        profile, score, total, answers: ansData,
      });
      if (json?.status === 'ok' && json.aiAnalysis) {
        setResult((prev: any) => ({
          ...prev,
          ai: json.aiAnalysis,
          levelResult: json.levelResult || levelResult,
        }));
      } else {
        // Backend returned ok but no AI analysis — use fallback
        setResult((prev: any) => ({
          ...prev,
          ai: buildFallbackAi(levelResult, cats, profile),
          levelResult: json?.levelResult || levelResult,
        }));
      }
    } catch (e) {
      console.error('AI Error:', e);
      // API call failed — use local fallback
      setResult((prev: any) => ({
        ...prev,
        ai: buildFallbackAi(levelResult, cats, profile),
      }));
    }
    setLoading(false);
  };

  const buildFallbackAi = (level: string, cats: Record<string, number>, prof: Profile) => {
    const courseSuggestions: Record<string, string> = {
      student_11_12: level === 'Beginner' || level === 'Elementary' 
        ? 'TỔNG ÔN NGỮ PHÁP' 
        : 'LUYỆN ĐỀ CẤP TỐC (THỰC CHIẾN THPT QG)',
      ielts: level === 'Beginner' || level === 'Elementary' 
        ? 'IELTS FOUNDATION 5.0+' 
        : level === 'Intermediate' 
        ? 'IELTS TARGET 6.5' 
        : 'IELTS BỨT PHÁ 8.0+',
      working: level === 'Beginner' || level === 'Elementary' 
        ? 'TIẾNG ANH GIAO TIẾP' 
        : 'TIẾNG ANH CÔNG SỞ',
    };

    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    if (cats.grammar >= 6) strengths.push('Nền tảng ngữ pháp vững chắc');
    else if (cats.grammar <= 3) weaknesses.push('Cần củng cố kiến thức ngữ pháp cơ bản');
    
    if (cats.vocabulary >= 4) strengths.push('Vốn từ vựng khá phong phú');
    else if (cats.vocabulary <= 2) weaknesses.push('Cần mở rộng vốn từ vựng');
    
    if (cats.reading >= 4) strengths.push('Khả năng đọc hiểu tốt');
    else if (cats.reading <= 2) weaknesses.push('Kỹ năng đọc hiểu cần luyện thêm');

    if (strengths.length === 0) strengths.push('Đã hoàn thành toàn bộ bài test');
    if (weaknesses.length === 0) weaknesses.push('Duy trì luyện tập đều đặn để giữ phong độ');

    const analysisMap: Record<string, string> = {
      'Beginner': `Bạn đang ở giai đoạn khởi đầu. Đừng lo — với lộ trình học tập cá nhân hóa từ BeeLearn, bạn sẽ tiến bộ rất nhanh!`,
      'Elementary': `Bạn đã có nền tảng cơ bản. Hãy tập trung vào ngữ pháp trọng tâm và mở rộng từ vựng theo chủ đề để nâng trình độ lên nhanh chóng.`,
      'Intermediate': `Trình độ trung bình khá tốt! Bạn đã nắm được các kiến thức nền tảng. Giờ là lúc tập trung vào kỹ năng đọc hiểu và ngữ pháp nâng cao.`,
      'Upper-Intermediate': `Rất ấn tượng! Bạn có trình độ tiếng Anh khá cao. Hãy luyện thêm các dạng bài nâng cao để đạt điểm tối đa.`,
      'Advanced': `Xuất sắc! Bạn có trình độ tiếng Anh rất tốt. Hãy duy trì bằng cách luyện đề thường xuyên và thử thách bản thân với các bài tập khó hơn.`,
    };

    return {
      analysis: analysisMap[level] || 'Cảm ơn bạn đã hoàn thành bài test năng lực!',
      strengths,
      weaknesses,
      suggestedCourse: courseSuggestions[prof.type] || 'IELTS FOUNDATION 5.0+',
      advice: 'Hãy đăng ký tư vấn miễn phí tại BeeLearn để được xây dựng lộ trình học tập phù hợp nhất với mục tiêu của bạn!',
    };
  };


  const handleRetry = () => {
    setPhase(0);
    setResult(null);
    setAnswers([]);
    setTestSet(null);
    localStorage.removeItem('placement_result');
  };

  return (
    <AnimatePresence mode="wait">
      {phase === 0 && <PlacementWelcome key="w" onStart={() => setPhase(1)} />}
      {phase === 1 && (
        <PlacementProfile key="p"
          profile={profile} setProfile={setProfile}
          contact={contact} setContact={setContact}
          onNext={startQuiz} onBack={() => setPhase(0)} />
      )}
      {phase === 2 && testSet && (
        <PlacementQuiz key="q"
          testSet={testSet} currentQ={currentQ} setCurrentQ={setCurrentQ}
          answers={answers} selectAnswer={selectAnswer} onFinish={finishQuiz} />
      )}
      {phase === 3 && (
        <PlacementResult key="r" result={result} loading={loading} onRetry={handleRetry} />
      )}
    </AnimatePresence>
  );
}
