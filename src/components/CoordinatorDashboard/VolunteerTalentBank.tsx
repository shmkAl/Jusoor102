import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  Building2, 
  Award, 
  CheckCircle2,
  ExternalLink,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PartnerSkillCategory } from '../../types';

export const VolunteerTalentBank: React.FC = () => {
  const { partnerSkills, updateSkillStatus } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSkills = partnerSkills.filter(skill => {
    if (categoryFilter !== 'all' && skill.skillCategory !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        skill.fullName.toLowerCase().includes(q) ||
        skill.jobTitle.toLowerCase().includes(q) ||
        skill.workplace.toLowerCase().includes(q) ||
        skill.experienceDetails.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 border border-indigo-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-400/30">
            قاعدة بيانات الكفاءات التطوعية
          </span>
          <h3 className="text-2xl font-black text-white font-display mt-2">
            بنك خبرات أولياء الأمور المتطوعين ({partnerSkills.length} خبير مسجل)
          </h3>
          <p className="text-xs sm:text-sm text-indigo-200/80 mt-1 max-w-xl">
            استثمري خبرات وتخصصات أولياء الأمور لتنظيم ورش عمل، محاضرات إثرائية، استشارات مهنية، ودعم مشاريع الطالبات الموهوبات.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
            }`}
          >
            جميع التخصصات ({partnerSkills.length})
          </button>
          <button
            onClick={() => setCategoryFilter('التقنية والذكاء الاصطناعي')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'التقنية والذكاء الاصطناعي' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-800'
            }`}
          >
            تقنية وذكاء اصطناعي
          </button>
          <button
            onClick={() => setCategoryFilter('الطب والصحة العامة')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'الطب والصحة العامة' ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-800'
            }`}
          >
            صحة وطب
          </button>
          <button
            onClick={() => setCategoryFilter('الإرشاد والتوجيه المهني')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              categoryFilter === 'الإرشاد والتوجيه المهني' ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-800'
            }`}
          >
            إرشاد مهني
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم أو الوظيفة أو جهة العمل..."
            className="w-full pr-9 pl-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Talent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSkills.map((skill) => (
          <div
            key={skill.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{skill.fullName}</h4>
                  <span className="text-xs text-indigo-700 font-bold block">{skill.jobTitle}</span>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  skill.status === 'نشط' ? 'bg-emerald-100 text-emerald-800' :
                  skill.status === 'تم التواصل' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  {skill.status}
                </span>
              </div>

              {/* Category & Workplace */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>جهة العمل: <strong>{skill.workplace}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>التصنيف: <strong>{skill.skillCategory}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>الأوقات المفضلة: {skill.preferredTime}</span>
                </div>
              </div>

              {/* Experience Details */}
              <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                {skill.experienceDetails}
              </p>
            </div>

            {/* Direct Contact Actions */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <a
                  href={`tel:${skill.phone}`}
                  className="flex items-center gap-1 text-slate-700 hover:text-emerald-700 font-bold"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{skill.phone}</span>
                </a>
                <a
                  href={`https://wa.me/966${skill.phone.replace(/^0+/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-lg font-bold text-[11px] flex items-center gap-1"
                >
                  <MessageCircle className="w-3 h-3 text-emerald-700" />
                  <span>واتساب</span>
                </a>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={skill.status}
                  onChange={(e) => updateSkillStatus(skill.id, e.target.value as any)}
                  className="flex-1 text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-xl px-2 py-1.5 focus:outline-none"
                >
                  <option value="قيد الانتظار">قيد الانتظار</option>
                  <option value="تم التواصل">تم التواصل للتنسيق</option>
                  <option value="نشط">نشط ومشارك في الفعاليات</option>
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
