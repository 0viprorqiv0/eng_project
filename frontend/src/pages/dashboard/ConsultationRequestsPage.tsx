import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, CheckCircle2, Clock, Zap } from 'lucide-react';
import { api } from '../../lib/api';

export function ConsultationRequestsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, new: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/consultations');
      setRequests(res.data || []);
      setStats(res.stats || { total: 0, new: 0, resolved: 0 });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markResolved = async (id: number) => {
    try {
      await api.put(`/consultations/${id}`, { status: 'resolved' });
      fetchRequests(); // Refresh data
    } catch (e) {
      console.error('Failed to update status', e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase">MỚI</span>;
      case 'contacting':
        return <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-bold uppercase">Đang liên hệ</span>;
      case 'resolved':
      default:
        return <span className="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-xs font-bold uppercase">Đã liên hệ</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-extrabold text-[#13375f] mb-2 font-headline">Quản lý Yêu cầu Tư vấn</h1>
          <p className="text-slate-500">Theo dõi và phản hồi các yêu cầu từ học viên tiềm năng.</p>
        </div>
        <div className="flex bg-white rounded-full shadow-sm border border-slate-100 overflow-hidden">
          <button className="px-6 py-2.5 bg-white text-slate-700 font-bold border-r border-slate-100 hover:bg-slate-50">
            Chưa liên hệ <span className="ml-2 px-2 py-0.5 bg-red-600 text-white rounded-full text-xs">{stats.new}</span>
          </button>
          <button className="px-6 py-2.5 bg-slate-50 text-slate-500 font-bold hover:text-slate-700">Đã liên hệ</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-8 w-12 h-16 bg-[#13375f] rounded-b-2xl flex items-center justify-center shadow-lg -rotate-12 translate-y-[-10px]">
            <Zap className="text-white" size={24} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">TỈ LỆ PHẢN HỒI</p>
          <p className="text-4xl font-black text-[#13375f] mb-2">92%</p>
          <p className="text-sm font-bold text-green-500 flex items-center gap-1">↗ +5% so với tuần trước</p>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-8 w-12 h-16 bg-beered rounded-b-2xl flex items-center justify-center shadow-lg rotate-12 translate-y-[-10px]">
            <Clock className="text-white" size={24} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">THỜI GIAN CHỜ TB</p>
          <p className="text-4xl font-black text-[#13375f] mb-2">14m</p>
          <p className="text-sm text-slate-500">Mục tiêu: Dưới 15 phút</p>
        </div>
        <div className="bg-[#eaf1ff] p-6 rounded-[2rem] border border-blue-100 relative overflow-hidden">
          <div className="absolute top-0 right-8 w-12 h-16 bg-blue-200 rounded-b-2xl flex items-center justify-center shadow-lg">
            <CheckCircle2 className="text-[#13375f]" size={24} />
          </div>
          <p className="text-xs font-bold text-[#13375f]/70 uppercase tracking-wider mb-2">YÊU CẦU HOÀN TẤT</p>
          <p className="text-4xl font-black text-[#13375f] mb-2">{stats.resolved}</p>
          <p className="text-sm text-[#13375f]/70">Trong tháng này</p>
        </div>
      </div>

      {/* List */}
      <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#13375f]">Danh sách yêu cầu mới nhất</h3>
          <button className="text-sm font-bold text-[#13375f] hover:underline flex items-center gap-1">
            Xem tất cả →
          </button>
        </div>

        {loading ? (
           <div className="flex justify-center p-10"><div className="w-8 h-8 border-4 border-slate-200 border-t-[#13375f] rounded-full animate-spin"></div></div>
        ) : requests.length === 0 ? (
          <p className="text-center text-slate-500 py-10">Không có yêu cầu tư vấn nào.</p>
        ) : (
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                  <th className="px-6 py-4 font-bold">HỌC VIÊN</th>
                  <th className="px-6 py-4 font-bold">THỜI GIAN GỬI</th>
                  <th className="px-6 py-4 font-bold">TRẠNG THÁI</th>
                  <th className="px-6 py-4 font-bold text-right">HÀNH ĐỘNG</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {requests.map((req) => (
                  <tr key={req.id} className={`hover:bg-slate-50 transition-colors ${req.status === 'new' ? 'bg-red-50/10' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center text-sm ${req.status === 'new' ? 'bg-[#13375f]/10 text-[#13375f]' : 'bg-slate-100 text-slate-500'}`}>
                          {req.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-[#13375f]">{req.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            {req.email ? req.email + ' • ' : ''} {req.phone}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-600">{new Date(req.created_at).toLocaleString('vi-VN')}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-slate-400 hover:text-[#13375f] transition-colors p-2">
                          <Eye size={20} />
                        </button>
                        {req.status !== 'resolved' ? (
                          <button 
                            onClick={() => markResolved(req.id)}
                            className="px-4 py-2 bg-[#13375f] text-white text-xs font-bold rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
                          >
                            Đánh dấu đã liên hệ
                          </button>
                        ) : (
                          <button disabled className="px-4 py-2 border-2 border-emerald-100 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-xl cursor-not-allowed">
                            Đã hoàn tất
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        {/* Support Card */}
        <div className="bg-[#13284b] p-8 rounded-[2rem] text-white relative overflow-hidden">
           <div className="absolute -right-10 -bottom-10 opacity-10">
             <div className="w-40 h-40 bg-white rotate-45 rounded-xl"></div>
           </div>
           <h3 className="text-2xl font-bold mb-4 relative z-10">Cần hỗ trợ kỹ thuật?</h3>
           <p className="text-white/70 text-sm leading-relaxed mb-6 max-w-sm relative z-10">
             Liên hệ ngay với đội ngũ IT nếu bạn gặp bất kỳ vấn đề nào trong quá trình quản lý yêu cầu tư vấn.
           </p>
           <button className="px-6 py-3 bg-white text-[#13284b] font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors relative z-10">
             Gửi ticket hỗ trợ
           </button>
        </div>

        {/* Tips Card */}
        <div className="bg-slate-100 p-8 rounded-[2rem] border border-slate-200">
           <div className="flex items-center gap-3 mb-6 focus">
             <div className="p-2 bg-white rounded-full shadow-sm"><span className="material-symbols-outlined text-[#13375f] text-xl">lightbulb</span></div>
             <h3 className="text-xl font-bold text-[#13375f]">Mẹo quản lý</h3>
           </div>
           <ul className="space-y-4">
             <li className="flex gap-4">
               <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#13375f] shrink-0 shadow-sm">1</div>
               <p className="text-sm text-slate-600 leading-relaxed">Phản hồi yêu cầu trong vòng <strong className="text-slate-800">15 phút</strong> giúp tăng tỉ lệ chốt thành công thêm 40%.</p>
             </li>
             <li className="flex gap-4">
               <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-xs font-bold text-[#13375f] shrink-0 shadow-sm">2</div>
               <p className="text-sm text-slate-600 leading-relaxed">Sử dụng tính năng <strong className="text-slate-800">Broadcast</strong> để gửi thông tin khóa học mới nhất cho các yêu cầu tiềm năng.</p>
             </li>
           </ul>
        </div>
      </div>
    </div>
  );
}
