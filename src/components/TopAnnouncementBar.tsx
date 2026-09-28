import React, { useState } from 'react';
import { 
  Megaphone, 
  ChevronRight, 
  ChevronLeft, 
  Pause, 
  Play, 
  X, 
  ExternalLink, 
  Calendar, 
  Sparkles, 
  Image as ImageIcon,
  Plus,
  Layers,
  ChevronDown,
  ChevronUp,
  Flame,
  ArrowUpRight
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';
import { SchoolAnnouncement, AnnouncementPriority } from '../types';

export const TopAnnouncementBar: React.FC = () => {
  const { 
    announcements, 
    isAnnouncementBarOpen, 
    setIsAnnouncementBarOpen,
    setSelectedAnnouncement,
    setIsAllAnnouncementsOpen,
    setIsAddAnnouncementOpen,
    setActiveTab
  } = useApp();

  const [isTickerPaused, setIsTickerPaused] = useState(false);
  const [showTopicsShelf, setShowTopicsShelf] = useState(false);

  // If closed, render a discreet restore trigger
  if (!isAnnouncementBarOpen) {
    return (
      <aside 
        aria-label="شريط الإعلانات والمواضيع المصغّر"
        className="bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 text-white text-xs border-b border-emerald-700/40 py-1.5 px-4 shadow-xs"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <button
            onClick={() => setIsAnnouncementBarOpen(true)}
            className="flex items-center gap-2 hover:text-emerald-200 transition-colors group cursor-pointer text-right flex-1 truncate"
            title="إظهار الشريط الإخباري والمواضيع المصورة"
          >
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-bold text-[11px] border border-emerald-400/30 shrink-0">
              <Megaphone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>شريط إعلانات ومواضيع المدرسة ({announcements.length})</span>
            </span>
            <span className="text-slate-300 truncate hidden sm:inline text-xs">
              انقر لإظهار الشريط الإخباري المتحرك والمواضيع المصورة للمدرسة الثانوية 102
            </span>
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsAddAnnouncementOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
              title="إضافة إعلان أو موضوع مصور"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة موضوع</span>
            </button>
            <button
              onClick={() => setIsAnnouncementBarOpen(true)}
              className="text-emerald-300 hover:text-white p-1 rounded transition-colors cursor-pointer text-xs flex items-center gap-1"
            >
              <span>فتح الشريط</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  const getPriorityBadge = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'عاجل':
        return {
          bg: 'bg-rose-600 text-white',
          border: 'border-rose-400/40',
          dot: 'bg-rose-300',
          ring: 'ring-rose-400/30'
        };
      case 'هام':
        return {
          bg: 'bg-amber-500 text-slate-950',
          border: 'border-amber-300/60',
          dot: 'bg-amber-900',
          ring: 'ring-amber-400/30'
        };
      case 'دعوة':
        return {
          bg: 'bg-emerald-600 text-white',
          border: 'border-emerald-400/40',
          dot: 'bg-emerald-200',
          ring: 'ring-emerald-400/30'
        };
      case 'فعالية':
        return {
          bg: 'bg-blue-600 text-white',
          border: 'border-blue-400/40',
          dot: 'bg-blue-200',
          ring: 'ring-blue-400/30'
        };
      default:
        return {
          bg: 'bg-teal-600 text-white',
          border: 'border-teal-400/40',
          dot: 'bg-teal-200',
          ring: 'ring-teal-400/30'
        };
    }
  };

  // Duplicate list to achieve continuous seamless loop ticker
  const tickerItems = [...announcements, ...announcements];

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white border-b border-emerald-700/50 shadow-md relative z-30 select-none">
      
      {/* 1. Main Ticker Row: Fixed Title Badge + Moving Tape + Quick Controls */}
      <div className="flex items-center justify-between h-11 px-2 sm:px-4 relative overflow-hidden">
        
        {/* Right Label: Live School Marquee Title Badge (pinned) */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-gradient-to-l from-emerald-950 via-emerald-950/95 to-transparent pl-3 pr-1 py-1">
          <div className="flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-700/90 text-emerald-100 text-xs font-bold px-2.5 py-1 rounded-xl border border-emerald-500/40 shadow-xs transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <Megaphone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="whitespace-nowrap font-display text-[12px]">شريط الأخبار والمواضيع</span>
          </div>
        </div>

        {/* Center: The Moving Marquee Ticker Track */}
        <div 
          className="flex-1 overflow-hidden relative mx-2 h-full flex items-center"
          onMouseEnter={() => setIsTickerPaused(true)}
          onMouseLeave={() => setIsTickerPaused(false)}
        >
          {/* Subtle gradient fades on edges */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-emerald-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-emerald-950 to-transparent z-10 pointer-events-none" />

          {/* Gliding Track */}
          <div 
            dir="ltr"
            className={`animate-ticker-continuous flex items-center gap-6 cursor-pointer ${
              isTickerPaused ? 'animate-ticker-paused' : ''
            }`}
          >
            {tickerItems.map((ann, idx) => {
              const badge = getPriorityBadge(ann.priority);
              return (
                <div
                  key={`${ann.id}-${idx}`}
                  dir="rtl"
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="group/item flex items-center gap-2.5 px-3 py-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-emerald-400/40 transition-all text-xs shrink-0 cursor-pointer shadow-xs"
                >
                  {/* Priority Tag */}
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${badge.bg} shrink-0 flex items-center gap-1`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                    <span>{ann.priority}</span>
                  </span>

                  {/* Thumbnail if image exists */}
                  {ann.imageUrl ? (
                    <div className="w-6 h-6 rounded-md overflow-hidden bg-slate-800 border border-white/20 shrink-0">
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title} 
                        className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-md bg-emerald-800/60 border border-emerald-400/30 flex items-center justify-center shrink-0 text-emerald-200">
                      <ImageIcon className="w-3.5 h-3.5" />
                    </div>
                  )}

                  {/* Title & Preview */}
                  <span className="font-bold text-white group-hover/item:text-emerald-200 transition-colors max-w-[280px] sm:max-w-md truncate">
                    {ann.title}
                  </span>

                  {/* Category / Date Tag */}
                  {ann.category && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 hidden md:inline shrink-0">
                      {ann.category}
                    </span>
                  )}

                  {/* Micro action prompt */}
                  <span className="text-emerald-300 text-[11px] group-hover/item:underline flex items-center gap-0.5 shrink-0">
                    <span>قراءة</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </span>

                  <span className="text-emerald-600/60 text-xs mr-2 font-black select-none">✦</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left: Quick Actions Toolbar */}
        <div className="flex items-center gap-1.5 shrink-0 z-10 bg-gradient-to-r from-emerald-950 via-emerald-950/95 to-transparent pr-3 pl-1 py-1">
          
          {/* Pause / Play ticker button */}
          <button
            onClick={() => setIsTickerPaused(!isTickerPaused)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title={isTickerPaused ? "تشغيل حركة الشريط" : "إيقاف مؤقت للحركة"}
          >
            {isTickerPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          {/* Toggle Photo Topics Shelf */}
          <button
            onClick={() => setShowTopicsShelf(!showTopicsShelf)}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
              showTopicsShelf 
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm' 
                : 'bg-white/10 hover:bg-white/20 text-emerald-100 border-white/15'
            }`}
            title="استعراض المواضيع المصورة في شريط بطاقات"
          >
            <ImageIcon className="w-3.5 h-3.5 text-amber-300 group-hover:text-amber-400" />
            <span className="hidden sm:inline">مواضيع مصورة</span>
            <span className="sm:hidden">المواضيع</span>
            {showTopicsShelf ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Add Topic / Announcement Button */}
          <button
            onClick={() => setIsAddAnnouncementOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            title="إضافة إعلان أو موضوع مصور جديد"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden md:inline">إضافة موضوع مصور</span>
            <span className="md:hidden">إضافة</span>
          </button>

          {/* All Announcements Modal Trigger */}
          <button
            onClick={() => setIsAllAnnouncementsOpen(true)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer hidden sm:flex items-center"
            title="لوحة كافة المواضيع والإعلانات"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Minimize Bar */}
          <button
            onClick={() => setIsAnnouncementBarOpen(false)}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-rose-500/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="إخفاء الشريط"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* 2. Visual Topics Shelf: Expandable Cards Carousel with High-Quality Cover Images */}
      {showTopicsShelf && (
        <div className="bg-slate-900/95 border-t border-emerald-500/30 p-4 animate-in slide-in-from-top-3 duration-200">
          <div className="max-w-7xl mx-auto">
            
            {/* Shelf Header */}
            <div className="flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 font-bold text-amber-300 font-display">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>المواضيع والإعلانات المصورة للثانوية 102 ({announcements.length})</span>
                </span>
                <span className="text-slate-400 hidden sm:inline text-[11px]">
                  • يمكنك النقر على أي موضوع لقراءة التفاصيل الكاملة، أو إضافة موضوع جديد بصورك الخاصة
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAddAnnouncementOpen(true)}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة موضوع بصورة</span>
                </button>
                <button
                  onClick={() => setIsAllAnnouncementsOpen(true)}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  عرض الجدول الشامل
                </button>
              </div>
            </div>

            {/* Horizontal Scrollable Cards Strip */}
            <div className="flex items-stretch gap-3.5 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
              
              {/* Quick Add Card Slot */}
              <div 
                onClick={() => setIsAddAnnouncementOpen(true)}
                className="w-56 shrink-0 rounded-2xl border-2 border-dashed border-emerald-500/40 hover:border-amber-400 bg-emerald-950/40 hover:bg-emerald-900/40 p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-300 flex items-center justify-center mb-2.5 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                  <Plus className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                  أضف موضوعاً مصوراً
                </h4>
                <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                  ارفع صورة من جهازك، أو اختر صورة جاهزة واكتب إعلانك
                </p>
              </div>

              {/* Announcement Topic Cards */}
              {announcements.map((ann) => {
                const badge = getPriorityBadge(ann.priority);
                return (
                  <div
                    key={ann.id}
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="w-72 shrink-0 bg-slate-800/90 hover:bg-slate-800 rounded-2xl border border-slate-700/80 hover:border-emerald-400/60 overflow-hidden shadow-lg hover:shadow-xl transition-all flex flex-col group cursor-pointer"
                  >
                    {/* Topic Image Banner */}
                    <div className="h-32 w-full relative overflow-hidden bg-slate-950">
                      {ann.imageUrl ? (
                        <img 
                          src={ann.imageUrl} 
                          alt={ann.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center text-emerald-300">
                          <ImageIcon className="w-8 h-8 opacity-40" />
                        </div>
                      )}
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.bg} shadow-md`}>
                          {ann.priority}
                        </span>
                        {ann.category && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                            {ann.category}
                          </span>
                        )}
                      </div>

                      {ann.date && (
                        <div className="absolute bottom-2 right-2.5 flex items-center gap-1 text-[10px] text-slate-300 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                          <Calendar className="w-3 h-3 text-amber-400" />
                          <span>{ann.date}</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2 leading-snug font-display mb-1.5">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                          {ann.summary}
                        </p>
                      </div>

                      {/* Footer Link */}
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 truncate max-w-[140px]">
                          {ann.targetAudience || 'المجتمع المدرسي'}
                        </span>
                        <span className="text-emerald-400 font-bold group-hover:text-emerald-300 flex items-center gap-1">
                          <span>قراءة المزيد</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
