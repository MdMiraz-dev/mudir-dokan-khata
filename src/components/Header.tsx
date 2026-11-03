import React, { useState } from 'react';
import {
  Store,
  Search,
  Mic,
  ShoppingCart,
  Sparkles,
  Bot,
  Award,
  Menu,
  X,
  CreditCard,
  Package,
  FileText,
  DollarSign,
  BookOpen,
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const {
    settings,
    cart,
    setIsGlobalSearchOpen,
    setIsVoiceCartOpen,
    setIsLiveVoiceOpen
  } = useKhata();

  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const cartItemCount = (cart || []).reduce((sum, item) => sum + (item?.quantity || 0), 0);

  const navigationDrawerTabs = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড (Home)', icon: Store },
    { id: 'pos', label: 'ক্যাশ কাউন্টার (POS)', icon: ShoppingCart },
    { id: 'due_khata', label: 'বাকির খাতা ও এসএমএস', icon: CreditCard },
    { id: 'inventory', label: 'পণ্য স্টক ও এআই স্ক্যানার', icon: Package },
    { id: 'reports', label: 'মাসিক রিপোর্ট ও এক্সপোর্ট', icon: FileText },
    { id: 'expenses', label: 'দোকানের দৈনন্দিন খরচ', icon: DollarSign },
    { id: 'ai_assistant', label: 'এআই সহকারী ও বাজার দর', icon: Bot },
    { id: 'about', label: 'অ্যাপ প্রতিষ্ঠাতা পরিচিতি (About)', icon: Award },
    { id: 'resume', label: '১ পাতার প্রফেশনাল রেজুমে', icon: Award },
    { id: 'masail', label: 'ব্যবসায়িক মাসায়েল ও নীতি', icon: BookOpen },
    { id: 'settings', label: 'দোকান সেটিংস ও ব্যাকআপ', icon: SettingsIcon }
  ];

  const handleSelectTab = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFD3] shadow-xs w-full max-w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 py-2.5 flex items-center justify-between gap-1.5 sm:gap-3 w-full">
          {/* Logo & Shop Title */}
          <div
            className="flex items-center gap-2 sm:gap-2.5 cursor-pointer select-none shrink min-w-0"
            onClick={() => setActiveTab('pos')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#B2825C] text-white flex items-center justify-center shadow-xs shrink-0">
              <Store className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="leading-tight min-w-0">
              <h1 className="font-extrabold text-[#232323] text-xs sm:text-base truncate max-w-[105px] xs:max-w-[150px] sm:max-w-xs">
                {settings?.shopName || 'মুদির দোকান খাতা'}
              </h1>
              <p className="text-[10px] sm:text-xs text-[#B2825C] font-semibold flex items-center gap-1 truncate">
                <span>● সচল</span>
                <span className="text-[#DEC8B3]">|</span>
                <span className="text-[#7A6E65] truncate">{settings?.ownerName || 'দোকানদার ভাই'}</span>
              </p>
            </div>
          </div>

          {/* Global Search Bar (Desktop only) */}
          <div className="flex-1 max-w-md hidden md:flex items-center relative">
            <div
              onClick={() => setIsGlobalSearchOpen(true)}
              className="w-full flex items-center gap-2.5 px-3.5 py-2 bg-[#F5EEE7] hover:bg-[#ECDDCF]/60 text-[#7A6E65] rounded-2xl cursor-pointer transition-colors border border-[#E8DFD3]"
            >
              <Search className="w-4 h-4 text-[#A89C92]" />
              <span className="text-sm flex-1 truncate font-medium">পণ্য বা গ্রাহকের নাম দিয়ে খুঁজুন...</span>
              <button
                type="button"
                title="ভয়েস সার্চ"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsGlobalSearchOpen(true);
                }}
                className="p-1 rounded-lg bg-white hover:bg-[#FAF7F2] text-[#B2825C] border border-[#DEC8B3] transition-colors"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Actions / AI Voice / Cart Buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Search Button (Mobile & Desktop) */}
            <button
              type="button"
              onClick={() => setIsGlobalSearchOpen(true)}
              title="সার্চ ও অনুসন্ধান"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white hover:bg-[#F5EEE7] text-[#232323] border border-[#E8DFD3] flex items-center justify-center transition-colors shadow-2xs"
            >
              <Search className="w-4 h-4 text-[#7A6E65]" />
            </button>

            {/* Voice Cart Button */}
            <button
              type="button"
              onClick={() => setIsVoiceCartOpen(true)}
              className="w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-xl bg-white hover:bg-[#F5EEE7] text-[#B2825C] border border-[#E8DFD3] flex items-center justify-center gap-1.5 font-medium text-xs sm:text-sm transition-all shadow-2xs"
              title="ভয়েস কার্ট - মুখে বলে কার্টে যোগ করুন"
            >
              <Mic className="w-4 h-4 text-[#B2825C] animate-pulse" />
              <span className="hidden sm:inline font-bold">ভয়েস কার্ট</span>
            </button>

            {/* Live AI Voice Assistant ("ডায়মন্ড" / Sparkles button) - Strictly contained, never overflows */}
            <button
              type="button"
              onClick={() => setIsLiveVoiceOpen(true)}
              className="w-8 h-8 sm:w-auto sm:px-2.5 sm:py-1.5 rounded-xl bg-[#F5EEE7] hover:bg-[#ECDDCF] text-[#83593B] border border-[#DEC4AD] flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm transition-all shadow-2xs active:scale-95"
              title="লাইভ এআই ভয়েস সহকারী (পুরুষ কণ্ঠ)"
            >
              <Sparkles className="w-4 h-4 text-[#B2825C]" />
              <span className="hidden lg:inline">লাইভ ভয়েস</span>
            </button>

            {/* AI Advisor Shortcut (Desktop only) */}
            <button
              type="button"
              onClick={() => setActiveTab('ai_assistant')}
              className={`hidden md:flex p-2 rounded-xl border transition-all ${
                activeTab === 'ai_assistant'
                  ? 'bg-[#B2825C] text-white border-[#B2825C]'
                  : 'bg-white hover:bg-[#F5EEE7] text-[#7A6E65] border-[#E8DFD3]'
              }`}
              title="এআই উপদেষ্টা ও বাজার দর"
            >
              <Bot className="w-4 h-4" />
            </button>

            {/* Resume Button (Desktop only) */}
            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                activeTab === 'resume'
                  ? 'bg-[#B2825C] text-white border-[#B2825C] shadow-xs'
                  : 'bg-white hover:bg-[#F5EEE7] text-[#7A6E65] border-[#E8DFD3]'
              }`}
              title="১ পাতার প্রফেশনাল রেজুমে / সিভি"
            >
              <Award className="w-4 h-4 text-[#B2825C]" />
              <span>সিভি</span>
            </button>

            {/* About / Founder Button (Desktop only) */}
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-bold ${
                activeTab === 'about'
                  ? 'bg-[#B2825C] text-white border-[#B2825C] shadow-xs'
                  : 'bg-white hover:bg-[#F5EEE7] text-[#7A6E65] border-[#E8DFD3]'
              }`}
              title="অ্যাপ প্রতিষ্ঠাতা মেরাজুল ইসলামের পরিচিতি"
            >
              <Sparkles className="w-4 h-4 text-[#B2825C]" />
              <span>পরিচিতি</span>
            </button>

            {/* Cart Counter Button */}
            <button
              type="button"
              onClick={() => setActiveTab('pos')}
              className="relative w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-xl bg-[#B2825C] hover:bg-[#9E6F4B] text-white flex items-center justify-center gap-1.5 font-bold text-xs sm:text-sm transition-all shadow-xs shrink-0"
              title="ক্যাশ কাউন্টার"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">কাউন্টার</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C25B4E] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border-2 border-white">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Drawer Button (Mobile only) */}
            <button
              type="button"
              onClick={() => setIsMobileDrawerOpen(true)}
              title="সব মেনু"
              className="md:hidden w-8 h-8 rounded-xl bg-white hover:bg-[#F5EEE7] text-[#232323] border border-[#E8DFD3] flex items-center justify-center shadow-2xs"
            >
              <Menu className="w-4 h-4 text-[#7A6E65]" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-over */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-4/5 max-w-xs bg-[#FAF7F2] h-full shadow-2xl p-4 flex flex-col justify-between border-l border-[#E8DFD3] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD3] mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#B2825C] text-white flex items-center justify-center shadow-xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#232323] truncate max-w-[160px]">
                      {settings?.shopName || 'মুদির দোকান'}
                    </h3>
                    <p className="text-[10px] text-[#B2825C] font-semibold">মেনু ও ফিচারসমূহ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-[#E8DFD3] text-[#7A6E65]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-1">
                {navigationDrawerTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                        isActive
                          ? 'bg-[#B2825C] text-white shadow-xs'
                          : 'bg-white hover:bg-[#F5EEE7] text-[#232323] border border-[#E8DFD3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Drawer Actions */}
            <div className="pt-4 border-t border-[#E8DFD3] space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsLiveVoiceOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#F5EEE7] text-[#83593B] border border-[#DEC4AD] text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 text-[#B2825C]" />
                <span>লাইভ এআই ভয়েস সহকারী</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileDrawerOpen(false);
                  setIsVoiceCartOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white text-[#232323] border border-[#E8DFD3] text-xs font-bold"
              >
                <Mic className="w-4 h-4 text-[#B2825C]" />
                <span>ভয়েস কার্ট শুরু করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
