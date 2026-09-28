import React from 'react';
import { 
  X, 
  Calendar, 
  Users, 
  Building2, 
  Star, 
  CheckCircle2, 
  Target, 
  Sparkles, 
  ImageIcon, 
  HeartHandshake,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';
import { Initiative } from '../types';

interface InitiativeDetailModalProps {
  initiative: Initiative;
  onClose: () => void;
  onOpenRating: () => void;
}

export const InitiativeDetailModal: React.FC<InitiativeDetailModalProps> = ({
  initiative,
  onClose,
  onOpenRating
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 animate-fade-in">
        {/* Cover Image & Top Actions */}
        <div className="relative h-56 sm:h-72 w-full overflow-hidden rounded-t-3xl bg-slate-900">
          <img
            src={initiative.coverImage}
            alt={initiative.title}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Status & Category Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-xs ${
              initiative.status === 'مكتملة' ? 'bg-emerald-600/90' :
              initiative.status === 'جارية' ? 'bg-sky-600/90' : 'bg-amber-600/90'
            }`}>
              {initiative.status}
            </span>
          </div>

          {/* Title on Image */}
          <div className="absolute bottom-4 right-4 left-4 text-white space-y-1">
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              {initiative.title}
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>{initiative.date}</span>
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                <span>الشريك: {initiative.partnerName}</span>
              </span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{initiative.ratingAverage} / 5 ({initiative.ratingsCount} تقييم)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="text-[11px] text-slate-500 block">المستفيدات</span>
              <span className="text-lg font-black text-slate-900 font-display">
                {initiative.beneficiariesCount} طالبة
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">فئة الاستهداف</span>
              <span className="text-xs font-bold text-slate-800 truncate block mt-1">
                {initiative.targetGroup}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">الجهة الشريكة</span>
              <span className="text-xs font-bold text-emerald-800 truncate block mt-1">
                {initiative.partnerName}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 block">رضا أولياء الأمور</span>
              <span className="text-lg font-black text-amber-600 font-display">
                {Math.round((initiative.ratingAverage / 5) * 100)}%
              </span>
            </div>
          </div>

          {/* Description & Objective */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>أهداف المبادرة ووصفها العام</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-emerald-50/40 p-4 rounded-2xl border border-emerald-100">
              {initiative.description}
            </p>
          </div>

          {/* Execution Team */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>فريق العمل والتنفيذ</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              {initiative.executionTeam.map((member, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-medium"
                >
                  {member}
                </span>
              ))}
            </div>
          </div>

          {/* Results & Outcomes */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>أبرز النتائج والمخرجات المحققة</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {initiative.results.map((res, i) => (
                <div
                  key={i}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{res}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Measurement */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>أدوات قياس الأثر التربوي</span>
            </h4>
            <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {initiative.impactMeasurement}
            </p>
          </div>

          {/* Photo Gallery */}
          {initiative.galleryImages && initiative.galleryImages.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>معرض الصور والتوثيق الميداني</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {initiative.galleryImages.map((imgUrl, i) => (
                  <div key={i} className="h-28 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={imgUrl}
                      alt="توثيق المبادرة"
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parent Testimonials & Ratings */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-amber-500" />
                <span>آراء وتقييمات أولياء الأمور ({initiative.feedbackList.length})</span>
              </h4>
              <button
                onClick={onOpenRating}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                <span>تقييم المبادرة الآن</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {initiative.feedbackList.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">
                  لا توجد تقييمات مسجلة بعد. كوني أول من يقيم هذه المبادرة!
                </div>
              ) : (
                initiative.feedbackList.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{fb.parentName}</span>
                      <div className="flex items-center text-amber-400">
                        {[...Array(fb.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      «{fb.whatLiked}»
                    </p>
                    {fb.whatToImprove && (
                      <span className="text-[11px] text-slate-400 block">
                        مقترح تطوير: {fb.whatToImprove}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between rounded-b-3xl">
          <span className="text-xs text-slate-500">
            المدرسة الثانوية 102 • وحدة الشراكة المجتمعية (ارتقاء)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
