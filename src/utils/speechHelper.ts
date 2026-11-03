// Cross-browser Web Speech API helper with Male Voice support

export interface SpeechRecognitionOptions {
  lang?: 'bn-BD' | 'en-US';
  continuous?: boolean;
  interimResults?: boolean;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
};

export const createSpeechRecognizer = (options: SpeechRecognitionOptions) => {
  if (!isSpeechRecognitionSupported()) {
    options.onError('এই ব্রাউজারে স্পিচ রিকগনিশন (মাইক্রোফোন) সমর্থিত নয়। দয়া করে গুগল ক্রোম ব্রাউজার ব্যবহার করুন।');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.lang = options.lang || 'bn-BD';
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    if (options.onStart) options.onStart();
  };

  recognition.onresult = (event: any) => {
    let finalTranscript = '';
    let interimTranscript = '';

    for (let i = 0; i < event.results.length; ++i) {
      const res = event.results[i];
      const textPiece = res[0]?.transcript ? res[0].transcript.trim() : '';
      if (!textPiece) continue;

      if (res.isFinal) {
        finalTranscript += (finalTranscript ? ' ' : '') + textPiece;
      } else {
        interimTranscript += (interimTranscript ? ' ' : '') + textPiece;
      }
    }

    const fullCurrentText = (finalTranscript + (interimTranscript ? (finalTranscript ? ' ' : '') + interimTranscript : '')).trim();
    const isFinal = Boolean(finalTranscript);
    options.onResult(fullCurrentText, isFinal);
  };

  recognition.onerror = (event: any) => {
    // In continuous mode, temporary silence ('no-speech') is normal when pausing to think
    if (event.error === 'no-speech') {
      if (options.continuous) {
        return;
      }
      options.onError('কোনো কথা শোনা যায়নি। আবার স্পষ্ট করে বলুন।');
      return;
    }

    // Ignore aborted event (when user or system stops deliberately)
    if (event.error === 'aborted') {
      return;
    }

    let errorMsg = 'ভয়েস শনাক্ত করতে সমস্যা হয়েছে।';
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      errorMsg = 'মাইক্রোফোন পারমিশন প্রয়োজন। ব্রাউজার সেটিংসে গিয়ে পারমিশন চালু করুন।';
    } else if (event.error === 'network') {
      errorMsg = 'ইন্টারনেট সংযোগের সমস্যা হয়েছে।';
    }
    options.onError(errorMsg);
  };

  recognition.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  return recognition;
};

// Text-to-Speech (TTS) with Male Voice preference
export const speakTextWithMaleVoice = (text: string, lang: 'bn' | 'en' = 'bn'): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip Markdown characters like *, #, _, ` from speech
  const cleanText = text
    .replace(/[#*`_~[\]()]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = lang === 'bn' ? 'bn-BD' : 'en-US';

  // Pitch < 1.0 creates a deeper, distinctly male tone
  utterance.pitch = 0.88;
  utterance.rate = 0.98;

  const voices = window.speechSynthesis.getVoices();
  // Try to find a male voice or Bengali voice
  const maleVoice = voices.find(v => {
    const name = v.name.toLowerCase();
    const isLangMatch = lang === 'bn' ? v.lang.startsWith('bn') : v.lang.startsWith('en');
    return isLangMatch && (name.includes('male') || name.includes('david') || name.includes('guy') || name.includes('george') || name.includes('bangla') || name.includes('puck'));
  }) || voices.find(v => (lang === 'bn' ? v.lang.startsWith('bn') : v.lang.startsWith('en')));

  if (maleVoice) {
    utterance.voice = maleVoice;
  }

  window.speechSynthesis.speak(utterance);
};
