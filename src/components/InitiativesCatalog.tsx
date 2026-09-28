import React, { useState } from 'react';
import { 
  Compass, 
  Calendar, 
  Users, 
  Building2, 
  Star, 
  ArrowLeft, 
  Search, 
  Sparkles,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Initiative } from '../types';
import { InitiativeDetailModal } from './InitiativeDetailModal';
import { InitiativeRatingModal } from './InitiativeRatingModal';

export const InitiativesCatalog: React.FC = () => {
  const { 
    initiatives, 
    selectedInitiativeId, 
    setSelectedInitiativeId,
    ratingInitiativeId,
    setRatingInitiativeId
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'جارية' | 'قادمة' | 'مكتملة'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeInitiative = initiatives.find(i => i.id === selectedInitiativeId);

  const filteredInitiatives = initiatives.filter(init => {
    if (statusFilter !== 'all' && init.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        init.title.toLowerCase().includes(q) ||
        init.description.toLowerCase().includes(q) ||
        init.partnerName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>مبادرات نوعية تصنع الفارق في تجربة الطالبات</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          مبادراتنا المجتمعية
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          استكشفي المبادرات والبرامج المنفذة بالشراكة بين المدرسة وأولياء الأمور والمؤسسات الوطنية، واطّلعي على نتائجها وأثرها المباشر.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            جميع المبادرات ({initiatives.length})
          </button>
          <button
            onClick={() => setStatusFilter('جارية')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'جارية'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            🔵 جارية حاليًا
          </button>
          <button
            onClick={() => setStatusFilter('قادمة')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'قادمة'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🟡 قادمة قريبًا
          </button>
          <button
            onClick={() => setStatusFilter('مكتملة')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'مكتملة'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            ✅ مكتملة
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في المبادرات والشركاء..."
            className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Initiatives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInitiatives.map((init) => (
          <div
            key={init.id}
            className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col justify-between group"
          >
            {/* Card Cover */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={init.coverImage}
                alt={init.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full text-white backdrop-blur-xs ${
                  init.status === 'مكتملة' ? 'bg-emerald-600/90' :
                  init.status === 'جارية' ? 'bg-sky-600/90' : 'bg-amber-600/90'
                }`}>
                  {init.status}
                </span>
              </div>

              {/* Rating */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-slate-900/80 text-amber-300 text-xs px-2.5 py-1 rounded-full backdrop-blur-xs">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span className="font-bold">{init.ratingAverage}</span>
                <span className="text-[10px] text-slate-300">({init.ratingsCount})</span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{init.date}</span>
                  <span>•</span>
                  <span>{init.targetGroup}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                  {init.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {init.objective}
                </p>
              </div>

              {/* Card Meta & Action */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-medium truncate max-w-[140px]">{init.partnerName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Users className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{init.beneficiariesCount} مستفيدة</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedInitiativeId(init.id)}
                    className="flex-1 py-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>تفاصيل المبادرة</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setRatingInitiativeId(init.id)}
                    className="p-2 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 rounded-xl transition-colors cursor-pointer"
                    title="تقييم المبادرة"
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {activeInitiative && (
        <InitiativeDetailModal
          initiative={activeInitiative}
          onClose={() => setSelectedInitiativeId(null)}
          onOpenRating={() => {
            setSelectedInitiativeId(null);
            setRatingInitiativeId(activeInitiative.id);
          }}
        />
      )}

      {/* Rating Modal */}
      {ratingInitiativeId && (
        <InitiativeRatingModal
          initiativeId={ratingInitiativeId}
          onClose={() => setRatingInitiativeId(null)}
        />
      )}
    </div>
  );
};
