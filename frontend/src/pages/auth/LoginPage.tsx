import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, BookOpen, Lightbulb, Phone, X, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../components/AuthContext';
import { BeeDecoration } from '../../components/BeeDecoration';
import { api } from '../../lib/api';

const AUTO_ACCOUNTS: Record<string, string> = {
  admin: 'admin@beelearn.vn',
  teacher: 'teacher@beelearn.vn',
  teacher2: 'teacher2@beelearn.vn',
  teacher3: 'teacher3@beelearn.vn',
  teacher4: 'teacher4@beelearn.vn',
  student: 'student@beelearn.vn',
  student2: 'student2@beelearn.vn',
  student3: 'student3@beelearn.vn',
};

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-login: /login?auto=admin | teacher | student | student2 ...
  useEffect(() => {
    const autoKey = searchParams.get('auto');
    if (!autoKey || !AUTO_ACCOUNTS[autoKey]) return;
    const autoEmail = AUTO_ACCOUNTS[autoKey];
    (async () => {
      setIsLoading(true);
      try {
        const data = await api.post('/login', { email: autoEmail, password: 'password' });
        login(data.user, data.token);
        navigate(data.user.role === 'admin' ? '/dashboard/admin' : data.user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
      } catch (err: any) {
        setError(`Auto-login failed: ${err.message}`);
        setIsLoading(false);
      }
    })();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.post('/login', { email, password });
      login(data.user, data.token);
      
      if (data.user.role === 'admin') {
        navigate('/dashboard/admin');
      } else if (data.user.role === 'teacher') {
        navigate('/dashboard/teacher');
      } else {
        navigate('/dashboard/student');
      }
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Kiểm tra thông tin!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-[#f4f5fb] relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-beered/5 rounded-full blur-3xl opacity-50" />
         <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-navy/5 rounded-full blur-3xl opacity-50" />
         
         {/* Flying Bees */}
         <BeeDecoration size={60} className="top-[15%] left-[5%]" delay={0} />
         <BeeDecoration size={40} className="bottom-[20%] right-[10%]" delay={2} />
         <BeeDecoration size={30} className="top-[40%] right-[40%]" delay={1} />
      </div>

      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-28 md:pt-16 md:pb-40 flex-col justify-center flex-grow flex">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Side - Hero - Takes 6/12 columns (balanced) */}
          <div className="lg:col-span-6 space-y-8 relative z-10 flex flex-col justify-center">
             <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.1] mb-6 drop-shadow-sm">
                Mở khoá tri thức,
                <br />
                Kiến tạo tương lai.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Học tập không giới hạn cùng BeeLearn. Nơi kiến thức hàn lâm gặp gỡ sự sáng tạo.
              </p>
            </div>

            <div 
              className="relative w-full aspect-[4/3] rounded-[2.5rem] bg-white p-2 shadow-2xl skew-y-1 transform transition-transform hover:skew-y-0 duration-500"
            >
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <img
                  src="/study.png"
                  alt="Students learning"
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent opacity-80" />



                {/* Bottom Text */}
                <div className="absolute bottom-8 left-8 text-white z-10">
                  <h3 className="text-xl font-extrabold mb-1">Cộng đồng BeeLearn</h3>
                  <p className="text-sm font-medium text-white/90">+10,000 học sinh đang chinh phục ước mơ</p>
                </div>

                {/* Overlapping Card */}
                <motion.div 
                   animate={{ y: [0, -10, 0] }}
                   transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                   className="absolute -bottom-6 right-8 w-24 h-28 bg-[#dfe4ea] rounded-[1.5rem] shadow-xl flex items-center justify-center border-4 border-white z-20"
                >
                    <Lightbulb size={32} className="text-navy" strokeWidth={2.5} />
                </motion.div>
              </div>

              {/* Floating Approved Card */}
              <div 
                className="absolute -left-4 lg:-left-12 -bottom-10 bg-[#f8f9fc] rounded-[1.25rem] p-4 shadow-2xl border border-white/50 z-20 hidden md:flex items-center gap-4 max-w-[280px]"
              >
                 <div className="w-12 h-12 rounded-full bg-[#e6ecf3] flex items-center justify-center text-navy flex-shrink-0">
                    <div className="w-3.5 h-3.5 bg-navy rounded-full" />
                 </div>
                 <div>
                   <p className="font-bold text-navy text-sm mb-0.5">Chương trình 12+</p>
                   <p className="text-[11px] text-gray-500 leading-tight pr-2">Lộ trình học thuật chuẩn quốc tế.</p>
                 </div>
              </div>
            </div>


          </div>

          {/* Right Side - Login Form - Takes 6/12 columns */}
          <div 
             className="lg:col-span-6 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100 relative z-20"
          >
            <div className="flex justify-between items-start mb-8 relative">
               <div className="relative z-10">
                  <h2 className="text-3xl font-black text-navy mb-2">Chào mừng trở lại!</h2>
                  <p className="text-gray-500 font-medium">Đăng nhập để tiếp tục hành trình của bạn.</p>
               </div>
               {/* Decorative Element on Card */}
               <div className="w-32 h-32 bg-[#f4f5fb] rounded-tr-[2.5rem] rounded-bl-[4rem] absolute top-0 right-0 z-0" />
            </div>

            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                   {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-bold text-navy ml-1">Email hoặc Tên đăng nhập</label>
                <div className="relative group">
                   <input 
                     type="text" 
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder="name@example.com" 
                     className="block w-full px-5 py-4 bg-[#f2f4f8] border-2 border-transparent focus:border-navy/10 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:ring-0 transition-all font-medium"
                     required
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-bold text-navy">Mật khẩu</label>
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-xs font-bold text-[#e65540] hover:text-red-700 transition-colors">Quên mật khẩu?</button>
                </div>
                <div className="relative group">
                   <input 
                     type={showPassword ? 'text' : 'password'} 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="block w-full px-5 py-4 pr-12 bg-[#f2f4f8] border-2 border-transparent focus:border-navy/10 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:ring-0 transition-all font-medium"
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                   >
                     {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>
              </div>

              <div className="flex items-center ml-1">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer select-none">
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-navy/20 text-sm font-bold text-white bg-navy hover:bg-[#1a2b4b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>

               <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                     Chưa có tài khoản?{' '}
                     <Link to="/register" className="font-bold text-[#e65540] hover:text-red-700 transition-colors">
                        Đăng ký ngay
                     </Link>
                  </p>
               </div>


            </form>
          </div>
        </div>
      </section>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              onClick={() => setShowForgotPassword(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl p-8 shadow-2xl z-[101] w-[90vw] max-w-md"
            >
              <button
                onClick={() => setShowForgotPassword(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#FEF3F2] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock size={28} className="text-[#e65540]" />
                </div>
                <h3 className="text-xl font-black text-navy mb-2">Quên mật khẩu?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Đừng lo, hãy liên hệ với chúng tôi để được hỗ trợ đặt lại mật khẩu ngay nhé!
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="tel:19006789"
                  className="flex items-center gap-4 p-4 bg-[#f4f5fb] rounded-2xl hover:bg-navy/5 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Phone size={20} className="text-navy" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">Gọi Hotline</p>
                    <p className="text-xs text-gray-500">1900 6789 (8:00 - 21:00)</p>
                  </div>
                </a>

                <a
                  href="mailto:contact@beelearn.edu.vn?subject=Yêu cầu đặt lại mật khẩu"
                  className="flex items-center gap-4 p-4 bg-[#f4f5fb] rounded-2xl hover:bg-navy/5 transition-colors group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                    <Mail size={20} className="text-[#e65540]" />
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">Gửi Email</p>
                    <p className="text-xs text-gray-500">contact@beelearn.edu.vn</p>
                  </div>
                </a>
              </div>

              <p className="text-center text-[11px] text-gray-400 mt-5">
                Vui lòng cung cấp email đã đăng ký để được xác minh và đặt lại mật khẩu.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {/* Fixed Book Icon floating on the left edge */}
      <motion.div 
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed top-1/3 left-0 w-16 h-20 bg-[#e65540] rounded-r-2xl hidden lg:flex items-center justify-center text-white shadow-lg cursor-pointer z-50 transition-all"
      >
        <BookOpen size={28} strokeWidth={2.5} />
      </motion.div>
    </div>
  );
}
