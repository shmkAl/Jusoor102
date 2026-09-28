import React, { useState, useRef } from 'react';
import { 
  X, 
  Megaphone, 
  Calendar, 
  Clock, 
  Users, 
  ExternalLink, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Search, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Share2, 
  Eye, 
  AlertCircle,
  Tag,
  ArrowRight
} from 'lucide-react';
import { useApp, ActiveTab } from '../context/AppContext';
import { SchoolAnnouncement, AnnouncementPriority } from '../types';

// Preset high-quality educational & school photos for quick selection
const PRESET_TOPIC_IMAGES = [
  {
    id: 'preset-1',
    label: 'لقاءات وأولياء الأمور',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    description: 'قاعة مسرح المدرسة واجتماع الشراكة'
  },
  {
    id: 'preset-2',
    label: 'تقنية وذكاء اصطناعي',
    url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    description: 'معمل الحاسب والبرمجة والأمن السيبراني'
  },
  {
    id: 'preset-3',
    label: 'أفكار ومبادرات',
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    description: 'ورشة العصف الذهني وفرق العمل'
  },
  {
    id: 'preset-4',
    label: 'تصويت ومهارات',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    description: 'شاشات التدريب واستطلاعات الرأي'
  },
  {
    id: 'preset-5',
    label: 'بيئة مدرسية ومشاريع',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    description: 'المبنى المدرسي والواحات الخضراء'
  },
  {
    id: 'preset-6',
    label: 'تكريم وإنجازات',
    url: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?auto=format&fit=crop&w=800&q=80',
    description: 'شهادات التقدير والاحتفاء بالمتميزات'
  }
];

