import React from 'react';
import { 
  Building2, 
  MapPin, 
  Heart, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ArrowUp,
  Lock,
  Shield,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MinistryOfEducationLogo } from './MinistryLogo';

export const Footer: React.FC = () => {
  const { setActiveTab, isCoordinatorLoggedIn, openCoordinatorAuthModal } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-10">
          {/* Col 1: Platform Brand (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-display font-black text-2xl shadow-lg">
                ج
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-display">
                  منصة «جسور الـ ١٠٢»
                </h3>
                <p className="text-xs text-emerald-400 font-bold">
                  المدرسة الثانوية 102 للبنات • وحدة ارتقاء للشراكة المجتمعية
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              «معًا نصنع أثرًا أفضل لبناتنا».. منصة تفاعلية متكاملة لترسيخ دور الأسرة كشريك استراتيجي في العملية التعليمية، وتحقيق مستهدفات برنامج تنمية القدرات البشرية ورؤية 2030.
            </p>


          </div>

          {/* Col 2: Quick Links (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              أقسام المنصة وقنوات المشاركة
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => { setActiveTab('voice'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                صوت ولي الأمر
              </button>
              <button
                onClick={() => { setActiveTab('vote'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                صوتك يصنع القرار
              </button>
              <button
                onClick={() => { setActiveTab('idea'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                فكرتك مبادرة
              </button>
              <button
                onClick={() => { setActiveTab('partner-skills'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                بنك خبرات الشركاء
              </button>
              <button
                onClick={() => { setActiveTab('initiatives'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                مبادراتنا المجتمعية
              </button>
              <button
                onClick={() => { setActiveTab('you-said-we-did'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                قلتم وفعلنا (الشفافية)
              </button>
              <button
                onClick={() => { setActiveTab('council'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                مجلس الأسرة الرقمي
              </button>
              <button
                onClick={() => { setActiveTab('stories'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                قصص النجاح
              </button>
              <button
                onClick={() => { setActiveTab('impact'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                لوحة الأثر بالأرقام
              </button>
              <button
                onClick={() => { setActiveTab('parent-portal'); scrollToTop(); }}
                className="text-right text-slate-400 hover:text-emerald-400 transition-colors py-1 cursor-pointer"
              >
                بوابة ولي الأمر
              </button>
            </div>
          </div>

          {/* Col 3: Contact & Info (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-slate-200">
              تواصل مع وحدة الشراكة
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>جدة، المدرسة الثانوية 102 للبنات</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-2">
              <button
                onClick={scrollToTop}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>الرجوع للأعلى</span>
              </button>

              {/* Discreet Coordinator Access */}
              {isCoordinatorLoggedIn ? (
                <button
                  onClick={() => { setActiveTab('coordinator'); scrollToTop(); }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>لوحة المنسقة (أ. شهد)</span>
                </button>
              ) : (
                <button
                  onClick={openCoordinatorAuthModal}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-emerald-400 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="الدخول الخاص لمنسقة الشراكة المجتمعية"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>دخول المنسقة</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* High-Capacity Infrastructure Banner */}
        <div className="mb-6 py-2.5 px-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>نظام سحابي عالي الاستيعاب (High Capacity)</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>جاهزية تفاعلية: <strong>10,000+ مستخدم نشط</strong></span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">زمن استجابة فائق: <strong>&lt; 50ms</strong></span>
            <span className="hidden sm:inline">•</span>
            <span>تخزين مرن ومقاوم للضغط</span>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3 text-center sm:text-right">
          <p>
            جميع الحقوق محفوظة © {new Date().getFullYear()} • الثانوية 102 للبنات • منصة جسور الـ ١٠٢
          </p>
          <p className="flex items-center gap-1">
            <span>مبادرة تربوية مجتمعية ترتقي بتعليم وبناء بناتنا</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
