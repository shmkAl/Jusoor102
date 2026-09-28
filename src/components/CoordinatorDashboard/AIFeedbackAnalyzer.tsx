import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  RefreshCw, 
  ArrowRight,
  Smile,
  Meh,
  Frown,
  Flame,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIAnalysisReport } from '../../types';

export const AIFeedbackAnalyzer: React.FC = () => {
  const { voices, aiReport, isAnalyzingAi, runAiFeedbackAnalysis } = useApp();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    await runAiFeedbackAnalysis();
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800/60 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <Brain className="w-4 h-4 text-indigo-300" />
              <span>محرك الذكاء الاصطناعي التوليدي والتحليلي • Gemini 3.7 Flash</span>
            </div>
            <h3 className="text-2xl font-black text-white font-display">
              محلل الآراء والمشاعر الذكي (Opinion Analyst)
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200/80 max-w-2xl leading-relaxed">
              تحليل تلقائي متقدم لجميع مشاركات وملاحظات أولياء الأمور ({voices.length} مشاركة مسجلة)، واستخراج التوزيع العاطفي وأبرز الرؤى الاستراتيجية والتوصيات الإجرائية المباشرة لإدارة المدرسة.
            </p>
          </div>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzingAi}
            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzingAi ? 'animate-spin' : ''}`} />
            <span>{isAnalyzingAi ? 'جاري التحليل واستخلاص الرؤى...' : 'تشغيل التحليل الفوري بالذكاء الاصطناعي'}</span>
          </button>
        </div>
      </div>

      {/* Analysis Results Display */}
      {aiReport ? (
        <div className="space-y-6">
          {/* 4 Sentiment Breakdown Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1">
                <Smile className="w-6 h-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-950 font-display">
                {aiReport.sentimentBreakdown.positive}%
              </span>
              <span className="text-xs text-emerald-800 block font-bold">إيجابي ومشيد</span>
              <span className="text-[11px] text-emerald-600">شكر، ثناء على المبادرات</span>
            </div>

            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mx-auto mb-1">
                <Meh className="w-6 h-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-sky-950 font-display">
                {aiReport.sentimentBreakdown.neutral}%
              </span>
              <span className="text-xs text-sky-800 block font-bold">محايد واستفسارات</span>
              <span className="text-[11px] text-sky-600">أسئلة حول الجداول والمواعيد</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-1">
                <Frown className="w-6 h-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-amber-950 font-display">
                {aiReport.sentimentBreakdown.needsImprovement}%
              </span>
              <span className="text-xs text-amber-800 block font-bold">يحتاج إلى تحسين</span>
              <span className="text-[11px] text-amber-600">مقترحات لتطوير المقصف والمرافق</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center space-y-1">
              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center mx-auto mb-1">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-2xl sm:text-3xl font-black text-rose-950 font-display">
                {aiReport.sentimentBreakdown.urgent}%
              </span>
              <span className="text-xs text-rose-800 block font-bold">ملاحظات عاجلة</span>
              <span className="text-[11px] text-rose-600">سلامة، حركة السير، حالات خاصة</span>
            </div>
          </div>

          {/* Topics Frequency Breakdown & Key Strategic Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Topics Distribution (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                <span>الموضوعات الأكثر تكرارًا في مشاركات الأسر</span>
              </h4>

              <div className="space-y-3">
                {aiReport.topicsDistribution.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span>{item.topic}</span>
                      <span className="text-indigo-600">{item.percentage}% ({item.count} مشاركة)</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-700"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insights & AI Recommendations (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Key Insights */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>أهم الرؤى والأنماط المستخلصة</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(aiReport.keyInsights.join('\n'), 'insights')}
                    className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    {copiedSection === 'insights' ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{copiedSection === 'insights' ? 'تم النسخ' : 'نسخ الرؤى'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {aiReport.keyInsights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs text-slate-800 flex items-start gap-2.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Executive Recommendations */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>التوصيات الإجرائية المباشرة للمنسقة والإدارة</span>
                  </h4>
                  <button
                    onClick={() => copyToClipboard(aiReport.recommendations.join('\n'), 'recs')}
                    className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1"
                  >
                    {copiedSection === 'recs' ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{copiedSection === 'recs' ? 'تم النسخ' : 'نسخ التوصيات'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {aiReport.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State / Prompt to Run */
        <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">
            جاهز لتحليل مشاعر وملاحظات أولياء الأمور
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            اضغطي على زر "تشغيل التحليل الفوري" لبدء استخلاص نسب الرضا، تصنيف المشاعر، والمقترحات ذات الأولوية القصوى.
          </p>
          <button
            onClick={handleRunAnalysis}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs inline-flex items-center gap-2"
          >
            <Brain className="w-4 h-4" />
            <span>تشغيل التحليل الآن</span>
          </button>
        </div>
      )}
    </div>
  );
};
