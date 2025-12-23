import React, { useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  LayoutDashboard, 
  Settings, 
  Save,
  ArrowRightLeft,
  Calendar,
  Coins,
  User,
  Building2,
  FileWarning,
  Info,
  Clock,
  Link as LinkIcon,
  MapPin,
  ChevronDown,
  X
} from 'lucide-react';

// --- Types ---

type Category = 
  | 'Restaurant'
  | 'Fast Food'
  | 'Supermarket'
  | 'Cafe'
  | 'Pastry'
  | 'Protein'
  | 'Juice'
  | 'Fruit'
  | 'Herbal'
  | 'Cosmetics';

const CATEGORIES: Record<Category, string> = {
  'Restaurant': 'رستوران',
  'Fast Food': 'فست‌فود',
  'Supermarket': 'سوپرمارکت',
  'Cafe': 'کافه',
  'Pastry': 'شیرینی و دسر',
  'Protein': 'پروتئینی',
  'Juice': 'آبمیوه و بستنی',
  'Fruit': 'میوه و سبزیجات',
  'Herbal': 'عطاری',
  'Cosmetics': 'آرایشی و بهداشتی'
};

const CITIES = ['همه شهرها', 'تهران', 'مشهد', 'اصفهان', 'تبریز', 'شیراز', 'کرج', 'اهواز', 'قم'];

interface BannerImage {
  url: string;
  size: string;
}

interface Banner {
  id: string;
  name: string;
  companyName: string;
  designerName: string;
  isActive: boolean;
  city: string;
  images: BannerImage[];
  link: string;
  triggerCategory: Category;
  targetCategory: Category;
  totalViews: number;
  remainingViews: number;
  priority: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  pricePerView: number;
  totalBudget: number;
}

// --- Components ---

