import React, { useState } from 'react';
import { 
  Sparkles, 
  MessageSquare, 
  ThumbsUp, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Users, 
  Share2, 
  Flag,
  Lightbulb
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FamilyCouncil: React.FC = () => {
  const { 
    councilTopic, 
    addCouncilComment, 
    toggleLikeComment, 
    likedComments, 
    reportComment,
    currentUser,
    isParentLoggedIn,
    requireParentAuth,
    openLoginModal,
    setActiveTab
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [authorName, setAuthorName] = useState(currentUser.name || '');
  const [showGuidelines, setShowGuidelines] = useState(false);

  React.useEffect(() => {
    if (currentUser.name) setAuthorName(currentUser.name);
  }, [currentUser]);

  const executeSubmit = () => {
    if (!commentText.trim()) return;

    addCouncilComment(commentText.trim(), authorName.trim() || currentUser.name || undefined);
    setCommentText('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!requireParentAuth(executeSubmit, 'يُرجى تسجيل الدخول للمشاركة في مناقشات مجلس الأسرة')) {
      return;
    }

    executeSubmit();
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-100 text-violet-900 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <span>منتدى الحوار الشهري والتفكير المشترك</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          مجلس الأسرة الرقمي
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          مساحة تفاعلية لمناقشة القضايا التربوية والتقنية المعاصرة.. نطرح كل شهر موضوعًا يهم بناتنا، ونستمع لرؤاكم وأفكاركم لصياغة سياسات ومبادرات مشتركة.
        </p>

        {/* Quick link to Telegram continuous discussion board */}
        <div className="pt-2">
          <button
            onClick={() => setActiveTab('discussion')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
          >
            <MessageSquare className="w-4 h-4 text-emerald-200" />
            <span>انتقلي إلى لوحة النقاش المباشرة (محادثة التليجرام) 💬</span>
          </button>
        </div>
      </div>

      {/* Main Monthly Topic Highlight Card */}
      <div className="bg-gradient-to-br from-violet-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-9 border border-violet-800 shadow-xl mb-10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="bg-violet-500/20 text-violet-300 border border-violet-400/30 text-xs font-bold px-3 py-1 rounded-full">
            الموضوع المطروح للنقاش • شهر {councilTopic.month}
          </span>
          <div className="flex items-center gap-2 text-xs text-violet-200">
            <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full">
              <Users className="w-3.5 h-3.5 text-amber-300" />
              <span>{councilTopic.totalSuggestions} مشاركة مسجلة</span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display leading-snug">
            {councilTopic.title}
          </h3>
          <p className="text-sm sm:text-base text-violet-100/90 leading-relaxed max-w-4xl">
            {councilTopic.description}
          </p>
        </div>

        {/* Discussion Axis Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-amber-300 block mb-1">المحور الأول:</span>
            <span className="text-xs text-slate-200">الاستخدام الإيجابي لأدوات الذكاء الاصطناعي في الاستذكار والبحث المدرسي.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-teal-300 block mb-1">المحور الثاني:</span>
            <span className="text-xs text-slate-200">دور الأسرة في غرس الأمانة العلمية والتفكير النقدي المستقل.</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-xs font-bold text-purple-300 block mb-1">المحور الثالث:</span>
            <span className="text-xs text-slate-200">مقترحات أولياء الأمور لتنظيم ورش أسبوعية مشتركة بين الأم وابنتها.</span>
          </div>
        </div>
      </div>

      {/* Discussion Input & Comments Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Comment Submission Box (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-violet-600" />
              <span>شاركي برأيك ومقترحك في المجلس</span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              كل فكرة تسهم في صياغة ميثاق الاستخدام الرقمي بالمدرسة
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Login Prompt Banner */}
            {!isParentLoggedIn && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-950 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تسجيل الدخول مطلوب للمشاركة في المجلس</span>
                </div>
                <button
                  type="button"
                  onClick={() => openLoginModal('تسجيل الدخول للمشاركة في مناقشات مجلس الأسرة')}
                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px] shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  تسجيل الدخول
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم ولي الأمر / الصفة
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="مثال: أم سارة (ولية أمر طالبة بالصف الثاني ثانوي)"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                مشاركتكِ أو تجربتكِ التربوية <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="اكتبي رأيك أو تجربتك مع ابنتك في التعامل مع التقنية والذكاء الاصطناعي..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-violet-700 hover:bg-violet-800 text-white font-bold text-xs rounded-xl shadow-md shadow-violet-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>إرسال المشاركة إلى المجلس</span>
            </button>
          </form>

          <div className="p-3 bg-violet-50 rounded-xl border border-violet-100 text-[11px] text-violet-800 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" />
            <span>تخضع المشاركات لمراجعة فورية لطيفة لضمان بيئة حوار تربوية هادفة وبناءة.</span>
          </div>
        </div>

        {/* Comments Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span>مشاركات وتوصيات أولياء الأمور ({councilTopic.comments.length})</span>
            </h4>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
              مفتوح للحوار
            </span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {councilTopic.comments.map((comment) => {
              const isLiked = !!likedComments[comment.id];
              return (
                <div
                  key={comment.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2.5 hover:border-violet-200 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-800 font-bold text-xs flex items-center justify-center">
                        {comment.authorName.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          {comment.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{comment.createdAt}</span>
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                      {comment.status}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {comment.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <button
                      onClick={() => toggleLikeComment(comment.id)}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isLiked
                          ? 'bg-violet-100 text-violet-800'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-violet-800' : ''}`} />
                      <span>أتفق مع هذا الرأي ({comment.likes})</span>
                    </button>

                    <button
                      onClick={() => reportComment(comment.id)}
                      className="text-slate-400 hover:text-rose-500 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      title="إبلاغ عن محتوى غير لائق"
                    >
                      <Flag className="w-3 h-3" />
                      <span>{comment.isReported ? 'تم الإبلاغ' : 'إبلاغ'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
