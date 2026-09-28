export type UserRole = 'parent' | 'coordinator' | 'supervisor';

export type SubmissionCategory = 
  | 'البيئة المدرسية'
  | 'الأنشطة والفعاليات'
  | 'التواصل مع المدرسة'
  | 'الأمن والسلامة'
  | 'المقصف المدرسي'
  | 'البرامج التعليمية'
  | 'التقنية والتحول الرقمي'
  | 'الدعم والإرشاد'
  | 'الطالبات المستجدات'
  | 'أخرى';

export type SubmissionType = 'ملاحظة' | 'اقتراح' | 'شكر وتقدير' | 'استفسار' | 'شكوى';

export interface ParentVoice {
  id: string;
  authorName?: string;
  isAnonymous: boolean;
  type: SubmissionType;
  category: SubmissionCategory;
  content: string;
  satisfactionRating: number; // 1 to 5
  allowContact: boolean;
  contactPhone?: string;
  contactEmail?: string;
  createdAt: string;
  status: 'جديد' | 'قيد المراجعة' | 'تمت المراجعة' | 'تم الرد' | 'مؤرشف';
  schoolResponse?: string;
  responseDate?: string;
  likesCount?: number;
  sentiment?: 'إيجابي' | 'محايد' | 'يحتاج إلى تحسين' | 'عاجل';
}

export type ProposalStatus = 
  | 'جديدة'
  | 'قيد الدراسة'
  | 'تم اعتمادها'
  | 'قيد التنفيذ'
  | 'تم تنفيذها'
  | 'مرفوضة';

export type SupportType = 
  | 'تقديم ورشة'
  | 'تدريب'
  | 'تطوع'
  | 'دعم عيني'
  | 'دعم تقني'
  | 'توفير جهة شريكة'
  | 'خبرة مهنية'
  | 'فكرة أخرى';

export interface Proposal {
  id: string;
  trackingCode: string;
  title: string;
  description: string;
  targetGroup: string;
  field: SubmissionCategory;
  partnerEntity?: string;
  supportType: SupportType;
  senderName: string;
  senderPhone?: string;
  senderEmail?: string;
  isAnonymous: boolean;
  createdAt: string;
  status: ProposalStatus;
  notes?: string;
  schoolResponse?: string;
  convertedToInitiativeId?: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  description?: string;
  category: SubmissionCategory;
  options: PollOption[];
  totalVotes: number;
  isActive: boolean;
  createdAt: string;
  endDate?: string;
  targetAudience: string;
}

export type PartnerSkillCategory =
  | 'خبرة تقنية'
  | 'تصميم وإبداع'
  | 'تدريب وتعليم'
  | 'صحة وتوعية'
  | 'أعمال وإدارة'
  | 'تقديم ورش'
  | 'بيئة واستدامة'
  | 'تطوع وتنظيم'
  | 'تطوع'
  | 'توفير شراكات مع جهات'
  | 'توفير شراكات'
  | 'أفكار ومبادرات';

export interface ParentPartnerSkill {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  skillCategory: PartnerSkillCategory;
  jobTitle?: string;
  workplace?: string;
  availableHours?: string;
  details?: string;
  createdAt: string;
  status: 'نشط' | 'تم التواصل' | 'قيد الانتظار';
  profession?: string;
  experienceDetails?: string;
  availability?: string;
  preferredTime?: string;
}

export interface YouSaidWeDidItem {
  id: string;
  parentSaid: string;
  schoolDid: string;
  category: SubmissionCategory;
  status: 'تم التنفيذ' | 'قيد التنفيذ' | 'قيد الدراسة';
  date: string;
  impactNote?: string;
  initiativeRefId?: string;
}

export interface Initiative {
  id: string;
  title: string;
  coverImage: string;
  date: string;
  endDate?: string;
  objective: string;
  description: string;
  targetGroup: string;
  partnerName: string;
  partnerLogo?: string;
  beneficiariesCount: number;
  status: 'مكتملة' | 'جارية' | 'قادمة';
  executionTeam: string[];
  galleryImages: string[];
  results: string[];
  impactMeasurement: string;
  ratingAverage: number;
  ratingsCount: number;
  feedbackList: InitiativeFeedback[];
}

export interface InitiativeFeedback {
  id: string;
  initiativeId: string;
  rating: number; // 1 to 5
  bestAspect?: string;
  suggestedImprovement?: string;
  wantsSimilar?: boolean;
  parentName?: string;
  createdAt: string;
  whatLiked?: string;
  whatToImprove?: string;
  wouldRecommend?: boolean;
}

export interface CouncilComment {
  id: string;
  authorName: string;
  content: string;
  createdAt: string;
  likes: number;
  isReported?: boolean;
  status: 'معتمد' | 'قيد المراجعة' | 'محظور';
}

export interface CouncilTopic {
  id: string;
  month: string;
  title: string;
  description: string;
  guidelines: string;
  comments: CouncilComment[];
  totalSuggestions: number;
  isActive: boolean;
}

export interface SuccessStory {
  id: string;
  title: string;
  parentIdea: string;
  studyPhase: string;
  approvalPhase: string;
  executionPhase: string;
  impactResult: string;
  year: string;
  badge: string;
  beneficiaries: string;
  photoUrl?: string;
  date?: string;
  parentInitiator?: string;
  overview?: string;
  parentQuote?: string;
  image?: string;
  journey?: {
    idea?: string;
    adoption?: string;
    execution?: string;
    impact?: string;
    ideaDate?: string;
    approvalDate?: string;
    launchDate?: string;
    measurementDate?: string;
  };
}

