import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, X, Clock } from 'lucide-react';
import { api } from '../../../lib/api';
import { useAuth } from '../../../components/AuthContext';

interface DiscussionForumProps {
  courseId: string;
  lessonId: number;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'admin': return { label: 'Admin', cls: 'border-[#E24843] text-[#E24843] bg-[#E24843]/10', icon: 'shield_person' };
    case 'teacher': return { label: 'Giảng viên', cls: 'border-[#13375f] text-[#13375f] bg-[#13375f]/10', icon: 'school' };
    default: return { label: 'Học viên', cls: 'border-emerald-600 text-emerald-600 bg-emerald-600/10', icon: 'person' };
  }
};

export function DiscussionForum({ courseId, lessonId }: DiscussionForumProps) {
  const { user } = useAuth();
  
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Fetch discussions when lesson changes
  useEffect(() => {
    if (!courseId || !lessonId || lessonId === 0) return;
    const fetchDiscussions = async () => {
      try {
        const res = await api.get(`/courses/${courseId}/discussions?lesson_id=${lessonId}`);
        const items = res?.data || res || [];
        setForumPosts(items.map((d: any) => ({
          id: d.id.toString(),
          author: d.user_name || 'Người dùng',
          avatar_url: d.user_avatar,
          role: d.user_role || 'student',
          user_id: d.user_id,
          date: d.created_at_human || 'Gần đây',
          content: d.content,
          replies: d.replies || [],
          replies_count: d.replies_count || d.replies?.length || 0
        })));
      } catch (e) { console.warn('[BeeLearn] Discussions fetch failed:', e); }
    };
    fetchDiscussions();
  }, [courseId, lessonId]);

  const handleAddPost = async () => {
    if (!newPost.trim() || !user) return;
    try {
      const res = await api.post(`/courses/${courseId}/discussions`, {
        lesson_id: lessonId,
        content: newPost.trim()
      });
      const added = res.discussion || res;
      setForumPosts(prev => [{
        id: added.id.toString(),
        author: user.name,
        avatar_url: user.avatar_url,
        role: user.role,
        user_id: user.id,
        date: 'Vừa xong',
        content: added.content,
        replies: [],
        replies_count: 0
      }, ...prev]);
      setNewPost('');
    } catch (e) {
      console.error(e);
      alert('Lỗi đăng bài thảo luận');
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyContent.trim() || !user) return;
    try {
      const res = await api.post(`/courses/${courseId}/discussions`, {
        lesson_id: lessonId,
        parent_id: parseInt(parentId),
        content: replyContent.trim()
      });
      const added = res.discussion || res;
      setForumPosts(prev => prev.map(p => {
        if (p.id === parentId) {
          return {
            ...p,
            replies_count: p.replies_count + 1,
            replies: [...(p.replies || []), {
              id: added.id.toString(),
              author: user.name,
              avatar_url: user.avatar_url,
              role: user.role,
              user_id: user.id,
              date: 'Vừa xong',
              content: added.content
            }]
          };
        }
        return p;
      }));
      setReplyContent('');
      setReplyingTo(null);
      // Auto expand replies if not expanded
      setExpandedReplies(prev => {
        const next = new Set(prev);
        next.add(parentId);
        return next;
      });
    } catch (e) {
      console.error(e);
      alert('Lỗi gửi trả lời');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bài đăng này?')) return;
    try {
      await api.delete(`/discussions/${postId}`);
      setForumPosts(prev => prev.filter(p => p.id !== postId));
    } catch (e) {
      alert('Không thể xóa bài đăng');
    }
  };

  const handleDeleteReply = async (parentId: string, replyId: string) => {
    if (!confirm('Bạn có chắc muốn xóa phản hồi này?')) return;
    try {
      await api.delete(`/discussions/${replyId}`);
      setForumPosts(prev => prev.map(p => {
        if (p.id === parentId) {
          return {
            ...p,
            replies_count: Math.max(0, p.replies_count - 1),
            replies: (p.replies || []).filter((r: any) => r.id.toString() !== replyId)
          };
        }
        return p;
      }));
    } catch (e) {
      alert('Không thể xóa phản hồi');
    }
  };

  const toggleReplies = (postId: string) => {
    setExpandedReplies(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  return (
    <div className="bg-surface-container-lowest p-6 sm:p-8 rounded-2xl shadow-sm border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-primary font-headline flex items-center gap-3">
          <MessageSquare className="w-6 h-6" /> Hỏi đáp & Thảo luận
        </h3>
        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-lg">
          {forumPosts.length} câu hỏi
        </span>
      </div>

      {/* New Post Form */}
      <div className="mb-8 p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#13375f] flex items-center justify-center text-white font-bold text-sm shrink-0 overflow-hidden">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              (user?.name || 'U')[0]
            )}
          </div>
          <div className="flex-1">
            <textarea value={newPost} onChange={e => setNewPost(e.target.value)}
              placeholder="Đặt câu hỏi hoặc chia sẻ ý kiến về bài học này..."
              className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13375f] focus:border-transparent outline-none transition-all resize-none h-28 text-on-surface text-sm" />
            <div className="flex justify-between items-center mt-3">
              <p className="text-[11px] text-slate-400">Mọi người trong khóa học đều có thể xem bình luận của bạn</p>
              <button onClick={handleAddPost} disabled={!newPost.trim()}
                className="bg-[#13375f] text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-[#0f2a47] shadow-lg transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <Send size={16} /> Gửi
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {forumPosts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-200" />
            <p className="text-lg font-bold text-slate-500 mb-1">Chưa có câu hỏi nào</p>
            <p className="text-sm">Hãy là người đầu tiên đặt câu hỏi cho bài học này!</p>
          </div>
        )}
        {forumPosts.map((post: any) => {
          const badge = getRoleBadge(post.role);
          const canDelete = user && (user.id === post.user_id || user.role === 'admin' || user.role === 'teacher');
          const isExpanded = expandedReplies.has(post.id);
          return (
          <div key={post.id} className="rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-lg transition-all">
            {/* Main Post */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#13375f] to-[#2a5a8f] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm overflow-hidden">
                  {post.avatar_url ? (
                    <img src={post.avatar_url} alt={post.author} className="w-full h-full object-cover" />
                  ) : (
                    (post.author || 'U')[0]
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-bold text-[#13375f] text-base">{post.author}</h4>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badge.cls}`}>
                      <span className="material-symbols-outlined" style={{fontSize: '12px'}}>{badge.icon}</span>
                      {badge.label}
                    </span>
                    <span className="text-xs text-slate-400 font-medium ml-auto flex items-center gap-1 shrink-0">
                      <Clock size={12} /> {post.date}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap mt-2">{post.content}</p>
                  <div className="flex items-center gap-4 mt-4">
                    <button 
                      onClick={() => { setReplyingTo(replyingTo === post.id ? null : post.id); setReplyContent(''); }}
                      className="text-xs font-bold text-slate-500 hover:text-[#13375f] transition-colors flex items-center gap-1.5"
                    >
                      <MessageSquare size={14} /> Trả lời
                    </button>
                    {post.replies_count > 0 && (
                      <button 
                        onClick={() => toggleReplies(post.id)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1.5"
                      >
                        <span className="material-symbols-outlined" style={{fontSize: '14px'}}>{isExpanded ? 'expand_less' : 'expand_more'}</span>
                        {isExpanded ? 'Ẩn' : 'Xem'} {post.replies_count} câu trả lời
                      </button>
                    )}
                    {canDelete && (
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <X size={14} /> Xóa
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Form */}
            {replyingTo === post.id && (
              <div className="px-6 pb-4 border-t border-slate-50 pt-4 bg-slate-50/50">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#13375f] flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt={user?.name} className="w-full h-full object-cover" />
                    ) : (
                      (user?.name || 'U')[0]
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea 
                      value={replyContent} 
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder={`Trả lời ${post.author}...`}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#13375f] focus:border-transparent outline-none transition-all resize-none h-20 text-sm"
                      autoFocus
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button onClick={() => setReplyingTo(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all">
                        Hủy
                      </button>
                      <button 
                        onClick={() => handleAddReply(post.id)} 
                        disabled={!replyContent.trim()}
                        className="px-5 py-2 bg-[#13375f] text-white text-xs font-bold rounded-lg hover:bg-[#0f2a47] transition-all disabled:opacity-50 flex items-center gap-1.5"
                      >
                        <Send size={12} /> Gửi trả lời
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Replies List */}
            {isExpanded && post.replies && post.replies.length > 0 && (
              <div className="border-t border-slate-100 bg-slate-50/70">
                {post.replies.map((reply: any) => {
                  const replyBadge = getRoleBadge(reply.role);
                  const canDeleteReply = user && (user.id === reply.user_id || user.role === 'admin' || user.role === 'teacher');
                  return (
                    <div key={reply.id} className="px-6 py-4 border-b border-slate-100/80 last:border-0">
                      <div className="flex items-start gap-3 ml-6">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold text-xs shrink-0 overflow-hidden">
                          {reply.avatar_url ? (
                            <img src={reply.avatar_url} alt={reply.author} className="w-full h-full object-cover" />
                          ) : (
                            (reply.author || 'U')[0]
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-[#13375f]">{reply.author}</span>
                            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold border ${replyBadge.cls}`}>
                              <span className="material-symbols-outlined" style={{fontSize: '10px'}}>{replyBadge.icon}</span>
                              {replyBadge.label}
                            </span>
                            <span className="text-[11px] text-slate-400 ml-auto">{reply.date}</span>
                          </div>
                          <p className="text-slate-600 text-[13px] leading-relaxed whitespace-pre-wrap mt-1">{reply.content}</p>
                          {canDeleteReply && (
                            <div className="flex justify-end mt-2">
                              <button 
                                onClick={() => handleDeleteReply(post.id, reply.id.toString())}
                                className="text-[11px] font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                              >
                                <X size={12} /> Xóa
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}
