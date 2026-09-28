import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  CheckCircle2, 
  HeartHandshake, 
  Star, 
  Clock, 
  FileText, 
  Building2,
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  AreaChart,
  Area
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ImpactDashboard: React.FC = () => {
  const { voices, proposals, initiatives, partnerSkills, partners } = useApp();
  const [selectedTerm, setSelectedTerm] = useState('الفصل الدراسي الثاني 1448هـ');

  // Sentiment Breakdown Data
  const sentimentData = [
    { name: 'إيجابي وداعم', value: 48, color: '#10B981' },
    { name: 'محايد واستفسارات', value: 22, color: '#3B82F6' },
    { name: 'يحتاج إلى تحسين', value: 20, color: '#F59E0B' },
    { name: 'ملاحظات عاجلة', value: 10, color: '#EF4444' },
  ];

  // Topics Frequency Data
  const topicsData = [
    { topic: 'التقنية والذكاء الاصطناعي', count: 35 },
    { topic: 'الأنشطة والمهارات', count: 28 },
    { topic: 'البيئة والمقصف', count: 22 },
    { topic: 'التواصل المدرسي', count: 18 },
    { topic: 'الأمن والسلامة', count: 14 },
    { topic: 'الإرشاد والقدرات', count: 12 },
  ];

  // Monthly Engagement Growth Trend
  const growthData = [
    { month: 'محرم', participants: 320, initiatives: 3 },
    { month: 'صفر', participants: 540, initiatives: 6 },
    { month: 'ربيع أول', participants: 780, initiatives: 10 },
    { month: 'ربيع ثاني', participants: 980, initiatives: 14 },
    { month: 'جمادى الأولى', participants: 1280, initiatives: 18 },
  ];

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <span>المؤشرات الاستراتيجية لقياس أثر الشراكة المجتمعية</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
          لوحة الأثر بالأرقام
        </h2>
        <p className="text-slate-600 text-base leading-relaxed">
          بيانات دقيقة ومؤشرات حية تعكس عمق التكامل بين المدرسة والأسرة ومستوى رضا المستفيدين وفق معايير وزارة التعليم ورؤية 2030.
        </p>
      </div>

      {/* Filter and Print Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">الفترة الزمنية:</span>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="الفصل الدراسي الثاني 1448هـ">الفصل الدراسي الثاني 1448هـ (الحالي)</option>
            <option value="الفصل الدراسي الأول 1448هـ">الفصل الدراسي الأول 1448هـ</option>
            <option value="العام الدراسي الكامل 1448هـ">العام الدراسي الكامل 1448هـ</option>
          </select>
        </div>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer className="w-4 h-4 text-slate-600" />
          <span>طباعة تقرير المؤشرات</span>
        </button>
      </div>

      {/* 6 Key Performance Indicators Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-10">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
            <Star className="w-5 h-5 fill-emerald-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">96.4%</span>
          <span className="text-[11px] text-slate-500 block font-medium">معدل الرضا العام</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-1">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">1,280</span>
          <span className="text-[11px] text-slate-500 block font-medium">طالبة مستفيدة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-1">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">{initiatives.length}</span>
          <span className="text-[11px] text-slate-500 block font-medium">مبادرات معتمدة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-1">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">450</span>
          <span className="text-[11px] text-slate-500 block font-medium">ساعة تطوعية</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">{partners.length}</span>
          <span className="text-[11px] text-slate-500 block font-medium">شراكات موقعة</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs text-center space-y-1">
          <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-1">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 font-display">&lt; 24h</span>
          <span className="text-[11px] text-slate-500 block font-medium">سرعة الاستجابة</span>
        </div>
      </div>

      {/* Visual Charts Grid (2 columns on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Sentiment Analysis Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              تحليل مشاعر ورضا أولياء الأمور
            </h3>
            <p className="text-xs text-slate-500">
              تصنيف ذكي لمشاركات وملاحظات أولياء الأمور
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'النسبة']}
                  contentStyle={{ direction: 'rtl', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {sentimentData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-700">{item.name}: <strong>{item.value}%</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Topics Distribution Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              أكثر الموضوعات والمجالات اهتمامًا
            </h3>
            <p className="text-xs text-slate-500">
              توزيع تكرار المقترحات حسب المجالات التربوية والتطويرية
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topicsData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="topic" type="category" tick={{ fontSize: 11 }} width={120} />
                <Tooltip
                  formatter={(value: any) => [`${value} مقترح`, 'التكرار']}
                  contentStyle={{ direction: 'rtl', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Growth Trend Over Time */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              منحنى نمو التفاعل والمستفيدات عبر الأشهر
            </h3>
            <p className="text-xs text-slate-500">
              تصاعد مستمر في عدد أولياء الأمور المتفاعلين والمبادرات المنفذة
            </p>
          </div>
          <span className="text-xs text-emerald-800 bg-emerald-50 font-bold px-3 py-1 rounded-full border border-emerald-200">
            نمو بنسبة +300% خلال الفصل
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={growthData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorParticipants" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <Tooltip
                formatter={(val: any) => [val, 'المستفيدات']}
                contentStyle={{ direction: 'rtl', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="participants" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorParticipants)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
