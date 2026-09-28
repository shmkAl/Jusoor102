import React from 'react';
import { 
  X, 
  Printer, 
  FileText, 
  Award, 
  Building2, 
  Users, 
  Star, 
  Calendar, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MinistryOfEducationLogo } from '../MinistryLogo';

interface PartnershipReportModalProps {
  onClose: () => void;
}

export const PartnershipReportModal: React.FC<PartnershipReportModalProps> = ({ onClose }) => {
  const { initiatives, proposals, voices, partnerSkills, partners, aiReport } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-10 space-y-8 animate-fade-in print:p-0 print:border-none print:shadow-none">
        {/* Top Actions (hidden during print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 print:hidden">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <FileText className="w-5 h-5" />
            <span>معاينة التقرير الرسمي للشراكة المجتمعية • الفصل الدراسي الثاني 1448هـ</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Header */}
        <div className="border-b-2 border-emerald-900 pb-6 space-y-4 text-center">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <div className="text-right space-y-1">
              <MinistryOfEducationLogo variant="color" className="h-12 mb-1" />
              <p className="font-bold text-slate-700">الإدارة العامة للتعليم بمحافظة جدة</p>
              <p className="font-bold text-emerald-900">المدرسة الثانوية 102 للبنات بجدة</p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto shadow-md font-display font-black text-xl mb-1">
                ج
              </div>
              <span className="font-bold text-xs text-slate-900">منصة جسور الـ ١٠٢</span>
            </div>

            <div className="text-left space-y-0.5">
              <p>التاريخ: 1448/06/15هـ</p>
              <p>الموضوع: تقرير إنجاز الشراكة</p>
              <p>وحدة: ارتقاء والشراكة المجتمعية</p>
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-900 font-display pt-2">
            التقرير الدوري لمخرجات الشراكة المجتمعية بين المدرسة والأسرة
          </h2>
          <p className="text-xs text-slate-600">
            شعار الشراكة: «معًا نصنع أثرًا أفضل لبناتنا»
          </p>
        </div>

        {/* Section 1: Strategic Impact Numbers */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-950 border-r-4 border-emerald-600 pr-2">
            أولاً: ملخص المؤشرات الاستراتيجية والأرقام المحققة
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">رضا أولياء الأمور</span>
              <span className="text-xl font-black text-emerald-700 font-display">96.4%</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">الطالبات المستفيدات</span>
              <span className="text-xl font-black text-slate-900 font-display">1,280</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">المبادرات المنفذة</span>
              <span className="text-xl font-black text-slate-900 font-display">{initiatives.length}</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-500 block">الساعات التطوعية</span>
              <span className="text-xl font-black text-slate-900 font-display">450 ساعة</span>
            </div>
          </div>
        </div>

        {/* Section 2: Implemented Initiatives */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-emerald-950 border-r-4 border-emerald-600 pr-2">
            ثانيًا: أبرز المبادرات المجتمعية المعتمدة والمنفذة
          </h3>
          <div className="space-y-2">
            {initiatives.map((init, i) => (
              <div key={init.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{i + 1}. {init.title}</span>
                  <span className="text-slate-500 block mt-0.5">الشريك المنفذ: {init.partnerName} • المستفيدات: {init.beneficiariesCount} طالبة</span>
                </div>
                <div className="text-left font-bold text-emerald-700">
                  <span>تقييم الأثر: {init.ratingAverage}/5</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: AI Sentiment Insights */}
        {aiReport && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-emerald-950 border-r-4 border-emerald-600 pr-2">
              ثالثًا: تحليل رضا ومشاعر أولياء الأمور ورؤى الذكاء الاصطناعي
            </h3>
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl text-xs space-y-2">
              <p className="leading-relaxed text-slate-800">
                <strong>النسب الإجمالية:</strong> إيجابي ومشيد ({aiReport.sentimentBreakdown.positive}%)، استفسارات ومحايد ({aiReport.sentimentBreakdown.neutral}%)، يحتاج تحسين ({aiReport.sentimentBreakdown.needsImprovement}%).
              </p>
              <div className="space-y-1 pt-1">
                <span className="font-bold text-emerald-900">أبرز التوصيات المعتمدة للربع القادم:</span>
                {aiReport.recommendations.slice(0, 3).map((rec, idx) => (
                  <p key={idx} className="text-slate-700 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Signatures Box */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
          <div className="space-y-8">
            <p className="font-bold text-slate-800">منسقة الشراكة المجتمعية (ارتقاء)</p>
            <p className="text-slate-500">أ. شهد العتيبي</p>
          </div>
          <div className="space-y-8">
            <p className="font-bold text-slate-800">مديرة المدرسة الثانوية 102</p>
            <p className="text-slate-500">أ. عائشة شيبه</p>
          </div>
        </div>
      </div>
    </div>
  );
};
