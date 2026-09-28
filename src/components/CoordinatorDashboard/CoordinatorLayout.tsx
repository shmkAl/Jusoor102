import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Brain, 
  Sparkles, 
  Lightbulb, 
  MessageSquareQuote, 
  MessageSquare, 
  Users, 
  FileText, 
  Printer, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Star, 
  Building2,
  ShieldCheck,
  ShieldAlert,
  Award,
  Lock,
  Eye,
  Key,
  CalendarDays,
  Mail
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AIFeedbackAnalyzer } from './AIFeedbackAnalyzer';
import { AIAssistantCopilot } from './AIAssistantCopilot';
import { ProposalsManager } from './ProposalsManager';
import { VoicesManager } from './VoicesManager';
import { VolunteerTalentBank } from './VolunteerTalentBank';
import { PartnershipReportModal } from './PartnershipReportModal';
import { SupervisorsManager } from './SupervisorsManager';

type CoordinatorSubTab = 'overview' | 'supervisors' | 'ai_analyzer' | 'ai_copilot' | 'proposals' | 'voices' | 'talent_bank';

export const CoordinatorLayout: React.FC = () => {
  const { 
    proposals, 
    voices, 
    partnerSkills, 
    initiatives, 
    aiReport, 
    runAiFeedbackAnalysis,
    setActiveTab,
    discussionMessages,
    supervisors,
    activeSupervisor,
    switchToCoordinator,
    hasPermission
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<CoordinatorSubTab>('overview');
  const [showReportModal, setShowReportModal] = useState(false);

  const pendingProposals = proposals.filter(p => p.status === 'جديدة' || p.status === 'قيد الدراسة');
  const pendingVoices = voices.filter(v => v.status === 'قيد المراجعة');

  // Permission checks for tabs
  const canAccessProposals = hasPermission('manage_proposals');
  const canAccessVoices = hasPermission('manage_voices');
  const canAccessTalentBank = hasPermission('manage_talents');
  const canAccessAi = hasPermission('use_ai_tools');
  const canAccessReports = hasPermission('export_reports');

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Top Coordinator Profile Bar */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md ${
            activeSupervisor ? 'bg-amber-600 text-white' : 'bg-indigo-600 text-white'
          }`}>
            {activeSupervisor ? activeSupervisor.name.substring(0, 1) : 'م'}
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`border text-xs font-bold px-3 py-0.5 rounded-full ${
                activeSupervisor 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' 
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
              }`}>
                {activeSupervisor ? 'مشرفة مفوضة من منسقة الشراكة' : 'منسقة الشراكة المجتمعية'}
              </span>
              <span className="text-xs text-slate-300">الثانوية 102</span>
              {activeSupervisor ? (
                <span className="text-xs bg-white/20 text-amber-200 px-2 py-0.5 rounded font-bold">
                  {activeSupervisor.roleInSchool}
                </span>
              ) : (
                <span className="text-xs bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>حساب معتمد</span>
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              {activeSupervisor ? (
                <>أهلاً بكِ، {activeSupervisor.name}</>
              ) : (
                <>أهلاً بكِ، منسقة الشراكة شهد العتيبي</>
              )}
            </h2>

            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-300 pt-0.5">
              {!activeSupervisor && (
                <>
                  <span className="inline-flex items-center gap-1 text-amber-300 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20" dir="ltr">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>shmk20064@gmail.com</span>
                  </span>
                  <span>•</span>
                </>
              )}
              <span>المدرسة الثانوية 102 للبنات بجدة</span>
              <span>•</span>
              <span className="text-emerald-300 font-medium">كامل صلاحيات التنسيق والاعتماد مفعلة</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeSupervisor && (
            <button
              onClick={switchToCoordinator}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-colors cursor-pointer"
            >
              العودة للمنسقة العامة (أ. شهد العتيبي)
            </button>
          )}

          <button
            onClick={() => setActiveTab('calendar')}
            className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-600/50"
          >
            <CalendarDays className="w-4 h-4 text-emerald-200" />
            <span>تقويم الفعاليات والشراكات</span>
          </button>

          <button
            onClick={() => setActiveTab('discussion')}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>لوحة النقاش (التليجرام) • {discussionMessages.length} مشاركة</span>
          </button>

          {canAccessReports && (
            <button
              onClick={() => setShowReportModal(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة التقرير الرسمي</span>
            </button>
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>نظرة عامة والمهام</span>
        </button>

        {/* Supervisors & Permissions Tab */}
        <button
          onClick={() => setActiveSubTab('supervisors')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'supervisors'
              ? 'bg-teal-700 text-white shadow-xs'
              : 'bg-white text-teal-900 hover:bg-teal-50 border border-teal-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>المشرفين والصلاحيات ({supervisors.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('proposals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'proposals'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>المقترحات ({pendingProposals.length})</span>
          {!canAccessProposals && <Lock className="w-3 h-3 text-slate-400" />}
        </button>

        <button
          onClick={() => setActiveSubTab('voices')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'voices'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquareQuote className="w-4 h-4 text-sky-500" />
          <span>صوت ولي الأمر والردود</span>
          {!canAccessVoices && <Lock className="w-3 h-3 text-slate-400" />}
        </button>

        <button
          onClick={() => setActiveSubTab('talent_bank')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'talent_bank'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-purple-500" />
          <span>بنك الخبرات ({partnerSkills.length})</span>
          {!canAccessTalentBank && <Lock className="w-3 h-3 text-slate-400" />}
        </button>

        <button
          onClick={() => setActiveSubTab('ai_analyzer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ai_analyzer'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-indigo-900 hover:bg-indigo-50 border border-indigo-200'
          }`}
        >
          <Brain className="w-4 h-4 text-indigo-400" />
          <span>محلل الآراء الذكي (AI)</span>
          {!canAccessAi && <Lock className="w-3 h-3 text-slate-400" />}
        </button>

        <button
          onClick={() => setActiveSubTab('ai_copilot')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeSubTab === 'ai_copilot'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white text-emerald-900 hover:bg-emerald-50 border border-emerald-200'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>مساعد الشراكة الذكي (Copilot)</span>
          {!canAccessAi && <Lock className="w-3 h-3 text-slate-400" />}
        </button>
      </div>

      {/* Main Tab Content */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8 animate-fade-in">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Supervisors Quick Card */}
            <div className="bg-white rounded-2xl p-5 border border-teal-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 block">مشرفات مفوضات من الأعضاء</span>
              <span className="text-2xl font-black text-teal-700 font-display">{supervisors.length}</span>
              <button
                onClick={() => setActiveSubTab('supervisors')}
                className="text-[11px] font-bold text-teal-700 hover:underline block pt-1"
              >
                إدارة المشرفين والصلاحيات ←
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 block">مقترحات بانتظار المراجعة</span>
              <span className="text-2xl font-black text-amber-600 font-display">{pendingProposals.length}</span>
              <button
                onClick={() => setActiveSubTab('proposals')}
                className="text-[11px] font-bold text-amber-700 hover:underline block pt-1"
              >
                مراجعة المقترحات ←
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 block">ملاحظات بانتظار الرد</span>
              <span className="text-2xl font-black text-sky-600 font-display">{pendingVoices.length}</span>
              <button
                onClick={() => setActiveSubTab('voices')}
                className="text-[11px] font-bold text-sky-700 hover:underline block pt-1"
              >
                الرد على الآراء ←
              </button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs text-slate-500 block">كفاءات مسجلة ببنك الخبرات</span>
              <span className="text-2xl font-black text-purple-600 font-display">{partnerSkills.length}</span>
              <button
                onClick={() => setActiveSubTab('talent_bank')}
                className="text-[11px] font-bold text-purple-700 hover:underline block pt-1"
              >
                استعراض المتطوعين ←
              </button>
            </div>
          </div>

          {/* Quick Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Supervisors Delegated Card */}
            <div
              onClick={() => setActiveSubTab('supervisors')}
              className="bg-gradient-to-br from-teal-950 via-teal-900 to-slate-900 text-white rounded-3xl p-6 border border-teal-700 shadow-md hover:border-teal-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-300 bg-white/10 px-3 py-1 rounded-full">
                  حوكمة وتفويض
                </span>
                <ShieldCheck className="w-6 h-6 text-teal-400" />
              </div>
              <h3 className="text-xl font-bold font-display">إدارة المشرفين والصلاحيات</h3>
              <p className="text-xs text-teal-100 leading-relaxed">
                تعيين مشرفات من أولياء الأمور والمعلمات وتحديد دقيق للصلاحيات الممنوحة لكل مشرفة (إدارة النقاش، المقترحات، الردود، والتقارير).
              </p>
              <div className="text-xs font-bold text-teal-300 pt-2">
                الانتقال لإدارة المشرفين ({supervisors.length} مشرفات) ←
              </div>
            </div>

            <div
              onClick={() => setActiveSubTab('ai_analyzer')}
              className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-indigo-700 shadow-md hover:border-indigo-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-300 bg-white/10 px-3 py-1 rounded-full">
                  تحليل ذكي فوري
                </span>
                <Brain className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold font-display">محلل المشاعر والآراء الذكي</h3>
              <p className="text-xs text-indigo-200 leading-relaxed">
                استخرجي المشاعر ونقاط القوة وفرص التحسين وتوصيات الإدارة التنفيذية بناءً على جميع تفاعلات أولياء الأمور بنقرة واحدة.
              </p>
              <div className="text-xs font-bold text-emerald-400 pt-2">
                انتقال إلى المحلل الذكي ←
              </div>
            </div>

            <div
              onClick={() => setActiveSubTab('ai_copilot')}
              className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white rounded-3xl p-6 border border-emerald-700 shadow-md hover:border-emerald-500 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-300 bg-white/10 px-3 py-1 rounded-full">
                  توليد وصياغة الوثائق
                </span>
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <h3 className="text-xl font-bold font-display">مساعد الشراكة الذكي (Copilot)</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">
                صياغة خطابات طلب الشراكة الرسمية للمؤسسات، إعداد خطط المبادرات التربوية، استبيانات قياس الرضا، والتقارير الختامية.
              </p>
              <div className="text-xs font-bold text-amber-300 pt-2">
                بدء صياغة المستندات ←
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Supervisors Management Tab */}
      {activeSubTab === 'supervisors' && <SupervisorsManager />}

      {/* Proposals Tab */}
      {activeSubTab === 'proposals' && (
        canAccessProposals ? (
          <ProposalsManager />
        ) : (
          <PermissionDeniedCard 
            title="مراجعة واعتماد المقترحات" 
            permissionName="إدارة المقترحات والمبادرات"
            onSwitchToCoordinator={switchToCoordinator}
          />
        )
      )}

      {/* Voices Tab */}
      {activeSubTab === 'voices' && (
        canAccessVoices ? (
          <VoicesManager />
        ) : (
          <PermissionDeniedCard 
            title="صوت ولي الأمر والردود" 
            permissionName="الرد على صوت ولي الأمر"
            onSwitchToCoordinator={switchToCoordinator}
          />
        )
      )}

      {/* Talent Bank Tab */}
      {activeSubTab === 'talent_bank' && (
        canAccessTalentBank ? (
          <VolunteerTalentBank />
        ) : (
          <PermissionDeniedCard 
            title="بنك الخبرات والكفاءات" 
            permissionName="إدارة بنك الخبرات والكفاءات"
            onSwitchToCoordinator={switchToCoordinator}
          />
        )
      )}

      {/* AI Analyzer Tab */}
      {activeSubTab === 'ai_analyzer' && (
        canAccessAi ? (
          <AIFeedbackAnalyzer />
        ) : (
          <PermissionDeniedCard 
            title="محلل المشاعر والآراء الذكي" 
            permissionName="المحلل الذكي ومساعد الصياغة (AI)"
            onSwitchToCoordinator={switchToCoordinator}
          />
        )
      )}

      {/* AI Copilot Tab */}
      {activeSubTab === 'ai_copilot' && (
        canAccessAi ? (
          <AIAssistantCopilot />
        ) : (
          <PermissionDeniedCard 
            title="مساعد الشراكة الذكي (Copilot)" 
            permissionName="المحلل الذكي ومساعد الصياغة (AI)"
            onSwitchToCoordinator={switchToCoordinator}
          />
        )
      )}

      {/* Official Report Modal */}
      {showReportModal && (
        <PartnershipReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

interface PermissionDeniedCardProps {
  title: string;
  permissionName: string;
  onSwitchToCoordinator: () => void;
}

const PermissionDeniedCard: React.FC<PermissionDeniedCardProps> = ({
  title,
  permissionName,
  onSwitchToCoordinator
}) => (
  <div className="bg-white rounded-3xl p-10 text-center border border-amber-200 shadow-sm space-y-4 max-w-xl mx-auto my-8">
    <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
      <Lock className="w-7 h-7" />
    </div>

    <div className="space-y-1">
      <h3 className="font-bold text-slate-900 text-base font-display">
        صلاحية غير مفوضة: {title}
      </h3>
      <p className="text-xs text-slate-600 leading-relaxed">
        يتطلب الوصول لهذا القسم صلاحية <strong className="text-amber-800 font-bold">«{permissionName}»</strong>. لم يتم تفويض هذه الصلاحية لحساب المشرفة المفوضة الحالي من قِبل منسقة الشراكة.
      </p>
    </div>

    <div className="pt-2">
      <button
        onClick={onSwitchToCoordinator}
        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
      >
        العودة لحساب المنسقة العامة (أ. شهد العتيبي)
      </button>
    </div>
  </div>
);
