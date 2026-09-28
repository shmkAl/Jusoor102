import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ArrowLeft, 
  Building2,
  Quote,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SuccessStories: React.FC = () => {
  const { successStories } = useApp();
  const [selectedStoryId, setSelectedStoryId] = useState<string>(successStories[0]?.id || '');

  const activeStory = successStories.find(s => s.id === selectedStoryId) || successStories[0];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
          <Award className="w-4 h-4 text-amber-600" />
          <span>نماذج ملهمة لثمار الشراكة المجتمعية الحقيقية</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          قصص النجاح
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          حينما تلتقي رغبة ولي الأمر بحرص المدرسة، تُصنع الإنجازات الاستثنائية.. استعرضي رحلة تحوّل الأفكار البسيطة إلى مشاريع مستدامة بالثانوية 102.
        </p>
      </div>

      {/* Story Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {successStories.map((story) => {
          const isSelected = activeStory?.id === story.id;
          return (
            <div
              key={story.id}
              onClick={() => setSelectedStoryId(story.id)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'bg-gradient-to-br from-emerald-900 to-teal-900 text-white border-emerald-500 shadow-lg'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-bold px-2.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-white/20 text-emerald-200' : 'bg-emerald-50 text-emerald-800'
                  }`}>
                    {story.date}
                  </span>
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                    {story.parentInitiator}
                  </span>
                </div>
                <h3 className="text-base font-bold line-clamp-2">
                  {story.title}
                </h3>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100/20">
                <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>
                  {story.beneficiaries} مستفيدة
                </span>
                <span className="font-bold flex items-center gap-1 text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>قصة ملهمة</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Active Story Showcase & 4-Stage Timeline */}
      {activeStory && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in space-y-8 p-6 sm:p-10">
          {/* Main Story Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <span className="bg-emerald-100 px-3 py-1 rounded-full">
                  صاحب/ة الفكرة: {activeStory.parentInitiator}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">العام الدراسي 1448هـ</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display leading-snug">
                {activeStory.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {activeStory.overview}
              </p>

              {/* Quote Box */}
              {activeStory.parentQuote && (
                <div className="bg-emerald-50/80 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-950 space-y-1 relative">
                  <Quote className="w-6 h-6 text-emerald-400 absolute left-3 top-3 opacity-40" />
                  <span className="font-bold block text-emerald-800">كلمة ولي الأمر صاحب الفكرة:</span>
                  <p className="italic leading-relaxed font-medium">
                    «{activeStory.parentQuote}»
                  </p>
                </div>
              )}
            </div>

            {/* Cover Image */}
            <div className="lg:col-span-5 h-64 sm:h-72 rounded-3xl overflow-hidden shadow-md border border-slate-200">
              <img
                src={activeStory.image}
                alt={activeStory.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* 4-Stage Milestone Journey */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <span>مراحل تحوّل الفكرة من مقترح إلى أثر وطني</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Stage 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h5 className="text-xs font-bold text-slate-900">البداية: مقترح ولي الأمر</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStory.journey.idea}
                </p>
              </div>

              {/* Stage 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h5 className="text-xs font-bold text-slate-900">استجابة المدرسة والشريك</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStory.journey.adoption}
                </p>
              </div>

              {/* Stage 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h5 className="text-xs font-bold text-slate-900">التنفيذ والتمكين الميداني</h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeStory.journey.execution}
                </p>
              </div>

              {/* Stage 4 */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h5 className="text-xs font-bold text-emerald-950">الأثر الملموس والجوائز</h5>
                <p className="text-xs text-emerald-900 leading-relaxed font-medium">
                  {activeStory.journey.impact}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
