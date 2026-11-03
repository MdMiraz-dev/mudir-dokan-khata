import { Product, Customer, MasalaRule, ShopSettings, Expense, Sale } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Miniket Rice (মিনিকেট চাল)',
    banglaName: 'মিনিকেট চাল প্রিমিয়াম',
    category: 'rice_flour',
    costPrice: 65,
    sellingPrice: 72,
    stock: 150,
    unit: 'kg',
    minStock: 30,
    barcode: '8901001',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-2',
    name: 'Nazirshail Rice (নাজিরশাইল চাল)',
    banglaName: 'নাজিরশাইল চাল স্পেশাল',
    category: 'rice_flour',
    costPrice: 74,
    sellingPrice: 82,
    stock: 120,
    unit: 'kg',
    minStock: 25,
    barcode: '8901002',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-3',
    name: 'Red Lentils (দেশি মসুর ডাল)',
    banglaName: 'দেশি চিকন মসুর ডাল',
    category: 'rice_flour',
    costPrice: 130,
    sellingPrice: 145,
    stock: 60,
    unit: 'kg',
    minStock: 15,
    barcode: '8901003',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-4',
    name: 'Rupchanda Soybean Oil 1L (সয়াবিন তেল)',
    banglaName: 'রূপচাঁদা বোতলজাত সয়াবিন তেল ১ লিটার',
    category: 'oil_ghee',
    costPrice: 168,
    sellingPrice: 180,
    stock: 45,
    unit: 'litre',
    minStock: 10,
    barcode: '8901004',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-5',
    name: 'Teer White Sugar (তীর চিনি)',
    banglaName: 'তীর ফ্রেশ প্যাকেট চিনি ১ কেজি',
    category: 'sugar_tea',
    costPrice: 132,
    sellingPrice: 142,
    stock: 80,
    unit: 'kg',
    minStock: 20,
    barcode: '8901005',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-6',
    name: 'Local Onion (দেশি পেঁয়াজ)',
    banglaName: 'পাবনার দেশি লাল পেঁয়াজ',
    category: 'spices_salt',
    costPrice: 85,
    sellingPrice: 100,
    stock: 90,
    unit: 'kg',
    minStock: 20,
    barcode: '8901006',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-7',
    name: 'Munshiganj Potato (আলু)',
    banglaName: 'মুন্সীগঞ্জের ডায়মন্ড গোল আলু',
    category: 'spices_salt',
    costPrice: 42,
    sellingPrice: 50,
    stock: 180,
    unit: 'kg',
    minStock: 35,
    barcode: '8901007',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-8',
    name: 'Farm Red Eggs 4pcs (লাল ডিম হালি)',
    banglaName: 'লেয়ার মুরগির লাল ডিম (প্রতি হালি)',
    category: 'dairy_beverage',
    costPrice: 46,
    sellingPrice: 52,
    stock: 120,
    unit: 'piece',
    minStock: 24,
    barcode: '8901008',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-9',
    name: 'Ispahani Mirzapore Tea 400g (চা পাতা)',
    banglaName: 'ইস্পাহানি মির্জাপুর বেস্ট ব্লেন্ড চা পাতা ৪০০ গ্রাম',
    category: 'sugar_tea',
    costPrice: 215,
    sellingPrice: 240,
    stock: 30,
    unit: 'packet',
    minStock: 8,
    barcode: '8901009',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-10',
    name: 'ACI Pure Salt 1kg (আয়োডিনযুক্ত লবণ)',
    banglaName: 'এসিআই পিওর ভ্যাকুয়াম লবণ ১ কেজি',
    category: 'spices_salt',
    costPrice: 38,
    sellingPrice: 42,
    stock: 65,
    unit: 'packet',
    minStock: 15,
    barcode: '8901010',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-11',
    name: 'Wheel Detergent Powder 1kg (হুইল ডিটারজেন্ট)',
    banglaName: 'হুইল টু ইন ওয়ান ওয়াশিং পাউডার ১ কেজি',
    category: 'soap_detergent',
    costPrice: 125,
    sellingPrice: 140,
    stock: 40,
    unit: 'packet',
    minStock: 10,
    barcode: '8901011',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prod-12',
    name: 'Lux Beauty Soap 100g (লাক্স সাবান)',
    banglaName: 'লাক্স সফট টাচ গোলাপ সাবান ১০০ গ্রাম',
    category: 'personal_care',
    costPrice: 54,
    sellingPrice: 62,
    stock: 50,
    unit: 'piece',
    minStock: 12,
    barcode: '8901012',
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'রফিকুল ইসলাম',
    phone: '01711223344',
    address: 'বাড়ি নং ১২, উত্তরপাড়া বাজার',
    totalDue: 2450,
    lastTransactionDate: new Date(Date.now() - 14 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: 'cust-2',
    name: 'মাওলানা আব্দুল হাকিম',
    phone: '01819887766',
    address: 'মাদরাসা রোড, পূর্বপাড়া',
    totalDue: 1280,
    lastTransactionDate: new Date(Date.now() - 5 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 45 * 86400000).toISOString()
  },
  {
    id: 'cust-3',
    name: 'আকবর হোসেন (মাস্টার সাহেব)',
    phone: '01912334455',
    address: 'স্কুল রোড, মধ্যপাড়া',
    totalDue: 3800,
    lastTransactionDate: new Date(Date.now() - 25 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 90 * 86400000).toISOString()
  },
  {
    id: 'cust-4',
    name: 'সোহেল রানা',
    phone: '01677665544',
    address: 'শান্তিনগর মোড়',
    totalDue: 0,
    lastTransactionDate: new Date(Date.now() - 2 * 86400000).toISOString(),
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'দোকান ভাড়া (চলতি মাস)',
    category: 'rent',
    amount: 6000,
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    notes: 'মার্কেট মালিককে ক্যাশে পরিশোধ'
  },
  {
    id: 'exp-2',
    title: 'পল্লি বিদ্যুৎ বিল',
    category: 'electricity',
    amount: 1850,
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    notes: 'বিকাশের মাধ্যমে পরিশোধ'
  },
  {
    id: 'exp-3',
    title: 'আড়ত থেকে মালামাল ভ্যান ভাড়া',
    category: 'transport',
    amount: 450,
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    notes: 'চাল ও তেলের বস্তা পরিবহন'
  }
];

