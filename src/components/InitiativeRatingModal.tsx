import React, { useState } from 'react';
import { Star, Send, CheckCircle2, Sparkles, X, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface InitiativeRatingModalProps {
  initiativeId: string;
  onClose: () => void;
}

export const InitiativeRatingModal: React.FC<InitiativeRatingModalProps> = ({
  initiativeId,
  onClose
}) => {
  const { 
    initiatives, 
    addInitiativeFeedback, 
    currentUser, 
    requireParentAuth, 
    openLoginModal 
  } = useApp();
  const targetInit = initiatives.find(i => i.id === initiativeId);

  const [rating, setRating] = useState(5);
  const [parentName, setParentName] = useState(currentUser.name || '');
  const [whatLiked, setWhatLiked] = useState('');
  const [whatToImprove, setWhatToImprove] = useState('');
  const [wouldRecommend, setWouldRecommend] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  React.useEffect(() => {
    if (currentUser.name) setParentName(currentUser.name);
  }, [currentUser]);

  const executeSubmit = () => {
    if (!whatLiked.trim()) return;

    addInitiativeFeedback({
      initiativeId,
      parentName: parentName.trim() || currentUser.name || 'ولي أمر',
      rating,
      whatLiked: whatLiked.trim(),
      whatToImprove: whatToImprove.trim(),
      wouldRecommend
    });

    setIsSuccess(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatLiked.trim()) return;

    if (!requireParentAuth(executeSubmit, 'يُرجى تسجيل الدخول لإرسال تقييم المبادرة')) {
      return;
    }

    executeSubmit();
  };

  if (!targetInit) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {isSuccess ? (
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 font-display">
              شكرًا لتقييمكِ الثمين! 🌟
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs mx-auto">
              تقييمك لمبادرة «{targetInit.title}» يُمكّننا من تحسين وتجويد الفعاليات القادمة لبناتنا الطالبات.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              إغلاق
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  تقييم الأثر: {targetInit.title}
                </h3>
                <p className="text-xs text-slate-500">
                  استبيان قياس رضا المستفيدات وأسرهن
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                1. كيف تقيمين المبادرة بشكل عام؟ <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1.5 transition-transform hover:scale-125"
                  >
                    <Star className={`w-7 h-7 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-600 mr-2">
                  {rating === 5 ? 'ممتاز جدًا (5/5) 🌟' : 
                   rating === 4 ? 'جيد جدًا (4/5) 👍' : 
                   rating === 3 ? 'جيد (3/5)' : 'يحتاج تطوير'}
                </span>
              </div>
            </div>

            {/* Parent Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                اسم ولي الأمر (اختياري)
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="أم نورة"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* What Liked */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                2. ما أكثر شيء أعجبك في هذه المبادرة؟ <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={whatLiked}
                onChange={(e) => setWhatLiked(e.target.value)}
                placeholder="مثال: جودة المحتوى التدريبي، تفاعل الطالبات، وضوح الأثر الإيجابي..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* What to Improve */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                3. ما المقترحات التي ترين أنها تطور هذه المبادرة مستقبلاً؟
              </label>
              <textarea
                rows={2}
                value={whatToImprove}
                onChange={(e) => setWhatToImprove(e.target.value)}
                placeholder="مثال: زيادة عدد المقاعد، تقديم مستويات متقدمة..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Recommend */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">4. هل ترغبين في تكرار أو تنظيم مبادرات مشابهة؟</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setWouldRecommend(true)}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    wouldRecommend ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  نعم بالتأكيد
                </button>
                <button
                  type="button"
                  onClick={() => setWouldRecommend(false)}
                  className={`px-3 py-1 rounded-lg font-bold ${
                    !wouldRecommend ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  لا
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال التقييم</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
