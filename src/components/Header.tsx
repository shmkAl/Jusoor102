import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Bell, 
  UserCheck, 
  Shield, 
  ShieldCheck,
  Menu, 
  X, 
  Sparkles, 
  BarChart3, 
  MessageSquareQuote,
  MessageSquare, 
  Vote, 
  Lightbulb, 
  Users, 
  Compass, 
  CheckCircle2,
  Lock,
  LogIn,
  LogOut,
  CalendarDays
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';
import { MinistryOfEducationLogo } from './MinistryLogo';
import { TopAnnouncementBar } from './TopAnnouncementBar';

interface HeaderProps {
  onOpenNotifications?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const { 
    activeTab, 
    setActiveTab, 
    userRole, 
    setUserRole, 
    currentUser, 
    unreadNotificationsCount,
    isParentLoggedIn,
    openLoginModal,
    parentLogout,
    setIsAllAnnouncementsOpen,
    activeSupervisor,
    switchToCoordinator,
    isCoordinatorLoggedIn,
    openCoordinatorAuthModal,
    coordinatorLogout
  } = useApp();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'الرئيسية', icon: <HeartHandshake className="w-4 h-4" /> },
    { id: 'calendar', label: 'تقويم الفعاليات', icon: <CalendarDays className="w-4 h-4 text-emerald-600" /> },
    { id: 'discussion', label: 'لوحة النقاش (محادثة)', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'voice', label: 'صوت ولي الأمر', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { id: 'vote', label: 'صوّت وشارك', icon: <Vote className="w-4 h-4" /> },
    { id: 'idea', label: 'فكرتك مبادرة', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'partner-skills', label: 'ولي الأمر شريك', icon: <Users className="w-4 h-4" /> },
    { id: 'you-said-we-did', label: 'ماذا قلتم؟ وماذا فعلنا؟', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'initiatives', label: 'المبادرات', icon: <Compass className="w-4 h-4" /> },
    { id: 'council', label: 'مجلس الأسرة', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'impact', label: 'لوحة الأثر', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Ministerial & School Banner */}
      <div className="bg-gradient-to-r from-emerald-850 via-teal-900 to-emerald-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium">
            <MinistryOfEducationLogo variant="dark" className="h-6" showContainer={true} />
            <span className="hidden sm:inline text-emerald-300/60">|</span>
            <span className="hidden sm:inline text-emerald-100 font-medium">الإدارة العامة للتعليم بمحافظة جدة</span>
            <span className="text-emerald-300/60">•</span>
            <span className="text-emerald-100 font-bold">المدرسة الثانوية 102 للبنات بجدة</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            {/* Coordinator Badge (Exclusive when coordinator is active) */}
            {isCoordinatorLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-amber-400 text-slate-950 px-3 py-1 rounded-full font-black text-[11px] shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-950" />
                <span>منسقة الشراكة: أ. شهد العتيبي</span>
                <span className="hidden lg:inline text-[10px] text-slate-800 font-mono" dir="ltr">(shmk20064@gmail.com)</span>
                <button
                  onClick={coordinatorLogout}
                  className="text-[10px] text-rose-950 hover:text-black font-extrabold mr-1.5 underline cursor-pointer"
                  title="قفل وتسجيل خروج المنسقة"
                >
                  قفل
                </button>
              </div>
            ) : isParentLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-emerald-700/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full text-white">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-[11px] font-bold text-emerald-200 hidden sm:inline">
                  {currentUser.role === 'coordinator' || currentUser.name.includes('شهد')
                    ? 'منسقة الشراكة:'
                    : currentUser.userType === 'teacher'
                      ? 'المعلمة:'
                      : currentUser.userType === 'staff'
                        ? 'كادر المدرسة:'
                        : 'ولي الأمر:'}
                </span>
                <span className="text-[11px] font-black text-white">{currentUser.name}</span>
                <button
                  onClick={parentLogout}
                  title="تسجيل الخروج"
                  className="mr-1 text-emerald-300 hover:text-white p-0.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => openLoginModal('سجّلي الدخول للمشاركة والتفاعل في كافة أنشطة ومبادرات المدرسة')}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-bold text-[11px] shadow-xs transition-colors cursor-pointer"
              >
                <LogIn className="w-3 h-3" />
                <span>تسجيل الدخول</span>
              </button>
            )}

            {/* Supervisor / Delegate Status if applicable and not main coordinator */}
            {!isCoordinatorLoggedIn && activeSupervisor ? (
              <div className="flex items-center gap-1.5 bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-2 py-0.5 rounded text-[11px]">
                <span>مشرفة مفوضة: {activeSupervisor.name}</span>
                <button 
                  onClick={switchToCoordinator} 
                  className="text-[10px] bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded text-white mr-1 cursor-pointer transition-colors"
                >
                  إنهاء
                </button>
              </div>
            ) : !isCoordinatorLoggedIn && (
              <button
                onClick={openCoordinatorAuthModal}
                className="flex items-center gap-1 text-[11px] text-emerald-200/80 hover:text-white transition-colors cursor-pointer py-0.5 px-1.5 rounded hover:bg-white/10"
                title="تسجيل دخول منسقة الشراكة المجتمعية"
              >
                <Lock className="w-3 h-3 text-emerald-300/70" />
                <span className="hidden md:inline">دخول المنسقة</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Top Announcements & Bulletins Bar (Only on other tabs to prevent duplicate on first page) */}
      {activeTab !== 'home' && <TopAnnouncementBar />}

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Logo & Brand Identity */}
        <div className="flex items-center gap-4">
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-950 tracking-tight font-display">جسور الـ ١٠٢</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  الشراكة المجتمعية
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium">معًا نصنع أثرًا أفضل لبناتنا</p>
            </div>
          </div>

          <div className="hidden lg:block h-8 w-[1px] bg-slate-200 mx-1"></div>
          <div className="hidden lg:flex items-center">
            <MinistryOfEducationLogo variant="color" className="h-10" />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200/80 shadow-xs' 
                    : 'hover:bg-slate-100 hover:text-slate-900 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions (Notifications, Portal, Dashboard Switch) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification & Announcements Button */}
          <button
            onClick={() => {
              if (onOpenNotifications) {
                onOpenNotifications();
              } else {
                setIsAllAnnouncementsOpen(true);
              }
            }}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 border border-slate-200 transition-colors cursor-pointer"
            title="الإعلانات والتنبيهات المدرسية"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white font-bold text-[11px] rounded-full flex items-center justify-center shadow-xs animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User Portal Button */}
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'portal'
                ? 'bg-emerald-700 text-white shadow-md shadow-emerald-800/20'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">بوابة ولي الأمر</span>
            <span className="sm:hidden">حسابي</span>
          </button>

          {/* Coordinator Switch / Dashboard Button (Only visible to coordinator or supervisor) */}
          {(isCoordinatorLoggedIn || activeSupervisor) && (
            <button
              onClick={() => {
                setActiveTab('coordinator');
              }}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                activeTab === 'coordinator'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-amber-100 text-amber-950 hover:bg-amber-200 border border-amber-300'
              }`}
            >
              <Shield className="w-4 h-4 text-amber-600" />
              <span className="hidden md:inline">
                {activeSupervisor ? 'لوحة الإشراف (مفوضة)' : 'لوحة منسقة الشراكة'}
              </span>
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 border border-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Collapsible Navigation Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-3 shadow-lg space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 rounded-lg text-right font-medium text-sm flex items-center justify-between ${
                  isActive 
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="flex items-center gap-2">
                  {item.icon}
                  {item.label}
                </span>
                {isActive && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => {
                setActiveTab('portal');
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2.5 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-lg border border-emerald-200 text-center"
            >
              بوابة ولي الأمر
            </button>
            {/* Coordinator button inside mobile drawer - only if coordinator/supervisor */}
            {(isCoordinatorLoggedIn || activeSupervisor) && (
              <button
                onClick={() => {
                  setActiveTab('coordinator');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-lg text-center"
              >
                {activeSupervisor ? 'لوحة الإشراف' : 'لوحة منسقة الشراكة'}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
