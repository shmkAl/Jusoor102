import React, { useState } from 'react';
import { 
  Lightbulb, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Phone, 
  Mail, 
  Sparkles, 
  User, 
  Send,
  Building2,
  Layers,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ProposalStatus, Proposal } from '../../types';

export const ProposalsManager: React.FC = () => {
  const { proposals, updateProposalStatus, convertProposalToInitiative } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(proposals[0] || null);
  const [responseText, setResponseText] = useState('');
  const [targetStatus, setTargetStatus] = useState<ProposalStatus>('قيد الدراسة');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredProposals = proposals.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.senderName.toLowerCase().includes(q) ||
        p.trackingCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProposal) return;

    updateProposalStatus(selectedProposal.id, targetStatus, responseText);
    setActionSuccess('تم تحديث حالة المقترح وإشعار ولي الأمر بنجاح ✅');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleConvertToInitiative = (proposalId: string) => {
    const newInitId = convertProposalToInitiative(proposalId);
    if (newInitId) {
      setActionSuccess('تهانينا! تم اعتماد المقترح وإدراجه كمبادرة رسمية في كتالوج المدرسة 🌟');
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            الكل ({proposals.length})
          </button>
          <button
            onClick={() => setStatusFilter('جديدة')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'جديدة' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            جديدة ({proposals.filter(p => p.status === 'جديدة').length})
          </button>
          <button
            onClick={() => setStatusFilter('قيد الدراسة')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'قيد الدراسة' ? 'bg-sky-600 text-white' : 'bg-sky-50 text-sky-800'
            }`}
          >
            قيد الدراسة ({proposals.filter(p => p.status === 'قيد الدراسة').length})
          </button>
          <button
            onClick={() => setStatusFilter('تم اعتمادها')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === 'تم اعتمادها' ? 'bg-purple-600 text-white' : 'bg-purple-50 text-purple-800'
            }`}
          >
            تم اعتمادها ({proposals.filter(p => p.status === 'تم اعتمادها').length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالرمز أو العنوان أو الاسم..."
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

      {/* Two Columns: Proposals List vs Selected Proposal Action Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Proposals List (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
          <h4 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
            <span>قائمة المقترحات الواردة</span>
            <span className="text-xs text-slate-500">{filteredProposals.length} مقترح</span>
          </h4>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredProposals.map((prop) => {
              const isSelected = selectedProposal?.id === prop.id;
              return (
                <div
                  key={prop.id}
                  onClick={() => {
                    setSelectedProposal(prop);
                    setTargetStatus(prop.status);
                    setResponseText(prop.schoolResponse || '');
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-emerald-800">
                      {prop.trackingCode}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      prop.status === 'تم تنفيذها' ? 'bg-emerald-100 text-emerald-800' :
                      prop.status === 'قيد التنفيذ' ? 'bg-sky-100 text-sky-800' :
                      prop.status === 'تم اعتمادها' ? 'bg-purple-100 text-purple-800' :
                      prop.status === 'قيد الدراسة' ? 'bg-amber-100 text-amber-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {prop.status}
                    </span>
                  </div>

                  <h5 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {prop.title}
                  </h5>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>مقدم المقترح: {prop.senderName}</span>
                    <span>{prop.field}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Proposal Detail & Action Panel (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
          {selectedProposal ? (
            <div className="space-y-5">
              {/* Proposal Header */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                    {selectedProposal.trackingCode}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">
                    {selectedProposal.title}
                  </h3>
                  <span className="text-xs text-slate-500">تاريخ التقديم: {selectedProposal.createdAt}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleConvertToInitiative(selectedProposal.id)}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>تحويل إلى مبادرة رسمية</span>
                </button>
              </div>

              {/* Proposal Info Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">مقدم الفكرة:</span>
                  <span className="font-bold text-slate-800">{selectedProposal.senderName}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">نوع الدعم:</span>
                  <span className="font-bold text-slate-800">{selectedProposal.supportType}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 block mb-0.5">الفئة المستهدفة:</span>
                  <span className="font-bold text-slate-800">{selectedProposal.targetGroup}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-700 block">تفاصيل ووصف المقترح:</span>
                <p className="text-xs sm:text-sm text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 leading-relaxed">
                  {selectedProposal.description}
                </p>
              </div>

              {/* Contact details for coordinator */}
              {(selectedProposal.senderPhone || selectedProposal.senderEmail) && (
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs flex flex-wrap items-center gap-4 text-emerald-900">
                  <span className="font-bold">بيانات التواصل للمنسقة:</span>
                  {selectedProposal.senderPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedProposal.senderPhone}</span>
                    </span>
                  )}
                  {selectedProposal.senderEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{selectedProposal.senderEmail}</span>
                    </span>
                  )}
                </div>
              )}

              {/* Action Form: Update Status & School Response */}
              <form onSubmit={handleUpdateStatus} className="pt-4 border-t border-slate-100 space-y-4">
                <h4 className="text-xs font-bold text-slate-900">
                  تحديث حالة المقترح والرد الرسمي
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-600 mb-1">الحالة الحالية</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as ProposalStatus)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
                    >
                      <option value="جديدة">جديدة</option>
                      <option value="قيد الدراسة">قيد الدراسة</option>
                      <option value="تم اعتمادها">تم اعتمادها</option>
                      <option value="قيد التنفيذ">قيد التنفيذ</option>
                      <option value="تم تنفيذها">تم تنفيذها</option>
                      <option value="مرفوضة">مرفوضة (مع توضيح السبب)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-600 mb-1">
                    نص الرد الرسمي / التحديث الموجه لولي الأمر
                  </label>
                  <textarea
                    rows={3}
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="اكتبي الرد الرسمي الذي سيظهر لولي الأمر عند الاستعلام عن الرمز..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>حفظ التحديث وإشعار ولي الأمر</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              حددي مقترحًا من القائمة لاستعراض التفاصيل واتخاذ الإجراء.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
