import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Pin, 
  Trash2, 
  Reply, 
  X, 
  Search, 
  CheckCheck, 
  ShieldCheck, 
  Lock, 
  LogIn, 
  Sparkles, 
  MessageSquare, 
  Users, 
  AlertCircle,
  HelpCircle,
  Heart,
  ThumbsUp,
  Flame,
  Lightbulb,
  CheckCircle2,
  Info,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DiscussionMessage } from '../types';

const POPULAR_EMOJIS = ['👍', '❤️', '👏', '💡', '🔥', '🌸', '✨', '🤲'];

export const TelegramDiscussionBoard: React.FC = () => {
  const {
    discussionMessages,
    sendDiscussionMessage,
    reactToDiscussionMessage,
    deleteDiscussionMessage,
    pinDiscussionMessage,
    pinnedDiscussionMessage,
    userRole,
    currentUser,
    isParentLoggedIn,
    studentName,
    openLoginModal,
    requireParentAuth,
    hasPermission,
    activeSupervisor,
    currentUserSupervisorData
  } = useApp();

  const canModerateDiscussion = hasPermission('manage_discussion');

  const [messageInput, setMessageInput] = useState('');
  const [selectedTag, setSelectedTag] = useState<DiscussionMessage['tag'] | undefined>(undefined);
  const [replyingTo, setReplyingTo] = useState<DiscussionMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterTag, setActiveFilterTag] = useState<string>('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null); // message id or 'input'
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('مخالفة لضوابط الحوار التربوي');
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null);
  const [messagesLimit, setMessagesLimit] = useState(60); // High-capacity message windowing

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [discussionMessages.length]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!isParentLoggedIn) {
      openLoginModal('يُرجى تسجيل الدخول للموقع لإبداء رأيك وإرسال مشاركتك في لوحة النقاش');
      return;
    }

    if (!messageInput.trim()) return;

    const success = sendDiscussionMessage(
      messageInput.trim(),
      replyingTo ? replyingTo.id : undefined,
      selectedTag
    );

    if (success) {
      setMessageInput('');
      setReplyingTo(null);
      setSelectedTag(undefined);
      setShowEmojiPicker(null);
      setTimeout(() => scrollToBottom('smooth'), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReactionClick = (messageId: string, emoji: string) => {
    if (!isParentLoggedIn) {
      openLoginModal('يُرجى تسجيل الدخول للموقع لإبداء رأيك أو التفاعل مع رسائل النقاش');
      return;
    }
    reactToDiscussionMessage(messageId, emoji);
    setShowEmojiPicker(null);
  };

  const handleReplyClick = (msg: DiscussionMessage) => {
    if (!isParentLoggedIn) {
      openLoginModal('يُرجى تسجيل الدخول للموقع للرد على المشاركات');
      return;
    }
    setReplyingTo(msg);
    inputRef.current?.focus();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmId) return;
    deleteDiscussionMessage(deleteConfirmId, deleteReason);
    setDeleteConfirmId(null);
  };

  const scrollToMessage = (msgId: string) => {
    const el = document.getElementById(`msg-${msgId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setHighlightedMessageId(msgId);
      setTimeout(() => setHighlightedMessageId(null), 2500);
    }
  };

  // Filter messages based on search & tags
  const filteredMessages = discussionMessages.filter(msg => {
    const matchesSearch = !searchQuery.trim() || 
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (msg.senderTitle && msg.senderTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = activeFilterTag === 'all' || 
      (activeFilterTag === 'official' && msg.isOfficial) ||
      (activeFilterTag === 'pinned' && msg.isPinned) ||
      msg.tag === activeFilterTag;

    return matchesSearch && matchesTag;
  });

  // High-capacity message windowing: render the latest chunk smoothly without DOM strain
  const visibleMessages = filteredMessages.slice(-messagesLimit);

  return (
    <div className="py-6 sm:py-8 max-w-5xl mx-auto px-3 sm:px-6">
      {/* Top Introductory Header */}
      <div className="mb-6 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-200 shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>لوحة النقاش التفاعلية المستمرة (نمط التليجرام)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          ملتقى الحوار والشراكة المجتمعية
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
          مساحة حوارية مستمرة لتبادل الآراء والمقترحات التربوية بين الأسرة والمدرسة. المشاركات محفوظة بشكل دائم ولا تُحذف تلقائياً، وصلاحية إدارة وحذف المشاركات محصورة على منسقة الشراكة فقط لضمان توثيق الملاحظات.
        </p>
      </div>

      {/* Main Telegram Card Window */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden flex flex-col h-[780px] max-h-[85vh]">
        {/* Telegram Header Bar */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white px-4 py-3 sm:px-6 flex items-center justify-between shadow-md relative z-20">
          <div className="flex items-center gap-3">
            {/* Telegram Channel Avatar */}
            <div className="relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white font-black text-base sm:text-lg shadow-inner border-2 border-white/40">
                102
              </div>
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-900" title="متصل الآن" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm sm:text-base text-white font-display">
                  مجموعة الحوار والشراكة • الثانوية 102
                </h2>
                <span title="قناة رسمية موثقة">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 fill-emerald-400/30" />
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100/80">
                <span>1,248 عضواً</span>
                <span>•</span>
                <span className="text-emerald-300 font-medium">محادثة مستمرة ومحفوظة</span>
                <span>•</span>
                <span className="bg-emerald-400/20 text-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10px] border border-emerald-400/30 hidden sm:inline">
                  ⚡ استيعاب فائق لآلاف المشاركات
                </span>
                {canModerateDiscussion && (
                  <>
                    <span>•</span>
                    <span className="bg-emerald-500/30 text-amber-200 px-2 py-0.5 rounded-md font-bold text-[10px] border border-emerald-400/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-300" />
                      {activeSupervisor 
                        ? `مشرفة مفوضة: ${activeSupervisor.name}` 
                        : (userRole === 'coordinator' 
                            ? 'صلاحيات منسقة الشراكة مفعلة' 
                            : `مشرفة مفوضة: ${currentUserSupervisorData?.name || currentUser.name}`)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Header Tools */}
          <div className="flex items-center gap-2">
            {/* Search Input toggle */}
            <div className="relative hidden sm:block">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث في الرسائل..."
                className="w-36 md:w-48 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-emerald-200/70 focus:placeholder:text-slate-400 text-xs rounded-full px-3 py-1.5 pr-8 border border-white/20 transition-all outline-hidden"
              />
              <Search className="w-3.5 h-3.5 text-emerald-200 absolute right-2.5 top-2 pointer-events-none" />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 top-2 text-emerald-200 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Login button if guest */}
            {!isParentLoggedIn && (
              <button
                onClick={() => openLoginModal('سجّلي الدخول للمشاركة وإبداء رأيك في لوحة النقاش')}
                className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>تسجيل الدخول</span>
              </button>
            )}
          </div>
        </div>

        {/* Telegram Pinned Message Strip */}
        {pinnedDiscussionMessage && (
          <div 
            onClick={() => scrollToMessage(pinnedDiscussionMessage.id)}
            className="bg-emerald-50/95 hover:bg-emerald-100/90 border-b border-emerald-200/80 px-4 py-2 flex items-center justify-between cursor-pointer transition-colors text-xs z-10 select-none"
            title="انقر للانتقال للرسالة المثبتة"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1 rounded-full bg-emerald-200 text-emerald-800">
                <Pin className="w-3.5 h-3.5 fill-emerald-800" />
              </div>
              <div className="overflow-hidden">
                <div className="font-bold text-emerald-950 flex items-center gap-1">
                  <span>رسالة مثبتة من: {pinnedDiscussionMessage.senderName}</span>
                  <span className="text-[10px] text-emerald-700 font-normal">({pinnedDiscussionMessage.senderTitle})</span>
                </div>
                <p className="text-slate-600 truncate text-[11px]">
                  {pinnedDiscussionMessage.content}
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 underline shrink-0 mr-2">
              عرض
            </span>
          </div>
        )}

        {/* Filter tags bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto text-xs scrollbar-none">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 shrink-0 ml-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>تصفية:</span>
          </span>
          {[
            { id: 'all', label: 'الكل' },
            { id: 'اقتراح', label: '💡 اقتراحات' },
            { id: 'استفسار', label: '❓ استفسارات' },
            { id: 'شكر', label: '👏 شكر وتقدير' },
            { id: 'رأي تربوي', label: '💬 آراء تربوية' },
            { id: 'official', label: '🏛️ رسائل رسمية' },
            { id: 'pinned', label: '📌 المثبتة' }
          ].map(tag => (
            <button
              key={tag.id}
              onClick={() => setActiveFilterTag(tag.id)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap text-[11px] font-bold transition-all ${
                activeFilterTag === tag.id
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Telegram Chat Wallpaper & Scrollable Area */}
        <div 
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 relative"
          style={{
            backgroundColor: '#efeae2',
            backgroundImage: `radial-gradient(#cbd5e1 0.75px, transparent 0.75px), radial-gradient(#cbd5e1 0.75px, #efeae2 0.75px)`,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0, 15px 15px'
          }}
        >
          {/* Policy / Continuity Notice Card */}
          <div className="max-w-xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl p-3 border border-emerald-200 shadow-xs text-center space-y-1 my-2">
            <div className="flex items-center justify-center gap-1 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>ميثاق الحوار والمشاركات المستمرة</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              جميع المشاركات مستمرة وموثقة لخدمة بناتنا الطالبات. لإبداء الرأي أو التفاعل يلزم تسجيل الدخول، وحذف المشاركات محصور على منسقة الشراكة المدرسية فقط.
            </p>
          </div>

          {/* Date Separator */}
          <div className="flex items-center justify-center my-3">
            <span className="bg-slate-200/80 backdrop-blur-xs text-slate-700 text-[11px] font-bold px-3 py-0.5 rounded-full shadow-2xs">
              سجل الحوار التربوي المستمر
            </span>
          </div>

          {/* High-capacity load more previous messages button */}
          {filteredMessages.length > messagesLimit && (
            <div className="text-center my-2">
              <button
                type="button"
                onClick={() => setMessagesLimit(prev => prev + 50)}
                className="px-4 py-1.5 rounded-full bg-white/95 hover:bg-white text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                تحميل المشاركات السابقة (+50 مشاركة) • المتبقي ({filteredMessages.length - messagesLimit})
              </button>
            </div>
          )}

          {/* Message List */}
          {visibleMessages.length === 0 ? (
            <div className="text-center py-16 space-y-2 bg-white/70 backdrop-blur-xs rounded-2xl p-6 max-w-sm mx-auto border border-slate-200">
              <MessageSquare className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="font-bold text-sm text-slate-700">لا توجد رسائل مطابقة للتصفية</p>
              <p className="text-xs text-slate-500">جرّبي البحث بكلمات أخرى أو تغيير الفلتر.</p>
            </div>
          ) : (
            visibleMessages.map((msg) => {
              const isMine = isParentLoggedIn && (
                (userRole === 'coordinator' && msg.senderRole === 'coordinator') ||
                (currentUser.name && msg.senderName === currentUser.name)
              );

              const isOfficialCoordinator = msg.senderRole === 'coordinator' || msg.isOfficial;
              const isHighlighted = highlightedMessageId === msg.id;

              return (
                <div
                  key={msg.id}
                  id={`msg-${msg.id}`}
                  className={`flex flex-col group transition-all duration-300 ${
                    isMine ? 'items-start' : 'items-end'
                  }`}
                >
                  {/* Outer Wrapper */}
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 sm:p-3.5 shadow-sm transition-all relative ${
                      isHighlighted ? 'ring-4 ring-emerald-400 ring-offset-2' : ''
                    } ${
                      isMine
                        ? 'bg-[#e1ffc7] text-slate-900 border border-emerald-200/60 rounded-br-xs'
                        : isOfficialCoordinator
                        ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-white text-slate-900 border-2 border-emerald-500/40 rounded-bl-xs shadow-md'
                        : 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                    }`}
                  >
                    {/* Header Info: Sender Name & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-black/5 pb-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Avatar / Circle */}
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${
                            msg.avatarColor || 'from-blue-500 to-indigo-600'
                          } text-white flex items-center justify-center font-bold text-[10px] shrink-0`}
                        >
                          {msg.senderName.charAt(0)}
                        </div>

                        <span
                          className={`font-black text-xs ${
                            isOfficialCoordinator
                              ? 'text-emerald-800 font-display'
                              : msg.senderRole === 'teacher'
                              ? 'text-teal-700'
                              : msg.senderRole === 'staff'
                              ? 'text-purple-700'
                              : 'text-blue-700'
                          }`}
                        >
                          {msg.senderName}
                        </span>

                        {isOfficialCoordinator && (
                          <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            <span>رسمي</span>
                          </span>
                        )}

                        {msg.senderTitle && (
                          <span className="text-[10px] text-slate-500 font-medium">
                            • {msg.senderTitle}
                          </span>
                        )}
                      </div>

                      {/* Tag pill if exists */}
                      {msg.tag && (
                        <span className="bg-white/80 border border-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                          {msg.tag === 'اقتراح' && '💡 '}
                          {msg.tag === 'استفسار' && '❓ '}
                          {msg.tag === 'شكر' && '👏 '}
                          {msg.tag === 'تنويه' && '📢 '}
                          {msg.tag === 'رأي تربوي' && '💬 '}
                          {msg.tag}
                        </span>
                      )}
                    </div>

                    {/* Reply Preview inside bubble */}
                    {msg.replyToPreview && (
                      <div
                        onClick={() => msg.replyToId && scrollToMessage(msg.replyToId)}
                        className="bg-black/5 hover:bg-black/10 transition-colors border-r-4 border-emerald-600 rounded-lg p-2 mb-2 cursor-pointer text-xs select-none"
                        title="انقر للانتقال للرسالة المردود عليها"
                      >
                        <div className="font-bold text-[11px] text-emerald-800">
                          {msg.replyToPreview.senderName}
                        </div>
                        <p className="text-slate-600 text-[11px] truncate">
                          {msg.replyToPreview.content}
                        </p>
                      </div>
                    )}

                    {/* Message Content */}
                    <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line break-words">
                      {msg.content}
                    </div>

                    {/* Footer Metadata: Time + Read Ticks + Pin Badge + Actions */}
                    <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-black/5 text-[10px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span>{msg.timeStr}</span>
                        <span>• {msg.dateStr}</span>
                        {msg.isPinned && (
                          <span className="flex items-center gap-0.5 text-emerald-700 font-bold">
                            <Pin className="w-2.5 h-2.5 fill-emerald-700" />
                            <span>مثبتة</span>
                          </span>
                        )}
                        <span title="تمت القراءة">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                      </div>

                      {/* Interactive Buttons (Reply, Reactions, Coordinator Delete/Pin) */}
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        {/* Reply button */}
                        <button
                          onClick={() => handleReplyClick(msg)}
                          className="hover:bg-black/10 p-1 rounded-md text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-0.5"
                          title="رد على هذه الرسالة"
                        >
                          <Reply className="w-3 h-3" />
                          <span className="hidden sm:inline">رد</span>
                        </button>

                        {/* Quick Reaction button */}
                        <div className="relative">
                          <button
                            onClick={() => setShowEmojiPicker(showEmojiPicker === msg.id ? null : msg.id)}
                            className="hover:bg-black/10 p-1 rounded-md text-slate-600 hover:text-amber-600 transition-colors"
                            title="إضافة تفاعل"
                          >
                            <Smile className="w-3 h-3" />
                          </button>

                          {/* Emoji Picker Popup */}
                          {showEmojiPicker === msg.id && (
                            <div className="absolute bottom-full left-0 mb-1 bg-white border border-slate-200 rounded-full shadow-lg p-1.5 flex items-center gap-1 z-30 animate-in fade-in zoom-in-95">
                              {POPULAR_EMOJIS.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReactionClick(msg.id, emoji)}
                                  className="w-7 h-7 flex items-center justify-center hover:scale-125 transition-transform text-sm"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Coordinator / Delegated Supervisor Pin Action */}
                        {canModerateDiscussion && (
                          <button
                            onClick={() => pinDiscussionMessage(msg.id)}
                            className={`p-1 rounded-md transition-colors ${
                              msg.isPinned
                                ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                                : 'text-slate-500 hover:text-emerald-700 hover:bg-black/10'
                            }`}
                            title={msg.isPinned ? 'إلغاء التثبيت' : 'تثبيت الرسالة (صلاحية المنسقة والمشرفة المفوضة)'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                        )}

                        {/* Coordinator / Delegated Supervisor Delete Action */}
                        {canModerateDiscussion && (
                          <button
                            onClick={() => setDeleteConfirmId(msg.id)}
                            className="p-1 rounded-md text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="حذف المشاركة (صلاحية منسقة الشراكة والمشرفة المفوضة)"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Reactions Pill Display */}
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-2 pt-1 border-t border-black/5">
                        {msg.reactions.map((reaction) => {
                          const userName = currentUser.name || currentUser.phone || 'أنا';
                          const iReacted = isParentLoggedIn && reaction.users.includes(userName);

                          return (
                            <button
                              key={reaction.emoji}
                              onClick={() => handleReactionClick(msg.id, reaction.emoji)}
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border transition-transform hover:scale-105 active:scale-95 ${
                                iReacted
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400'
                                  : 'bg-white/80 text-slate-700 border-slate-200 hover:bg-white'
                              }`}
                              title={
                                isParentLoggedIn
                                  ? `تفاعل: ${reaction.emoji} (${reaction.count})`
                                  : 'سجّلي الدخول للتفاعل'
                              }
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-[10px]">{reaction.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input / Action Area */}
        <div className="bg-white border-t border-slate-200 p-3 sm:p-4 relative z-20">
          {/* If Replying To Banner */}
          {replyingTo && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2 mb-2 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="p-1 rounded-md bg-emerald-200 text-emerald-800">
                  <Reply className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <span className="font-bold text-emerald-950">الرد على {replyingTo.senderName}: </span>
                  <span className="text-slate-600">{replyingTo.content}</span>
                </div>
              </div>
              <button
                onClick={() => setReplyingTo(null)}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="إلغاء الرد"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Locked vs Authenticated Input Gate */}
          {!isParentLoggedIn ? (
            /* Locked State for Non-Logged-in Users */
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-sm">
                <Lock className="w-4 h-4 text-amber-600" />
                <span>المشاركة والتفاعل مقصورة على المسجلين بالموقع</span>
              </div>
              <p className="text-xs text-amber-800 max-w-md mx-auto leading-relaxed">
                لإبداء رأيك التربوي، إرسال مقترحاتك أو التفاعل مع رسائل النقاش، يُشترط تسجيل الدخول كولي أمر أو كادر مدرسي لتوثيق المشاركات.
              </p>
              <button
                onClick={() => openLoginModal('سجّلي الدخول للمشاركة في لوحة النقاش وإبداء رأيك')}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>تسجيل الدخول وإبداء الرأي الآن</span>
              </button>
            </div>
          ) : (
            /* Logged-In User Input Controls */
            <form onSubmit={handleSendMessage} className="space-y-2">
              {/* User Identity Banner + Category Selector */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span className="font-bold text-slate-800">
                    {userRole === 'coordinator' ? 'أ. شهد العتيبي (المنسقة)' : currentUser.name}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-[11px] text-emerald-700 font-medium">
                    {userRole === 'coordinator' 
                      ? 'منسقة الشراكة - صلاحية الإشراف والحذف' 
                      : (currentUser.title || `ولي أمر: ${studentName}`)}
                  </span>
                </div>

                {/* Optional Category Tag Selector */}
                <div className="flex items-center gap-1 overflow-x-auto">
                  <span className="text-[10px] text-slate-400">نوع المشاركة:</span>
                  {(['اقتراح', 'استفسار', 'شكر', 'رأي تربوي'] as DiscussionMessage['tag'][]).map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setSelectedTag(selectedTag === t ? undefined : t)}
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${
                        selectedTag === t
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea Input + Action Buttons */}
              <div className="flex items-end gap-2 bg-slate-100 rounded-2xl p-2 border border-slate-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                {/* Emoji Trigger */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(showEmojiPicker === 'input' ? null : 'input')}
                    className="p-2 text-slate-400 hover:text-amber-600 transition-colors rounded-xl hover:bg-slate-200/60"
                    title="رموز تعبيرية"
                  >
                    <Smile className="w-5 h-5" />
                  </button>

                  {/* Input Emoji Popup */}
                  {showEmojiPicker === 'input' && (
                    <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 flex flex-wrap gap-1.5 w-48 z-30 animate-in fade-in zoom-in-95">
                      {POPULAR_EMOJIS.map((emoji) => (
                        <button
                          type="button"
                          key={emoji}
                          onClick={() => {
                            setMessageInput(prev => prev + emoji);
                            setShowEmojiPicker(null);
                            inputRef.current?.focus();
                          }}
                          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 rounded-lg text-base hover:scale-110 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Textarea */}
                <textarea
                  ref={inputRef}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    replyingTo 
                      ? `اكتبي ردكِ على ${replyingTo.senderName}...` 
                      : 'اكتبي رأيكِ التربوي أو مقترحكِ الهادف هنا (اضغطي Enter للإرسال)...'
                  }
                  rows={1}
                  className="flex-1 bg-transparent border-0 resize-none outline-hidden text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 py-2 max-h-32 leading-relaxed"
                />

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                    messageInput.trim()
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md active:scale-95 cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title="إرسال المشاركة"
                >
                  <Send className="w-4 h-4 rotate-180" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                <span>تنويه: المشاركات مستمرة وموثقة ولا تُحذف إلا من قِبل منسقة الشراكة لضمان الشفافية.</span>
                <span>Enter للإرسال • Shift+Enter لسطر جديد</span>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Coordinator Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-slate-900 font-display">
                تأكيد حذف المشاركة (صلاحية المنسقة)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                بصفتكِ منسقة الشراكة المدرسية، سيتم حذف هذه المشاركة بشكل نهائي من لوحة النقاش العامة ولن يتمكن أولياء الأمور من الاطلاع عليها.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                سبب الحذف (للتوثيق الإداري الداخلي):
              </label>
              <select
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 outline-hidden focus:border-rose-500"
              >
                <option value="مخالفة لضوابط الحوار التربوي">مخالفة لضوابط الحوار التربوي</option>
                <option value="مشاركة مكررة">مشاركة مكررة</option>
                <option value="تم حل الاستفسار والتواصل المباشر مع ولي الأمر">تم حل الاستفسار والتواصل المباشر مع ولي الأمر</option>
                <option value="معلومات غير دقيقة أو شائعات">معلومات غير دقيقة أو شائعات</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-sm"
              >
                تأكيد الحذف النهائي
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
