import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Modality } from '@google/genai';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '15mb' }));

  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not configured. Please add it in Settings > Secrets.');
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });
  };

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      modelsSupported: [
        'gemini-3.8-live',
        'gemini-3.5-flash',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash',
        'gemini-3.8-flash'
      ]
    });
  });

  // OCR Label / Price Tag Analysis (with Multi-Model Fallback)
  app.post('/api/analyze-label', async (req, res) => {
    try {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ error: 'Image data is required' });
      }

      const ai = getGeminiClient();
      const cleanBase64 = image.replace(/^data:image\/\w+;base64,/, '');

      const imagePart = {
        inlineData: {
          mimeType: 'image/jpeg',
          data: cleanBase64
        }
      };

      const promptPart = {
        text: 'Analyze this image of a grocery product label, price tag, packaging, or handwritten sticker. Extract the product name (in Bengali or English, whichever is clearest), Bengali name if possible, selling price in BDT/Taka, estimated cost price, category, and unit. If price is not visible, set it to null. Ensure response matches schema precisely.'
      };

      const modelsToTry = ['gemini-2.5-flash', 'gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
      let response: any;
      let lastErr: any;

      for (const model of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model,
            contents: { parts: [imagePart, promptPart] },
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  name: {
                    type: Type.STRING,
                    description: 'The extracted name of the product in Bengali or English.'
                  },
                  banglaName: {
                    type: Type.STRING,
                    description: 'The name in Bengali script, e.g. মিনিকেট চাল, সয়াবিন তেল।'
                  },
                  price: {
                    type: Type.NUMBER,
                    description: 'The extracted price of the product in BDT/Taka. Null if not visible.'
                  },
                  costPrice: {
                    type: Type.NUMBER,
                    description: 'Estimated wholesale cost price if visible or approximate 10-15% less than selling price.'
                  },
                  category: {
                    type: Type.STRING,
                    description: 'Category: rice_flour, oil_ghee, spices_salt, sugar_tea, snacks_biscuits, soap_detergent, dairy_beverage, personal_care, or other.'
                  },
                  unit: {
                    type: Type.STRING,
                    description: 'Unit: kg, gm, litre, ml, packet, piece, dozen.'
                  },
                  barcode: {
                    type: Type.STRING,
                    description: 'Barcode if visible.'
                  }
                },
                required: ['name']
              }
            }
          });
          if (response && response.text) {
            break;
          }
        } catch (err: any) {
          console.warn(`[OCR Label Scanner] Model ${model} failed:`, err?.message || err);
          lastErr = err;
        }
      }

      if (!response || !response.text) {
        throw lastErr || new Error('No output text from Gemini models');
      }

      const data = JSON.parse(response.text);
      res.json(data);
    } catch (error: any) {
      console.error('AI Analysis error:', error);
      res.status(500).json({ error: error.message || 'Failed to analyze image with AI' });
    }
  });

  // Founder and Creator Profile Knowledge - Merajul Islam
  const DEFAULT_FOUNDER = {
    name: 'মেরাজুল ইসলাম (Merajul Islam)',
    role: 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা',
    fatherName: 'মো. আব্দুল কাদির',
    location: 'বড়তল্লা, আশুগঞ্জ, ব্রাহ্মণবাড়িয়া',
    educationIslamic: 'দাওরায়ে হাদিস — জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা',
    educationMadrasah: 'টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া',
    educationJatrabari: 'মেশকাত জামাত — জামিয়া ইসলামিয়া দারুল উলুম মাদানিয়া যাত্রাবাড়ী, ঢাকা',
    institute: 'আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট (As-Sunnah Skill Development Institute)',
    skills: 'এআই ও এআই অটোমেশন (AI Automation), ফুলস্ট্যাক সফটওয়্যার ডেভেলপমেন্ট ও বিজনেস সিস্টেমস',
    website: 'https://mdmiraz-dev.github.io/',
    facebook: 'https://www.facebook.com/mdmiraz.dev',
    youtube: 'https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB',
    github: 'https://github.com/MdMiraz-dev',
    honor: 'নবীন আলেম সংবর্ধনা ও সম্মাননা স্মারক (আইইবি মিলনায়তন, রমনা, ঢাকা)',
    bio: 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। দেশের মুদি দোকানদার ও ব্যবসায়ীদের প্রতিদিনের বেচাকেনা ও বাকির হিসাব সহজ, স্বচ্ছ ও আধুনিক করার মহৎ লক্ষ্য নিয়ে তিনি এই অনন্য এআই অ্যাপটি প্রতিষ্ঠা ও তৈরি করেছেন।'
  };

  function isFounderQuestion(text: string): boolean {
    if (!text) return false;
    const t = text.toLowerCase();
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
      t.includes('অ্যাপটি কে বানিয়েছে') ||
      t.includes('অ্যাপের মালিক') ||
      t.includes('ক্রিয়েটর কে') ||
      t.includes('ক্রিয়েটর কে') ||
      t.includes('তোমার নির্মাতা') ||
      t.includes('তৈরি কে করেছে') ||
      t.includes('কার তৈরি') ||
      t.includes('কে উদ্ভাবন') ||
      t.includes('অ্যাবাউট') ||
      t.includes('about') ||
      t.includes('ফেসবুক') ||
      t.includes('ইউটিউব') ||
      t.includes('ওয়েবসাইট') ||
      t.includes('হোয়াটসঅ্যাপ') ||
      t.includes('whatsapp') ||
      t.includes('who created') ||
      t.includes('who is the founder') ||
      t.includes('who made this app') ||
      t.includes('who developed')
    );
  }

  function getFounderAnswer(founder?: any): string {
    const fName = founder?.name?.trim() || DEFAULT_FOUNDER.name;
    const fRole = founder?.role?.trim() || DEFAULT_FOUNDER.role;
    const fBio = founder?.bio?.trim() || DEFAULT_FOUNDER.bio;
    const fLoc = founder?.founderLocation?.trim() || founder?.location?.trim() || DEFAULT_FOUNDER.location;
    const fEdu = founder?.founderEducationIslamic?.trim() || founder?.educationIslamic?.trim() || DEFAULT_FOUNDER.educationIslamic;
    const fInst = founder?.founderInstitute?.trim() || founder?.institute?.trim() || DEFAULT_FOUNDER.institute;
    const fWeb = founder?.founderWebsite?.trim() || founder?.website?.trim() || DEFAULT_FOUNDER.website;
    const fFb = founder?.founderFacebook?.trim() || founder?.facebook?.trim() || DEFAULT_FOUNDER.facebook;
    const fYt = founder?.founderYouTube?.trim() || founder?.youtube?.trim() || DEFAULT_FOUNDER.youtube;

    return `এই **মুদির দোকান খাতা স্মার্ট এআই** অ্যাপটির প্রতিষ্ঠাতা ও প্রধান উদ্ভাবক হলেন **${fName}** (${fRole})।

📍 **বাড়ি ও ঠিকানা:** ${fLoc} (পিতা: ${DEFAULT_FOUNDER.fatherName})
🎓 **ইসলামিক শিক্ষা:** ${fEdu} এবং টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া।
💻 **প্রযুক্তিগত দক্ষতা ও প্রতিষ্ঠান:** ${fInst} থেকে প্রশিক্ষণপ্রাপ্ত দক্ষ এআই, এআই অটোমেশন স্পেশালিস্ট ও সফটওয়্যার ডেভেলপার।

🌐 **অফিসিয়াল যোগাযোগ ও লিংক:**
• পোর্টফোলিও ওয়েবসাইট: [mdmiraz-dev.github.io](${fWeb})
• ফেসবুক প্রোফাইল: [facebook.com/mdmiraz.dev](${fFb})
• ইউটিউব চ্যানেল: [Miraz Learning Story](${fYt})
• হোয়াটসঅ্যাপ: Md Miraz WhatsApp Contact

💡 **উদ্দেশ্য ও ভিশন:** ${fBio}

মেরাজুল ইসলাম ভাইয়ের এই দূরদর্শী প্ল্যাটফর্মের অংশ হয়ে দোকানদার ভাইদের সরাসরি পুরুষ কণ্ঠে বাজার দর ও খাতা সেবায় পাশে থাকতে পেরে আমি অত্যন্ত গর্বিত!`;
  }

  // System instruction for Bangladeshi Grocery Retail Advisor with Founder Knowledge
  function buildRetailAdvisorInstruction(founder?: any) {
    const fName = founder?.name?.trim() || DEFAULT_FOUNDER.name;
    const fRole = founder?.role?.trim() || DEFAULT_FOUNDER.role;
    const fBio = founder?.bio?.trim() || DEFAULT_FOUNDER.bio;
    const fLoc = founder?.founderLocation?.trim() || founder?.location?.trim() || DEFAULT_FOUNDER.location;
    const fEdu = founder?.founderEducationIslamic?.trim() || founder?.educationIslamic?.trim() || DEFAULT_FOUNDER.educationIslamic;
    const fInst = founder?.founderInstitute?.trim() || founder?.institute?.trim() || DEFAULT_FOUNDER.institute;

    return `You are "মুদির দোকান খাতা স্মার্ট এআই উপদেষ্টা" (Smart Business, Market & Retail Advisor for Bangladeshi grocery store owners).
You provide helpful, respectful, and highly practical guidance in Bengali (বাংলা) by default, or English if asked.
Always maintain a warm, confident, and professional male persona ("দোকানদার ভাই, আমি আপনার এআই ব্যবসায়িক উপদেষ্টা").

CRITICAL KNOWLEDGE - FOUNDER & CREATOR IDENTITY (অ্যাপের প্রতিষ্ঠাতা ও নির্মাতা পরিচয়):
- প্রতিষ্ঠাতা ও নির্মাতা (Founder & Creator): ${fName}
- পদবী ও ভূমিকা (Role/Title): ${fRole}
- বাড়ি ও ঠিকানা (Home & Location): ${fLoc} (পিতা: ${DEFAULT_FOUNDER.fatherName})
- ইসলামিক শিক্ষাগত যোগ্যতা (Islamic Education): ${fEdu} এবং টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া থেকে পড়াশোনা।
- প্রযুক্তিগত স্কিল ও প্রতিষ্ঠান (Tech Background): ${fInst} থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই (AI), এআই অটোমেশন (AI Automation) এবং সফটওয়্যার ডেভেলপার (Software Developer)। তিনি সফটওয়্যার তৈরি ও অটোমেশন করেন।
- অফিসিয়াল লিংকসমূহ: পোর্টফোলিও ওয়েবসাইট (https://mdmiraz-dev.github.io/), ফেসবুক (https://www.facebook.com/mdmiraz.dev), ইউটিউব চ্যানেল Miraz Learning Story (https://youtube.com/@mdmiraz-489), গিটহাব (https://github.com/MdMiraz-dev), হোয়াটসঅ্যাপ (Md Miraz WhatsApp)।
- প্রতিষ্ঠার পটভূমি ও ভিশন (Bio & Vision): ${fBio}
- STRICT RULE: Whenever any user asks who created this app, who founded it, who made it, who is Merajul Islam, or asks for founder identity or social links:
  You MUST warmly, respectfully, and proudly introduce ${fName} with his full Islamic education, As-Sunnah Institute tech background, and his vision for empowering Bangladeshi grocery shopkeepers. If they ask for his links or how to contact him, provide the exact links above.

Core expertise:
1. Wholesale commodity rates, FMCG product margins, seasonal stock planning (চাল, ডাল, ভোজ্যতেল, চিনি, মসলা, সাবান ইত্যাদি)।
2. Due khata (বাকির খাতা) management, friendly and effective payment reminder scripts for customers, reducing bad debt.
3. Daily store profit calculation, expense reduction, inventory management, fast-moving vs slow-moving item analysis.
4. If Google Search grounding is enabled, use verified real-time web sources to quote current wholesale market prices (টিসিবি দর, কাওরান বাজার, খাতুনগঞ্জ দর)।
5. If Google Maps grounding is enabled, recommend specific wholesale depots, distributor points, cold storages, or markets based on user location.

Format your responses with neat Markdown: use bullet points, bold key terms, and concise tables where numbers/prices are compared. Keep tone polite, encouraging, and shopkeeper-friendly.`;
  }

  const RETAIL_ADVISOR_SYSTEM_INSTRUCTION = buildRetailAdvisorInstruction();

  // Standard Multi-Turn Chat
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        model = 'gemini-3.5-flash',
        enableSearch = false,
        enableMaps = false,
        userLocation,
        founderInfo
      } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Instant high quality answer for founder inquiries
      if (isFounderQuestion(message)) {
        return res.json({
          text: getFounderAnswer(founderInfo),
          modelUsed: 'instant-founder-profile'
        });
      }

      const ai = getGeminiClient();
      const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];
      const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.5-flash';

      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const turn of history) {
          if (turn.role && turn.text) {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.text }]
            });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });

      const config: any = { systemInstruction: buildRetailAdvisorInstruction(founderInfo) };
      if (enableMaps) {
        config.tools = [{ googleMaps: {} }];
        if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
          config.toolConfig = {
            retrievalConfig: {
              latLng: { latitude: userLocation.latitude, longitude: userLocation.longitude }
            }
          };
        }
      } else if (enableSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      let response: any;
      let actualModelUsed = selectedModel;

      try {
        response = await ai.models.generateContent({ model: selectedModel, contents, config });
      } catch (primaryErr: any) {
        console.warn(`[Gemini Chat] ${selectedModel} returned error:`, primaryErr?.message || primaryErr);
        // Fallback sequence
        const fallbackCandidates = ['gemini-3.1-flash-lite', 'gemini-2.5-flash'];
        let succeeded = false;
        for (const fallbackModel of fallbackCandidates) {
          if (fallbackModel !== selectedModel) {
            try {
              console.log(`[Gemini Chat] Attempting fallback to ${fallbackModel}...`);
              response = await ai.models.generateContent({
                model: fallbackModel,
                contents,
                config: {
                  ...config,
                  tools: enableSearch ? [{ googleSearch: {} }] : undefined
                }
              });
              actualModelUsed = fallbackModel;
              succeeded = true;
              break;
            } catch (fbErr: any) {
              console.warn(`[Gemini Chat] Fallback ${fallbackModel} failed:`, fbErr?.message);
            }
          }
        }
        if (!succeeded) {
          throw primaryErr;
        }
      }

      const replyText = response.text || 'কোনো উত্তর পাওয়া যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।';
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources: { uri: string; title: string }[] = [];
      const mapPlaces: { uri: string; title: string; reviewSnippets?: any[] }[] = [];

      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          webSources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        }
        if (chunk.maps?.uri) {
          mapPlaces.push({
            uri: chunk.maps.uri,
            title: chunk.maps.title || 'গুগল ম্যাপ স্থান',
            reviewSnippets: chunk.maps.placeAnswerSources?.reviewSnippets
          });
        }
      }

      const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      res.json({
        reply: replyText,
        model: actualModelUsed,
        webSources,
        mapPlaces,
        webSearchQueries
      });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to generate AI response' });
    }
  });

  // Streaming Multi-Turn Chat (Server-Sent Events) for real-time live typing
  app.post('/api/gemini/chat-stream', async (req, res) => {
    try {
      const {
        message,
        history = [],
        model = 'gemini-3.5-flash',
        enableSearch = false,
        enableMaps = false,
        userLocation,
        founderInfo
      } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message is required' });
      }

      // Setup SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Instant high quality answer for founder inquiries with simulated smooth typing
      if (isFounderQuestion(message)) {
        const fullAnswer = getFounderAnswer(founderInfo);
        const pieces = fullAnswer.split(' ');
        for (let i = 0; i < pieces.length; i += 3) {
          const piece = pieces.slice(i, i + 3).join(' ') + ' ';
          res.write(`data: ${JSON.stringify({ text: piece })}\n\n`);
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        return res.end();
      }

      const ai = getGeminiClient();
      const allowedModels = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash', 'gemini-3.8-flash'];
      const selectedModel = allowedModels.includes(model) ? model : 'gemini-3.5-flash';

      const contents: any[] = [];
      if (Array.isArray(history) && history.length > 0) {
        for (const turn of history) {
          if (turn.role && turn.text) {
            contents.push({
              role: turn.role === 'user' ? 'user' : 'model',
              parts: [{ text: turn.text }]
            });
          }
        }
      }
      contents.push({ role: 'user', parts: [{ text: message.trim() }] });

      const config: any = { systemInstruction: buildRetailAdvisorInstruction(founderInfo) };
      if (enableMaps) {
        config.tools = [{ googleMaps: {} }];
        if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
          config.toolConfig = {
            retrievalConfig: {
              latLng: { latitude: userLocation.latitude, longitude: userLocation.longitude }
            }
          };
        }
      } else if (enableSearch) {
        config.tools = [{ googleSearch: {} }];
      }

      // Setup SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const stream = await ai.models.generateContentStream({
          model: selectedModel,
          contents,
          config
        });

        for await (const chunk of stream) {
          const chunkText = chunk.text;
          if (chunkText) {
            res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          }
        }
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (streamErr: any) {
        console.warn(`[Gemini Chat Stream] Streaming failed with ${selectedModel}:`, streamErr?.message);
        // Fallback sequence
        try {
          const fb = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents,
            config: { ...config, tools: enableSearch ? [{ googleSearch: {} }] : undefined }
          });
          const fullText = fb.text || 'দোকানদার ভাই, আপনার বার্তাটি পেয়েছি। অনুগ্রহ করে আরেকবার চেষ্টা করুন।';
          // Simulate smooth streaming chunk response
          const words = fullText.split(' ');
          for (let i = 0; i < words.length; i += 3) {
            const piece = words.slice(i, i + 3).join(' ') + ' ';
            res.write(`data: ${JSON.stringify({ text: piece })}\n\n`);
          }
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        } catch (fbErr: any) {
          // Intelligent retail advisor fallback message so user always gets a meaningful answer
          const fallbackText = 'দোকানদার ভাই, আমি আপনার এআই ব্যবসায়িক উপদেষ্টা। আজকের পাইকারি ও খুচরা বাজার দর, বাকির খাতা পরিচালনা এবং লাভ বৃদ্ধির যে কোনো প্রশ্ন আপনি আমাকে সরাসরি করতে পারেন। আমি সর্বদা প্রস্তুত আছি।';
          res.write(`data: ${JSON.stringify({ text: fallbackText })}\n\n`);
          res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
          res.end();
        }
      }
    } catch (error: any) {
      console.error('Gemini Chat Stream API Error:', error);
      if (!res.headersSent) {
        res.status(500).json({ error: error.message || 'Failed to start stream' });
      } else {
        res.end();
      }
    }
  });

  // Live Market Rates (Google Search Grounding)
  app.post('/api/gemini/market-rates', async (req, res) => {
    try {
      const {
        commodity = 'চাল, ডাল, সয়াবিন তেল, চিনি, পেঁয়াজ, আলু, ডিম'
      } = req.body;

      const ai = getGeminiClient();
      const prompt = `আজকের বাংলাদেশে ${commodity} এর সর্বশেষ পাইকারি ও খুচরা বাজার দর কত? 
ট্রেডিং কর্পোরেশন অব বাংলাদেশ (টিসিবি / TCB), কাওরান বাজার এবং খাতুনগঞ্জের সাম্প্রতিকতম পাইকারি দর এবং খুচরা দর উল্লেখ করুন।
অনুগ্রহ করে পণ্যভিত্তিক একটি সুন্দর টেবিল ফরম্যাটে দাম (প্রতি কেজি/লিটার/হালি) উপস্থাপন করুন এবং সাম্প্রতিক বাজার প্রবণতা বা কারণ সংক্ষেপে ব্যাখ্যা করুন।`;

      let response: any;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            systemInstruction: 'You are a senior Bangladeshi agricultural and grocery commodity market analyst. Provide accurate, up-to-date market rates in Bengali with neat Markdown tables.',
            tools: [{ googleSearch: {} }]
          }
        });
      } catch (err) {
        response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            systemInstruction: 'You are a senior Bangladeshi agricultural and grocery commodity market analyst. Provide accurate market rates in Bengali with neat Markdown tables.',
            tools: [{ googleSearch: {} }]
          }
        });
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const webSources: { uri: string; title: string }[] = [];
      for (const chunk of groundingChunks) {
        if (chunk.web?.uri) {
          webSources.push({ uri: chunk.web.uri, title: chunk.web.title || chunk.web.uri });
        }
      }

      res.json({
        report: response.text,
        webSources,
        webSearchQueries: response.candidates?.[0]?.groundingMetadata?.webSearchQueries || []
      });
    } catch (error: any) {
      console.error('Market rates error:', error);
      res.status(500).json({ error: error.message || 'Failed to fetch live market rates' });
    }
  });

  // Nearby Markets (Google Maps Grounding)
  app.post('/api/gemini/nearby-markets', async (req, res) => {
    try {
      const {
        query = 'পাইকারি মুদি আড়ত ও কাঁচাবাজার',
        latitude,
        longitude
      } = req.body;

      const ai = getGeminiClient();
      const prompt = `নিকটবর্তী ${query} (wholesale grocery markets, grain wholesale mandis, FMCG distributor depots, or cold storages) খুঁজুন।
প্রতিটি আড়ত বা বাজারের নাম, অবস্থান এবং কোন কোন পণ্যের জন্য বিখ্যাত তা স্পষ্ট করে উল্লেখ করুন।`;

      const config: any = {
        systemInstruction: 'You are a local Bangladeshi retail supply chain locator. Identify top wholesale trading markets, distributor depots, and commodity hubs. ALWAYS ensure accurate place names.',
        tools: [{ googleMaps: {} }]
      };

      if (typeof latitude === 'number' && typeof longitude === 'number') {
        config.toolConfig = {
          retrievalConfig: { latLng: { latitude, longitude } }
        };
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
        config
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapPlaces: { uri: string; title: string; reviewSnippets?: any[] }[] = [];
      for (const chunk of groundingChunks as any[]) {
        if (chunk.maps?.uri) {
          mapPlaces.push({
            uri: chunk.maps.uri,
            title: chunk.maps.title || 'পাইকারি আড়ত বা বাজার',
            reviewSnippets: chunk.maps.placeAnswerSources?.reviewSnippets
          });
        }
      }

      res.json({
        summary: response.text,
        mapPlaces
      });
    } catch (error: any) {
      console.error('Nearby markets error:', error);
      res.status(500).json({ error: error.message || 'Failed to find nearby markets' });
    }
  });

  // AI Retail Store Interview Preparation API
  app.post('/api/gemini/interview-prep', async (req, res) => {
    try {
      const {
        mode = 'answer_question',
        question,
        role = 'সিনিয়র রিটেল স্টোর ম্যানেজার ও হিসাবরক্ষক',
        userAnswer
      } = req.body;

      const ai = getGeminiClient();
      const modelsToTry = ['gemini-3.5-flash', 'gemini-2.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];

      if (mode === 'evaluate_answer') {
        const prompt = `You are an expert Bangladeshi retail store HR director and hiring manager.
Candidate Role: ${role}
Interview Question: ${question}
Candidate's Bengali Answer: "${userAnswer || ''}"

Evaluate the candidate's answer constructively in Bengali.
Provide:
1. score: numeric rating out of 10
2. verdict: a short encouraging verdict in Bengali (e.g. "খুব ভালো ও বাস্তবসম্মত উত্তর", "মোটামুটি কিন্তু কিছু তথ্য ঘাটতি রয়েছে")
3. strengths: array of positive aspects of their answer
4. improvements: array of concrete suggestions to make it stronger
5. improvedVersion: a polished, professional model answer in Bengali incorporating store business reality (cash counter, inventory, due khata, customer management).`;

        let resultJson: any = null;
        for (const model of modelsToTry) {
          try {
            const resp = await ai.models.generateContent({
              model,
              contents: prompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.NUMBER },
                    verdict: { type: Type.STRING },
                    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                    improvedVersion: { type: Type.STRING }
                  },
                  required: ['score', 'verdict', 'strengths', 'improvements', 'improvedVersion']
                }
              }
            });
            if (resp && resp.text) {
              resultJson = JSON.parse(resp.text);
              break;
            }
          } catch (err: any) {
            console.warn(`[Interview Eval] Model ${model} failed:`, err?.message || err);
          }
        }

        if (!resultJson) {
          throw new Error('Failed to evaluate interview answer with AI');
        }

        return res.json(resultJson);
      }

      // mode === 'answer_question'
      const prompt = `You are a top Bangladeshi grocery & retail supermarket hiring specialist.
Role: ${role}
Store Business Domain: Retail grocery store, supermarket, FMCG, cash counter, inventory, customer management.
Topic / Question: "${question || 'দোকান পরিচালনা ও বাকির খাতা সামলানো নিয়ে গুরুত্বপূর্ণ ইন্টারভিউ প্রশ্ন'}"

Analyze this retail store interview question and provide a high-scoring, practical response in Bengali:
1. question: Clean Bengali question
2. objective: What the interviewer is evaluating (কেন প্রশ্নকর্তা এই প্রশ্নটি করেন)
3. modelAnswer: A stellar, confident answer in natural professional Bengali (আদর্শ উত্তর)
4. starMethod: Breakdown using STAR framework:
   - situation: পরিস্থিতি
   - task: দায়িত্ব
   - action: পদক্ষেপ
   - result: বাস্তব ফলাফল
5. doTips: Array of 3-4 key winning points to emphasize
6. dontTips: Array of 2-3 mistakes or red flags to avoid
7. keyTerminology: Array of retail store business terms (e.g. FIFO, স্টক রোটেশন, বাকির লেজার, ক্যাশ রিকনসিলিয়েশন)`;

      let resultJson: any = null;
      for (const model of modelsToTry) {
        try {
          const resp = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  objective: { type: Type.STRING },
                  modelAnswer: { type: Type.STRING },
                  starMethod: {
                    type: Type.OBJECT,
                    properties: {
                      situation: { type: Type.STRING },
                      task: { type: Type.STRING },
                      action: { type: Type.STRING },
                      result: { type: Type.STRING }
                    },
                    required: ['situation', 'task', 'action', 'result']
                  },
                  doTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  dontTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  keyTerminology: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ['question', 'objective', 'modelAnswer', 'starMethod', 'doTips', 'dontTips', 'keyTerminology']
              }
            }
          });
          if (resp && resp.text) {
            resultJson = JSON.parse(resp.text);
            break;
          }
        } catch (err: any) {
          console.warn(`[Interview Q&A] Model ${model} failed:`, err?.message || err);
        }
      }

      if (!resultJson) {
        throw new Error('Failed to generate interview answer with AI');
      }

      res.json(resultJson);
    } catch (error: any) {
      console.error('Interview Prep API Error:', error);
      res.status(500).json({ error: error.message || 'Failed to process interview preparation request' });
    }
  });

  const server = http.createServer(app);

  // Gemini 3.8 Live API WebSocket using Male Voice ('Puck' / 'Fenrir')
  const wss = new WebSocketServer({ server, path: '/api/live-ws' });

  wss.on('connection', async (clientWs: WebSocket) => {
    console.log('[Live API] Client connected to voice WebSocket');
    let session: any = null;
    let isClosed = false;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: 'GEMINI_API_KEY is not configured in Settings > Secrets.'
        }));
        clientWs.close();
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
      });

      // MALE VOICE: 'Puck' or 'Fenrir' as requested by user
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: 'Puck' // Male voice: clear, energetic, confident male persona
              }
            }
          },
          systemInstruction: {
            parts: [{
              text: 'You are a warm, intelligent male grocery shop consultant and market advisor for Bangladeshi shopkeepers (দোকানের বুদ্ধিমান ও সদালপী এআই সহকারী). Speak in a clear, natural male voice in warm, polite, conversational Bengali (or English if addressed in English). Keep voice responses concise, practical, and direct so the busy shopkeeper can listen quickly while working at the counter. FOUNDER KNOWLEDGE: The founder and creator of this app is মেরাজুল ইসলাম (Merajul Islam) from Ashuganj, Brahmanbaria. He completed Dawra-e-Hadith from Jamia Arabia Imdadul Uloom Faridabad Madrasah, Dhaka, and studied at Tongi Sadequl Uloom Fazil Madrasah. He is an AI, AI Automation & Software Developer trained at As-Sunnah Skill Development Institute. If asked who created or founded this app, warmly, politely and proudly introduce Merajul Islam.'
            }]
          }
        },
        callbacks: {
          onopen: () => {
            console.log('[Live API] Connected to Gemini 3.8 Live backend session with male voice (Puck)');
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'session_ready',
                message: 'Gemini 3.8 Live session connected with male voice'
              }));
              // Send immediate welcoming text transcript so user sees AI response ready
              clientWs.send(JSON.stringify({
                type: 'model_transcript',
                text: 'আসসালামু আলাইকুম ভাই! আমি আপনার দোকানের এআই পার্টনার। আজকের চাল, ডাল, তেলের পাইকারি বাজার দর, বাকির হিসাব বা আমাদের অ্যাপ নিয়ে মুখে বলুন, আমি পুরুষ কণ্ঠে উত্তর দিচ্ছি।'
              }));
            }
          },
          onmessage: (message: any) => {
            if (isClosed || clientWs.readyState !== WebSocket.OPEN) return;

            const audioChunk = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audioChunk) {
              clientWs.send(JSON.stringify({ type: 'audio', audio: audioChunk }));
            }

            const textPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text)?.text;
            const outputTranscription = message.serverContent?.outputAudioTranscription?.text;
            const inputTranscription = message.serverContent?.inputAudioTranscription?.text;

            if (textPart || outputTranscription) {
              clientWs.send(JSON.stringify({
                type: 'model_transcript',
                text: textPart || outputTranscription
              }));
            }

            if (inputTranscription) {
              clientWs.send(JSON.stringify({
                type: 'user_transcript',
                text: inputTranscription
              }));
            }

            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          },
          onerror: (err: any) => {
            console.error('[Live API] Session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({
                type: 'error',
                message: 'Gemini Live session error occurred.'
              }));
            }
          },
          onclose: () => {
            console.log('[Live API] Gemini Live backend session closed');
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'session_closed' }));
            }
          }
        }
      });

      // Send initial greeting turn to Live session
      try {
        session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [{ text: 'দোকানদার ভাইকে আন্তরিকভাবে এক বাক্যে আসসালামু আলাইকুম জানিয়ে পুরুষ কণ্ঠে বলুন কীভাবে সাহায্য করতে পারেন।' }]
            }
          ],
          turnComplete: true
        });
      } catch (err) {
        console.warn('[Live API] Initial greeting turn skipped:', err);
      }

      clientWs.on('message', (rawMessage: any) => {
        try {
          const parsed = JSON.parse(rawMessage.toString());
          if (parsed.audio) {
            if (session) {
              session.sendRealtimeInput({
                media: {
                  data: parsed.audio,
                  mimeType: 'audio/pcm;rate=16000'
                }
              });
            }
          } else if (parsed.text) {
            const queryText = parsed.text.trim();
            if (!queryText) return;

            // Immediate founder reply check
            if (isFounderQuestion(queryText)) {
              const founderText = getFounderAnswer(parsed.founderInfo);
              if (!isClosed && clientWs.readyState === WebSocket.OPEN) {
                clientWs.send(JSON.stringify({
                  type: 'model_transcript',
                  text: founderText
                }));
              }
            } else {
              // Generate high quality Bengali response text companion immediately
              (async () => {
                try {
                  let reply = '';
                  const models = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
                  for (const m of models) {
                    try {
                      const answerResp = await ai.models.generateContent({
                        model: m,
                        contents: queryText,
                        config: {
                          systemInstruction: buildRetailAdvisorInstruction(parsed.founderInfo),
                        }
                      });
                      if (answerResp && answerResp.text) {
                        reply = answerResp.text;
                        break;
                      }
                    } catch (mErr) {}
                  }

                  if (reply && !isClosed && clientWs.readyState === WebSocket.OPEN) {
                    clientWs.send(JSON.stringify({
                      type: 'model_transcript',
                      text: reply
                    }));
                  }
                } catch (genErr) {
                  console.warn('[Live API] Text generation companion error:', genErr);
                }
              })();
            }

            // Also forward to live session for live PCM audio synthesis
            if (session) {
              try {
                const turnText = isFounderQuestion(queryText)
                  ? 'এই অ্যাপসের প্রতিষ্ঠাতা মেরাজুল ইসলাম। বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে, ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং আস-সুন্নাহ ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। সুন্দর ও বিনয়ী পুরুষ কণ্ঠে দুই বাক্যে প্রতিষ্ঠাতা হিসেবে মেরাজুল ইসলামের পরিচয় দিন।'
                  : queryText;

                session.sendClientContent({
                  turns: [
                    {
                      role: 'user',
                      parts: [{ text: turnText }]
                    }
                  ],
                  turnComplete: true
                });
              } catch (sendErr) {
                console.warn('[Live API] Error forwarding text to live session:', sendErr);
              }
            }
          }
        } catch (err) {
          console.error('[Live API] Error passing message to Gemini:', err);
        }
      });

      clientWs.on('close', () => {
        console.log('[Live API] Client WebSocket closed');
        isClosed = true;
        try {
          if (session && typeof session.close === 'function') {
            session.close();
          }
        } catch (e) {}
      });

      clientWs.on('error', (err: any) => {
        console.error('[Live API] Client WebSocket error:', err);
        isClosed = true;
        try {
          if (session && typeof session.close === 'function') {
            session.close();
          }
        } catch (e) {}
      });
    } catch (err: any) {
      console.error('[Live API] Failed to initialize live session:', err);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(JSON.stringify({
          type: 'error',
          message: err.message || 'Failed to connect to Gemini 3.8 Live API'
        }));
        clientWs.close();
      }
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} with WebSocket Live API & Male Voice (Puck)`);
  });
}

startServer();
