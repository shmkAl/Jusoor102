import React, { useState } from 'react';
import { 
  UserCheck, 
  MessageSquareQuote, 
  Lightbulb, 
  Vote, 
  Users, 
  Clock, 
  CheckCircle2, 
  Star, 
  Sparkles, 
  ArrowLeft, 
  PlusCircle, 
  GraduationCap, 
  ShieldCheck,
  Edit3,
  LogIn,
  LogOut,
  CalendarDays,
  BellRing,
  Bell,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ParentPortal: React.FC = () => {
  const { 
    currentUser, 
    setCurrentUser,
    setActiveTab, 
    voices, 
    proposals, 
    polls, 
    userVotedPolls, 
    partnerSkills,
    isParentLoggedIn,
    openLoginModal,
    parentLogout,
    studentName,
    currentUserSupervisorData,
    isCurrentUserSupervisor,
    loginAsSupervisor,
    events,
    userReminders,
    hasEventReminder,
    removeEventReminder,
    isCoordinatorLoggedIn,
    openCoordinatorAuthModal
  } = useApp();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [phoneInput, setPhoneInput] = useState(currentUser.phone);
  const [emailInput, setEmailInput] = useState(currentUser.email);

  // Filter items belonging to current user
  const myVoices = voices.filter(v => v.authorName === currentUser.name || v.authorName === 'أم سارة العتيبي');
  const myProposals = proposals.filter(p => p.senderName === currentUser.name || p.senderName === 'أم سارة العتيبي');
  const mySkills = partnerSkills.filter(s => s.fullName === currentUser.name || s.fullName === 'أم سارة العتيبي' || s.phone === currentUser.phone);
  const myVotedPollsCount = Object.keys(userVotedPolls).length;
  const myRemindedEvents = events.filter(e => hasEventReminder(e.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser(prev => ({
      ...prev,
      name: nameInput,
      phone: phoneInput,
      email: emailInput
    }));
    setIsEditingProfile(false);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Login Prompt Banner if not logged in */}
      {!isParentLoggedIn && (
        <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-600 shadow-lg">
          <div className="flex items-center gap-3 text-right">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0">
              <LogIn className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-display text-white">
                تسجيل الدخول للمشاركة ومتابعة الإنجازات
              </h3>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                سجّلي دخولك (ولي أمر، معلمة، إدارية) للوصول إلى كافة المشاركات والمقترحات والتفاعل.
              </p>
            </div>
          </div>
          <button
            onClick={() => openLoginModal('تسجيل الدخول للوصول للبوابة والمشاركات')}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-xs shadow-md transition-colors shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <LogIn className="w-4 h-4" />
            <span>تسجيل الدخول الآن</span>
          </button>
        </div>
      )}

      {/* Welcome Card & Student Identity */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-9 border border-emerald-700 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-black text-2xl flex items-center justify-center shadow-lg font-display">
              {currentUser.name.charAt(0) || 'أ'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-0.5 rounded-full">
                  ولي أمر متميز
                </span>
                <span className="text-xs text-emerald-200">الثانوية 102</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
                مرحبًا بكِ، {currentUser.name} 🌷
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/80">
                الطالبة: <strong>{studentName || 'سارة فهد العتيبي'}</strong> (المرحلة: الثاني ثانوي)
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل البيانات</span>
            </button>
            {isCoordinatorLoggedIn ? (
              <button
                onClick={() => setActiveTab('coordinator')}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-950" />
                <span>لوحة المنسقة (أ. شهد العتيبي)</span>
              </button>
            ) : (
              <button
                onClick={openCoordinatorAuthModal}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="الدخول الخاص لمنسقة الشراكة"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
                <span>دخول المنسقة</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab('idea')}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lightbulb className="w-4 h-4" />
              <span>تقديم فكرة جديدة</span>
            </button>
            {isParentLoggedIn && (
              <button
                onClick={parentLogout}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-bold text-xs border border-rose-400/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تسجيل الخروج</span>
              </button>
            )}
          </div>
        </div>

        {/* Supervisor Delegated Card if current user is an appointed supervisor */}
        {isCurrentUserSupervisor && currentUserSupervisorData && (
          <div className="mt-6 bg-gradient-to-r from-amber-500/20 via-teal-500/20 to-emerald-500/20 border border-amber-400/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0 shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-bold text-xs bg-amber-500/30 px-2 py-0.5 rounded-full border border-amber-400/40">
                    تكليف إشرافي معتمد
                  </span>
                  <span className="text-white text-xs font-medium">
                    بواسطة: {currentUserSupervisorData.assignedBy}
                  </span>
                </div>
                <h4 className="text-white font-bold text-sm sm:text-base mt-0.5">
                  تم تعيينكِ مشرفةً مفوضة لصلاحيات الشراكة المجتمعية ({currentUserSupervisorData.permissions.length} صلاحيات)
                </h4>
                <p className="text-xs text-emerald-100/80 mt-0.5">
                  {currentUserSupervisorData.notes || 'يمكنكِ ممارسة الصلاحيات المفوضة لكِ بالدخول المباشر إلى لوحة الإشراف.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => loginAsSupervisor(currentUserSupervisorData.id)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span>الدخول للوحة الإشراف المفوضة ←</span>
            </button>
          </div>
        )}

        {/* Profile Edit Drawer Form */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] text-emerald-200 mb-1">الاسم الكامل</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-emerald-200 mb-1">رقم الجوال</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-[11px] text-emerald-200 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                حفظ التعديلات
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Summary Stat Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
            <MessageSquareQuote className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-display">{myVoices.length || 2}</span>
          <span className="text-xs text-slate-500 block font-medium">مشاركاتي في صوت ولي الأمر</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
            <Lightbulb className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-display">{myProposals.length || 1}</span>
          <span className="text-xs text-slate-500 block font-medium">مقترحاتي المقدمة</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-1">
            <Vote className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-display">{myVotedPollsCount}</span>
          <span className="text-xs text-slate-500 block font-medium">استطلاعات تم التصويت فيها</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-display">{mySkills.length || 1}</span>
          <span className="text-xs text-slate-500 block font-medium">مهارات في بنك الخبرات</span>
        </div>
      </div>

      {/* Two Column Layout: My Proposals Tracker & My Voices / Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* My Proposals & Live Status (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              <span>مقترحاتي ومراحل تقدمها</span>
            </h3>
            <button
              onClick={() => setActiveTab('idea')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>+ فكرة جديدة</span>
            </button>
          </div>

          <div className="space-y-4">
            {myProposals.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                لم تقدمي مقترحات بعد. اضغطي على زر "تقديم فكرة جديدة" لمشاركتنا أفكارك!
              </div>
            ) : (
              myProposals.map((prop) => (
                <div
                  key={prop.id}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-emerald-800">
                        {prop.trackingCode}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{prop.title}</h4>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      prop.status === 'تم تنفيذها' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'قيد التنفيذ' ? 'bg-sky-100 text-sky-800' :
                      prop.status === 'تم اعتمادها' ? 'bg-purple-100 text-purple-800' :
                      prop.status === 'قيد الدراسة' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prop.description}
                  </p>

                  {prop.schoolResponse && (
                    <div className="bg-emerald-100/60 p-2.5 rounded-xl border border-emerald-200 text-xs text-emerald-900">
                      <strong>رد إدارة المدرسة:</strong> {prop.schoolResponse}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Registered Skills & Participations (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Registered Skills in Talent Bank */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>مهاراتي في بنك الخبرات</span>
              </h3>
              <button
                onClick={() => setActiveTab('partner-skills')}
                className="text-xs font-bold text-indigo-700 hover:underline"
              >
                + إضافة مهارة
              </button>
            </div>

            <div className="space-y-2.5">
              {mySkills.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  لم تسجلي مهاراتك بعد في بنك الخبرات. شاركينا تخصصك لدعم الطالبات!
                </div>
              ) : (
                mySkills.map((skill) => (
                  <div key={skill.id} className="p-3 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-950">{skill.skillCategory}</span>
                      <span className="text-[10px] bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                        {skill.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{skill.experienceDetails}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events & Subscribed Reminders Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-emerald-600" />
                <span>تذكيراتي والفعاليات القادمة ({myRemindedEvents.length})</span>
              </h3>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                عرض التقويم الكامل ←
              </button>
            </div>

            <div className="space-y-2.5">
              {myRemindedEvents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs space-y-2">
                  <p>لم تقومي بتفعيل تذكيرات للفعاليات بعد.</p>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg font-bold text-[11px] border border-emerald-200 hover:bg-emerald-100"
                  >
                    استعراض جدول الفعاليات وتفعيل التنبيهات 🔔
                  </button>
                </div>
              ) : (
                myRemindedEvents.slice(0, 3).map((ev) => (
                  <div key={ev.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-950">{ev.title}</span>
                      <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <BellRing className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
                        <span>مفعّل</span>
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center justify-between">
                      <span>🗓️ {ev.date} • {ev.time}</span>
                      <button
                        onClick={() => removeEventReminder(ev.id)}
                        className="text-[10px] text-rose-600 hover:underline font-bold"
                      >
                        إلغاء التذكير
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Direct Actions Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>قنوات التفاعل السريعة</span>
            </h4>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('voice')}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-right flex items-center justify-between transition-colors"
              >
                <span>إبداء ملاحظة أو رأي جديد</span>
                <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
              </button>
              <button
                onClick={() => setActiveTab('vote')}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-right flex items-center justify-between transition-colors"
              >
                <span>المشاركة في الاستطلاعات المفتوحة</span>
                <ArrowLeft className="w-3.5 h-3.5 text-teal-400" />
              </button>
              <button
                onClick={() => setActiveTab('council')}
                className="w-full py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-right flex items-center justify-between transition-colors"
              >
                <span>المشاركة في مجلس الأسرة الرقمي</span>
                <ArrowLeft className="w-3.5 h-3.5 text-violet-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
