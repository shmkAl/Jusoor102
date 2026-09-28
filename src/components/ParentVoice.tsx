import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Send, 
  Star, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  Filter, 
  MessageCircle, 
  ThumbsUp, 
  Lock,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubmissionCategory, SubmissionType } from '../types';

const CATEGORIES: SubmissionCategory[] = [
  'البيئة المدرسية',
  'الأنشطة والفعاليات',
  'التواصل مع المدرسة',
  'الأمن والسلامة',
  'المقصف المدرسي',
  'البرامج التعليمية',
  'التقنية والتحول الرقمي',
  'الدعم والإرشاد',
  'الطالبات المستجدات',
  'أخرى'
];

const SUBMISSION_TYPES: SubmissionType[] = [
  'اقتراح',
  'ملاحظة',
  'شكر وتقدير',
  'استفسار',
  'شكوى'
];

export const ParentVoice: React.FC = () => {
  const { 
    voices, 
    addVoice, 
    currentUser, 
    isParentLoggedIn, 
    requireParentAuth, 
    openLoginModal 
  } = useApp();

  // Form State
  const [authorName, setAuthorName] = useState(currentUser.name || '');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [type, setType] = useState<SubmissionType>('اقتراح');
  const [category, setCategory] = useState<SubmissionCategory>('التقنية والتحول الرقمي');
  const [content, setContent] = useState('');
  const [satisfactionRating, setSatisfactionRating] = useState<number>(5);
  const [allowContact, setAllowContact] = useState<boolean>(true);
  const [contactPhone, setContactPhone] = useState(currentUser.phone || '');
  const [contactEmail, setContactEmail] = useState(currentUser.email || '');

  // Submission State
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string>('all');

  React.useEffect(() => {
    if (currentUser.name) setAuthorName(currentUser.name);
    if (currentUser.phone) setContactPhone(currentUser.phone);
    if (currentUser.email) setContactEmail(currentUser.email);
  }, [currentUser]);

  const executeSubmit = () => {
    if (!content.trim()) return;

    addVoice({
      authorName: isAnonymous ? 'ولي أمر' : (authorName.trim() || currentUser.name || 'ولي أمر'),
      isAnonymous,
      type,
      category,
      content: content.trim(),
      satisfactionRating,
      allowContact,
      contactPhone: allowContact ? (contactPhone || currentUser.phone) : undefined,
      contactEmail: allowContact ? (contactEmail || currentUser.email) : undefined,
    });

    setIsSubmitted(true);
    setContent('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!requireParentAuth(executeSubmit, 'يُرجى تسجيل الدخول لإرسال رأيك وملاحظاتك إلى إدارة المدرسة')) {
      return;
    }

    executeSubmit();
  };

  const filteredVoices = voices.filter(v => {
    if (activeFilterCategory === 'all') return true;
    return v.category === activeFilterCategory;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <MessageSquareQuote className="w-4 h-4 text-emerald-600" />
          <span>قناة التواصل المباشر مع إدارة المدرسة</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          صوت ولي الأمر
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          صوتكِ مسموع ومقدّر.. شاركينا بملاحظاتك، مقترحاتك، أو كلمات شكرك لنعمل سويًا على تطوير تجربة بناتنا التعليمية في الثانوية 102.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Voice Submission Form (5 cols on lg) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-7 border border-slate-200 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                شكرًا لمشاركتك، صوتك يصنع فرقًا! 🌷
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
                تم استلام رأيك بنجاح ورفعه لمنسقة الشراكة وإدارة المدرسة لدراسته واتخاذ الإجراء اللازم.
              </p>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 justify-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>نضمن سرية بياناتك الشخصية بالكامل</span>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer"
              >
                إرسال مشاركة أخرى
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>نموذج إبداء الرأي والملاحظات</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  جميع الحقول تسهم في تحسين جودة المخرجات المدرسية
                </p>
              </div>

              {/* Login Banner for Parents */}
              {!isParentLoggedIn && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">تسجيل الدخول للمشاركة</span>
                      <span className="text-[11px] text-emerald-800">سجّلي دخولك ليتمكن فريق المدرسة من إفادتك ومتابعة مشاركتك</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openLoginModal('تسجيل الدخول لإرسال الملاحظات والاستفسارات')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              )}

              {/* Name & Anonymous Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>الاسم (اختياري)</span>
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                    />
                    <span>إرسال كمجهول</span>
                  </label>
                </div>
                {!isAnonymous && (
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="مثال: أم سارة العتيبي"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                  />
                )}
              </div>

              {/* Submission Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  نوع المشاركة <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {SUBMISSION_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg transition-all text-center ${
                        type === t
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  التصنيف أو المجال <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SubmissionCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Content Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الرأي أو الملاحظة بالتفصيل <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتبي رأيك أو ملاحظتك هنا بكل أريحية وشفافية..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Satisfaction Rating (1 to 5) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  درجة الرضا العام عن موضوع المشاركة (1 إلى 5)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setSatisfactionRating(star)}
                      className={`p-2 rounded-xl transition-transform hover:scale-110 flex items-center justify-center ${
                        star <= satisfactionRating
                          ? 'bg-amber-100 text-amber-500 border border-amber-300'
                          : 'bg-slate-100 text-slate-300 border border-slate-200'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${star <= satisfactionRating ? 'fill-amber-400' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs text-slate-500 font-bold mr-2">
                    {satisfactionRating === 5 ? 'راضي تمامًا (5/5) 🌟' : 
                     satisfactionRating === 4 ? 'راضي (4/5) 👍' : 
                     satisfactionRating === 3 ? 'محايد (3/5) 😐' : 
                     satisfactionRating === 2 ? 'غير راضي (2/5) 👎' : 'غير راضي إطلاقًا (1/5) ⚠️'}
                  </span>
                </div>
              </div>

              {/* Allow Contact Toggle */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    هل تسمحين للمدرسة بالتواصل معك لمتابعة الرأي؟
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAllowContact(true)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        allowContact ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      نعم
                    </button>
                    <button
                      type="button"
                      onClick={() => setAllowContact(false)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !allowContact ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      لا
                    </button>
                  </div>
                </div>

                {allowContact && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        رقم الجوال
                      </label>
                      <input
                        type="tel"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="05xxxxxxxx"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Lock className="w-3 h-3 text-slate-400" />
                  <span>بيانات الاتصال تظهر فقط لمنسقة الشراكة ولا تُعرض للعامة أبدًا.</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال المشاركة الآن</span>
              </button>
            </form>
          )}
        </div>

        {/* Voices Board / Recent Community Feedback (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                <span>أحدث أصوات وتفاعل أولياء الأمور ({filteredVoices.length})</span>
              </h3>
              <p className="text-xs text-slate-500">
                شفافية كاملة مع حماية خصوصية بيانات المشاركين
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={activeFilterCategory}
                onChange={(e) => setActiveFilterCategory(e.target.value)}
                className="text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="all">جميع التصنيفات</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Voices Feed */}
          <div className="space-y-3.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredVoices.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500">
                <MessageSquareQuote className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="font-bold">لا توجد مشاركات في هذا التصنيف حاليًا</p>
                <p className="text-xs mt-1">كوني أول من يشارك برأيه وملاحظته!</p>
              </div>
            ) : (
              filteredVoices.map((voice) => (
                <div
                  key={voice.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200/90 hover:border-emerald-200 transition-all space-y-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                        {voice.isAnonymous ? 'م' : voice.authorName?.charAt(0) || 'أ'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {voice.isAnonymous ? 'ولي أمر (مجهول)' : voice.authorName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{voice.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        voice.type === 'شكر وتقدير' ? 'bg-emerald-100 text-emerald-800' :
                        voice.type === 'اقتراح' ? 'bg-amber-100 text-amber-800' :
                        voice.type === 'شكوى' ? 'bg-rose-100 text-rose-800' : 'bg-sky-100 text-sky-800'
                      }`}>
                        {voice.type}
                      </span>
                      <span className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                        {voice.category}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    {voice.content}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(voice.satisfactionRating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                      <span className="text-[11px] text-slate-500 font-medium mr-1">
                        ({voice.satisfactionRating}/5)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`text-[11px] font-bold flex items-center gap-1 ${
                        voice.status === 'تم الرد' ? 'text-emerald-600' : 'text-slate-500'
                      }`}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{voice.status}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-400 text-[11px]">
                        <ThumbsUp className="w-3 h-3" /> {voice.likesCount || 0}
                      </span>
                    </div>
                  </div>

                  {/* School Official Response Box if available */}
                  {voice.schoolResponse && (
                    <div className="bg-emerald-50/80 rounded-xl p-3.5 border border-emerald-200/80 space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                          <span>رد إدارة المدرسة والثانوية 102:</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-normal">
                          {voice.responseDate}
                        </span>
                      </div>
                      <p className="text-xs text-emerald-800 leading-relaxed pr-3.5">
                        {voice.schoolResponse}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
