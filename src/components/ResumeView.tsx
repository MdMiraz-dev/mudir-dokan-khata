import React, { useState, useRef } from 'react';
import {
  Printer,
  Copy,
  Check,
  Edit3,
  RotateCcw,
  Sparkles,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  FileText,
  Palette,
  Type,
  Share2,
  CheckCircle2,
  ChevronDown,
  Globe,
  Heart,
  Bookmark,
  Send,
  MessageSquare,
  Sparkle,
  Sliders,
  CheckCircle,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { InterviewPrepSection } from './InterviewPrepSection';

export interface ResumeData {
  fullName: string;
  professionalTitle: string;
  phone: string;
  email: string;
  location: string;
  summary: string;
  experiences: {
    role: string;
    company: string;
    period: string;
    location: string;
    points: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    result: string;
  }[];
  coreSkills: string[];
  softwareSkills: string[];
  languages: { language: string; level: string }[];
  certifications: string[];
  strengths: string[];
}

const DEFAULT_RESUME_BN: ResumeData = {
  fullName: 'মেরাজুল ইসলাম (Merajul Islam)',
  professionalTitle: 'এআই ও এআই অটোমেশন স্পেশালিস্ট • সফটওয়্যার ডেভেলপার',
  phone: '০১৭১১-০০০০০০',
  email: 'mdtushan8@gmail.com',
  location: 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া, বাংলাদেশ',
  summary:
    'দ্বীনি শিক্ষায় দাওরায়ে হাদিস সম্পন্নকারী এবং আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত দক্ষ এআই, এআই অটোমেশন স্পেশালিস্ট ও সফটওয়্যার ডেভেলপার। আধুনিক কৃত্রিম বুদ্ধিমত্তা (AI), জেনারেটিভ এআই, ভয়েস ও টেক্সট অটোমেশন এবং ফুলস্ট্যাক ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্টে বাস্তব দক্ষতাসম্পন্ন। সততা, আমানতদারিতা এবং দেশের ক্ষুদ্র ও পাইকারি মুদি ব্যবসায়ীদের হিসাব-নিকাশ সহজ ও ডিজিটাল করতে প্রতিশ্রুতিবদ্ধ।',
  experiences: [
    {
      role: 'প্রতিষ্ঠাতা ও চিফ এআই সফটওয়্যার ডেভেলপার',
      company: 'মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্ম',
      period: '২০২৩ — বর্তমান',
      location: 'বাংলাদেশ',
      points: [
        'মুদির দোকানদারদের জন্য পুরুষ কণ্ঠে লাইভ এআই সহকারী ও বাজার দর পরামর্শ ব্যবস্থা তৈরি।',
        'পিওএস ক্যাশ কাউন্টার, ডিজিটাল বাকির খাতা ও এসএমএস তাগাদা সিস্টেম স্বয়ংক্রিয়করণ।',
        'এআই অটোমেশন ও জেনারেটিভ এআই ওয়ার্কফ্লো প্রয়োগ করে হিসাব-নিকাশের নির্ভুলতা নিশ্চিতকরণ।'
      ]
    },
    {
      role: 'এআই ও সফটওয়্যার অটোমেশন প্রজেক্ট লিড',
      company: 'ডিজিটাল বিজনেস অটোমেশন ল্যাব',
      period: '২০২২ — ২০২৩',
      location: 'ঢাকা, বাংলাদেশ',
      points: [
        'ব্যবসার দৈনন্দিন হিসাব ও স্টক ম্যানেজমেন্টের জন্য কাস্টম সফটওয়্যার ও স্ক্রিপ্ট তৈরি।',
        'ক্লায়েন্টদের কাজের সময় ও জটিলতা ৫০% কমাতে এআই অটোমেশন পাইপলাইন বাস্তবায়ন।'
      ]
    }
  ],
  education: [
    {
      degree: 'দাওরায়ে হাদিস (মাস্টার্স সমমান — আল-হাদিস ও ইসলামিক স্টাডিজ)',
      institution: 'জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা',
      year: '২০২২',
      result: 'প্রথম বিভাগ (Mumtaz/First Class)'
    },
    {
      degree: 'নাযেম ও ফাজিল শিক্ষা',
      institution: 'টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া',
      year: '২০১৯',
      result: 'প্রথম বিভাগ'
    }
  ],
  coreSkills: [
    'এআই ও এআই অটোমেশন (AI Automation)',
    'সফটওয়্যার ডেভেলপমেন্ট ও সিস্টেম ডিজাইন',
    'রিয়েল-টাইম ভয়েস ও অডিও মডেল ইন্টিগ্রেশন',
    'খুচরা ও পাইকারি ব্যবসায়ের হিসাব অটোমেশন',
    'বাকির খাতা ও ক্যাশ ফ্লো অডিট',
    'ইসলামি বাণিজ্যিক নীতি ও সততা'
  ],
  softwareSkills: [
    'জেনারেটিভ এআই ও এলএলএম (Gemini 3.8 / APIs)',
    'ওয়েব ও অ্যাপ ডেভেলপমেন্ট (React / TypeScript / Node)',
    'এআই ওয়ার্কফ্লো অটোমেশন',
    'ডাটাবেজ ও ক্লাউড সিস্টেম'
  ],
  languages: [
    { language: 'বাংলা', level: 'মাতৃভাষা (সাবলীল)' },
    { language: 'আরবি', level: 'উচ্চতর শাস্ত্রীয় ও পাঠ্য দক্ষতা' },
    { language: 'ইংরেজি', level: 'পেশাগত ও প্রযুক্তিগত' }
  ],
  certifications: [
    'প্রফেশনাল এআই ও এআই অটোমেশন — আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট',
    'সফটওয়্যার ডেভেলপমেন্ট ও মডার্ন অ্যাপ্লিকেশনস — আস-সুন্নাহ ইনস্টিটিউট',
    'দাওরায়ে হাদিস সনদ — আল-হাইআতুল উলয়া লিল-জামি‘আতিল কওমিয়া বাংলাদেশ'
  ],
  strengths: [
    'দ্বীনি ইলম ও প্রযুক্তিগত দক্ষতার মেলবন্ধন',
    'উচ্চ পর্যায়ের আমানতদারিতা ও সততা',
    'সমস্যা সমাধানে দ্রুত ও কার্যকর সিদ্ধান্ত গ্রহণ'
  ]
};

const DEFAULT_RESUME_EN: ResumeData = {
  fullName: 'Merajul Islam (Miraz)',
  professionalTitle: 'AI & AI Automation Specialist • Software Developer • Founder',
  phone: '+880 1711-000000',
  email: 'mdtushan8@gmail.com',
  location: 'Borotolla, Ashuganj, Brahmanbaria, Bangladesh',
  summary:
    'Dedicated AI & AI Automation Specialist, Software Developer, and Islamic Scholar with a Dawrah-e-Hadith degree from Jamia Arabia Imdadul Uloom Faridabad Madrasah, Dhaka, and professional training in AI Automation & Software Development from As-Sunnah Skill Development Institute (founded by Shaykh Ahmadullah). Founder and Creator of Mudir Dokan Khata Smart AI, delivering cutting-edge automated POS checkout, live voice AI advisory, and digital credit ledgers for Bangladeshi retail shopkeepers.',
  experiences: [
    {
      role: 'Founder & Lead AI Software Developer',
      company: 'Mudir Dokan Khata Smart AI Platform',
      period: '2023 — Present',
      location: 'Bangladesh',
      points: [
        'Architected real-time conversational AI retail advisor with low-latency Bengali voice synthesis.',
        'Engineered responsive POS terminal, digital due ledger (Due Khata), and automated SMS collection system.',
        'Implemented generative AI workflows and inventory analytics to optimize grocery store margins.'
      ]
    },
    {
      role: 'AI Automation & Web Developer',
      company: 'Digital Business Automation Lab',
      period: '2022 — 2023',
      location: 'Dhaka, Bangladesh',
      points: [
        'Built customized software pipelines and accounting tools for SMEs and retail stores.',
        'Streamlined daily reporting and bookkeeping workflows with modern AI integration.'
      ]
    }
  ],
  education: [
    {
      degree: 'Dawrah-e-Hadith (Masters Equivalent in Islamic Studies & Hadith)',
      institution: 'Jamia Arabia Imdadul Uloom Faridabad, Dhaka',
      year: '2022',
      result: 'First Class (Mumtaz)'
    },
    {
      degree: 'Meshkat Alumnus',
      institution: 'Jamia Islamia Darul Uloom Madania Jatrabari, Dhaka',
      year: '2020',
      result: 'First Division'
    },
    {
      degree: 'Nadim & Fazil Islamic Education',
      institution: 'Tongi Sadequl Uloom Fazil Madrasah, Aura, Brahmanbaria',
      year: '2019',
      result: 'First Division'
    }
  ],
  coreSkills: [
    'AI & AI Automation Systems',
    'Full-Stack Software Engineering',
    'Real-Time Bengali Voice AI',
    'Retail POS & Due Ledger Automation',
    'Financial Accounting & Margin Audits',
    'Ethical Business Principles'
  ],
  softwareSkills: [
    'React, TypeScript & Node.js',
    'Generative AI & LLMs (Gemini Live / APIs)',
    'WebSocket Real-Time Audio Streaming',
    'Tailwind CSS & Modern UI Architecture',
    'Database & Cloud Workflows'
  ],
  languages: [
    { language: 'Bengali', level: 'Native / Bilingual' },
    { language: 'Arabic', level: 'Classical & Theological Fluency' },
    { language: 'English', level: 'Professional Working Proficiency' }
  ],
  certifications: [
    'AI Automation & Software Development — As-Sunnah Skill Development Institute',
    'Young Islamic Scholar Reception & Honor — IEB Auditorium, Dhaka',
    'Dawrah-e-Hadith Sanad — Al-Haiatul Ulya Lil-Jami‘atil Qawmia Bangladesh'
  ],
  strengths: [
    'Synergy of Islamic Integrity & Cutting-edge Tech',
    'High Reliability & Trustworthiness (Amanah)',
    'Practical Problem-Solving for Bangladeshi Businesses'
  ]
};

export const ResumeView: React.FC = () => {
  const { settings } = useKhata();
  const [lang, setLang] = useState<'bn' | 'en'>('bn');
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_BN);
  const [fontFamily, setFontFamily] = useState<'siliguri' | 'playfair' | 'cormorant' | 'jakarta' | 'outfit' | 'inter'>('siliguri');
  const [colorTheme, setColorTheme] = useState<'mocha' | 'emerald' | 'navy' | 'charcoal'>('mocha');
  const [layoutStyle, setLayoutStyle] = useState<'aesthetic' | 'classic'>('aesthetic');
  const [activeTabNav, setActiveTabNav] = useState<'resume' | 'interview'>('resume');
  const [isEditing, setIsEditing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const resumeRef = useRef<HTMLDivElement>(null);

  const handleLanguageSwitch = (newLang: 'bn' | 'en') => {
    setLang(newLang);
    if (newLang === 'bn') {
      setResumeData(DEFAULT_RESUME_BN);
      setFontFamily('siliguri');
    } else {
      setResumeData(DEFAULT_RESUME_EN);
      setFontFamily('playfair');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `
=========================================
${resumeData.fullName.toUpperCase()}
${resumeData.professionalTitle}
=========================================
মোবাইল/ফোন: ${resumeData.phone}
ইমেইল: ${resumeData.email}
ঠিকানা: ${resumeData.location}

[প্রফেশনাল সারসংক্ষেপ / SUMMARY]
${resumeData.summary}

[কর্মঅভিজ্ঞতা / WORK EXPERIENCE]
${resumeData.experiences
  .map(
    (exp) => `
• ${exp.role} | ${exp.company} (${exp.period})
  ${exp.points.map((p) => `  - ${p}`).join('\n')}
`
  )
  .join('\n')}

[শিক্ষাগত যোগ্যতা / EDUCATION]
${resumeData.education
  .map((edu) => `• ${edu.degree} - ${edu.institution} (${edu.year}) [${edu.result}]`)
  .join('\n')}

[মূল দক্ষতা / KEY SKILLS]
${resumeData.coreSkills.join(', ')}

[আইটি ও সফটওয়্যার / SOFTWARE SKILLS]
${resumeData.softwareSkills.join(', ')}

[ভাষা / LANGUAGES]
${resumeData.languages.map((l) => `${l.language}: ${l.level}`).join(', ')}
`;

    navigator.clipboard.writeText(text.trim());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 3000);
  };

  const themeStyles = {
    mocha: {
      primaryBg: 'bg-[#A57D5C]',
      primaryText: 'text-[#6E472A]',
      primaryBorder: 'border-[#A57D5C]',
      accentBadge: 'bg-[#F4EFE6] text-[#7A4B29] border-[#DEC8B3]',
      barColor: '#A57D5C',
      canvasBg: 'bg-[#FAF6F0]',
      stampBg: 'bg-[#A57D5C]',
      stampText: 'text-white'
    },
    emerald: {
      primaryBg: 'bg-emerald-700',
      primaryText: 'text-emerald-800',
      primaryBorder: 'border-emerald-600',
      accentBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      barColor: '#047857',
      canvasBg: 'bg-white',
      stampBg: 'bg-emerald-700',
      stampText: 'text-white'
    },
    navy: {
      primaryBg: 'bg-indigo-900',
      primaryText: 'text-indigo-950',
      primaryBorder: 'border-indigo-800',
      accentBadge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      barColor: '#1e1b4b',
      canvasBg: 'bg-white',
      stampBg: 'bg-indigo-900',
      stampText: 'text-white'
    },
    charcoal: {
      primaryBg: 'bg-slate-900',
      primaryText: 'text-slate-900',
      primaryBorder: 'border-slate-800',
      accentBadge: 'bg-slate-100 text-slate-800 border-slate-300',
      barColor: '#0f172a',
      canvasBg: 'bg-white',
      stampBg: 'bg-slate-900',
      stampText: 'text-white'
    }
  }[colorTheme];

  const fontStyle = {
    siliguri: { fontFamily: "'Hind Siliguri', sans-serif" },
    playfair: { fontFamily: "'Playfair Display', serif" },
    cormorant: { fontFamily: "'Cormorant Garamond', serif" },
    jakarta: { fontFamily: "'Plus Jakarta Sans', sans-serif" },
    outfit: { fontFamily: "'Outfit', sans-serif" },
    inter: { fontFamily: "'Inter', sans-serif" }
  }[fontFamily];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Controls Toolbar (Hidden in Print) */}
      <div className="no-print bg-[#FAF6F0] rounded-3xl border border-[#E8DFD5] p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#A57D5C] text-white flex items-center justify-center shadow-md shadow-[#A57D5C]/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black text-[#252220] tracking-tight">
                  এক পাতার প্রফেশনাল রেজুমে ও ইন্টারভিউ প্রস্তুতি
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#DEC8B3]/60 text-[#5C3D24] border border-[#DEC8B3]">
                  ✦ Pinterest Aesthetic
                </span>
              </div>
              <p className="text-xs text-[#7A6E65]">
                মডার্ন মিনিমালিস্ট আর্ট স্টাইলে গোছানো ১-পাতার সিভি ও এআই ইন্টারভিউ কোচিং
              </p>
            </div>
          </div>
        </div>

        {/* Section Jump Tabs */}
        <div className="flex items-center bg-[#F4EFE6] p-1 rounded-2xl border border-[#E8DFD5] text-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTabNav('resume');
              const el = document.getElementById('resume-canvas-anchor');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
              activeTabNav === 'resume'
                ? 'bg-white text-[#252220] shadow-sm'
                : 'text-[#7A6E65] hover:text-[#252220]'
            }`}
          >
            📄 রেজুমে ক্যানভাস
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTabNav('interview');
              const el = document.getElementById('interview-prep-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTabNav === 'interview'
                ? 'bg-[#A57D5C] text-white shadow-sm'
                : 'text-[#7A6E65] hover:text-[#252220]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>ইন্টারভিউ প্রস্তুতি</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Aesthetic vs Classic Style Toggle */}
          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD5] text-xs">
            <button
              type="button"
              onClick={() => {
                setLayoutStyle('aesthetic');
                setColorTheme('mocha');
              }}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1 ${
                layoutStyle === 'aesthetic'
                  ? 'bg-[#A57D5C] text-white shadow-2xs'
                  : 'text-[#7A6E65] hover:text-[#252220]'
              }`}
            >
              <span>✦ Aesthetic</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutStyle('classic')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                layoutStyle === 'classic'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-[#7A6E65] hover:text-[#252220]'
              }`}
            >
              ক্লাসিক গ্রিড
            </button>
          </div>

          {/* Language Switch */}
          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD5] text-xs">
            <button
              type="button"
              onClick={() => handleLanguageSwitch('bn')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                lang === 'bn'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-[#7A6E65] hover:text-[#252220]'
              }`}
            >
              বাংলা
            </button>
            <button
              type="button"
              onClick={() => handleLanguageSwitch('en')}
              className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                lang === 'en'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-[#7A6E65] hover:text-[#252220]'
              }`}
            >
              English
            </button>
          </div>

          {/* Font Selector */}
          <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD5] text-xs">
            <Type className="w-3.5 h-3.5 text-[#7A6E65] ml-1.5" />
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="bg-transparent font-semibold text-[#252220] outline-hidden pr-2 cursor-pointer text-xs"
              title="পছন্দসই ফন্ট নির্বাচন করুন"
            >
              <option value="siliguri">হিন্দ সিলিগুড়ি (Hind Siliguri)</option>
              <option value="playfair">প্লেফেয়ার সেরিফ (Playfair Display)</option>
              <option value="cormorant">করমোরেন্ট (Cormorant Garamond)</option>
              <option value="jakarta">প্লাস জাকার্তা (Plus Jakarta)</option>
              <option value="outfit">আউটফিট (Outfit Sans)</option>
              <option value="inter">ইন্টার (Inter Modern)</option>
            </select>
          </div>

          {/* Color Palette Chooser */}
          <div className="flex items-center gap-1 bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD5]">
            <Palette className="w-3.5 h-3.5 text-[#7A6E65] ml-1" />
            {[
              { id: 'mocha', color: 'bg-[#A57D5C]', title: 'পিন্টারেস্ট মোকা (Pinterest Warm)' },
              { id: 'emerald', color: 'bg-emerald-600', title: 'পান্না সবুজ' },
              { id: 'navy', color: 'bg-indigo-900', title: 'রয়্যাল নেভি' },
              { id: 'charcoal', color: 'bg-slate-900', title: 'ক্লাসিক চারকোল' }
            ].map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setColorTheme(c.id as any)}
                title={c.title}
                className={`w-6 h-6 rounded-lg ${c.color} transition-transform ${
                  colorTheme === c.id ? 'ring-2 ring-[#A57D5C] scale-110' : 'opacity-70'
                }`}
              />
            ))}
          </div>

          {/* Edit Toggle */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center gap-1.5 px-3 py-2 font-semibold text-xs rounded-xl transition-all border ${
              isEditing
                ? 'bg-[#252220] text-white border-black shadow-2xs'
                : 'bg-white hover:bg-slate-50 text-[#252220] border-[#E8DFD5]'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'এডিটর লুকান' : 'তথ্য এডিট'}</span>
          </button>

          {/* Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#A57D5C] hover:bg-[#8C6546] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-[#A57D5C]/20 active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>পিডিএফ / প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Live Information Editor Drawer (Hidden in Print) */}
      {isEditing && (
        <div className="no-print bg-[#252220] text-white rounded-3xl p-5 border border-stone-800 shadow-xl space-y-4 animate-in slide-in-from-top-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-800">
            <h3 className="font-bold text-sm text-stone-200 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-[#DEC8B3]" />
              <span>আপনার ব্যক্তিগত তথ্য সংশোধন করুন (Live Editor)</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                if (lang === 'bn') setResumeData(DEFAULT_RESUME_BN);
                else setResumeData(DEFAULT_RESUME_EN);
              }}
              className="text-xs text-stone-400 hover:text-white flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>ডিফল্টে ফিরুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-stone-400 mb-1">পূর্ণ নাম:</label>
              <input
                type="text"
                value={resumeData.fullName}
                onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C]"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">পদবী / টাইটেল:</label>
              <input
                type="text"
                value={resumeData.professionalTitle}
                onChange={(e) =>
                  setResumeData({ ...resumeData, professionalTitle: e.target.value })
                }
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C]"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">মোবাইল নম্বর:</label>
              <input
                type="text"
                value={resumeData.phone}
                onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C]"
              />
            </div>

            <div>
              <label className="block text-stone-400 mb-1">ইমেইল ঠিকানা:</label>
              <input
                type="text"
                value={resumeData.email}
                onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">বর্তমান ঠিকানা / শহর:</label>
              <input
                type="text"
                value={resumeData.location}
                onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-stone-400 mb-1">প্রফেশনাল সারসংক্ষেপ:</label>
              <textarea
                rows={2}
                value={resumeData.summary}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                className="w-full px-3 py-2 bg-stone-900 border border-stone-700 rounded-xl text-white outline-hidden focus:border-[#A57D5C] resize-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* THE 1-PAGE RESUME CANVAS (Designed to fit 100% on exactly 1 single A4 page) */}
      {/* Inspired by Pinterest Warm Luxury Aesthetic (https://pin.it/5IllpaDq5)    */}
      {/* ========================================================================= */}
      <div id="resume-canvas-anchor" className="relative flex justify-center w-full max-w-full overflow-hidden py-2 sm:py-4">
        {/* Floating Decorative Elements from Pinterest Design (Hidden in Print) */}
        {layoutStyle === 'aesthetic' && (
          <>
            {/* Left Color Swatch Pill */}
            <div className="no-print hidden xl:flex flex-col items-center gap-2 p-2 rounded-2xl bg-white/90 backdrop-blur-sm border border-[#E8DFD5] shadow-lg absolute -left-16 top-16 z-20">
              <span className="w-5 h-5 rounded-full bg-[#FAF6F0] border border-[#DEC8B3]" title="Cream Base" />
              <span className="w-5 h-5 rounded-full bg-[#DEC8B3] border border-[#B08968]" title="Warm Sand" />
              <span className="w-5 h-5 rounded-full bg-[#A57D5C] shadow-xs" title="Caramel Mocha" />
              <span className="w-5 h-5 rounded-full bg-[#252220] shadow-xs" title="Espresso Charcoal" />
            </div>

            {/* Right Circular Stamp Badge */}
            <div className="no-print hidden lg:flex flex-col items-center justify-center text-center w-28 h-28 rounded-full bg-[#A57D5C] text-white p-3 shadow-xl absolute -right-8 -top-6 z-20 transform rotate-12 select-none border-2 border-white/40">
              <span className="text-[10px] tracking-widest uppercase font-black opacity-90">✦ FOCUS</span>
              <span className="text-[8.5px] tracking-wider uppercase font-semibold leading-tight mt-1 opacity-95">
                INVENTORY • CASH FLOW • RETAIL CARE
              </span>
            </div>

            {/* Bottom Right Floating Customer Satisfaction Badge */}
            <div className="no-print hidden lg:flex items-center gap-3 p-3 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#E8DFD5] shadow-xl absolute -right-10 bottom-24 z-20 select-none">
              <div className="w-12 h-12 rounded-full border-4 border-[#A57D5C] border-t-emerald-500 flex items-center justify-center font-black text-xs text-[#252220]">
                98%
              </div>
              <div className="text-left leading-tight pr-2">
                <p className="text-[11px] font-bold text-slate-800">কাস্টমার সন্তুষ্টি</p>
                <p className="text-[9px] text-[#A57D5C] font-semibold">Store Reliability</p>
              </div>
            </div>
          </>
        )}

        <div
          ref={resumeRef}
          style={fontStyle}
          className={`resume-single-page-print w-full max-w-[840px] text-[#252220] rounded-3xl shadow-2xl border transition-all duration-300 print:rounded-none print:shadow-none print:border-none print:max-w-none ${
            layoutStyle === 'aesthetic'
              ? 'bg-[#FAF6F0] border-[#E8DFD5]'
              : 'bg-white border-slate-200'
          }`}
        >
          {/* HEADER SECTION: Clean, Commanding & Editorial (Pinterest Style) */}
          <div
            className={`p-6 sm:p-8 border-b text-center relative ${
              layoutStyle === 'aesthetic'
                ? 'bg-gradient-to-b from-[#F7F2EA] to-[#FAF6F0] border-[#E8DFD5]'
                : 'bg-slate-50/50 border-slate-200'
            }`}
          >
            {/* Top Star & Tagline Motif */}
            <div className="flex items-center justify-center gap-2 mb-2 text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-[#8C6546]">
              <span>✦</span>
              <span>
                {lang === 'bn'
                  ? 'সততা ও সেবার প্রতিশ্রুতিবদ্ধ রিটেল ক্যারিয়ার'
                  : 'COMMERCIAL EXCELLENCE & EMPATHY'}
              </span>
              <span>✦</span>
            </div>

            {/* Candidate Name in Grand Editorial Typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#252220] tracking-tight leading-none mb-1">
              {resumeData.fullName}
            </h1>

            {/* Cursive / Script Layered Subtitle */}
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-[1px] w-8 sm:w-16 bg-[#DEC8B3]" />
              <p
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-base sm:text-xl italic font-semibold text-[#A57D5C]"
              >
                {resumeData.professionalTitle}
              </p>
              <span className="h-[1px] w-8 sm:w-16 bg-[#DEC8B3]" />
            </div>

            {/* Secondary Slogan */}
            <p className="text-[11px] font-bold tracking-wider text-[#7A6E65] uppercase mt-1">
              {lang === 'bn'
                ? 'নির্ভুল ক্যাশ ফ্লো, ইনভেন্টরি ম্যানেজমেন্ট ও নির্ভরযোগ্য খাতা পরিচালনা'
                : 'CRAFTING EXEMPLARY RETAIL EXPERIENCES THAT CUSTOMERS TRUST'}
            </p>

            {/* Contact Information Bar */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 mt-3 border-t border-[#E8DFD5]/80 text-xs text-[#5C534D] font-medium">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#A57D5C]" />
                <span className="font-bold text-[#252220]">{resumeData.phone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#A57D5C]" />
                <span className="font-bold text-[#252220]">{resumeData.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#A57D5C]" />
                <span>{resumeData.location}</span>
              </span>
            </div>
          </div>

          {/* TWO-COLUMN PERFECTLY BALANCED BODY */}
          <div
            className={`grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x text-xs leading-relaxed ${
              layoutStyle === 'aesthetic'
                ? 'divide-[#E8DFD5]'
                : 'divide-slate-200'
            }`}
          >
            {/* =================================================== */}
            {/* LEFT COLUMN (4 of 12 columns = 33% width)           */}
            {/* =================================================== */}
            <div
              className={`md:col-span-4 p-5 sm:p-6 space-y-4 ${
                layoutStyle === 'aesthetic' ? 'bg-[#F4EFE6]/50' : 'bg-slate-50/40'
              }`}
            >
              {/* SECTION: CORE SKILLS */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2.5 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'মূল দক্ষতা ও পারদর্শিতা' : 'Core Competencies'}</span>
                </h3>
                <ul className="space-y-1.5">
                  {resumeData.coreSkills.map((skill, idx) => (
                    <li key={idx} className="flex items-start gap-1.5 text-[#3D3733] font-medium">
                      <span className="text-[#A57D5C] font-black mt-0.5">•</span>
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SECTION: SOFTWARE & IT */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2.5 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <Layers className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'সফটওয়্যার ও আইটি' : 'Software & Tools'}</span>
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {resumeData.softwareSkills.map((tool, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded-md text-[11px] font-bold shadow-2xs border ${
                        layoutStyle === 'aesthetic'
                          ? 'bg-white border-[#DEC8B3] text-[#5C3D24]'
                          : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* SECTION: EDUCATION */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2.5 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <GraduationCap className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'শিক্ষাগত যোগ্যতা' : 'Education'}</span>
                </h3>
                <div className="space-y-3">
                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="leading-snug">
                      <p className="font-bold text-[#252220] text-xs">{edu.degree}</p>
                      <p className="text-[#6E635C] text-[11px]">{edu.institution}</p>
                      <p className="text-[#8C7E75] text-[10px] flex items-center gap-2 mt-0.5">
                        <span>সাল: {edu.year}</span>
                        <span>•</span>
                        <span className="font-bold text-[#A57D5C]">{edu.result}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: LANGUAGES */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <Globe className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'ভাষাগত দক্ষতা' : 'Languages'}</span>
                </h3>
                <div className="space-y-1">
                  {resumeData.languages.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px]">
                      <span className="font-bold text-[#252220]">{item.language}</span>
                      <span className="text-[#7A6E65] font-medium">{item.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: KEY STRENGTHS */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'ব্যক্তিগত বৈশিষ্ট্য' : 'Key Attributes'}</span>
                </h3>
                <ul className="space-y-1 text-[11px] text-[#3D3733]">
                  {resumeData.strengths.map((st, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-[#A57D5C] text-xs font-black">✓</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* =================================================== */}
            {/* RIGHT COLUMN (8 of 12 columns = 67% width)          */}
            {/* =================================================== */}
            <div
              className={`md:col-span-8 p-5 sm:p-6 space-y-4 ${
                layoutStyle === 'aesthetic' ? 'bg-[#FAF6F0]' : 'bg-white'
              }`}
            >
              {/* SECTION: PROFESSIONAL SUMMARY */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <User className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'প্রফেশনাল সারসংক্ষেপ' : 'Professional Summary'}</span>
                </h3>
                <p className="text-[#3D3733] text-xs sm:text-[12.5px] leading-relaxed font-normal text-justify">
                  {resumeData.summary}
                </p>
              </div>

              {/* SECTION: WORK EXPERIENCE */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-3 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <Briefcase className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'কর্মঅভিজ্ঞতা ও সাফল্য' : 'Professional Work Experience'}</span>
                </h3>

                <div className="space-y-4">
                  {resumeData.experiences.map((exp, idx) => (
                    <div
                      key={idx}
                      className={`relative pl-3.5 border-l-2 ${
                        layoutStyle === 'aesthetic' ? 'border-[#DEC8B3]' : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white"
                        style={{ backgroundColor: themeStyles.barColor }}
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 mb-1">
                        <h4 className="font-bold text-[#252220] text-xs sm:text-sm">
                          {exp.role}
                        </h4>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border shrink-0 ${
                            layoutStyle === 'aesthetic'
                              ? 'bg-[#F4EFE6] text-[#7A4B29] border-[#DEC8B3]'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {exp.period}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-[#6E635C] mb-1.5">
                        {exp.company} • <span className="font-normal text-[#8C7E75]">{exp.location}</span>
                      </p>

                      <ul className="space-y-1 text-[11px] sm:text-xs text-[#3D3733]">
                        {exp.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-1.5 leading-snug">
                            <span className="text-[#A57D5C] font-bold shrink-0 mt-0.5">▸</span>
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION: CERTIFICATIONS & TRAINING */}
              <div>
                <h3
                  className="font-black text-xs uppercase tracking-wider pb-1.5 mb-2 border-b-2 flex items-center gap-1.5 text-[#252220]"
                  style={{ borderColor: themeStyles.barColor }}
                >
                  <Award className="w-3.5 h-3.5" style={{ color: themeStyles.barColor }} />
                  <span>{lang === 'bn' ? 'প্রশিক্ষণ ও সার্টিফিকেট' : 'Training & Certifications'}</span>
                </h3>
                <ul className="space-y-1.5 text-xs text-[#3D3733]">
                  {resumeData.certifications.map((cert, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#A57D5C] font-bold">★</span>
                      <span className="font-medium">{cert}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* PINTEREST BOTTOM QUOTE & SOCIAL INTERACTION ICONS */}
              <div className="pt-4 border-t border-[#E8DFD5] space-y-2">
                <div className="text-center">
                  <p
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-xs sm:text-sm font-semibold italic text-[#5C4535]"
                  >
                    {lang === 'bn'
                      ? '"সততা ও সেবা যখন একটি নীরব শিল্প, গ্রাহকের আস্থা তখন অবিস্মরণীয়।"'
                      : '"GOOD SERVICE IS INVISIBLE, but the trust created is unforgettable."'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-[#8C7E75] pt-1">
                  <span>
                    {lang === 'bn'
                      ? 'আমি ঘোষণা করছি যে উল্লেখিত সকল তথ্য সঠিক ও সত্য।'
                      : 'I hereby declare that all information given above is true and authentic.'}
                  </span>
                  <div className="text-right">
                    <div className="font-serif italic text-[#252220] font-bold text-xs">
                      {resumeData.fullName}
                    </div>
                    <span className="text-[9px] text-[#A57D5C]">স্বাক্ষর / Signature</span>
                  </div>
                </div>

                {/* Subtle Pinterest Social Icons */}
                <div className="no-print flex items-center justify-center gap-5 pt-2 text-[#A57D5C]/70">
                  <Heart className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" />
                  <MessageSquare className="w-4 h-4 cursor-pointer hover:text-[#5C3D24] transition-colors" />
                  <Send className="w-4 h-4 cursor-pointer hover:text-[#5C3D24] transition-colors" />
                  <Bookmark className="w-4 h-4 cursor-pointer hover:text-[#5C3D24] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: AI STORE INTERVIEW PREPARATION (Hidden during print)              */}
      {/* ========================================================================= */}
      <div id="interview-prep-section">
        <InterviewPrepSection candidateRole={resumeData.professionalTitle} />
      </div>

      {/* ========================================================================= */}
      {/* FLOATING PRINT RESUME BUTTON (Hidden during printing via 'no-print')       */}
      {/* ========================================================================= */}
      <div className="no-print fixed bottom-20 md:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-2 group animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          type="button"
          onClick={handlePrint}
          title={
            lang === 'bn'
              ? 'ব্রাউজারের প্রিন্ট ডায়ালগ খুলুন ও A4 রেজুমে সংরক্ষণ করুন (Ctrl + P)'
              : 'Open browser print dialog for A4 Resume / PDF (Ctrl + P)'
          }
          className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-3.5 bg-gradient-to-r from-[#A57D5C] via-[#8C6546] to-[#6E472A] hover:from-[#8C6546] hover:to-[#5C3D24] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-[#A57D5C]/30 border border-white/20 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer select-none ring-4 ring-[#A57D5C]/20"
        >
          <div className="relative">
            <Printer className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DEC8B3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#F4EFE6]"></span>
            </span>
          </div>

          <div className="flex flex-col text-left leading-tight">
            <span className="text-xs sm:text-sm font-extrabold tracking-wide drop-shadow-xs">
              {lang === 'bn' ? 'প্রিন্ট রেজুমে' : 'Print Resume'}
            </span>
            <span className="text-[10px] text-[#DEC8B3] font-semibold opacity-90 hidden sm:inline">
              {lang === 'bn' ? 'A4 পেজ • PDF সংরক্ষণ' : 'A4 Page • Save PDF'}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
