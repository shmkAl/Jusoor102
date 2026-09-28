import React, { useState } from 'react';
import { 
  MessageSquareQuote, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Send, 
  Star, 
  Phone, 
  Mail, 
  User, 
  ShieldCheck,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ParentVoice } from '../../types';

export const VoicesManager: React.FC = () => {
  const { voices, replyToVoice } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<ParentVoice | null>(voices[0] || null);
  const [replyText, setReplyText] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredVoices = voices.filter(v => {
    if (filterType !== 'all' && v.type !== filterType) return false;
    if (filterCategory !== 'all' && v.category !== filterCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.content.toLowerCase().includes(q) ||
        (v.authorName && v.authorName.toLowerCase().includes(q)) ||
        v.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoice || !replyText.trim()) return;

    replyToVoice(selectedVoice.id, replyText.trim());
    setActionSuccess('تم نشر رد المدرسة الرسمي على المشاركة بنجاح ✅');
    setReplyText('');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الكل ({voices.length})
          </button>
          <button
            onClick={() => setFilterType('اقتراح')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'اقتراح' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            مقترحات ({voices.filter(v => v.type === 'اقتراح').length})
          </button>
          <button
            onClick={() => setFilterType('ملاحظة')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'ملاحظة' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800'
            }`}
          >
            ملاحظات ({voices.filter(v => v.type === 'ملاحظة').length})
          </button>
          <button
            onClick={() => setFilterType('شكر وتقدير')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterType === 'شكر وتقدير' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-800'
            }`}
          >
            شكر وثناء ({voices.filter(v => v.type === 'شكر وتقدير').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في محتوى الآراء والملاحظات..."
            className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Voices List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>مشاركات أولياء الأمور</span>
            <span className="text-xs text-slate-500">{filteredVoices.length} مشاركة</span>
          </h4>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredVoices.map((voice) => {
              const isSelected = selectedVoice?.id === voice.id;
              return (
                <div
                  key={voice.id}
                  onClick={() => {
                    setSelectedVoice(voice);
                    setReplyText(voice.schoolResponse || '');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {voice.isAnonymous ? 'مجهول' : voice.authorName}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      voice.status === 'تم الرد' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {voice.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {voice.content}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{voice.category}</span>
                    <div className="flex items-center text-amber-400">
                      {[...Array(voice.satisfactionRating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Voice Details & Reply Box (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {selectedVoice ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    مشاركة من: {selectedVoice.isAnonymous ? 'ولي أمر (مجهول)' : selectedVoice.authorName}
                  </h3>
                  <span className="text-xs text-slate-400">تاريخ الإرسال: {selectedVoice.createdAt}</span>
                </div>
                <span className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                  {selectedVoice.type} • {selectedVoice.category}
                </span>
              </div>

              {/* Full Content */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm text-slate-800 leading-relaxed">
                «{selectedVoice.content}»
              </div>

              {/* Private Contact info for Coordinator */}
              {selectedVoice.allowContact && (selectedVoice.contactPhone || selectedVoice.contactEmail) && (
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>بيانات الاتصال المباشر (خاصة بالمنسقة فقط):</span>
                  </div>
                  <div className="flex items-center gap-4 text-emerald-800 pt-1">
                    {selectedVoice.contactPhone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{selectedVoice.contactPhone}</span>
                      </span>
                    )}
                    {selectedVoice.contactEmail && (
                      <span className="flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" />
                        <span>{selectedVoice.contactEmail}</span>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Existing Response */}
              {selectedVoice.schoolResponse && (
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                  <span className="font-bold block text-emerald-800">الرد المنشور حاليًا لولي الأمر ({selectedVoice.responseDate}):</span>
                  <p className="leading-relaxed">{selectedVoice.schoolResponse}</p>
                </div>
              )}

              {/* Reply Form */}
              <form onSubmit={handleReplySubmit} className="pt-3 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  {selectedVoice.schoolResponse ? 'تعديل أو تحديث الرد الرسمي:' : 'كتابة الرد الرسمي لإدارة المدرسة:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="مثال: شكرًا لملاحظتك الكريمة، تم التنسيق مع فريق العمل المعني وتم حل المشكلة..."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>نشر الرد الرسمي لولي الأمر</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              حددي مشاركة من القائمة لقراءة التفاصيل والرد عليها.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
