import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  Sparkles,
  Radio,
  User,
  Bot,
  AlertCircle,
  RefreshCw,
  Send,
  Loader2
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { createSpeechRecognizer, speakTextWithMaleVoice } from '../utils/speechHelper';

interface GeminiLiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiLiveVoiceModal: React.FC<GeminiLiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useKhata();
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState('সংযুক্ত হচ্ছে...');
  const [userTranscript, setUserTranscript] = useState('');
  const [modelTranscript, setModelTranscript] = useState('');
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [isLoadingAnswer, setIsLoadingAnswer] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [customQuery, setCustomQuery] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);
  const recognizerRef = useRef<any>(null);
  const autoSendTimerRef = useRef<any>(null);
  const currentSpeechRef = useRef<string>('');

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (isMuted) {
      if (recognizerRef.current) {
        try {
          recognizerRef.current.stop();
        } catch (e) {}
      }
    } else if (isOpen) {
      startSpeechRecognition();
    }
  }, [isMuted, isOpen]);

  // Unlock AudioContext on any user gesture
  const unlockAudioContext = useCallback(() => {
    try {
      if (outputAudioCtxRef.current && outputAudioCtxRef.current.state === 'suspended') {
        outputAudioCtxRef.current.resume();
      }
      if (inputAudioCtxRef.current && inputAudioCtxRef.current.state === 'suspended') {
        inputAudioCtxRef.current.resume();
      }
    } catch (e) {}
  }, []);

  const stopAllAudioPlayback = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    activeSourcesRef.current.forEach((src) => {
      try {
        src.stop();
        src.disconnect();
      } catch (e) {}
    });
    activeSourcesRef.current = [];
    nextStartTimeRef.current = 0;
    setIsModelSpeaking(false);
  }, []);

  const cleanupSession = useCallback(() => {
    stopAllAudioPlayback();

    if (autoSendTimerRef.current) {
      clearTimeout(autoSendTimerRef.current);
      autoSendTimerRef.current = null;
    }

    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
      recognizerRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (wsRef.current) {
      try {
        wsRef.current.close();
      } catch (e) {}
      wsRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    if (scriptProcessorRef.current) {
      try {
        scriptProcessorRef.current.disconnect();
      } catch (e) {}
      scriptProcessorRef.current = null;
    }

    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      try {
        inputAudioCtxRef.current.close();
      } catch (e) {}
      inputAudioCtxRef.current = null;
    }

    if (outputAudioCtxRef.current && outputAudioCtxRef.current.state !== 'closed') {
      try {
        outputAudioCtxRef.current.close();
      } catch (e) {}
      outputAudioCtxRef.current = null;
    }

    setIsConnected(false);
    setIsModelSpeaking(false);
    setIsLoadingAnswer(false);
    setMicLevel(0);
    nextStartTimeRef.current = 0;
  }, [stopAllAudioPlayback]);

  // Send a question to AI and ensure text and male voice answer
  const sendQuery = useCallback(async (text: string) => {
    const q = text.trim();
    if (!q) return;

    unlockAudioContext();
    stopAllAudioPlayback();

    setUserTranscript(q);
    setModelTranscript('');
    setIsLoadingAnswer(true);
    setStatusText('এআই পুরুষ কণ্ঠে উত্তর প্রস্তুত করছে...');

    const isFounderQuery = (str: string) => {
      const t = str.toLowerCase();
      return (
        t.includes('মেরাজুল') ||
        t.includes('merajul') ||
        t.includes('মিরাজ') ||
        t.includes('miraz') ||
        t.includes('প্রতিষ্ঠাতা') ||
        t.includes('কে বানাইছে') ||
        t.includes('কে বানিয়েছে') ||
        t.includes('কে বানালো') ||
        t.includes('কে তৈরি করেছে') ||
        t.includes('কে তৈরি করছে') ||
        t.includes('কে বানাইসেন') ||
        t.includes('কে বানিয়েছেন') ||
        t.includes('মালিক কে') ||
        t.includes('ক্রিয়েটর কে') ||
        t.includes('ক্রিয়েটর কে') ||
        t.includes('কার তৈরি') ||
        t.includes('তোমার নির্মাতা') ||
        t.includes('তৈরি কে করেছে') ||
        t.includes('অ্যাবাউট') ||
        t.includes('about') ||
        t.includes('ফেসবুক') ||
        t.includes('ইউটিউব') ||
        t.includes('ওয়েবসাইট') ||
        t.includes('হোয়াটসঅ্যাপ') ||
        t.includes('whatsapp') ||
        t.includes('who created') ||
        t.includes('who is the founder') ||
        t.includes('who made') ||
        t.includes('who developed')
      );
    };

    const founderName = settings.founderName?.trim() || 'মেরাজুল ইসলাম (Merajul Islam)';
    const founderRole = settings.founderRole?.trim() || 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা';
    const founderBio = settings.founderBio?.trim() || 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। দেশের মুদি দোকানদার ও ব্যবসায়ীদের প্রতিদিনের বেচাকেনা ও বাকির হিসাব সহজ, স্বচ্ছ ও আধুনিক করার জন্য তিনি এই অনন্য এআই অ্যাপটি প্রতিষ্ঠা ও তৈরি করেছেন।';
    const founderWebsite = settings.founderWebsite || 'https://mdmiraz-dev.github.io/';
    const founderFacebook = settings.founderFacebook || 'https://www.facebook.com/mdmiraz.dev';
    const founderYouTube = settings.founderYouTube || 'https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB';

    // Instant founder introduction with zero latency and natural male speech
    if (isFounderQuery(q)) {
      const founderReply = `এই মুদির দোকান খাতা স্মার্ট এআই প্ল্যাটফর্মের প্রতিষ্ঠাতা ও উদ্ভাবক হলেন ${founderName} (${founderRole})।\n\n${founderBio}\n\nঅফিসিয়াল পোর্টফোলিও ওয়েবসাইট: ${founderWebsite}\nফেসবুক: ${founderFacebook}\nইউটিউব: ${founderYouTube}\nহোয়াটসঅ্যাপ: Md Miraz WhatsApp Contact\n\nমেরাজুল ইসলাম ভাইয়ের এই চমৎকার দূরদর্শী উদ্যোগের মাধ্যমে বাংলাদেশের সকল দোকানদার ভাই ডিজিটাল খাতা ও এআই সুবিধা পাচ্ছেন। তাঁর তৈরি প্ল্যাটফর্মের অংশ হতে পেরে আমি অত্যন্ত গর্বিত!`;
      setIsLoadingAnswer(false);
      setModelTranscript(founderReply);
      setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ কথা বলছে)');
      speakTextWithMaleVoice(founderReply, 'bn');

      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        try {
          wsRef.current.send(JSON.stringify({
            text: q,
            founderInfo: {
              name: founderName,
              role: founderRole,
              bio: founderBio,
              website: founderWebsite,
              facebook: founderFacebook,
              youtube: founderYouTube
            }
          }));
        } catch (e) {}
      }
      return;
    }

    let answered = false;

    // 1. Send via WebSocket if open
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify({
          text: q,
          founderInfo: { name: founderName, role: founderRole, bio: founderBio }
        }));
      } catch (e) {
        console.warn('Failed to send text over WS:', e);
      }
    }

    // 2. Guaranteed fast HTTP fallback / companion if WS takes longer than 1.5s
    const fallbackTimer = setTimeout(async () => {
      if (!answered) {
        try {
          const res = await fetch('/api/gemini/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              message: `দোকানদারের প্রশ্ন: "${q}"। খুব সংক্ষেপে ২-৩ লাইনে স্পষ্ট এবং আন্তরিক পুরুষ কণ্ঠে উত্তর দিন।`,
              history: [],
              founderInfo: { name: founderName, role: founderRole, bio: founderBio }
            })
          });
          const data = await res.json();
          const reply = data.text || data.reply || 'দুঃখিত ভাই, উত্তর দিতে সমস্যা হয়েছে। আবার প্রশ্ন করুন।';
          if (!answered) {
            answered = true;
            setIsLoadingAnswer(false);
            setModelTranscript(reply);
            setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck কথা বলছে)');
            speakTextWithMaleVoice(reply, 'bn');
          }
        } catch (fetchErr) {
          console.error('Direct chat fallback error:', fetchErr);
          if (!answered) {
            setIsLoadingAnswer(false);
            setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck)');
          }
        }
      }
    }, 1200);

    // Watch for model transcript arriving via WS
    const checkWsResponse = (e: any) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === 'model_transcript' && data.text) {
          clearTimeout(fallbackTimer);
          answered = true;
          setIsLoadingAnswer(false);
          setModelTranscript(data.text);
          setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck কথা বলছে)');
          speakTextWithMaleVoice(data.text, 'bn');
        }
      } catch (err) {}
    };

    if (wsRef.current) {
      wsRef.current.addEventListener('message', checkWsResponse, { once: true });
    }
  }, [settings.founderBio, settings.founderName, settings.founderRole, settings.ownerName, stopAllAudioPlayback, unlockAudioContext]);

  // Browser speech recognition so Bengali user voice is recognized and auto-submitted
  const startSpeechRecognition = useCallback(() => {
    if (typeof window === 'undefined' || isMutedRef.current) return;

    if (recognizerRef.current) {
      try {
        recognizerRef.current.stop();
      } catch (e) {}
    }

    const recognizer = createSpeechRecognizer({
      lang: settings.language === 'en' ? 'en-US' : 'bn-BD',
      continuous: true,
      interimResults: true,
      onResult: (transcript, isFinal) => {
        if (!transcript.trim()) return;
        currentSpeechRef.current = transcript.trim();
        setUserTranscript(transcript.trim());

        // Debounce auto-send: when user pauses for 1.3 seconds, automatically submit!
        if (autoSendTimerRef.current) {
          clearTimeout(autoSendTimerRef.current);
        }

        autoSendTimerRef.current = setTimeout(() => {
          if (currentSpeechRef.current) {
            const textToAsk = currentSpeechRef.current;
            currentSpeechRef.current = '';
            sendQuery(textToAsk);
          }
        }, 1300);
      },
      onError: (err) => {
        console.warn('Speech recognition status:', err);
      },
      onEnd: () => {
        // Automatically restart speech recognizer if modal is open and not muted
        if (!isMutedRef.current && wsRef.current) {
          setTimeout(() => {
            if (!isMutedRef.current && wsRef.current) {
              try {
                recognizer.start();
              } catch (e) {}
            }
          }, 200);
        }
      }
    });

    recognizerRef.current = recognizer;
    try {
      recognizer.start();
    } catch (e) {}
  }, [sendQuery, settings.language]);

  const playIncomingAudio = useCallback((base64Audio: string) => {
    try {
      const ctx = outputAudioCtxRef.current;
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const binary = atob(base64Audio);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }

      const dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
      const numSamples = Math.floor(bytes.byteLength / 2);
      if (numSamples === 0) return;

      const float32 = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        float32[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      // Buffer 24kHz created in context's native sample rate; Web Audio resamples automatically
      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.getChannelData(0).set(float32);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const now = ctx.currentTime;
      const startTime = Math.max(now, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.push(source);
      setIsModelSpeaking(true);

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0 && ctx.currentTime >= nextStartTimeRef.current - 0.05) {
          setIsModelSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Audio decode/play error:', e);
    }
  }, []);

  const startLiveVoiceSession = useCallback(async () => {
    cleanupSession();
    setErrorMsg(null);
    setStatusText('এআই সার্ভারের সাথে সংযোগ তৈরি হচ্ছে (পুরুষ কণ্ঠ Puck)...');

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('আপনার ব্রাউজারে Web Audio API সমর্থিত নয়। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করুন।');
      }

      // Input Context for mic capture
      const inputCtx = new AudioCtx();
      inputAudioCtxRef.current = inputCtx;
      if (inputCtx.state === 'suspended') {
        inputCtx.resume();
      }

      // Output Context for model audio playback
      const outputCtx = new AudioCtx();
      outputAudioCtxRef.current = outputCtx;
      if (outputCtx.state === 'suspended') {
        outputCtx.resume();
      }

      // User Microphone Access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      mediaStreamRef.current = stream;

      // Analyser for live visual feedback
      const analyser = inputCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // Pipe audio stream to script processor and analyser
      const source = inputCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const processor = inputCtx.createScriptProcessor(2048, 1, 1);
      scriptProcessorRef.current = processor;

      // Connect WebSocket to backend proxy
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live-ws`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      processor.onaudioprocess = (e) => {
        if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;
        const inputData = e.inputBuffer.getChannelData(0);

        // Convert Float32Array to 16-bit Linear PCM
        const pcm16 = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
        }

        // Convert to Base64 safely
        const uint8 = new Uint8Array(pcm16.buffer);
        let binary = '';
        for (let i = 0; i < uint8.length; i++) {
          binary += String.fromCharCode(uint8[i]);
        }
        const base64Audio = btoa(binary);

        ws.send(JSON.stringify({ audio: base64Audio }));
      };

      source.connect(processor);
      processor.connect(inputCtx.destination);

      // Start Mic volume visualizer loop
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        if (!analyserRef.current || isMutedRef.current) {
          setMicLevel(0);
        } else {
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setMicLevel(Math.min(100, Math.round((avg / 128) * 100)));
        }
        animFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();

      ws.onopen = () => {
        setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck কথা বলতে প্রস্তুত)');
        setIsConnected(true);
        // Start continuous Bengali speech recognition
        startSpeechRecognition();
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'session_ready') {
            setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck কথা বলতে প্রস্তুত)');
          } else if (data.type === 'audio' && data.audio) {
            playIncomingAudio(data.audio);
          } else if (data.type === 'model_transcript' && data.text) {
            setIsLoadingAnswer(false);
            setModelTranscript(data.text);
            setStatusText('সংযোগ সক্রিয় (পুরুষ কণ্ঠ Puck কথা বলছে)');
            // Speak response in loud and clear male voice
            speakTextWithMaleVoice(data.text, 'bn');
          } else if (data.type === 'user_transcript' && data.text) {
            setUserTranscript(data.text);
          } else if (data.type === 'interrupted') {
            stopAllAudioPlayback();
          } else if (data.type === 'turn_complete') {
            setIsLoadingAnswer(false);
          } else if (data.type === 'error') {
            setErrorMsg(data.message || 'ভয়েস সার্ভার থেকে ত্রুটি হয়েছে।');
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('Live voice WebSocket error:', err);
        setErrorMsg('লাইভ এআই ভয়েস সার্ভারে সংযোগ করা সম্ভব হয়নি। সরাসরি উত্তর দেওয়ার ব্যবস্থা চালু আছে।');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setStatusText('সংযোগ বন্ধ হয়েছে');
      };
    } catch (err: any) {
      console.error('Error starting live voice session:', err);
      setErrorMsg(err.message || 'মাইক্রোফোন পারমিশন দিন এবং আবার চেষ্টা করুন।');
    }
  }, [cleanupSession, playIncomingAudio, startSpeechRecognition, stopAllAudioPlayback]);

  useEffect(() => {
    if (isOpen) {
      startLiveVoiceSession();
    } else {
      cleanupSession();
    }
    return () => cleanupSession();
  }, [isOpen, startLiveVoiceSession, cleanupSession]);

  if (!isOpen) return null;

  return (
    <div
      onClick={unlockAudioContext}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in"
    >
      <div className="w-full max-w-xl bg-[#1D1C1A] border border-[#3A3530] text-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#3A3530] flex items-center justify-between bg-[#23211E]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B2825C] to-[#8C6241] text-white flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base sm:text-lg text-[#F5EEE7]">লাইভ এআই ভয়েস পার্টনার</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#B2825C]/20 text-[#DFC1A8] border border-[#B2825C]/40">
                  পুরুষ কণ্ঠ (Puck)
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isConnected ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'
                  }`}
                />
                <span className="truncate">{statusText}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Central Audio Visualizer */}
        <div className="py-7 px-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#23211E] via-[#2D2A26] to-[#1D1C1A] border-b border-[#3A3530] relative overflow-hidden">
          {/* Audio Wave Visualizer Rings */}
          <div className="relative flex items-center justify-center">
            {/* Outer Pulsing Aura */}
            <div
              className={`absolute -inset-6 rounded-full transition-all duration-300 ${
                isModelSpeaking
                  ? 'bg-amber-500/25 animate-ping scale-110'
                  : isConnected && micLevel > 15 && !isMuted
                  ? 'bg-emerald-500/30 scale-105'
                  : 'bg-transparent'
              }`}
            />

            {/* Middle Wave */}
            <div
              className={`absolute -inset-3 rounded-full transition-all duration-200 ${
                isModelSpeaking
                  ? 'bg-[#B2825C]/40 animate-pulse ring-4 ring-[#B2825C]/30'
                  : isConnected && micLevel > 10 && !isMuted
                  ? 'bg-emerald-500/20 ring-4 ring-emerald-500/20'
                  : 'bg-transparent'
              }`}
            />

            {/* Central Microphone / Speaker Circle */}
            <div
              onClick={unlockAudioContext}
              className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all shadow-2xl relative z-10 cursor-pointer ${
                isModelSpeaking
                  ? 'bg-gradient-to-tr from-[#B2825C] to-[#C8946E] ring-4 ring-[#F5EEE7]/40 scale-105 text-white'
                  : isMuted
                  ? 'bg-slate-800 text-slate-400 ring-4 ring-slate-700'
                  : 'bg-gradient-to-tr from-[#2E2A26] to-[#453F39] text-[#DFC1A8] ring-4 ring-[#B2825C]/40'
              }`}
            >
              {isModelSpeaking ? (
                <Volume2 className="w-10 h-10 animate-bounce" />
              ) : isMuted ? (
                <MicOff className="w-10 h-10 text-red-400" />
              ) : (
                <Radio className={`w-10 h-10 ${micLevel > 15 ? 'animate-pulse text-emerald-400' : ''}`} />
              )}
            </div>
          </div>

          {/* Voice status banner */}
          <p className="mt-4 text-xs font-medium text-[#E5DDD3] text-center">
            {isLoadingAnswer ? (
              <span className="text-amber-300 flex items-center justify-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                এআই পুরুষ কণ্ঠে উত্তর প্রস্তুত করছে...
              </span>
            ) : isModelSpeaking ? (
              '🔊 এআই কথা বলছে (স্পষ্ট পুরুষ কণ্ঠে শুনুন)...'
            ) : isMuted ? (
              '🔇 মাইক্রোফোন মিউট করা আছে'
            ) : micLevel > 12 ? (
              '🎙️ আপনার কথা শোনা যাচ্ছে... কথা শেষ হলে এআই সরাসরি উত্তর দেবে...'
            ) : (
              'মুখে সরাসরি কথা বলুন, কথা শেষ হওয়ামাত্রই এআই পুরুষ কণ্ঠে উত্তর দেবে'
            )}
          </p>

          {/* Live Mic Level Equalizer Bars */}
          {!isMuted && isConnected && !isModelSpeaking && (
            <div className="flex items-center gap-1 mt-2.5 h-4">
              {[12, 28, 45, 75, 55, 32, 18].map((h, i) => (
                <span
                  key={i}
                  className="w-1 rounded-full bg-emerald-400 transition-all duration-75"
                  style={{
                    height: `${Math.max(4, Math.min(16, (micLevel / 100) * h))}px`,
                    opacity: micLevel > 10 ? 1 : 0.3
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Live Conversation Transcript Box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#171614] min-h-[170px] max-h-[260px]">
          {errorMsg && (
            <div className="p-3 bg-red-950/50 border border-red-700/60 rounded-xl text-red-200 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={startLiveVoiceSession}
                className="px-2.5 py-1 bg-red-800 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>পুনরায় চেষ্টা</span>
              </button>
            </div>
          )}

          {userTranscript && (
            <div className="flex items-start gap-2.5 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#2A2724] text-[#EFE8DD] rounded-2xl px-3.5 py-2 text-xs sm:text-sm max-w-[85%] border border-[#3E3832]">
                <p className="text-[10px] text-[#BCA592] font-semibold mb-0.5">আপনার কথা:</p>
                <p>{userTranscript}</p>
              </div>
            </div>
          )}

          {isLoadingAnswer && (
            <div className="flex items-start gap-2.5 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#B2825C] to-[#8C6241] flex items-center justify-center shrink-0 text-white">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#2D251F] text-[#DFC1A8] rounded-2xl px-3.5 py-2 text-xs flex items-center gap-2 border border-[#4F3C2E]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                <span>এআই পুরুষ কণ্ঠে উত্তর প্রস্তুত করছে...</span>
              </div>
            </div>
          )}

          {modelTranscript && (
            <div className="flex items-start gap-2.5 animate-in fade-in">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#B2825C] to-[#8C6241] flex items-center justify-center shrink-0 text-white shadow-xs">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-[#2D251F] text-[#F9F5F0] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm max-w-[88%] border border-[#4F3C2E] shadow-xs space-y-2">
                <div className="flex items-center justify-between gap-2 border-b border-[#45362B] pb-1.5">
                  <p className="text-[10px] text-[#DFC1A8] font-bold flex items-center gap-1.5">
                    <span>এআই উপদেষ্টা (পুরুষ কণ্ঠ):</span>
                    {isModelSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      unlockAudioContext();
                      speakTextWithMaleVoice(modelTranscript, 'bn');
                    }}
                    className="text-[11px] text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 px-2 py-0.5 bg-[#3B2F25] hover:bg-[#4D3D30] rounded-md transition-colors"
                    title="আবার শুনুন"
                  >
                    <Volume2 className="w-3 h-3" />
                    <span>আবার শুনুন</span>
                  </button>
                </div>
                {modelTranscript.includes('মেরাজুল') || modelTranscript.includes('Merajul') || modelTranscript.includes('তুশান') || (settings.founderName && modelTranscript.includes(settings.founderName)) ? (
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-200 border border-amber-500/30 text-[11px] font-bold">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>অ্যাপ প্রতিষ্ঠাতা ও উদ্ভাবক পরিচিতি</span>
                  </div>
                ) : null}
                <p className="leading-relaxed whitespace-pre-wrap">{modelTranscript}</p>
              </div>
            </div>
          )}

          {!userTranscript && !modelTranscript && !errorMsg && !isLoadingAnswer && (
            <div className="py-3 text-center text-slate-400 text-xs space-y-2">
              <p className="font-semibold text-[#DFC1A8]">দ্রুত প্রশ্ন করতে নিচের যেকোনোটিতে চাপুন অথবা মুখে কথা বলুন:</p>
              <div className="flex flex-wrap gap-2 justify-center pt-1">
                {[
                  '🌟 এই অ্যাপসের প্রতিষ্ঠাতা কে?',
                  'আজকের চাল ও তেলের পাইকারি বাজার দর কত?',
                  'দোকানের বাকির টাকা আদায়ের ভালো কৌশল কী?',
                  'মুদির দোকানে লাভ বাড়ানোর ৫টি সহজ উপায় বলুন',
                  'সবচেয়ে বেশি মার্জিনের জনপ্রিয় পণ্য কোনগুলো?'
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => sendQuery(item)}
                    className="px-3 py-1.5 bg-[#252320] hover:bg-[#34302C] hover:text-[#DFC1A8] border border-[#3E3933] rounded-full text-slate-300 text-[11px] transition-colors"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Text Message Form for Noisy Counter / Silent Mic */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery(customQuery);
            setCustomQuery('');
          }}
          className="px-4 py-2.5 bg-[#201E1C] border-t border-[#3A3530] flex items-center gap-2"
        >
          <input
            type="text"
            value={customQuery}
            onChange={(e) => setCustomQuery(e.target.value)}
            placeholder="মুখে বলতে সমস্যা হলে লিখে পাঠালেও পুরুষ কণ্ঠে সরাসরি উত্তর শুনবেন..."
            className="flex-1 bg-[#171614] border border-[#3E3933] text-white text-xs rounded-xl px-3.5 py-2 focus:ring-1 focus:ring-[#B2825C] outline-hidden placeholder:text-slate-500"
          />
          <button
            type="submit"
            disabled={!customQuery.trim() || isLoadingAnswer}
            className="px-3 py-2 bg-[#B2825C] hover:bg-[#9E6F4B] disabled:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            title="পাঠান"
          >
            {isLoadingAnswer ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">বলুন</span>
          </button>
        </form>

        {/* Action Controls */}
        <div className="p-3.5 sm:p-4 bg-[#1B1A18] border-t border-[#3A3530] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                unlockAudioContext();
                setIsMuted(!isMuted);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
                isMuted
                  ? 'bg-red-500/20 text-red-300 border-red-500/30'
                  : 'bg-[#282522] text-slate-200 border-[#3E3933] hover:bg-[#332F2B]'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-emerald-400" />}
              <span>{isMuted ? 'আনমিউট' : 'মিউট'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setUserTranscript('');
                setModelTranscript('');
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-[#282522]/70 hover:bg-[#282522] border border-[#3E3933]"
            >
              মুছে ফেলুন
            </button>

            <button
              type="button"
              onClick={() => {
                unlockAudioContext();
                startLiveVoiceSession();
              }}
              className="px-3 py-2 rounded-xl text-xs font-medium text-[#DFC1A8] hover:text-white bg-[#282522]/70 hover:bg-[#282522] border border-[#3E3933] flex items-center gap-1"
              title="নতুন করে কল রিকানেক্ট করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রি-কানেক্ট</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors shadow-md"
          >
            কল সমাপ্ত করুন
          </button>
        </div>
      </div>
    </div>
  );
};
