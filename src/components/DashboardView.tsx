import React, { useMemo } from 'react';
import {
  TrendingUp,
  CreditCard,
  DollarSign,
  Package,
  ShoppingCart,
  Mic,
  MessageSquare,
  Bot,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Calendar,
  Store,
  ChevronRight,
  Award,
  BookOpen
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { speakTextWithMaleVoice } from '../utils/speechHelper';

interface DashboardViewProps {
  onNavigateTab: (tab: string, subTab?: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const {
    products,
    customers,
    sales,
    expenses,
    settings,
    setIsVoiceCartOpen,
    setIsLiveVoiceOpen
  } = useKhata();

  const todayStr = new Date().toISOString().slice(0, 10);
  const currencySymbol = settings?.currency || '৳';

  // Today's metrics (local date safe)
  const todaySales = useMemo(() => {
    const todayLocal = new Date().toDateString();
    return (sales || []).filter(
      (s) => s && s.date && (new Date(s.date).toDateString() === todayLocal || s.date.startsWith(todayStr))
    );
  }, [sales, todayStr]);

  const todayRevenue = useMemo(() => {
    return todaySales.reduce((sum, s) => sum + (s?.total || 0), 0);
  }, [todaySales]);

  const todayPaid = useMemo(() => {
    return todaySales.reduce((sum, s) => sum + (s?.paid || 0), 0);
  }, [todaySales]);

  const todayDue = useMemo(() => {
    return todaySales.reduce((sum, s) => sum + (s?.due || 0), 0);
  }, [todaySales]);

  const totalDueSum = useMemo(() => {
    return (customers || []).reduce((sum, c) => sum + (c?.totalDue || 0), 0);
  }, [customers]);

  const lowStockItems = useMemo(() => {
    return (products || []).filter((p) => p && p.stock <= (p.minStock ?? 5));
  }, [products]);

  return (
    <div className="space-y-5 sm:space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Pinterest Dark Hero Card: "EXPLORE FRESH COMMODITIES & DIGITAL KHATA" */}
      <div className="bg-[#222120] text-white rounded-3xl p-5 sm:p-7 shadow-xl relative overflow-hidden border border-[#38332E]">
        {/* Subtle Decorative Star Sparkles from Pinterest Reference */}
        <div className="absolute top-4 right-4 text-[#DEC8B3]/20 text-4xl select-none pointer-events-none hidden sm:block">
          ✦
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#35312C] text-[#DEC8B3] border border-[#48423B]">
              <span className="text-[#B2825C]">✦</span>
              <span>আজকের ব্যবসার হালচাল ও ডিজিটাল খাতা</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#FAF7F2] tracking-tight">
              স্বাগতম, {settings?.ownerName || 'দোকানদার ভাই'}!
            </h2>
            <p className="text-xs sm:text-sm text-[#C7BEB5] leading-relaxed">
              {settings?.shopName || 'মুদির দোকান খাতা'} — ক্যাশ কাউন্টার, বাকি খাতা ও এআই সহকারী সম্পূর্ণ প্রস্তুত।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setIsVoiceCartOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#FAF7F2] hover:bg-white text-[#222120] rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-[#B2825C] animate-pulse" />
              <span>ভয়েস কার্ট</span>
            </button>

            {/* Live Voice ("ডায়মন্ড" / Sparkles button) */}
            <button
              type="button"
              onClick={() => setIsLiveVoiceOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#FAF7F2]" />
              <span>লাইভ এআই ভয়েস</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary KPI Cards (Pinterest Warm Aesthetic) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {/* Today's Sales */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <div className="flex items-center justify-between text-[#7A6E65] text-xs font-semibold">
            <span>আজকের মোট বিক্রয়</span>
            <div className="w-7 h-7 rounded-lg bg-[#F5EEE7] text-[#B2825C] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-black text-[#B2825C] mt-2">
            {currencySymbol}{todayRevenue.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#7A6E65] mt-1 font-medium">
            মোট {todaySales.length}টি বিক্রয় সম্পন্ন
          </p>
        </div>

        {/* Cash Collected Today */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <div className="flex items-center justify-between text-[#7A6E65] text-xs font-semibold">
            <span>আজকের নগদ আদায়</span>
            <div className="w-7 h-7 rounded-lg bg-[#EBF4EE] text-[#4A7C59] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-black text-[#4A7C59] mt-2">
            {currencySymbol}{todayPaid.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#7A6E65] mt-1 font-medium">
            ক্যাশ ও ডিজিটাল পেমেন্ট
          </p>
        </div>

        {/* Total Due in Shop */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <div className="flex items-center justify-between text-[#7A6E65] text-xs font-semibold">
            <span>সর্বমোট বাকি পাওনা</span>
            <div className="w-7 h-7 rounded-lg bg-[#FDF0EE] text-[#C25B4E] flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-black text-[#C25B4E] mt-2">
            {currencySymbol}{totalDueSum.toLocaleString()}
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#C25B4E] mt-1 font-medium">
            আজকের বাকি: {currencySymbol}{todayDue.toLocaleString()}
          </p>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <div className="flex items-center justify-between text-[#7A6E65] text-xs font-semibold">
            <span>কম স্টক পণ্য</span>
            <div className="w-7 h-7 rounded-lg bg-[#FCF6EB] text-[#B87B2E] flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-2xl font-black text-[#B87B2E] mt-2">
            {lowStockItems.length}টি আইটেম
          </p>
          <p className="text-[10px] sm:text-[11px] text-[#7A6E65] mt-1 font-medium">
            পুনরায় অর্ডার করার সময় হয়েছে
          </p>
        </div>
      </div>

      {/* FULLY FUNCTIONAL FEATURE CARDS (Pinterest Warm Style) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black text-[#232323] uppercase tracking-wider flex items-center gap-1.5">
            <span className="text-[#B2825C]">✦</span>
            <span>দোকানের প্রয়োজনীয় সেবা ও ফিচারসমূহ</span>
          </h3>
          <span className="text-[10px] font-bold text-[#8C827A] bg-[#F5EEE7] px-2 py-0.5 rounded-full border border-[#DEC4AD]">
            মোবাইল ফ্রেন্ডলি
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {/* Card 1: POS Cash Counter */}
          <div
            onClick={() => onNavigateTab('pos')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5EEE7] text-[#B2825C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#DEC4AD]">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#232323] text-sm sm:text-base">ক্যাশ কাউন্টার (POS)</h4>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                দ্রুত পণ্য স্ক্যান বা ক্লিক করে কার্টে নিন, নগদ ও বাকি মেমো তৈরি ও প্রিন্ট করুন।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#B2825C]">
              <span>কাউন্টার খুলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Due Khata Ledger */}
          <div
            onClick={() => onNavigateTab('due_khata')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FDF0EE] text-[#C25B4E] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#F5CBC5]">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#232323] text-sm sm:text-base">বাকির খাতা ও এসএমএস</h4>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                কোন গ্রাহকের কাছে কত বাকি, এসএমএস রিমাইন্ডার পাঠান ও ক্যাশ কালেকশন আপডেট করুন।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#C25B4E]">
              <span>খাতা খুলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Inventory Stock & AI OCR Scanner */}
          <div
            onClick={() => onNavigateTab('inventory')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5EEE7] text-[#B2825C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#DEC4AD]">
                <Package className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-[#232323] text-sm sm:text-base">পণ্য স্টক ও এআই স্ক্যানার</h4>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                ক্রয় ও বিক্রয় মূল্য নির্ধারণ, কম স্টক এলার্ট এবং ক্যামেরায় পণ্য স্ক্যান করে স্বয়ংক্রিয় এন্ট্রি।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#B2825C]">
              <span>ইনভেন্টরি দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Multi-turn AI Chat & Live Market Rates */}
          <div
            onClick={() => onNavigateTab('ai_assistant')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5EEE7] text-[#83593B] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#DEC4AD]">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#232323] text-sm sm:text-base">এআই সহকারী ও বাজার দর</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F5EEE7] text-[#83593B] border border-[#DEC4AD]">
                  সক্রিয়
                </span>
              </div>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                লাইভ বাজার দর, চাল-ডাল-তেলের পাইকারি মূল্য ও ব্যবসায়িক পরামর্শ নিন।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#B2825C]">
              <span>এআই সহকারী খুলুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: 1-Page Resume / CV Builder */}
          <div
            onClick={() => onNavigateTab('resume')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5EEE7] text-[#B2825C] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#DEC4AD]">
                <Award className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#232323] text-sm sm:text-base">১ পাতার রেজুমে / সিভি</h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#B2825C] border border-[#DEC4AD]">
                  নতুন
                </span>
              </div>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                সুন্দর ও পরিচ্ছন্ন ফন্টে প্রস্তুত ১ পাতার A4 রেজুমে, সরাসরি প্রিন্ট ও ডাউনলোড।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#B2825C]">
              <span>রেজুমে দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Reports & Export */}
          <div
            onClick={() => onNavigateTab('reports')}
            className="p-4 sm:p-5 bg-white rounded-2xl border border-[#E8DFD3] hover:border-[#B2825C] hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#F5EEE7] text-[#7A6E65] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform border border-[#DEC4AD]">
                <Calendar className="w-5 h-5 text-[#B2825C]" />
              </div>
              <h4 className="font-bold text-[#232323] text-sm sm:text-base">মাসিক রিপোর্ট ও এক্সপোর্ট</h4>
              <p className="text-xs text-[#7A6E65] mt-1 line-clamp-2">
                দোকানের লাভ-লোকসান বিশ্লেষণ এবং এক ক্লিকে PDF ও Excel শিট ডাউনলোড করুন।
              </p>
            </div>
            <div className="mt-3.5 pt-3 border-t border-[#E8DFD3]/60 flex items-center justify-between text-xs font-bold text-[#B2825C]">
              <span>রিপোর্ট দেখুন</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* App Founder Profile Card */}
        <div className="bg-gradient-to-r from-[#241F1B] via-[#332A23] to-[#1E1915] border border-[#4D4135] rounded-3xl p-5 sm:p-6 text-[#FAF7F2] shadow-md flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-[#B2825C]/40 bg-[#1E1915] shrink-0 shadow-md">
              <img
                src="/merajul-islam.jpg"
                alt="মেরাজুল ইসলাম"
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'font-black', 'text-2xl', 'text-[#DEC4AD]');
                    target.parentElement.innerText = 'মে';
                  }
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DEC4AD] text-[#6E472A]">
                  অ্যাপ প্রতিষ্ঠাতা ও উদ্ভাবক
                </span>
                <span className="text-xs text-[#DEC8B3]">✦ এআই ভয়েস ও অটোমেশন</span>
              </div>
              <h3 className="text-lg font-bold text-white">
                {settings.founderName || 'মেরাজুল ইসলাম (Merajul Islam)'}
              </h3>
              <p className="text-xs text-[#C7BEB5] max-w-xl leading-relaxed">
                {settings.founderBio || 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস সম্পন্ন করেছেন এবং আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত এআই ও এআই অটোমেশন সফটওয়্যার ডেভেলপার।'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                const fName = settings.founderName || 'মেরাজুল ইসলাম';
                const fRole = settings.founderRole || 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা';
                const fBio = settings.founderBio || 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস সম্পন্ন করেছেন এবং আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত এআই ও সফটওয়্যার ডেভেলপার।';
                speakTextWithMaleVoice(`এই মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্মের প্রতিষ্ঠাতা ও উদ্ভাবক হলেন ${fName} (${fRole})। ${fBio} তাঁর এই দূরদর্শী উদ্যোগের অংশ হতে পেরে আমি অত্যন্ত গর্বিত!`, 'bn');
              }}
              className="flex-1 md:flex-initial px-3.5 py-2.5 bg-[#FAF7F2] hover:bg-white text-[#2B2723] rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#B2825C]" />
              <span>পুরুষ কণ্ঠে শুনুন</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('about')}
              className="px-4 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-200" />
              <span>সম্পূর্ণ পরিচিতি (About)</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="px-3.5 py-2.5 bg-[#40352C] hover:bg-[#504237] text-[#DEC8B3] border border-[#5C4C3E] rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              সেটিংস
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
