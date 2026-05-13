import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';

interface PlacementRecord {
  id: number; name: string; email: string; profile_type: string;
  current_level: string; score: number; total: number;
  level_result: string; suggested_course: string | null;
  ai_analysis: string | null; answers_summary: any;
  consent: boolean; created_at: string;
}

const PROFILE_LABEL: Record<string, string> = {
  student_11_12: '🎓 Học sinh', ielts: '🌍 IELTS', working: '💼 Đi làm',
};
const LEVEL_COLOR: Record<string, [string, string]> = {
  'Beginner': ['#fee2e2', '#b91c1c'], 'Elementary': ['#fef3c7', '#92400e'],
  'Intermediate': ['#dbeafe', '#1d4ed8'], 'Upper-Intermediate': ['#d1fae5', '#065f46'],
  'Advanced': ['#ede9fe', '#5b21b6'],
};

function maskEmail(email: string) {
  const [u, d] = email.split('@');
  return `${u[0]}***@${d}`;
}

function timeSince(dateStr: string) {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

function exportCSV(data: PlacementRecord[]) {
  const header = ['ID', 'Họ tên', 'Email', 'Profile', 'Điểm', 'Tổng', 'Trình độ', 'Khóa gợi ý', 'Thời gian'];
  const rows = data.map(r => [r.id, r.name, r.email, r.profile_type, r.score, r.total, r.level_result, r.suggested_course || '', r.created_at]);
  const csv = [header, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'placement_results.csv'; a.click();
  URL.revokeObjectURL(url);
}

export function AdminPlacementPage() {
  const [records, setRecords] = useState<PlacementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterProfile, setFilterProfile] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams();
        if (filterProfile) qs.set('profile_type', filterProfile);
        if (filterLevel) qs.set('level_result', filterLevel);
        qs.set('page', String(page));
        const query = `?${qs.toString()}`;
        const res = await api.get(`/admin/placement-results${query}`);
        setRecords(res.data || []);
        setTotal(res.total || 0);
        setLastPage(res.last_page || 1);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [filterProfile, filterLevel, page]);

  const cats = (r: PlacementRecord) => {
    try {
      const s = typeof r.answers_summary === 'string' ? JSON.parse(r.answers_summary) : r.answers_summary;
      const g = s.filter((a: any) => a.category === 'grammar' && a.isCorrect).length;
      const v = s.filter((a: any) => a.category === 'vocabulary' && a.isCorrect).length;
      const rd = s.filter((a: any) => a.category === 'reading' && a.isCorrect).length;
      return { g, v, rd };
    } catch { return null; }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto" style={{ fontFamily: 'Plus Jakarta Sans, Inter, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold" style={{ color: '#1e3a8a' }}>Kết quả Placement Test</h2>
          <span className="text-xs font-semibold px-3 py-1 rounded-full border" style={{ color: '#64748b', borderColor: '#e2e8f0' }}>
            Tổng: {total} kết quả
          </span>
        </div>
        <button onClick={() => exportCSV(records)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors"
          style={{ background: '#c53030' }}>
          <span className="material-symbols-outlined text-sm">download</span>
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-5 mb-6 flex flex-wrap gap-4 items-end shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#64748b' }}>Nhóm</label>
          <select value={filterProfile} onChange={e => { setFilterProfile(e.target.value); setPage(1); }}
            className="rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            <option value="">Tất cả</option>
            <option value="student_11_12">Học sinh</option>
            <option value="ielts">IELTS</option>
            <option value="working">Đi làm</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-bold uppercase tracking-wide" style={{ color: '#64748b' }}>Trình độ</label>
          <select value={filterLevel} onChange={e => { setFilterLevel(e.target.value); setPage(1); }}
            className="rounded-lg px-3 py-2.5 text-sm outline-none"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            <option value="">Tất cả</option>
            {['Beginner', 'Elementary', 'Intermediate', 'Upper-Intermediate', 'Advanced'].map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
        <button onClick={() => { setFilterProfile(''); setFilterLevel(''); setPage(1); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ml-auto"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b' }}>
          <span className="material-symbols-outlined text-sm">filter_list_off</span>
          Xóa bộ lọc
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid #e2e8f0' }}>
        {loading ? (
          <div className="flex items-center justify-center py-20" style={{ color: '#64748b' }}>
            <span className="material-symbols-outlined animate-spin mr-3">progress_activity</span>
            Đang tải...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <tr>
                  {['HỌC VIÊN', 'EMAIL', 'PROFILE', 'ĐIỂM', 'TRÌNH ĐỘ', 'KHÓA GỢI Ý', 'TRẠNG THÁI'].map(h => (
                    <th key={h} className="px-6 py-4 text-xs font-bold uppercase tracking-wide" style={{ color: '#64748b' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map(r => {
                  const levelColors = LEVEL_COLOR[r.level_result] || ['#f1f5f9', '#475569'];
                  const isExpanded = expandedId === r.id;
                  const c = cats(r);
                  return (
                    <React.Fragment key={r.id}>
                      <tr
                        className="transition-colors cursor-pointer"
                        style={{ borderLeft: isExpanded ? '4px solid #1e3a8a' : '4px solid transparent', background: isExpanded ? '#f8fafc' : undefined }}
                        onClick={() => setExpandedId(isExpanded ? null : r.id)}>
                        <td className="px-6 py-5 font-semibold" style={{ color: '#1e3a8a' }}>{r.name}</td>
                        <td className="px-6 py-5" style={{ color: '#64748b' }}>{maskEmail(r.email)}</td>
                        <td className="px-6 py-5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
                            style={{ background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' }}>
                            {PROFILE_LABEL[r.profile_type] || r.profile_type}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-bold" style={{ color: r.score / r.total >= 0.7 ? '#1e3a8a' : '#c53030' }}>
                          {r.score}/{r.total}
                        </td>
                        <td className="px-6 py-5">
                          <span className="px-2.5 py-1 rounded text-xs font-semibold"
                            style={{ background: levelColors[0], color: levelColors[1] }}>
                            {r.level_result}
                          </span>
                        </td>
                        <td className="px-6 py-5" style={{ color: '#64748b' }}>{r.suggested_course || '—'}</td>
                        <td className="px-6 py-5 text-xs" style={{ color: '#64748b' }}>{timeSince(r.created_at)}</td>
                      </tr>

                      {/* Expanded row */}
                      {isExpanded && (
                        <tr style={{ background: '#fff', borderBottom: '1px solid #e2e8f0' }}>
                          <td colSpan={7} className="px-8 py-6" style={{ whiteSpace: 'normal' }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-xl p-6" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                              {/* Skill breakdown */}
                              <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#64748b' }}>Phân tích kỹ năng</h4>
                                {c ? (
                                  <div className="space-y-4">
                                    {[['Grammar', c.g, 8, '#1e3a8a'], ['Vocabulary', c.v, 6, '#c53030'], ['Reading', c.rd, 6, '#1e3a8a']].map(([name, val, max, color]) => (
                                      <div key={String(name)}>
                                        <div className="flex justify-between text-sm mb-1">
                                          <span className="font-medium" style={{ color: '#1e293b' }}>{name}</span>
                                          <span className="font-bold" style={{ color: Number(val) / Number(max) >= 0.7 ? '#1e3a8a' : '#c53030' }}>{val}/{max}</span>
                                        </div>
                                        <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: '#e2e8f0' }}>
                                          <div className="h-full rounded-full transition-all" style={{ width: `${(Number(val) / Number(max)) * 100}%`, background: String(color) }} />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : <p className="text-sm" style={{ color: '#64748b' }}>Không có dữ liệu</p>}
                              </div>

                              {/* AI Analysis */}
                              <div className="bg-white rounded-xl p-5 min-w-0" style={{ border: '1px solid #e2e8f0', wordBreak: 'break-word' }}>
                                <div className="flex items-center gap-2 mb-3">
                                  <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ background: '#fef2f2' }}>
                                    <span className="material-symbols-outlined text-sm" style={{ color: '#c53030' }}>smart_toy</span>
                                  </div>
                                  <h4 className="text-sm font-bold" style={{ color: '#1e293b' }}>AI Analysis</h4>
                                </div>
                                <p className="text-sm leading-relaxed mb-3 break-words" style={{ color: '#64748b' }}>
                                  {r.ai_analysis ? (
                                    (() => { try { return JSON.parse(r.ai_analysis).analysis; } catch { return r.ai_analysis; } })()
                                  ) : 'Chưa có phân tích AI.'}
                                </p>
                                <div className="text-xs font-medium break-all" style={{ color: '#64748b' }}>
                                  Email: {r.email} | Consent: {r.consent ? '✓' : '✗'}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                              <button className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors"
                                style={{ background: '#fff', border: '1px solid #e2e8f0', color: '#1e293b' }}>
                                Gửi Email Kết Quả
                              </button>
                              <button className="px-5 py-2.5 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm"
                                style={{ background: '#1e3a8a' }}>
                                Tạo Hồ Sơ Tư Vấn
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}

                {records.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="text-center py-16" style={{ color: '#64748b' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: 48 }}>inbox</span>
                      <p className="mt-2">Chưa có kết quả nào</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {lastPage > 1 && (
        <div className="flex items-center justify-between mt-6 px-2">
          <p className="text-sm" style={{ color: '#64748b' }}>
            Trang {page}/{lastPage} — {total} kết quả
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)} disabled={page === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
              style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
              «
            </button>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
              style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
              ‹
            </button>
            {(() => {
              const pages: number[] = [];
              if (lastPage <= 7) {
                for (let i = 1; i <= lastPage; i++) pages.push(i);
              } else {
                pages.push(1);
                if (page > 3) pages.push(-1);
                for (let i = Math.max(2, page - 1); i <= Math.min(lastPage - 1, page + 1); i++) pages.push(i);
                if (page < lastPage - 2) pages.push(-2);
                pages.push(lastPage);
              }
              return pages.map((p, idx) =>
                p < 0 ? (
                  <span key={`dot-${idx}`} className="px-2 text-sm" style={{ color: '#94a3b8' }}>…</span>
                ) : (
                  <button key={p} onClick={() => setPage(p)}
                    className="w-9 h-9 rounded-lg text-sm font-bold transition-all"
                    style={{
                      background: p === page ? '#1e3a8a' : '#fff',
                      color: p === page ? '#fff' : '#64748b',
                      border: p === page ? 'none' : '1px solid #e2e8f0',
                    }}>
                    {p}
                  </button>
                )
              );
            })()}
            <button
              onClick={() => setPage(p => Math.min(lastPage, p + 1))} disabled={page === lastPage}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
              style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
              ›
            </button>
            <button
              onClick={() => setPage(lastPage)} disabled={page === lastPage}
              className="px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-30"
              style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
