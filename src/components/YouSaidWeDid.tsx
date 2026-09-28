import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Hourglass, 
  Filter, 
  Search, 
  Sparkles, 
  MessageSquare, 
  ArrowLeft, 
  PlusCircle,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubmissionCategory } from '../types';

export const YouSaidWeDid: React.FC = () => {
  const { youSaidWeDid, userRole, addYouSaidWeDid } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'تم التنفيذ' | 'قيد التنفيذ' | 'قيد الدراسة'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Add Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [parentSaid, setParentSaid] = useState('');
  const [schoolDid, setSchoolDid] = useState('');
  const [category, setCategory] = useState<SubmissionCategory>('البيئة المدرسية');
  const [status, setStatus] = useState<'تم التنفيذ' | 'قيد التنفيذ' | 'قيد الدراسة'>('تم التنفيذ');
  const [impactNote, setImpactNote] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentSaid.trim() || !schoolDid.trim()) return;

    addYouSaidWeDid({
      parentSaid: parentSaid.trim(),
      schoolDid: schoolDid.trim(),
      category,
      status,
      impactNote: impactNote.trim() || undefined
    });

    setShowAddModal(false);
    setParentSaid('');
    setSchoolDid('');
    setImpactNote('');
  };

  const filteredItems = youSaidWeDid.filter(item => {
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.parentSaid.toLowerCase().includes(q) ||
        item.schoolDid.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const executedCount = youSaidWeDid.filter(i => i.status === 'تم التنفيذ').length;
  const inProgressCount = youSaidWeDid.filter(i => i.status === 'قيد التنفيذ').length;
  const underStudyCount = youSaidWeDid.filter(i => i.status === 'قيد الدراسة').length;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>الشفافية والاستجابة المباشرة لآراء المجتمع المدرسي</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          ماذا قلتم؟ وماذا فعلنا؟
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          نحن لا نكتفي بالاستماع فقط؛ بل نحوّل ملاحظاتكم ومقترحاتكم إلى قرارات وإجراءات واقعية وملموسة داخل الثانوية 102.
        </p>
      </div>

      {/* Overview Stats Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-emerald-800 font-bold block">مبادرات تم تنفيذها بالكامل</span>
              <span className="text-2xl font-black text-emerald-950 font-display">{executedCount}</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-full">
            100% شفافية
          </span>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Hourglass className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-amber-800 font-bold block">مبادرات قيد التنفيذ الميداني</span>
              <span className="text-2xl font-black text-amber-950 font-display">{inProgressCount}</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-amber-200/60 text-amber-900 px-2.5 py-1 rounded-full">
            جاري العمل
          </span>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-sky-800 font-bold block">مقترحات قيد الدراسة والجدولة</span>
              <span className="text-2xl font-black text-sky-950 font-display">{underStudyCount}</span>
            </div>
          </div>
          <span className="text-xs font-bold bg-sky-200/60 text-sky-900 px-2.5 py-1 rounded-full">
            لجنة الشراكة
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter Buttons */}
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            الكل ({youSaidWeDid.length})
          </button>
          <button
            onClick={() => setStatusFilter('تم التنفيذ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'تم التنفيذ'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
            }`}
          >
            ✅ تم التنفيذ ({executedCount})
          </button>
          <button
            onClick={() => setStatusFilter('قيد التنفيذ')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'قيد التنفيذ'
                ? 'bg-amber-500 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            🟡 قيد التنفيذ ({inProgressCount})
          </button>
          <button
            onClick={() => setStatusFilter('قيد الدراسة')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'قيد الدراسة'
                ? 'bg-sky-600 text-white'
                : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
            }`}
          >
            🔵 قيد الدراسة ({underStudyCount})
          </button>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث في القرارات والإجراءات..."
              className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {userRole === 'coordinator' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 hover:bg-slate-800 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              <span>إضافة إجراء جديد</span>
            </button>
          )}
        </div>
      </div>

      {/* Responsive Dual Cards Grid */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 hover:border-emerald-300 transition-all shadow-xs space-y-4"
          >
            {/* Top Meta */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {item.category}
                </span>
                <span className="text-[11px] text-slate-400">
                  التاريخ: {item.date}
                </span>
              </div>

              <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                item.status === 'تم التنفيذ'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : item.status === 'قيد التنفيذ'
                    ? 'bg-amber-100 text-amber-800 border border-amber-200'
                    : 'bg-sky-100 text-sky-800 border border-sky-200'
              }`}>
                {item.status === 'تم التنفيذ' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                {item.status === 'قيد التنفيذ' && <Hourglass className="w-3.5 h-3.5 text-amber-600" />}
                {item.status === 'قيد الدراسة' && <Clock className="w-3.5 h-3.5 text-sky-600" />}
                <span>{item.status}</span>
              </span>
            </div>

            {/* Dual Column Content: You Said vs We Did */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
              {/* You Said Card */}
              <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/70 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>ماذا قلتم؟ (صوت ولي الأمر):</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed">
                  «{item.parentSaid}»
                </p>
              </div>

              {/* We Did Card */}
              <div className="bg-emerald-50/70 rounded-2xl p-4 border border-emerald-200/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>ماذا فعلنا؟ (إجراء إدارة المدرسة والثانوية 102):</span>
                </div>
                <p className="text-sm text-emerald-950 font-medium leading-relaxed">
                  {item.schoolDid}
                </p>
              </div>
            </div>

            {/* Impact Note if available */}
            {item.impactNote && (
              <div className="pt-2 flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span><strong>الأثر الناتج:</strong> {item.impactNote}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Coordinator Add Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              توثيق استجابة «ماذا قلتم؟ وماذا فعلنا؟»
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              إبراز شفافية وسرعة استجابة المدرسة لمقترحات أولياء الأمور
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ماذا قال أولياء الأمور؟ (الملاحظة أو المقترح) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={parentSaid}
                  onChange={(e) => setParentSaid(e.target.value)}
                  placeholder="مثال: مطالبات بتوفير خيارات صحية بالمقصف المدرسي..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ماذا فعلت المدرسة؟ (الإجراء المتخذ) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={schoolDid}
                  onChange={(e) => setSchoolDid(e.target.value)}
                  placeholder="مثال: تم التعاقد مع شركة تغذية معتمدة لتوفير وجبات صحية وعصائر طازجة يوميًا..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SubmissionCategory)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="البيئة المدرسية">البيئة المدرسية</option>
                    <option value="المقصف المدرسي">المقصف المدرسي</option>
                    <option value="التقنية والتحول الرقمي">التقنية والتحول الرقمي</option>
                    <option value="الأنشطة والفعاليات">الأنشطة والفعاليات</option>
                    <option value="الأمن والسلامة">الأمن والسلامة</option>
                    <option value="التواصل مع المدرسة">التواصل مع المدرسة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">حالة الإجراء</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="تم التنفيذ">تم التنفيذ (✅)</option>
                    <option value="قيد التنفيذ">قيد التنفيذ (🟡)</option>
                    <option value="قيد الدراسة">قيد الدراسة (🔵)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ملاحظة الأثر الملموس
                </label>
                <input
                  type="text"
                  value={impactNote}
                  onChange={(e) => setImpactNote(e.target.value)}
                  placeholder="مثال: ارتفاع رضا الطالبات عن وجبات الإفطار بنسبة 94%"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  حفظ ونشر الإجراء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
