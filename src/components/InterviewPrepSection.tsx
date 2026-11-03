import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Send,
  Award,
  Target,
  BookOpen,
  RefreshCw,
  Star,
  Zap,
  UserCheck,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  BrainCircuit,
  ArrowRight
} from 'lucide-react';

export interface InterviewQnA {
  id: string;
  category: 'cash_due' | 'inventory_stock' | 'customer_service' | 'profit_cost' | 'integrity';
  categoryLabel: string;
  question: string;
  frequency: 'high' | 'medium';
  objective: string;
  modelAnswer: string;
  starMethod: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  doTips: string[];
  dontTips: string[];
  keyTerminology: string[];
}

const CURATED_STORE_QUESTIONS: InterviewQnA[] = [
  {
    id: 'q1',
    category: 'cash_due',
    categoryLabel: 'ক্যাশ ও বাকির খাতা',
    question: 'একজন পুরোনো ও নিয়মিত ক্রেতা বাকির নির্ধারিত সীমা ছাড়িয়ে যাওয়ার পরেও নতুন করে বাকি চাইলে আপনি কীভাবে বিষয়টি বিনয়ের সাথে পরিচালনা করবেন?',
    frequency: 'high',
    objective: 'দোকানের ক্যাশ ফ্লো সুরক্ষা নিশ্চিত করার পাশাপাশি বিশ্বস্ত গ্রাহকের সাথে সুসম্পর্ক টিকিয়ে রাখার ভারসাম্য ও মধ্যস্থতা করার দক্ষতা পরীক্ষা করা।',
    modelAnswer: 'আমি প্রথমে ক্রেতাকে অত্যন্ত সম্মানের সাথে স্বাগত জানাব এবং তার অতীতের নিয়মিত কেনাকাটার জন্য কৃতজ্ঞতা প্রকাশ করব। এরপর একান্তে বিনয়ের সাথে জানাব যে আমাদের ডিজিটাল খাতা সিস্টেমে প্রতি গ্রাহকের জন্য একটি স্বয়ংক্রিয় বাকির সীমা নির্ধারিত থাকে। আমি তাকে বর্তমান বকেয়া টাকার পরিমাণটি হাসিমুখে মনে করিয়ে দিয়ে অনুরোধ করব অন্তত আগের বকেয়ার একটি অংশ (যেমন ৫০% বা ৭০%) পরিশোধ করতে, যাতে সিস্টেমটি স্বয়ংক্রিয়ভাবে আজকের নতুন ক্রয়ের অনুমোদন দেয়। প্রয়োজনে তাকে বলব, "কাকা/ভাই, মালিক পক্ষের অডিট রুলসের কারণে আমাকে এই নিয়ম মানতে হচ্ছে, আপনার সহযোগিতা পেলে আমি খুব কৃতজ্ঞ থাকব।" এতে ক্রেতা অপমানিত বোধ করবেন না এবং দোকানের টাকাও দ্রুত আদায় হবে।',
    starMethod: {
      situation: 'দোকানের একজন নিয়মিত ক্রেতা যার পূর্বে ৫,০০০ টাকা বাকি রয়েছে, তিনি নতুন করে আরও ২,০০০ টাকার মালামাল বাকিতে নিতে এসেছিলেন।',
      task: 'ক্রেতার আত্মসম্মানে আঘাত না দিয়ে এবং তাকে না হারিয়ে বকেয়া আদায় করা ও নতুন বাকির অতিরিক্ত চাপ আটকানো।',
      action: 'একান্তে ডেকে চা-বিস্কুট দিয়ে আপ্যায়ন করে ডিজিটাল খাতার হিসাব দেখালাম এবং আগের বকেয়ার ৩,০০০ টাকা নগদ আদায় করে বাকি ২০০০ টাকার নতুন পণ্য দিলাম।',
      result: 'দোকানের নিট নগদ ৩,০০০ টাকা ক্যাশে জমা হলো, বাকি নিয়ন্ত্রণে রইল এবং গ্রাহক অত্যন্ত সন্তুষ্টচিত্তে নিয়মিত কেনাকাটা অব্যাহত রাখলেন।'
    },
    doTips: [
      'অন্য ক্রেতাদের সামনে কখনো উচ্চস্বরে বা অপমানজনক ভঙ্গিতে বকেয়ার কথা বলবেন না।',
      'সমস্যার দায় কোনো ব্যক্তি নয় বরং দোকানের ডিজিটাল সিস্টেম বা অ্যাকাউন্টস পলিসির ওপর দিন।',
      'পুরো টাকা একবারে না পেলেও আংশিক ডাউন-পেমেন্ট নেওয়ার বাস্তব প্রস্তাব দিন।'
    ],
    dontTips: [
      'সরাসরি কর্কশ গলায় "না, বাকি দেওয়া যাবে না" বলে ফিরিয়ে দেওয়া।',
      'মালিকের অনুমতি ছাড়া অতিরিক্ত বাকি বাড়িয়ে দোকানের ক্যাশ আটকে ফেলা।'
    ],
    keyTerminology: ['ডিজিটাল খাতা', 'বাকির ক্রেডিট লিমিট (Credit Limit)', 'আংশিক রিকভারি', 'গ্রাহক রিটেনশন']
  },
  {
    id: 'q2',
    category: 'cash_due',
    categoryLabel: 'ক্যাশ ও বাকির খাতা',
    question: 'দিনের শেষে ক্যাশ ড্রয়ার গুনে দেখা গেল বিক্রয় রশিদের হিসাবের চেয়ে ৫০০ টাকা কম। আপনি কী কী ধাপে অনুসন্ধান ও সমাধান করবেন?',
    frequency: 'high',
    objective: 'আর্থিক স্বচ্ছতা, হিসেব-নিকেশে সততা এবং হিসাবের গরমিল অনুসন্ধানে যৌক্তিক সমস্যা সমাধান প্রক্রিয়া যাচাই করা।',
    modelAnswer: 'ক্যাশের গরমিল হলে আমি আতঙ্কিত না হয়ে শান্তভাবে তাৎক্ষণিক অনুসন্ধান শুরু করব। প্রথম ধাপে, আমি প্রতিটি লেনদেন পুনরায় রিকনসাইল করব—বিশেষ করে মোবাইল ব্যাংকিং (বিকাশ/নগদ) বা কার্ড পেমেন্টের টাকা ক্যাশ ড্রয়ারের ভেতর ভুলবশত হিসাবভুক্ত হয়েছে কি না। দ্বিতীয় ধাপে, দিনের কোনো খুচরা খরচ (যেমন চা-নাশতা, পরিবহন বা বকশিশ) ভাউচারে লেখা হয়েছে কিন্তু ক্যাশ কাউন্টারে এন্ট্রি বাদ পড়েছে কি না তা যাচাই করব। তৃতীয় ধাপে, বড় কোনো নোটে বা ভাঙতি দেওয়ার সময় ক্রেতাকে অতিরিক্ত ফেরত দেওয়া হয়েছিল কি না তা শেষ কয়েকটি চালানের সাথে মেলাব। কোনোভাবেই মিল না পেলে আমি বিষয়টি গোপন না রেখে তাৎক্ষণিকভাবে স্টোর ওনারকে সত্য জানাব এবং আমার শিফটের রেজিস্টারে নোট রেখে দায় স্বীকার করে নিয়ম অনুযায়ী পরবর্তী পদক্ষেপে যাব।',
    starMethod: {
      situation: 'বিক্রয় শেষে মোট ক্যাশ রেজিস্টার দেখাচ্ছিল ৳১৮,৫০০, কিন্তু ড্রয়ারে পাওয়া গেল ৳১৮,০০০।',
      task: '৫০০ টাকার অমিলের সঠিক উৎস খুঁজে বের করা এবং আর্থিক স্বচ্ছতা অক্ষুণ্ণ রাখা।',
      action: 'দিনের সব খরচের স্লিপ এবং বিকাশ স্টেটমেন্ট চেক করে দেখলাম দুপুরে সরবরাহকারীকে দেওয়া ৫০০ টাকার কার্টন ভাড়ার ভাউচারটি পিওএস সিস্টেমে পোস্ট করা বাকি ছিল।',
      result: 'ভাউচারটি এন্ট্রি দেওয়ার সাথে সাথে পুরো হিসাব শতভাগ মিলে গেল এবং কোনো আর্থিক ঘাটতি রইল না।'
    },
    doTips: [
      'সবসময় সত্য স্বীকার করার এবং লুকোচুরি না করার মানসিকতা প্রকাশ করুন।',
      'ক্যাশ রিকনসিলিয়েশন, ভাউচার অডিট ও মোবাইল ব্যাংকিং স্টেটমেন্ট মেলানোর কথা উল্লেখ করুন।'
    ],
    dontTips: [
      '"আমার হিসেবে কখনোই ভুল হয় না" জাতীয় অতি-আত্মবিশ্বাসী অবাস্তব দাবি করা।',
      'অন্য দোকান সহকারী বা সেলসম্যানের ওপর দায় চাপিয়ে দেওয়া।'
    ],
    keyTerminology: ['ক্যাশ রিকনসিলিয়েশন', 'ভাউচার অডিট', 'ডিজিটাল পেমেন্ট লগ', 'দৈনিক হিসাব ক্লোজিং']
  },
  {
    id: 'q3',
    category: 'inventory_stock',
    categoryLabel: 'ইনভেন্টরি ও স্টক',
    question: 'মুদি বা রিটেল স্টোরে পণ্যের মেয়াদোত্তীর্ণ (Expiry) হওয়া এবং ড্যামেজ কমাতে আপনি কীভাবে ইনভেন্টরি ম্যানেজ করবেন?',
    frequency: 'high',
    objective: 'এফআইএফও (FIFO) পদ্ধতি, সেলফ ডিসপ্লে, নিয়মিত স্টক অডিট এবং খাদ্যদ্রব্য সুরক্ষার জ্ঞান যাচাই করা।',
    modelAnswer: 'পণ্যের মেয়াদোত্তীর্ণ হওয়া রোধে আমি কঠোরভাবে "FIFO" (First In, First Out) এবং "FEFO" (First Expired, First Out) নিয়ম মেনে চলি। নতুন মালামাল দোকানে এলে আমি সেগুলোকে পেছনের সারিতে সাজাই এবং আগের লটের পণ্যগুলোকে সামনের সারিতে রাখি যাতে ক্রেতারা সেগুলো আগে কেনেন। প্রতি সপ্তাহের শুরুতে আমরা পুরো দোকানের একটি "শর্ট এক্সপায়ারি অডিট" চালাই। যে সব পণ্যের মেয়াদ আর ৩০ থেকে ৪৫ দিন বাকি রয়েছে, সেগুলোকে চিহ্নিত করে বিশেষ "কুইক সেল ডিসকাউন্ট" বা প্রমোশনাল বান্ডেলে বিক্রির ব্যবস্থা করি। আর ড্যামেজ কমাতে তেল, আটা ও চালের বস্তা সরাসরি মাটিতে না রেখে প্যালেটের ওপর রাখি এবং ইঁদুর/কীটপতঙ্গ রোধে নিয়মিত ব্যবস্থা নিই।',
    starMethod: {
      situation: 'দোকানে প্যাকেটজাত মসলা ও বিস্কুটের কয়েকটি আইটেম পেছনের দিকে থেকে যাওয়ায় মেয়াদোত্তীর্ণ হয়ে প্রতিমাসে গড়ে ৩,০০০ টাকার ক্ষতি হতো।',
      task: 'পণ্য নষ্টের ক্ষতি শূন্যের কোঠায় নামিয়ে আনা এবং স্টক রোটেশন চালু করা।',
      action: 'আমি সেলফগুলোকে রি-অর্গানাইজ করে কালার কোডিং স্টিকার লাগালাম এবং নতুন স্টক পেছনের দিকে লোড করার নিয়ম বাধ্যতামূলক করলাম।',
      result: 'পরবর্তী ৩ মাসে মেয়াদোত্তীর্ণ পণ্যের ক্ষতি ৮৫% কমে গেল এবং স্টক রোটেশন গতিশীল হলো।'
    },
    doTips: [
      'FIFO (ফার্স্ট ইন ফার্স্ট আউট) এবং FEFO শব্দের সুস্পষ্ট ব্যবহার করুন।',
      'সাপ্লায়ার রিটার্ন পলিসি এবং এক্সপায়ারির পূর্বে কোম্পানি ডিলারের সাথে পণ্য বদলের কৌশল উল্লেখ করুন।'
    ],
    dontTips: [
      'মেয়াদোত্তীর্ণ পণ্য ক্রেতাকে লুকিয়ে কম দামে দিয়ে দেওয়ার কথা বলা (এটি মারাত্মক অন্যায় ও অবৈধ)।'
    ],
    keyTerminology: ['FIFO (First In First Out)', 'FEFO', 'শর্ট এক্সপায়ারি অডিট', 'প্যালেট স্টোরেজ', 'ড্যামেজ মিনিমাইজেশন']
  },
  {
    id: 'q4',
    category: 'inventory_stock',
    categoryLabel: 'ইনভেন্টরি ও স্টক',
    question: 'দোকানের ফাস্ট-মুভিং পণ্য (যেমন সয়াবিন তেল, চিনি, চাল) যেন কখনোই স্টক-আউট না হয়, সে ব্যাপারে আপনার কৌশল কী?',
    frequency: 'high',
    objective: 'রি-অর্ডার পয়েন্ট নির্ধারণ, সরবরাহকারী লিয়াজোঁ এবং সিজনাল ডিমান্ডের পূর্বানুমান বোঝার ক্ষমতা।',
    modelAnswer: 'ফাস্ট-মুভিং পণ্য সবসময় স্টকে রাখতে আমি প্রতিটি মূল পণ্যের জন্য একটি "সর্বনিম্ন নিরাপত্তা স্টক লেভেল" (Minimum Safety Stock) বা "রি-অর্ডার পয়েন্ট" নির্ধারণ করে রাখি। যেমন: সয়াবিন তেলের স্টক যখন ১৫ কার্টনে নেমে আসে, তখনই নতুন চালানের অর্ডার করা হয় যাতে সরবরাহকারীর ৩ দিন সময় লাগলেও দোকানে স্টক-আউট না ঘটে। এছাড়া রমজান, পূজা, ঈদ বা বর্ষার মতো বিশেষ মৌসুমে চিনির বা তেলের চাহিদা হঠাৎ বেড়ে যায়, তাই আমি ২ সপ্তাহ আগেই স্থানীয় পাইকারি ডিপো ও মিলের সাথে কথা বলে পর্যাপ্ত বাফার স্টক নিশ্চিত করি। নিয়মিত সাপ্লায়ারদের সাথে ভালো সম্পর্ক বজায় রাখায় বাজারে সংকটকালেও অগ্রাধিকার ভিত্তিতে মালামাল পাওয়া যায়।',
    starMethod: {
      situation: 'গত বছর রমজানের শুরুতে বাজারে ভোজ্যতেলের তীব্র সংকটের পূর্বাভাস পাওয়া গিয়েছিল।',
      task: 'দোকানের নিয়মিত খদ্দেরদের সেবা নিশ্চিত করতে পর্যাপ্ত স্টক মজুত রাখা কিন্তু অতিরিক্ত চড়া দামে না কেনা।',
      action: 'বাজার দর বাড়ার ১৫ দিন আগেই ডিস্ট্রিবিউটরের সাথে যোগাযোগ করে নগদ ছাড়ে আগাম অর্ডার নিশ্চিত করেছিলাম।',
      result: 'পুরো রমজানে আমাদের দোকানে তেল শেষ হয়নি এবং অন্যান্য দোকানের তুলনায় বিক্রয় ২২% বৃদ্ধি পেয়েছিল।'
    },
    doTips: [
      'রি-অর্ডার লেভেল (Re-order point) ও সেফটি স্টকের বাস্তব উদাহরণ দিন।',
      'ডিস্ট্রিবিউটর ও পাইকারি আড়তদারদের সাথে যোগাযোগ নেটওয়ার্কের কথা তুলে ধরুন।'
    ],
    dontTips: [
      'অবৈধ মজুতদারি বা অতিরিক্ত মুনাফা লোটার উদ্দেশ্যে দাম বাড়ানোর কথা বলা।'
    ],
    keyTerminology: ['সেফটি স্টক (Safety Stock)', 'রি-অর্ডার পয়েন্ট', 'বাফার ইনভেন্টরি', 'ডিস্ট্রিবিউটর নেটওয়ার্ক']
  },
  {
    id: 'q5',
    category: 'customer_service',
    categoryLabel: 'গ্রাহক সেবা ও দেনদরবার',
    question: 'একজন ক্রেতা এসে দাবি করলেন যে আপনার দোকান থেকে কেনা পণ্যের ওজন কম ছিল বা পণ্যে পোকা ছিল এবং তিনি অন্য ক্রেতাদের সামনে রেগে চিৎকার করছেন। আপনি কীভাবে সামলাবেন?',
    frequency: 'high',
    objective: 'চরম উত্তেজনাকর মুহূর্তে ধৈর্য, ক্রেতার অভিযোগ দ্রুত নিরসন এবং দোকানের সুনাম রক্ষার নেতৃত্বমূলক কৌশল।',
    modelAnswer: 'প্রথমত, আমি কখনোই ক্রেতার সাথে পাল্টা তর্কে জড়াব না বা উচ্চবাচ্য করব না। আমি শান্ত ও সহানুভূতিশীল কণ্ঠে বলব, "স্যার/ভাইয়া, বিষয়টি শোনার জন্য আমরা অত্যন্ত দুঃখিত। অনুগ্রহ করে এখানে বসুন, আমি নিজে বিষয়টি সমাধান করে দিচ্ছি।" তাকে কাউন্টারের একপাশে বসিয়ে এক গ্লাস পানি অফার করব যাতে দোকানের বাকি ক্রেতাদের মাঝে বিরূপ প্রতিক্রিয়া না পড়ে। এরপর অবিলম্বে তার চোখের সামনে পণ্যটি আমাদের ডিজিটাল স্কেলে মেপে দেখব বা প্যাকেটটি পরীক্ষা করব। সত্যিই যদি ত্রুটি থাকে, আমি তাৎক্ষণিকভাবে বিনয়ের সাথে আন্তরিক ক্ষমা চেয়ে পণ্যটি পরিবর্তন করে দেব অথবা সম্পূর্ণ টাকা ফেরত দেব। আর ত্রুটি সরবরাহকারীর হলে কোম্পানি প্রতিনিধির কাছে সরাসরি অভিযোগ পাঠাব। ক্রেতা যেন দোকান ছাড়ার সময় বুঝতে পারেন যে আমরা তার আস্থাকে সর্বোচ্চ মূল্য দিই।',
    starMethod: {
      situation: 'এক ক্রেতা ৫ কেজি আটার প্যাকেটে ওজন ২০০ গ্রাম কম দাবি করে অন্য ক্রেতাদের সামনে অভিযোগ করছিলেন।',
      task: 'ক্রেতার রাগ প্রশমিত করা এবং বাকি ক্রেতাদের মাঝে দোকানের প্রতি আস্থা অটুট রাখা।',
      action: 'আমি তৎক্ষণাৎ ক্রেতাকে পাশে এনে আমাদের ক্যালিব্রেটেড ডিজিটাল স্কেলে মাপলাম এবং দেখলাম কোম্পানির সিলগালা প্যাকেটে ফ্যাক্টরি ভুলের কারণে ওজন সামান্য কম ছিল। আমি সাথে সাথে নতুন একটি নিখুঁত প্যাকেট দিলাম এবং বাড়তি একটি বিস্কুট উপহার দিয়ে আন্তরিক দুঃখ প্রকাশ করলাম।',
      result: 'ক্রেতা অত্যন্ত খুশি হলেন এবং পরবর্তীতে অন্য বন্ধুদেরও আমাদের বিশ্বস্ততার প্রশংসা করে দোকানে নিয়ে এলেন।'
    },
    doTips: [
      'ধৈর্য, সক্রিয়ভাবে শোনা (Active Listening) এবং ক্ষমা চাওয়ার উদারতা দেখান।',
      'ডিজিটাল স্কেলের নির্ভুল ক্যালিব্রেশন এবং ঝামেলাহীন রিপ্লেসমেন্টের কথা বলুন।'
    ],
    dontTips: [
      'ক্রেতার সাথে চিৎকার বা পাল্টা বচসায় লিপ্ত হওয়া।',
      '"আপনি মিথ্যা বলছেন" বলে সরাসরি ক্রেতাকে অভিযুক্ত করা।'
    ],
    keyTerminology: ['অ্যাক্টিভ লিসেনিং', 'ইনস্ট্যান্ট রিপ্লেসমেন্ট', 'ডিজিটাল ওয়েট ক্যালিব্রেশন', 'গ্রাহক সন্তুষ্টি']
  },
  {
    id: 'q6',
    category: 'profit_cost',
    categoryLabel: 'লাভ বৃদ্ধি ও খরচ নিয়ন্ত্রণ',
    question: 'দোকানের নিট পরিচালন মুনাফা (Net Profit) বাড়ানোর জন্য আপনি কোন কোন জায়গায় খরচ কমাতে পারেন এবং কীভাবে বিক্রি বাড়াতে পারেন?',
    frequency: 'medium',
    objective: 'দোকানের লাভ-ক্ষতির হিসাব, অপচয় রোধ, বিদ্যুতের ব্যয় হ্রাস এবং ক্রস-সেলিং কৌশল বোঝার গভীরতা।',
    modelAnswer: 'লাভ বাড়ানোর দুটি রাস্তা: আয় বৃদ্ধি এবং ব্যয় সংকোচন। ব্যয় কমাতে আমি প্রথমে অপচয় ও ড্যামেজ নিয়ন্ত্রণ করব, কারণ নষ্ট হওয়া পণ্য সরাসরি লোকসান। দ্বিতীয়ত, দোকানের ডিপ-ফ্রিজার ও আলোকসজ্জা ঠিকমতো মেইনটেন্যান্স করে বিদ্যুৎ বিল অপচয় রোধ করব (যেমন: রাতে অপ্রয়োজনীয় সাইনবোর্ড লাইট বন্ধ রাখা বা এনার্জি সেভিং লাইট ব্যবহার)। আয় বাড়ানোর ক্ষেত্রে আমি "ক্রস-সেলিং" (Cross-Selling) ও "বান্ডেল অফার" ব্যবহার করব—যেমন যে চা-পাতা কিনছে তাকে চিনি ও বিস্কুটের কথা মনে করিয়ে দেওয়া, অথবা রান্নার মসলার সাথে সয়াবিন তেলের প্যাকেজ রাখা। এছাড়া বাকির টাকা সময়মতো আদায় করে নগদ টাকায় পাইকারি বাজার থেকে ২-৩% নগদ ডিসকাউন্টে মাল কিনলে সরাসরি ক্রয় খরচ কমে ও লাভ বৃদ্ধি পায়।',
    starMethod: {
      situation: 'পূর্ববর্তী দোকানে মাসিক পরিচালন খরচ ও ড্যামেজ বেশি থাকায় মোট বিক্রির তুলনায় নিট মার্জিন কম হচ্ছিল।',
      task: 'দোকানের মাসিক নিট মুনাফা অন্তত ৩-৫% বৃদ্ধি করা।',
      action: 'আমি পাইকারি আড়ত থেকে নগদ পরিশোধের মাধ্যমে ২.৫% নগদ ক্যাশ ডিসকাউন্ট আদায় শুরু করলাম এবং কাউন্টারে স্ন্যাক্স ও চকলেট আইটেম ডিসপ্লে করে ইমপালস বাইং বাড়ালাম।',
      result: 'দোকানের সামগ্রিক মাসিক নিট মুনাফা প্রায় ৪.২% বৃদ্ধি পেল এবং নষ্টের পরিমাণ অর্ধেকে নেমে এলো।'
    },
    doTips: [
      'ক্রস-সেলিং, ইমপালস বাইং ডিসপ্লে এবং ক্যাশ পারচেজ ডিসকাউন্টের মতো স্মার্ট কৌশল বলুন।',
      'বিদ্যুৎ সাশ্রয় ও প্যাকেজিং ব্যাগের মিতব্যয়ী ব্যবহারের উদাহরণ দিন।'
    ],
    dontTips: [
      'পণ্যের দাম বাড়িয়ে অতিরিক্ত লাভ করার কথা বলা (যা খদ্দেরদের দূরে সরিয়ে দেয়)।'
    ],
    keyTerminology: ['ক্রস-সেলিং (Cross-selling)', 'ইমপালস পারচেজ', 'ক্যাশ ডিসকাউন্ট', 'গ্রস মার্জিন বনাম নিট মার্জিন']
  },
  {
    id: 'q7',
    category: 'integrity',
    categoryLabel: 'সততা ও নিয়মানুবর্তিতা',
    question: 'খুচরা ব্যবসায় প্রচুর নগদ টাকার হাতবদল হয়। আপনি কীভাবে আপনার শতভাগ আর্থিক সততা ও বিশ্বাসযোগ্যতা বজায় রাখেন?',
    frequency: 'high',
    objective: 'নৈতিক মূল্যবোধ, স্বচ্ছতা ও হালাল উপার্জনের অঙ্গীকার যাচাই করা।',
    modelAnswer: 'আমি বিশ্বাস করি যে সততা ও বিশ্বস্ততাই একজন দোকান পরিচালকের সবচেয়ে বড় মূলধন। আমার পুরো কর্মজীবনে প্রতিটি পয়সার হিসাব রাখার নীতি আমি কঠোরভাবে অনুসরণ করি। দোকানে যে কোনো লেনদেন—তা সে ১০ টাকার চকলেট বিক্রয় হোক বা ৫০,০০০ টাকার সরবরাহকারীর চালান—তা আমি সাথে সাথে ডিজিটাল পিওএস বা রেজিস্টারে নথিভুক্ত করি। কখনো কোনো অতিরিক্ত খুচরা পয়সা বা অনিবন্ধিত ক্যাশ পেলেও তা সাথে সাথে মালিককে অবগত করে "বিবিধ আয়" হিসেবে লিখে রাখি। এছাড়া ইসলামি বাণিজ্যিক সততা—যেমন ওজনে কম না দেওয়া, ভালো পণ্যের নিচে পচা পণ্য না লুকানো এবং মালিকের অনুপস্থিতিতেও একই নিষ্ঠায় দায়িত্ব পালন করাকে আমি আমার নৈতিক দায়িত্ব মনে করি।',
    starMethod: {
      situation: 'একবার এক পাইকারি সরবরাহকারী ভুলবশত চালানে অতিরিক্ত ২০ কেজি মসলা বেশি দিয়ে গিয়েছিলেন যার মূল্য ছিল প্রায় ৳৮,০০০।',
      task: 'ভুল মালামালের লোভ না করে সঠিক হিসাব রক্ষা করা।',
      action: 'আমি মাল আনলোড করার সময় নিজেই ওজন মেপে গরমিল দেখতে পাই এবং সাথে সাথে সরবরাহকারীকে ডেকে অতিরিক্ত বস্তাটি ফেরত দিই।',
      result: 'সরবরাহকারী আমাদের সততায় অত্যন্ত মুগ্ধ হয়ে পরবর্তীতে আমাদের সব চালানে বিশেষ ছাড় ও বাকির সুবিধা অনুমোদন করেন।'
    },
    doTips: [
      'স্বচ্ছ দৈনন্দিন হিসাব ও ভাউচার ব্যবস্থার কথা বলুন।',
      'ওজনে সঠিক মাপ ও নৈতিক ব্যবসার প্রতি দৃঢ় অঙ্গীকার প্রকাশ করুন।'
    ],
    dontTips: [
      'কেবল মৌখিক প্রশংসা করে হিসাব রাখার কোনো সুনির্দিষ্ট নিয়মের কথা না বলা।'
    ],
    keyTerminology: ['আর্থিক স্বচ্ছতা', 'ডিজিটাল ট্র্যাকিং', 'নৈতিক ব্যবসায়িক নীতিমালা', 'হালাল বাণিজ্য']
  }
];

