import React, { useState } from 'react';
import { 
  Users, 
  Code2, 
  Palette, 
  GraduationCap, 
  HeartPulse, 
  Briefcase, 
  Presentation, 
  Leaf, 
  HandHeart, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  PlusCircle, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartnerSkillCategory } from '../types';

interface SkillCardMeta {
  category: PartnerSkillCategory;
  title: string;
  icon: React.ReactNode;
  description: string;
  examples: string;
  colorClass: string;
  bgLightClass: string;
  borderColorClass: string;
}

const SKILL_CARDS: SkillCardMeta[] = [
  {
    category: 'خبرة تقنية',
    title: 'خبرة تقنية وبرمجة',
    icon: <Code2 className="w-6 h-6" />,
    description: 'تمكين الطالبات في علوم الحاسب، الذكاء الاصطناعي، والروبوتات.',
    examples: 'بايثون، أمن سيبراني، ويب، تطبيقات ذكية',
    colorClass: 'text-indigo-600',
    bgLightClass: 'bg-indigo-50',
    borderColorClass: 'border-indigo-200'
  },
  {
    category: 'تصميم وإبداع',
    title: 'تصميم وفنون بصرية',
    icon: <Palette className="w-6 h-6" />,
    description: 'صناعة المحتوى الإبداعي وتدريب الطالبات على الفنون الرقمية.',
    examples: 'تصميم جرافيك، مونتاج، تصوير، هوية بصرية',
    colorClass: 'text-purple-600',
    bgLightClass: 'bg-purple-50',
    borderColorClass: 'border-purple-200'
  },
  {
    category: 'تدريب وتعليم',
    title: 'تدريب وبناء قدرات',
    icon: <GraduationCap className="w-6 h-6" />,
    description: 'إعداد الطالبات لاختبارات القدرات، التحصيلي، والأولمبياد العلمي.',
    examples: 'استراتيجيات الحل السريع، لغة إنجليزية، مهارات بحث',
    colorClass: 'text-sky-600',
    bgLightClass: 'bg-sky-50',
    borderColorClass: 'border-sky-200'
  },
  {
    category: 'صحة وتوعية',
    title: 'رعاية صحية وتوعية',
    icon: <HeartPulse className="w-6 h-6" />,
    description: 'تعزيز الصحة المدرسية، الإسعافات الأولية، والتغذية السليمة.',
    examples: 'تغذية علاجية، صحة نفسية، إسعافات، لياقة بدنية',
    colorClass: 'text-rose-600',
    bgLightClass: 'bg-rose-50',
    borderColorClass: 'border-rose-200'
  },
  {
    category: 'أعمال وإدارة',
    title: 'ريادة أعمال وإدارة',
    icon: <Briefcase className="w-6 h-6" />,
    description: 'بناء العقلية الريادية والثقافة المالية والتخطيط المهني.',
    examples: 'مشاريع ناشئة، وعي مالي، إدارة وقت، قيادة فرق',
    colorClass: 'text-amber-600',
    bgLightClass: 'bg-amber-50',
    borderColorClass: 'border-amber-200'
  },
  {
    category: 'تقديم ورش',
    title: 'تقديم ورش ومحاضرات',
    icon: <Presentation className="w-6 h-6" />,
    description: 'إلقاء محاضرات ملهمة وحوارات إثرائية حضورية أو عن بعد.',
    examples: 'ندوات تفاعلية، جلسات إرشاد مهني، قصص نجاح ملهمة',
    colorClass: 'text-teal-600',
    bgLightClass: 'bg-teal-50',
    borderColorClass: 'border-teal-200'
  },
  {
    category: 'بيئة واستدامة',
    title: 'بيئة وتشجير واستدامة',
    icon: <Leaf className="w-6 h-6" />,
    description: 'مبادرات السعودية الخضراء وتدوير النفايات والبيئة المدرسية.',
    examples: 'حديقة المدرسة، إعادة التدوير، ترشيد الطاقة',
    colorClass: 'text-emerald-600',
    bgLightClass: 'bg-emerald-50',
    borderColorClass: 'border-emerald-200'
  },
  {
    category: 'تطوع وتنظيم',
    title: 'تطوع وتنظيم فعاليات',
    icon: <HandHeart className="w-6 h-6" />,
    description: 'المشاركة الميدانية في تنظيم معارض ومناسبات المدرسة والاحتفاء.',
    examples: 'يوم التأسيس، حفل التخرج، معارض العلوم، استقبال الأسر',
    colorClass: 'text-orange-600',
    bgLightClass: 'bg-orange-50',
    borderColorClass: 'border-orange-200'
  },
  {
    category: 'توفير شراكات',
    title: 'توفير وتسهيل شراكات',
    icon: <Building className="w-6 h-6" />,
    description: 'ربط المدرسة بجهات حكومية، جامعات، ومؤسسات قطاع خاص.',
    examples: 'تسهيل مذكرات تفاهم، زيارات ميدانية، رعاية فعاليات',
    colorClass: 'text-blue-600',
    bgLightClass: 'bg-blue-50',
    borderColorClass: 'border-blue-200'
  },
  {
    category: 'أفكار ومبادرات',
    title: 'أفكار ومشاريع نوعية',
    icon: <Sparkles className="w-6 h-6" />,
    description: 'المساهمة بالرؤى الاستراتيجية والتطوير التربوي المستمر.',
    examples: 'حلول ذكية للمقصف والمواقف، نوادي اهتمام للطالبات',
    colorClass: 'text-violet-600',
    bgLightClass: 'bg-violet-50',
    borderColorClass: 'border-violet-200'
  }
];