const Badge = ({ active }: { active: boolean }) => (
  <span className={`px-2 py-1 rounded-full text-[11px] font-bold inline-block border ${active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
    {active ? 'فعال' : 'غیرفعال'}
  </span>
);

const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
  <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
    <div className="p-1.5 bg-indigo-50 rounded-lg">
      <Icon className="w-5 h-5 text-indigo-600" />
    </div>
    <h2 className="text-lg font-bold text-gray-800">{title}</h2>
  </div>
);

const App = () => {
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: '1',
      name: 'کمپین تابستانه فست‌فود',
      companyName: 'مجموعه کی‌اف‌سی ایران',
      designerName: 'علی علوی',
      isActive: true,
      city: 'تهران',
      images: [{ url: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&q=80', size: '150KB' }],
      link: 'https://example.com/promo1',
      triggerCategory: 'Restaurant',
      targetCategory: 'Fast Food',
      totalViews: 5000,
      remainingViews: 1240,
      priority: 1,
      startDate: '2023-10-01',
      endDate: '2023-11-01',
      startTime: '08:00',
      endTime: '23:59',
      pricePerView: 500,
      totalBudget: 2500000,
    }
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<Partial<Banner>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openCreateMode = () => {
    setCurrentBanner({
      id: undefined,
      isActive: true,
      city: CITIES[1], // تهران به عنوان پیش‌فرض
      images: [],
      companyName: '',
      designerName: '',
      triggerCategory: 'Restaurant',
      targetCategory: 'Fast Food',
      totalViews: 0,
      remainingViews: 0,
      priority: 1,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startTime: '08:00',
      endTime: '23:59',
      pricePerView: 500,
      totalBudget: 1000000,
      link: '',
      name: ''
    });
    setIsEditing(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        const sizeInKB = Math.round(file.size / 1024) + 'KB';
        reader.onloadend = () => {
          setCurrentBanner(prev => ({
            ...prev,
            images: [...(prev.images || []), { url: reader.result as string, size: sizeInKB }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setCurrentBanner(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index)
    }));
  };

  const saveBanner = () => {
    // اطمینان از تعریف متغیرها قبل از استفاده
    const price = Number(currentBanner.pricePerView) || 0;
    const budget = Number(currentBanner.totalBudget) || 0;
    const calculated = price > 0 ? Math.floor(budget / price) : 0;
    const MIN_VIEWS = 500;

    if (!currentBanner.name || !currentBanner.companyName) {
      alert('لطفاً نام بنر و نام مجموعه را وارد کنید');
      return;
    }

    if (calculated < MIN_VIEWS && budget > 0) {
      alert(`تعداد نمایش نهایی (${calculated}) نمی‌تواند کمتر از ${MIN_VIEWS} عدد باشد. لطفاً بودجه را افزایش یا قیمت هر نمایش را کاهش دهید.`);
      return;
    }
    
    const bannerToSave = {
      ...currentBanner,
      id: currentBanner.id || Math.random().toString(36).substr(2, 9),
      totalViews: calculated,
      remainingViews: currentBanner.id ? (currentBanner.remainingViews ?? 0) : calculated,
      city: currentBanner.city || CITIES[0],
      isActive: currentBanner.isActive ?? true,
      priority: Number(currentBanner.priority) || 1
    } as Banner;

    if (currentBanner.id) {
      setBanners(prev => prev.map(b => b.id === currentBanner.id ? bannerToSave : b));
    } else {
      setBanners(prev => [bannerToSave, ...prev]);
    }
    setIsEditing(false);
  };

  const deleteBanner = (id: string) => {
    if (window.confirm('آیا از حذف این بنر اطمینان دارید؟')) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  const editBanner = (banner: Banner) => {
    setCurrentBanner({ ...banner });
    setIsEditing(true);
  };

  const MIN_PRICE = 200;
  const dispPrice = Number(currentBanner.pricePerView) || 0;
  const dispBudget = Number(currentBanner.totalBudget) || 0;
  const calculatedViews = dispPrice >= MIN_PRICE ? Math.floor(dispBudget / dispPrice) : 0;

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-right" dir="rtl">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-l border-gray-200 shadow-sm flex-shrink-0 relative z-30">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-2xl font-black text-indigo-700 tracking-tight">پنل ادمین بنر</h1>
          <p className="text-xs text-gray-400 mt-1 font-bold">مدیریت تبلیغات سفارش</p>
        </div>
        <nav className="p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-xl transition-all font-bold">
            <LayoutDashboard className="w-5 h-5" />
            <span>مدیریت بنرها</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-50 rounded-xl transition-all font-bold">
            <Settings className="w-5 h-5" />
            <span>تنظیمات سیستم</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto relative z-10">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {isEditing ? (currentBanner.id ? 'ویرایش جزئیات بنر' : 'ایجاد بنر جدید') : 'لیست بنرهای فعال'}
            </h2>
            <p className="text-gray-500 text-sm mt-1 font-bold">
              {isEditing ? 'تمامی مشخصات را در این صفحه مدیریت کنید.' : 'بنرهای نمایش داده شده در صفحه جزئیات سفارش را مدیریت کنید.'}
            </p>
          </div>
          {!isEditing && (
            <button 
              onClick={openCreateMode}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-indigo-100 font-bold"
            >
              <Plus className="w-5 h-5" />
              <span>ایجاد بنر جدید</span>
            </button>
          )}
        </header>

        {isEditing ? (
          /* Form Section */
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
              <SectionHeader icon={Building2} title="اطلاعات پایه و مشتری" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">نام مجموعه/شرکت تبلیغ‌دهنده</label>
                  <div className="relative">
                    <Building2 className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="نام شرکت مشتری..." 
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-800 font-bold"
                      value={currentBanner.companyName || ''}
                      onChange={e => setCurrentBanner({...currentBanner, companyName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">نام داخلی بنر</label>
                  <input 
                    type="text" 
                    placeholder="مثال: جشنواره عیدانه" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-800 font-bold"
                    value={currentBanner.name || ''}
                    onChange={e => setCurrentBanner({...currentBanner, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">شهر مورد نظر</label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 z-10" />
                    <select 
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white appearance-none font-bold text-gray-800 cursor-pointer block"
                      value={currentBanner.city || CITIES[1]}
                      onChange={e => setCurrentBanner({...currentBanner, city: e.target.value})}
                    >
                      {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                    </select>
                    <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700">وضعیت نمایش</label>
                  <div className="flex items-center gap-4 h-[50px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={currentBanner.isActive || false}
                        onChange={e => setCurrentBanner({...currentBanner, isActive: e.target.checked})}
                      />
                      <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"></div>
                      <span className="ms-3 text-sm font-bold text-gray-900">{currentBanner.isActive ? 'فعال' : 'غیرفعال'}</span>
                    </label>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-bold text-gray-700">لینک بنر (URL)</label>
                  <div className="relative">
                    <LinkIcon className="absolute right-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input 
                      type="url" 
                      placeholder="https://example.com/promo" 
                      className="w-full pr-10 pl-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none text-left bg-white font-bold" dir="ltr"
                      value={currentBanner.link || ''}
                      onChange={e => setCurrentBanner({...currentBanner, link: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload Area */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-bold text-gray-700">تصویر بنر</label>
                  <div className="flex items-center gap-2 text-[11px] text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 font-bold">
                    <FileWarning className="w-3 h-3" />
                    <span>JPG, PNG | حداکثر ۵۰۰ کیلوبایت</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {currentBanner.images?.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-200 shadow-sm">
                      <img src={img.url} className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-1 text-center font-bold">
                        {img.size}
                      </div>
                      <button 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all bg-white"
                  >
                    <Plus className="w-8 h-8" />
                    <span className="text-[10px] font-bold text-gray-500">آپلود عکس</span>
                  </button>
                  <input type="file" className="hidden" ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} />
                </div>
              </div>
            </div>

            {/* Pricing & Budget */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 md:p-8 bg-indigo-50/50 border-b border-gray-100">
                <SectionHeader icon={Coins} title="بودجه و قیمت‌گذاری" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">بودجه کل (تومان)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold text-gray-800"
                      value={currentBanner.totalBudget || 0}
                      onChange={e => setCurrentBanner({...currentBanner, totalBudget: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">قیمت هر نمایش (تومان)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold text-gray-800"
                      value={currentBanner.pricePerView || 0}
                      onChange={e => setCurrentBanner({...currentBanner, pricePerView: Number(e.target.value)})}
                    />
                    <p className="text-[11px] text-gray-400 font-bold">حداقل: {MIN_PRICE} تومان</p>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700">اولویت (رتبه)</label>
                    <input 
                      type="number" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-bold text-gray-800"
                      value={currentBanner.priority || 1}
                      onChange={e => setCurrentBanner({...currentBanner, priority: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-10 bg-white flex flex-col items-center">
                <div className="w-full max-w-xl bg-indigo-600 rounded-3xl p-8 text-center shadow-2xl shadow-indigo-100 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-white/10 p-2 rounded-bl-2xl">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div className="mb-2 text-indigo-100 text-sm font-bold">تعداد کل دفعات نمایش بنر:</div>
                  <div className="text-7xl font-black text-white mb-4 tabular-nums tracking-tighter">
                    {calculatedViews.toLocaleString()} <span className="text-xl font-bold opacity-80">بار</span>
                  </div>
                  <div className="inline-flex items-center gap-2 bg-indigo-700/50 px-5 py-2 rounded-full text-indigo-100 text-[11px] border border-indigo-400/20 font-bold">
                    <span>فرمول: بودجه کل ÷ قیمت نمایش</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Timing & Targeting */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <SectionHeader icon={ArrowRightLeft} title="هدف‌گیری نمایش" />
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500">اگر کاربر از این دسته‌بندی سفارش داد:</label>
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 bg-white font-bold text-gray-800 appearance-none cursor-pointer block" 
                          value={currentBanner.triggerCategory} 
                          onChange={e => setCurrentBanner({...currentBanner, triggerCategory: e.target.value as Category})}
                        >
                          {Object.entries(CATEGORIES).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="bg-indigo-600 p-2 rounded-full text-white shadow-xl">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-500">بنر مربوط به این دسته را نشان بده:</label>
                      <div className="relative">
                        <select 
                          className="w-full px-4 py-3 rounded-xl border border-indigo-100 outline-none bg-indigo-50 font-bold text-indigo-700 appearance-none cursor-pointer block" 
                          value={currentBanner.targetCategory} 
                          onChange={e => setCurrentBanner({...currentBanner, targetCategory: e.target.value as Category})}
                        >
                          {Object.entries(CATEGORIES).map(([val, label]) => <option key={val} value={val}>{label}</option>)}
                        </select>
                        <ChevronDown className="absolute left-3 top-3.5 w-4 h-4 text-indigo-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                  <SectionHeader icon={Calendar} title="زمان‌بندی نمایش" />
                  <div className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-400 font-bold">تاریخ شروع</span>
                        <input type="date" className="w-full px-3 py-3 rounded-xl border border-gray-100 outline-none bg-white font-bold" value={currentBanner.startDate} onChange={e => setCurrentBanner({...currentBanner, startDate: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-400 font-bold">تاریخ پایان</span>
                        <input type="date" className="w-full px-3 py-3 rounded-xl border border-gray-100 outline-none bg-white font-bold" value={currentBanner.endDate} onChange={e => setCurrentBanner({...currentBanner, endDate: e.target.value})} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> ساعت شروع</span>
                        <input type="time" className="w-full px-3 py-3 rounded-xl border border-gray-100 outline-none bg-white font-bold" value={currentBanner.startTime} onChange={e => setCurrentBanner({...currentBanner, startTime: e.target.value})} />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] text-gray-400 font-bold flex items-center gap-1"><Clock className="w-3 h-3"/> ساعت پایان</span>
                        <input type="time" className="w-full px-3 py-3 rounded-xl border border-gray-100 outline-none bg-white font-bold" value={currentBanner.endTime} onChange={e => setCurrentBanner({...currentBanner, endTime: e.target.value})} />
                      </div>
                    </div>
                  </div>
               </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-6 pb-12 border-t border-gray-100">
              <button 
                type="button"
                onClick={saveBanner} 
                className="flex items-center gap-2 px-14 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-100 transition-all transform active:scale-95"
              >
                <Save className="w-5 h-5" />
                <span>ذخیره نهایی و انتشار</span>
              </button>
              <button 
                type="button"
                onClick={() => setIsEditing(false)} 
                className="text-gray-400 hover:text-gray-600 font-bold px-8 py-4 transition-colors"
              >
                انصراف و بازگشت
              </button>
            </div>
          </div>
        ) : (
          /* List Section */
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                    <th className="p-8">بنر و مجموعه</th>
                    <th className="p-8 text-center">وضعیت</th>
                    <th className="p-8">هدف‌گیری (از ➔ به)</th>
                    <th className="p-8">دوره زمانی</th>
                    <th className="p-8">نمایش</th>
                    <th className="p-8 text-center">اولویت</th>
                    <th className="p-8 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {banners.length === 0 ? (
                    <tr><td colSpan={7} className="p-16 text-center text-gray-400 font-bold">هیچ بنری یافت نشد. بنر جدیدی ایجاد کنید.</td></tr>
                  ) : (
                    banners.map(banner => (
                      <tr key={banner.id} className="hover:bg-indigo-50/40 transition-all">
                        <td className="p-8">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm flex-shrink-0">
                              {banner.images[0] ? (
                                <img src={banner.images[0].url} className="w-full h-full object-cover" />
                              ) : (
                                <ImageIcon className="w-full h-full p-3 text-gray-200" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900 text-base leading-tight mb-1">{banner.name}</div>
                              <div className="text-[11px] text-indigo-500 font-bold flex items-center gap-2">
                                <Building2 className="w-3 h-3 opacity-60" />
                                <span>{banner.companyName} | {banner.city}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-center"><Badge active={banner.isActive} /></td>
                        <td className="p-8">
                          <div className="flex flex-col gap-2 min-w-[180px]">
                            <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100">
                               <span className="text-[10px] font-black text-gray-400 bg-white px-1.5 py-0.5 rounded shadow-sm">از:</span>
                               <span className="text-[11px] font-bold text-gray-700">{CATEGORIES[banner.triggerCategory]}</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100 shadow-sm">
                               <span className="text-[10px] font-black text-indigo-400 bg-white px-1.5 py-0.5 rounded shadow-sm">به:</span>
                               <span className="text-[11px] font-black text-indigo-700">{CATEGORIES[banner.targetCategory]}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex flex-col gap-1 text-[11px] font-bold">
                            <div className="text-gray-500 tabular-nums flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 opacity-40" /> {banner.startDate} تا {banner.endDate}
                            </div>
                            <div className="text-indigo-600 tabular-nums flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 opacity-40" /> {banner.startTime} - {banner.endTime}
                            </div>
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="w-full max-w-[140px]">
                            <div className="flex justify-between text-[11px] mb-1.5 font-black">
                               <span className="text-gray-400 tabular-nums">{banner.remainingViews.toLocaleString()} مانده</span>
                               <span className="text-indigo-600 tabular-nums">{banner.totalViews > 0 ? Math.round((banner.remainingViews/banner.totalViews) * 100) : 0}%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${banner.totalViews > 0 ? (banner.remainingViews/banner.totalViews) * 100 : 0}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-8 text-center">
                          <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-100 text-gray-700 font-black text-sm border border-gray-200">
                            {banner.priority}
                          </div>
                        </td>
                        <td className="p-8">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => editBanner(banner)} className="p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"><Settings className="w-5 h-5" /></button>
                            <button onClick={() => deleteBanner(banner.id)} className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
               <div className="text-[12px] text-gray-400 font-bold">کل بنرها: {banners.length} مورد</div>
               <div className="flex gap-2">
                 <button className="px-4 py-2 text-[11px] font-black text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm">قبلی</button>
                 <button className="px-4 py-2 text-[11px] font-black text-white bg-indigo-600 rounded-xl">۱</button>
                 <button className="px-4 py-2 text-[11px] font-black text-gray-400 bg-white border border-gray-200 rounded-xl shadow-sm">بعدی</button>
               </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);