import React from 'react';
import { 
  MessageSquareQuote, 
  MessageSquare,
  Lightbulb, 
  Compass, 
  Sparkles, 
  TrendingUp, 
  Users, 
  Award, 
  Building2, 
  ArrowLeft,
  CheckCircle,
  Brain,
  Megaphone,
  Eye,
  CalendarDays
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MinistryOfEducationLogo } from './MinistryLogo';
import { HomeAnnouncementsSection } from './HomeAnnouncementsSection';

export const Hero: React.FC = () => {
  const { 
    setActiveTab, 
    voices, 
    proposals, 
    initiatives, 
    partnerSkills, 
    partners 
  } = useApp();

  // Real-time live aggregated statistics
  const totalParticipations = voices.length + 840;
  const totalProposals = proposals.length;
  const totalInitiatives = initiatives.length;
  const participatingParentsCount = 920 + partnerSkills.length;
  const totalCommunityPartners = partners.length;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-teal-900 to-slate-900 text-white pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle Background Geometric Accents */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Hero Header & Taglines */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-semibold backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>منصة الشراكة المجتمعية • الثانوية 102 للبنات بجدة</span>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/95 shadow-sm border border-white/20">
              <MinistryOfEducationLogo variant="color" className="h-6" />
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display">
            جسور الـ ١٠٢
          </h1>

          <p className="text-xl sm:text-2xl font-bold text-amber-300 font-display">
            معًا نصنع أثرًا أفضل لبناتنا
          </p>

          <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal max-w-2xl mx-auto">
            «نؤمن أن الأسرة شريك أساسي في نجاح الطالبة، ومن خلال آرائكم ومقترحاتكم ومشاركاتكم نبني بيئة تعليمية أكثر جودة وفاعلية.»
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setActiveTab('calendar')}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-base shadow-lg shadow-emerald-950/25 hover:shadow-emerald-950/40 hover:-translate-y-0.5 transition-all flex items-center gap-2.5 cursor-pointer border border-emerald-300/80 group"
            >
              <CalendarDays className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <span>تقويم الفعاليات والاجتماعات</span>
            </button>

            <button
              onClick={() => setActiveTab('discussion')}
              className="px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-base shadow-lg shadow-teal-400/20 hover:shadow-teal-400/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5 text-slate-950" />
              <span>لوحة النقاش (محادثة)</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-base shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquareQuote className="w-5 h-5 text-slate-950" />
              <span>أبدي رأيك</span>
            </button>

            <button
              onClick={() => setActiveTab('idea')}
              className="px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-base shadow-lg shadow-amber-400/20 hover:shadow-amber-400/35 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Lightbulb className="w-5 h-5 text-slate-950" />
              <span>اقترحي فكرة</span>
            </button>

            <button
              onClick={() => setActiveTab('initiatives')}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base border border-white/20 hover:border-white/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 backdrop-blur-xs cursor-pointer"
            >
              <Compass className="w-5 h-5 text-emerald-300" />
              <span>شاركي في مبادرة</span>
            </button>
          </div>
        </div>

        {/* Live Announcements Ticker & Photo Topics Showcase */}
        <HomeAnnouncementsSection />

        {/* Live Statistics Counter Ribbon */}
        <div className="mt-14 pt-8 border-t border-emerald-800/60">
          <div className="text-center mb-6">
            <span className="text-xs uppercase tracking-widest text-emerald-300/80 font-bold">
              إحصائيات الشراكة الحية لعام 1448هـ
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            {/* Stat 1: Participations */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 mx-auto mb-2 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <MessageSquareQuote className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {totalParticipations.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-1">
                عدد المشاركات
              </div>
            </div>

            {/* Stat 2: Proposals */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 mx-auto mb-2 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {totalProposals.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-1">
                عدد المقترحات
              </div>
            </div>

            {/* Stat 3: Initiatives */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 mx-auto mb-2 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {totalInitiatives.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-1">
                عدد المبادرات
              </div>
            </div>

            {/* Stat 4: Participating Parents */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 mx-auto mb-2 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <Users className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {participatingParentsCount.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-1">
                أولياء الأمور المشاركون
              </div>
            </div>

            {/* Stat 5: Community Partnerships */}
            <div className="col-span-2 md:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-center hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 mx-auto mb-2 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <Building2 className="w-3.5 h-3.5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white font-display">
                {totalCommunityPartners.toLocaleString('ar-SA')}
              </div>
              <div className="text-xs sm:text-sm text-emerald-200/80 font-medium mt-1">
                الشراكات المجتمعية
              </div>
            </div>
          </div>
        </div>

        {/* The Core Partnership Cycle (دورة الشراكة والأثر) */}
        <div className="mt-12 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>دورة الشراكة: من صوتك إلى الأثر الملموس</span>
              </h3>
              <p className="text-xs text-emerald-200/80 mt-0.5">
                كل رأي أو مقترح يمر برحلة عمل ممنهجة لضمان تحويله إلى إنجاز فعلي في الثانوية 102
              </p>
            </div>
            <button
              onClick={() => setActiveTab('you-said-we-did')}
              className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 group"
            >
              <span>اطّلعي على قسم «ماذا قلتم وماذا فعلنا»</span>
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">1</div>
              <div className="text-sm font-bold text-white">ولي الأمر يشارك</div>
              <div className="text-[11px] text-emerald-300/80 mt-1">إرسال رأي أو فكرة</div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">2</div>
              <div className="text-sm font-bold text-white">المدرسة تستمع</div>
              <div className="text-[11px] text-teal-300/80 mt-1">استقبال وتوثيق</div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">3</div>
              <div className="text-sm font-bold text-white">تحليل بالذكاء الاصطناعي</div>
              <div className="text-[11px] text-sky-300/80 mt-1">فرز المشاعر والتوصيات</div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">4</div>
              <div className="text-sm font-bold text-white">اتخاذ الإجراء</div>
              <div className="text-[11px] text-amber-300/80 mt-1">اعتماد وتنفيذ المبادرة</div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">5</div>
              <div className="text-sm font-bold text-white">عرض النتيجة</div>
              <div className="text-[11px] text-purple-300/80 mt-1">شفافية كاملة</div>
            </div>

            <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-300 flex items-center justify-center mx-auto mb-2 text-sm font-bold">6</div>
              <div className="text-sm font-bold text-white">أثر ملموس</div>
              <div className="text-[11px] text-rose-300/80 mt-1">قياس تحسن بيئة بناتنا</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