export const InterviewPrepSection: React.FC<{
  candidateRole?: string;
}> = ({ candidateRole = 'সিনিয়র রিটেল স্টোর ম্যানেজার ও হিসাবরক্ষক' }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQId, setExpandedQId] = useState<string | null>('q1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // Custom AI Question Solver State
  const [customQuestionInput, setCustomQuestionInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customAiSolution, setCustomAiSolution] = useState<InterviewQnA | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // AI Mock Practice State
  const [practiceQuestion, setPracticeQuestion] = useState<string>(
    'একজন ক্রেতা এসে দাবি করলেন যে আপনার দোকান থেকে কেনা পণ্যের ওজন কম ছিল। আপনি কীভাবে শান্তভাবে পরিস্থিতি সামলাবেন?'
  );
  const [userPracticeAnswer, setUserPracticeAnswer] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    score: number;
    verdict: string;
    strengths: string[];
    improvements: string[];
    improvedVersion: string;
  } | null>(null);

  const categories = [
    { id: 'all', label: 'সব প্রশ্ন (All)' },
    { id: 'cash_due', label: 'ক্যাশ ও বাকির খাতা' },
    { id: 'inventory_stock', label: 'ইনভেন্টরি ও মেয়াদ' },
    { id: 'customer_service', label: 'গ্রাহক সেবা ও দেনদরবার' },
    { id: 'profit_cost', label: 'লাভ বৃদ্ধি ও খরচ হ্রাস' },
    { id: 'integrity', label: 'সততা ও নিয়মানুবর্তিতা' }
  ];

  const filteredQuestions = CURATED_STORE_QUESTIONS.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedQId(expandedQId === id ? null : id);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'bn-BD';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Ask AI to generate custom answer
  const handleAskAiQuestion = async (queryToAsk?: string) => {
    const q = (queryToAsk || customQuestionInput).trim();
    if (!q) return;

    setIsAiLoading(true);
    setAiError(null);
    setCustomAiSolution(null);

    try {
      const res = await fetch('/api/gemini/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'answer_question',
          question: q,
          role: candidateRole
        })
      });

      if (!res.ok) {
        throw new Error(`সার্ভার ত্রুটি: ${res.statusText}`);
      }

      const data = await res.json();
      const newSolvedQ: InterviewQnA = {
        id: `custom_${Date.now()}`,
        category: 'customer_service',
        categoryLabel: 'এআই বিশ্লেষণ',
        question: data.question || q,
        frequency: 'high',
        objective: data.objective || 'ইন্টারভিউয়ারের মূল্যায়ন উদ্দেশ্য',
        modelAnswer: data.modelAnswer || 'কোনো উত্তর পাওয়া যায়নি।',
        starMethod: data.starMethod || {
          situation: 'বাস্তব কর্মক্ষেত্রের পরিস্থিতি',
          task: 'আপনার অর্পিত দায়িত্ব',
          action: 'গৃহীত বাস্তব পদক্ষেপ',
          result: 'ইতিবাচক ফলাফল'
        },
        doTips: Array.isArray(data.doTips) ? data.doTips : ['বাস্তব অভিজ্ঞতা তুলে ধরুন'],
        dontTips: Array.isArray(data.dontTips) ? data.dontTips : ['নেতিবাচক কথা বলা পরিহার করুন'],
        keyTerminology: Array.isArray(data.keyTerminology) ? data.keyTerminology : ['দোকান খাতা', 'ক্যাশ ফ্লো']
      };

      setCustomAiSolution(newSolvedQ);
      setExpandedQId(newSolvedQ.id);
    } catch (err: any) {
      console.error('AI Interview error:', err);
      setAiError(err?.message || 'এআই উত্তর তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Evaluate user practice answer
  const handleEvaluatePractice = async () => {
    if (!userPracticeAnswer.trim()) return;

    setIsEvaluating(true);
    setEvaluationResult(null);

    try {
      const res = await fetch('/api/gemini/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'evaluate_answer',
          question: practiceQuestion,
          userAnswer: userPracticeAnswer,
          role: candidateRole
        })
      });

      if (!res.ok) {
        throw new Error('মূল্যায়ন ব্যর্থ হয়েছে।');
      }

      const data = await res.json();
      setEvaluationResult(data);
    } catch (err: any) {
      console.error('Eval error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="no-print mt-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <BrainCircuit className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>এআই পাওয়ারড ক্যারিয়ার কোচিং</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
            দোকান ব্যবসার ইন্টারভিউ প্রস্তুতি (AI Interview Prep)
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            মুদির দোকান, সুপার শপ ও রিটেল বিজনেসে ম্যানেজার বা হিসাবরক্ষক পদে চাকরি পাওয়ার জন্য সর্বাধিক জিজ্ঞাসিত প্রশ্ন, আদর্শ মডেল উত্তর (STAR Method), এবং বাস্তব কৌশল জানুন।
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs font-medium text-emerald-100 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>স্টার মেথড (STAR) গাইডলাইন</span>
            </span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs font-medium text-emerald-100 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-yellow-300" />
              <span>রিয়েল-টাইম এআই পরামর্শ</span>
            </span>
            <span className="px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs font-medium text-emerald-100 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-teal-300" />
              <span>মক টেস্ট ও স্বয়ংক্রিয় স্কোরিং</span>
            </span>
          </div>
        </div>
      </div>

      {/* AI Custom Question Solver Box */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>এআই দিয়ে যেকোনো প্রশ্নের সেরা উত্তর তৈরি করুন</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            ভূমিকা: <span className="font-bold text-emerald-700">{candidateRole}</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={customQuestionInput}
              onChange={(e) => setCustomQuestionInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAskAiQuestion();
              }}
              placeholder="যেমন: 'কাস্টমার বেশি ডিসকাউন্ট চাইলে কীভাবে বোঝাব?' অথবা নিজের কোনো প্রশ্ন লিখুন..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-hidden focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <button
            type="button"
            disabled={isAiLoading || !customQuestionInput.trim()}
            onClick={() => handleAskAiQuestion()}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
          >
            {isAiLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>এআই ভাবছে...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>উত্তর প্রস্তুত করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>জনপ্রিয় প্রশ্ন:</span>
          </span>
          {[
            'বাকির টাকা আদায়ে ব্যর্থ হলে কী পদক্ষেপ নেবেন?',
            'দোকানের কর্মী চুরি করলে কীভাবে ধরবেন ও সামলাবেন?',
            'পাইকারি আড়তদারদের থেকে নগদ ডিসকাউন্ট পাওয়ার কৌশল কী?'
          ].map((promptText, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setCustomQuestionInput(promptText);
                handleAskAiQuestion(promptText);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-[11px] text-slate-600 font-medium transition-colors cursor-pointer"
            >
              {promptText}
            </button>
          ))}
        </div>

        {/* AI Error display */}
        {aiError && (
          <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs flex items-center gap-2 border border-red-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* Custom AI Generated Solution Card */}
        {customAiSolution && (
          <div className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-300/80 shadow-md animate-in slide-in-from-top-3">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200/80 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>এআই জেনারেটেড সমাধান</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSpeak(customAiSolution.id, customAiSolution.modelAnswer)
                  }
                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors"
                  title="উত্তর শুনুন"
                >
                  {speakingId === customAiSolution.id ? (
                    <VolumeX className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleCopy(customAiSolution.id, customAiSolution.modelAnswer)
                  }
                  className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors"
                  title="উত্তর কপি করুন"
                >
                  {copiedId === customAiSolution.id ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
              ❓ {customAiSolution.question}
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-white/80 rounded-xl border border-emerald-200/60">
                <p className="text-xs font-bold text-emerald-800 mb-1 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>ইন্টারভিউয়ারের মূল উদ্দেশ্য:</span>
                </p>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {customAiSolution.objective}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>আদর্শ উত্তর (STAR উপস্থাপনা):</span>
                </p>
                <p className="text-slate-800 leading-relaxed p-3.5 bg-white rounded-xl border border-slate-200 text-xs sm:text-[13px] text-justify font-normal">
                  {customAiSolution.modelAnswer}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-emerald-100/50 rounded-xl border border-emerald-200">
                  <p className="text-xs font-bold text-emerald-900 mb-1">✅ যা যা বলা উচিত:</p>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {customAiSolution.doTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-xs font-bold text-red-900 mb-1">❌ যা বলা পরিহার করবেন:</p>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {customAiSolution.dontTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-xs font-bold text-slate-600">মূল টার্মস:</span>
                {customAiSolution.keyTerminology.map((term, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Categorized Curated Questions & Model Answers */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>দোকান ব্যবসার কমন ইন্টারভিউ প্রশ্ন ও আদর্শ উত্তর</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              মুদির দোকান ও সুপার শপ পরিচালনায় সবচেয়ে বেশি জিজ্ঞাসিত বাস্তব প্রশ্ন ও স্টার (STAR) ফ্রেমওয়ার্ক
            </p>
          </div>

          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 self-start sm:self-auto">
            {filteredQuestions.length}টি প্রশ্ন সংগৃহীত
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Question Cards Accordion List */}
        <div className="space-y-3.5">
          {filteredQuestions.map((item, index) => {
            const isExpanded = expandedQId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isExpanded
                    ? 'border-emerald-500 bg-emerald-50/15 ring-2 ring-emerald-500/10 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Accordion Question Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.categoryLabel}
                        </span>
                        {item.frequency === 'high' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>কমন প্রশ্ন</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug">
                        {item.question}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Answer Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-slate-100 space-y-4 text-xs sm:text-sm animate-in fade-in">
                    {/* Goal of Interviewer */}
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                      <p className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-amber-600" />
                        <span>ইন্টারভিউয়ার এই প্রশ্নে কী দেখতে চান?</span>
                      </p>
                      <p className="text-xs text-amber-950 leading-relaxed">
                        {item.objective}
                      </p>
                    </div>

                    {/* Ideal Model Answer */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <p className="font-bold text-slate-900 flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-emerald-600" />
                          <span>আদর্শ উত্তর (Model Answer in Bengali):</span>
                        </p>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleSpeak(item.id, item.modelAnswer)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center gap-1 border border-slate-200 transition-colors"
                            title="উত্তরটি বাংলায় শুনুন"
                          >
                            {speakingId === item.id ? (
                              <>
                                <VolumeX className="w-3.5 h-3.5 text-emerald-600" />
                                <span>থামান</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>শুনুন</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleCopy(item.id, item.modelAnswer)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 flex items-center gap-1 border border-slate-200 transition-colors"
                          >
                            {copiedId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span>কপি হয়েছে</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>কপি</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setPracticeQuestion(item.question);
                              setUserPracticeAnswer('');
                              setEvaluationResult(null);
                              // Smooth scroll to practice box
                              const el = document.getElementById('mock-practice-box');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>নিজে প্র্যাকটিস করুন</span>
                          </button>
                        </div>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-slate-200 leading-relaxed text-slate-800 text-xs sm:text-[13px] text-justify shadow-2xs font-normal">
                        {item.modelAnswer}
                      </div>
                    </div>

                    {/* STAR Method Breakdown */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                      <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        <span>স্টার মেথড ব্রেকডাউন (STAR Framework):</span>
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs">
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-emerald-700 block mb-0.5">
                            S - পরিস্থিতি (Situation):
                          </span>
                          <span className="text-slate-600 leading-snug">
                            {item.starMethod.situation}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-blue-700 block mb-0.5">
                            T - দায়িত্ব (Task):
                          </span>
                          <span className="text-slate-600 leading-snug">
                            {item.starMethod.task}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-purple-700 block mb-0.5">
                            A - পদক্ষেপ (Action):
                          </span>
                          <span className="text-slate-600 leading-snug">
                            {item.starMethod.action}
                          </span>
                        </div>
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                          <span className="font-bold text-teal-700 block mb-0.5">
                            R - ফলাফল (Result):
                          </span>
                          <span className="text-slate-600 leading-snug">
                            {item.starMethod.result}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Winning Do's and Pitfalls */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <p className="font-bold text-emerald-900 mb-1.5">
                          ✅ যা বললে ইন্টারভিউয়ার সন্তুষ্ট হবেন:
                        </p>
                        <ul className="space-y-1 text-slate-700">
                          {item.doTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-emerald-600 font-bold">✓</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                        <p className="font-bold text-red-900 mb-1.5">
                          ❌ যা ভুলেও বলতে যাবেন না (রেড ফ্ল্যাগ):
                        </p>
                        <ul className="space-y-1 text-slate-700">
                          {item.dontTips.map((tip, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 leading-snug">
                              <span className="text-red-500 font-bold">✗</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Keywords Tagging */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-xs font-bold text-slate-500">
                        গুরুত্বপূর্ণ টার্মস:
                      </span>
                      {item.keyTerminology.map((term, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Mock Interview & Evaluation Section */}
      <div
        id="mock-practice-box"
        className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-800">
                ইন্টারভিউ প্র্যাকটিস ও এআই মূল্যায়ন (AI Mock Evaluation)
              </h3>
              <p className="text-xs text-slate-500">
                নিচে আপনার উত্তর লিখুন এবং এআই থেকে ১০-এ রেটিং ও উন্নতির পরামর্শ পান
              </p>
            </div>
          </div>

          <span className="text-xs font-bold text-purple-800 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
            রিয়েল-টাইম ফিডব্যাক
          </span>
        </div>

        {/* Selected Practice Question */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="block text-xs font-bold text-slate-500 mb-1">
            অনুশীলনের প্রশ্ন (Practice Question):
          </label>
          <input
            type="text"
            value={practiceQuestion}
            onChange={(e) => setPracticeQuestion(e.target.value)}
            className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 outline-hidden focus:border-purple-500"
          />
        </div>

        {/* User Answer Textarea */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-700">আপনার মুখস্থ বা নিজস্ব উত্তর লিখুন:</span>
            <span>{userPracticeAnswer.length} অক্ষর</span>
          </div>

          <textarea
            rows={4}
            value={userPracticeAnswer}
            onChange={(e) => setUserPracticeAnswer(e.target.value)}
            placeholder="যেমন: আমি প্রথমে ক্রেতাকে শান্ত করব এবং বলব যে আমরা বিষয়টির সত্যতা যাচাই করছি। এরপর ডিজিটাল স্কেলে ওজন মেপে যদি দেখি কম হয়েছে, সাথে সাথে ক্ষমা চেয়ে নতুন প্যাকেট বদলে দেব..."
            className="w-full p-3.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={isEvaluating || !userPracticeAnswer.trim()}
            onClick={handleEvaluatePractice}
            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-md shadow-purple-600/20 active:scale-95"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>এআই মূল্যায়ন করছে...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4" />
                <span>আমার উত্তর মূল্যায়ন করুন</span>
              </>
            )}
          </button>
        </div>

        {/* Evaluation Output Card */}
        {evaluationResult && (
          <div className="p-5 bg-gradient-to-r from-purple-50/60 to-indigo-50/40 rounded-2xl border border-purple-200 shadow-sm space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-purple-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-purple-600 text-white text-xs font-black">
                  স্কোর: {evaluationResult.score}/১০
                </span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {evaluationResult.verdict}
                </span>
              </div>

              <span className="text-xs text-purple-700 font-medium">
                এআই অডিট রিপোর্ট
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-emerald-200">
                <p className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>উত্তরের সবল দিক (Strengths):</span>
                </p>
                <ul className="space-y-1 text-slate-700">
                  {evaluationResult.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200">
                <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>যেখানে আরও উন্নতি প্রয়োজন:</span>
                </p>
                <ul className="space-y-1 text-slate-700">
                  {evaluationResult.improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-purple-200">
              <p className="text-xs font-bold text-purple-900 mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>এআই পরিমার্জিত আদর্শ উত্তর (Improved Version):</span>
              </p>
              <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
                {evaluationResult.improvedVersion}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
