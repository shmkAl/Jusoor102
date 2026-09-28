import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  CalendarCheck, 
  Clock, 
  MapPin, 
  Users, 
  Bell, 
  BellRing, 
  Share2, 
  Download, 
  ExternalLink, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Building, 
  Trash2, 
  X, 
  ChevronDown, 
  CalendarDays,
  Ticket,
  Copy,
  Check,
  Info,
  CalendarPlus,
  Compass,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PartnershipEvent, PartnershipEventType, ReminderTiming, UserEventReminder } from '../types';

export const InteractiveCalendar: React.FC = () => {
  const { 
    events, 
    userReminders, 
    addEventReminder, 
    removeEventReminder, 
    hasEventReminder, 
    getEventReminder,
    registerForEvent, 
    unregisterFromEvent, 
    hasRegisteredForEvent,
    addPartnershipEvent,
    deletePartnershipEvent,
    userRole,
    hasPermission,
    currentUser,
    isParentLoggedIn,
    openLoginModal
  } = useApp();

  // Navigation & Filtering State
  const [selectedMonthDate, setSelectedMonthDate] = useState<Date>(() => new Date(2026, 9, 1)); // October 2026 default
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'calendar' | 'cards' | 'timeline'>('calendar');

  // Modals state
  const [selectedEventForDetail, setSelectedEventForDetail] = useState<PartnershipEvent | null>(null);
  const [selectedEventForReminder, setSelectedEventForReminder] = useState<PartnershipEvent | null>(null);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [copiedEventId, setCopiedEventId] = useState<string | null>(null);

  // Permission check for coordinator or supervisor
  const canManageEvents = userRole === 'coordinator' || hasPermission('manage_announcements');

  // Calendar matrix calculations
  const year = selectedMonthDate.getFullYear();
  const month = selectedMonthDate.getMonth();

  const monthNamesArabic = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  const hijriMonthEquivalents: Record<number, string> = {
    8: 'ربيع الأول 1448هـ',   // September
    9: 'ربيع الآخر 1448هـ',   // October
    10: 'جمادى الأولى 1448هـ', // November
    11: 'جمادى الآخرة 1448هـ'  // December
  };

  const daysOfWeek = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  // Days in month
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  // Previous month trailing days
  const prevMonthTotalDays = new Date(year, month, 0).getDate();

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean; hasEvents: boolean; eventList: PartnershipEvent[] }[] = [];

    // Preceding padding days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const prevMonth = month === 0 ? 11 : month - 1;
      const prevYear = month === 0 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        hasEvents: dayEvents.length > 0,
        eventList: dayEvents
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: true,
        hasEvents: dayEvents.length > 0,
        eventList: dayEvents
      });
    }

    // Trailing days to round up to multiple of 7
    const remaining = (7 - (days.length % 7)) % 7;
    for (let d = 1; d <= remaining; d++) {
      const nextMonth = month === 11 ? 0 : month + 1;
      const nextYear = month === 11 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayEvents = events.filter(e => e.date === dateStr);
      days.push({
        dateStr,
        dayNum: d,
        isCurrentMonth: false,
        hasEvents: dayEvents.length > 0,
        eventList: dayEvents
      });
    }

    return days;
  }, [year, month, events, firstDayOfMonth, totalDaysInMonth, prevMonthTotalDays]);

  // Navigate months
  const handlePrevMonth = () => {
    setSelectedMonthDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setSelectedMonthDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const handleCurrentMonth = () => {
    setSelectedMonthDate(new Date(2026, 9, 1));
    setSelectedDay(null);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(evt => {
      // Category filter
      if (activeCategory === 'my_reminders') {
        if (!hasEventReminder(evt.id)) return false;
      } else if (activeCategory !== 'all' && evt.type !== activeCategory) {
        return false;
      }

      // Day filter if a day is clicked in calendar view
      if (selectedDay && evt.date !== selectedDay) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesDesc = evt.description.toLowerCase().includes(q);
        const matchesLoc = evt.location.toLowerCase().includes(q);
        const matchesAudience = evt.targetAudience.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesLoc || matchesAudience;
      }

      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [events, activeCategory, selectedDay, searchQuery, hasEventReminder]);

  // Category counts
  const totalRemindersCount = useMemo(() => {
    return Object.keys(userReminders).length;
  }, [userReminders]);

  const meetingsCount = useMemo(() => {
    return events.filter(e => e.type === 'meeting').length;
  }, [events]);

  const schoolEventsCount = useMemo(() => {
    return events.filter(e => e.type === 'school_event' || e.type === 'open_day').length;
  }, [events]);

  const workshopsCount = useMemo(() => {
    return events.filter(e => e.type === 'workshop').length;
  }, [events]);

  // Category styling helper
  const getCategoryMeta = (type: PartnershipEventType) => {
    switch (type) {
      case 'meeting':
        return {
          label: 'اجتماع أولياء الأمور',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-600',
          color: 'emerald'
        };
      case 'school_event':
        return {
          label: 'فعالية مدرسية',
          badgeClass: 'bg-teal-100 text-teal-800 border-teal-200',
          dotClass: 'bg-teal-500',
          color: 'teal'
        };
      case 'workshop':
        return {
          label: 'ورشة تدريبية',
          badgeClass: 'bg-indigo-100 text-indigo-800 border-indigo-200',
          dotClass: 'bg-indigo-500',
          color: 'indigo'
        };
      case 'council':
        return {
          label: 'مجلس الأسرة',
          badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
          dotClass: 'bg-amber-500',
          color: 'amber'
        };
      case 'open_day':
        return {
          label: 'اليوم المفتوح',
          badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dotClass: 'bg-emerald-500',
          color: 'emerald'
        };
      default:
        return {
          label: 'فعالية شراكة',
          badgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
          dotClass: 'bg-slate-500',
          color: 'slate'
        };
    }
  };

  // Google Calendar URL generator
  const getGoogleCalendarUrl = (event: PartnershipEvent) => {
    const title = encodeURIComponent(event.title + ' | الثانوية 102 للبنات');
    const details = encodeURIComponent(`${event.description}\n\nالموقع: ${event.location}\nالمنظم: ${event.organizer}`);
    const location = encodeURIComponent(event.location);
    
    // Parse date (approximate slot 09:00 to 12:00)
    const cleanDate = event.date.replace(/-/g, '');
    const startTime = `${cleanDate}T060000Z`; // UTC approx for 09:00 Riyadh (UTC+3)
    const endTime = `${cleanDate}T090000Z`;
    
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  };

  // Generate and download .ics iCalendar file
  const downloadIcsFile = (event: PartnershipEvent) => {
    const cleanDate = event.date.replace(/-/g, '');
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Thanaweya 102 Jeddah//Partnership Calendar//AR',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:evt-${event.id}@sharakotna.sec102`,
      `DTSTAMP:${cleanDate}T060000Z`,
      `DTSTART:${cleanDate}T060000Z`,
      `DTEND:${cleanDate}T090000Z`,
      `SUMMARY:${event.title} - الثانوية 102`,
      `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
      `LOCATION:${event.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy share message
  const copyEventShare = (event: PartnershipEvent) => {
    const text = `📅 دعوة لحضور: ${event.title}\n🗓️ التاريخ: ${event.date} (${event.hijriDate})\n⏰ الوقت: ${event.time}\n📍 المكان: ${event.location}\nالمدرسة الثانوية 102 للبنات بجدة - بوابة الشراكة المجتمعية`;
    navigator.clipboard.writeText(text);
    setCopiedEventId(event.id);
    setTimeout(() => setCopiedEventId(null), 2500);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
      {/* Hero Header Section */}
      <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-emerald-950 text-white rounded-3xl p-6 sm:p-9 border border-emerald-800 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>التقويم السنوي المعتمد 1448هـ</span>
              </span>
              <span className="text-xs text-emerald-200/80">المدرسة الثانوية 102 للبنات بجدة</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white font-display tracking-tight flex items-center gap-3">
              <CalendarDays className="w-9 h-9 text-emerald-400 shrink-0" />
              <span>التقويم التفاعلي للشراكات</span>
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              جدول الفعاليات المدرسية واجتماعات أولياء الأمور القادمة، مع خاصية تفعيل التذكيرات الذكية وإضافة المواعيد لتقويم هاتفك لتظلي دائمًا على تواصل.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveCategory('my_reminders');
                setSelectedDay(null);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                activeCategory === 'my_reminders'
                  ? 'bg-amber-400 text-slate-950 font-black'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}
            >
              <BellRing className={`w-4 h-4 ${activeCategory === 'my_reminders' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>تذكيراتي المفعلة ({totalRemindersCount})</span>
            </button>

            {canManageEvents && (
              <button
                onClick={() => setIsAddEventModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all cursor-pointer hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>إضافة فعالية جديدة للتقويم</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Highlights Counters Ribbon */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-white font-display">
              {events.length}
            </div>
            <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
              إجمالي فعاليات الفصل
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-display">
              {meetingsCount}
            </div>
            <div className="text-[11px] text-emerald-200/80 font-medium mt-0.5">
              اجتماعات أولياء الأمور
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-teal-300 font-display">
              {schoolEventsCount}
            </div>
            <div className="text-[11px] text-teal-200/80 font-medium mt-0.5">
              فعاليات وأنشطة مدرسية
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center">
            <div className="text-xl sm:text-2xl font-black text-amber-300 font-display">
              {totalRemindersCount}
            </div>
            <div className="text-[11px] text-amber-200/80 font-medium mt-0.5">
              تذكيرات مشتركة مسجلة
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters, Views, and Search */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl w-fit">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>التقويم الشهري</span>
            </button>

            <button
              onClick={() => setViewMode('cards')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>البطاقات المفصلة ({filteredEvents.length})</span>
            </button>

            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>الجدول الزمني</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحثي عن فعالية، اجتماع، ورشة، أو موقع..."
              className="w-full pr-10 pl-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
          <button
            onClick={() => {
              setActiveCategory('all');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === 'all' && !selectedDay
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            كافة الفعاليات ({events.length})
          </button>

          <button
            onClick={() => {
              setActiveCategory('meeting');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'meeting'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <span>👥 اجتماعات أولياء الأمور ({meetingsCount})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('school_event');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'school_event'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            <span>🎪 فعاليات وأنشطة مدرسية ({schoolEventsCount})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('workshop');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'workshop'
                ? 'bg-indigo-700 text-white shadow-xs'
                : 'bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            <span>💡 الورش والتدريب ({workshopsCount})</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('council');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'council'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>🏛️ جلسات مجلس الأسرة</span>
          </button>

          <button
            onClick={() => {
              setActiveCategory('my_reminders');
              setSelectedDay(null);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
              activeCategory === 'my_reminders'
                ? 'bg-amber-500 text-slate-950 shadow-xs font-black'
                : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100'
            }`}
          >
            <BellRing className="w-3.5 h-3.5 text-amber-600" />
            <span>تذكيراتي المفعلة ({totalRemindersCount})</span>
          </button>

          {selectedDay && (
            <div className="flex items-center gap-1.5 bg-emerald-100 text-emerald-900 px-3 py-1 rounded-xl text-xs font-bold shrink-0 border border-emerald-300">
              <span>تاريخ محدد: {selectedDay}</span>
              <button
                onClick={() => setSelectedDay(null)}
                className="hover:text-rose-600 transition-colors cursor-pointer"
                title="إلغاء تصفية اليوم"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* VIEW 1: MONTHLY CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-5 sm:p-7">
          {/* Month Header Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <CalendarIcon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display flex items-center gap-2">
                  <span>شهر {monthNamesArabic[month]} {year}م</span>
                  <span className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    {hijriMonthEquivalents[month] || '1448هـ'}
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  انقري على أي يوم به فعالية لاستعراض تفاصيلها وتفعيل التذكير الفوري
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="الشهر السابق"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleCurrentMonth}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                الشهر الحالي
              </button>

              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="الشهر القادم"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Days Grid */}
          <div className="space-y-2">
            {/* Weekdays Headers */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-xs font-black text-slate-500 uppercase tracking-wider py-1 border-b border-slate-100">
              {daysOfWeek.map((dayName, idx) => (
                <div key={idx} className="py-1">
                  <span className="hidden sm:inline">{dayName}</span>
                  <span className="sm:hidden">{dayName.substring(0, 3)}</span>
                </div>
              ))}
            </div>

            {/* Calendar Cells */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {calendarDays.map((cell, idx) => {
                const isSelected = selectedDay === cell.dateStr;
                const isToday = cell.dateStr === '2026-09-27' || cell.dateStr === new Date().toISOString().split('T')[0];

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      if (cell.hasEvents) {
                        setSelectedDay(isSelected ? null : cell.dateStr);
                      }
                    }}
                    className={`min-h-[75px] sm:min-h-[105px] p-2 rounded-2xl border transition-all flex flex-col justify-between ${
                      cell.isCurrentMonth
                        ? 'bg-white text-slate-900 border-slate-200/80 hover:border-emerald-400'
                        : 'bg-slate-50/60 text-slate-400 border-slate-100'
                    } ${
                      cell.hasEvents ? 'cursor-pointer hover:shadow-md' : 'cursor-default'
                    } ${
                      isSelected ? 'ring-2 ring-emerald-500 bg-emerald-50/50 border-emerald-500' : ''
                    } ${
                      isToday ? 'bg-amber-50/60 border-amber-300' : ''
                    }`}
                  >
                    {/* Day number & indicators */}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                        isToday 
                          ? 'bg-amber-500 text-white font-black' 
                          : isSelected 
                            ? 'bg-emerald-600 text-white' 
                            : 'text-slate-700'
                      }`}>
                        {cell.dayNum}
                      </span>

                      {cell.hasEvents && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {cell.eventList.length}
                        </span>
                      )}
                    </div>

                    {/* Events chips inside day cell */}
                    <div className="mt-1 space-y-1 overflow-hidden">
                      {cell.eventList.slice(0, 2).map((ev) => {
                        const meta = getCategoryMeta(ev.type);
                        const hasReminder = hasEventReminder(ev.id);
                        return (
                          <div
                            key={ev.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventForDetail(ev);
                            }}
                            className={`text-[10px] sm:text-[11px] font-bold truncate px-1.5 py-0.5 rounded-md flex items-center justify-between gap-1 shadow-2xs ${meta.badgeClass} hover:opacity-90`}
                            title={ev.title}
                          >
                            <span className="truncate">{ev.title}</span>
                            {hasReminder && (
                              <Bell className="w-2.5 h-2.5 text-amber-600 shrink-0 fill-amber-500" />
                            )}
                          </div>
                        );
                      })}
                      {cell.eventList.length > 2 && (
                        <div className="text-[9px] text-slate-500 font-bold text-center">
                          +{cell.eventList.length - 2} المزيد
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FILTERED EVENTS SECTION (Used in all views or below calendar) */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-slate-900 font-display">
              {selectedDay ? `فعاليات تاريخ: ${selectedDay}` : 'قائمة الفعاليات والاجتماعات'}
            </h3>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full">
              {filteredEvents.length} فعالية
            </span>
          </div>

          {selectedDay && (
            <button
              onClick={() => setSelectedDay(null)}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>عرض كافة فعاليات الشهر ←</span>
            </button>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-slate-800 text-base">لا توجد فعاليات مطابقة للبحث أو التصفية الحالية</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              جربي إزالة تصفية اليوم أو تغيير التصنيف المختار لعرض باقي الفعاليات والاجتماعات المجدولة.
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSelectedDay(null);
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const meta = getCategoryMeta(evt.type);
              const isReminderActive = hasEventReminder(evt.id);
              const activeReminder = getEventReminder(evt.id);
              const isRegistered = hasRegisteredForEvent(evt.id);

              return (
                <div
                  key={evt.id}
                  className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Cover or Top Banner */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {evt.coverImage ? (
                      <img
                        src={evt.coverImage}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-teal-900 flex items-center justify-center">
                        <CalendarIcon className="w-12 h-12 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

                    {/* Category badge */}
                    <div className="absolute top-3.5 right-3.5">
                      <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-xs border ${meta.badgeClass}`}>
                        {meta.label}
                      </span>
                    </div>

                    {/* Online vs In-School badge */}
                    <div className="absolute top-3.5 left-3.5">
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs bg-slate-900/80 text-white border border-white/20 flex items-center gap-1">
                        {evt.isOnline ? (
                          <>
                            <Video className="w-3 h-3 text-sky-400" />
                            <span>عن بُعد</span>
                          </>
                        ) : (
                          <>
                            <Building className="w-3 h-3 text-emerald-400" />
                            <span>حضوري</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Date Ribbon on bottom of cover */}
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-white text-xs font-bold">
                      <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                        <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{evt.date}</span>
                        <span className="text-white/60">({evt.hijriDate})</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <h4 
                        onClick={() => setSelectedEventForDetail(evt)}
                        className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer leading-snug font-display"
                      >
                        {evt.title}
                      </h4>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Details specs */}
                      <div className="space-y-1.5 pt-1 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{evt.time}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{evt.targetAudience}</span>
                        </div>
                      </div>

                      {/* Registration / Seats indicator if applicable */}
                      {evt.seatsTotal && (
                        <div className="pt-2 space-y-1">
                          <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium">
                            <span>المقاعد المحجوزة:</span>
                            <span className="font-bold text-emerald-800">
                              {evt.seatsRegistered || 0} من {evt.seatsTotal}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-1.5 rounded-full transition-all"
                              style={{ width: `${Math.min(100, Math.round(((evt.seatsRegistered || 0) / evt.seatsTotal) * 100))}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Bar (Reminder, RSVP, Details) */}
                    <div className="pt-4 border-t border-slate-100 space-y-2.5">
                      {/* Reminder Toggle Button */}
                      <div className="flex items-center gap-2">
                        {isReminderActive ? (
                          <button
                            onClick={() => removeEventReminder(evt.id)}
                            className="flex-1 py-2 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            title="إلغاء التذكير"
                          >
                            <BellRing className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                            <span>مفعّل التذكير 🔔</span>
                            <span className="text-[10px] text-amber-700 bg-amber-200 px-1.5 py-0.2 rounded">
                              إلغاء
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedEventForReminder(evt)}
                            className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold text-xs border border-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Bell className="w-3.5 h-3.5 text-emerald-600" />
                            <span>تذكيري بالموعد 🔔</span>
                          </button>
                        )}

                        {/* RSVP / Register Seat Button */}
                        {evt.requiresRegistration && (
                          <button
                            onClick={() => {
                              if (!isParentLoggedIn) {
                                openLoginModal('سجّلي دخولك لحجز مقعدك وتأكيد الحضور في الفعالية');
                                return;
                              }
                              if (isRegistered) {
                                unregisterFromEvent(evt.id);
                              } else {
                                registerForEvent(evt.id);
                              }
                            }}
                            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center gap-1 transition-all cursor-pointer ${
                              isRegistered
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                            }`}
                            title={isRegistered ? 'إلغاء الحجز' : 'تأكيد الحضور وحجز مقعد'}
                          >
                            <Ticket className="w-3.5 h-3.5" />
                            <span>{isRegistered ? 'محجوز ✓' : 'حجز مقعد'}</span>
                          </button>
                        )}
                      </div>

                      {/* Secondary quick actions: Google Cal, ICS, Share, Detail */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          onClick={() => setSelectedEventForDetail(evt)}
                          className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <span>عرض الأجندة والتفاصيل ←</span>
                        </button>

                        <div className="flex items-center gap-1">
                          <a
                            href={getGoogleCalendarUrl(evt)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="إضافة إلى Google Calendar"
                          >
                            <CalendarPlus className="w-4 h-4" />
                          </a>

                          <button
                            onClick={() => downloadIcsFile(evt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="تحميل ملف التقويم (.ics) للآيفون والكمبيوتر"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => copyEventShare(evt)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="نسخ ومشاركة الدعوة"
                          >
                            {copiedEventId === evt.id ? (
                              <Check className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <Share2 className="w-4 h-4" />
                            )}
                          </button>

                          {canManageEvents && (
                            <button
                              onClick={() => {
                                if (window.confirm(`هل أنتِ متأكدة من حذف فعالية "${evt.title}" من التقويم؟`)) {
                                  deletePartnershipEvent(evt.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="حذف الفعالية (صلاحية منسقة)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EVENT DETAIL MODAL */}
      {selectedEventForDetail && (
        <EventDetailModal
          event={selectedEventForDetail}
          onClose={() => setSelectedEventForDetail(null)}
          onOpenReminder={() => {
            setSelectedEventForReminder(selectedEventForDetail);
            setSelectedEventForDetail(null);
          }}
          isReminderActive={hasEventReminder(selectedEventForDetail.id)}
          isRegistered={hasRegisteredForEvent(selectedEventForDetail.id)}
          onToggleRegistration={() => {
            if (!isParentLoggedIn) {
              openLoginModal('سجّلي دخولك لحجز مقعدك وتأكيد الحضور في الفعالية');
              return;
            }
            if (hasRegisteredForEvent(selectedEventForDetail.id)) {
              unregisterFromEvent(selectedEventForDetail.id);
            } else {
              registerForEvent(selectedEventForDetail.id);
            }
          }}
          getGoogleCalendarUrl={getGoogleCalendarUrl}
          downloadIcsFile={downloadIcsFile}
          copyEventShare={copyEventShare}
          isCopied={copiedEventId === selectedEventForDetail.id}
          getCategoryMeta={getCategoryMeta}
        />
      )}

      {/* EVENT REMINDER MODAL */}
      {selectedEventForReminder && (
        <EventReminderModal
          event={selectedEventForReminder}
          onClose={() => setSelectedEventForReminder(null)}
          onSetReminder={(timing, options) => {
            addEventReminder(selectedEventForReminder.id, timing, options);
            setSelectedEventForReminder(null);
          }}
          currentUser={currentUser}
          getGoogleCalendarUrl={getGoogleCalendarUrl}
          downloadIcsFile={downloadIcsFile}
        />
      )}

      {/* ADD EVENT MODAL (FOR COORDINATOR & SUPERVISORS) */}
      {isAddEventModalOpen && (
        <AddEventModal
          onClose={() => setIsAddEventModalOpen(false)}
          onAddEvent={(newEvent) => {
            addPartnershipEvent(newEvent);
            setIsAddEventModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ==========================================
// SUBCOMPONENT: Event Detail Modal
// ==========================================
interface EventDetailModalProps {
  event: PartnershipEvent;
  onClose: () => void;
  onOpenReminder: () => void;
  isReminderActive: boolean;
  isRegistered: boolean;
  onToggleRegistration: () => void;
  getGoogleCalendarUrl: (event: PartnershipEvent) => string;
  downloadIcsFile: (event: PartnershipEvent) => void;
  copyEventShare: (event: PartnershipEvent) => void;
  isCopied: boolean;
  getCategoryMeta: (type: PartnershipEventType) => { label: string; badgeClass: string };
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenReminder,
  isReminderActive,
  isRegistered,
  onToggleRegistration,
  getGoogleCalendarUrl,
  downloadIcsFile,
  copyEventShare,
  isCopied,
  getCategoryMeta
}) => {
  const meta = getCategoryMeta(event.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header with Cover image */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900 shrink-0">
          {event.coverImage ? (
            <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-900 to-teal-900"></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute top-4 right-4">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${meta.badgeClass}`}>
              {meta.label}
            </span>
          </div>

          <div className="absolute bottom-4 right-4 left-4 space-y-1">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold">
              <span>{event.date}</span>
              <span>•</span>
              <span>{event.hijriDate}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white font-display leading-snug">
              {event.title}
            </h3>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Key Specs Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">الوقت</span>
                <span className="font-bold text-slate-900">{event.time}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">المكان</span>
                <span className="font-bold text-slate-900">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">الفئة المستهدفة</span>
                <span className="font-bold text-slate-900">{event.targetAudience}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-slate-500 block text-[11px]">الجهة المنظمة</span>
                <span className="font-bold text-slate-900">{event.organizer}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 font-display">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>نبذة عن الفعالية والهدف منها</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Agenda items */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5 font-display">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>محاور وبرنامج اللقاء (الأجندة)</span>
              </h4>
              <ul className="space-y-2">
                {event.agenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Online Link if available */}
          {event.isOnline && event.onlineMeetingUrl && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Video className="w-5 h-5 text-sky-600 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-sky-950">لقاء افتراضي مباشر (عن بُعد)</h5>
                  <p className="text-[11px] text-sky-700">يمكنكِ الانضمام مباشرة وقت اللقاء عبر المنصة</p>
                </div>
              </div>
              <a
                href={event.onlineMeetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 shrink-0"
              >
                <span>رابط الدخول المباشر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Additional Notes */}
          {event.notes && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{event.notes}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenReminder}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${
                isReminderActive
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 font-black'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{isReminderActive ? 'مفعّل التذكير (تعديل 🔔)' : 'تفعيل التذكير الذكي 🔔'}</span>
            </button>

            {event.requiresRegistration && (
              <button
                onClick={onToggleRegistration}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isRegistered
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span>{isRegistered ? 'تم حجز مقعدك ✓' : 'تأكيد الحضور (حجز مقعد)'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={getGoogleCalendarUrl(event)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
              title="إضافة لتقويم Google"
            >
              <CalendarPlus className="w-4 h-4 text-emerald-600" />
            </a>

            <button
              onClick={() => downloadIcsFile(event)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="تحميل ملف .ics"
            >
              <Download className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              onClick={() => copyEventShare(event)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="نسخ الدعوة"
            >
              {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-emerald-600" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// SUBCOMPONENT: Event Reminder Modal
// ==========================================
interface EventReminderModalProps {
  event: PartnershipEvent;
  onClose: () => void;
  onSetReminder: (timing: ReminderTiming, options?: { notifyEmail?: string; notifyPhone?: string; reminderNote?: string }) => void;
  currentUser: { name: string; phone: string; email: string };
  getGoogleCalendarUrl: (event: PartnershipEvent) => string;
  downloadIcsFile: (event: PartnershipEvent) => void;
}

const EventReminderModal: React.FC<EventReminderModalProps> = ({
  event,
  onClose,
  onSetReminder,
  currentUser,
  getGoogleCalendarUrl,
  downloadIcsFile
}) => {
  const [selectedTiming, setSelectedTiming] = useState<ReminderTiming>('1_day_before');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [reminderNote, setReminderNote] = useState('');
  const [isCopiedText, setIsCopiedText] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSetReminder(selectedTiming, {
      notifyEmail: email,
      notifyPhone: phone,
      reminderNote: reminderNote.trim() || undefined
    });
  };

  const copySimulatedWhatsApp = () => {
    const text = `تذكير بموعد فعالية مدرسية 🔔\nنذكركِ بحضور: ${event.title}\nالموعد: ${event.date} (${event.hijriDate}) الساعة ${event.time}\nالمكان: ${event.location}\nشراكتنا أثرها أفضل لبناتنا - الثانوية 102 للبنات بجدة`;
    navigator.clipboard.writeText(text);
    setIsCopiedText(true);
    setTimeout(() => setIsCopiedText(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shadow-md shrink-0">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs bg-emerald-700/60 px-2 py-0.5 rounded-full text-emerald-200 font-bold border border-emerald-500/30">
                جدولة التذكير الذكي
              </span>
              <h3 className="text-lg font-black text-white font-display mt-0.5">
                تفعيل تذكير بموعد الفعالية
              </h3>
            </div>
          </div>
        </div>

        {/* Event preview */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs flex items-center justify-between">
          <div>
            <span className="font-bold text-slate-900 block text-sm">{event.title}</span>
            <span className="text-slate-500">🗓️ {event.date} ({event.hijriDate}) • ⏰ {event.time}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-1 rounded-md shrink-0">
            {event.location.substring(0, 20)}...
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Timing Choices */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              متى تودين استلام التنبيه والتذكير؟
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                selectedTiming === '1_day_before' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="timing"
                  checked={selectedTiming === '1_day_before'}
                  onChange={() => setSelectedTiming('1_day_before')}
                  className="accent-emerald-600"
                />
                <span>قبل يوم واحد من الموعد</span>
              </label>

              <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                selectedTiming === '2_hours_before' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="timing"
                  checked={selectedTiming === '2_hours_before'}
                  onChange={() => setSelectedTiming('2_hours_before')}
                  className="accent-emerald-600"
                />
                <span>قبل ساعتين من البدء</span>
              </label>

              <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                selectedTiming === 'event_morning' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="timing"
                  checked={selectedTiming === 'event_morning'}
                  onChange={() => setSelectedTiming('event_morning')}
                  className="accent-emerald-600"
                />
                <span>صباح يوم الفعالية (8:00 ص)</span>
              </label>

              <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
                selectedTiming === '15_mins_before' 
                  ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}>
                <input
                  type="radio"
                  name="timing"
                  checked={selectedTiming === '15_mins_before'}
                  onChange={() => setSelectedTiming('15_mins_before')}
                  className="accent-emerald-600"
                />
                <span>قبل الموعد بـ 15 دقيقة</span>
              </label>
            </div>
          </div>

          {/* Contact confirmation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                رقم الجوال لتنبيه SMS
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XXXXXXXX"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              ملاحظة شخصية لكِ مع التذكير (اختياري)
            </label>
            <input
              type="text"
              value={reminderNote}
              onChange={(e) => setReminderNote(e.target.value)}
              placeholder="مثال: إحضار دفتر الملاحظات، مرافقة سارة..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Direct Calendar Export Shortcuts */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 block">
              أو أضيفي الموعد فوراً لتقويمك المفضل:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={getGoogleCalendarUrl(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <CalendarPlus className="w-3.5 h-3.5 text-blue-600" />
                <span>تقويم Google</span>
              </a>

              <button
                type="button"
                onClick={() => downloadIcsFile(event)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>ملف آيفون/أوتلوك (.ics)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={copySimulatedWhatsApp}
              className="w-full py-1.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              {isCopiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isCopiedText ? 'تم نسخ نص التذكير بنجاح ✓' : 'نسخ نص تذكيري للواتساب أو الرسائل'}</span>
            </button>
          </div>

          {/* Submit */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              إلغاء
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BellRing className="w-4 h-4" />
              <span>تأكيد وجدولة التذكير 🔔</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// SUBCOMPONENT: Add Event Modal
// ==========================================
interface AddEventModalProps {
  onClose: () => void;
  onAddEvent: (event: Omit<PartnershipEvent, 'id' | 'remindersCount'>) => void;
}

const AddEventModal: React.FC<AddEventModalProps> = ({ onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PartnershipEventType>('meeting');
  const [date, setDate] = useState('2026-10-15');
  const [hijriDate, setHijriDate] = useState('4 ربيع الآخر 1448هـ');
  const [time, setTime] = useState('09:30 ص - 12:00 م');
  const [location, setLocation] = useState('مسرح الثانوية 102 الرئيسي');
  const [isOnline, setIsOnline] = useState(false);
  const [onlineMeetingUrl, setOnlineMeetingUrl] = useState('');
  const [targetAudience, setTargetAudience] = useState('جميع أولياء الأمور والطالبات');
  const [organizer, setOrganizer] = useState('منسقة الشراكة المجتمعية (أ. شهد العتيبي)');
  const [seatsTotal, setSeatsTotal] = useState<number>(150);
  const [requiresRegistration, setRequiresRegistration] = useState(true);
  const [description, setDescription] = useState('');
  const [agendaInput, setAgendaInput] = useState('الترحيب والافتتاح\nعرض خطة العمل والمناقشة\nحلقة نقاش وتوصيات ختامية');
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('يرجى كتابة عنوان الفعالية والوصف.');
      return;
    }

    const agenda = agendaInput
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    onAddEvent({
      title: title.trim(),
      type,
      date,
      hijriDate: hijriDate.trim() || '1448هـ',
      time: time.trim(),
      location: location.trim(),
      isOnline,
      onlineMeetingUrl: isOnline && onlineMeetingUrl.trim() ? onlineMeetingUrl.trim() : undefined,
      targetAudience: targetAudience.trim(),
      organizer: organizer.trim(),
      seatsTotal: Number(seatsTotal) || 100,
      seatsRegistered: 0,
      requiresRegistration,
      description: description.trim(),
      agenda,
      coverImage: coverImage.trim() || undefined,
      isImportant: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0">
              <Plus className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-xs text-emerald-300 font-bold">صلاحية منسقة الشراكة المعتمدة</span>
              <h3 className="text-lg font-black text-white font-display mt-0.5">
                إضافة فعالية جديدة للتقويم التفاعلي
              </h3>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              عنوان الفعالية أو الاجتماع *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: اجتماع الجمعية العمومية، ورشة الذكاء الاصطناعي..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">نوع الفعالية</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as PartnershipEventType)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="meeting">اجتماع أولياء الأمور</option>
                <option value="school_event">فعالية مدرسية / معرض</option>
                <option value="workshop">ورشة عمل وتدريب</option>
                <option value="council">جلسة مجلس الأسرة</option>
                <option value="open_day">اليوم المفتوح للشراكة</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">التاريخ الميلادي</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">التاريخ الهجري</label>
              <input
                type="text"
                value={hijriDate}
                onChange={(e) => setHijriDate(e.target.value)}
                placeholder="مثال: 4 ربيع الآخر 1448هـ"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">الوقت</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="مثال: 09:30 ص - 12:00 م"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">المكان / المقر</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="مثال: مسرح المدرسة الرئيسي"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">إجمالي المقاعد المتاحة</label>
              <input
                type="number"
                value={seatsTotal}
                onChange={(e) => setSeatsTotal(Number(e.target.value))}
                min={5}
                max={1000}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Online Toggle */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
              <input
                type="checkbox"
                checked={isOnline}
                onChange={(e) => setIsOnline(e.target.checked)}
                className="accent-emerald-600 rounded"
              />
              <span>الفعالية تتضمن بثاً أو حضوراً افتراضياً (عن بُعد)</span>
            </label>

            {isOnline && (
              <input
                type="url"
                value={onlineMeetingUrl}
                onChange={(e) => setOnlineMeetingUrl(e.target.value)}
                placeholder="رابط منصة مدرستي أو Teams (https://...)"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">الفئة المستهدفة والمنظم</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="المستهدفون: أولياء الأمور..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
              <input
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                placeholder="الجهة المنظمة"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1">
              نبذة وشرح الفعالية *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="اكتبي ملخصاً وافياً عن الفعالية..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              محاور الأجندة (سطر لكل محور)
            </label>
            <textarea
              rows={3}
              value={agendaInput}
              onChange={(e) => setAgendaInput(e.target.value)}
              placeholder="اكتبي كل بند في سطر مستقل..."
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-[11px]"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>إدراج الفعالية في التقويم</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
