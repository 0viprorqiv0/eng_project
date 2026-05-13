import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';
import { BeeBotChat } from './BeeBotChat';

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<{title: string, message: string} | null>(null);
  const prevUnreadRef = useRef(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
      prevUnreadRef.current = res.unread_count || 0;
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      const newCount = res.unread_count || 0;
      
      // Smart Logic: If count increased, fetch full notifs and show toast
      if (newCount > prevUnreadRef.current) {
        const fullRes = await api.get('/notifications');
        const latestNotif = fullRes.notifications[0];
        if (latestNotif) {
          setActiveToast({ title: latestNotif.title, message: latestNotif.message });
          setNotifications(fullRes.notifications);
          setTimeout(() => setActiveToast(null), 5000); // Hide after 5s
        }
      }
      
      setUnreadCount(newCount);
      prevUnreadRef.current = newCount;
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000); // 15 seconds polling for snappier notifications

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async (id: number) => {
    try {
      // Don't duplicate requests if already read
      const notification = notifications.find(n => n.id === id);
      if (notification && notification.is_read) return;

      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllAsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Math.floor((new Date().getTime() - new Date(dateStr).getTime()) / 60000);
    if (diff < 1) return 'Vừa xong';
    if (diff < 60) return `${diff} phút trước`;
    const h = Math.floor(diff / 60);
    if (h < 24) return `${h} giờ trước`;
    return `${Math.floor(h / 24)} ngày trước`;
  };

  const roleLabel = user?.role === 'admin' ? 'Quản trị viên cấp cao' : user?.role === 'teacher' ? 'Giảng viên cấp cao' : 'Học viên';

  const navItems = user?.role === 'admin' ? [
    { icon: 'dashboard', label: 'Bảng điều khiển', to: '/dashboard/admin' },
    { icon: 'people', label: 'Quản lý tài khoản', to: '/dashboard/admin/users' },
    { icon: 'library_books', label: 'Quản lý khóa học', to: '/dashboard/admin/courses' },
    { icon: 'work', label: 'Quản lý tuyển dụng', to: '/dashboard/admin/recruitment' },
    { icon: 'assignment', label: 'Bài tập', to: '/dashboard/assignments' },
    { icon: 'calendar_today', label: 'Lịch học', to: '/dashboard/schedule' },
    { icon: 'notifications', label: 'Thông báo', to: '/dashboard/notifications' },
    { icon: 'campaign', label: 'Gửi thông báo', to: '/dashboard/send-notification' },
    { icon: 'bar_chart', label: 'Kết quả Placement Test', to: '/dashboard/admin/placement-results' },
    { icon: 'settings', label: 'Cài đặt', to: '/dashboard/settings' },
  ] : [
    { icon: 'dashboard', label: 'Bảng điều khiển', to: user?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student' },
    { icon: 'school', label: 'Khóa học của tôi', to: '/dashboard/courses' },
    ...(user?.role === 'teacher' ? [{ icon: 'people', label: 'Học viên', to: '/dashboard/teacher/students' }] : []),
    { icon: 'assignment', label: 'Bài tập', to: '/dashboard/assignments' },
    { icon: 'calendar_today', label: 'Lịch học', to: '/dashboard/schedule' },
    { icon: 'notifications', label: 'Thông báo', to: '/dashboard/notifications' },
    ...(user?.role === 'teacher' ? [{ icon: 'campaign', label: 'Gửi thông báo', to: '/dashboard/send-notification' }] : []),
    { icon: 'settings', label: 'Cài đặt', to: '/dashboard/settings' },
  ];

  return (
    <div className="bg-[#faf9fd] text-[#1a1c1f] antialiased min-h-screen">
      {/* Sidebar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#faf9fd] flex flex-col p-4 border-r border-slate-100 text-sm font-medium">
        <div className="mb-10 px-2 flex items-center gap-3">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
              {/* Back Wing */}
              <ellipse cx="24" cy="14" rx="6" ry="10" transform="rotate(30 24 14)" className="fill-navy/20" />
              
              {/* Front Wing */}
              <ellipse cx="16" cy="14" rx="6" ry="10" transform="rotate(-30 16 14)" className="fill-navy/30" />
              
              {/* Stinger */}
              <path d="M8 24L2 24" strokeWidth="3" strokeLinecap="round" className="stroke-navy" />
              
              {/* Body */}
              <rect x="6" y="16" width="28" height="16" rx="8" className="fill-beered" />
              
              {/* Stripes */}
              <line x1="14" y1="16" x2="14" y2="32" strokeWidth="4" className="stroke-navy" />
              <line x1="22" y1="16" x2="22" y2="32" strokeWidth="4" className="stroke-navy" />
              
              {/* Eye */}
              <circle cx="28" cy="22" r="2.5" className="fill-navy" />
              <circle cx="29" cy="21" r="1" className="fill-white" />
              
              {/* Antennae */}
              <path d="M26 16 Q 28 8 32 10" strokeWidth="2.5" fill="none" strokeLinecap="round" className="stroke-navy" />
              <circle cx="32" cy="10" r="1.5" className="fill-navy" />
            </svg>
          </div>
          <div>
            <h1 className="font-headline font-extrabold text-[#13375F] text-lg leading-none">
              {user?.role === 'admin' ? 'BeeLearn Admin' : user?.role === 'teacher' ? 'BeeLearn Teacher' : 'BeeLearn LMS'}
            </h1>
          </div>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item, idx) => (
            <NavLink
              key={idx}
              to={item.to}
              end={idx === 0}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-[#13375F] text-white shadow-lg shadow-[#13375f]/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-[#13375F] hover:translate-x-1'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-4">
          <Link to="/" className="block bg-[#13375f]/10 p-4 rounded-xl border border-[#13375f]/20 hover:bg-[#13375f]/20 transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#13375f] group-hover:scale-110 transition-transform">home</span>
              <div>
                <p className="text-xs font-bold text-[#13375f]">Trang chủ</p>
                <p className="text-[11px] text-[#51667c] leading-relaxed">Quay về trang chủ BeeLearn</p>
              </div>
            </div>
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all w-full">
            <span className="material-symbols-outlined">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Top App Bar */}
        <header className="fixed top-0 right-0 left-64 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-slate-100">
          <div className="flex items-center bg-[#e8e8ec] px-4 py-2 rounded-xl w-96">
            <span className="material-symbols-outlined text-[#73777f] text-xl mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#43474e]/50 outline-none" placeholder="Tìm kiếm khóa học, học viên..." type="text" />
          </div>
          <div className="flex items-center gap-4">
            
            {/* Notification Dropdown Container */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  if (!isDropdownOpen && notifications.length === 0) {
                    fetchNotifications();
                  }
                }}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors relative ${isDropdownOpen ? 'bg-[#13375f] text-white' : 'hover:bg-slate-50 text-[#4b6076]'}`}
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 flex min-w-[12px] h-[12px] items-center justify-center bg-[#ba1a1a] rounded-full border border-white text-[8px] font-bold text-white px-[3px]">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-[#fcfcfd]">
                    <h3 className="font-bold text-[#002143]">Thông báo</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={markAllAsRead}
                        className="text-[11px] font-bold text-[#13375f] hover:text-[#0b1e33] hover:underline transition-all"
                      >
                        Đánh dấu tất cả đã đọc
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-[#51667c]">
                        <span className="material-symbols-outlined text-4xl text-[#e8e8ec] mb-2">notifications_off</span>
                        <p className="text-sm font-medium">Bạn không có thông báo nào</p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              if (notif.link) navigate(notif.link);
                              setIsDropdownOpen(false);
                            }}
                            className={`p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-all border-b border-slate-50/50 last:border-0 relative ${!notif.is_read ? 'bg-blue-50/40' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden transition-transform duration-300 group-hover:scale-110 ${!notif.is_read ? 'bg-[#13375f] text-white shadow-lg shadow-[#13375f]/20' : 'bg-slate-100 text-[#51667c]'}`}>
                              <span className="material-symbols-outlined text-xl select-none">{notif.icon || 'notifications'}</span>
                            </div>
                            <div className="flex-1 min-w-0 pr-2">
                              <p className={`text-sm tracking-tight mb-0.5 truncate ${!notif.is_read ? 'font-black text-[#002143]' : 'font-bold text-slate-700'}`}>{notif.title}</p>
                              <p className="text-[12px] text-slate-500 line-clamp-2 leading-relaxed mb-2">{notif.message}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{timeAgo(notif.created_at)}</p>
                                {notif.is_pinned && (
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                )}
                                {notif.is_pinned && (
                                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[10px]">push_pin</span> Đã ghim
                                  </span>
                                )}
                              </div>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0 shadow-sm animate-pulse"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 border-t border-slate-50 bg-[#fcfcfd] text-center">
                    <button 
                      onClick={() => setIsDropdownOpen(false)}
                      className="text-xs font-bold text-[#43474e] hover:text-[#002143] transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-[#4b6076]">help</span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-bold text-[#002143] leading-none">{user?.name || 'Người dùng'}</p>
                <p className="text-[10px] text-[#51667c] font-medium tracking-wider uppercase">{roleLabel}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-[#13375f] flex items-center justify-center text-white font-bold text-sm">
                {(user?.name || 'U')[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-24 px-8 pb-12">
          <Outlet />
        </div>

        {/* Global Toast Notification */}
        <AnimatePresence>
          {activeToast && (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed bottom-6 right-6 z-[60] bg-[#13375f] text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm border border-white/20 backdrop-blur-md"
            >
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{activeToast.title}</p>
                <p className="text-xs text-white/80 line-clamp-2">{activeToast.message}</p>
              </div>
              <button onClick={() => setActiveToast(null)} className="p-1 hover:bg-white/10 rounded-lg">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        {/* BeeBot AI Chatbot */}
        <BeeBotChat />
      </main>
    </div>
  );
}
