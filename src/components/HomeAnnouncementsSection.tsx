import React from 'react';
import { useApp } from '../context/AppContext';
import { AnnouncementPriority } from '../types';

export const HomeAnnouncementsSection: React.FC = () => {
  const { 
    announcements, 
    setSelectedAnnouncement,
    setIsAddAnnouncementOpen
  } = useApp();

  const getPriorityBadgeClass = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'عاجل':
        return 'bg-rose-600 text-white';
      case 'هام':
        return 'bg-amber-400 text-slate-950 font-bold';
      case 'دعوة':
        return 'bg-emerald-600 text-white font-medium';
      case 'فعالية':
        return 'bg-sky-600 text-white font-medium';
      default:
        return 'bg-teal-600 text-white font-medium';
    }
  };

  // Duplicate items twice to ensure a completely seamless, gap-free infinite loop
  const tickerItems = [...announcements, ...announcements];

  return (
    <div className="w-full my-6 select-none">
      {/* The Ticker Bar Container */}
      <div className="relative w-full bg-slate-950/90 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-xl backdrop-blur-md overflow-hidden flex items-center">
        
        {/* Pinned Title "جديد" at the side (No icons, pure clean design) */}
        <div className="shrink-0 z-20 flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md border border-emerald-400/30 mr-1 sm:mr-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 animate-ping"></span>
          <span className="font-black text-xs sm:text-sm tracking-wide font-display">
            جديد
          </span>
          <span className="text-[11px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-md">
            {announcements.length}
          </span>
        </div>

        {/* Continuous Left-to-Right Moving Track - Never stops, loops forever */}
        <div className="flex-1 overflow-hidden relative h-14 sm:h-16 flex items-center">
          {/* Subtle gradient edges */}
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-12 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />

          {/* Left-to-right moving track: transforms from -50% to 0% continuously without pause */}
          <div 
            dir="ltr"
            className="animate-ticker-ltr flex items-center gap-3 sm:gap-4 pointer-events-auto"
          >
            {tickerItems.map((ann, idx) => {
              const priorityClass = getPriorityBadgeClass(ann.priority);
              return (
                <div
                  key={`ann-window-${ann.id}-${idx}`}
                  dir="rtl"
                  onClick={() => setSelectedAnnouncement(ann)}
                  className="group flex items-center gap-2.5 sm:gap-3 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-amber-400/80 transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  {/* Announcement Photo Window */}
                  {ann.imageUrl ? (
                    <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg overflow-hidden bg-slate-800 border border-white/15 shrink-0">
                      <img 
                        src={ann.imageUrl} 
                        alt={ann.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-10 sm:w-14 sm:h-11 rounded-lg bg-emerald-950 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[10px] text-emerald-300 font-bold">
                      إعلان
                    </div>
                  )}

                  {/* Announcement Text Window */}
                  <div className="flex flex-col justify-center min-w-0 pr-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${priorityClass} shrink-0`}>
                        {ann.priority}
                      </span>
                      {ann.date && (
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {ann.date}
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate max-w-[200px] sm:max-w-[280px]">
                      {ann.title}
                    </span>
                  </div>

                  {/* Window Divider Dot */}
                  <span className="text-slate-600 text-xs px-1 select-none font-bold">
                    •
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button: Add Announcement (Text only, no icons) */}
        <div className="shrink-0 z-20 pr-1 pl-1 hidden md:block">
          <button
            onClick={() => setIsAddAnnouncementOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            إضافة إعلان
          </button>
        </div>

      </div>
    </div>
  );
};