export interface CommunityPartner {
  id: string;
  name: string;
  sector: string;
  logo: string;
  initiativesSupported: number;
  partnershipType: string;
  contactPerson?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'proposal' | 'poll' | 'initiative' | 'voice' | 'system';
  createdAt: string;
  read: boolean;
  linkToTab?: string;
  targetRole?: 'all' | 'coordinator' | 'parent';
}

export interface AIAnalysisReport {
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    needsImprovement: number;
    urgent: number;
  };
  topicsDistribution: {
    topic: string;
    percentage: number;
    count: number;
  }[];
  keyInsights: string[];
  recommendations: string[];
  generatedAt: string;
}

export type AnnouncementPriority = 'عاجل' | 'هام' | 'فعالية' | 'تنويه' | 'دعوة';

export interface SchoolAnnouncement {
  id: string;
  title: string;
  summary: string;
  content?: string;
  priority: AnnouncementPriority;
  date: string;
  publishDate?: string;
  linkTab?: string;
  actionLabel?: string;
  targetAudience?: string;
  isNew?: boolean;
  author?: string;
  imageUrl?: string;
  category?: string;
}

export interface DiscussionReaction {
  emoji: string;
  count: number;
  users: string[]; // usernames or phones that reacted
}

export interface DiscussionMessage {
  id: string;
  senderName: string;
  senderRole: 'parent' | 'teacher' | 'staff' | 'coordinator';
  senderTitle?: string;
  avatarColor?: string;
  content: string;
  createdAt: string;
  timeStr: string;
  dateStr: string;
  replyToId?: string;
  replyToPreview?: {
    senderName: string;
    content: string;
  };
  reactions: DiscussionReaction[];
  isPinned?: boolean;
  tag?: 'اقتراح' | 'استفسار' | 'شكر' | 'تنويه' | 'رأي تربوي';
  isOfficial?: boolean;
}

export type CoordinatorPermission = 
  | 'manage_proposals'      // إدارة ومراجعة المقترحات والرد عليها
  | 'convert_proposals'     // تحويل المقترحات إلى مبادرات معتمدة
  | 'manage_voices'         // مراجعة صوت ولي الأمر والرد الرسمي
  | 'manage_talents'        // إدارة والتواصل مع بنك الخبرات والكفاءات
  | 'manage_discussion'     // الإشراف على لوحة النقاش (حذف وتثبيت المشاركات)
  | 'manage_polls'          // إنشاء وإدارة استطلاعات الرأي والتصويت
  | 'manage_you_said_we_did'// توثيق وإضافة "ماذا قلتم؟ وماذا فعلنا؟"
  | 'manage_announcements'  // نشر وتعديل إعلانات وتعاميم المدرسة
  | 'use_ai_tools'          // تشغيل المحلل الذكي وصياغة الخطابات بالذكاء الاصطناعي
  | 'export_reports';       // استعراض وطباعة التقارير الرسمية

export interface PermissionDefinition {
  id: CoordinatorPermission;
  name: string;
  description: string;
  category: 'المقترحات والمبادرات' | 'التواصل وبنك الخبرات' | 'النقاش والاستطلاعات' | 'التحليل والتقارير';
  badgeColor: string;
}

export interface Supervisor {
  id: string;
  memberId?: string;
  name: string;
  phone: string;
  email?: string;
  roleInSchool: 'ولي أمر' | 'معلمة' | 'إدارية' | 'عضو مجلس الأسرة';
  studentName?: string;
  assignedDate: string;
  assignedBy: string; // e.g. "أ. شهد العتيبي (منسقة الشراكة المجتمعية)"
  status: 'نشط' | 'موقوف مؤقتاً';
  permissions: CoordinatorPermission[];
  notes?: string;
  avatarColor?: string;
  lastActive?: string;
}

export type PartnershipEventType = 
  | 'meeting'       // اجتماعات أولياء الأمور والجمعية العمومية
  | 'school_event'  // فعاليات وأنشطة مدرسية ومعارض
  | 'workshop'      // ورش تدريبية وبنك الخبرات
  | 'council'       // جلسات مجلس الأسرة
  | 'open_day';     // اليوم المفتوح والمناسبات الوطنية

export interface PartnershipEvent {
  id: string;
  title: string;
  type: PartnershipEventType;
  date: string; // YYYY-MM-DD
  endDate?: string;
  hijriDate: string; // e.g. "18 صفر 1448هـ"
  time: string; // e.g. "09:30 ص - 12:00 م"
  location: string; // e.g. "مسرح المدرسة الرئيسي"
  isOnline: boolean;
  onlineMeetingUrl?: string;
  description: string;
  agenda: string[];
  targetAudience: string;
  organizer: string;
  seatsTotal?: number;
  seatsRegistered?: number;
  requiresRegistration?: boolean;
  badgeColor?: string;
  remindersCount: number;
  coverImage?: string;
  isImportant?: boolean;
  notes?: string;
}

export type ReminderTiming = '1_day_before' | '2_hours_before' | 'event_morning' | '15_mins_before';

export interface UserEventReminder {
  eventId: string;
  setAt: string;
  timing: ReminderTiming;
  notifyInApp: boolean;
  notifyEmail?: string;
  notifyPhone?: string;
  reminderNote?: string;
}

