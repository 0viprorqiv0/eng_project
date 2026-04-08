import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unread_count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      setUnreadCount(res.unread_count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // 30 seconds polling

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

  const roleLabel = user?.role === 'admin' ? 'Super Administrator' : user?.role === 'teacher' ? 'Senior Lecturer' : 'Student';

  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', to: user?.role === 'admin' ? '/dashboard/admin' : user?.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student' },
    { icon: 'school', label: 'My Courses', to: '/dashboard/courses' },
    ...(user?.role === 'teacher' ? [{ icon: 'people', label: 'Students', to: '/dashboard/teacher/students' }] : []),
    { icon: 'assignment', label: 'Assignments', to: '/dashboard/assignments' },
    { icon: 'calendar_today', label: 'Schedule', to: '/dashboard/schedule' },
    { icon: 'analytics', label: 'Reports', to: '/dashboard/reports' },
    { icon: 'settings', label: 'Settings', to: '/dashboard/settings' },
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
            <p className="text-xs text-[#51667c]">Academic Atelier</p>
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
          <div className="bg-[#13375f]/10 p-4 rounded-xl border border-[#13375f]/20">
            <p className="text-xs font-bold text-[#13375f] mb-2">PRO PLAN</p>
            <p className="text-[11px] text-[#51667c] mb-3 leading-relaxed">Access advanced analytics and unlimited storage.</p>
            <button className="w-full bg-[#13375F] text-white py-2 rounded-lg text-xs font-bold shadow-md hover:opacity-90 transition-opacity">Upgrade Plan</button>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all w-full">
            <span className="material-symbols-outlined">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-64 min-h-screen">
        {/* Top App Bar */}
        <header className="fixed top-0 right-0 left-64 z-40 bg-white/80 backdrop-blur-xl flex justify-between items-center px-8 py-4 border-b border-slate-100">
          <div className="flex items-center bg-[#e8e8ec] px-4 py-2 rounded-xl w-96">
            <span className="material-symbols-outlined text-[#73777f] text-xl mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-[#43474e]/50 outline-none" placeholder="Search courses, students, reports..." type="text" />
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
                            className={`p-4 flex gap-4 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 ${!notif.is_read ? 'bg-blue-50/30' : ''}`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${!notif.is_read ? 'bg-[#13375f] text-white' : 'bg-[#f4f3f7] text-[#51667c]'}`}>
                              <span className="material-symbols-outlined text-lg">{notif.icon || 'notifications'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm tracking-tight mb-0.5 ${!notif.is_read ? 'font-bold text-[#002143]' : 'font-semibold text-[#1a1c1f]'}`}>{notif.title}</p>
                              <p className="text-xs text-[#51667c] line-clamp-2 mb-1.5 leading-relaxed">{notif.message}</p>
                              <p className="text-[10px] font-bold text-[#8a99a8] uppercase">{timeAgo(notif.created_at)}</p>
                            </div>
                            {!notif.is_read && (
                              <div className="w-2 h-2 rounded-full bg-[#13375f] mt-1.5 flex-shrink-0"></div>
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
                <p className="text-sm font-bold text-[#002143] leading-none">{user?.name || 'User'}</p>
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
      </main>
    </div>
  );
}
