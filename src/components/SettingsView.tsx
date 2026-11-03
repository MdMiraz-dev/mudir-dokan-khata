import React, { useState, useRef } from 'react';
import {
  Settings,
  Store,
  User,
  Phone,
  MapPin,
  Volume2,
  Palette,
  Shield,
  Download,
  Upload,
  CheckCircle,
  Sparkles,
  Award
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { speakTextWithMaleVoice } from '../utils/speechHelper';

export const SettingsView: React.FC = () => {
  const { settings, updateSettings, products, customers, sales, expenses, masalaRules } = useKhata();

  const [shopName, setShopName] = useState(settings.shopName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [currency, setCurrency] = useState(settings.currency);
  const [colorTheme, setColorTheme] = useState(settings.colorTheme);
  const [voiceGender, setVoiceGender] = useState(settings.voiceGender);
  const [voiceAutoSpeak, setVoiceAutoSpeak] = useState(settings.voiceAutoSpeak);
  
  // Founder / Creator Profile state
  const [founderName, setFounderName] = useState(settings.founderName || 'মেরাজুল ইসলাম (Merajul Islam)');
  const [founderRole, setFounderRole] = useState(
    settings.founderRole || 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা'
  );
  const [founderBio, setFounderBio] = useState(
    settings.founderBio ||
      'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার।'
  );
  const [founderPhone, setFounderPhone] = useState(settings.founderPhone || '০১৭১১-০০০০০০');
  const [founderLocation, setFounderLocation] = useState(settings.founderLocation || 'বড়তল্লা, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া');
  const [founderFatherName, setFounderFatherName] = useState(settings.founderFatherName || 'মো. আব্দুল কাদির');
  const [founderFacebook, setFounderFacebook] = useState(settings.founderFacebook || 'https://www.facebook.com/mdmiraz.dev');
  const [founderWebsite, setFounderWebsite] = useState(settings.founderWebsite || 'https://mdmiraz-dev.github.io/');
  const [founderYouTube, setFounderYouTube] = useState(settings.founderYouTube || 'https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB');
  const [founderGitHub, setFounderGitHub] = useState(settings.founderGitHub || 'https://github.com/MdMiraz-dev');

  const [saveFeedback, setSaveFeedback] = useState(false);

  const importFileRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      shopName: shopName.trim(),
      ownerName: ownerName.trim(),
      founderName: founderName.trim(),
      founderRole: founderRole.trim(),
      founderBio: founderBio.trim(),
      founderPhone: founderPhone.trim(),
      founderLocation: founderLocation.trim(),
      founderFatherName: founderFatherName.trim(),
      founderFacebook: founderFacebook.trim(),
      founderWebsite: founderWebsite.trim(),
      founderYouTube: founderYouTube.trim(),
      founderGitHub: founderGitHub.trim(),
      phone: phone.trim(),
      address: address.trim(),
      currency: currency.trim() || '৳',
      colorTheme,
      voiceGender,
      voiceAutoSpeak
    });

    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const testFounderVoice = () => {
    const intro = `এই মুদির দোকান খাতা স্মার্ট এআই অ্যাপটির প্রতিষ্ঠাতা ও স্বপ্নদ্রষ্টা হলেন ${founderName} (${founderRole})। ${founderBio} তাঁর এই দূরদর্শী উদ্যোগের অংশ হতে পেরে আমি অত্যন্ত গর্বিত!`;
    speakTextWithMaleVoice(intro, 'bn');
  };

  const testVoiceFeedback = () => {
    speakTextWithMaleVoice('আসসালামু আলাইকুম দোকানদার ভাই। আমি আপনার মুদির খাতার স্মার্ট পুরুষ কণ্ঠের এআই সহকারী।', 'bn');
  };

  // Export full JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      settings,
      products,
      customers,
      sales,
      expenses,
      masalaRules
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Remix-Grocery-Backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.products && Array.isArray(data.products)) {
          localStorage.setItem('grocer_products', JSON.stringify(data.products));
        }
        if (data.customers && Array.isArray(data.customers)) {
          localStorage.setItem('grocer_customers', JSON.stringify(data.customers));
        }
        if (data.sales && Array.isArray(data.sales)) {
          localStorage.setItem('grocer_sales', JSON.stringify(data.sales));
        }
        if (data.expenses && Array.isArray(data.expenses)) {
          localStorage.setItem('grocer_expenses', JSON.stringify(data.expenses));
        }
        if (data.settings) {
          localStorage.setItem('grocer_settings', JSON.stringify(data.settings));
        }
        alert('ব্যাকআপ সফলভাবে রিস্টোর হয়েছে! পেজ রিফ্রেশ হচ্ছে...');
        window.location.reload();
      } catch (err) {
        alert('ভুল ফাইল ফরম্যাট। সঠিক JSON ব্যাকআপ ফাইল নির্বাচন করুন।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">দোকান প্রোফাইল ও সেটিংস</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            দোকানের নাম, প্রিন্ট রসিদ হেডার, থিম এবং এআই পুরুষ কণ্ঠ কনফিগারেশন
          </p>
        </div>

        {saveFeedback && (
          <div className="px-3 py-1.5 bg-[#F5EEE7] text-[#6E472A] rounded-xl text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>সংরক্ষিত হয়েছে!</span>
          </div>
        )}
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* Shop Info Card */}
        <div className="bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Store className="w-4 h-4 text-[#B2825C]" />
            <span>দোকানের প্রাথমিক তথ্য (রসিদে প্রদর্শিত হবে)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">দোকানের নাম *</label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">প্রোপ্রাইটর / মালিকের নাম</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">যোগাযোগ মোবাইল নম্বর</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">দোকানের ঠিকানা / বাজার</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">মুদ্রা প্রতীক (Currency)</label>
              <input
                type="text"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold"
              />
            </div>
          </div>
        </div>

        {/* Founder & Creator Identity Card */}
        <div className="bg-gradient-to-br from-white to-[#FBF8F5] rounded-2xl border-2 border-[#D9BEA7] p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD3] pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#B2825C]" />
              <span>অ্যাপ প্রতিষ্ঠাতা ও নির্মাতার পরিচয় (Founder Profile)</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                এআই কণ্ঠ পরিচিতি
              </span>
            </h3>

            <button
              type="button"
              onClick={testFounderVoice}
              className="px-3 py-1.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              title="এআই পুরুষ কণ্ঠে প্রতিষ্ঠাতা পরিচয় শুনুন"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>পুরুষ কণ্ঠে প্রতিষ্ঠাতা পরিচয় শুনুন</span>
            </button>
          </div>

          <div className="p-3 bg-[#F5EEE7]/60 border border-[#E8DFD3] rounded-xl text-xs text-[#6E472A] leading-relaxed flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#B2825C] shrink-0 mt-0.5" />
            <p>
              <strong>সিস্টেম প্রস্তুত:</strong> কেউ যদি এআই সহকারীকে মুখে বলে বা লিখে জিজ্ঞাসা করে <em>"এই অ্যাপসের প্রতিষ্ঠাতা কে?"</em> বা <em>"কে অ্যাপসটা বানাইছে?"</em>, এআই পুরুষ কণ্ঠে শ্রদ্ধা ও গর্বের সাথে আপনার নাম ও এই পরিচয় উপস্থাপন করবে।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রতিষ্ঠাতা / নির্মাতার নাম *
              </label>
              <input
                type="text"
                required
                value={founderName}
                onChange={(e) => setFounderName(e.target.value)}
                placeholder="যেমন: মোহাম্মদ তুশান"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold text-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                পদবী ও পরিচিতি (Role / Designation)
              </label>
              <input
                type="text"
                value={founderRole}
                onChange={(e) => setFounderRole(e.target.value)}
                placeholder="মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্মের প্রতিষ্ঠাতা ও উদ্ভাবক"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                প্রতিষ্ঠার উদ্দেশ্য ও ভিশন (Bio & Vision Statement)
              </label>
              <textarea
                rows={3}
                value={founderBio}
                onChange={(e) => setFounderBio(e.target.value)}
                placeholder="অ্যাপ তৈরির প্রেক্ষাপট ও ভিশন..."
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white leading-relaxed text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                প্রতিষ্ঠাতার যোগাযোগ নম্বর / ফোন
              </label>
              <input
                type="text"
                value={founderPhone}
                onChange={(e) => setFounderPhone(e.target.value)}
                placeholder="০১৭০০-০০০০০০"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                পিতার নাম
              </label>
              <input
                type="text"
                value={founderFatherName}
                onChange={(e) => setFounderFatherName(e.target.value)}
                placeholder="মো. আব্দুল কাদির"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                স্থায়ী ঠিকানা / এলাকা
              </label>
              <input
                type="text"
                value={founderLocation}
                onChange={(e) => setFounderLocation(e.target.value)}
                placeholder="বড়তল্লা, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                পোর্টফোলিও ওয়েবসাইট লিংক
              </label>
              <input
                type="url"
                value={founderWebsite}
                onChange={(e) => setFounderWebsite(e.target.value)}
                placeholder="https://mdmiraz-dev.github.io/"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ফেসবুক প্রোফাইল লিংক
              </label>
              <input
                type="url"
                value={founderFacebook}
                onChange={(e) => setFounderFacebook(e.target.value)}
                placeholder="https://www.facebook.com/mdmiraz.dev"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                ইউটিউব চ্যানেল লিংক
              </label>
              <input
                type="url"
                value={founderYouTube}
                onChange={(e) => setFounderYouTube(e.target.value)}
                placeholder="https://youtube.com/@mdmiraz-489"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                গিটহাব লিংক
              </label>
              <input
                type="url"
                value={founderGitHub}
                onChange={(e) => setFounderGitHub(e.target.value)}
                placeholder="https://github.com/MdMiraz-dev"
                className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden text-slate-800 bg-white"
              />
            </div>
          </div>
        </div>

        {/* AI & Male Voice Settings Card */}
        <div className="bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Volume2 className="w-4 h-4 text-[#B2825C]" />
            <span>এআই ভয়েস সহকারী ও পুরুষ কণ্ঠের সেটিংস</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                এআই কণ্ঠের ধরণ (Voice Persona):
              </label>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setVoiceGender('male')}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                    voiceGender === 'male'
                      ? 'bg-[#F5EEE7] border-[#B2825C] ring-2 ring-[#B2825C]/20 text-[#452E1E]'
                      : 'border-[#E8DFD3] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold flex items-center gap-1.5">
                    <span>👨 পুরুষ কণ্ঠ (Male Voice - Puck)</span>
                    <span className="text-[10px] bg-[#DEC4AD] text-[#6E472A] px-1.5 py-0.2 rounded-sm">সক্রিয়</span>
                  </p>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    গম্ভীর, স্পষ্ট ও স্বাভাবিক পুরুষ কণ্ঠে সকল পরামর্শ ও উত্তর শোনাবে
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceGender('female')}
                  className={`p-3 rounded-xl border text-left font-semibold transition-all ${
                    voiceGender === 'female'
                      ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20 text-purple-900'
                      : 'border-[#E8DFD3] text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold">👩 নারী কণ্ঠ (Female Voice)</p>
                  <p className="text-[11px] text-slate-500 font-normal mt-0.5">
                    নরম ও নম্র নারী কণ্ঠে উত্তর শোনাবে
                  </p>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={voiceAutoSpeak}
                  onChange={(e) => setVoiceAutoSpeak(e.target.checked)}
                  className="rounded-sm text-[#B2825C] focus:ring-[#B2825C] w-4 h-4"
                />
                <span>এআই মেসেজ দিলে সরাসরি পুরুষ কণ্ঠে স্বয়ংক্রিয়ভাবে পড়ে শোনাবে</span>
              </label>

              <button
                type="button"
                onClick={testVoiceFeedback}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#B2825C]" />
                <span>কণ্ঠ পরীক্ষা করুন</span>
              </button>
            </div>
          </div>
        </div>

        {/* Color Theme Card */}
        <div className="bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
            <Palette className="w-4 h-4 text-[#B2825C]" />
            <span>অ্যাপের কালার থিম</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 text-xs">
            {[
              { id: 'caramel', label: 'ক্যারামেল (Caramel/Warm)', color: 'bg-[#B2825C]' },
              { id: 'emerald', label: 'পান্না সবুজ (Emerald)', color: 'bg-emerald-600' },
              { id: 'blue', label: 'আকাশি নীল (Blue)', color: 'bg-blue-600' },
              { id: 'indigo', label: 'রাজকীয় নীল (Indigo)', color: 'bg-indigo-600' },
              { id: 'amber', label: 'আম্বর সোনালী (Amber)', color: 'bg-amber-600' },
              { id: 'slate', label: 'কালো স্লেট (Slate)', color: 'bg-slate-800' }
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setColorTheme(theme.id as any)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  colorTheme === theme.id
                    ? 'border-[#B2825C] ring-2 ring-[#B2825C]/20 bg-[#F5EEE7]/20 font-bold'
                    : 'border-[#E8DFD3] text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`w-5 h-5 rounded-full ${theme.color}`} />
                <span className="text-[11px] truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Settings Button */}
        <button
          type="submit"
          className="w-full py-3 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-2xl shadow-lg transition-all text-sm"
        >
          সেটিংস সংরক্ষণ করুন
        </button>
      </form>

      {/* Backup and Restore Data */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Shield className="w-4 h-4 text-[#B2825C]" />
          <span>ডেটা ব্যাকআপ ও রিস্টোর (Offline Data Security)</span>
        </h3>

        <p className="text-xs text-slate-500">
          আপনার পুরো দোকানের স্টক, বিক্রয় হিসাব, বাকির খাতা ও খরচ সম্পূর্ণ নিরাপদে একটি ফাইলে ব্যাকআপ রাখতে পারেন।
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>সম্পূর্ণ ব্যাকআপ ফাইল ডাউনলোড (JSON)</span>
          </button>

          <input
            ref={importFileRef}
            type="file"
            accept=".json"
            onChange={handleImportBackup}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => importFileRef.current?.click()}
            className="flex-1 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>পূর্বে রাখা ব্যাকআপ রিস্টোর করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
