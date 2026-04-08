import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, BookOpen, Lightbulb } from 'lucide-react';
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
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center"
        >
          {/* Left Side - Hero - Takes 6/12 columns (balanced) */}
          <div className="lg:col-span-6 space-y-8 relative z-10 flex flex-col justify-center">
             <motion.div  
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2, duration: 0.5 }}
               className="max-w-xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-navy leading-[1.1] mb-6 drop-shadow-sm">
                Mở khoá tri thức,
                <br />
                Kiến tạo tương lai.
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed font-medium">
                Học tập không giới hạn cùng BeeLearn Academic Atelier. Nơi kiến thức hàn lâm gặp gỡ sự sáng tạo.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
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
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -left-4 lg:-left-12 -bottom-10 bg-[#f8f9fc] rounded-[1.25rem] p-4 shadow-2xl border border-white/50 z-20 hidden md:flex items-center gap-4 max-w-[280px]"
              >
                 <div className="w-12 h-12 rounded-full bg-[#e6ecf3] flex items-center justify-center text-navy flex-shrink-0">
                    <div className="w-3.5 h-3.5 bg-navy rounded-full" />
                 </div>
                 <div>
                   <p className="font-bold text-navy text-sm mb-0.5">Chương trình 12+</p>
                   <p className="text-[11px] text-gray-500 leading-tight pr-2">Lộ trình học thuật chuẩn quốc tế.</p>
                 </div>
              </motion.div>
            </motion.div>


          </div>

          {/* Right Side - Login Form - Takes 6/12 columns */}
          <motion.div 
             initial={{ opacity: 0, x: 30 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3, duration: 0.5 }}
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
                  <a href="#" className="text-xs font-bold text-[#e65540] hover:text-red-700 transition-colors">Quên mật khẩu?</a>
                </div>
                <div className="relative group">
                   <input 
                     type="password" 
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder="••••••••" 
                     className="block w-full px-5 py-4 bg-[#f2f4f8] border-2 border-transparent focus:border-navy/10 rounded-xl text-navy placeholder-gray-400 focus:outline-none focus:ring-0 transition-all font-medium"
                   />
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

              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-widest">
                  <span className="px-4 bg-white text-gray-400 font-semibold">Hoặc tiếp tục với</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all hover:shadow-md"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-200 rounded-xl shadow-sm bg-white text-sm font-bold text-gray-700 hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy transition-all hover:shadow-md group"
                >
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition opacity-80" alt="Facebook" />
                  Facebook
                </button>
              </div>

               <div className="mt-8 text-center">
                  <p className="text-gray-500 text-sm">
                     Chưa có tài khoản?{' '}
                     <Link to="/register" className="font-bold text-[#e65540] hover:text-red-700 transition-colors">
                        Đăng ký ngay
                     </Link>
                  </p>
               </div>


            </form>
          </motion.div>
        </motion.div>
      </section>
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
