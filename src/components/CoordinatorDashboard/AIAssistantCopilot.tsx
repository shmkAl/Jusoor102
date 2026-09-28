import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Printer, 
  RefreshCw, 
  Target, 
  Building2, 
  BookOpen, 
  ClipboardList,
  Edit3
} from 'lucide-react';

type AssistantMode = 'partnership_letter' | 'initiative_plan' | 'satisfaction_survey' | 'final_report';

export const AIAssistantCopilot: React.FC = () => {
  const [mode, setMode] = useState<AssistantMode>('partnership_letter');
  const [topic, setTopic] = useState('تدريب الطالبات على مهارات الذكاء الاصطناعي وبناء التطبيقات');
  const [partnerName, setPartnerName] = useState('الهيئة السعودية للبيانات والذكاء الاصطناعي (سدايا)');
  const [targetAudience, setTargetAudience] = useState('طالبات المرحلة الثانوية وأولياء الأمور المهتمين');
  
  const [generatedResult, setGeneratedResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/partnership-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          topic: topic.trim(),
          partnerName: partnerName.trim(),
          targetAudience: targetAudience.trim(),
        })
      });

      const data = await response.json();
      if (data.success && data.generatedText) {
        setGeneratedResult(data.generatedText);
      }
    } catch (e) {
      console.error('Failed to generate assistant response:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <title>مستند شراكة مجتمعية - الثانوية 102</title>
          <style>
            body { font-family: 'Tajawal', sans-serif; padding: 40px; line-height: 1.8; color: #1e293b; }
            h1 { color: #065f46; border-bottom: 2px solid #065f46; padding-bottom: 10px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
          </style>
        </head>
        <body>
          <pre>${generatedResult}</pre>
          <script>window.print();</script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Copilot Header */}
      <div className="bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-lg space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>المساعد الذكي لمنسقة الشراكة المجتمعية (Partnership Copilot)</span>
        </div>
        <h3 className="text-2xl font-black text-white font-display">
          صياغة وتوليد الوثائق الرسمية والمبادرات بذكاء
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100/80 max-w-2xl leading-relaxed">
          وفّري ساعات العمل الإداري! يتيح لك المساعد صياغة خطابات الشراكة الرسمية للجهات، إعداد خطط المبادرات المتكاملة، استبيانات قياس الرضا، والتقارير الختامية في ثوانٍ معدودة وبأعلى معايير الصياغة التربوية.
        </p>
      </div>

      {/* Main Mode Selector & Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Configuration Panel (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              نوع المهمة أو المستند المطلوب <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMode('partnership_letter')}
                className={`p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2 border transition-all ${
                  mode === 'partnership_letter'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>خطاب طلب شراكة رسمي</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('initiative_plan')}
                className={`p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2 border transition-all ${
                  mode === 'initiative_plan'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                <span>خطة مبادرة متكاملة</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('satisfaction_survey')}
                className={`p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2 border transition-all ${
                  mode === 'satisfaction_survey'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ClipboardList className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>استبيان قياس الرضا</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('final_report')}
                className={`p-3 rounded-xl text-xs font-bold text-right flex items-center gap-2 border transition-all ${
                  mode === 'final_report'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-600 shrink-0" />
                <span>تقرير إنجاز ختامي</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              موضوع المبادرة أو الشراكة <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="مثال: رعاية معرض الابتكار والذكاء الاصطناعي وتقديم ورش تطبيقية للطالبات..."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الجهة الشريكة أو المستهدفة
            </label>
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              placeholder="مثال: مدينة الملك عبدالعزيز للعلوم والتقنية"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الفئة المستهدفة
            </label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="مثال: طالبات الصف الأول والثاني ثانوي"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'جاري توليد المستند الاحترافي...' : 'توليد وصياغة المستند الآن'}</span>
          </button>
        </div>

        {/* Generated Output Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>معاينة المستند المولد</span>
            </h4>

            {generatedResult && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'معاينة' : 'تعديل'}</span>
                </button>

                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'تم النسخ' : 'نسخ النص'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
                  title="طباعة"
                >
                  <Printer className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {generatedResult ? (
            <div>
              {isEditing ? (
                <textarea
                  rows={16}
                  value={generatedResult}
                  onChange={(e) => setGeneratedResult(e.target.value)}
                  className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 font-sans"
                />
              ) : (
                <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 max-h-[550px] overflow-y-auto space-y-2 text-xs leading-relaxed text-slate-800 font-sans whitespace-pre-wrap">
                  {generatedResult}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 space-y-3">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="font-bold text-slate-600 text-sm">لم يتم توليد مستند بعد</p>
              <p className="text-xs max-w-xs mx-auto">
                حددي نوع المستند والموضوع في اللوحة الجانبية ثم اضغطي على زر "توليد وصياغة المستند".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
