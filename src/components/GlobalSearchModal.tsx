import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Mic,
  MicOff,
  X,
  Package,
  Users,
  Plus,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported } from '../utils/speechHelper';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { products, customers, addToCart, settings } = useKhata();
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognizerRef = useRef<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSpeechError(null);
    } else {
      stopVoice();
    }
  }, [isOpen]);

  const startVoice = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থিত নয়। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    setSpeechError(null);
    setIsListening(true);

    let debounceTimer: any = null;

    const recognizer = createSpeechRecognizer({
      lang: settings.language === 'en' ? 'en-US' : 'bn-BD',
      continuous: true,
      interimResults: true,
      onResult: (transcript, isFinal) => {
        setQuery(transcript);
        if (debounceTimer) clearTimeout(debounceTimer);
        if (isFinal && transcript.trim()) {
          debounceTimer = setTimeout(() => {
            stopVoice();
          }, 1500);
        }
      },
      onError: (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      }
    });

    if (recognizer) {
      recognizerRef.current = recognizer;
      try {
        recognizer.start();
      } catch (e: any) {
        setSpeechError(e.message || 'ভয়েস চালু করা যায়নি');
        setIsListening(false);
      }
    }
  };

  const stopVoice = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      stopVoice();
    } else {
      startVoice();
    }
  };

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchingProducts = cleanQuery
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQuery) ||
          (p.banglaName && p.banglaName.toLowerCase().includes(cleanQuery)) ||
          p.category.toLowerCase().includes(cleanQuery) ||
          (p.barcode && p.barcode.includes(cleanQuery))
      )
    : [];

  const matchingCustomers = cleanQuery
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(cleanQuery) ||
          c.phone.includes(cleanQuery) ||
          (c.address && c.address.toLowerCase().includes(cleanQuery))
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E8DFD3] overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh]">
        {/* Search Bar Input */}
        <div className="p-4 border-b border-[#E8DFD3] flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="পণ্য বা গ্রাহকের নাম বলুন বা লিখুন (যেমন: চাল, ডাল, রফিকুল)..."
            className="flex-1 bg-transparent text-slate-800 text-base outline-hidden placeholder:text-slate-400"
          />

          {/* Voice Microphone Access Button */}
          <button
            type="button"
            onClick={toggleVoice}
            className={`p-2.5 rounded-xl flex items-center gap-1.5 transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-md'
                : 'bg-[#F5EEE7] hover:bg-emerald-200 text-[#6E472A]'
            }`}
            title={isListening ? 'শোনা বন্ধ করুন' : 'মাইক্রোফোন দিয়ে বলুন'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span className="text-xs font-semibold hidden sm:inline">
              {isListening ? 'শুনছি...' : 'ভয়েস'}
            </span>
          </button>

          {/* Clear & Close */}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Listening / Error Banner */}
        {isListening && (
          <div className="bg-[#F5EEE7] px-4 py-2 text-xs text-[#6E472A] flex items-center gap-2 border-b border-emerald-100">
            <span className="w-2 h-2 rounded-full bg-[#F5EEE7]0 animate-ping" />
            <span>মাইক্রোফোন চালু আছে: আপনি যা বলছেন তা স্বয়ংক্রিয়ভাবে সার্চ বক্সে আসছে...</span>
          </div>
        )}

        {speechError && (
          <div className="bg-amber-50 px-4 py-2 text-xs text-amber-800 flex items-center gap-2 border-b border-amber-200">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{speechError}</span>
          </div>
        )}

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {!cleanQuery ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">পণ্য বা গ্রাহকের নাম টাইপ করুন অথবা মাইক্রোফোনে ক্লিক করে মুখে বলুন</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs">
                {['মিনিকেট চাল', 'সয়াবিন তেল', 'মসুর ডাল', 'চিনি', 'রফিকুল'].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                    className="px-3 py-1 bg-slate-100 hover:bg-[#F5EEE7] hover:text-[#83593B] rounded-full border border-[#E8DFD3] transition-colors"
                  >
                    "{suggestion}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Products Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-[#B2825C]" />
                  পণ্য তালিকা ({matchingProducts.length})
                </h3>
                {matchingProducts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">কোনো পণ্য পাওয়া যায়নি</p>
                ) : (
                  <div className="space-y-2">
                    {matchingProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E8DFD3] hover:border-[#DEC4AD] hover:bg-[#F5EEE7]/40 transition-all bg-white"
                      >
                        <div className="leading-tight">
                          <p className="font-semibold text-slate-800 text-sm">
                            {product.banglaName || product.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            স্টক: {product.stock} {product.unit} | মূল্য: {settings.currency}{product.sellingPrice}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product, 1);
                            onClose();
                            if (onNavigateTab) onNavigateTab('pos');
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          কার্টে নিন
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Customers Section */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  গ্রাহক তালিকা ({matchingCustomers.length})
                </h3>
                {matchingCustomers.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-1">কোনো গ্রাহক পাওয়া যায়নি</p>
                ) : (
                  <div className="space-y-2">
                    {matchingCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        onClick={() => {
                          onClose();
                          if (onNavigateTab) onNavigateTab('due_khata');
                        }}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#E8DFD3] hover:border-blue-300 hover:bg-blue-50/40 transition-all bg-white cursor-pointer"
                      >
                        <div className="leading-tight">
                          <p className="font-semibold text-slate-800 text-sm">{customer.name}</p>
                          <p className="text-xs text-slate-500">ফোন: {customer.phone} {customer.address ? `| ${customer.address}` : ''}</p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                              customer.totalDue > 0
                                ? 'bg-red-100 text-red-700'
                                : 'bg-[#F5EEE7] text-[#83593B]'
                            }`}
                          >
                            বাকি: {settings.currency}{customer.totalDue.toLocaleString()}
                          </span>
                          <p className="text-[11px] text-blue-600 flex items-center justify-end gap-1 mt-1">
                            খাতা দেখুন <ArrowRight className="w-3 h-3" />
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
