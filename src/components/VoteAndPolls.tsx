import React, { useState } from 'react';
import { 
  Vote, 
  CheckCircle2, 
  BarChart3, 
  Sparkles, 
  Users, 
  Clock, 
  PlusCircle, 
  Check,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const VoteAndPolls: React.FC = () => {
  const { 
    polls, 
    userVotedPolls, 
    votePoll, 
    userRole, 
    createPoll,
    isParentLoggedIn,
    requireParentAuth,
    openLoginModal
  } = useApp();

  const [selectedPollId, setSelectedPollId] = useState<string>(polls[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Poll Form State
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('البرامج التعليمية');
  const [newOptions, setNewOptions] = useState<string[]>(['', '', '']);

  const activePoll = polls.find(p => p.id === selectedPollId) || polls[0];
  const userVotedOptionId = activePoll ? userVotedPolls[activePoll.id] : null;

  const handleAddOption = () => {
    if (newOptions.length < 6) {
      setNewOptions([...newOptions, '']);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...newOptions];
    updated[index] = value;
    setNewOptions(updated);
  };

  const handleCreatePollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter(o => o.trim() !== '');
    if (!newQuestion.trim() || validOptions.length < 2) return;

    createPoll({
      question: newQuestion.trim(),
      description: newDescription.trim() || undefined,
      category: newCategory as any,
      targetAudience: 'أولياء أمور طالبات الثانوية 102',
      isActive: true,
      options: validOptions.map((opt, idx) => ({
        id: `opt-custom-${Date.now()}-${idx}`,
        text: opt.trim(),
        votes: 0
      }))
    });

    setShowCreateModal(false);
    setNewQuestion('');
    setNewDescription('');
    setNewOptions(['', '', '']);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
          <Vote className="w-4 h-4 text-teal-600" />
          <span>الديمقراطية المدرسية وصناعة القرار التشاركي</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          صوّت وشارك
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          صوتكِ يحدد أولويات المدرسة وبرامجها القادمة.. شاركي بالتصويت في الاستطلاعات المتاحة وشاهدي النتائج اللحظية فورًا.
        </p>
      </div>

      {/* Polls Selector Tabs & Admin Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 whitespace-nowrap pl-2">الاستطلاعات:</span>
          {polls.map((poll, index) => {
            const isSelected = (activePoll?.id === poll.id);
            const isVoted = !!userVotedPolls[poll.id];
            return (
              <button
                key={poll.id}
                onClick={() => setSelectedPollId(poll.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>استطلاع #{index + 1}</span>
                {isVoted && <Check className="w-3.5 h-3.5 text-emerald-300" />}
              </button>
            );
          })}
        </div>

        {userRole === 'coordinator' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors self-end sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>إنشاء استطلاع جديد</span>
          </button>
        )}
      </div>

      {/* Main Active Poll Card */}
      {activePoll && (
        <div className="bg-white rounded-3xl p-6 sm:p-9 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
          {/* Poll Meta Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full">
                {activePoll.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>تاريخ النشر: {activePoll.createdAt}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Users className="w-4 h-4" />
              <span>إجمالي الأصوات: {activePoll.totalVotes.toLocaleString('ar-SA')} صوتًا</span>
            </div>
          </div>

          {/* Poll Question */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug font-display">
              {activePoll.question}
            </h3>
            {activePoll.description && (
              <p className="text-sm text-slate-600 leading-relaxed">
                {activePoll.description}
              </p>
            )}
          </div>

          {/* Login prompt if not logged in */}
          {!isParentLoggedIn && (
            <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <Vote className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تسجيل الدخول مطلوب للمشاركة في التصويت</span>
              </div>
              <button
                type="button"
                onClick={() => openLoginModal('تسجيل الدخول للمشاركة بالتصويت')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
              >
                تسجيل الدخول
              </button>
            </div>
          )}

          {/* Options & Interactive Voting */}
          <div className="space-y-3 pt-2">
            {activePoll.options.map((option) => {
              const hasVoted = !!userVotedOptionId;
              const isSelectedOption = userVotedOptionId === option.id;
              const percentage = activePoll.totalVotes > 0
                ? Math.round((option.votes / activePoll.totalVotes) * 100)
                : 0;

              return (
                <div
                  key={option.id}
                  onClick={() => {
                    if (!hasVoted) {
                      if (!requireParentAuth(() => votePoll(activePoll.id, option.id), 'يُرجى تسجيل الدخول للمشاركة في التصويت')) {
                        return;
                      }
                      votePoll(activePoll.id, option.id);
                    }
                  }}
                  className={`relative overflow-hidden rounded-2xl border transition-all p-4 select-none ${
                    !hasVoted 
                      ? 'border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 cursor-pointer' 
                      : isSelectedOption
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/70'
                  }`}
                >
                  {/* Background Fill Percentage Bar when Voted */}
                  {hasVoted && (
                    <div
                      className={`absolute top-0 right-0 bottom-0 transition-all duration-1000 ease-out opacity-25 ${
                        isSelectedOption ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  )}

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                        isSelectedOption
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : hasVoted
                            ? 'border-slate-300 bg-white text-transparent'
                            : 'border-slate-300 group-hover:border-emerald-500'
                      }`}>
                        {isSelectedOption && <Check className="w-4 h-4" />}
                      </div>
                      <span className={`text-sm sm:text-base font-bold ${
                        isSelectedOption ? 'text-emerald-950' : 'text-slate-800'
                      }`}>
                        {option.text}
                      </span>
                    </div>

                    {/* Voting Metrics / Result */}
                    {hasVoted && (
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-xs text-slate-500 font-medium">
                          {option.votes.toLocaleString('ar-SA')} صوت
                        </span>
                        <span className={`text-base font-black font-display min-w-12 text-left ${
                          isSelectedOption ? 'text-emerald-700' : 'text-slate-700'
                        }`}>
                          {percentage}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Status Message Footer */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            {userVotedOptionId ? (
              <div className="flex items-center gap-2 text-emerald-700 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>شكرًا لتصويتك! تم تسجيل صوتك بنجاح والمساهمة في توجيه القرار المدرسي.</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>انقري على الخيار المفضل لديك لتأكيد تصويتك فورًا.</span>
              </div>
            )}
            <span className="text-slate-400">
              الفئة المستهدفة: {activePoll.targetAudience}
            </span>
          </div>
        </div>
      )}

      {/* Modal: Create New Poll (For Coordinator) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              إنشاء استطلاع رأي جديد
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              أضيفي سؤال استطلاع جديد لأولياء الأمور لتحديد احتياجات الطالبات
            </p>

            <form onSubmit={handleCreatePollSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  سؤال الاستطلاع <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="مثال: ما الوقت الأنسب لإقامة اللقاء التعريفي؟"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  وصف توضيحي أو سياق (اختياري)
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="توضيح مختصر عن هدف الاستطلاع..."
                  className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  الخيارات المتاحة للتصويت (على الأقل خيارين)
                </label>
                <div className="space-y-2">
                  {newOptions.map((opt, i) => (
                    <input
                      key={i}
                      type="text"
                      required={i < 2}
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`الخيار رقم ${i + 1}`}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  ))}
                </div>
                {newOptions.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="mt-2 text-xs text-emerald-700 font-bold hover:underline"
                  >
                    + إضافة خيار إضافي
                  </button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
                >
                  نشر الاستطلاع
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
