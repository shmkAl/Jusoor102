import React from 'react';
import { ShieldAlert, Lock, ArrowRight, Home } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CoordinatorAuthGate: React.FC = () => {
  const { openCoordinatorAuthModal, setActiveTab } = useApp();

  return (
    <div className="py-16 sm:py-24 max-w-lg mx-auto px-4 text-center">
      <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 font-display">
            بوابة منسقة الشراكة الخاصة
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            لوحة تحكم الشراكة المجتمعية مخصصة ومحمية للأستاذة: <strong className="text-emerald-800">شهد العتيبي</strong> (منسقة الشراكة المجتمعية) والمشرفات المعتمدات فقط، ولا تظهر لعموم المستخدمين.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2 text-right">
          <Lock className="w-4 h-4 text-slate-400 shrink-0" />
          <span>إذا كنتِ المنسقة، يُرجى تسجيل الدخول برمز التحقق لفتح لوحة التحكم والإشراف.</span>
        </div>

        <div className="space-y-2.5 pt-2">
          <button
            onClick={openCoordinatorAuthModal}
            className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4 text-emerald-200" />
            <span>تسجيل دخول المنسقة (أ. شهد العتيبي)</span>
          </button>

          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4 text-slate-500" />
            <span>العودة للصفحة الرئيسية</span>
          </button>
        </div>
      </div>
    </div>
  );
};
