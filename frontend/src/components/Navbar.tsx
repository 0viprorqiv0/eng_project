import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Bell, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const currentView = location.pathname;
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const fetchNotifs = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifs();
      const interval = setInterval(() => {
        api.get('/notifications/unread-count').then(res => setUnreadCount(res.unread_count || 0));
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // Click outside to close
  useEffect(() => {
    const handeClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', handeClick);
    return () => document.removeEventListener('mousedown', handeClick);
  }, []);

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const dashboardUrl = user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                <ellipse cx="24" cy="14" rx="6" ry="10" transform="rotate(30 24 14)" className="fill-navy/20" />
                <ellipse cx="16" cy="14" rx="6" ry="10" transform="rotate(-30 16 14)" className="fill-navy/30" />
                <path d="M8 24L2 24" strokeWidth="3" strokeLinecap="round" className="stroke-navy" />
                <rect x="6" y="16" width="28" height="16" rx="8" className="fill-beered" />
                <line x1="14" y1="16" x2="14" y2="32" strokeWidth="4" className="stroke-navy" />
                <line x1="22" y1="16" x2="22" y2="32" strokeWidth="4" className="stroke-navy" />
                <circle cx="28" cy="22" r="2.5" className="fill-navy" />
                <circle cx="29" cy="21" r="1" className="fill-white" />
                <path d="M26 16 Q 28 8 32 10" strokeWidth="2.5" fill="none" strokeLinecap="round" className="stroke-navy" />
                <circle cx="32" cy="10" r="1.5" className="fill-navy" />
              </svg>
            </div>
            <span className="text-2xl font-extrabold text-navy tracking-tight">Bee<span className="text-beered">Learn</span></span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Trang chủ</Link>
            <Link to="/about" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/about' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Giới thiệu</Link>
            <Link to="/courses" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/courses' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Khóa học</Link>
            <Link to="/library" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/library' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Thư viện</Link>
            <Link to="/achievements" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/achievements' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Bảng vàng</Link>
            <Link to="/careers" onClick={scrollToTop} className={`font-semibold whitespace-nowrap transition-colors ${currentView === '/careers' ? 'text-beered' : 'text-navy hover:text-beered'}`}>Tuyển dụng</Link>
          </nav>

          {/* User Section / Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => {
                      setIsNotifOpen(!isNotifOpen);
                      if (!isNotifOpen) fetchNotifs();
                    }}
                    className={`p-2.5 rounded-full transition-colors relative ${isNotifOpen ? 'bg-beered/10 text-beered' : 'text-navy hover:bg-gray-100'}`}
                  >
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-beered text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  <AnimatePresence>
                    {isNotifOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-96 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden"
                      >
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                          <h3 className="font-bold text-navy">Thông báo</h3>
                          <button onClick={markAllRead} className="text-xs font-bold text-beered hover:underline">Ghi nhận đã đọc</button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center text-gray-400">
                              <Bell className="mx-auto mb-3 opacity-20" size={40} />
                              <p>Không có thông báo nào</p>
                            </div>
                          ) : (
                            notifications.map(notif => (
                              <div key={notif.id} className={`p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notif.is_read ? 'bg-beered/5' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!notif.is_read ? 'bg-beered text-white' : 'bg-gray-100 text-gray-500'}`}>
                                  <Bell size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className={`text-sm mb-0.5 ${!notif.is_read ? 'font-bold text-navy' : 'text-gray-600'}`}>{notif.title}</p>
                                  <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{new Date(notif.created_at).toLocaleDateString('vi-VN')}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <Link to="/dashboard/notifications" className="block p-3 text-center text-xs font-bold text-navy hover:bg-gray-50 transition-colors border-t border-gray-100"> Xem tất cả </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Toggle */}
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-3 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors border border-gray-100"
                  >
                    <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center font-bold text-sm">
                      {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full rounded-full object-cover" /> : user.name[0]}
                    </div>
                    <span className="text-sm font-bold text-navy truncate max-w-[100px]">{user.name.split(' ').pop()}</span>
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden py-2"
                      >
                        <Link to={dashboardUrl} className="flex items-center gap-3 px-4 py-3 text-sm text-navy hover:bg-gray-50 font-semibold transition-colors">
                          <LayoutDashboard size={18} className="text-beered" /> Bảng điều khiển
                        </Link>
                        <Link to="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 text-sm text-navy hover:bg-gray-50 font-semibold transition-colors">
                          <UserIcon size={18} className="text-beered" /> Hồ sơ cá nhân
                        </Link>
                        <div className="h-px bg-gray-100 my-1 mx-4"></div>
                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold transition-colors w-full text-left">
                          <LogOut size={18} /> Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2.5 border-2 border-navy text-navy font-bold rounded-full hover:bg-navy hover:text-white transition-all whitespace-nowrap">Đăng nhập</Link>
                <Link to="/register" className="px-5 py-2.5 bg-navy text-white font-bold rounded-full hover:bg-opacity-90 transition-all shadow-md border-2 border-navy whitespace-nowrap">Đăng ký</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-navy p-2">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 overflow-hidden"
          >
            {['Trang chủ', 'Giới thiệu', 'Khóa học', 'Thư viện', 'Bảng vàng', 'Tuyển dụng'].map((label, idx) => {
              const paths = ['/', '/about', '/courses', '/library', '/achievements', '/careers'];
              return (
                <Link key={idx} to={paths[idx]} onClick={scrollToTop} className="block w-full text-left text-navy font-semibold py-2">
                  {label}
                </Link>
              );
            })}
            
            <div className="pt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to={dashboardUrl} onClick={() => setIsMenuOpen(false)} className="w-full py-3 text-center bg-navy text-white font-bold rounded-xl flex items-center justify-center gap-2">
                    <LayoutDashboard size={20} /> Vào Dashboard
                  </Link>
                  <button onClick={handleLogout} className="w-full py-3 text-center text-red-600 font-bold border-2 border-red-100 rounded-xl">
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={scrollToTop} className="w-full py-3 text-center text-navy font-bold border-2 border-navy rounded-xl">Đăng nhập</Link>
                  <Link to="/register" onClick={scrollToTop} className="w-full py-3 text-center bg-navy text-white font-bold rounded-xl">Đăng ký</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
