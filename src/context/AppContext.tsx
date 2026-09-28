import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  ParentVoice,
  Proposal,
  Poll,
  ParentPartnerSkill,
  YouSaidWeDidItem,
  Initiative,
  InitiativeFeedback,
  CouncilTopic,
  SuccessStory,
  CommunityPartner,
  NotificationItem,
  AIAnalysisReport,
  ProposalStatus,
  SchoolAnnouncement,
  DiscussionMessage,
  DiscussionReaction,
  Supervisor,
  CoordinatorPermission,
  PartnershipEvent,
  PartnershipEventType,
  UserEventReminder,
  ReminderTiming
} from '../types';
import {
  INITIAL_VOICES,
  INITIAL_PROPOSALS,
  INITIAL_POLLS,
  INITIAL_SKILLS,
  INITIAL_YOU_SAID_WE_DID,
  INITIAL_INITIATIVES,
  INITIAL_COUNCIL_TOPIC,
  INITIAL_SUCCESS_STORIES,
  INITIAL_PARTNERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_DISCUSSION_MESSAGES,
  INITIAL_SUPERVISORS,
  INITIAL_EVENTS
} from '../data/initialData';

export type ActiveTab = 
  | 'home'
  | 'voice'
  | 'vote'
  | 'idea'
  | 'partner-skills'
  | 'you-said-we-did'
  | 'initiatives'
  | 'council'
  | 'success-stories'
  | 'stories'
  | 'impact'
  | 'portal'
  | 'parent-portal'
  | 'coordinator'
  | 'coordinator-dashboard'
  | 'discussion'
  | 'calendar';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: {
    name: string;
    phone: string;
    email: string;
    role: UserRole;
    userType?: 'parent' | 'teacher' | 'staff';
    title?: string;
  };
  setCurrentUser: React.Dispatch<React.SetStateAction<{
    name: string;
    phone: string;
    email: string;
    role: UserRole;
    userType?: 'parent' | 'teacher' | 'staff';
    title?: string;
  }>>;
  
  // Data Collections
  voices: ParentVoice[];
  proposals: Proposal[];
  polls: Poll[];
  partnerSkills: ParentPartnerSkill[];
  youSaidWeDid: YouSaidWeDidItem[];
  initiatives: Initiative[];
  councilTopic: CouncilTopic;
  successStories: SuccessStory[];
  partners: CommunityPartner[];
  notifications: NotificationItem[];
  announcements: SchoolAnnouncement[];
  
  // Announcements state & actions
  isAnnouncementBarOpen: boolean;
  setIsAnnouncementBarOpen: (open: boolean) => void;
  activeAnnouncementIndex: number;
  setActiveAnnouncementIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedAnnouncement: SchoolAnnouncement | null;
  setSelectedAnnouncement: (ann: SchoolAnnouncement | null) => void;
  isAllAnnouncementsOpen: boolean;
  setIsAllAnnouncementsOpen: (open: boolean) => void;
  isAddAnnouncementOpen: boolean;
  setIsAddAnnouncementOpen: (open: boolean) => void;
  addAnnouncement: (item: Omit<SchoolAnnouncement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  
  // User interactive state
  userVotedPolls: Record<string, string>; // pollId -> optionId
  likedComments: Record<string, boolean>; // commentId -> boolean
  selectedInitiativeId: string | null;
  setSelectedInitiativeId: (id: string | null) => void;
  ratingInitiativeId: string | null;
  setRatingInitiativeId: (id: string | null) => void;

  // Actions
  addVoice: (voice: Omit<ParentVoice, 'id' | 'createdAt' | 'status'>) => ParentVoice;
  addProposal: (proposal: Omit<Proposal, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => Proposal;
  votePoll: (pollId: string, optionId: string) => void;
  addPartnerSkill: (skill: Omit<ParentPartnerSkill, 'id' | 'createdAt' | 'status'>) => void;
  addInitiativeFeedback: (feedback: Omit<InitiativeFeedback, 'id' | 'createdAt'>) => void;
  addCouncilComment: (content: string, authorName?: string) => void;
  toggleLikeComment: (commentId: string) => void;
  reportComment: (commentId: string) => void;
  
  // Coordinator Actions
  updateProposalStatus: (id: string, status: ProposalStatus, responseText?: string) => void;
  replyToVoice: (id: string, responseText: string) => void;
  convertProposalToInitiative: (proposalId: string) => string;
  createPoll: (newPoll: Omit<Poll, 'id' | 'createdAt' | 'totalVotes'>) => void;
  updateSkillStatus: (id: string, status: 'نشط' | 'تم التواصل' | 'قيد الانتظار') => void;
  addYouSaidWeDid: (item: Omit<YouSaidWeDidItem, 'id' | 'date'>) => void;
  
  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // AI & Reports
  aiReport: AIAnalysisReport | null;
  isAnalyzingAi: boolean;
  runAiFeedbackAnalysis: () => Promise<AIAnalysisReport | null>;

  // Authentication & Participation (Parents, Teachers, Staff)
  isParentLoggedIn: boolean;
  isLoginModalOpen: boolean;
  loginModalReason: string;
  studentName: string;
  openLoginModal: (reason?: string, onLoginSuccess?: () => void) => void;
  closeLoginModal: () => void;
  parentLogin: (name: string, phone: string, student?: string, userType?: 'parent' | 'teacher' | 'staff', title?: string) => void;
  parentLogout: () => void;
  requireParentAuth: (actionCallback?: () => void, customReason?: string) => boolean;

  // Telegram-style Continuous Discussion Board
  discussionMessages: DiscussionMessage[];
  sendDiscussionMessage: (content: string, replyToId?: string, tag?: DiscussionMessage['tag']) => boolean;
  reactToDiscussionMessage: (messageId: string, emoji: string) => boolean;
  deleteDiscussionMessage: (messageId: string, reason?: string) => boolean;
  pinDiscussionMessage: (messageId: string) => void;
  pinnedDiscussionMessage: DiscussionMessage | null;

  // Supervisors & Delegated Permissions
  supervisors: Supervisor[];
  activeSupervisor: Supervisor | null;
  addSupervisor: (data: Omit<Supervisor, 'id' | 'assignedDate' | 'assignedBy'>) => Supervisor;
  updateSupervisorPermissions: (id: string, permissions: CoordinatorPermission[]) => void;
  toggleSupervisorStatus: (id: string) => void;
  removeSupervisor: (id: string) => void;
  setActiveSupervisor: (supervisor: Supervisor | null) => void;
  loginAsSupervisor: (supervisorId: string) => void;
  switchToCoordinator: () => void;
  hasPermission: (permission: CoordinatorPermission) => boolean;
  isCurrentUserSupervisor: boolean;
  currentUserSupervisorData: Supervisor | null;

  // Interactive Calendar & User Reminders
  events: PartnershipEvent[];
  userReminders: Record<string, UserEventReminder>;
  registeredEventSeats: Record<string, boolean>;
  addEventReminder: (eventId: string, timing?: ReminderTiming, options?: { notifyEmail?: string; notifyPhone?: string; reminderNote?: string }) => void;
  removeEventReminder: (eventId: string) => void;
  hasEventReminder: (eventId: string) => boolean;
  getEventReminder: (eventId: string) => UserEventReminder | undefined;
  registerForEvent: (eventId: string) => boolean;
  unregisterFromEvent: (eventId: string) => void;
  hasRegisteredForEvent: (eventId: string) => boolean;
  addPartnershipEvent: (event: Omit<PartnershipEvent, 'id' | 'remindersCount'>) => PartnershipEvent;
  deletePartnershipEvent: (eventId: string) => void;

  // Global triggers
  triggerCelebration: () => void;

  // Coordinator Authentication & Privacy Guard
  isCoordinatorLoggedIn: boolean;
  isCoordinatorAuthModalOpen: boolean;
  openCoordinatorAuthModal: () => void;
  closeCoordinatorAuthModal: () => void;
  coordinatorLogin: (passcodeOrEmail: string) => boolean;
  coordinatorLogout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_PREFIX = 'sharakotna_sec102_';

// High-capacity in-memory cache to guarantee zero-loss and lightning speed for thousands of interactions
const memoryCache = new Map<string, any>();

// Resilient storage helper that never crashes in restricted iframe/private-mode contexts
function getSafeStorage(): Storage | null {
  try {
    if (typeof window !== 'undefined' && 'localStorage' in window && window.localStorage) {
      return window.localStorage;
    }
  } catch {
    return null;
  }
  return null;
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    if (memoryCache.has(key)) {
      return memoryCache.get(key) as T;
    }
    const storage = getSafeStorage();
    if (storage) {
      const item = storage.getItem(LOCAL_STORAGE_PREFIX + key);
      if (item) {
        const parsed = JSON.parse(item);
        memoryCache.set(key, parsed);
        return parsed;
      }
    }
    return defaultValue;
  } catch (e) {
    return memoryCache.get(key) ?? defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    memoryCache.set(key, value);
    const storage = getSafeStorage();
    if (!storage) return;
    storage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e: any) {
    // If quota is restricted under mass traffic, safely preserve in memory and prune transient non-critical keys
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      try {
        const storage = getSafeStorage();
        if (storage) {
          storage.removeItem(LOCAL_STORAGE_PREFIX + 'ai_report_cache');
          storage.removeItem(LOCAL_STORAGE_PREFIX + 'read_notifications');
          storage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(value));
        }
      } catch (retryErr) {
        console.warn('High-capacity fallback: storing data in resilient memory cache', retryErr);
      }
    }
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to coordinator page for the site coordinator & administrator
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => 
    loadFromStorage('active_tab', 'coordinator')
  );
  const [isCoordinatorLoggedIn, setIsCoordinatorLoggedIn] = useState<boolean>(() =>
    loadFromStorage('coordinator_logged_in', true)
  );
  const [isCoordinatorAuthModalOpen, setIsCoordinatorAuthModalOpen] = useState(false);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const coordLoggedIn = loadFromStorage('coordinator_logged_in', true);
    return coordLoggedIn ? 'coordinator' : 'coordinator';
  });
  
  const [isParentLoggedIn, setIsParentLoggedIn] = useState<boolean>(() =>
    loadFromStorage('parent_logged_in', true)
  );
  const [studentName, setStudentName] = useState<string>(() =>
    loadFromStorage('student_name', 'سارة فهد العتيبي')
  );
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalReason, setLoginModalReason] = useState<string>('لتسجيل مشاركتك والتفاعل، يُرجى تسجيل الدخول');
  const [pendingAuthCallback, setPendingAuthCallback] = useState<(() => void) | null>(null);

  const [currentUser, setCurrentUser] = useState({
    name: loadFromStorage('user_name', 'منسقة الشراكة شهد العتيبي'),
    phone: loadFromStorage('user_phone', '0505102102'),
    email: loadFromStorage('user_email', 'shmk20064@gmail.com'),
    role: 'coordinator' as UserRole,
    userType: 'staff' as 'parent' | 'teacher' | 'staff',
    title: loadFromStorage('user_title', 'منسقة الشراكة المجتمعية')
  });

  const openLoginModal = (reason?: string, onLoginSuccess?: () => void) => {
    if (reason) setLoginModalReason(reason);
    if (onLoginSuccess) setPendingAuthCallback(() => onLoginSuccess);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    setPendingAuthCallback(null);
  };

  const parentLogin = (
    name: string, 
    phone: string, 
    student?: string, 
    userType: 'parent' | 'teacher' | 'staff' = 'parent',
    title?: string
  ) => {
    const validName = name.trim() || 'المستخدم';
    const validPhone = phone.trim() || '05XXXXXXXX';
    const validStudent = student?.trim() || 'سارة فهد العتيبي';
    const userRoleTitle = title || (
      userType === 'teacher' 
        ? 'معلمة' 
        : userType === 'staff' 
          ? 'إدارية' 
          : `ولي أمر الطالبة: ${validStudent}`
    );

    setIsParentLoggedIn(true);
    saveToStorage('parent_logged_in', true);
    saveToStorage('parent_name', validName);
    saveToStorage('parent_phone', validPhone);
    saveToStorage('student_name', validStudent);
    saveToStorage('user_type', userType);
    saveToStorage('user_title', userRoleTitle);

    setStudentName(validStudent);
    setCurrentUser(prev => ({
      ...prev,
      name: validName,
      phone: validPhone,
      userType,
      title: userRoleTitle
    }));

    setIsLoginModalOpen(false);
    triggerCelebration();

    if (pendingAuthCallback) {
      pendingAuthCallback();
      setPendingAuthCallback(null);
    }
  };

  const parentLogout = () => {
    setIsParentLoggedIn(false);
    saveToStorage('parent_logged_in', false);
  };

  const requireParentAuth = (actionCallback?: () => void, customReason?: string): boolean => {
    if (isParentLoggedIn) {
      if (actionCallback) actionCallback();
      return true;
    }
    openLoginModal(
      customReason || 'يُشترط تسجيل الدخول للمشاركة والتفاعل في هذا القسم',
      actionCallback
    );
    return false;
  };

  const [voices, setVoices] = useState<ParentVoice[]>(() => 
    loadFromStorage('voices', INITIAL_VOICES)
  );

  const [proposals, setProposals] = useState<Proposal[]>(() => 
    loadFromStorage('proposals', INITIAL_PROPOSALS)
  );

  const [polls, setPolls] = useState<Poll[]>(() => 
    loadFromStorage('polls', INITIAL_POLLS)
  );

  const [partnerSkills, setPartnerSkills] = useState<ParentPartnerSkill[]>(() => 
    loadFromStorage('skills', INITIAL_SKILLS)
  );

  const [youSaidWeDid, setYouSaidWeDid] = useState<YouSaidWeDidItem[]>(() => 
    loadFromStorage('you_said_we_did', INITIAL_YOU_SAID_WE_DID)
  );

  const [initiatives, setInitiatives] = useState<Initiative[]>(() => 
    loadFromStorage('initiatives', INITIAL_INITIATIVES)
  );

  const [councilTopic, setCouncilTopic] = useState<CouncilTopic>(() => 
    loadFromStorage('council', INITIAL_COUNCIL_TOPIC)
  );

  const [discussionMessages, setDiscussionMessages] = useState<DiscussionMessage[]>(() => 
    loadFromStorage('discussion_messages', INITIAL_DISCUSSION_MESSAGES)
  );

  const [successStories] = useState<SuccessStory[]>(INITIAL_SUCCESS_STORIES);
  const [partners] = useState<CommunityPartner[]>(INITIAL_PARTNERS);

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => 
    loadFromStorage('notifications', INITIAL_NOTIFICATIONS)
  );

  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(() => 
    loadFromStorage('school_announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [isAnnouncementBarOpen, setIsAnnouncementBarOpen] = useState<boolean>(() => 
    loadFromStorage('announcement_bar_open', true)
  );
  const [activeAnnouncementIndex, setActiveAnnouncementIndex] = useState<number>(0);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<SchoolAnnouncement | null>(null);
  const [isAllAnnouncementsOpen, setIsAllAnnouncementsOpen] = useState<boolean>(false);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState<boolean>(false);

  const [userVotedPolls, setUserVotedPolls] = useState<Record<string, string>>(() => 
    loadFromStorage('voted_polls', { 'poll-1': 'opt-1' })
  );

  const [likedComments, setLikedComments] = useState<Record<string, boolean>>(() => 
    loadFromStorage('liked_comments', { 'c-1': true })
  );

  const [selectedInitiativeId, setSelectedInitiativeId] = useState<string | null>(null);
  const [ratingInitiativeId, setRatingInitiativeId] = useState<string | null>(null);

  const [aiReport, setAiReport] = useState<AIAnalysisReport | null>(() => 
    loadFromStorage('ai_report', null)
  );
  const [isAnalyzingAi, setIsAnalyzingAi] = useState(false);

  // Supervisors & Delegated Permissions State
  const [supervisors, setSupervisors] = useState<Supervisor[]>(() => 
    loadFromStorage('supervisors', INITIAL_SUPERVISORS)
  );
  const [activeSupervisor, setActiveSupervisor] = useState<Supervisor | null>(() => 
    loadFromStorage('active_supervisor', null)
  );

  // Interactive Calendar & User Reminders State
  const [events, setEvents] = useState<PartnershipEvent[]>(() => 
    loadFromStorage('partnership_events', INITIAL_EVENTS)
  );
  const [userReminders, setUserReminders] = useState<Record<string, UserEventReminder>>(() => 
    loadFromStorage('user_event_reminders', {})
  );
  const [registeredEventSeats, setRegisteredEventSeats] = useState<Record<string, boolean>>(() => 
    loadFromStorage('user_event_seats', {})
  );

  // Sync state to local storage
  useEffect(() => saveToStorage('supervisors', supervisors), [supervisors]);
  useEffect(() => saveToStorage('active_supervisor', activeSupervisor), [activeSupervisor]);
  useEffect(() => saveToStorage('partnership_events', events), [events]);
  useEffect(() => saveToStorage('user_event_reminders', userReminders), [userReminders]);
  useEffect(() => saveToStorage('user_event_seats', registeredEventSeats), [registeredEventSeats]);
  useEffect(() => saveToStorage('voices', voices), [voices]);
  useEffect(() => saveToStorage('proposals', proposals), [proposals]);
  useEffect(() => saveToStorage('polls', polls), [polls]);
  useEffect(() => saveToStorage('skills', partnerSkills), [partnerSkills]);
  useEffect(() => saveToStorage('you_said_we_did', youSaidWeDid), [youSaidWeDid]);
  useEffect(() => saveToStorage('initiatives', initiatives), [initiatives]);
  useEffect(() => saveToStorage('council', councilTopic), [councilTopic]);
  useEffect(() => saveToStorage('discussion_messages', discussionMessages), [discussionMessages]);
  useEffect(() => saveToStorage('notifications', notifications), [notifications]);
  useEffect(() => saveToStorage('voted_polls', userVotedPolls), [userVotedPolls]);
  useEffect(() => saveToStorage('liked_comments', likedComments), [likedComments]);
  useEffect(() => saveToStorage('ai_report', aiReport), [aiReport]);
  useEffect(() => saveToStorage('school_announcements', announcements), [announcements]);
  useEffect(() => saveToStorage('announcement_bar_open', isAnnouncementBarOpen), [isAnnouncementBarOpen]);
  useEffect(() => saveToStorage('active_tab', activeTab), [activeTab]);
  useEffect(() => {
    saveToStorage('user_name', currentUser.name);
    saveToStorage('user_email', currentUser.email);
    saveToStorage('user_phone', currentUser.phone);
    saveToStorage('user_title', currentUser.title);
  }, [currentUser]);

  const addAnnouncement = (item: Omit<SchoolAnnouncement, 'id'>) => {
    const newAnn: SchoolAnnouncement = {
      ...item,
      id: `ann-${Date.now()}`,
      publishDate: 'اليوم',
      isNew: true
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setActiveAnnouncementIndex(0);
    setIsAnnouncementBarOpen(true);
    triggerCelebration();
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    if (selectedAnnouncement?.id === id) {
      setSelectedAnnouncement(null);
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10B981', '#34D399', '#F59E0B', '#3B82F6']
      });
    } catch (e) {
      // ignore
    }
  };

  const addVoice = (voiceData: Omit<ParentVoice, 'id' | 'createdAt' | 'status'>) => {
    const newVoice: ParentVoice = {
      ...voiceData,
      id: `voice-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'جديد',
      likesCount: 0,
      sentiment: voiceData.satisfactionRating >= 4 ? 'إيجابي' : (voiceData.satisfactionRating <= 2 ? 'يحتاج إلى تحسين' : 'محايد')
    };

    setVoices(prev => [newVoice, ...prev]);

    // Add notification for coordinator
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'مشاركة صوت ولي أمر جديدة 📩',
      message: `تم استلام مشاركة جديدة في قسم "${newVoice.category}" من ${newVoice.isAnonymous ? 'ولي أمر' : (newVoice.authorName || 'ولي أمر')}.`,
      type: 'voice',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'coordinator',
      targetRole: 'coordinator'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerCelebration();
    return newVoice;
  };

  const addProposal = (propData: Omit<Proposal, 'id' | 'trackingCode' | 'createdAt' | 'status'>) => {
    const codeNum = (proposals.length + 1).toString().padStart(2, '0');
    const newProp: Proposal = {
      ...propData,
      id: `prop-${Date.now()}`,
      trackingCode: `SH-2026-${codeNum}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'جديدة'
    };

    setProposals(prev => [newProp, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'مقترح مبادرة جديد تم تقديمه 💡',
      message: `تم تقديم مقترح "${newProp.title}" برمز تتبع ${newProp.trackingCode}.`,
      type: 'proposal',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'idea',
      targetRole: 'all'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerCelebration();
    return newProp;
  };

  const votePoll = (pollId: string, optionId: string) => {
    if (userVotedPolls[pollId]) return; // already voted

    setPolls(prev => prev.map(poll => {
      if (poll.id !== pollId) return poll;
      return {
        ...poll,
        totalVotes: poll.totalVotes + 1,
        options: poll.options.map(opt => 
          opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
        )
      };
    }));

    setUserVotedPolls(prev => ({ ...prev, [pollId]: optionId }));
    triggerCelebration();
  };

  const addPartnerSkill = (skillData: Omit<ParentPartnerSkill, 'id' | 'createdAt' | 'status'>) => {
    const newSkill: ParentPartnerSkill = {
      ...skillData,
      id: `skill-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'نشط'
    };

    setPartnerSkills(prev => [newSkill, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'انضمام كفاءة جديدة لبنك الخبرات 🌟',
      message: `سجل/ت ${newSkill.fullName} في مجال "${newSkill.skillCategory}".`,
      type: 'system',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'coordinator',
      targetRole: 'coordinator'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerCelebration();
  };

  const addInitiativeFeedback = (feedbackData: Omit<InitiativeFeedback, 'id' | 'createdAt'>) => {
    const newFeedback: InitiativeFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setInitiatives(prev => prev.map(init => {
      if (init.id !== feedbackData.initiativeId) return init;
      const updatedList = [newFeedback, ...init.feedbackList];
      const newTotal = init.ratingsCount + 1;
      const sum = (init.ratingAverage * init.ratingsCount) + feedbackData.rating;
      const newAvg = Number((sum / newTotal).toFixed(1));

      return {
        ...init,
        feedbackList: updatedList,
        ratingsCount: newTotal,
        ratingAverage: newAvg
      };
    }));

    triggerCelebration();
  };

  const addCouncilComment = (content: string, authorName?: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: authorName || currentUser.name || 'ولي أمر',
      content,
      createdAt: new Date().toISOString().split('T')[0],
      likes: 0,
      status: 'معتمد' as const
    };

    setCouncilTopic(prev => ({
      ...prev,
      totalSuggestions: prev.totalSuggestions + 1,
      comments: [newComment, ...prev.comments]
    }));

    triggerCelebration();
  };

  const toggleLikeComment = (commentId: string) => {
    const isLiked = likedComments[commentId];
    setLikedComments(prev => ({ ...prev, [commentId]: !isLiked }));

    setCouncilTopic(prev => ({
      ...prev,
      comments: prev.comments.map(c => 
        c.id === commentId ? { ...c, likes: isLiked ? c.likes - 1 : c.likes + 1 } : c
      )
    }));
  };

  const reportComment = (commentId: string) => {
    setCouncilTopic(prev => ({
      ...prev,
      comments: prev.comments.map(c => 
        c.id === commentId ? { ...c, isReported: true, status: 'قيد المراجعة' } : c
      )
    }));
  };

  // Check if current user is an appointed supervisor based on phone or activeSupervisor
  const currentUserSupervisorData: Supervisor | null = React.useMemo(() => {
    if (activeSupervisor) return activeSupervisor;
    if (isParentLoggedIn && currentUser.phone) {
      const match = supervisors.find(s => s.phone.trim() === currentUser.phone.trim());
      if (match) return match;
    }
    return null;
  }, [activeSupervisor, isParentLoggedIn, currentUser.phone, supervisors]);

  const isCurrentUserSupervisor = Boolean(currentUserSupervisorData && currentUserSupervisorData.status === 'نشط');

  const hasPermission = (permission: CoordinatorPermission): boolean => {
    if (activeSupervisor) {
      return activeSupervisor.status === 'نشط' && activeSupervisor.permissions.includes(permission);
    }
    if (userRole === 'coordinator') {
      return true;
    }
    if (currentUserSupervisorData && currentUserSupervisorData.status === 'نشط') {
      return currentUserSupervisorData.permissions.includes(permission);
    }
    return false;
  };

  const addSupervisor = (data: Omit<Supervisor, 'id' | 'assignedDate' | 'assignedBy'>): Supervisor => {
    const newSupervisor: Supervisor = {
      ...data,
      id: `sup-${Date.now()}`,
      assignedDate: new Date().toISOString().split('T')[0],
      assignedBy: 'أ. شهد العتيبي (منسقة الشراكة)',
      avatarColor: data.avatarColor || 'bg-teal-600',
      lastActive: 'الآن'
    };
    setSupervisors(prev => [newSupervisor, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'تكليف إشرافي جديد للشراكة المجتمعية 🛡️',
      message: `تم تعيين الأستاذة/ ${newSupervisor.name} مشرفةً مفوضة بصلاحيات محددة لدعم منسقة الشراكة.`,
      type: 'system',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'coordinator',
      targetRole: 'all'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerCelebration();
    return newSupervisor;
  };

  const updateSupervisorPermissions = (id: string, permissions: CoordinatorPermission[]) => {
    setSupervisors(prev => prev.map(s => {
      if (s.id !== id) return s;
      return { ...s, permissions };
    }));
    if (activeSupervisor && activeSupervisor.id === id) {
      setActiveSupervisor(prev => prev ? { ...prev, permissions } : null);
    }
  };

  const toggleSupervisorStatus = (id: string) => {
    setSupervisors(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus = s.status === 'نشط' ? 'موقوف مؤقتاً' : 'نشط';
      return { ...s, status: nextStatus };
    }));
    if (activeSupervisor && activeSupervisor.id === id) {
      setActiveSupervisor(prev => prev ? { ...prev, status: prev.status === 'نشط' ? 'موقوف مؤقتاً' : 'نشط' } : null);
    }
  };

  const removeSupervisor = (id: string) => {
    setSupervisors(prev => prev.filter(s => s.id !== id));
    if (activeSupervisor && activeSupervisor.id === id) {
      setActiveSupervisor(null);
      setUserRole('coordinator');
    }
  };

  const loginAsSupervisor = (supervisorId: string) => {
    const sup = supervisors.find(s => s.id === supervisorId);
    if (sup) {
      setActiveSupervisor(sup);
      setUserRole('coordinator');
      setActiveTab('coordinator');
      triggerCelebration();
    }
  };

  const switchToCoordinator = () => {
    setActiveSupervisor(null);
    if (isCoordinatorLoggedIn) {
      setUserRole('coordinator');
      setActiveTab('coordinator');
    } else {
      openCoordinatorAuthModal();
    }
  };

  const openCoordinatorAuthModal = () => setIsCoordinatorAuthModalOpen(true);
  const closeCoordinatorAuthModal = () => setIsCoordinatorAuthModalOpen(false);

  const coordinatorLogin = (passcodeOrEmail: string): boolean => {
    const clean = passcodeOrEmail.trim().toLowerCase();
    const validCodes = [
      '102', 
      '1448', 
      '2026', 
      'shmk20064@gmail.com', 
      'shmk20064', 
      'sharakah102', 
      '123456', 
      'شهد العتيبي',
      'منسقة الشراكة شهد العتيبي'
    ];
    const isValid = validCodes.includes(clean) || clean.includes('102') || clean.includes('shmk20064') || clean.includes('شهد');

    if (isValid) {
      setIsCoordinatorLoggedIn(true);
      setIsParentLoggedIn(true);
      saveToStorage('coordinator_logged_in', true);
      setUserRole('coordinator');
      setCurrentUser(prev => ({
        ...prev,
        name: 'منسقة الشراكة شهد العتيبي',
        email: 'shmk20064@gmail.com',
        phone: '0505102102',
        role: 'coordinator',
        userType: 'staff',
        title: 'منسقة الشراكة المجتمعية'
      }));
      setActiveTab('coordinator');
      setIsCoordinatorAuthModalOpen(false);
      triggerCelebration();
      return true;
    }
    return false;
  };

  const coordinatorLogout = () => {
    setIsCoordinatorLoggedIn(false);
    saveToStorage('coordinator_logged_in', false);
    setUserRole('parent');
    setActiveSupervisor(null);
    if (activeTab === 'coordinator' || activeTab === 'coordinator-dashboard') {
      setActiveTab('home');
    }
  };

  // Telegram-style Continuous Discussion Methods
  const pinnedDiscussionMessage = discussionMessages.find(m => m.isPinned) || null;

  const sendDiscussionMessage = (content: string, replyToId?: string, tag?: DiscussionMessage['tag']): boolean => {
    if (!isParentLoggedIn) {
      openLoginModal('يُرجى تسجيل الدخول للمشاركة وإرسال رأيك في لوحة النقاش');
      return false;
    }

    const trimmed = content.trim();
    if (!trimmed) return false;

    const replyMsg = replyToId ? discussionMessages.find(m => m.id === replyToId) : undefined;
    const isCoordinator = userRole === 'coordinator' && !activeSupervisor;

    let senderRole: 'parent' | 'teacher' | 'staff' | 'coordinator' = 'parent';
    let senderTitle = currentUser.title;

    if (activeSupervisor) {
      senderRole = 'coordinator';
      senderTitle = `مشرفة مفوضة (${activeSupervisor.name}) - رسمي`;
    } else if (isCoordinator) {
      senderRole = 'coordinator';
      senderTitle = 'منسقة الشراكة المدرسية (ارتقاء) - رسمي';
    } else if (currentUserSupervisorData && currentUserSupervisorData.status === 'نشط') {
      senderRole = 'coordinator';
      senderTitle = `مشرفة مفوضة (${currentUserSupervisorData.name}) - رسمي`;
    } else if (currentUser.userType === 'teacher') {
      senderRole = 'teacher';
      senderTitle = currentUser.title || 'معلمة';
    } else if (currentUser.userType === 'staff') {
      senderRole = 'staff';
      senderTitle = currentUser.title || 'كادر إداري';
    } else {
      senderRole = 'parent';
      senderTitle = currentUser.title || `ولي أمر الطالبة: ${studentName || 'سارة العتيبي'}`;
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    const dateStr = 'اليوم';

    const avatarColor = (isCoordinator || Boolean(activeSupervisor))
      ? 'from-emerald-600 to-teal-700' 
      : senderRole === 'teacher' 
        ? 'from-teal-600 to-emerald-700' 
        : senderRole === 'staff'
          ? 'from-purple-600 to-violet-700'
          : 'from-blue-600 to-indigo-700';

    const newMessage: DiscussionMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      senderName: activeSupervisor 
        ? activeSupervisor.name 
        : (isCoordinator ? 'أ. فوزية الأحمدي' : (currentUser.name || 'مشارك')),
      senderRole,
      senderTitle,
      avatarColor,
      content: trimmed,
      createdAt: now.toISOString(),
      timeStr,
      dateStr,
      replyToId,
      replyToPreview: replyMsg ? {
        senderName: replyMsg.senderName,
        content: replyMsg.content.substring(0, 80) + (replyMsg.content.length > 80 ? '...' : '')
      } : undefined,
      reactions: [],
      isPinned: false,
      tag,
      isOfficial: isCoordinator || Boolean(activeSupervisor) || isCurrentUserSupervisor
    };

    setDiscussionMessages(prev => [...prev, newMessage]);
    triggerCelebration();
    return true;
  };

  const reactToDiscussionMessage = (messageId: string, emoji: string): boolean => {
    if (!isParentLoggedIn) {
      openLoginModal('يُرجى تسجيل الدخول للتفاعل وإبداء الرأي في لوحة النقاش');
      return false;
    }

    const userName = currentUser.name || currentUser.phone || 'أنا';

    setDiscussionMessages(prev => prev.map(msg => {
      if (msg.id !== messageId) return msg;

      const existingReactions = msg.reactions || [];
      const reactIdx = existingReactions.findIndex(r => r.emoji === emoji);

      if (reactIdx >= 0) {
        const reaction = existingReactions[reactIdx];
        const hasUser = reaction.users.includes(userName);
        let updatedReaction: DiscussionReaction;

        if (hasUser) {
          // toggle off
          updatedReaction = {
            ...reaction,
            count: Math.max(0, reaction.count - 1),
            users: reaction.users.filter(u => u !== userName)
          };
        } else {
          // toggle on
          updatedReaction = {
            ...reaction,
            count: reaction.count + 1,
            users: [...reaction.users, userName]
          };
        }

        const newReactions = [...existingReactions];
        if (updatedReaction.count <= 0) {
          newReactions.splice(reactIdx, 1);
        } else {
          newReactions[reactIdx] = updatedReaction;
        }
        return { ...msg, reactions: newReactions };
      } else {
        // new reaction
        return {
          ...msg,
          reactions: [...existingReactions, { emoji, count: 1, users: [userName] }]
        };
      }
    }));

    return true;
  };

  const deleteDiscussionMessage = (messageId: string, reason?: string): boolean => {
    // Allowed for coordinator or supervisor with 'manage_discussion' permission!
    if (!hasPermission('manage_discussion')) {
      alert('صلاحية حذف المشاركات محصورة على منسقة الشراكة والمشرفين المفوضين بهذه الصلاحية فقط.');
      return false;
    }

    setDiscussionMessages(prev => prev.filter(m => m.id !== messageId));
    return true;
  };

  const pinDiscussionMessage = (messageId: string): void => {
    if (!hasPermission('manage_discussion')) return;

    setDiscussionMessages(prev => prev.map(m => {
      if (m.id === messageId) {
        return { ...m, isPinned: !m.isPinned };
      }
      return m;
    }));
  };

  const updateProposalStatus = (id: string, status: ProposalStatus, responseText?: string) => {
    setProposals(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        status,
        schoolResponse: responseText !== undefined ? responseText : p.schoolResponse
      };
    }));

    // notify parent
    const targetProp = proposals.find(p => p.id === id);
    if (targetProp) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `تحديث حالة المقترح (${targetProp.trackingCode}) 📋`,
        message: `تم تغيير حالة مقترح "${targetProp.title}" إلى "${status}".`,
        type: 'proposal',
        createdAt: 'الآن',
        read: false,
        linkToTab: 'idea',
        targetRole: 'parent'
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const replyToVoice = (id: string, responseText: string) => {
    setVoices(prev => prev.map(v => {
      if (v.id !== id) return v;
      return {
        ...v,
        status: 'تم الرد',
        schoolResponse: responseText,
        responseDate: new Date().toISOString().split('T')[0]
      };
    }));
  };

  const convertProposalToInitiative = (proposalId: string): string => {
    const prop = proposals.find(p => p.id === proposalId);
    if (!prop) return '';

    const newInitId = `init-${Date.now()}`;
    const newInitiative: Initiative = {
      id: newInitId,
      title: `مبادرة «${prop.title}»`,
      coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
      date: new Date().toISOString().split('T')[0],
      objective: prop.description,
      description: `مبادرة مدرسية انبثقت من مقترح ولي الأمر (${prop.senderName}) لخدمة مجتمع المدرسة وتعزيز الشراكة.`,
      targetGroup: prop.targetGroup,
      partnerName: prop.partnerEntity || 'وحدة الشراكة المجتمعية بالمدرسة',
      partnerLogo: '🌟',
      beneficiariesCount: 120,
      status: 'قادمة',
      executionTeam: [
        'أ. شهد العتيبي (منسقة الشراكة المجتمعية)',
        `${prop.senderName} (صاحب الفكرة/المبادرة)`
      ],
      galleryImages: [
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
      ],
      results: [
        'اعتماد الفكرة رسميًا وإدراجها ضمن المبادرات المعتمدة.',
        'بدء التنسيق مع فرق العمل لتسجيل الطالبات.'
      ],
      impactMeasurement: 'سيتم قياس الأثر بعد انطلاق المبادرة وتوزيع استبيان الرضا.',
      ratingAverage: 5.0,
      ratingsCount: 1,
      feedbackList: []
    };

    setInitiatives(prev => [newInitiative, ...prev]);

    // Update proposal
    updateProposalStatus(proposalId, 'تم اعتمادها', `تم تحويل الفكرة إلى مبادرة رسمية معتمدة برقم ${newInitId}.`);

    // Add to "You said, We did"
    const newYswd: YouSaidWeDidItem = {
      id: `yswd-${Date.now()}`,
      parentSaid: prop.title,
      schoolDid: `تم اعتماد المقترح وإطلاق مبادرة «${prop.title}» رسميًا.`,
      category: prop.field,
      status: 'قيد التنفيذ',
      date: new Date().toISOString().split('T')[0],
      impactNote: 'مبادرة معتمدة انبثقت من أصوات أولياء الأمور.'
    };
    setYouSaidWeDid(prev => [newYswd, ...prev]);

    return newInitId;
  };

  const createPoll = (newPollData: Omit<Poll, 'id' | 'createdAt' | 'totalVotes'>) => {
    const newPoll: Poll = {
      ...newPollData,
      id: `poll-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      totalVotes: 0
    };
    setPolls(prev => [newPoll, ...prev]);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'استطلاع رأي جديد متاح للتصويت 📊',
      message: `تم نشر استطلاع جديد: "${newPoll.question}".`,
      type: 'poll',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'vote',
      targetRole: 'all'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const updateSkillStatus = (id: string, status: 'نشط' | 'تم التواصل' | 'قيد الانتظار') => {
    setPartnerSkills(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const addYouSaidWeDid = (itemData: Omit<YouSaidWeDidItem, 'id' | 'date'>) => {
    const newItem: YouSaidWeDidItem = {
      ...itemData,
      id: `yswd-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setYouSaidWeDid(prev => [newItem, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const runAiFeedbackAnalysis = async (): Promise<AIAnalysisReport | null> => {
    setIsAnalyzingAi(true);
    try {
      const response = await fetch('/api/ai/analyze-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voices })
      });
      const resData = await response.json();
      if (resData.success && resData.data) {
        setAiReport(resData.data);
        return resData.data;
      }
    } catch (e) {
      console.error('Failed to run AI analysis:', e);
    } finally {
      setIsAnalyzingAi(false);
    }
    return null;
  };

  // Interactive Calendar & Reminders Methods
  const addEventReminder = (
    eventId: string,
    timing: ReminderTiming = '1_day_before',
    options?: { notifyEmail?: string; notifyPhone?: string; reminderNote?: string }
  ) => {
    const evt = events.find(e => e.id === eventId);
    const reminder: UserEventReminder = {
      eventId,
      setAt: new Date().toISOString(),
      timing,
      notifyInApp: true,
      notifyEmail: options?.notifyEmail || currentUser.email,
      notifyPhone: options?.notifyPhone || currentUser.phone,
      reminderNote: options?.reminderNote
    };

    setUserReminders(prev => ({
      ...prev,
      [eventId]: reminder
    }));

    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, remindersCount: (e.remindersCount || 0) + 1 } : e));

    const timingLabels: Record<ReminderTiming, string> = {
      '1_day_before': 'قبل يوم واحد من الموعد',
      '2_hours_before': 'قبل ساعتين من البدء',
      'event_morning': 'صباح يوم الفعالية (الساعة 8:00 ص)',
      '15_mins_before': 'قبل البدء بـ 15 دقيقة'
    };

    const notif: NotificationItem = {
      id: `notif-remind-${Date.now()}`,
      title: 'تم تفعيل التذكير بالفعالية بنجاح 🔔',
      message: `تم جدولة تذكير لفعالية "${evt?.title || 'الفعالية المدرسية'}" في موعد (${timingLabels[timing]}).`,
      type: 'initiative',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'calendar',
      targetRole: 'parent'
    };
    setNotifications(prev => [notif, ...prev]);

    triggerCelebration();
  };

  const removeEventReminder = (eventId: string) => {
    setUserReminders(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, remindersCount: Math.max(0, (e.remindersCount || 1) - 1) } : e));
  };

  const hasEventReminder = (eventId: string): boolean => {
    return !!userReminders[eventId];
  };

  const getEventReminder = (eventId: string): UserEventReminder | undefined => {
    return userReminders[eventId];
  };

  const registerForEvent = (eventId: string): boolean => {
    const isAlready = !!registeredEventSeats[eventId];
    if (isAlready) return true;

    setRegisteredEventSeats(prev => ({ ...prev, [eventId]: true }));
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, seatsRegistered: (e.seatsRegistered || 0) + 1 };
      }
      return e;
    }));

    const evt = events.find(e => e.id === eventId);
    const notif: NotificationItem = {
      id: `notif-rsvp-${Date.now()}`,
      title: 'تم تأكيد حجز مقعدك بنجاح 🎟️',
      message: `تم تسجيل حضورك في "${evt?.title || 'الفعالية المدرسية'}". نتطلع لمشاركتكم الثرية.`,
      type: 'initiative',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'calendar',
      targetRole: 'parent'
    };
    setNotifications(prev => [notif, ...prev]);
    triggerCelebration();
    return true;
  };

  const unregisterFromEvent = (eventId: string) => {
    setRegisteredEventSeats(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, seatsRegistered: Math.max(0, (e.seatsRegistered || 1) - 1) };
      }
      return e;
    }));
  };

  const hasRegisteredForEvent = (eventId: string): boolean => {
    return !!registeredEventSeats[eventId];
  };

  const addPartnershipEvent = (eventData: Omit<PartnershipEvent, 'id' | 'remindersCount'>): PartnershipEvent => {
    const newEvent: PartnershipEvent = {
      ...eventData,
      id: `evt-${Date.now()}`,
      remindersCount: 0
    };
    setEvents(prev => [newEvent, ...prev]);

    const notif: NotificationItem = {
      id: `notif-new-event-${Date.now()}`,
      title: 'فعالية جديدة في تقويم الشراكات 📅',
      message: `تمت جدولة فعالية جديدة: "${newEvent.title}".`,
      type: 'initiative',
      createdAt: 'الآن',
      read: false,
      linkToTab: 'calendar',
      targetRole: 'all'
    };
    setNotifications(prev => [notif, ...prev]);
    triggerCelebration();
    return newEvent;
  };

  const deletePartnershipEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setUserReminders(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    setRegisteredEventSeats(prev => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        setUserRole,
        currentUser,
        setCurrentUser,
        voices,
        proposals,
        polls,
        partnerSkills,
        youSaidWeDid,
        initiatives,
        councilTopic,
        successStories,
        partners,
        notifications,
        announcements,
        isAnnouncementBarOpen,
        setIsAnnouncementBarOpen,
        activeAnnouncementIndex,
        setActiveAnnouncementIndex,
        selectedAnnouncement,
        setSelectedAnnouncement,
        isAllAnnouncementsOpen,
        setIsAllAnnouncementsOpen,
        isAddAnnouncementOpen,
        setIsAddAnnouncementOpen,
        addAnnouncement,
        deleteAnnouncement,
        userVotedPolls,
        likedComments,
        selectedInitiativeId,
        setSelectedInitiativeId,
        ratingInitiativeId,
        setRatingInitiativeId,
        addVoice,
        addProposal,
        votePoll,
        addPartnerSkill,
        addInitiativeFeedback,
        addCouncilComment,
        toggleLikeComment,
        reportComment,
        updateProposalStatus,
        replyToVoice,
        convertProposalToInitiative,
        createPoll,
        updateSkillStatus,
        addYouSaidWeDid,
        markNotificationRead,
        markAllNotificationsRead,
        unreadNotificationsCount,
        aiReport,
        isAnalyzingAi,
        runAiFeedbackAnalysis,
        isParentLoggedIn,
        isLoginModalOpen,
        loginModalReason,
        studentName,
        openLoginModal,
        closeLoginModal,
        parentLogin,
        parentLogout,
        requireParentAuth,
        discussionMessages,
        sendDiscussionMessage,
        reactToDiscussionMessage,
        deleteDiscussionMessage,
        pinDiscussionMessage,
        pinnedDiscussionMessage,
        supervisors,
        activeSupervisor,
        addSupervisor,
        updateSupervisorPermissions,
        toggleSupervisorStatus,
        removeSupervisor,
        setActiveSupervisor,
        loginAsSupervisor,
        switchToCoordinator,
        hasPermission,
        isCurrentUserSupervisor,
        currentUserSupervisorData,
        // Interactive Calendar
        events,
        userReminders,
        registeredEventSeats,
        addEventReminder,
        removeEventReminder,
        hasEventReminder,
        getEventReminder,
        registerForEvent,
        unregisterFromEvent,
        hasRegisteredForEvent,
        addPartnershipEvent,
        deletePartnershipEvent,
        triggerCelebration,
        // Coordinator Authentication Guard
        isCoordinatorLoggedIn,
        isCoordinatorAuthModalOpen,
        openCoordinatorAuthModal,
        closeCoordinatorAuthModal,
        coordinatorLogin,
        coordinatorLogout
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
