import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  UserCheck, 
  Settings, 
  Key, 
  Check, 
  X, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  AlertTriangle, 
  Sparkles, 
  Clock, 
  Phone, 
  Mail, 
  FileText, 
  MessageSquare, 
  Lightbulb, 
  Compass, 
  CheckCircle2, 
  Power, 
  Eye, 
  Layers,
  ArrowRight,
  Info,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Supervisor, CoordinatorPermission } from '../../types';
import { PERMISSION_DEFINITIONS, SUPERVISOR_ROLE_TEMPLATES } from '../../data/initialData';

export const SupervisorsManager: React.FC = () => {
  const { 
    supervisors, 
    activeSupervisor,
    addSupervisor, 
    updateSupervisorPermissions, 
    toggleSupervisorStatus, 
    removeSupervisor, 
    loginAsSupervisor,
    switchToCoordinator,
    partnerSkills
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null);
  const [deleteConfirmSup, setDeleteConfirmSup] = useState<Supervisor | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New supervisor form state
  const [sourceType, setSourceType] = useState<'member_pool' | 'manual'>('member_pool');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [newSupName, setNewSupName] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupEmail, setNewSupEmail] = useState('');
  const [newSupRoleInSchool, setNewSupRoleInSchool] = useState<Supervisor['roleInSchool']>('ولي أمر');
  const [newSupStudentName, setNewSupStudentName] = useState('');
  const [newSupPermissions, setNewSupPermissions] = useState<CoordinatorPermission[]>([
    'manage_discussion',
    'manage_announcements'
  ]);
  const [newSupNotes, setNewSupNotes] = useState('');

  // Selected edit permissions
  const [editPermissions, setEditPermissions] = useState<CoordinatorPermission[]>([]);

  // Filter supervisors
  const filteredSupervisors = supervisors.filter(sup => {
    if (statusFilter !== 'all' && sup.status !== statusFilter) return false;
    if (roleFilter !== 'all' && sup.roleInSchool !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        sup.name.toLowerCase().includes(q) ||
        sup.phone.includes(q) ||
        (sup.studentName && sup.studentName.toLowerCase().includes(q)) ||
        (sup.notes && sup.notes.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const activeCount = supervisors.filter(s => s.status === 'نشط').length;

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  const handleMemberSelect = (skillId: string) => {
    setSelectedMemberId(skillId);
    const member = partnerSkills.find(s => s.id === skillId);
    if (member) {
      setNewSupName(member.fullName);
      setNewSupPhone(member.phone);
      setNewSupEmail(member.email || '');
      setNewSupRoleInSchool('ولي أمر');
      setNewSupStudentName('');
      setNewSupNotes(`كفاءة مسجلة في بنك الخبرات (${member.jobTitle} - ${member.skillCategory})`);
    }
  };

  const handleApplyTemplate = (permissions: CoordinatorPermission[]) => {
    setNewSupPermissions([...permissions]);
  };

  const togglePermission = (permId: CoordinatorPermission, isEdit: boolean = false) => {
    if (isEdit) {
      setEditPermissions(prev => 
        prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
      );
    } else {
      setNewSupPermissions(prev => 
        prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
      );
    }
  };

  const handleSelectAllPermissions = (isEdit: boolean = false) => {
    const allIds = PERMISSION_DEFINITIONS.map(p => p.id);
    if (isEdit) {
      setEditPermissions(allIds);
    } else {
      setNewSupPermissions(allIds);
    }
  };

  const handleClearPermissions = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditPermissions([]);
    } else {
      setNewSupPermissions([]);
    }
  };

  const handleCreateSupervisor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim() || !newSupPhone.trim()) {
      alert('يرجى إدخال اسم المشرفة ورقم الجوال');
      return;
    }
    if (newSupPermissions.length === 0) {
      alert('يرجى تحديد صلاحية واحدة على الأقل للمشرفة');
      return;
    }

    addSupervisor({
      name: newSupName.trim(),
      phone: newSupPhone.trim(),
      email: newSupEmail.trim() || undefined,
      roleInSchool: newSupRoleInSchool,
      studentName: newSupRoleInSchool === 'ولي أمر' ? (newSupStudentName.trim() || 'طالبة بالمدرسة') : undefined,
      status: 'نشط',
      permissions: newSupPermissions,
      notes: newSupNotes.trim() || undefined
    });

    setIsAddModalOpen(false);
    showNotification(`تم تعيين الأستاذة/ ${newSupName.trim()} مشرفةً مفوضة وتحديد ${newSupPermissions.length} صلاحيات بنجاح ✅`);
    
    // Reset form
    setNewSupName('');
    setNewSupPhone('');
    setNewSupEmail('');
    setNewSupStudentName('');
    setNewSupNotes('');
    setSelectedMemberId('');
    setNewSupPermissions(['manage_discussion', 'manage_announcements']);
  };

  const handleOpenEdit = (sup: Supervisor) => {
    setEditingSupervisor(sup);
    setEditPermissions([...sup.permissions]);
  };

  const handleSaveEditPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSupervisor) return;
    if (editPermissions.length === 0) {
      alert('يرجى اختيار صلاحية واحدة على الأقل للمشرفة أو إيقاف حسابها بدلاً من ذلك');
      return;
    }

    updateSupervisorPermissions(editingSupervisor.id, editPermissions);
    showNotification(`تم تحديث صلاحيات المشرفة (${editingSupervisor.name}) بنجاح (${editPermissions.length} صلاحيات) ✅`);
    setEditingSupervisor(null);
  };

  const handleToggleStatus = (sup: Supervisor) => {
    toggleSupervisorStatus(sup.id);
    const nextText = sup.status === 'نشط' ? 'إيقاف مؤقت' : 'تفعيل';
    showNotification(`تم ${nextText} لحساب المشرفة (${sup.name})`);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmSup) return;
    removeSupervisor(deleteConfirmSup.id);
    showNotification(`تم إلغاء تكليف المشرفة (${deleteConfirmSup.name}) وسحب صلاحياتها`);
    setDeleteConfirmSup(null);
  };

  // Group permission definitions by category
  const permissionCategories = Array.from(new Set(PERMISSION_DEFINITIONS.map(p => p.category)));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Impersonation Banner if active */}
      {activeSupervisor && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-orange-700 text-white p-4 rounded-2xl shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base">وضع محاكاة المشرفة المفوضة:</span>
                <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {activeSupervisor.name} ({activeSupervisor.roleInSchool})
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                تتصفحين اللوحة حالياً بصلاحياتها الممنوحة ({activeSupervisor.permissions.length} صلاحيات). الأقسام غير المصرح بها محجوبة تلقائياً.
              </p>
            </div>
          </div>

          <button
            onClick={switchToCoordinator}
            className="px-4 py-2 bg-white text-amber-950 hover:bg-amber-50 font-bold text-xs rounded-xl shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            العودة لحساب المنسقة العامة (أ. شهد العتيبي)
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {notificationMsg && (
        <div className="bg-emerald-800 text-white px-4 py-3 rounded-xl shadow-lg border border-emerald-600 flex items-center gap-2.5 text-xs font-bold animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Main Feature Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>نظام حوكمة وتفويض صلاحيات الشراكة</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display">
              إدارة المشرفين وتفويض الصلاحيات
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              تتيح هذه الخاصية لمنسقة الشراكة تعيين مشرفات من عضوات المدرسة (أولياء الأمور، المعلمات، الكادر الإداري) مع التحديد الدقيق للصلاحيات المسموح بها لكل مشرفة (إدارة النقاش، مراجعة المقترحات، الرد على الملاحظات، استطلاعات الرأي، إعداد التقارير) لضمان العمل المؤسسي المنظم.
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-5 h-5" />
            <span>تعيين مشرفة جديدة</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-700/60 text-xs">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-slate-400 block mb-1">إجمالي المشرفات</span>
            <span className="text-2xl font-black text-white font-display">{supervisors.length}</span>
            <span className="text-[11px] text-indigo-300 block mt-1">مشرفات مفوضات</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-slate-400 block mb-1">المشرفات النشطات</span>
            <span className="text-2xl font-black text-emerald-400 font-display">{activeCount}</span>
            <span className="text-[11px] text-emerald-300 block mt-1">يمارسن الصلاحيات حالياً</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-slate-400 block mb-1">صلاحيات الشراكة</span>
            <span className="text-2xl font-black text-amber-400 font-display">10</span>
            <span className="text-[11px] text-amber-300 block mt-1">صلاحيات قابلة للتفويض</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <span className="text-slate-400 block mb-1">أولياء الأمور المشرفات</span>
            <span className="text-2xl font-black text-sky-400 font-display">
              {supervisors.filter(s => s.roleInSchool === 'ولي أمر').length}
            </span>
            <span className="text-[11px] text-sky-300 block mt-1">شراكة مجتمعية حقيقية</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم، الجوال، أو اسم الطالبة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>الصفة:</span>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">كافة الفئات</option>
            <option value="ولي أمر">ولي أمر</option>
            <option value="معلمة">معلمة</option>
            <option value="إدارية">إدارية</option>
            <option value="عضو مجلس الأسرة">عضو مجلس الأسرة</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">كافة الحالات</option>
            <option value="نشط">نشط فقط</option>
            <option value="موقوف مؤقتاً">موقوف مؤقتاً</option>
          </select>
        </div>
      </div>

      {/* Supervisors List Cards */}
      <div className="space-y-4">
        {filteredSupervisors.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-3">
            <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">لا توجد مشرفات مطابقة لمعايير البحث</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              يمكنكِ تعيين مشرفة جديدة من أولياء الأمور أو المعلمات بالنقر على زر «تعيين مشرفة جديدة».
            </p>
          </div>
        ) : (
          filteredSupervisors.map((sup) => {
            const isSimulating = activeSupervisor?.id === sup.id;
            return (
              <div 
                key={sup.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isSimulating 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                  {/* Supervisor Profile & Information */}
                  <div className="flex items-start gap-4">
                    <div className={`w-13 h-13 rounded-2xl ${sup.avatarColor || 'bg-teal-600'} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
                      {sup.name.substring(0, 2)}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 font-display">
                          {sup.name}
                        </h3>

                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          sup.roleInSchool === 'معلمة'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : sup.roleInSchool === 'إدارية'
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {sup.roleInSchool}
                        </span>

                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          sup.status === 'نشط'
                            ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300'
                        }`}>
                          {sup.status === 'نشط' ? '● نشط' : '○ موقوف مؤقتاً'}
                        </span>

                        {isSimulating && (
                          <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            جاري المحاكاة
                          </span>
                        )}
                      </div>

                      {/* Details & Metadata */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                        {sup.studentName && (
                          <span className="text-slate-700 font-medium">
                            الطالبة: {sup.studentName}
                          </span>
                        )}
                        <span className="flex items-center gap-1 font-mono text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {sup.phone}
                        </span>
                        {sup.email && (
                          <span className="flex items-center gap-1 text-slate-600">
                            <Mail className="w-3 h-3 text-slate-400" />
                            {sup.email}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          تم التكليف: {sup.assignedDate}
                        </span>
                      </div>

                      {sup.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-100 p-2 rounded-xl mt-1 leading-relaxed">
                          📌 {sup.notes}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    {/* Impersonate / Test View Button */}
                    <button
                      onClick={() => {
                        if (isSimulating) {
                          switchToCoordinator();
                        } else {
                          loginAsSupervisor(sup.id);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isSimulating
                          ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-xs'
                          : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200'
                      }`}
                      title="تجربة الدخول بصفة المشرفة لمعاينة اللوحة بصلاحياتها"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSimulating ? 'إنهاء المحاكاة' : 'تجربة الدخول بصفتها'}</span>
                    </button>

                    {/* Edit Permissions Button */}
                    <button
                      onClick={() => handleOpenEdit(sup)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>تعديل الصلاحيات</span>
                    </button>

                    {/* Toggle Status (Active / Suspend) */}
                    <button
                      onClick={() => handleToggleStatus(sup)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                        sup.status === 'نشط'
                          ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}
                      title={sup.status === 'نشط' ? 'إيقاف الصلاحيات مؤقتاً' : 'تفعيل الصلاحيات'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{sup.status === 'نشط' ? 'إيقاف مؤقت' : 'تفعيل'}</span>
                    </button>

                    {/* Delete / Revoke Supervisor */}
                    <button
                      onClick={() => setDeleteConfirmSup(sup)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs transition-colors cursor-pointer border border-rose-200"
                      title="إلغاء تكليف المشرفة وسحب الصلاحيات نهائياً"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Delegated Permissions Badges */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-emerald-600" />
                      الصلاحيات المفوضة ({sup.permissions.length} من 10):
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      ممنوحة من: {sup.assignedBy}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {sup.permissions.map(permId => {
                      const def = PERMISSION_DEFINITIONS.find(p => p.id === permId);
                      if (!def) return null;
                      return (
                        <span 
                          key={permId}
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${def.badgeColor}`}
                          title={def.description}
                        >
                          <Check className="w-3 h-3" />
                          {def.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Assign New Supervisor */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserPlus className="w-6 h-6 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    تعيين مشرفة جديدة من الأعضاء
                  </h3>
                  <p className="text-xs text-slate-500">
                    اختيار العضوة وتحديد الصلاحيات المسموح بها بالتفصيل
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupervisor} className="space-y-6">
              {/* Step 1: Member Selection Source */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  1. اختيار العضوة المراد تعيينها:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSourceType('member_pool')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      sourceType === 'member_pool'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>من أعضاء المدرسة المسجلين ({partnerSkills.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSourceType('manual');
                      setSelectedMemberId('');
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      sourceType === 'manual'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300 ring-2 ring-emerald-200'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>إدخال بيانات عضوة جديدة يدوياً</span>
                  </button>
                </div>

                {sourceType === 'member_pool' && (
                  <div className="space-y-2">
                    <select
                      value={selectedMemberId}
                      onChange={(e) => handleMemberSelect(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">-- اختاري من قائمة الكفاءات وأولياء الأمور المسجلين --</option>
                      {partnerSkills.map((sk) => (
                        <option key={sk.id} value={sk.id}>
                          {sk.fullName} • {sk.jobTitle} ({sk.skillCategory}) - {sk.phone}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Step 2: Member Personal Data */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    اسم المشرفة الرباعي *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: أ. هند عبدالله السبيعي"
                    value={newSupName}
                    onChange={(e) => setNewSupName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    رقم الجوال *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05XXXXXXXX"
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الصفة في المجتمع المدرسي
                  </label>
                  <select
                    value={newSupRoleInSchool}
                    onChange={(e) => setNewSupRoleInSchool(e.target.value as Supervisor['roleInSchool'])}
                    className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ولي أمر">ولي أمر (أم / أب)</option>
                    <option value="معلمة">معلمة</option>
                    <option value="إدارية">كادر إداري</option>
                    <option value="عضو مجلس الأسرة">عضو مجلس الأسرة</option>
                  </select>
                </div>

                {newSupRoleInSchool === 'ولي أمر' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      اسم الطالبة والصف
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: ريم فهد (الأول الثانوي)"
                      value={newSupStudentName}
                      onChange={(e) => setNewSupStudentName(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl p-2 text-xs focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                )}
              </div>

              {/* Step 3: Quick Role Templates Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    2. نماذج جاهزة للأدوار الإشرافية (اختياري لتسهيل الاختيار):
                  </label>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUPERVISOR_ROLE_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.name}
                      type="button"
                      onClick={() => handleApplyTemplate(tmpl.permissions)}
                      className="p-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl text-right transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800 group-hover:text-emerald-900 block">
                          {tmpl.name}
                        </span>
                        <span className="text-[10px] bg-slate-200 group-hover:bg-emerald-200 text-slate-700 px-1.5 py-0.5 rounded-full">
                          {tmpl.permissions.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                        {tmpl.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 4: Granular Permissions Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    3. تحديد الصلاحيات المسموح بها بدقة ({newSupPermissions.length} محددة):
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectAllPermissions(false)}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      تحديد الكل
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleClearPermissions(false)}
                      className="text-rose-600 hover:underline font-bold"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                </div>

                <div className="space-y-3 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  {permissionCategories.map((category) => {
                    const categoryPerms = PERMISSION_DEFINITIONS.filter(p => p.category === category);
                    return (
                      <div key={category} className="space-y-2">
                        <span className="text-xs font-bold text-indigo-900 block border-b border-slate-200 pb-1">
                          {category}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryPerms.map((perm) => {
                            const isChecked = newSupPermissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                                  isChecked
                                    ? 'bg-white border-emerald-400 shadow-2xs'
                                    : 'bg-white/60 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id, false)}
                                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                                />
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800 block">
                                    {perm.name}
                                  </span>
                                  <p className="text-[10px] text-slate-500 leading-tight">
                                    {perm.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 5: Notes & Scope */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. ملاحظات أو نطاق التكليف (اختياري)
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: الإشراف على ملتقى الحوار ونشر التنويهات والتفاعل مع أولياء الأمور للفصل الدراسي الأول..."
                  value={newSupNotes}
                  onChange={(e) => setNewSupNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>اعتماد وتعيين المشرفة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Existing Supervisor Permissions */}
      {editingSupervisor && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Edit3 className="w-6 h-6 text-indigo-700" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    تعديل صلاحيات المشرفة: {editingSupervisor.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    الصفة: {editingSupervisor.roleInSchool} • الجوال: {editingSupervisor.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingSupervisor(null)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditPermissions} className="space-y-6">
              {/* Permission Selection Checklist */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-900">
                    الصلاحيات المسموح بها للمشرفة ({editPermissions.length} محددة من 10):
                  </label>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSelectAllPermissions(true)}
                      className="text-emerald-700 hover:underline font-bold"
                    >
                      تحديد الكل
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleClearPermissions(true)}
                      className="text-rose-600 hover:underline font-bold"
                    >
                      إلغاء التحديد
                    </button>
                  </div>
                </div>

                <div className="space-y-3 border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                  {permissionCategories.map((category) => {
                    const categoryPerms = PERMISSION_DEFINITIONS.filter(p => p.category === category);
                    return (
                      <div key={category} className="space-y-2">
                        <span className="text-xs font-bold text-indigo-900 block border-b border-slate-200 pb-1">
                          {category}
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {categoryPerms.map((perm) => {
                            const isChecked = editPermissions.includes(perm.id);
                            return (
                              <label
                                key={perm.id}
                                className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-colors cursor-pointer ${
                                  isChecked
                                    ? 'bg-white border-emerald-400 shadow-2xs'
                                    : 'bg-white/60 border-slate-200 hover:bg-white'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(perm.id, true)}
                                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                                />
                                <div className="space-y-0.5">
                                  <span className="text-xs font-bold text-slate-800 block">
                                    {perm.name}
                                  </span>
                                  <p className="text-[10px] text-slate-500 leading-tight">
                                    {perm.description}
                                  </p>
                                </div>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingSupervisor(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>حفظ الصلاحيات المحدثة</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirm Deletion / Revocation */}
      {deleteConfirmSup && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h3 className="font-bold text-slate-900 text-base font-display">
              تأكيد إلغاء تكليف المشرفة
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              هل أنتِ متأكدة من رغبتكِ في إلغاء تكليف الأستاذة/ <strong className="text-slate-900 font-bold">{deleteConfirmSup.name}</strong> وسحب كافة صلاحيات الشراكة المفوضة إليها؟ ستعود عضوة عادية في المدرسة.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmSup(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                تراجع
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer"
              >
                تأكيد الإلغاء وسحب الصلاحيات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
