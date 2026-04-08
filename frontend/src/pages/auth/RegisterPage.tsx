import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, Phone, Eye, EyeOff, Users, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { BeeDecoration } from '../../components/BeeDecoration';
import { api } from '../../lib/api';
import { useAuth } from '../../components/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      setError('Mật khẩu xác nhận không khớp!');
      return;
    }

    setError('');
    setIsLoading(true);
    try {
      const data = await api.post('/register', formData);
      login(data.user, data.token);
      navigate('/dashboard/student');
    } catch (err: any) {
      const serverError = err.errors 
        ? Object.values(err.errors).flat().join(', ')
        : err.message;
      setError(serverError || 'Đăng ký thất bại. Kiểm tra lại thông tin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow bg-[#f4f5fb] relative overflow-hidden flex flex-col">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-beered/5 rounded-full blur-3xl opacity-60" />
         <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-navy/5 rounded-full blur-3xl opacity-60" />
         
         {/* Flying Bees */}
         <BeeDecoration size={50} className="top-[10%] left-[10%]" delay={0.5} />
         <BeeDecoration size={35} className="bottom-[15%] left-[5%]" delay={2.5} />
         <BeeDecoration size={45} className="top-[20%] right-[5%]" delay={1.5} />
      </div>

      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-28 lg:pt-16 lg:pb-40 flex-grow flex items-center">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center w-full"
        >
          {/* Left Side - Text & Image/Community - Takes 5/12 columns */}
          <div className="lg:col-span-5 space-y-6 relative h-full flex flex-col justify-center">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="text-left"
             >
                <span className="inline-block py-1.5 px-4 rounded-full bg-[#faebeb] text-[#9f0009] text-[10px] md:text-xs font-bold tracking-widest uppercase mb-4">
                  Khởi đầu hành trình
                </span>
                <h1 className="text-4xl lg:text-5xl font-black text-navy mb-4 leading-tight">
                  Tạo tài khoản mới
                </h1>
                <p className="text-gray-600 text-base md:text-lg">
                  Điền thông tin bên dưới để bắt đầu trải nghiệm học tập cá nhân hóa tại BeeLearn.
                </p>
             </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.2 }}
               className="relative rounded-[2.5rem] bg-[#e7d8c4] border-4 border-white shadow-2xl aspect-[4/5] w-full transform skew-y-1 hover:skew-y-0 transition-all duration-700"
            >
              <div className="absolute inset-0 rounded-[2.3rem] overflow-hidden">
                <img
                  src="/woman.png"
                  alt="Student portrait"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent opacity-60" />
              </div>

              {/* Badges */}
              <motion.div 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.4 }}
                 className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg flex items-center gap-3 pr-6"
              >
                  <div className="w-10 h-10 rounded-full bg-[#faebeb] text-[#9f0009] flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Cộng đồng</p>
                    <p className="font-extrabold text-navy text-sm">2,400+ học sinh</p>
                  </div>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 30 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 className="absolute -bottom-10 -left-2 md:-left-6 w-[85%] md:w-[70%] max-w-[320px] bg-[#2a3c5a] rounded-3xl p-6 text-white shadow-2xl z-20"
              >
                 {/* Avatar Stack */}
                 <div className="flex items-center -space-x-3 mb-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-[3px] border-[#283b5c] overflow-hidden">
                         <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-full h-full object-cover" alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full bg-[#7a0010] border-[3px] border-[#283b5c] flex items-center justify-center text-[10px] font-bold">
                       +99
                    </div>
                 </div>

                 <h5 className="text-[1.1rem] md:text-xl font-bold mb-2 leading-snug pr-4">Chinh phục mục tiêu IELTS 7.5+ ngay hôm nay</h5>
                 <p className="text-xs md:text-sm text-gray-300 opacity-90 pr-2 leading-relaxed">Tham gia cùng hàng nghìn sĩ tử lớp 12 đang bứt phá điểm số tại BeeLearn.</p>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Side - Form - Takes 7/12 columns */}
          <div className="lg:col-span-7 w-full">
             <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl shadow-navy/5 border border-gray-100"
             >
                <form className="space-y-4" onSubmit={handleRegister}>
                   {error && (
                     <div className="p-3 mb-2 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                        {error}
                     </div>
                   )}
                   <div>
                      <label className="block text-sm font-bold text-navy mb-1 ml-1">Họ và tên</label>
                      <div className="relative group">
                         <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors" />
                         <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Nguyễn Văn A" className="w-full bg-[#f8f9fc] rounded-xl py-3 pl-12 pr-4 text-navy border-2 border-transparent focus:border-navy/10 outline-none transition-all font-medium placeholder-gray-400" />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-navy mb-1 ml-1">Số điện thoại</label>
                      <div className="relative group">
                         <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors" />
                         <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="09xx xxx xxx" className="w-full bg-[#f8f9fc] rounded-xl py-3 pl-12 pr-4 text-navy border-2 border-transparent focus:border-navy/10 outline-none transition-all font-medium placeholder-gray-400" />
                      </div>
                   </div>

                   <div>
                      <label className="block text-sm font-bold text-navy mb-1 ml-1">Địa chỉ Email</label>
                      <div className="relative group">
                         <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors" />
                         <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="example@beelearn.edu.vn" className="w-full bg-[#f8f9fc] rounded-xl py-3 pl-12 pr-4 text-navy border-2 border-transparent focus:border-navy/10 outline-none transition-all font-medium placeholder-gray-400" />
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-navy mb-1 ml-1">Mật khẩu</label>
                        <div className="relative group">
                           <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors" />
                           <input type={showPassword ? "text" : "password"} required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" className="w-full bg-[#f8f9fc] rounded-xl py-3 pl-12 pr-10 text-navy border-2 border-transparent focus:border-navy/10 outline-none transition-all font-medium placeholder-gray-400" />
                        </div>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-navy mb-1 ml-1">Xác nhận MK</label>
                        <div className="relative group">
                           <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-navy transition-colors" />
                           <input type={showPassword ? "text" : "password"} required value={formData.password_confirmation} onChange={e => setFormData({...formData, password_confirmation: e.target.value})} placeholder="••••••••" className="w-full bg-[#f8f9fc] rounded-xl py-3 pl-10 pr-10 text-navy border-2 border-transparent focus:border-navy/10 outline-none transition-all font-medium placeholder-gray-400" />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors">
                              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                           </button>
                        </div>
                     </div>
                   </div>

                   <label className="flex items-start gap-3 mt-2 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-[#9f0009] peer-checked:border-[#9f0009] transition-colors"></div>
                        <CheckCircle size={14} className="absolute top-0.5 left-0.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-xs text-gray-500 leading-relaxed pt-0.5 group-hover:text-gray-700 transition-colors">
                         Tôi đồng ý với <a href="#" className="font-bold underline text-navy">Điều khoản dịch vụ</a> và <a href="#" className="font-bold underline text-navy">Chính sách bảo mật</a> của BeeLearn.
                      </span>
                   </label>

                   <button disabled={isLoading} className="w-full mt-2 h-13 rounded-xl bg-[#7a0010] text-white font-extrabold text-lg flex items-center justify-center hover:bg-[#5a000c] transition-all shadow-lg shadow-[#7a0010]/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed">
                      {isLoading ? 'Đang xử lý...' : 'Đăng ký ngay'}
                   </button>
                </form>

                <div className="mt-8">
                   <div className="relative flex py-2 items-center">
                      <div className="flex-grow border-t border-gray-200"></div>
                      <span className="flex-shrink-0 mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Hoặc đăng ký bằng</span>
                      <div className="flex-grow border-t border-gray-200"></div>
                   </div>

                   <div className="grid grid-cols-2 gap-4 mt-4">
                      <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm font-bold text-sm text-gray-700">
                         <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
                         Google
                      </button>
                      <button className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-colors shadow-sm font-bold text-sm text-gray-700 group">
                         <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5 group-hover:brightness-0 group-hover:invert transition opacity-80" alt="Facebook" />
                         Facebook
                      </button>
                   </div>
                   
                   <p className="mt-6 text-center text-sm text-gray-500">
                     Đã có tài khoản? <Link to="/login" className="font-bold text-[#9f0009] hover:underline">Đăng nhập ngay</Link>
                   </p>
                </div>
             </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
