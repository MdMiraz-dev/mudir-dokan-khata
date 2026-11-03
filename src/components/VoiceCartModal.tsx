import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { parseVoiceCommand } from '../utils/voiceOrderParser';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakTextWithMaleVoice } from '../utils/speechHelper';

interface VoiceCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceCartModal: React.FC<VoiceCartModalProps> = ({ isOpen, onClose }) => {
  const { products, addToCart, settings } = useKhata();

  const [voiceLang, setVoiceLang] = useState<'en' | 'bn'>('bn');
  const [autoAdd, setAutoAdd] = useState(true);
  const [soundFeedback, setSoundFeedback] = useState(true);

  const [isListening, setIsListening] = useState(false);
  const [speechText, setSpeechText] = useState('');
  const [lastAddedFeedback, setLastAddedFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [manualInput, setManualInput] = useState('');
  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      setSpeechText('');
      setLastAddedFeedback(null);
      setErrorMessage(null);
    }
  }, [isOpen]);

  const processTranscript = (transcript: string) => {
    setSpeechText(transcript);
    const parsed = parseVoiceCommand(transcript);

    if (!parsed || !parsed.productQuery) {
      setErrorMessage(`পণ্যটি বোঝা যায়নি: "${transcript}"`);
      return;
    }

    const query = parsed.productQuery.toLowerCase().trim();

    // Match with product inventory with smart scoring
    const queryTokens = query.split(/\s+/).filter((t) => t.length > 1);

    const matchedProduct = products.find((p) => {
      const name = p.name.toLowerCase();
      const bnName = (p.banglaName || '').toLowerCase();
      return (
        name.includes(query) ||
        bnName.includes(query) ||
        query.includes(name) ||
        (bnName && query.includes(bnName)) ||
        queryTokens.some((tok) => bnName.includes(tok) || name.includes(tok))
      );
    });

    if (matchedProduct) {
      // Calculate adjusted quantity (e.g. 500gm -> 0.5kg, 500ml -> 0.5 litre)
      let adjustedQty = parsed.quantity;
      if (parsed.unit === 'gm' && matchedProduct.unit === 'kg') {
        adjustedQty = parsed.quantity / 1000;
      } else if (parsed.unit === 'ml' && matchedProduct.unit === 'litre') {
        adjustedQty = parsed.quantity / 1000;
      }

      if (autoAdd) {
        addToCart(matchedProduct, adjustedQty);
        const feedback = `${adjustedQty} ${matchedProduct.unit} ${matchedProduct.banglaName || matchedProduct.name} কার্টে যোগ করা হয়েছে`;
        setLastAddedFeedback(feedback);
        setErrorMessage(null);

        if (soundFeedback) {
          // Speak feedback in Male Voice
          speakTextWithMaleVoice(feedback, 'bn');
        }
      } else {
        setLastAddedFeedback(`চিহ্নিত: ${adjustedQty} ${matchedProduct.unit} ${matchedProduct.banglaName || matchedProduct.name}`);
      }
    } else {
      setErrorMessage(`দুঃখিত, স্টকে "${parsed.productQuery}" নামে কোনো পণ্য পাওয়া যায়নি।`);
      if (soundFeedback) {
        speakTextWithMaleVoice(`পণ্যটি স্টকে পাওয়া যায়নি`, 'bn');
      }
    }
  };

  const startListening = () => {
    if (!isSpeechRecognitionSupported()) {
      setErrorMessage('আপনার ব্রাউজারে মাইক্রোফোন ইনপুট সমর্থিত নয়। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    setErrorMessage(null);
    setIsListening(true);
    setSpeechText('শুনছি... এখন মুখে বলুন...');

    let debounceTimer: any = null;

    const recognizer = createSpeechRecognizer({
      lang: voiceLang === 'en' ? 'en-US' : 'bn-BD',
      continuous: true,
      interimResults: true,
      onResult: (transcript, isFinal) => {
        setSpeechText(transcript);
        if (debounceTimer) clearTimeout(debounceTimer);
        // Allow user to finish speaking full quantity and item name
        if (isFinal && transcript.trim()) {
          debounceTimer = setTimeout(() => {
            processTranscript(transcript);
            stopListening();
          }, 1400);
        }
      },
      onError: (err) => {
        setErrorMessage(err);
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
        setErrorMessage(e.message || 'ভয়েস চালু করা যায়নি');
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }
    setIsListening(false);
  };

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    processTranscript(manualInput);
    setManualInput('');
  };

  const handleSampleClick = (sample: string) => {
    processTranscript(sample);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#F5EEE7] border-b border-[#DEC4AD] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#B2825C] text-white flex items-center justify-center shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-800 text-base sm:text-lg">ভয়েস কার্ট অ্যাসিস্ট্যান্ট</h2>
                <span className="px-2 py-0.5 bg-[#F5EEE7] text-[#6E472A] rounded-full text-[11px] font-semibold">
                  AI Voice
                </span>
              </div>
              <p className="text-xs text-slate-500">মুখ দিয়ে বলুন, স্বয়ংক্রিয়ভাবে কার্টে যোগ হবে</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="px-4 sm:px-6 py-3 bg-slate-50/70 border-b border-[#E8DFD3] flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Language Switch */}
          <div className="flex items-center gap-1.5">
            <span className="font-medium text-slate-600">ভাষা:</span>
            <button
              type="button"
              onClick={() => setVoiceLang('en')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                voiceLang === 'en'
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E8DFD3] hover:bg-slate-100'
              }`}
            >
              English (add 2kg rice)
            </button>
            <button
              type="button"
              onClick={() => setVoiceLang('bn')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                voiceLang === 'bn'
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-[#E8DFD3] hover:bg-slate-100'
              }`}
            >
              বাংলা (২ কেজি চাল)
            </button>
          </div>

          {/* Options */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
              <input
                type="checkbox"
                checked={autoAdd}
                onChange={(e) => setAutoAdd(e.target.checked)}
                className="rounded-sm text-[#B2825C] focus:ring-[#B2825C] w-4 h-4"
              />
              <span>স্বয়ংক্রিয় যোগ</span>
            </label>

            <button
              type="button"
              onClick={() => setSoundFeedback(!soundFeedback)}
              title={soundFeedback ? 'পুরুষ কণ্ঠের শব্দ বন্ধ করুন' : 'পুরুষ কণ্ঠের শব্দ চালু করুন'}
              className={`p-1.5 rounded-lg border transition-all ${
                soundFeedback
                  ? 'bg-[#F5EEE7] text-[#6E472A] border-[#DEC4AD]'
                  : 'bg-white text-slate-400 border-[#E8DFD3]'
              }`}
            >
              {soundFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Central Large Mic Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all transform active:scale-95 shadow-lg ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-100'
                  : 'bg-slate-800 hover:bg-slate-900 text-white ring-8 ring-slate-100'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold">শুনছি...</span>
                </>
              ) : (
                <>
                  <Mic className="w-8 h-8 mb-1" />
                  <span className="text-[11px] font-bold">শুরু করুন</span>
                </>
              )}
            </button>

            <p className="mt-4 text-xs sm:text-sm text-slate-600 font-medium text-center">
              মাইক্রোফোনে ক্লিক করে বলুন <span className="font-bold text-[#83593B]">'add 2kg rice'</span> বা <span className="font-bold text-[#83593B]">'৫০০ গ্রাম চিনি'</span>
            </p>
          </div>

          {/* Speech Text Box */}
          <div className="bg-slate-50 border border-[#E8DFD3] rounded-2xl p-4">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              শোনা কথা (SPEECH TEXT):
            </p>
            <p className="text-slate-800 text-sm font-medium min-h-[24px]">
              {speechText || <span className="text-slate-400 italic">এখানে আপনি যা বলবেন তা লেখা আসবে...</span>}
            </p>
          </div>

          {/* Feedback Success / Error */}
          {lastAddedFeedback && (
            <div className="p-3 bg-[#F5EEE7] border border-[#DEC4AD] rounded-xl flex items-center gap-2.5 text-[#6E472A] text-xs sm:text-sm font-medium animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-[#B2825C] shrink-0" />
              <span>{lastAddedFeedback}</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2.5 text-amber-800 text-xs sm:text-sm font-medium animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Sample Commands */}
          <div>
            <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mb-2.5">
              <span>✨ নমুনা ভয়েস কমান্ড (ক্লিক করেও পরীক্ষা করতে পারেন):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                'add 2kg rice',
                '500g sugar',
                '২ কেজি চাল',
                '৫০০ গ্রাম চিনি',
                '১ লিটার তেল',
                '২ প্যাকেট বিস্কুট',
                '৪ পিস ডিম'
              ].map((cmd) => (
                <button
                  key={cmd}
                  type="button"
                  onClick={() => handleSampleClick(cmd)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-[#F5EEE7] hover:text-[#83593B] border border-[#E8DFD3] rounded-xl text-xs font-medium text-slate-700 transition-colors"
                >
                  "{cmd}"
                </button>
              ))}
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleManualAdd} className="pt-2 border-t border-[#E8DFD3]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              কীবোর্ড দিয়ে লিখে পরীক্ষা করুন:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="যেমন: add 2kg rice বা 500g sugar বা ১ লিটার তেল"
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm border border-[#E8DFD3] rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-medium flex items-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" />
                যোগ করুন
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-[#E8DFD3] flex items-center justify-between text-xs text-slate-500">
          <span>ⓘ গ্রাম (g) বললে স্বয়ংক্রিয়ভাবে কেজিতে (kg) রূপান্তর হবে।</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl font-medium"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
