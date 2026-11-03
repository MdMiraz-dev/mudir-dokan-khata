import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Plus,
  Trash2,
  Search,
  CheckCircle,
  HelpCircle,
  X,
  Sparkles
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { MasalaRule } from '../types';
import { speakTextWithMaleVoice } from '../utils/speechHelper';

export const MasailView: React.FC = () => {
  const { masalaRules, addMasalaRule, deleteMasalaRule, settings } = useKhata();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [source, setSource] = useState('');
  const [category, setCategory] = useState<MasalaRule['category']>('weight_measure');

  const filteredRules = masalaRules.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.source.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || r.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) return;

    addMasalaRule({
      title: title.trim(),
      details: details.trim(),
      source: source.trim() || 'কোরআন ও সহিহ হাদিস',
      category
    });

    setIsAddOpen(false);
    setTitle('');
    setDetails('');
    setSource('');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#B2825C] text-white flex items-center justify-center shadow-md">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              ইসলামিক ব্যবসায়িক রুলস ও নৈতিক মাসআলা
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              কোরআন ও সহিহ হাদিসের আলোকে সততা, সঠিক ওজন ও হালাল রিযিকের বিধান
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন মাসআলা যোগ</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="মাসআলা বা দলিলের সূত্র খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 border border-[#E8DFD3] rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'সকল মাসআলা' },
            { id: 'weight_measure', label: 'ওজন ও পরিমাপ' },
            { id: 'due_repayment', label: 'বাকি ও ঋণ' },
            { id: 'hoarding_monopoly', label: 'মজুদদারি' },
            { id: 'truthfulness', label: 'সততা ও ভেজাল' }
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Masala Rules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-2xl border border-[#E8DFD3] p-5 shadow-xs hover:border-[#B2825C] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm sm:text-base leading-snug flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#B2825C] shrink-0" />
                  <span>{rule.title}</span>
                </h3>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`আপনি কি "${rule.title}" মুছে ফেলতে চান?`)) {
                      deleteMasalaRule(rule.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-red-500 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {rule.details}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#83593B] bg-[#F5EEE7] px-2 py-0.5 rounded-md truncate max-w-[220px]">
                📖 {rule.source}
              </span>

              {/* Male Voice Speaker Button */}
              <button
                type="button"
                onClick={() => speakTextWithMaleVoice(`${rule.title}। ${rule.details}`, 'bn')}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-[#F5EEE7] text-slate-700 hover:text-[#83593B] rounded-lg text-xs font-semibold transition-colors"
                title="পুরুষ কণ্ঠে শুনুন"
              >
                <Volume2 className="w-3.5 h-3.5 text-[#B2825C]" />
                <span>পুরুষ কণ্ঠে শুনুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Add Masala Rule */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#B2825C]" />
                <span>নতুন ইসলামিক ব্যবসায়িক মাসআলা যোগ</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">মাসআলার শিরোনাম (Title) *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: পণ্যের দোষ-ত্রুটি গোপন করার হুকুম"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden bg-white text-slate-800"
                >
                  <option value="weight_measure">ওজন ও পরিমাপ</option>
                  <option value="due_repayment">বাকি ও ঋণ লেনদেন</option>
                  <option value="hoarding_monopoly">মজুদদারি ও কৃত্রিম সংকট</option>
                  <option value="truthfulness">সততা ও ভেজালমুক্ত ব্যবসা</option>
                  <option value="general">সাধারণ ব্যবসায়িক নীতি</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">বিস্তারিত হুকুম / নৈতিক নিয়মাবলী *</label>
                <textarea
                  rows={4}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="কোরআন-হাদিসের দলিল বা নৈতিক ব্যবসায়িক নির্দেশনা বিস্তারিত এখানে লিখুন..."
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">রেফারেন্স / বইয়ের উৎস (Source/Book)</label>
                <input
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="উদা: বুখারী শরিফ, সূরা আল-বাকারাহ আয়াত ২৮২"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  মাসআলা সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