export const AnnouncementsModal: React.FC = () => {
  const { 
    announcements, 
    selectedAnnouncement, 
    setSelectedAnnouncement, 
    isAllAnnouncementsOpen, 
    setIsAllAnnouncementsOpen,
    isAddAnnouncementOpen,
    setIsAddAnnouncementOpen,
    setActiveTab,
    userRole,
    addAnnouncement,
    deleteAnnouncement
  } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | AnnouncementPriority>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  // Form State for creating a new Topic with Images
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('لقاءات وشراكة');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newPriority, setNewPriority] = useState<AnnouncementPriority>('هام');
  const [newDate, setNewDate] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('جميع أولياء الأمور والطالبات');
  const [newLinkTab, setNewLinkTab] = useState<string>('home');
  const [newActionLabel, setNewActionLabel] = useState('الانتقال للقسم المعني');
  
  // Image Upload / Selection State
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [selectedImageUrl, setSelectedImageUrl] = useState<string>(PRESET_TOPIC_IMAGES[0].url);
  const [customImageUrlInput, setCustomImageUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local image file upload (convert to Base64 data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالح (PNG, JPG, WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 5 ميجابايت');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setSelectedImageUrl(result);
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('تعذر قراءة الصورة، يرجى المحاولة مرة أخرى');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSummary.trim()) return;

    // Use current selected image or URL input if mode is url
    const finalImageUrl = imageSourceMode === 'url' && customImageUrlInput.trim() 
      ? customImageUrlInput.trim() 
      : selectedImageUrl;

    addAnnouncement({
      title: newTitle.trim(),
      category: newCategory.trim() || 'إعلانات وتنويهات',
      summary: newSummary.trim(),
      content: newContent.trim() || newSummary.trim(),
      priority: newPriority,
      imageUrl: finalImageUrl || undefined,
      date: newDate.trim() || 'الفصل الدراسي الحالي',
      targetAudience: newTargetAudience.trim(),
      linkTab: newLinkTab,
      actionLabel: newActionLabel.trim() || 'عرض المزيد',
      author: 'إدارة المدرسة الثانوية 102'
    });

    // Reset form
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
    setNewDate('');
    setCustomImageUrlInput('');
    setIsAddAnnouncementOpen(false);
  };

  const handleShare = (ann: SchoolAnnouncement) => {
    const shareText = `📌 [${ann.priority}] ${ann.title}\n\n${ann.summary}\n\nالمدرسة الثانوية 102 للبنات بجدة - منصة جسور الـ 102`;
    navigator.clipboard?.writeText(shareText);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const getPriorityStyle = (priority: AnnouncementPriority) => {
    switch (priority) {
      case 'عاجل':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          dot: 'bg-rose-600',
          badge: 'bg-rose-600 text-white'
        };
      case 'هام':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          badge: 'bg-amber-500 text-slate-950'
        };
      case 'دعوة':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
          badge: 'bg-emerald-600 text-white'
        };
      case 'فعالية':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          dot: 'bg-blue-600',
          badge: 'bg-blue-600 text-white'
        };
      default:
        return {
          bg: 'bg-teal-100 text-teal-800 border-teal-300',
          dot: 'bg-teal-600',
          badge: 'bg-teal-600 text-white'
        };
    }
  };

  const filteredAnnouncements = announcements.filter(ann => {
    const matchesFilter = activeFilter === 'all' || ann.priority === activeFilter;
    const matchesSearch = !searchQuery.trim() || 
      ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      ann.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ann.category && ann.category.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // =========================================================================
  // 1. ADD TOPIC WITH IMAGE MODAL
  // =========================================================================
  if (isAddAnnouncementOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col border border-emerald-200 text-right overflow-hidden">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display">
                  إضافة إعلان وموضوع مصور جديد
                </h3>
                <p className="text-xs text-emerald-200">
                  سيظهر الموضوع في الشريط المتحرك وبطاقات المواضيع المصورة أعلى المنصة
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddAnnouncementOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Scroll Area */}
          <form onSubmit={handleCreateAnnouncement} className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
            
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  عنوان الموضوع أو الإعلان *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="مثال: ورشة تدريبية في الذكاء الاصطناعي لطالبات المرحلة الثانوية..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  التصنيف
                </label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="لقاءات وشراكة">لقاءات وشراكة</option>
                  <option value="مبادرات وأفكار">مبادرات وأفكار</option>
                  <option value="ورش وتدريب">ورش وتدريب</option>
                  <option value="استطلاعات وتصويت">استطلاعات وتصويت</option>
                  <option value="مشاريع منفذة">مشاريع منفذة</option>
                  <option value="تكريم وإنجازات">تكريم وإنجازات</option>
                  <option value="تنويهات عامة">تنويهات عامة</option>
                </select>
              </div>
            </div>

            {/* Priority & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  نوع وأولوية الإعلان
                </label>
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as AnnouncementPriority)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="عاجل">عاجل (شريط أحمر بارز)</option>
                  <option value="هام">هام (تنبيه برتقالي مميز)</option>
                  <option value="دعوة">دعوة (أخضر زمردي)</option>
                  <option value="فعالية">فعالية (أزرق)</option>
                  <option value="تنويه">تنويه (أزرق مخضر)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  التاريخ أو الموعد
                </label>
                <input
                  type="text"
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  placeholder="مثال: الخميس القادم 10:00 ص"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            {/* Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                ملخص الموضوع (يظهر في الشريط المتحرك) *
              </label>
              <input
                type="text"
                required
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                placeholder="موجز يوضح الفكرة في جملة واحدة ليجذب القارئ..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
              />
            </div>

            {/* Extended Content */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                التفاصيل الكاملة للموضوع
              </label>
              <textarea
                rows={3}
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                placeholder="اكتب كامل الإرشادات، أهداف اللقاء، شروط المشاركة، إلخ..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white leading-relaxed"
              />
            </div>

            {/* ========================================================================= */}
            {/* IMAGE SECTION: UPLOAD FROM DEVICE OR CHOOSE PRESET OR URL */}
            {/* ========================================================================= */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-emerald-950 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>إرفاق صورة للموضوع (تظهر في البطاقات والشريط)</span>
                </span>

                {/* Source Tabs */}
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('upload')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      imageSourceMode === 'upload' 
                        ? 'bg-emerald-700 text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    رفع من الجهاز
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('preset')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      imageSourceMode === 'preset' 
                        ? 'bg-emerald-700 text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    صور جاهزة
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageSourceMode('url')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                      imageSourceMode === 'url' 
                        ? 'bg-emerald-700 text-white' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    رابط خارجي
                  </button>
                </div>
              </div>

              {/* Mode 1: Upload from device */}
              {imageSourceMode === 'upload' && (
                <div className="space-y-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-emerald-400/80 hover:border-emerald-600 bg-white/80 hover:bg-white rounded-2xl p-4 text-center cursor-pointer transition-all"
                  >
                    <Upload className="w-6 h-6 mx-auto text-emerald-600 mb-1.5" />
                    <p className="text-xs font-bold text-slate-800">
                      انقر لاختيار صورة من حاسوبك أو هاتفك
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      يدعم صور JPG, PNG, WEBP حتى 5 ميجابايت
                    </p>
                  </div>
                  {uploadError && (
                    <p className="text-xs text-rose-600 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{uploadError}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Mode 2: Presets gallery */}
              {imageSourceMode === 'preset' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {PRESET_TOPIC_IMAGES.map((preset) => {
                    const isSelected = selectedImageUrl === preset.url;
                    return (
                      <div
                        key={preset.id}
                        onClick={() => setSelectedImageUrl(preset.url)}
                        className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${
                          isSelected 
                            ? 'border-emerald-600 ring-2 ring-emerald-500/30 shadow-md' 
                            : 'border-transparent hover:border-emerald-300'
                        }`}
                      >
                        <img 
                          src={preset.url} 
                          alt={preset.label}
                          className="w-full h-16 object-cover group-hover:scale-105 transition-transform" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                          <span className="text-[10px] text-white font-bold truncate">
                            {preset.label}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Mode 3: Custom image URL */}
              {imageSourceMode === 'url' && (
                <div>
                  <input
                    type="url"
                    value={customImageUrlInput}
                    onChange={e => {
                      setCustomImageUrlInput(e.target.value);
                      if (e.target.value.trim()) {
                        setSelectedImageUrl(e.target.value.trim());
                      }
                    }}
                    placeholder="ضع رابط الصورة المباشر هنا (https://...)"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              )}

              {/* Live Image Preview */}
              {selectedImageUrl && (
                <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-emerald-200">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img 
                      src={selectedImageUrl} 
                      alt="معاينة الصورة" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-emerald-900 block">
                      تم اختيار صورة الموضوع بنجاح ✓
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block">
                      ستظهر هذه الصورة في شريط المواضيع وبطاقة الإعلان
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedImageUrl('')}
                    className="text-xs text-rose-500 hover:text-rose-700 p-1 font-bold"
                  >
                    إزالة
                  </button>
                </div>
              )}
            </div>

            {/* Target Audience & Linked Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الفئة المستهدفة
                </label>
                <input
                  type="text"
                  value={newTargetAudience}
                  onChange={e => setNewTargetAudience(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  الربط التفاعلي بقسم بالمنصة
                </label>
                <select
                  value={newLinkTab}
                  onChange={e => setNewLinkTab(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="home">الرئيسية</option>
                  <option value="voice">صوت ولي الأمر</option>
                  <option value="vote">صوّت وشارك (استطلاعات)</option>
                  <option value="idea">فكرتك مبادرة</option>
                  <option value="partner-skills">ولي الأمر شريك (الكفاءات)</option>
                  <option value="you-said-we-did">ماذا قلتم؟ وماذا فعلنا؟</option>
                  <option value="initiatives">المبادرات المعتمدة</option>
                  <option value="council">مجلس الأسرة والمدرسة</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsAddAnnouncementOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isUploading}
                className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>نشر الموضوع المصور في الشريط فوراً</span>
              </button>
            </div>
          </form>

        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. SINGLE TOPIC / ANNOUNCEMENT FULL READER MODAL
  // =========================================================================
  if (selectedAnnouncement) {
    const style = getPriorityStyle(selectedAnnouncement.priority);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-emerald-100 text-right">
          
          {/* Top Image or Gradient Cover Banner */}
          <div className="relative w-full h-56 sm:h-64 bg-slate-950 overflow-hidden rounded-t-3xl">
            {selectedAnnouncement.imageUrl ? (
              <img 
                src={selectedAnnouncement.imageUrl} 
                alt={selectedAnnouncement.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-950 flex items-center justify-center text-emerald-300">
                <ImageIcon className="w-16 h-16 opacity-30" />
              </div>
            )}

            {/* Gradient Overlays for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors cursor-pointer backdrop-blur-xs z-10"
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Top Badges */}
            <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${style.badge} shadow-lg flex items-center gap-1.5`}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                <span>{selectedAnnouncement.priority}</span>
              </span>

              {selectedAnnouncement.category && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-xs">
                  {selectedAnnouncement.category}
                </span>
              )}
            </div>

            {/* Bottom Title on Image */}
            <div className="absolute bottom-4 right-4 left-4 text-white">
              <span className="text-xs text-emerald-300 font-medium block mb-1">
                المدرسة الثانوية 102 للبنات بجدة • الشراكة التكاملية
              </span>
              <h3 className="text-lg sm:text-2xl font-bold font-display leading-snug">
                {selectedAnnouncement.title}
              </h3>
            </div>
          </div>

          {/* Metadata Ribbon */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex flex-wrap items-center gap-4">
              {selectedAnnouncement.date && (
                <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                  <span>{selectedAnnouncement.date}</span>
                </div>
              )}
              {selectedAnnouncement.targetAudience && (
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Users className="w-4 h-4 text-teal-700" />
                  <span>الفئة: {selectedAnnouncement.targetAudience}</span>
                </div>
              )}
              {selectedAnnouncement.author && (
                <div className="flex items-center gap-1.5 text-slate-500 hidden sm:flex">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{selectedAnnouncement.author}</span>
                </div>
              )}
            </div>

            {/* Share action */}
            <button
              onClick={() => handleShare(selectedAnnouncement)}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold transition-colors cursor-pointer"
              title="نسخ محتوى الإعلان للمشاركة"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? 'تم النسخ بنجاح ✓' : 'مشاركة'}</span>
            </button>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-5">
            {/* Highlighted Summary */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-sm text-emerald-950 font-medium leading-relaxed">
              {selectedAnnouncement.summary}
            </div>

            {/* Full Details */}
            {selectedAnnouncement.content && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>التفاصيل والإرشادات:</span>
                </h4>
                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80">
                  {selectedAnnouncement.content}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {selectedAnnouncement.linkTab && (
                  <button
                    onClick={() => {
                      setActiveTab(selectedAnnouncement.linkTab as ActiveTab);
                      setSelectedAnnouncement(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <span>{selectedAnnouncement.actionLabel || 'الانتقال إلى القسم المعني'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setSelectedAnnouncement(null);
                    setIsAllAnnouncementsOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  كافة المواضيع والإعلانات
                </button>
              </div>

              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. ALL ANNOUNCEMENTS & TOPICS BOARD
  // =========================================================================
  if (isAllAnnouncementsOpen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-emerald-100 text-right overflow-hidden">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold font-display">
                  لوحة الإعلانات والمواضيع المصورة
                </h3>
                <p className="text-xs text-emerald-200">
                  المدرسة الثانوية 102 للبنات بجدة • الشراكة التكاملية مع الأسرة والمجتمع
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsAllAnnouncementsOpen(false);
                  setIsAddAnnouncementOpen(true);
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة موضوع مصور</span>
              </button>

              <button
                onClick={() => setIsAllAnnouncementsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                  activeFilter === 'all' 
                    ? 'bg-emerald-800 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                الكل ({announcements.length})
              </button>
              {(['عاجل', 'دعوة', 'هام', 'فعالية', 'تنويه'] as AnnouncementPriority[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setActiveFilter(p)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
                    activeFilter === p 
                      ? 'bg-emerald-800 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="بحث في الإعلانات والمواضيع..."
                className="w-full pr-9 pl-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              />
            </div>
          </div>

          {/* Topics Grid View */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {filteredAnnouncements.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Megaphone className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-medium">لا توجد إعلانات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAnnouncements.map((ann) => {
                  const style = getPriorityStyle(ann.priority);

                  return (
                    <div
                      key={ann.id}
                      className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-400 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                    >
                      {/* Image Banner */}
                      <div 
                        onClick={() => setSelectedAnnouncement(ann)}
                        className="h-36 w-full relative overflow-hidden bg-slate-900 cursor-pointer"
                      >
                        {ann.imageUrl ? (
                          <img 
                            src={ann.imageUrl} 
                            alt={ann.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 flex items-center justify-center text-emerald-300">
                            <ImageIcon className="w-10 h-10 opacity-30" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                        {/* Overlaid Badges */}
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${style.badge} shadow-xs`}>
                            {ann.priority}
                          </span>
                          {ann.category && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900/80 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                              {ann.category}
                            </span>
                          )}
                        </div>

                        {ann.date && (
                          <div className="absolute bottom-2 right-2.5 text-[11px] text-slate-200 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-xs">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>{ann.date}</span>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 
                              onClick={() => setSelectedAnnouncement(ann)}
                              className="font-bold text-sm text-slate-900 group-hover:text-emerald-800 transition-colors cursor-pointer font-display leading-snug line-clamp-2"
                            >
                              {ann.title}
                            </h4>

                            {userRole === 'coordinator' && (
                              <button
                                onClick={() => deleteAnnouncement(ann.id)}
                                title="حذف الموضوع"
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                            {ann.summary}
                          </p>
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                          <span className="text-[11px] text-slate-500 truncate max-w-[140px]">
                            {ann.targetAudience || 'المجتمع المدرسي'}
                          </span>

                          <div className="flex items-center gap-1.5">
                            {ann.linkTab && (
                              <button
                                onClick={() => {
                                  setActiveTab(ann.linkTab as ActiveTab);
                                  setIsAllAnnouncementsOpen(false);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 font-bold transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>{ann.actionLabel || 'متابعة'}</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            )}

                            <button
                              onClick={() => setSelectedAnnouncement(ann)}
                              className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                            >
                              التفاصيل
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>إجمالي المواضيع والإعلانات: {announcements.length} موضوعاً</span>
            <button
              onClick={() => setIsAllAnnouncementsOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    );
  }

  return null;
};
