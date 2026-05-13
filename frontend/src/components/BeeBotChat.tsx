import React, { useState, useRef, useEffect } from 'react';
import { Bot, MessageSquare, X, Send, Loader2, Trash2, Maximize2, Minimize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { api } from '../lib/api';

interface ChatMessage {
  role: 'user' | 'bot';
  text: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'bot',
  text: 'Xin chào! 🐝 Tôi là BeeBot — trợ lý ảo của BeeLearn. Tôi có thể giúp bạn tư vấn khóa học, giải đáp thắc mắc về tiếng Anh, hoặc cung cấp thông tin trung tâm. Hãy hỏi tôi bất cứ điều gì nhé!'
};

const QUICK_ACTIONS = [
  { label: '📚 Khóa IELTS', message: 'Cho mình hỏi về các khóa luyện thi IELTS' },
  { label: '💰 Học phí', message: 'Học phí các khóa học là bao nhiêu?' },
  { label: '📅 Lịch khai giảng', message: 'Lịch khai giảng gần nhất là khi nào?' },
  { label: '👨‍🏫 Giáo viên', message: 'Giới thiệu đội ngũ giảng viên của BeeLearn' },
];

/** Parse basic markdown: **bold**, *italic*, bullet lists, newlines */
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/^[-•]\s+(.+)$/gm, '<span class="block pl-3">• $1</span>')
    .replace(/^\d+\.\s+(.+)$/gm, '<span class="block pl-3">$&</span>')
    .replace(/\n/g, '<br/>');
}

export function BeeBotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Đóng expanded khi đóng chat
  const handleClose = () => {
    setIsOpen(false);
    setIsExpanded(false);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    const updatedMessages = [...messages, { role: 'user' as const, text: userMessage }];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Gửi history (trừ welcome message) lên backend
      const historyToSend = updatedMessages
        .slice(1) // Bỏ welcome message
        .slice(0, -1) // Bỏ tin nhắn mới (đã gửi riêng qua `message`)
        .map(m => ({ role: m.role, text: m.text }));

      const res = await api.post('/chat', {
        message: userMessage,
        history: historyToSend,
      });

      setMessages(prev => [...prev, { role: 'bot', text: res.reply }]);
    } catch (error: any) {
      let fallback: string;
      if (error?.status === 429) {
        fallback = 'Bạn đang gửi tin nhắn quá nhanh. Vui lòng đợi một chút rồi thử lại nhé! ⏳';
      } else if (error?.status === 422) {
        fallback = 'Tin nhắn quá dài hoặc không hợp lệ. Vui lòng thử lại với nội dung ngắn hơn. ✏️';
      } else {
        fallback = 'Xin lỗi, BeeBot đang bảo trì. Vui lòng liên hệ hotline 1900 6789 để được hỗ trợ trực tiếp. 🐝';
      }
      setMessages(prev => [...prev, { role: 'bot', text: fallback }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    setInput('');
  };

  const showQuickActions = messages.length <= 1 && !isLoading;

  // Dynamic sizes
  const windowClasses = isExpanded
    ? 'fixed inset-4 sm:inset-6 md:inset-12 lg:inset-20 w-auto h-auto rounded-2xl'
    : 'w-[calc(100vw-2rem)] sm:w-[400px] h-[500px] sm:h-[520px] rounded-3xl mb-3';

  return (
    <>
      {/* Backdrop khi expanded */}
      <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[59]"
            onClick={handleClose}
          />
        )}
      </AnimatePresence>

      <div className={`fixed ${isExpanded ? 'inset-0 flex items-center justify-center' : 'bottom-4 right-4 sm:bottom-6 sm:right-6'} z-[61]`}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: isExpanded ? 0 : 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: isExpanded ? 0 : 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              layout
              className={`bg-white ${windowClasses} shadow-2xl flex flex-col overflow-hidden border border-gray-100 z-[60]`}
            >
              {/* Header */}
              <div className="bg-[#13375F] p-4 text-white flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#C8493B] rounded-full flex items-center justify-center">
                    <Bot size={22} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">BeeBot Assistant</h4>
                    <p className="text-[11px] opacity-70">Đang trực tuyến</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={clearChat}
                    title="Xóa đoạn chat"
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    title={isExpanded ? 'Thu nhỏ' : 'Phóng to'}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>
                  <button
                    onClick={handleClose}
                    className="hover:bg-white/10 p-2 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="grow overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`${isExpanded ? 'max-w-[60%]' : 'max-w-[82%]'} px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-[#C8493B] text-white rounded-tr-sm'
                          : 'bg-white text-[#1a1c1f] shadow-sm rounded-tl-sm border border-gray-100'
                      }`}
                      dangerouslySetInnerHTML={
                        msg.role === 'bot'
                          ? { __html: renderMarkdown(msg.text) }
                          : undefined
                      }
                    >
                      {msg.role === 'user' ? msg.text : undefined}
                    </div>
                  </div>
                ))}

                {/* Quick Actions — chỉ hiện khi mới bắt đầu */}
                {showQuickActions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {QUICK_ACTIONS.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => sendMessage(action.message)}
                        className="text-[12px] px-3 py-1.5 bg-white border border-gray-200 rounded-full text-[#13375F] hover:bg-[#13375F] hover:text-white transition-all duration-200 shadow-sm"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8493B] animate-bounce [animation-delay:0ms]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8493B] animate-bounce [animation-delay:150ms]"></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8493B] animate-bounce [animation-delay:300ms]"></span>
                      </span>
                      <span className="text-[11px] text-gray-400 ml-1">BeeBot đang trả lời...</span>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="grow px-4 py-2.5 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#C8493B]/20 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={isLoading || !input.trim()}
                  className="bg-[#C8493B] text-white p-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 shrink-0"
                >
                  <Send size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button — ẩn khi expanded */}
        {!isExpanded && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-[#C8493B] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
          </button>
        )}
      </div>
    </>
  );
}