export const INITIAL_MASALA_RULES: MasalaRule[] = [
  {
    id: 'masala-1',
    title: 'ওজন ও পরিমাপে সঠিকতা বজায় রাখা',
    details: 'ব্যবসা-বাণিজ্যে দাঁড়িপাল্লা বা ডিজিটাল স্কেলে যথাযথ ওজন দেওয়া বাধ্যতামূলক। ওজনে সামান্যতম কম দেওয়াও মারাত্মক কবিরা গুনাহ। আল্লাহ তাআলা বলেন: "তোমরা মাপে পূর্ণ দাও এবং পরিমাপে লোকদের ক্ষতিসাধন কোরো না।"',
    source: 'সূরা আশ-শুআরা: ১৮১-১৮২; সূরা আল-মুতাফফিফিন: ১-৩',
    category: 'weight_measure'
  },
  {
    id: 'masala-2',
    title: 'বাকির হিসাব লিখিত রাখা ও সাক্ষী রাখা',
    details: 'কোরআনের সবচেয়ে বড় আয়াতে নির্দেশ দেওয়া হয়েছে যে কোনো বাকি বা ঋণের লেনদেন হলে তা স্পষ্ট করে লিখে রাখা এবং প্রয়োজনে সাক্ষী রাখা। এতে ভুল বোঝাবুঝি ও বিবাদ দূর হয়।',
    source: 'সূরা আল-বাকারাহ: আয়াত ২৮২ (আয়াতুদ দাইয়ন)',
    category: 'due_repayment'
  },
  {
    id: 'masala-3',
    title: 'পণ্যের দোষ-ত্রুটি গোপন না করা ও ভেজাল মুক্ত রাখা',
    details: 'রাসূলুল্লাহ (সা.) ইরশাদ করেছেন: "যে ব্যক্তি আমাদের সাথে প্রতারণা করে বা ভেজাল দেয়, সে আমার উম্মতের অন্তর্ভুক্ত নয়।" পণ্যের কোনো খুঁত থাকলে তা বিক্রয়ের সময় ক্রেতাকে পরিষ্কার বলে দেওয়া ওয়াজিব।',
    source: 'সহিহ মুসলিম: ১০২; সুনানে তিরমিযী',
    category: 'truthfulness'
  },
  {
    id: 'masala-4',
    title: 'অতিরিক্ত মুনাফার জন্য নিত্যপ্রয়োজনীয় পণ্য মজুদদারি (ইহতিকার) নিষিদ্ধ',
    details: 'বাজার কৃত্রিমভাবে চড়া করে সাধারণ মানুষকে কষ্টে ফেলে অধিক মুনাফা লাভের উদ্দেশ্যে খাদ্যশস্য বা নিত্যপণ্য আটকে রাখা ইসলামে কঠোরভাবে নিষিদ্ধ ও অভিশপ্ত কাজ।',
    source: 'সহিহ মুসলিম: ১৬০৫; ইবনে মাজাহ: ২১৫৩',
    category: 'hoarding_monopoly'
  },
  {
    id: 'masala-5',
    title: 'সামর্থ্যবান গ্রাহকের বাকি পরিশোধে গড়িমসি করা জুলুম',
    details: 'রাসূলুল্লাহ (সা.) বলেছেন: "ধনী বা সামর্থ্যবান ব্যক্তির পাওনা পরিশোধে অযথা বিলম্ব করা জুলুম।" তবে ঋণগ্রহীতা অসচ্ছল ও নিরুপায় হলে তাকে সময় দেওয়া বা কিছু ছাড় দেওয়া অত্যন্ত সওয়াবের কাজ।',
    source: 'সহিহ বুখারী: ২৪০০; সহিহ মুসলিম: ১৫৬৪',
    category: 'due_repayment'
  }
];

