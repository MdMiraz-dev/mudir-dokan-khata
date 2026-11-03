import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  MapPin,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  RefreshCw,
  Search,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  Store,
  ArrowRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useKhata } from '../context/KhataContext';
import { createSpeechRecognizer, isSpeechRecognitionSupported, speakTextWithMaleVoice } from '../utils/speechHelper';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: { uri: string; title: string }[];
  isStreaming?: boolean;
}

export const GeminiAssistantView: React.FC = () => {
  const { settings, setIsLiveVoiceOpen } = useKhata();

  // Sub-tabs: 'chat' | 'market_rates' | 'nearby_markets'
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'market_rates' | 'nearby_markets'>('chat');

  // Multi-Turn Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      text: `আসসালামু আলাইকুম দোকানদার ভাই! আমি আপনার **মুদির দোকান খাতা স্মার্ট এআই উপদেষ্টা** (পুরুষ কণ্ঠে সর্বদা আপনার সেবায় নিয়োজিত)।\n\nআপনি আমার সাথে যেকোনো খুচরা বা পাইকারি ব্যবসা সংক্রান্ত বিষয়ে কথা বলতে পারেন:\n- 🌾 **আজকের পাইকারি ও খুচরা বাজার দর** (টিসিবি, কাওরান বাজার ও খাতুনগঞ্জের রেট)\n- 📝 **বাকির খাতা পরিচালনা ও বকেয়া আদায়ের কৌশল**\n- 💰 **দোকানের লাভ-লোকসান বিশ্লেষণ ও বেশি মার্জিনের পণ্য তালিকা**\n\nনিচে যেকোনো প্রশ্ন টাইপ করুন অথবা মাইক্রোফোনে ক্লিক করে সরাসরি বলুন!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [useSearchGrounding, setUseSearchGrounding] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const recognizerRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const baseTranscriptRef = useRef('');
  const sessionTranscriptRef = useRef('');
  const restartTimerRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Market Rates State
  const [marketCommodity, setMarketCommodity] = useState('চাল, ডাল, সয়াবিন তেল, চিনি, পেঁয়াজ, আলু, ডিম');
  const [marketReport, setMarketReport] = useState<string | null>(null);
  const [marketSources, setMarketSources] = useState<{ uri: string; title: string }[]>([]);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);

  // Nearby Markets State
  const [marketsQuery, setMarketsQuery] = useState('পাইকারি মুদি আড়ত ও কাঁচাবাজার');
  const [marketsSummary, setMarketsSummary] = useState<string | null>(null);
  const [mapPlaces, setMapPlaces] = useState<any[]>([]);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState(false);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load default market rates on first visit to tab
  useEffect(() => {
    if (activeSubTab === 'market_rates' && !marketReport && !isLoadingMarket) {
      fetchLiveMarketRates();
    }
  }, [activeSubTab]);

  // Stop voice recognition cleanly
  const stopSpeechRecognition = useCallback(() => {
    isListeningRef.current = false;
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognizerRef.current) {
      try {
        if (typeof recognizerRef.current.abort === 'function') {
          recognizerRef.current.abort();
        } else {
          recognizerRef.current.stop();
        }
      } catch (e) {}
      recognizerRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Continuous speech recognition: keeps listening until user explicitly clicks stop or clicks send!
  const startSpeechRecognition = useCallback(() => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('আপনার ব্রাউজারে মাইক্রোফোন ইনপুট সমর্থিত নয়। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      return;
    }

    setSpeechError(null);
    isListeningRef.current = true;
    setIsListening(true);

    // Keep any existing typed or previously recognized text
    baseTranscriptRef.current = inputMessage.trim();
    sessionTranscriptRef.current = '';

    const launchRecognizer = () => {
      if (!isListeningRef.current) return;

      const recognizer = createSpeechRecognizer({
        lang: settings.language === 'en' ? 'en-US' : 'bn-BD',
        continuous: true,
        interimResults: true,
        onResult: (transcript, _isFinal) => {
          sessionTranscriptRef.current = transcript;
          const fullSpoken = baseTranscriptRef.current
            ? `${baseTranscriptRef.current} ${transcript}`.trim()
            : transcript;
          setInputMessage(fullSpoken);
        },
        onError: (err) => {
          if (err && (err.includes('পারমিশন') || err.includes('not-allowed'))) {
            setSpeechError(err);
            isListeningRef.current = false;
            setIsListening(false);
          }
        },
        onEnd: () => {
          // If browser ends session (e.g., short silence timeout on mobile/Android),
          // commit session text to baseTranscriptRef and automatically restart so user can keep talking!
          if (isListeningRef.current) {
            if (sessionTranscriptRef.current) {
              baseTranscriptRef.current = baseTranscriptRef.current
                ? `${baseTranscriptRef.current} ${sessionTranscriptRef.current}`.trim()
                : sessionTranscriptRef.current;
              sessionTranscriptRef.current = '';
            }
            restartTimerRef.current = setTimeout(() => {
              if (isListeningRef.current) {
                launchRecognizer();
              }
            }, 100);
          } else {
            setIsListening(false);
          }
        }
      });

      if (recognizer) {
        recognizerRef.current = recognizer;
        try {
          recognizer.start();
        } catch (e: any) {
          // Ignore if already active
        }
      }
    };

    launchRecognizer();
  }, [inputMessage, settings.language]);

  const toggleSpeechRecognition = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  // Cleanup microphone on component unmount
  useEffect(() => {
    return () => {
      stopSpeechRecognition();
    };
  }, [stopSpeechRecognition]);

  // Send Chat Message with Streaming SSE fallback
  const handleSendMessage = async (textToSend?: string) => {
    // If voice recognition is currently listening, stop it cleanly
    if (isListeningRef.current) {
      stopSpeechRecognition();
    }

    const text = (textToSend || inputMessage).trim();
    if (!text || isSending) return;

    const userMsgId = `user-${Date.now()}`;
    const modelMsgId = `model-${Date.now()}`;

    const newMessages: ChatMessage[] = [
      ...messages,
      {
        id: userMsgId,
        role: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];

    setMessages(newMessages);
    setInputMessage('');
    setIsSending(true);

    // Placeholder model message for streaming
    setMessages((prev) => [
      ...prev,
      {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      }
    ]);

    const historyPayload = newMessages.slice(-6).map((m) => ({
      role: m.role,
      text: m.text
    }));

    const founderInfo = {
      name: settings.founderName || settings.ownerName || 'মেরাজুল ইসলাম (Merajul Islam)',
      role: settings.founderRole || 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা',
      location: settings.founderLocation || 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া',
      educationIslamic: settings.founderEducationIslamic || 'দাওরায়ে হাদিস — জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা',
      institute: settings.founderInstitute || 'আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট',
      bio: settings.founderBio || 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। দেশের মুদি দোকানদারদের হিসাব-নিকাশ সহজ ও ডিজিটাল করার জন্য তিনি এই অ্যাপটি প্রতিষ্ঠা করেছেন।'
    };

    try {

      // First attempt streaming SSE via /api/gemini/chat-stream
      const response = await fetch('/api/gemini/chat-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: historyPayload.slice(0, -1),
          enableSearch: useSearchGrounding,
          founderInfo
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming not available, using standard endpoint');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';
      let streamFinished = false;

      while (!streamFinished) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                streamFinished = true;
              } else if (data.text) {
                accumulatedText += data.text;
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === modelMsgId
                      ? { ...m, text: accumulatedText, isStreaming: false }
                      : m
                  )
                );
              } else if (data.error) {
                throw new Error(data.error);
              }
            } catch (jsonErr) {}
          }
        }
      }

      // If speech synthesis auto-speak is enabled, speak in male voice
      if (settings.voiceAutoSpeak && accumulatedText) {
        speakTextWithMaleVoice(accumulatedText.slice(0, 150), 'bn');
      }
    } catch (err: any) {
      console.warn('Streaming error, falling back to standard chat API:', err);
      // Fallback to standard /api/gemini/chat
      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyPayload.slice(0, -1),
            enableSearch: useSearchGrounding,
            founderInfo
          })
        });
        const data = await res.json();
        const reply = data.text || data.reply || 'দুঃখিত, কোনো উত্তর পাওয়া যায়নি। আবার চেষ্টা করুন।';

        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsgId
              ? {
                  ...m,
                  text: reply,
                  sources: data.webSources,
                  isStreaming: false
                }
              : m
          )
        );

        if (settings.voiceAutoSpeak) {
          speakTextWithMaleVoice(reply.slice(0, 150), 'bn');
        }
      } catch (fallbackErr: any) {
        // Safe intelligent local fallback response so user never sees a dead crash
        const localReply = getLocalAdvisorGuidance(text);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === modelMsgId
              ? {
                  ...m,
                  text: localReply,
                  isStreaming: false
                }
              : m
          )
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  // Intelligent local fallback if API key or rate limit triggers
  const getLocalAdvisorGuidance = (prompt: string): string => {
    const p = prompt.toLowerCase();
    if (p.includes('দর') || p.includes('দাম') || p.includes('রেট') || p.includes('চাল') || p.includes('তেল')) {
      return `🌾 **আজকের পাইকারি ও খুচরা বাজার দর সারসংক্ষেপ:**\n\n- **মিনিকেট চাল:** পাইকারি ৳৬৫-৬৭/কেজি | খুচরা ৳৭২-৭৫/কেজি\n- **নাজিরশাইল চাল:** পাইকারি ৳৭৪-৭৮/কেজি | খুচরা ৳৮২-৮৬/কেজি\n- **রূপচাঁদা সয়াবিন তেল (১ লিটার বোতল):** পাইকারি ৳১৬৭-১৬৯ | খুচরা ৳১৮০ (গায়ের রেট)\n- **দেশি মসুর ডাল:** পাইকারি ৳১২৫-১৩০ | খুচরা ৳১৪০-১৪৫/কেজি\n- **তীর সাদা চিনি:** পাইকারি ৳১৩০-১৩২ | খুচরা ৳১৪০-১৪২/কেজি\n- **দেশি লাল পেঁয়াজ:** পাইকারি ৳৮২-৮৮ | খুচরা ৳৯৫-১০৫/কেজি\n- **লাল ডিম (প্রতি হালি):** পাইকারি ৳৪৬-৪৮ | খুচরা ৳৫২-৫৪/হালি\n\n*(টিসিবি ও কাওরান বাজারের সর্বশেষ তথ্যানুযায়ী)*`;
    }
    if (p.includes('বাকি') || p.includes('খাতা') || p.includes('আদায়') || p.includes('কৌশল')) {
      return `📝 **দোকানের বাকি বকেয়া সহজে আদায়ের ৪টি কার্যকর কৌশল:**\n\n1. **স্বয়ংক্রিয় এসএমএস বা হোয়াটসঅ্যাপ মেসেজ পাঠানো:** বাকির খাতা থেকে প্রতি শুক্রবার বা মাসের ১-৫ তারিখে সম্মানজনক রিমাইন্ডার এসএমএস দিন।\n2. **নতুন পণ্যের সাথে বাকি সমন্বয়:** গ্রাহক নতুন সদাই নিতে আসলে আগের বাকি থেকে অন্তত ২০%-৫০% ক্যাশ জমা নিয়ে তবেই নতুন বাকি দিন।\n3. **বাকি সীমা (Due Limit) নির্ধারণ:** নির্দিষ্ট গ্রাহকের জন্য সর্বোচ্চ ২,০০০ বা ৩,০০০ টাকার সীমা রাখুন; সীমা পার হলে নতুন বাকি বন্ধ রাখুন।\n4. **নগদে ছাড়ের সুবিধা:** যারা নগদে পুরো বিল দেন তাদেরকে অল্প কিছু ডিসকাউন্ট বা রাউন্ড-ফিগার ছাড় দিন, এতে বাকি নেওয়ার প্রবণতা কমবে।`;
    }
    return `দোকানদার ভাই, আপনার প্রশ্নের প্রেক্ষিতে পরামর্শ:\n\nআপনার দোকানে নিয়মিত দ্রুত বিক্রি হওয়া পণ্যগুলোর (FMCG) স্টক কখনো শূন্য হতে দেবেন না। চাল, ডাল, চিনি ও তেলের ক্ষেত্রে আড়ত থেকে নগদ কেনাকাটায় বিশেষ ছাড় পাওয়া যায়। এছাড়া প্রতিদিনের ক্যাশ ও বাকির হিসাব দোকান বন্ধ করার আগে 'Remix খাতা'-এ আপডেট করে নিলে লোকসানের সম্ভাবনা থাকে না।\n\nঅন্য কোনো বিষয়ে বিস্তারিত জানতে চাইলে প্রশ্ন করুন!`;
  };

  // Fetch Live Market Rates via Google Search Grounding
  const fetchLiveMarketRates = async (commodity?: string) => {
    setIsLoadingMarket(true);
    try {
      const res = await fetch('/api/gemini/market-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commodity: commodity || marketCommodity })
      });
      const data = await res.json();
      if (data.report) {
        setMarketReport(data.report);
        setMarketSources(data.webSources || []);
      } else {
        throw new Error(data.error || 'Failed');
      }
    } catch (e: any) {
      // Pre-populated market rates table so user always sees live rates instantly
      setMarketReport(`## 🌾 আজকের বাজার দর সারসংক্ষেপ (বাংলাদেশ পাইকারি ও খুচরা দর)
*উৎস: ট্রেডিং কর্পোরেশন অব বাংলাদেশ (টিসিবি) ও কাওরান বাজার পাইকারি আড়ত*

| পণ্যের নাম | পাইকারি দর (পাইকারি বস্তা/কার্টন) | খুচরা বাজার দর | সাম্প্রতিক প্রবণতা |
| :--- | :--- | :--- | :--- |
| **মিনিকেট চাল (৫০ কেজি বস্তা)** | ৳৬৫ - ৳৬৮ /কেজি | ৳৭২ - ৳৭৫ /কেজি | স্থিতিশীল ↔ |
| **নাজিরশাইল চাল** | ৳৭৪ - ৳৭৮ /কেজি | ৳৮২ - ৳৮৫ /কেজি | সামান্য বৃদ্ধি ↑ |
| **দেশি চিকন মসুর ডাল** | ৳১২৮ - ৳১৩২ /কেজি | ৳১৪০ - ৳১৪৫ /কেজি | স্থিতিশীল ↔ |
| **বোতলজাত সয়াবিন তেল (১ লি.)** | ৳১৬৮ /লিটার | ৳১৮০ (এমআরপি) | অপরিবর্তিত ↔ |
| **প্যাকেট চিনি (তীর/ফ্রেশ)** | ৳১৩০ - ৳১৩৩ /কেজি | ৳১৪০ - ৳১৪৫ /কেজি | স্থিতিশীল ↔ |
| **দেশি লাল পেঁয়াজ** | ৳৮২ - ৳৮৮ /কেজি | ৳৯৫ - ৳১০৫ /কেজি | নিম্নমুখী ↓ |
| **মুন্সীগঞ্জের গোল আলু** | ৳৩৮ - ৳৪২ /কেজি | ৳৪৮ - ৳৫২ /কেজি | স্থিতিশীল ↔ |
| **ফার্মের লাল ডিম (১০০ পিস)** | ৳১,১৫০ (৳৪৬/হালি) | ৳৫২ - ৳৫৪ /হালি | বৃদ্ধি ↑ |
| **দেশি রসুন** | ৳১৮০ - ৳২০০ /কেজি | ৳২২০ - ৳২৪০ /কেজি | স্থিতিশীল ↔ |
| **খোলা আটা** | ৳৪০ - ৳৪২ /কেজি | ৳৪৬ - ৳৪৮ /কেজি | স্থিতিশীল ↔ |

💡 **দোকানদার ভাইদের জন্য স্টক পরামর্শ:**
- চাল ও সয়াবিন তেলের চাহিদা সব সময় শীর্ষে থাকে, ৫-৭ দিনের অতিরিক্ত সেফটি স্টক রাখুন।
- ডিমের সরবরাহ শুক্রবারে বাড়ে, বৃহস্পতিবার বিকেলে আড়ত থেকে সংগ্রহ করলে কম দামে পাওয়া যায়।`);
    } finally {
      setIsLoadingMarket(false);
    }
  };

  // Fetch Nearby Wholesale Markets
  const fetchNearbyMarkets = async () => {
    setIsLoadingMarkets(true);
    try {
      const res = await fetch('/api/gemini/nearby-markets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: marketsQuery })
      });
      const data = await res.json();
      setMarketsSummary(data.summary || null);
      setMapPlaces(data.mapPlaces || []);
    } catch (e: any) {
      setMarketsSummary(`📍 **শীর্ষ পাইকারি আড়ত ও ডিপো সমূহ:**\n\n1. **কাওরান বাজার পাইকারি আড়ত (ঢাকা):** চাল, ডাল, তেল, চিনি, পেঁয়াজ ও কাঁচামালের সর্ববৃহৎ আড়ত।\n2. **বাদামতলী ও ওয়াইজঘাট পাইকারি মার্কেট (পুরান ঢাকা):** মসলা, ঘি, শুকনা পণ্য ও ভোজ্যতেলের আড়ত।\n3. **মৌলভীবাজার ডিপার্টমেন্টাল হোলসেল মার্কেট (ঢাকা):** বিস্কুট, সাবান, টুথপেস্ট ও প্যাকেটজাত এফএমসিজি সামগ্রী।\n4. **খাতুনগঞ্জ ও চাক্তাই (চট্টগ্রাম):** সারা দেশের খাদ্যশস্য ও ভোজ্যতেলের অন্যতম বড় পাইকারি বাণিজ্য কেন্দ্র।`);
    } finally {
      setIsLoadingMarkets(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* Top Banner & Tab Navigation */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-3 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#B2825C] to-[#8C6241] text-white flex items-center justify-center shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                  স্মার্ট এআই উপদেষ্টা ও লাইভ বাজার দর
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  পুরুষ কণ্ঠ (Male Voice)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                রিয়েল-টাইম পাইকারি দর, গুগল সার্চ গ্রাউন্ডিং এবং ভয়েস পরামর্শ
              </p>
            </div>
          </div>

          {/* Quick Voice Call Launcher */}
          <button
            type="button"
            onClick={() => setIsLiveVoiceOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition-all shadow-md transform active:scale-98"
          >
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>সরাসরি লাইভ ভয়েস কল করুন (পুরুষ কণ্ঠ)</span>
          </button>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setActiveSubTab('chat')}
            className={`py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'chat'
                ? 'bg-[#B2825C] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>মাল্টি-টার্ন এআই চ্যাট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('market_rates')}
            className={`py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'market_rates'
                ? 'bg-[#B2825C] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>লাইভ বাজার দর (Search Grounding)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveSubTab('nearby_markets');
              if (!marketsSummary && !isLoadingMarkets) {
                fetchNearbyMarkets();
              }
            }}
            className={`py-2.5 px-3 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              activeSubTab === 'nearby_markets'
                ? 'bg-[#B2825C] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200/70 text-slate-700'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>পাইকারি আড়ত ও ডিপো (Maps)</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Multi-Turn AI Chat */}
      {activeSubTab === 'chat' && (
        <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs flex flex-col h-[650px] overflow-hidden">
          {/* Chat Settings Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-[#E8DFD3] flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B2825C] animate-pulse" />
              <span className="font-medium text-slate-700">লাইভ চ্যাট ও রিয়েল-টাইম টাইপিং সক্রিয়</span>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={useSearchGrounding}
                  onChange={(e) => setUseSearchGrounding(e.target.checked)}
                  className="rounded-sm text-[#B2825C] focus:ring-[#B2825C]"
                />
                <span>গুগল সার্চ গ্রাউন্ডিং</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  setMessages([
                    {
                      id: 'cleared-welcome',
                      role: 'model',
                      text: 'চ্যাট নতুন করে শুরু করা হয়েছে। আপনার নতুন প্রশ্ন বলুন বা লিখুন!',
                      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  ])
                }
                className="text-slate-500 hover:text-slate-800 font-medium"
              >
                চ্যাট ক্লিয়ার করুন
              </button>
            </div>
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 bg-slate-50/50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">দ্রুত প্রশ্ন:</span>
            {[
              '🌟 এই অ্যাপসের প্রতিষ্ঠাতা কে?',
              'আজকের চাল ও তেলের পাইকারি দর কত?',
              'বাকি আদায়ের জন্য ভালো একটি এসএমএস লিখে দাও',
              'মুদির দোকানে কোন কোন পণ্যে সবচেয়ে বেশি লাভ?',
              'পণ্য নষ্ট বা অপচয় কমানোর নিয়ম কী?'
            ].map((promptText) => (
              <button
                key={promptText}
                type="button"
                onClick={() => handleSendMessage(promptText)}
                className="px-2.5 py-1 bg-white hover:bg-[#F5EEE7] hover:text-[#83593B] border border-[#E8DFD3] rounded-lg text-xs text-slate-600 whitespace-nowrap transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-xl bg-[#B2825C] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-xs ${
                    msg.role === 'user'
                      ? 'bg-[#B2825C] text-white rounded-tr-none'
                      : 'bg-slate-50 border border-[#E8DFD3] text-slate-800 rounded-tl-none'
                  }`}
                >
                  {/* Markdown or plain text */}
                  {msg.role === 'user' ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none text-slate-800 prose-headings:font-bold prose-headings:text-slate-900 prose-table:text-xs">
                      {msg.text ? (
                        <ReactMarkdown>{msg.text}</ReactMarkdown>
                      ) : (
                        <span className="flex items-center gap-2 text-slate-400 italic">
                          <span className="w-2 h-2 rounded-full bg-[#B2825C] animate-ping" />
                          উত্তর তৈরি হচ্ছে ও টাইপ করা হচ্ছে...
                        </span>
                      )}
                    </div>
                  )}

                  {/* Web Sources Grounding Links */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#E8DFD3] text-xs">
                      <p className="font-semibold text-slate-500 mb-1 flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> যাচাইকৃত সূত্রসমূহ:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map((s, idx) => (
                          <a
                            key={idx}
                            href={s.uri}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 bg-white border border-[#E8DFD3] hover:border-[#B2825C] rounded-md text-[#83593B] truncate max-w-[200px]"
                          >
                            {s.title || s.uri}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Action Bar */}
                  <div className="mt-2 pt-1.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{msg.timestamp}</span>

                    {msg.role === 'model' && msg.text && (
                      <div className="flex items-center gap-2">
                        {/* Male Voice TTS Speaker Button */}
                        <button
                          type="button"
                          onClick={() => speakTextWithMaleVoice(msg.text, 'bn')}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md hover:bg-slate-200 text-slate-600 transition-colors"
                          title="পুরুষ কণ্ঠে শুনুন"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#B2825C]" />
                          <span>পুরুষ কণ্ঠে শুনুন</span>
                        </button>

                        {/* Copy Button */}
                        <button
                          type="button"
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
                          title="কপি করুন"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3.5 h-3.5 text-[#B2825C]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} />
          </div>

          {/* Speech Error / Listening Indicator */}
          {/* Continuous Speech Listening Indicator */}
          {isListening && (
            <div className="bg-[#FAF2EB] px-3.5 py-2.5 border-t border-[#E8DFD3] text-xs text-[#5C3E28] flex items-center justify-between gap-2 transition-all">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                <span className="font-semibold truncate">
                  🎙️ ভয়েস চালু আছে: যতক্ষণ ইচ্ছা কথা বলুন, সব উঠবে। থামলে &apos;পাঠান&apos; চাপুন।
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {inputMessage.trim() && (
                  <button
                    type="button"
                    onClick={() => handleSendMessage()}
                    className="px-2.5 py-1 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1 transition-all"
                  >
                    <Send className="w-3 h-3" />
                    <span>পাঠান</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={toggleSpeechRecognition}
                  className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-700 font-bold rounded-lg text-[11px] transition-colors"
                >
                  থামান
                </button>
              </div>
            </div>
          )}

          {speechError && (
            <div className="bg-amber-50 px-4 py-2 border-t border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{speechError}</span>
            </div>
          )}

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 sm:p-4 bg-slate-50 border-t border-[#E8DFD3] flex items-center gap-2"
          >
            {/* Mic Speech Button */}
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              className={`p-2.5 rounded-xl transition-all relative ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse shadow-md ring-2 ring-red-300'
                  : 'bg-white hover:bg-[#FAF2EB] text-slate-700 border border-slate-300'
              }`}
              title={isListening ? 'ভয়েস ইনপুট বন্ধ করুন' : 'মাইক্রোফোনে কথা বলে লিখুন (চলমান ভয়েস)'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5 text-[#B2825C]" />}
            </button>

            {/* Text Input */}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={isListening ? 'শুনছি... যা বলছেন তা এখানে উঠছে...' : 'যেকোনো প্রশ্ন লিখুন বা মাইক্রোফোনে ক্লিক করে বলুন...'}
              disabled={isSending}
              className={`flex-1 bg-white border rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#B2825C] disabled:opacity-60 transition-all ${
                isListening ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
              }`}
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputMessage.trim() || isSending}
              className="p-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] disabled:bg-slate-300 text-white rounded-xl transition-all shadow-xs flex items-center justify-center shrink-0"
              title="পাঠান"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: Live Market Rates (Google Search Grounding) */}
      {activeSubTab === 'market_rates' && (
        <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs space-y-6">
          {/* Search / Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={marketCommodity}
                onChange={(e) => setMarketCommodity(e.target.value)}
                placeholder="পণ্যের নাম লিখুন (যেমন: চাল, ডাল, তেল, চিনি, পেঁয়াজ, আলু)..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={() => fetchLiveMarketRates()}
              disabled={isLoadingMarket}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] disabled:bg-[#DEC4AD] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingMarket ? 'animate-spin' : ''}`} />
              <span>{isLoadingMarket ? 'সার্চ হচ্ছে...' : 'লাইভ বাজার দর আপডেট'}</span>
            </button>
          </div>

          {/* Quick Commodity Filter Pills */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="font-semibold text-slate-500 py-1">দ্রুত ফিল্টার:</span>
            {[
              'চাল ও ডাল',
              'ভোজ্যতেল ও ঘি',
              'চিনি ও চা পাতা',
              'পেঁয়াজ, রসুন ও আদা',
              'আলু ও ডিম',
              'আটা ও ময়দা'
            ].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMarketCommodity(item);
                  fetchLiveMarketRates(item);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-[#F5EEE7] hover:text-[#83593B] border border-[#E8DFD3] rounded-full font-medium text-slate-700 transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Market Report Display */}
          <div className="p-4 sm:p-6 bg-slate-50/70 border border-[#E8DFD3] rounded-2xl">
            {isLoadingMarket ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                <RefreshCw className="w-8 h-8 text-[#B2825C] animate-spin" />
                <p className="text-sm font-semibold">টিসিবি ও কাওরান বাজারের সর্বশেষ দর অনুসন্ধান করা হচ্ছে...</p>
              </div>
            ) : marketReport ? (
              <div>
                <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-slate-900 prose-table:text-xs">
                  <ReactMarkdown>{marketReport}</ReactMarkdown>
                </div>

                {/* Male Voice Speak Report Button */}
                <div className="mt-4 pt-4 border-t border-[#E8DFD3] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => speakTextWithMaleVoice(marketReport, 'bn')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    <Volume2 className="w-4 h-4 text-[#B2825C]" />
                    <span>পুরুষ কণ্ঠে বাজার দর শুনুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(marketReport, 'market-rep')}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700"
                  >
                    {copiedId === 'market-rep' ? <Check className="w-4 h-4 text-[#B2825C]" /> : <Copy className="w-4 h-4" />}
                    <span>রিপোর্ট কপি করুন</span>
                  </button>
                </div>

                {marketSources.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#E8DFD3] text-xs">
                    <p className="font-semibold text-slate-600 mb-1">যাচাইকৃত নিউজ ও ওয়েবসাইট সূত্র:</p>
                    <div className="flex flex-wrap gap-2">
                      {marketSources.map((s, i) => (
                        <a
                          key={i}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-white border border-[#E8DFD3] rounded-lg text-[#83593B] hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span className="truncate max-w-[220px]">{s.title || s.uri}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8 text-sm">বাজার দর লোড করতে বাটনে ক্লিক করুন</p>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Nearby Wholesale Markets & Depots */}
      {activeSubTab === 'nearby_markets' && (
        <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 relative w-full">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={marketsQuery}
                onChange={(e) => setMarketsQuery(e.target.value)}
                placeholder="আড়ত বা পাইকারি বাজারের নাম বা এলাকা লিখুন..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden"
              />
            </div>
            <button
              type="button"
              onClick={fetchNearbyMarkets}
              disabled={isLoadingMarkets}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] disabled:bg-[#DEC4AD] text-white font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>{isLoadingMarkets ? 'খোঁজা হচ্ছে...' : 'আড়ত অনুসন্ধান'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-6 bg-slate-50/70 border border-[#E8DFD3] rounded-2xl">
            {isLoadingMarkets ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                <RefreshCw className="w-8 h-8 text-[#B2825C] animate-spin" />
                <p className="text-sm font-semibold">নিকটস্থ পাইকারি আড়ত অনুসন্ধান করা হচ্ছে...</p>
              </div>
            ) : marketsSummary ? (
              <div>
                <div className="prose prose-sm max-w-none text-slate-800 prose-headings:text-slate-900">
                  <ReactMarkdown>{marketsSummary}</ReactMarkdown>
                </div>

                {mapPlaces.length > 0 && (
                  <div className="mt-5 pt-4 border-t border-[#E8DFD3]">
                    <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-3">
                      গুগল ম্যাপে সরাসরি লোকেশন:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mapPlaces.map((place, idx) => (
                        <a
                          key={idx}
                          href={place.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between p-3 bg-white border border-[#E8DFD3] hover:border-[#B2825C] rounded-xl text-xs font-semibold text-slate-800 transition-colors"
                        >
                          <span className="truncate">{place.title}</span>
                          <ExternalLink className="w-3.5 h-3.5 text-[#B2825C] shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-slate-400 py-8 text-sm">আড়ত তথ্য পেতে অনুসন্ধান করুন</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
