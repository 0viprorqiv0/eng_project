import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Bot, MessageSquare, X, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "" });

export function MainLayout() {
  const location = useLocation();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Xin chào! Tôi là trợ lý ảo BeeLearn. Tôi có thể giúp gì cho bạn về các khóa học tiếng Anh?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage = chatInput.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput("");
    setIsLoading(true);

    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userMessage,
        config: {
          systemInstruction: "Bạn là trợ lý ảo của trung tâm tiếng Anh BeeLearn. Hãy trả lời các câu hỏi của khách hàng một cách lịch sự, thân thiện và chuyên nghiệp. Các thông tin chính của BeeLearn: Địa chỉ 123 Cầu Giấy, Hotline 1900 6789, Email contact@beelearn.edu.vn. Các khóa học bao gồm: IELTS, Giao tiếp, Tiếng Anh trẻ em, TOEIC, Ôn thi THPTQG, Ngữ pháp, Từ vựng. Luôn khuyến khích khách hàng để lại thông tin tư vấn ở cuối trang web."
        }
      });
      
      const text = response.text;
      
      setMessages(prev => [...prev, { role: 'bot', text: text || "Xin lỗi, tôi gặp chút trục trặc. Bạn vui lòng thử lại sau nhé!" }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Rất tiếc, tôi không thể kết nối lúc này. Vui lòng liên hệ hotline 1900 6789 để được hỗ trợ trực tiếp." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-beered selection:text-white">
      <Navbar />
      
      <main className="grow">
        <Outlet />
      </main>

      <Footer />

      {/* AI Chatbox */}
      <div className="fixed bottom-6 right-6 z-100">
        <AnimatePresence>
          {isChatOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              className="bg-white w-87.5 sm:w-100 h-125 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 mb-4"
            >
              {/* Chat Header */}
              <div className="bg-navy p-5 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-beered rounded-full flex items-center justify-center">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold">BeeBot Assistant</h4>
                    <p className="text-xs opacity-70">Đang trực tuyến</p>
                  </div>
                </div>
                <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="grow overflow-y-auto p-5 space-y-4 bg-gray-50">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-beered text-white rounded-tr-none' 
                        : 'bg-white text-navy shadow-sm rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin text-beered" />
                      <span className="text-xs text-gray-500">BeeBot đang trả lời...</span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="grow px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-beered/20 text-sm"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-beered text-white p-3 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Toggle Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-beered text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          {isChatOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </button>
      </div>
    </div>
  );
}
