import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/AuthContext';
import { api } from '../../lib/api';

export function SettingsPage() {
  const { user, updateUser } = useAuth();
  const role = user?.role || 'student';
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [profile, setProfile] = useState<any>({});
  const [prefs, setPrefs] = useState<any>({
    email_notifications: true,
    push_notifications: false,
    marketing_emails: false,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const data = await api.get('/settings');
        if (data) {
          setProfile(data.profile || {});
          setPrefs(data.preferences || {});
        }
      } catch (err) {
        console.error('Failed to load settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleProfileChange = (e: any) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePrefChange = (e: any) => {
    setPrefs({ ...prefs, [e.target.name]: e.target.checked });
  };

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setMessage('');
      const data = await api.put('/settings', {
        name: profile.name,
        phone: profile.phone,
        bio: profile.bio,
        email_notifications: prefs.email_notifications,
        push_notifications: prefs.push_notifications,
        marketing_emails: prefs.marketing_emails
      });
      setMessage('Cập nhật cài đặt thành công!');
      if (updateUser) {
        updateUser({ name: data.profile.name, avatar_url: data.profile.avatar_url });
      }
    } catch (err) {
      setMessage('Lỗi khi lưu cài đặt');
      console.error(err);
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAvatarSelect = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setMessage('Đang tải ảnh lên...');
      const formData = new FormData();
      formData.append('avatar', file);
      
      const token = localStorage.getItem('auth_token');
      const res = await fetch('http://localhost:8000/api/settings/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setProfile({ ...profile, avatar_url: data.avatar_url });
        if (updateUser) {
          updateUser({ avatar_url: data.avatar_url });
        }
        setMessage('Cập nhật ảnh đại diện thành công!');
      } else {
        setMessage('Lỗi tải ảnh');
      }
    } catch (err) {
      setMessage('Lỗi tải ảnh');
    } finally {
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Hồ sơ cá nhân', icon: 'person' },
    { id: 'notifications', label: 'Thông báo', icon: 'notifications' },
    { id: 'security', label: 'Bảo mật', icon: 'lock' },
    ...(role === 'admin' ? [{ id: 'system', label: 'Hệ thống', icon: 'settings' }] : []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-headline font-extrabold text-[#002143]">Cài đặt</h1>
          <p className="text-[#43474e] mt-1">Quản lý tài khoản, thông báo và tùy chỉnh cá nhân</p>
        </div>
        {message && (
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">info</span>
            {message}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tab Navigation */}
        <div className="bg-white p-4 rounded-2xl shadow-sm h-fit space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${activeTab === tab.id ? 'bg-[#13375f] text-white shadow-lg shadow-[#13375f]/20' : 'text-[#43474e] hover:bg-slate-50'}`}>
              <span className="material-symbols-outlined text-xl">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-8 relative">
              {isLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-[2rem]">Đang tải...</div>}
              <div className="flex items-center gap-6">
                <div className="relative">
                  {profile.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-sm" />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-[#13375f] flex items-center justify-center text-white text-2xl font-bold">
                      {(profile.name || 'U')[0]}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#002143]">{profile.name || 'User'}</h3>
                  <p className="text-sm text-[#43474e] capitalize">{role}</p>
                  <input type="file" ref={fileInputRef} onChange={handleAvatarSelect} className="hidden" accept="image/*" />
                  <button onClick={() => fileInputRef.current?.click()} className="mt-2 flex items-center gap-1 text-xs font-bold text-[#13375f] hover:underline">
                    <span className="material-symbols-outlined text-[14px]">upload</span>Thay ảnh đại diện
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Họ và tên</label>
                  <input name="name" value={profile.name || ''} onChange={handleProfileChange} className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm text-[#002143] focus:ring-2 focus:ring-[#13375f]/20 outline-none" placeholder="Nhập họ và tên" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Email</label>
                  <input disabled value={profile.email || ''} className="w-full bg-slate-100 border-none rounded-xl px-4 py-3 text-sm text-[#73777f] outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Số điện thoại</label>
                  <input name="phone" value={profile.phone || ''} onChange={handleProfileChange} className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm text-[#002143] focus:ring-2 focus:ring-[#13375f]/20 outline-none" placeholder="Nhập SĐT" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#002143] block mb-2">Giới thiệu</label>
                <textarea name="bio" value={profile.bio || ''} onChange={handleProfileChange} className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm text-[#002143] focus:ring-2 focus:ring-[#13375f]/20 outline-none h-24 resize-none" placeholder="Giới thiệu bản thân..." />
              </div>
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-[#13375f] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50">
                {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6 relative">
              {isLoading && <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-[2rem]">Đang tải...</div>}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#002143]">Tùy chỉnh thông báo</h3>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-slate-100 text-[#002143] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#d4e3ff] transition-all disabled:opacity-50">
                  {isSaving ? 'Đang lưu...' : 'Lưu cài đặt'}
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'email_notifications', label: 'Thông báo qua Email (Hệ thống)', desc: 'Nhận thông báo qua email khi có cập nhật quan trọng' },
                  { name: 'push_notifications', label: 'Thông báo đẩy (Trình duyệt)', desc: 'Nhận thông báo Pop-up ngay trên trình duyệt' },
                  { name: 'marketing_emails', label: 'Email Marketing', desc: 'Nhận email khuyến mãi và tin tức mới nhất từ BeeLearn' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-[#f4f3f7] rounded-2xl">
                    <div>
                      <p className="text-sm font-bold text-[#002143]">{item.label}</p>
                      <p className="text-xs text-[#43474e]">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" name={item.name} checked={!!prefs[item.name]} onChange={handlePrefChange} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13375f]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#002143]">Bảo mật tài khoản</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Mật khẩu hiện tại</label>
                  <input type="password" className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#13375f]/20 outline-none" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Mật khẩu mới</label>
                  <input type="password" className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#13375f]/20 outline-none" placeholder="••••••••" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#002143] block mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" className="w-full bg-[#f4f3f7] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#13375f]/20 outline-none" placeholder="••••••••" />
                </div>
              </div>
              <button className="bg-[#13375f] text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">Đổi mật khẩu</button>

              <div className="pt-6 border-t border-slate-100">
                <h4 className="text-sm font-bold text-[#73000a] mb-2">Vùng nguy hiểm</h4>
                <p className="text-xs text-[#43474e] mb-4">Xóa tài khoản vĩnh viễn. Thao tác này không thể hoàn tác.</p>
                <button className="px-6 py-2 border-2 border-[#73000a] text-[#73000a] rounded-xl text-xs font-bold hover:bg-[#73000a] hover:text-white transition-all">Xóa tài khoản</button>
              </div>
            </div>
          )}

          {/* System Tab (Admin Only) */}
          {activeTab === 'system' && role === 'admin' && (
            <div className="bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-[#002143]">Cài đặt Hệ thống</h3>
              {[
                { label: 'Chế độ bảo trì', desc: 'Tạm ngưng truy cập cho học viên để bảo trì hệ thống' },
                { label: 'Đăng ký mới', desc: 'Cho phép người dùng mới đăng ký tài khoản' },
                { label: 'Tự động sao lưu', desc: 'Sao lưu dữ liệu hệ thống hàng ngày lúc 02:00' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#f4f3f7] rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-[#002143]">{item.label}</p>
                    <p className="text-xs text-[#43474e]">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={i > 0} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#13375f]"></div>
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
