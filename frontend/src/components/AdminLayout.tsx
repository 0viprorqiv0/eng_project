import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut,
  Bell,
  Search,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from './AuthContext';

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Courses', path: '/admin/courses', icon: BookOpen },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-colors duration-200">
        <div className="p-6">
          <h1 className="font-bold text-xl text-[#0f172a] tracking-tight">BeeLearn Admin</h1>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                ${isActive 
                  ? 'bg-[#0f172a] text-white shadow-md' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }
              `}
            >
              <item.icon size={18} strokeWidth={2.5} />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-6 space-y-2 border-slate-200">
          <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-slate-600 hover:bg-slate-100 transition-colors font-medium text-sm">
            <Settings size={18} strokeWidth={2.5} />
            <span>Support</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={18} strokeWidth={2.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-8 z-10 sticky top-0">
          
          <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-96 border border-transparent focus-within:ring-2 focus-within:ring-slate-200 transition-all">
            <Search className="text-slate-400" size={16} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm text-slate-700 placeholder-slate-400 font-medium"
            />
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-slate-500 hover:text-[#0f172a] transition-colors">
              <Bell size={20} strokeWidth={2.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="relative text-slate-500 hover:text-[#0f172a] transition-colors">
              <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-500">?</div>
            </button>
            <div className="h-6 w-px bg-slate-300"></div>
            <div className="flex items-center gap-3">
              <img 
                src={user?.avatar_url || "https://ui-avatars.com/api/?name=Admin&background=ef4444&color=fff"} 
                alt="Profile" 
                className="w-8 h-8 rounded-full border border-slate-200 shadow-sm"
              />
              <p className="text-sm font-semibold text-[#0f172a]">{user?.name || 'System Admin'}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