export const DEFAULT_SETTINGS: ShopSettings = {
  shopName: 'বিসমিল্লাহ জেনারেল স্টোর ও ডিপার্টমেন্টাল শপ',
  ownerName: 'মেরাজুল ইসলাম',
  founderName: 'মেরাজুল ইসলাম (Merajul Islam)',
  founderRole: 'এআই ও এআই অটোমেশন স্পেশালিস্ট, সফটওয়্যার ডেভেলপার এবং প্রতিষ্ঠাতা',
  founderLocation: 'আশুগঞ্জ, ব্রাহ্মণবাড়িয়া, বাংলাদেশ',
  founderEducationIslamic: 'দাওরায়ে হাদিস — জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা, ঢাকা',
  founderEducationGeneral: 'টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা, আউড়া, ব্রাহ্মণবাড়িয়া',
  founderInstitute: 'আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট (As-Sunnah Skill Development Institute)',
  founderSkills: 'এআই ও এআই অটোমেশন (AI Automation), ফুলস্ট্যাক সফটওয়্যার ডেভেলপমেন্ট ও বিজনেস সিস্টেমস',
  founderBio: 'মেরাজুল ইসলামের বাড়ি ব্রাহ্মণবাড়িয়ার আশুগঞ্জে। তিনি ঢাকার ঐতিহ্যবাহী জামিয়া আরাবিয়া ইমদাদুল উলুম ফরিদাবাদ মাদ্রাসা থেকে দাওরায়ে হাদিস এবং ব্রাহ্মণবাড়িয়ার আউড়ার টঙ্গী সাদেকুল উলুম ফাজিল মাদ্রাসা থেকে শিক্ষা লাভ করেছেন। পাশাপাশি তিনি আস-সুন্নাহ স্কিল ডেভেলপমেন্ট ইনস্টিটিউট থেকে প্রশিক্ষণপ্রাপ্ত একজন দক্ষ এআই, এআই অটোমেশন ও সফটওয়্যার ডেভেলপার। দেশের মুদি দোকানদার ও ব্যবসায়ীদের প্রতিদিনের বেচাকেনা ও বাকির হিসাব সহজ, স্বচ্ছ ও আধুনিক করার জন্য তিনি এই অ্যাপটি প্রতিষ্ঠা করেছেন।',
  founderPhone: '০১৭১১-০০০০০০',
  founderFatherName: 'মো. আব্দুল কাদির',
  founderFacebook: 'https://www.facebook.com/mdmiraz.dev',
  founderWebsite: 'https://mdmiraz-dev.github.io/',
  founderYouTube: 'https://youtube.com/@mdmiraz-489?si=FuDX4kA1f76NZbMB',
  founderGitHub: 'https://github.com/MdMiraz-dev',
  founderHonor: 'নবীন আলেম সংবর্ধনা ও সম্মাননা স্মারক (আইইবি মিলনায়তন, রমনা, ঢাকা)',
  founderPhotoUrl: '/merajul-islam.jpg',
  phone: '01700000000',
  address: 'বাজার রোড, ধানমন্ডি, ঢাকা',
  currency: '৳',
  language: 'bn',
  colorTheme: 'caramel',
  pinLockEnabled: false,
  pinCode: '',
  voiceGender: 'male', // Always male voice by default
  voiceAutoSpeak: true,
  lowStockAlert: true,
  printThermalReceipt: true,
  smsSenderName: 'BISMILLAH STORE'
};
