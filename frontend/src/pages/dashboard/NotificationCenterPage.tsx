import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle2, Trash2, Calendar, Filter, Search, Pin } from 'lucide-react';
import { api } from '../../lib/api';
import toast from 'react-hot-toast';

export function NotificationCenterPage() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifs = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const markRead = async (id: number) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const markAllProgress = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (e) {
      toast.error('Không thể thực hiện thao tác này');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) return;
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Đã xóa thông báo');
    } catch (e) {
      toast.error('Không thể xóa thông báo');
    }
  };

  const handleTogglePin = async (id: number) => {
    try {
      const res = await api.post(`/notifications/${id}/toggle-pin`);
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, is_pinned: res.is_pinned } : n);
        // Re-sort: pinned first, then by date
        return [...updated].sort((a, b) => {
          if (a.is_pinned === b.is_pinned) {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          }
          return a.is_pinned ? -1 : 1;
        });
      });
      toast.success(res.message);
    } catch (e) {
      toast.error('Không thể thay đổi trạng thái ghim');
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[#13375f] mb-2 font-headline">Trung tâm Thông báo</h1>
          <p className="text-slate-500">Xem và quản lý tất cả cập nhật từ khóa học và hệ thống BeeLearn.</p>
        </div>
        <button 
          onClick={markAllProgress}
          className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm font-bold text-[#13375f] hover:bg-slate-50 transition-all shadow-sm"
        >
          <CheckCircle2 size={18} />
          Đánh dấu tất cả đã đọc
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-[#fcfcfd] flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm kiếm thông báo..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border-2 border-slate-100 focus:border-[#13375f] focus:outline-none text-sm transition-all"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white border-2 border-slate-100 text-sm font-bold text-slate-600">
            <Filter size={18} />
            <span>Lọc theo: Tất cả</span>
          </div>
        </div>

        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center p-20">
              <div className="w-10 h-10 border-4 border-slate-200 border-t-[#13375f] rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-20 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <Bell size={48} className="text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">Không có thông báo mới</h3>
              <p className="text-slate-500 max-w-xs">Hệ thống đang hoạt động ổn định. Mọi cập nhật mới sẽ xuất hiện tại đây.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((notif, idx) => (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={`p-6 flex flex-col md:flex-row gap-6 transition-all cursor-pointer ${!notif.is_read ? 'bg-[#13375f]/[0.02]' : 'hover:bg-slate-50'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${!notif.is_read ? 'bg-[#13375f] text-white shadow-lg shadow-[#13375f]/20' : 'bg-slate-100 text-slate-400'}`}>
                    <span className="material-symbols-outlined text-2xl">
                      {notif.icon || 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${!notif.is_read ? 'bg-beered text-white' : 'bg-slate-100 text-slate-400'}`}>
                         {notif.type || 'SYSTEM'}
                       </span>
                       <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                         <Calendar size={12} />
                         {new Date(notif.created_at).toLocaleDateString('vi-VN')}
                       </span>
                    </div>
                    <h4 className={`text-lg mb-1 leading-tight ${!notif.is_read ? 'font-black text-[#13375f]' : 'font-bold text-slate-600'}`}>{notif.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">{notif.message}</p>
                  </div>
                  <div className="flex md:flex-col justify-end items-center gap-2 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleTogglePin(notif.id); }}
                      className={`p-3 rounded-xl transition-all ${notif.is_pinned ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-blue-600 hover:bg-blue-50'}`}
                      title={notif.is_pinned ? 'Bỏ ghim' : 'Ghim thông báo'}
                    >
                      <Pin size={20} className={notif.is_pinned ? 'fill-current' : ''} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                      className="p-3 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Xóa thông báo"
                    >
                      <Trash2 size={20} />
                    </button>
                    {!notif.is_read && <div className="w-2.5 h-2.5 rounded-full bg-beered animate-pulse mt-1 mx-auto shadow-sm"></div>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-100 text-center">
           <p className="text-xs font-bold text-slate-400">Hiển thị {notifications.length} thông báo gần nhất</p>
        </div>
      </div>
    </div>
  );
}
