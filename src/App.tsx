import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ParentVoice } from './components/ParentVoice';
import { VoteAndPolls } from './components/VoteAndPolls';
import { IdeaSubmission } from './components/IdeaSubmission';
import { ParentPartnerSkills } from './components/ParentPartnerSkills';
import { InitiativesCatalog } from './components/InitiativesCatalog';
import { YouSaidWeDid } from './components/YouSaidWeDid';
import { FamilyCouncil } from './components/FamilyCouncil';
import { TelegramDiscussionBoard } from './components/TelegramDiscussionBoard';
import { SuccessStories } from './components/SuccessStories';
import { ImpactDashboard } from './components/ImpactDashboard';
import { ParentPortal } from './components/ParentPortal';
import { CoordinatorLayout } from './components/CoordinatorDashboard/CoordinatorLayout';
import { CoordinatorAuthModal } from './components/CoordinatorAuthModal';
import { CoordinatorAuthGate } from './components/CoordinatorAuthGate';
import { InteractiveCalendar } from './components/InteractiveCalendar';
import { Footer } from './components/Footer';
import { ParentLoginModal } from './components/ParentLoginModal';
import { AnnouncementsModal } from './components/AnnouncementsModal';
import { ErrorBoundary } from './components/ErrorBoundary';

const AppContent: React.FC = () => {
  const { activeTab, isCoordinatorLoggedIn, activeSupervisor } = useApp();

  // Scroll to top whenever active tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-emerald-200 selection:text-emerald-950">
      <Header />

      <main className="flex-1">
        {activeTab === 'home' && <Hero />}
        {activeTab === 'voice' && <ParentVoice />}
        {activeTab === 'vote' && <VoteAndPolls />}
        {activeTab === 'idea' && <IdeaSubmission />}
        {activeTab === 'partner-skills' && <ParentPartnerSkills />}
        {activeTab === 'initiatives' && <InitiativesCatalog />}
        {activeTab === 'you-said-we-did' && <YouSaidWeDid />}
        {activeTab === 'council' && <FamilyCouncil />}
        {activeTab === 'discussion' && <TelegramDiscussionBoard />}
        {activeTab === 'calendar' && <InteractiveCalendar />}
        {(activeTab === 'stories' || activeTab === 'success-stories') && <SuccessStories />}
        {activeTab === 'impact' && <ImpactDashboard />}
        {(activeTab === 'portal' || activeTab === 'parent-portal') && <ParentPortal />}
        {(activeTab === 'coordinator' || activeTab === 'coordinator-dashboard') && (
          isCoordinatorLoggedIn || activeSupervisor ? <CoordinatorLayout /> : <CoordinatorAuthGate />
        )}
      </main>

      <Footer />
      <ParentLoginModal />
      <AnnouncementsModal />
      <CoordinatorAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
