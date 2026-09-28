import React, { useState } from 'react';
import { 
  Lightbulb, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  HelpCircle,
  FileCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubmissionCategory, SupportType, ProposalStatus } from '../types';

const CATEGORIES: SubmissionCategory[] = [
  'التقنية والتحول الرقمي',
  'الأنشطة والفعاليات',
  'البيئة المدرسية',
  'الأمن والسلامة',
  'البرامج التعليمية',
  'التواصل مع المدرسة',
  'الدعم والإرشاد',
  'المقصف المدرسي',
  'الطالبات المستجدات',
  'أخرى'
];

const SUPPORT_TYPES: SupportType[] = [
  'تقديم ورشة',
  'تدريب',
  'تطوع',
  'دعم عيني',
  'دعم تقني',
  'توفير جهة شريكة',
  'خبرة مهنية',
  'فكرة أخرى'
];

const STATUS_STEPS: ProposalStatus[] = [
  'جديدة',
  'قيد الدراسة',
  'تم اعتمادها',
  'قيد التنفيذ',
  'تم تنفيذها'
];

export const IdeaSubmission: React.FC = () => {
  const { 
    proposals, 
    addProposal, 
    currentUser, 
    isParentLoggedIn, 
    requireParentAuth, 
    openLoginModal 
  } = useApp();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetGroup, setTargetGroup] = useState('طالبات المرحلة الثانوية');
  const [field, setField] = useState<SubmissionCategory>('التقنية والتحول الرقمي');
  const [partnerEntity, setPartnerEntity] = useState('');
  const [supportType, setSupportType] = useState<SupportType>('تقديم ورشة');
  const [senderName, setSenderName] = useState(currentUser.name || '');
  const [senderPhone, setSenderPhone] = useState(currentUser.phone || '');
  const [senderEmail, setSenderEmail] = useState(currentUser.email || '');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Sync with current user
  React.useEffect(() => {
    if (currentUser.name) setSenderName(currentUser.name);
    if (currentUser.phone) setSenderPhone(currentUser.phone);
    if (currentUser.email) setSenderEmail(currentUser.email);
  }, [currentUser]);

  // Result state
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // Tracker Lookup State
  const [searchTrackingCode, setSearchTrackingCode] = useState('');
  const [searchedProposal, setSearchedProposal] = useState<any>(null);
  const [searchError, setSearchError] = useState(false);

  const executeSubmission = () => {
    if (!title.trim() || !description.trim()) return;

    const newProp = addProposal({
      title: title.trim(),
      description: description.trim(),
      targetGroup: targetGroup.trim(),
      field,
      partnerEntity: partnerEntity.trim() || undefined,
      supportType,
      senderName: isAnonymous ? 'ولي أمر' : (senderName.trim() || currentUser.name || 'ولي أمر'),
      senderPhone: senderPhone.trim() || currentUser.phone || undefined,
      senderEmail: senderEmail.trim() || currentUser.email || undefined,
      isAnonymous
    });

    setSubmittedCode(newProp.trackingCode);
    setTitle('');
    setDescription('');
    setPartnerEntity('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Check authentication
    if (!requireParentAuth(executeSubmission, 'يُرجى تسجيل الدخول لتقديم مقترح المبادرة المدرسية')) {
      return;
    }

    executeSubmission();
  };

  const handleSearchCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTrackingCode.trim()) return;

    const found = proposals.find(
      p => p.trackingCode.toLowerCase() === searchTrackingCode.trim().toLowerCase()
    );

    if (found) {
      setSearchedProposal(found);
      setSearchError(false);
    } else {
      setSearchedProposal(null);
      setSearchError(true);
    }
  };

  const getStepIndex = (status: ProposalStatus) => {
    return STATUS_STEPS.indexOf(status);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>من فكرة ملهمة إلى مبادرة مدرسية معتمدة</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          فكرتك مبادرة
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          لديكِ فكرة تسهم في إثراء مهارات الطالبات أو تحسين بيئة المدرسة؟ قدمي مقترحكِ وسيقوم فريق الشراكة بدراسته، اعتماده، وتوفير الموارد اللازمة لتنفيذه.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Proposal Submission Form (7 cols on lg) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          {submittedCode ? (
            <div className="text-center py-10 space-y-5 animate-fade-in">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 font-display">
                تم استلام فكرتكِ الرائعة بنجاح! 💡
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                شكرًا لمبادرتك واهتمامك بصناعة أثر نوعي لبناتنا. تم توليد رمز تتبع خاص بمقترحك لمتابعة حالته ومراحل تنفيذه:
              </p>

              <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 inline-block">
                <span className="text-xs text-amber-800 font-bold block mb-1">رمز تتبع المقترح الخاص بك</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-950 font-mono tracking-wider">
                  {submittedCode}
                </span>
              </div>

              <div className="text-xs text-slate-500 max-w-sm mx-auto">
                يمكنك استخدام هذا الرمز في أي وقت من خلال مربع البحث لمتابعة حالة اعتماد المبادرة.
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setSearchTrackingCode(submittedCode);
                    setSubmittedCode(null);
                  }}
                  className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
                >
                  متابعة حالة المقترح الآن
                </button>
                <button
                  onClick={() => setSubmittedCode(null)}
                  className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700"
                >
                  تقديم فكرة جديدة
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <span>نموذج تقديم فكرة ومقترح مبادرة</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  حقول واضحة تساعدنا على دراسة المبادرة وتنفيذها بالشكل الأمثل
                </p>
              </div>

              {/* Login Banner for Parents */}
              {!isParentLoggedIn && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-emerald-950">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold block">تسجيل الدخول مطلوب للمشاركة</span>
                      <span className="text-[11px] text-emerald-800">سجّلي دخولك لتثبيت مقترحك باسمك ومتابعة حالته وتكريمك لاحقًا</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => openLoginModal('تسجيل الدخول لتقديم مقترح المبادرة')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                  >
                    تسجيل الدخول
                  </button>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  اسم الفكرة أو المبادرة المقترحة <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: نادي الروبوتات والذكاء الاصطناعي المتقدم"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  وصف الفكرة وأهدافها بالتفصيل <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اشرحي كيف ستخدم هذه المبادرة الطالبات وما المخرجات المتوقعة منها..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-colors resize-none"
                ></textarea>
              </div>

              {/* Target Group & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الفئة المستفيدة <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    placeholder="مثال: طالبات الصف الأول الثانوي"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    المجال أو التصنيف <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={field}
                    onChange={(e) => setField(e.target.value as SubmissionCategory)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Partner Entity & Support Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    الجهة التي يمكن التعاون معها (إن وجدت)
                  </label>
                  <input
                    type="text"
                    value={partnerEntity}
                    onChange={(e) => setPartnerEntity(e.target.value)}
                    placeholder="مثال: سدايا، الهلال الأحمر، بنك التنمية"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نوع الدعم المقترح من جانبك <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={supportType}
                    onChange={(e) => setSupportType(e.target.value as SupportType)}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {SUPPORT_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sender Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    بيانات مقدم/ة المقترح
                  </span>
                  <label className="inline-flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-slate-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5"
                    />
                    <span>إرسال باسم مجهول للعامة</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">الاسم</label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="أم سارة"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">رقم الجوال للتنسيق</label>
                    <input
                      type="tel"
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">البريد الإلكتروني</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="mail@example.com"
                      className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md shadow-amber-500/20 hover:shadow-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>إرسال فكرة المبادرة والحصول على رمز التتبع</span>
              </button>
            </form>
          )}
        </div>

        {/* Live Idea Status Tracker & Community Proposals (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tracker Card */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 border border-slate-800 shadow-md space-y-5">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <Clock className="w-4 h-4" />
                <span>نظام متابعة حالة المبادرات</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                تتبعي فكرتك خطوة بخطوة
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mt-1">
                أدخلي رمز التتبع (مثال: SH-2026-01) للاطلاع على نتائج دراسة فكرتك واعتمادها
              </p>
            </div>

            <form onSubmit={handleSearchCode} className="flex gap-2">
              <input
                type="text"
                value={searchTrackingCode}
                onChange={(e) => setSearchTrackingCode(e.target.value)}
                placeholder="رمز التتبع: SH-2026-01"
                className="flex-1 px-3.5 py-2.5 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>استعلام</span>
              </button>
            </form>

            {searchError && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-xs text-rose-200">
                لم يتم العثور على مقترح بهذا الرمز. يرجى التحقق من صحة الرمز المدخل.
              </div>
            )}

            {/* Display Found Proposal Progress */}
            {searchedProposal && (
              <div className="bg-white/10 rounded-2xl p-4 border border-white/15 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <div>
                    <span className="text-[11px] text-amber-300 font-mono font-bold block">
                      {searchedProposal.trackingCode}
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      {searchedProposal.title}
                    </h4>
                  </div>
                  <span className="text-xs font-bold bg-amber-400 text-slate-950 px-2.5 py-1 rounded-full">
                    {searchedProposal.status}
                  </span>
                </div>

                {/* 5-Step Visual Timeline */}
                <div className="space-y-2 pt-1">
                  <span className="text-[11px] text-slate-300 font-bold block">مراحل المبادرة:</span>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {STATUS_STEPS.map((step, idx) => {
                      const currentIdx = getStepIndex(searchedProposal.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="space-y-1">
                          <div className={`h-2 rounded-full transition-all ${
                            isCurrent
                              ? 'bg-amber-400 animate-pulse'
                              : isCompleted
                                ? 'bg-emerald-500'
                                : 'bg-white/20'
                          }`}></div>
                          <span className={`text-[10px] block truncate ${
                            isCompleted ? 'text-white font-bold' : 'text-slate-400'
                          }`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {searchedProposal.schoolResponse && (
                  <div className="p-2.5 bg-emerald-900/50 border border-emerald-500/40 rounded-xl text-xs text-emerald-200">
                    <span className="font-bold block text-emerald-100 mb-0.5">تحديث إدارة المدرسة:</span>
                    {searchedProposal.schoolResponse}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick List of Approved & Active Proposals */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
              <span>أحدث مقترحات أولياء الأمور المعتمدة</span>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                {proposals.length} مقترحات
              </span>
            </h4>

            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {proposals.slice(0, 5).map((prop) => (
                <div
                  key={prop.id}
                  onClick={() => {
                    setSearchedProposal(prop);
                    setSearchTrackingCode(prop.trackingCode);
                  }}
                  className="p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 truncate max-w-[200px]">
                      {prop.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'تم تنفيذها' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'قيد التنفيذ' ? 'bg-sky-100 text-sky-800' :
                      prop.status === 'تم اعتمادها' ? 'bg-purple-100 text-purple-800' :
                      prop.status === 'قيد الدراسة' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {prop.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{prop.field}</span>
                    <span className="font-mono text-emerald-800 font-bold">{prop.trackingCode}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
