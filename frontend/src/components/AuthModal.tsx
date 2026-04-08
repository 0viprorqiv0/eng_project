import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, authMode, setAuthMode }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/80 backdrop-blur-sm"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden relative z-10 flex flex-col md:flex-row"
          >
            {/* Left Side - Image/Branding */}
            <div className="md:w-5/12 bg-navy p-10 text-white flex flex-col justify-between relative overflow-hidden hidden md:flex">
              <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/auth/800/1000')] opacity-20 bg-cover bg-center mix-blend-luminosity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/80 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-12">
                  <div className="w-10 h-10 bg-beered rounded-xl flex items-center justify-center">
                    <span className="text-white font-black text-xl">B</span>
                  </div>
                  <span className="text-2xl font-black tracking-tight">BeeLearn</span>
                </div>
                
                <h3 className="text-3xl font-black mb-4 leading-tight">
                  {authMode === 'login' ? 'Mừng bạn trở lại tổ ong!' : 'Bắt đầu hành trình mới!'}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {authMode === 'login' 
                    ? 'Đăng nhập để tiếp tục lộ trình học tập và chinh phục những mục tiêu mới cùng BeeLearn.' 
                    : 'Tạo tài khoản ngay hôm nay để trải nghiệm phương pháp học tiếng Anh hoàn toàn mới.'}
                </p>
              </div>
              
              <div className="relative z-10 mt-12">
                <div className="flex -space-x-4 mb-4">
                  {[1,2,3,4].map(i => (
                    <img key={i} src={`https://picsum.photos/seed/user${i}/100/100`} className="w-12 h-12 rounded-full border-2 border-navy" alt="User" referrerPolicy="no-referrer" />
                  ))}
                </div>
                <p className="text-sm text-gray-400">Tham gia cùng <span className="text-white font-bold">5000+</span> học viên khác</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-7/12 p-10 sm:p-12 relative">
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-beered transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="max-w-md mx-auto">
                <h2 className="text-3xl font-black text-navy mb-2">
                  {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
                </h2>
                <p className="text-gray-500 mb-8">
                  {authMode === 'login' 
                    ? 'Chưa có tài khoản? ' 
                    : 'Đã có tài khoản? '}
                  <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-beered font-bold hover:underline"
                  >
                    {authMode === 'login' ? 'Đăng ký ngay' : 'Đăng nhập'}
                  </button>
                </p>
                
                <form className="space-y-5">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-sm font-bold text-navy mb-2">Họ và tên</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered bg-gray-50 focus:bg-white transition-colors" 
                          placeholder="Nguyễn Văn A" 
                        />
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-bold text-navy mb-2">Email</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered bg-gray-50 focus:bg-white transition-colors" 
                        placeholder="email@example.com" 
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-bold text-navy">Mật khẩu</label>
                      {authMode === 'login' && (
                        <a href="#" className="text-sm text-beered font-medium hover:underline">Quên mật khẩu?</a>
                      )}
                    </div>
                    <div className="relative">
                      <input 
                        type="password" 
                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-beered bg-gray-50 focus:bg-white transition-colors" 
                        placeholder="••••••••" 
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                  </div>
                  
                  <button 
                    type="button"
                    className="w-full py-4 bg-navy text-white font-bold rounded-xl hover:bg-opacity-90 transition-colors flex items-center justify-center gap-2 text-lg mt-8 shadow-lg shadow-navy/20"
                  >
                    {authMode === 'login' ? 'Đăng nhập' : 'Đăng ký'} <ArrowRight size={20} />
                  </button>
                  
                  <div className="relative flex items-center py-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Hoặc tiếp tục với</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" className="py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-navy">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                      Google
                    </button>
                    <button type="button" className="py-3 border border-gray-200 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors font-medium text-navy">
                      <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="w-5 h-5" />
                      Facebook
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
