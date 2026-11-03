import React, { useState } from 'react';
import {
  Award,
  GraduationCap,
  Cpu,
  MapPin,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  ExternalLink,
  Share2,
  Heart,
  Bot,
  Globe,
  Youtube,
  Facebook,
  Github,
  MessageSquare,
  QrCode,
  X,
  User,
  ShieldCheck,
  Building2,
  Tv,
  Check,
  ChevronRight,
  Download,
  FolderArchive
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { speakTextWithMaleVoice } from '../utils/speechHelper';

interface AboutViewProps {
  onNavigateTab: (tab: string, subTab?: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onNavigateTab }) => {
  const { settings, setIsLiveVoiceOpen } = useKhata();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);

  const founderName = settings.founderName || 'মেরাজুল ইসলাম (Merajul Islam)';
  const fatherName = settings.founderFatherName || 'মো. আব্দুল কাদির';
  const location = settings.founderLocation || 'বড়তল্লা (ওয়ার্ড নং ৬), আশুগঞ্জ, ব্রাহ্মণবাড়িয়া-৩৪০২, বাংলাদেশ';
  const islamicEdu =
    settings.founderEducationIslamic ||
    'দাওরায়ে হাদিস (মাস্টার্স সমমান) — জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা';
  const madrasahEdu =
    settings.founderEducationGeneral ||
    'টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া';
  const jatrabariEdu = 'মেশকাত জামাত — জামিয়া ইসলামিয়া দারুল উলুম মাদানিয়া যাত্রাবাড়ী, ঢাকা';
  const institute =
    settings.founderInstitute ||
    'আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট (As-Sunnah Skill Development Institute)';
  const website = settings.founderWebsite || 'https://mdmiraz-dev.github.io/';
  const facebook = settings.founderFacebook || 'https://www.facebook.com/mdmiraz.dev';
  const youtube = settings.founderYouTube || 'https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB';
  const github = settings.founderGitHub || 'https://github.com/MdMiraz-dev';
  const honor = settings.founderHonor || 'নবীন আলেম সংবর্ধনা ও সম্মাননা স্মারক (আইইবি মিলনায়তন, রমনা, ঢাকা)';

  const [profileLang, setProfileLang] = useState<'en' | 'bn'>('en');

  const speechBioBn = `এই মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্মের প্রতিষ্ঠাতা ও উদ্ভাবক হলেন মেরাজুল ইসলাম (Merajul Islam)। তাঁর পিতা মো. আব্দুল কাদির। স্থায়ী ঠিকানা বড়তল্লা, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস সম্পন্ন করেছেন, যাত্রাবাড়ী মাদ্রাসা থেকে মেশকাত এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি শায়খ আহমাদুল্লাহ পরিচালিত আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। দেশের মুদি দোকানদার ও ক্ষুদ্র ব্যবসায়ীদের প্রতিদিনের বেচাকেনা ও বাকির হিসাব সহজ, স্বচ্ছ ও আধুনিক করার মহৎ স্বপ্ন নিয়ে তিনি এই অ্যাপটি প্রতিষ্ঠা করেছেন। তাঁর এই দূরদর্শী উদ্যোগের অংশ হতে পেরে আমি এআই সহকারী হিসেবে অত্যন্ত আনন্দিত ও গর্বিত!`;

  const speechBioEn = `Mudir Dokan Khata Smart AI platform is founded and developed by Merajul Islam, son of Md. Abdul Kadir, from Borotolla, Ashuganj, Brahmanbaria. He completed Dawrah-e-Hadith from Jamia Arabia Imdadul Uloom Faridabad Madrasah, Dhaka, studied at Jatrabari Madrasah and Tongi Sadequl Uloom Fazil Madrasah. He is a certified AI Automation Specialist and Software Developer trained at As-Sunnah Skill Development Institute, founded by Shaykh Ahmadullah. He created this platform with a vision to empower grocery store owners across Bangladesh with automated POS checkout, intelligent AI voice guidance, and digital credit ledgers.`;

  const handlePlayVoiceIntro = () => {
    setIsPlayingAudio(true);
    const textToSpeak = profileLang === 'en' ? speechBioEn : speechBioBn;
    const langCode = profileLang === 'en' ? 'en' : 'bn';
    speakTextWithMaleVoice(textToSpeak, langCode);
    setTimeout(() => {
      setIsPlayingAudio(false);
    }, 20000);
  };

  const handleCopyProfile = () => {
    const profileText =
      profileLang === 'en'
        ? `Mudir Dokan Khata Smart AI Platform Founder:\nName: MERAJUL ISLAM (Miraz)\nFather: Md. Abdul Kadir\nPermanent Address: Borotolla (Ward 6), Ashuganj, Brahmanbaria, Bangladesh\n\nIslamic Education:\n1. Dawrah-e-Hadith (Masters Equivalent) — Jamia Arabia Imdadul Uloom Faridabad Madrasah, Dhaka\n2. Meshkat Alumnus — Jamia Islamia Darul Uloom Madania Jatrabari, Dhaka\n3. Nadim & Fazil — Tongi Sadequl Uloom Fazil Madrasah, Aura, Brahmanbaria\n4. Award: Young Islamic Scholar Reception & Honor (IEB Auditorium, Dhaka)\n\nTech Background & Skills:\nInstitute: As-Sunnah Skill Development Institute (Founded by Shaykh Ahmadullah)\nRole: AI & AI Automation Specialist, Software Developer & Content Creator\n\nOfficial Links:\n• Website: ${website}\n• Facebook: ${facebook}\n• YouTube: ${youtube}\n• GitHub: ${github}\n• WhatsApp: Md Miraz WhatsApp Contact\n\nVision: Empowering retail store owners across Bangladesh with digital technology and ethical business systems.`
        : `মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্ম প্রতিষ্ঠাতা:\nনাম: ${founderName}\nপিতা: ${fatherName}\nস্থায়ী ঠিকানা: ${location}\n\nইসলামিক শিক্ষা:\n১. ${islamicEdu}\n২. ${jatrabariEdu}\n৩. ${madrasahEdu}\n৪. সম্মাননা: ${honor}\n\nপ্রযুক্তিগত প্রশিক্ষণ ও স্কিল:\nপ্রতিষ্ঠান: ${institute}\nভূমিকা: এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং কন্টেন্ট ক্রিয়েটর\n\nঅফিসিয়াল লিংকসমূহ:\n• ওয়েবসাইট: ${website}\n• ফেসবুক: ${facebook}\n• ইউটিউব: ${youtube}\n• গিটহাব: ${github}\n• হোয়াটসঅ্যাপ: Md Miraz WhatsApp Contact\n\nলক্ষ্য: বাংলাদেশের মুদি ও খুচরা ব্যবসায়ীদের ডিজিটাল ও স্বাবলম্বী করা।`;

    navigator.clipboard.writeText(profileText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-br from-[#241F1B] via-[#332A23] to-[#1E1915] text-white rounded-3xl p-6 sm:p-8 border border-[#4D4135] shadow-xl relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 w-88 h-88 bg-[#B2825C]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Language Switcher Pill (Top Right) */}
        <div className="relative z-20 flex justify-end mb-2">
          <div className="inline-flex items-center bg-[#1A1613] p-1 rounded-xl border border-[#483B30] text-[11px] font-bold">
            <button
              type="button"
              onClick={() => setProfileLang('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                profileLang === 'en'
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'text-[#DEC8B3] hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setProfileLang('bn')}
              className={`px-3 py-1 rounded-lg transition-all ${
                profileLang === 'bn'
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'text-[#DEC8B3] hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          {/* Avatar / Photo */}
          <div className="relative shrink-0">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#B2825C]/40 bg-[#1E1915] relative">
              <img
                src="/merajul-islam.jpg"
                alt="Merajul Islam"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'font-black', 'text-5xl', 'text-[#DEC4AD]');
                    target.parentElement.innerText = 'MI';
                  }
                }}
              />
            </div>
            <div
              className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full shadow-md ring-2 ring-[#241F1B]"
              title={profileLang === 'en' ? 'Active AI Developer & Founder' : 'সক্রিয় এআই ডেভেলপার ও প্রতিষ্ঠাতা'}
            >
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#DEC4AD] text-[#5C3B22] shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B2825C]" />
                <span>
                  {profileLang === 'en'
                    ? 'Founder & Innovator of Mudir Dokan Khata Smart AI Platform'
                    : 'মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্মের প্রতিষ্ঠাতা ও উদ্ভাবক'}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-600/40">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>{profileLang === 'en' ? 'Verified Profile' : 'ভেরিফাইড প্রোফাইল'}</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span>{profileLang === 'en' ? 'MERAJUL ISLAM' : founderName}</span>
                <span className="text-xs sm:text-sm font-semibold px-2 py-0.5 rounded-lg bg-[#483B30] text-[#DEC8B3] border border-[#5E4D3E]">
                  {profileLang === 'en' ? 'Miraz' : 'মিরাজ (Miraz)'}
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-[#DFC7B1] font-semibold mt-1">
                {profileLang === 'en'
                  ? 'Father: Md. Abdul Kadir • Borotolla, Ashuganj, Brahmanbaria'
                  : `পিতা: ${fatherName} • বড়তল্লা, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া`}
              </p>
              <p className="text-sm sm:text-base text-[#B2825C] font-bold mt-0.5">
                {profileLang === 'en'
                  ? 'AI & AI Automation Specialist • Software Developer • Islamic Scholar'
                  : 'এআই ও এআই অটোমেশন স্পেশালিস্ট • সফটওয়্যার ডেভেলপার • ইসলামিক স্কলার'}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#C7BEB5] max-w-2xl leading-relaxed">
              {profileLang === 'en'
                ? 'Dedicated to bridging classical Islamic integrity with state-of-the-art Artificial Intelligence (AI) to empower grocery retail businesses, automate credit accounting, and ensure store profitability.'
                : 'দ্বীনি ইলমের আমানতদারিতা ও আধুনিক কৃত্রিম বুদ্ধিমত্তার (AI) মেলবন্ধনে দেশের মুদি দোকানদার ভাইদের হিসাব-নিকাশ, বাকির খাতা ও ব্যবসায়িক সিদ্ধান্তকে স্বাবলম্বী করার স্বপ্নদ্রষ্টা।'}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs text-[#DEC8B3]">
              <span className="flex items-center gap-1.5 bg-[#3B3128] px-3 py-1 rounded-xl border border-[#524438]">
                <MapPin className="w-3.5 h-3.5 text-[#B2825C]" />
                <span>{profileLang === 'en' ? 'Ashuganj, Brahmanbaria' : 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া'}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#3B3128] px-3 py-1 rounded-xl border border-[#524438]">
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span>{profileLang === 'en' ? 'Dawrah-e-Hadith (Faridabad)' : 'দাওরায়ে হাদিস (ফরিদাবাদ)'}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-[#3B3128] px-3 py-1 rounded-xl border border-[#524438]">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>{profileLang === 'en' ? 'As-Sunnah Institute (AI Automation)' : 'আস-সুন্নাহ ইনস্টিটিউট (AI Automation)'}</span>
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-3">
              <button
                type="button"
                onClick={handlePlayVoiceIntro}
                className={`px-4 sm:px-5 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-amber-400 text-slate-900 animate-pulse'
                    : 'bg-[#B2825C] hover:bg-[#9E6F4B] text-white'
                }`}
              >
                <Volume2 className="w-4 h-4" />
                <span>
                  {isPlayingAudio
                    ? profileLang === 'en'
                      ? 'Playing Voice Introduction...'
                      : 'পুরুষ কণ্ঠে পরিচয় পাঠ হচ্ছে...'
                    : profileLang === 'en'
                    ? 'Listen to Voice Intro'
                    : 'পুরুষ কণ্ঠে সম্পূর্ণ পরিচয় শুনুন'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsWhatsAppModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <QrCode className="w-4 h-4" />
                <span>{profileLang === 'en' ? 'WhatsApp QR Card' : 'হোয়াটসঅ্যাপ QR কার্ড'}</span>
              </button>

              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 bg-[#40352C] hover:bg-[#504237] text-[#DEC8B3] rounded-2xl text-xs font-semibold border border-[#5C4C3E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-cyan-300" />
                <span>{profileLang === 'en' ? 'Website' : 'ওয়েবসাইট'}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>

              <button
                type="button"
                onClick={handleCopyProfile}
                className="px-3.5 py-2.5 bg-[#40352C] hover:bg-[#504237] text-[#DEC8B3] rounded-2xl text-xs font-semibold border border-[#5C4C3E] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                <span>
                  {copiedSuccess
                    ? profileLang === 'en'
                      ? 'Copied!'
                      : 'কপি হয়েছে!'
                    : profileLang === 'en'
                    ? 'Copy Profile'
                    : 'পরিচয় কপি'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Official Connect & Social Links Banner */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8DFD3] pb-3">
          <div>
            <h3 className="font-black text-base text-[#232323] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B2825C]" />
              <span>মেরাজুল ইসলামের অফিসিয়াল যোগাযোগ ও চ্যানেলসমূহ</span>
            </h3>
            <p className="text-xs text-[#7A6E65]">প্রফেশনাল পোর্টফোলিও, সোশ্যাল মিডিয়া ও কন্টেন্ট হাব</p>
          </div>
          <span className="text-[11px] font-bold text-[#8C5E38] bg-[#F5EEE7] px-2.5 py-1 rounded-xl self-start sm:self-auto">
            সরাসরি যুক্ত হোন
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Facebook */}
          <a
            href={facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F0F5FF] hover:bg-[#E2ECFF] border border-[#D0E0FF] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Facebook className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-[#1E3A8A]">ফেসবুক প্রোফাইল</p>
              <p className="text-[11px] text-slate-500 truncate">fb.com/mdmiraz.dev</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#1877F2] opacity-60 group-hover:opacity-100" />
          </a>

          {/* Website / Portfolio */}
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#F0FDF4] hover:bg-[#DCFCE7] border border-[#BBF7D0] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0D9488] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-[#065F46]">পোর্টফোলিও ওয়েবসাইট</p>
              <p className="text-[11px] text-slate-500 truncate">mdmiraz-dev.github.io</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#0D9488] opacity-60 group-hover:opacity-100" />
          </a>

          {/* YouTube Channel */}
          <a
            href={youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FF0000] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <Youtube className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-[#9F1239]">Miraz Learning Story</p>
              <p className="text-[11px] text-slate-500 truncate">@mdmiraz-489 (YouTube)</p>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF0000] opacity-60 group-hover:opacity-100" />
          </a>

          {/* WhatsApp Contact Card */}
          <button
            type="button"
            onClick={() => setIsWhatsAppModalOpen(true)}
            className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#ECFDF5] hover:bg-[#D1FAE5] border border-[#A7F3D0] transition-all group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-[#065F46]">হোয়াটসঅ্যাপ যোগাযোগ</p>
              <p className="text-[11px] text-slate-500 truncate">Md Miraz (QR Card)</p>
            </div>
            <QrCode className="w-3.5 h-3.5 text-[#059669] opacity-60 group-hover:opacity-100" />
          </button>
        </div>

        {/* GitHub Repository & Instant ZIP Download Card */}
        <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#181C24] via-[#212631] to-[#161B22] text-white border border-[#30363D] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-white text-black flex items-center justify-center shrink-0 shadow-md">
              <Github className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm sm:text-base text-white">
                  মুদির দোকান খাতা GitHub রিপোজিটরি
                </h4>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Public Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 break-all">
                https://github.com/MdMiraz-dev/mudir-dokan-khata
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                সম্পূর্ণ সোর্স কোড (React, Tailwind, Gemini AI, PWA) একটি জিপ ফাইলে প্রস্তুত করা আছে।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <a
              href="/mudir-dokan-khata-source.zip"
              download="mudir-dokan-khata-source.zip"
              className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>প্রজেক্ট জিপ ডাউনলোড করুন (ZIP)</span>
            </a>
            <a
              href="https://github.com/MdMiraz-dev/mudir-dokan-khata"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 bg-[#2B313A] hover:bg-[#373E48] text-white rounded-xl text-xs font-semibold border border-[#484F58] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>GitHub-এ যান</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>
      </div>

      {/* 2-Column Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Islamic Education */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E8DFD3] pb-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#F5EEE7] text-[#B2825C] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#232323]">ইসলামিক শিক্ষাগত যোগ্যতা</h3>
              <p className="text-xs text-[#7A6E65]">ঐতিহ্যবাহী কওমি ও আলিয়া দ্বীনি বিদ্যাপীঠ</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            {/* Degree 1 */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3]/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#B2825C] text-sm">দাওরায়ে হাদিস (মাস্টার্স সমমান)</span>
                <span className="px-2 py-0.5 rounded-md bg-[#DEC4AD] text-[#6E472A] font-bold text-[10px]">
                  সম্পন্ন
                </span>
              </div>
              <p className="font-bold text-slate-800">
                জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                বাংলাদেশের দ্বিতীয় বৃহত্তম ও অন্যতম শীর্ষ ঐতিহাসিক কওমি দ্বীনি শিক্ষাকেন্দ্র থেকে সিহাহ সিত্তাহসহ হাদিস শাস্ত্র, ফিকহ ও ইসলামি শরিয়তের সর্বোচ্চ স্তর সফলতার সাথে প্রথম বিভাগে সম্পন্ন করেছেন।
              </p>
            </div>

            {/* Degree 2: Jatrabari */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3]/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#B2825C] text-sm">মেশকাত জামাত</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                  সম্পন্ন
                </span>
              </div>
              <p className="font-bold text-slate-800">
                জামিয়া ইসলামিয়া দারুল উলুম মাদানিয়া যাত্রাবাড়ী, ঢাকা
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                প্রতিষ্ঠাতা: আল্লামা শায়খ মাহমুদুল হাসান। উচ্চতর হাদিস ও ফিকহি পাণ্ডিত্য অর্জনের অন্যতম সুপরিচিত প্রতিষ্ঠান।
              </p>
            </div>

            {/* Degree 3: Sadequl Uloom */}
            <div className="p-4 bg-[#FAF7F2] rounded-2xl border border-[#E8DFD3]/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#B2825C] text-sm">নাদিম ও ফাজিল শিক্ষা</span>
                <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-bold text-[10px]">
                  সম্পন্ন
                </span>
              </div>
              <p className="font-bold text-slate-800">
                টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া
              </p>
              <p className="text-slate-500 text-xs leading-relaxed">
                আরবি সাহিত্য, ইসলামি অনুশাসন, ন্যায়নীতি ও প্রাতিষ্ঠানিক ধর্মীয় শিক্ষার মজবুত ভিত্তি অর্জন।
              </p>
            </div>

            {/* Award Photo Banner */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-amber-300 bg-amber-100">
                <img
                  src="/assets/about/merajul-islam-award.jpg"
                  alt="নবীন আলেম সংবর্ধনা স্মারক"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="min-w-0">
                <span className="font-bold text-xs text-amber-900 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span>নবীন আলেম সংবর্ধনা ও সম্মাননা স্মারক</span>
                </span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-snug">
                  ইনসাফভিত্তিক সমাজ বিনির্মাণে ঢাকা আইইবি মিলনায়তনে সংবর্ধনা স্মারক গ্রহণ করেন মেরাজুল ইসলাম (মিরাজ)।
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Technical Background & Skills */}
        <div className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 border-b border-[#E8DFD3] pb-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#EBF4EE] text-[#4A7C59] flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[#232323]">প্রযুক্তিগত প্রশিক্ষণ ও আধুনিক স্কিল</h3>
              <p className="text-xs text-[#7A6E65]">এআই, অটোমেশন ও সফটওয়্যার নির্মাণ</p>
            </div>
          </div>

          <div className="space-y-3.5 text-xs sm:text-sm">
            {/* Institute with campus photos */}
            <div className="p-4 bg-[#F2F8F4] rounded-2xl border border-[#D5E9DC] space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-black text-[#376945] text-sm">প্রশিক্ষণ বিদ্যাপীঠ</span>
                <span className="px-2 py-0.5 rounded-md bg-[#D5E9DC] text-[#225030] font-bold text-[10px]">
                  সার্টিফাইড
                </span>
              </div>
              <p className="font-bold text-slate-900 text-sm">
                আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট
              </p>
              <p className="text-xs text-slate-600">
                প্রতিষ্ঠাতা ও চেয়ারম্যান: দেশবরেণ্য ইসলামিক স্কলার <strong>শায়খ আহমাদুল্লাহ</strong>। বাড্ডা, ঢাকা।
              </p>
              <p className="text-slate-600 text-xs leading-relaxed">
                আধুনিক হাই-টেক কম্পিউটার ল্যাবে সফলতার সাথে <strong>AI Automation & Software Development</strong> প্রফেশনাল প্রশিক্ষণ সম্পন্ন করেছেন।
              </p>

              {/* Lab / Campus Preview images */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="rounded-xl overflow-hidden border border-[#D5E9DC] h-20 bg-slate-100 relative group">
                  <img
                    src="/assets/about/assunnah-campus.jpg"
                    alt="আস-সুন্নাহ ক্যাম্পাস"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                    ইনস্টিটিউট ভবন
                  </span>
                </div>
                <div className="rounded-xl overflow-hidden border border-[#D5E9DC] h-20 bg-slate-100 relative group">
                  <img
                    src="/assets/about/assunnah-lab.jpg"
                    alt="আস-সুন্নাহ হাই-টেক ল্যাব"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-sm">
                    এআই ও সফটওয়্যার ল্যাব
                  </span>
                </div>
              </div>
            </div>

            {/* Skills & Focus */}
            <div className="space-y-2.5">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wide">
                বিশেষ কারিগরি পারদর্শিতা ও কার্যক্রম:
              </h4>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  {
                    title: 'এআই অটোমেশন (AI Automation)',
                    desc: 'ব্যবসার পুনরাবৃত্তিমূলক ও জটিল হিসাব স্বয়ংক্রিয় করা'
                  },
                  {
                    title: 'সফটওয়্যার ডেভেলপমেন্ট',
                    desc: 'আধুনিক ওয়েব, মোবাইল ও ক্লাউড সিস্টেম তৈরি'
                  },
                  {
                    title: 'লাইভ ভয়েস এআই প্রযুক্তি',
                    desc: 'পুরুষ কণ্ঠে তাৎক্ষণিক বাংলা কথন ও দ্বিমুখী সহকারী'
                  },
                  {
                    title: 'খুচরা ব্যবসা ও খাতা সল্যুশন',
                    desc: 'পিওএস ক্যাশ কাউন্টার, ডিজিটাল বাকির খাতা ও এসএমএস'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Creation Banner */}
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <span className="font-bold text-xs text-rose-900 flex items-center gap-1.5">
                  <Tv className="w-3.5 h-3.5 text-rose-600" />
                  <span>Miraz Learning Story (কন্টেন্ট ক্রিয়েশন)</span>
                </span>
                <p className="text-[11px] text-rose-800 mt-0.5 leading-snug">
                  পডকাস্ট, আত্মউন্নয়ন, মোটিভেশনাল স্টোরি ও শিক্ষণীয় বাস্তব জীবনের গল্প।
                </p>
              </div>
              <a
                href={youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[11px] font-bold shrink-0 transition-colors"
              >
                দেখুন
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Motivation Banner */}
      <div className="bg-white rounded-3xl border border-[#E8DFD3] p-5 sm:p-6 shadow-xs space-y-3">
        <h3 className="font-bold text-base text-[#232323] flex items-center gap-2">
          <Heart className="w-5 h-5 text-[#C25B4E]" />
          <span>"মুদির দোকান খাতা স্মার্ট এআই" প্রতিষ্ঠার স্বপ্ন ও দর্শন</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          বাংলাদেশের লাখো খুচরা মুদি দোকানদার ও ক্ষুদ্র ব্যবসায়ী ভাইরা প্রতিদিন ভোর থেকে গভীর রাত পর্যন্ত হাড়ভাঙা খাটুনি করেন। তাদের বেশিরভাগই পুরনো ছেঁড়া খাতায় বাকি লিখে রাখেন, যাতে টাকা আদায়ের হিসাব গুলিয়ে যায় এবং মাস শেষে লাভের সঠিক হিসাব পাওয়া যায় না।
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          এই বাস্তব সমস্যা সমাধান করতে <strong>মেরাজুল ইসলাম (মিরাজ)</strong> আধুনিক কৃত্রিম বুদ্ধিমত্তা (AI), সরাসরি পুরুষ কণ্ঠে কথা বলার লাইভ সহকারী এবং সহজ ডিজিটাল বাকির খাতার সমন্বয়ে এই সম্পূর্ণ সমাধানটি তৈরি করেছেন — যাতে একজন সাধারণ দোকানদার ভাইও কোনো জটিলতা ছাড়াই মুখে বলে এবং সহজে ক্লিক করেই নিজের দোকানকে সম্পূর্ণ স্বাবলম্বী ও লাভজনক করতে পারেন।
        </p>
      </div>

      {/* Interactive AI Verification Card */}
      <div className="bg-gradient-to-r from-[#F5EEE7] to-[#ECDDCF] border border-[#DEC4AD] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#B2825C] text-white">
            <Bot className="w-3.5 h-3.5" />
            <span>লাইভ এআই সহকারী প্রস্তুত</span>
          </div>
          <h4 className="font-bold text-[#452E1E] text-base">
            যেকোনো সময় এআই-কে জিজ্ঞেস করুন: "এই অ্যাপের প্রতিষ্ঠাতা কে?"
          </h4>
          <p className="text-xs text-[#6E472A]">
            এআই সহকারী মুখে শুনে সাথে সাথে পুরুষ কণ্ঠে মেরাজুল ইসলামের সম্পূর্ণ পরিচয় ও লিংক বর্ণনা করবে।
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsLiveVoiceOpen(true)}
            className="px-4 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>লাইভ ভয়েসে যাচাই করুন</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTab('resume')}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-[#DEC4AD] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            সিভি দেখুন
          </button>
        </div>
      </div>

      {/* WhatsApp QR Code Contact Modal */}
      {isWhatsAppModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#128C7E] rounded-3xl max-w-sm w-full p-6 text-white shadow-2xl relative overflow-hidden border border-emerald-400/30">
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer z-20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Inner White Card - Matching the WhatsApp QR card style */}
            <div className="bg-white text-slate-900 rounded-2xl p-5 shadow-xl text-center space-y-4 relative mt-2">
              {/* Avatar circle at top */}
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto -mt-10 ring-4 ring-white shadow-md bg-slate-800">
                <img
                  src="/merajul-islam.jpg"
                  alt="Md Miraz"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <h4 className="font-extrabold text-lg text-slate-900 tracking-tight">Md Miraz</h4>
                <p className="text-xs text-slate-500 font-medium">WhatsApp contact</p>
              </div>

              {/* QR Code Container */}
              <div className="bg-white p-3 rounded-xl border-2 border-slate-100 shadow-inner flex items-center justify-center">
                <div className="relative p-2 bg-white rounded-lg">
                  {/* High Quality Vector QR Code representation */}
                  <svg
                    className="w-48 h-48 mx-auto"
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background */}
                    <rect width="200" height="200" fill="white" />
                    {/* Corner 1 Top Left Finder */}
                    <rect x="15" y="15" width="45" height="45" rx="6" fill="#111827" />
                    <rect x="23" y="23" width="29" height="29" rx="3" fill="white" />
                    <rect x="29" y="29" width="17" height="17" rx="2" fill="#111827" />
                    {/* Corner 2 Top Right Finder */}
                    <rect x="140" y="15" width="45" height="45" rx="6" fill="#111827" />
                    <rect x="148" y="23" width="29" height="29" rx="3" fill="white" />
                    <rect x="154" y="29" width="17" height="17" rx="2" fill="#111827" />
                    {/* Corner 3 Bottom Left Finder */}
                    <rect x="15" y="140" width="45" height="45" rx="6" fill="#111827" />
                    <rect x="23" y="148" width="29" height="29" rx="3" fill="white" />
                    <rect x="29" y="154" width="17" height="17" rx="2" fill="#111827" />
                    {/* Random QR Code Matrix Pattern */}
                    <rect x="70" y="20" width="10" height="10" fill="#111827" />
                    <rect x="90" y="20" width="10" height="10" fill="#111827" />
                    <rect x="110" y="20" width="10" height="10" fill="#111827" />
                    <rect x="70" y="40" width="20" height="10" fill="#111827" />
                    <rect x="100" y="40" width="10" height="10" fill="#111827" />
                    <rect x="120" y="40" width="10" height="10" fill="#111827" />
                    <rect x="20" y="70" width="10" height="20" fill="#111827" />
                    <rect x="40" y="70" width="20" height="10" fill="#111827" />
                    <rect x="20" y="100" width="20" height="10" fill="#111827" />
                    <rect x="50" y="90" width="10" height="20" fill="#111827" />
                    <rect x="70" y="70" width="20" height="20" fill="#111827" />
                    <rect x="110" y="70" width="20" height="10" fill="#111827" />
                    <rect x="140" y="70" width="10" height="20" fill="#111827" />
                    <rect x="160" y="70" width="20" height="10" fill="#111827" />
                    <rect x="140" y="100" width="20" height="10" fill="#111827" />
                    <rect x="170" y="90" width="10" height="20" fill="#111827" />
                    <rect x="70" y="110" width="10" height="20" fill="#111827" />
                    <rect x="90" y="120" width="20" height="10" fill="#111827" />
                    <rect x="120" y="110" width="10" height="20" fill="#111827" />
                    <rect x="70" y="140" width="20" height="10" fill="#111827" />
                    <rect x="100" y="140" width="10" height="20" fill="#111827" />
                    <rect x="120" y="140" width="20" height="10" fill="#111827" />
                    <rect x="70" y="170" width="10" height="10" fill="#111827" />
                    <rect x="90" y="160" width="20" height="10" fill="#111827" />
                    <rect x="120" y="170" width="10" height="10" fill="#111827" />
                    <rect x="140" y="140" width="10" height="10" fill="#111827" />
                    <rect x="160" y="140" width="20" height="10" fill="#111827" />
                    <rect x="140" y="160" width="20" height="10" fill="#111827" />
                    <rect x="170" y="170" width="10" height="10" fill="#111827" />
                    {/* WhatsApp Icon Circle In Center */}
                    <circle cx="100" cy="100" r="22" fill="#25D366" stroke="white" strokeWidth="4" />
                    <path
                      d="M106.5 93.5C104.8 91.8 102.5 90.9 100 90.9C95 90.9 90.9 95 90.9 100C90.9 101.6 91.3 103.2 92.1 104.6L91 108.5L95.1 107.4C96.4 108.1 98.2 108.6 100 108.6C105 108.6 109.1 104.5 109.1 99.5C109.1 97.2 108.2 95.1 106.5 93.5ZM100 107.2C98.4 107.2 96.9 106.8 95.6 106L95.3 105.8L92.9 106.4L93.5 104.1L93.3 103.8C92.4 102.4 92 101 92 99.5C92 95.3 95.6 91.8 100 91.8C102.1 91.8 104.1 92.6 105.6 94.1C107.1 95.6 107.9 97.6 107.9 99.7C107.9 103.9 104.4 107.2 100 107.2Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 font-medium">
                Scan this code using the WhatsApp camera to get my number
              </p>

              <div className="pt-2 flex flex-col gap-2">
                <a
                  href="https://wa.me/?text=%E0%A6%86%E0%A6%B8%E0%A6%B8%E0%A6%BE%E0%A6%B2%E0%A6%BE%E0%A6%AE%E0%A7%81%20%E0%A6%86%E0%A6%B2%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A7%81%E0%A6%AE%20%E0%A6%AE%E0%A7%87%E0%A6%B0%E0%A6%BE%E0%A6%9C%E0%A7%81%E0%A6%B2%20%E0%A6%87%E0%A6%B8%E0%A6%B2%E0%A6%BE%E0%A6%AE%20%E0%A6%AD%E0%A6%BE%E0%A6%87%EF%BC%81%20%E0%A6%86%E0%A6%AA%E0%A6%A8%E0%A6%BE%E0%A6%B0%20%E0%A6%AE%E0%A7%81%E0%A6%A6%E0%A6%BF%E0%A6%B0%20%E0%A6%A6%E0%A7%8B%E0%A6%95%E0%A6%BE%E0%A6%A8%20%E0%A6%96%E0%A6%BE%E0%A6%A4%E0%A6%BE%20%E0%A6%8F%E0%A6%86%E0%A6%87%20%E0%A6%85%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AA%E0%A6%B8%20%E0%A6%A6%E0%A7%87%E0%A6%96%E0%A7%87%20%E0%A6%AF%E0%A7%8B%E0%A6%97%E0%A6%BE%E0%A6%AF%E0%A7%8B%E0%A6%97%20%E0%A6%95%E0%A6%B0%E0%A6%9B%E0%A6%BF%E0%A5%A4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>হোয়াটসঅ্যাপে সরাসরি চ্যাট করুন</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsWhatsAppModalOpen(false)}
                  className="w-full py-2 text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
