import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  CheckCircle2, HelpCircle, ArrowLeft, Clock, Trophy,
  RotateCcw, ChevronRight, Loader2, PenLine
} from 'lucide-react';

interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'essay';
  text?: string;
  question?: string;
  options: QuizOption[];
  prompt?: string;
}

export function QuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Quiz state
  const [currentPage, setCurrentPage] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [essayAnswers, setEssayAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<{ score: number; total: number; percentage: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lessons/${id}`);
        if (res?.lesson) {
          setLesson(res.lesson);
          setQuestions(res.lesson.questions_data || []);
        }
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  // Timer
  useEffect(() => {
    if (currentPage !== 'quiz' || timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev !== null && prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentPage, timeLeft]);

  const startQuiz = () => {
    setCurrentPage('quiz');
    setTimeLeft(lesson?.duration_minutes ? lesson.duration_minutes * 60 : null);
    setAnswers({});
    setEssayAnswers({});
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    try {
      const timeSpent = lesson?.duration_minutes 
        ? (lesson.duration_minutes * 60) - (timeLeft || 0) 
        : 0;

      const res = await api.post(`/lessons/${id}/quiz`, {
        answers,
        essay_answers: essayAnswers,
        time_spent: timeSpent
      });

      setResult({
        score: res.score,
        total: res.total,
        percentage: res.percentage
      });
      setCurrentPage('result');
    } catch (e: any) {
      alert('Có lỗi khi nộp bài: ' + (e?.message || 'Vui lòng thử lại.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentPage('intro');
    setAnswers({});
    setEssayAnswers({});
    setResult(null);
    setTimeLeft(null);
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f3f7] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#13375f] animate-spin mx-auto mb-4" />
          <p className="text-[#43474e] font-medium">Đang tải bài quiz...</p>
        </div>
      </div>
    );
  }

  if (!lesson || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f3f7] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#002143] mb-2">Chưa có câu hỏi</h2>
          <p className="text-[#43474e] mb-6">Bài quiz này chưa được thiết lập câu hỏi.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-[#13375f] text-white font-bold rounded-xl">Quay lại</button>
        </div>
      </div>
    );
  }

  const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
  const essayQuestions = questions.filter(q => q.type === 'essay');
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#f4f3f7]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-[#002143] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-[10px] text-[#43474e] font-bold uppercase tracking-wider">{lesson.course?.title || 'Quiz'}</p>
              <h1 className="text-lg font-bold text-[#002143]">{lesson.title}</h1>
            </div>
          </div>
          {currentPage === 'quiz' && timeLeft !== null && (
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-slate-100 text-[#002143]'}`}>
              <Clock className="w-4 h-4" />
              {formatTimer(timeLeft)}
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* ═══ INTRO ═══ */}
        {currentPage === 'intro' && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-2xl mx-auto" style={{animation: 'fadeIn 0.4s ease'}}>
            <div className="w-24 h-24 bg-gradient-to-br from-[#13375f] to-[#002143] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <HelpCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-black text-[#002143] mb-3 font-headline">{lesson.title}</h2>
            {lesson.description && (
              <p className="text-[#43474e] mb-8 max-w-md mx-auto leading-relaxed">{lesson.description}</p>
            )}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
              <div className="bg-[#f4f3f7] rounded-2xl p-4">
                <p className="text-2xl font-black text-[#002143]">{questions.length}</p>
                <p className="text-[10px] text-[#43474e] font-bold uppercase tracking-wider">Câu hỏi</p>
              </div>
              <div className="bg-[#f4f3f7] rounded-2xl p-4">
                <p className="text-2xl font-black text-[#002143]">{mcQuestions.length}</p>
                <p className="text-[10px] text-[#43474e] font-bold uppercase tracking-wider">Trắc nghiệm</p>
              </div>
              <div className="bg-[#f4f3f7] rounded-2xl p-4">
                <p className="text-2xl font-black text-[#002143]">{essayQuestions.length}</p>
                <p className="text-[10px] text-[#43474e] font-bold uppercase tracking-wider">Tự luận</p>
              </div>
            </div>
            {lesson.duration_minutes > 0 && (
              <p className="text-sm text-[#43474e] mb-6 flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" /> Thời gian làm bài: <strong>{lesson.duration_minutes} phút</strong>
              </p>
            )}
            <button onClick={startQuiz}
              className="px-12 py-4 bg-gradient-to-r from-[#002143] to-[#13375f] text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all active:scale-95">
              🚀 Bắt đầu làm bài
            </button>
          </div>
        )}

        {/* ═══ QUIZ ═══ */}
        {currentPage === 'quiz' && (
          <div className="space-y-8" style={{animation: 'fadeIn 0.4s ease'}}>
            {/* Progress */}
            <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-bold text-[#002143]">Tiến độ</span>
                  <span className="text-[#43474e]">{answeredCount}/{mcQuestions.length} câu trắc nghiệm</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#002143] to-[#E24843] rounded-full transition-all duration-500"
                    style={{ width: `${mcQuestions.length > 0 ? (answeredCount / mcQuestions.length) * 100 : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, idx) => (
              <div key={q.id} className="bg-white rounded-3xl shadow-sm p-8 border border-black/5">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#002143] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-black">{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    q.type === 'multiple_choice' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {q.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                  </span>
                </div>

                {q.type === 'multiple_choice' ? (
                  <>
                    <h3 className="text-lg font-bold text-[#002143] mb-5">{q.text || q.question}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options?.map((opt, optIdx) => (
                        <button
                          key={opt.id}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: optIdx }))}
                          className={`text-left p-4 rounded-2xl border-2 transition-all font-medium flex items-center gap-3 ${
                            answers[q.id] === optIdx
                              ? 'border-[#13375f] bg-[#13375f]/5 text-[#002143] shadow-sm scale-[1.02]'
                              : 'border-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            answers[q.id] === optIdx ? 'bg-[#13375f] text-white' : 'bg-white border border-slate-200'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 mb-4">
                      <p className="text-amber-800 text-sm leading-relaxed font-medium">{q.prompt || q.text}</p>
                    </div>
                    <textarea
                      value={essayAnswers[q.id] || ''}
                      onChange={e => setEssayAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={5}
                      className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13375f]/20 outline-none transition-all resize-none text-sm"
                    />
                  </>
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="flex gap-4">
              <button onClick={resetQuiz}
                className="px-8 py-4 border-2 border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" /> Hủy bỏ
              </button>
              <button
                onClick={handleSubmitQuiz}
                disabled={answeredCount < mcQuestions.length || isSubmitting}
                className="flex-1 py-4 bg-[#E24843] text-white font-bold text-lg rounded-2xl shadow-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" /> Nộp bài ({answeredCount}/{mcQuestions.length})
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ═══ RESULT ═══ */}
        {currentPage === 'result' && result && (
          <div className="bg-white rounded-3xl shadow-lg p-10 text-center max-w-2xl mx-auto" style={{animation: 'fadeIn 0.4s ease'}}>
            <div className={`w-36 h-36 rounded-full border-8 flex items-center justify-center mx-auto mb-8 shadow-2xl ${
              result.percentage >= 80 ? 'border-emerald-200 text-emerald-600 bg-emerald-50'
              : result.percentage >= 60 ? 'border-amber-200 text-amber-600 bg-amber-50'
              : 'border-red-200 text-red-600 bg-red-50'
            }`}>
              <span className="text-5xl font-black">{result.percentage}%</span>
            </div>

            <h2 className="text-3xl font-black text-[#002143] mb-2 font-headline">
              {result.percentage >= 80 ? 'Xuất sắc! 🎉' : result.percentage >= 60 ? 'Khá tốt! 👍' : 'Cố gắng lên! 💪'}
            </h2>
            <p className="text-[#43474e] mb-8 text-lg">
              Bạn trả lời đúng <strong>{result.score}</strong> trên <strong>{result.total}</strong> câu trắc nghiệm
            </p>

            {/* Review answers */}
            <div className="text-left mb-8 space-y-3">
              {mcQuestions.map((q, idx) => {
                const correctIdx = q.options?.findIndex(o => o.isCorrect);
                const userAnswer = answers[q.id];
                const isCorrect = userAnswer === correctIdx;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-start gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                        {isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#002143] mb-1">Câu {idx + 1}: {q.text || q.question}</p>
                        <p className="text-xs text-[#43474e]">
                          Bạn chọn: <strong>{q.options?.[userAnswer]?.text || '(chưa trả lời)'}</strong>
                          {!isCorrect && <> • Đáp án đúng: <strong className="text-emerald-700">{q.options?.[correctIdx!]?.text}</strong></>}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={resetQuiz}
                className="px-8 py-3 border-2 border-[#13375f] text-[#13375f] font-bold rounded-xl hover:bg-[#13375f] hover:text-white transition-all flex items-center gap-2">
                <RotateCcw className="w-5 h-5" /> Làm lại
              </button>
              <button onClick={() => navigate(-1)}
                className="px-8 py-3 bg-[#13375f] text-white font-bold rounded-xl hover:bg-[#002143] transition-all flex items-center gap-2">
                <ChevronRight className="w-5 h-5" /> Tiếp tục học
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
