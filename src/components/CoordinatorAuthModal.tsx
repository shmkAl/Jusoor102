import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CoordinatorAuthModal: React.FC = () => {
  const { 
    isCoordinatorAuthModalOpen, 
    closeCoordinatorAuthModal, 
    coordinatorLogin 
  } = useApp();

  const [inputCode, setInputCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isCoordinatorAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMsg('يرجى إدخال رمز التحقق أو بريد منسقة الشراكة');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      setIsLoading(false);
      const success = coordinatorLogin(inputCode);
      if (!success) {
        setErrorMsg('رمز التحقق غير صحيح. يمكنك استخدام الرمز المعتمد (102) أو البريد الرسمي.');
      } else {
        setInputCode('');
      }
    }, 350);
  };

  const handleQuickCoordinatorLogin = () => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsLoading(false);
      coordinatorLogin('shmk20064@gmail.com');
      setInputCode('');
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-scaleUp"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-6 relative">
          <button
            onClick={closeCoordinatorAuthModal}
            className="absolute top-5 left-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black font-display text-white">
                  بوابة منسقة الشراكة
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
                  الشراكة المجتمعية
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                مخصص للأستاذة: <strong className="text-white">شهد العتيبي</strong> (منسقة الشراكة المجتمعية)
              </p>
              <p className="text-[11px] text-amber-300 font-mono mt-0.5" dir="ltr">
                shmk20064@gmail.com
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed">
            <p className="flex items-start gap-2">
              <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                مرحباً بكِ منسقة الشراكة <strong>شهد العتيبي</strong>. يمكنكِ الدخول المباشر لصفحتكِ وتنسيق كافة أقسام ومبادرات المنصة.
              </span>
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>البريد الإلكتروني المعتمد أو رمز الدخول السري:</span>
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={inputCode}
                  onChange={e => setInputCode(e.target.value)}
                  placeholder="shmk20064@gmail.com أو الرمز (102)"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-300 text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>الرمز السريع: <strong>102</strong> أو البريد الرسمي</span>
                </span>
                <span>الثانوية 102</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>تأكيد الهوية والدخول للوحة منسقة الشراكة</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleQuickCoordinatorLogin}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>دخول فوري مباشر: منسقة الشراكة شهد العتيبي (shmk20064@gmail.com)</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
