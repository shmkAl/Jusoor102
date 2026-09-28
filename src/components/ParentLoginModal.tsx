import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserCheck, 
  Phone, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  BookOpen,
  Briefcase,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ParentLoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    loginModalReason, 
    parentLogin,
    coordinatorLogin,
    currentUser,
    studentName: defaultStudentName
  } = useApp();

  const [userCategory, setUserCategory] = useState<'parent' | 'teacher' | 'staff'>('parent');
  const [step, setStep] = useState<'info' | 'otp'>('info');

  // Form Fields
  const [name, setName] = useState(currentUser.name || 'أم سارة العتيبي');
  const [phone, setPhone] = useState(currentUser.phone || '0501234567');
  const [student, setStudent] = useState(defaultStudentName || 'سارة فهد العتيبي');
  const [grade, setGrade] = useState('الثاني ثانوي');
  const [teacherSubject, setTeacherSubject] = useState('الفيزياء والعلوم التطبيقية');
  const [staffRole, setStaffRole] = useState('وكيلة شؤون الطالبات');

  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4']);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLoginModalOpen) return null;

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('يرجى إدخال الاسم الكريم ورقم الجوال للمتابعة');
      return;
    }

    if (userCategory === 'parent' && !student.trim()) {
      setErrorMsg('يرجى إدخال اسم الطالبة الكريمة');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
    }, 400);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      executeLogin();
    }, 450);
  };

  const executeLogin = () => {
    let studentValue = '';
    let titleValue = '';

    if (userCategory === 'parent') {
      studentValue = student.trim() || 'سارة فهد العتيبي';
      titleValue = `ولي أمر الطالبة: ${studentValue} (${grade})`;
    } else if (userCategory === 'teacher') {
      studentValue = teacherSubject;
      titleValue = `معلمة: ${teacherSubject}`;
    } else {
      studentValue = staffRole;
      titleValue = `إدارية: ${staffRole}`;
    }

    parentLogin(name, phone, studentValue, userCategory, titleValue);
  };

  const handleQuickDemoLogin = (
    demoName: string, 
    demoPhone: string, 
    demoStudent: string, 
    cat: 'parent' | 'teacher' | 'staff',
    demoTitle: string
  ) => {
    setName(demoName);
    setPhone(demoPhone);
    setUserCategory(cat);
    if (cat === 'parent') setStudent(demoStudent);
    if (cat === 'teacher') setTeacherSubject(demoStudent);
    if (cat === 'staff') setStaffRole(demoStudent);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      parentLogin(demoName, demoPhone, demoStudent, cat, demoTitle);
    }, 300);
  };

  const handleCoordinatorDirectLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      coordinatorLogin('shmk20064@gmail.com');
      closeLoginModal();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-100 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-850 via-teal-900 to-emerald-950 text-white p-5 sm:p-6 relative">
          <button
            onClick={closeLoginModal}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 text-slate-950 flex items-center justify-center shadow-md shrink-0">
              <LogIn className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-display text-white">
                  تسجيل الدخول
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  بوابة جسور الموحدة
                </span>
              </div>
              <p className="text-xs text-emerald-200/90 font-medium mt-0.5">
                مرحباً بأولياء الأمور والمعلمات والمنسوبات الإداريات بالثانوية 102
              </p>
            </div>
          </div>

          {/* Reason Badge */}
          {loginModalReason && (
            <div className="mt-3.5 p-2.5 rounded-2xl bg-white/10 border border-white/15 text-xs text-emerald-100 flex items-start gap-2 backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <span>{loginModalReason}</span>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold">
              {errorMsg}
            </div>
          )}

          {step === 'info' ? (
            <form onSubmit={handleInfoSubmit} className="space-y-4">
              
              {/* Role Selection Tabs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  الصفة / الفئة:
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setUserCategory('parent');
                      setName('أم سارة العتيبي');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userCategory === 'parent'
                        ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>ولي أمر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserCategory('teacher');
                      setName('أ. مريم السلمي');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userCategory === 'teacher'
                        ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>معلمة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserCategory('staff');
                      setName('أ. نورة الشهري');
                    }}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      userCategory === 'staff'
                        ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/80 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>كادر إداري</span>
                  </button>
                </div>
              </div>

              {/* Name Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span>
                    {userCategory === 'parent' 
                      ? 'اسم ولي الأمر (الاسم الكريم)' 
                      : userCategory === 'teacher' 
                        ? 'اسم المعلمة الكريمة' 
                        : 'اسم المنسوبة الإدارية'}
                    <span className="text-rose-500 mr-1">*</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder={
                    userCategory === 'parent' 
                      ? 'مثال: أم سارة العتيبي / فهد بن محمد العتيبي' 
                      : userCategory === 'teacher' 
                        ? 'مثال: أ. مريم السلمي' 
                        : 'مثال: أ. نورة الشهري'
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Phone Field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>رقم الجوال <span className="text-rose-500">*</span></span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="05xxxxxxxx"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  dir="ltr"
                />
              </div>

              {/* Conditional Fields based on Role */}
              {userCategory === 'parent' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>اسم الطالبة <span className="text-rose-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      required
                      value={student}
                      onChange={e => setStudent(e.target.value)}
                      placeholder="مثال: سارة فهد العتيبي"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      المرحلة الدراسية
                    </label>
                    <select
                      value={grade}
                      onChange={e => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      <option value="الأول ثانوي">الأول ثانوي</option>
                      <option value="الثاني ثانوي">الثاني ثانوي</option>
                      <option value="الثالث ثانوي">الثالث ثانوي</option>
                    </select>
                  </div>
                </div>
              )}

              {userCategory === 'teacher' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    <span>المادة / التخصص التعليمي</span>
                  </label>
                  <select
                    value={teacherSubject}
                    onChange={e => setTeacherSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="الفيزياء والعلوم التطبيقية">الفيزياء والعلوم التطبيقية</option>
                    <option value="الرياضيات والإحصاء">الرياضيات والإحصاء</option>
                    <option value="اللغة العربية والدراسات الإسلامية">اللغة العربية والدراسات الإسلامية</option>
                    <option value="الحاسب والذكاء الاصطناعي">الحاسب والذكاء الاصطناعي</option>
                    <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                    <option value="رائدة النشاط والشراكة المدرسية">رائدة النشاط والشراكة المدرسية</option>
                  </select>
                </div>
              )}

              {userCategory === 'staff' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>المسمى الوظيفي الإداري</span>
                  </label>
                  <select
                    value={staffRole}
                    onChange={e => setStaffRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="وكيلة شؤون الطالبات">وكيلة شؤون الطالبات</option>
                    <option value="وكيلة الشؤون التعليمية">وكيلة الشؤون التعليمية</option>
                    <option value="الموجهة الطلابية">الموجهة الطلابية</option>
                    <option value="منسقة الشراكة المدرسية (ارتقاء)">منسقة الشراكة المدرسية (ارتقاء)</option>
                    <option value="مسؤولة القبول والتسجيل">مسؤولة القبول والتسجيل</option>
                    <option value="سكرتارية وإدارة">سكرتارية وإدارة</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-700/20 hover:shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>متابعة والتحقق برمز الدخول</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Quick 1-Click Demo Logins for All 3 Roles */}
              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-500 text-center mb-2.5">
                  الدخول السريع بنقرة واحدة:
                </p>

                {/* Coordinator & Site Admin Quick Access */}
                <button
                  type="button"
                  onClick={handleCoordinatorDirectLogin}
                  className="w-full mb-2.5 p-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xs shadow-sm flex items-center justify-between transition-all cursor-pointer border border-amber-500/50"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-slate-950" />
                    <span>منسقة الشراكة: أ. شهد العتيبي</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-800 font-bold" dir="ltr">shmk20064@gmail.com</span>
                </button>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('أم سارة العتيبي', '0501234567', 'سارة فهد العتيبي', 'parent', 'ولي أمر: سارة العتيبي')}
                    className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-950 text-center text-xs transition-colors cursor-pointer group"
                  >
                    <div className="font-bold text-[11px] flex items-center justify-center gap-1">
                      <span>أم سارة</span>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    </div>
                    <span className="text-[10px] text-emerald-700 block mt-0.5">ولي أمر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('أ. مريم السلمي', '0551122334', 'الفيزياء والنشاط', 'teacher', 'معلمة: أ. مريم السلمي')}
                    className="p-2 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200/80 text-teal-950 text-center text-xs transition-colors cursor-pointer group"
                  >
                    <div className="font-bold text-[11px] flex items-center justify-center gap-1">
                      <span>أ. مريم</span>
                      <CheckCircle2 className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-[10px] text-teal-700 block mt-0.5">معلمة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin('أ. نورة الشهري', '0559988776', 'وكيلة شؤون الطالبات', 'staff', 'إدارية: أ. نورة الشهري')}
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200/80 text-amber-950 text-center text-xs transition-colors cursor-pointer group"
                  >
                    <div className="font-bold text-[11px] flex items-center justify-center gap-1">
                      <span>أ. نورة</span>
                      <CheckCircle2 className="w-3 h-3 text-amber-600" />
                    </div>
                    <span className="text-[10px] text-amber-800 block mt-0.5">إدارية</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-5 text-center">
              <div className="space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  تم إرسال رمز التحقق
                </h4>
                <p className="text-xs text-slate-500">
                  أدخل رمز التحقق المرسل في رسالة نصية إلى رقم الجوال <strong dir="ltr" className="text-emerald-700">{phone}</strong>
                </p>
              </div>

              <div className="flex justify-center gap-3" dir="ltr">
                {otpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => {
                      const newArr = [...otpCode];
                      newArr[idx] = e.target.value;
                      setOtpCode(newArr);
                    }}
                    className="w-12 h-12 rounded-xl border-2 border-emerald-300 text-center font-black text-xl text-emerald-900 focus:outline-none focus:border-emerald-600 bg-emerald-50/40"
                  />
                ))}
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>رمز التجربة المعتمد تلقائيًا: <strong>1234</strong></span>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  تعديل البيانات
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <span>تأكيد الدخول وبدء المشاركة</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