export const ParentPartnerSkills: React.FC = () => {
  const { 
    partnerSkills, 
    addPartnerSkill, 
    currentUser, 
    isParentLoggedIn, 
    requireParentAuth, 
    openLoginModal 
  } = useApp();

  // Registration Modal State
  const [selectedCategory, setSelectedCategory] = useState<PartnerSkillCategory | null>(null);
  const [fullName, setFullName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [profession, setProfession] = useState('');
  const [experienceDetails, setExperienceDetails] = useState('');
  const [availability, setAvailability] = useState('شهريًا');

  const [isSuccess, setIsSuccess] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  React.useEffect(() => {
    if (currentUser.name) setFullName(currentUser.name);
    if (currentUser.phone) setPhone(currentUser.phone);
    if (currentUser.email) setEmail(currentUser.email);
  }, [currentUser]);

  const handleCardClick = (cat: PartnerSkillCategory) => {
    setSelectedCategory(cat);
    setIsSuccess(false);
  };

  const executeSubmit = () => {
    if (!selectedCategory || !fullName.trim() || !phone.trim()) return;

    addPartnerSkill({
      fullName: fullName.trim() || currentUser.name,
      phone: phone.trim() || currentUser.phone,
      email: email.trim() || currentUser.email || undefined,
      profession: profession.trim() || 'كفاءة وخبرة وطنية',
      skillCategory: selectedCategory,
      experienceDetails: experienceDetails.trim(),
      availability,
    });

    setIsSuccess(true);
    setProfession('');
    setExperienceDetails('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !fullName.trim() || !phone.trim()) return;

    if (!requireParentAuth(executeSubmit, 'يُرجى تسجيل الدخول لتسجيل بياناتك في بنك كفاءات الشراكة المدرسية')) {
      return;
    }

    executeSubmit();
  };

  const filteredTalents = partnerSkills.filter(t => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      t.fullName.toLowerCase().includes(q) ||
      t.profession.toLowerCase().includes(q) ||
      t.skillCategory.toLowerCase().includes(q) ||
      t.experienceDetails.toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 text-xs font-bold">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>بنك الخبرات والكفاءات لأولياء الأمور</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          ولي الأمر شريك.. ماذا تستطيع أن تقدم؟
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          وراء كل طالبة متميزة أسرة تمتلك خبرات ومهارات وطاقات ملهمة. سجلي مجالك المفضل لتستفيد منك طالبات الثانوية 102 في الورش والفعاليات.
        </p>
      </div>

      {/* 10 Skill Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-16">
        {SKILL_CARDS.map((item) => (
          <div
            key={item.category}
            onClick={() => handleCardClick(item.category)}
            className={`p-5 rounded-2xl bg-white border ${item.borderColorClass} hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div>
              <div className={`w-12 h-12 rounded-xl ${item.bgLightClass} ${item.colorClass} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {item.description}
              </p>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 bg-slate-50 p-2 rounded-lg border border-slate-100 mb-3">
                <span className="font-bold block text-slate-600 mb-0.5">أمثلة:</span>
                <span>{item.examples}</span>
              </div>
              <button
                type="button"
                className={`w-full py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${item.bgLightClass} ${item.colorClass} group-hover:bg-slate-900 group-hover:text-white`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>انضمي لهذا المجال</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Talent Bank Directory (بنك الكفاءات المسجلة) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>بنك خبرات أولياء الأمور المشاركين ({partnerSkills.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              كفاءات وطنية تطوعت لدعم ورعاية مسيرة الطالبات بالثانوية 102
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="بحث بالاسم أو التخصص..."
                className="pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTalents.map((talent) => (
            <div
              key={talent.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-white transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                    {talent.fullName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{talent.fullName}</h4>
                    <span className="text-[11px] text-slate-500">{talent.profession}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {talent.skillCategory}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                {talent.experienceDetails}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>التفرغ: {talent.availability}</span>
                </span>
                <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{talent.status}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {isSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fade-in">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  تم تسجيل خبرتكِ بنجاح في بنك الكفاءات! 🌟
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ستتواصل معك منسقة الشراكة المجتمعية عند التخطيط للورش والفعاليات المتوافقة مع مجالك.
                </p>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      تسجيل كفاءة في: {selectedCategory}
                    </h3>
                    <p className="text-xs text-slate-500">
                      ساهمي بعلمك وخبرتك في خدمة مجتمع الثانوية 102
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    الاسم الثلاثي <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="مثال: د. هيفاء محمد السالم"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      رقم الجوال للتواصل <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="05xxxxxxxx"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      المسمى الوظيفي / التخصص
                    </label>
                    <input
                      type="text"
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="مثال: مهندسة برمجيات / رائدة أعمال"
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    طبيعة المشاركة والخبرة التي ترغبين بتقديمها <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={experienceDetails}
                    onChange={(e) => setExperienceDetails(e.target.value)}
                    placeholder="مثال: تقديم ورشة تدريبية في أساسيات الأمن السيبراني للطالبات، أو توفير زيارة ميدانية لمركز أبحاث..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    أوقات التفرغ والمشاركة المفضلة
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="عند الحاجة وفي الفعاليات">عند الحاجة وفي الفعاليات الكبرى</option>
                    <option value="شهريًا (ورشة شهرية)">شهريًا (ورشة شهرية)</option>
                    <option value="أسبوعيًا">أسبوعيًا (نادي اهتمام مستمر)</option>
                    <option value="افتراضيًا فقط عن بعد">افتراضيًا فقط (عن بُعد)</option>
                  </select>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>تأكيد التسجيل في بنك الكفاءات</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
