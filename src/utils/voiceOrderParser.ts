import { UnitType } from '../types';

export interface ParsedVoiceItem {
  raw: string;
  productQuery: string;
  quantity: number;
  unit: UnitType;
}

// Convert Bengali numerals to English numerals
export const banglaToEnglishNumber = (str: string): string => {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return str.replace(/[০-৯]/g, (match) => banglaDigits.indexOf(match).toString());
};

// Map Bengali word numbers to numerical values
const BANGLA_WORD_NUMBERS: Record<string, number> = {
  'আধা': 0.5,
  'হাফ': 0.5,
  'দেড়': 1.5,
  'দেড়': 1.5,
  'আড়াই': 2.5,
  'আড়াই': 2.5,
  'পৌনে এক': 0.75,
  'সোয়া এক': 1.25,
  'এক': 1,
  'দুই': 2,
  'তিন': 3,
  'চার': 4,
  'পাঁচ': 5,
  'ছয়': 6,
  'ছয়': 6,
  'সাত': 7,
  'আট': 8,
  'নয়': 9,
  'নয়': 9,
  'দশ': 10,
  'এগারো': 11,
  'বারো': 12,
  'বিশ': 20,
  'পঁচিশ': 25,
  'পঞ্চাশ': 50,
  'একশো': 100,
  'একশ': 100,
  'দেড়শো': 150,
  'দেড়শো': 150,
  'দুইশো': 200,
  'দুইশ': 200,
  'আড়াইশো': 250,
  'আড়াইশো': 250,
  'পাঁচশো': 500,
  'পাঁচশ': 500
};

export const parseVoiceCommand = (transcript: string): ParsedVoiceItem | null => {
  if (!transcript || !transcript.trim()) return null;

  let text = transcript.toLowerCase().trim();
  text = banglaToEnglishNumber(text);

  // Remove common polite prefix phrases
  text = text.replace(/^(দয়া করে|দয়া করে|প্লিজ|please|add|যোগ কর|যোগ করুন|আমাকে|দাও|দেও|দেন)\s+/i, '');

  // Remove trailing politeness / request verbs
  text = text.replace(/\s+(দাও|দেও|দেন|রাখেন|রাখো|নিব|নেব|চাই|লাগবে|যোগ করো|যোগ করুন|অর্ডার করো)$/i, '').trim();

  // Helper to parse unit string into standard UnitType and multiplier
  const parseUnit = (rawUnit: string, qty: number): { unit: UnitType; adjustedQty: number } => {
    const u = rawUnit.toLowerCase();
    if (u.includes('কেজি') || u === 'kg' || u === 'kilogram') {
      return { unit: 'kg', adjustedQty: qty };
    }
    if (u.includes('গ্রাম') || u === 'gm' || u === 'g' || u === 'gram') {
      return { unit: 'gm', adjustedQty: qty };
    }
    if (u.includes('লিটার') || u.includes('লিতার') || u === 'litre' || u === 'l' || u === 'liter') {
      return { unit: 'litre', adjustedQty: qty };
    }
    if (u.includes('মিলি') || u === 'ml') {
      return { unit: 'ml', adjustedQty: qty };
    }
    if (u.includes('প্যাকেট') || u.includes('packet') || u.includes('প্যাক') || u.includes('বক্স') || u.includes('box')) {
      return { unit: 'packet', adjustedQty: qty };
    }
    if (u.includes('ডজন') || u.includes('dozen')) {
      return { unit: 'piece', adjustedQty: qty * 12 };
    }
    if (u.includes('হালি')) {
      return { unit: 'piece', adjustedQty: qty * 4 };
    }
    if (u.includes('পিস') || u.includes('টা') || u.includes('টি') || u.includes('piece') || u.includes('pcs')) {
      return { unit: 'piece', adjustedQty: qty };
    }
    return { unit: 'kg', adjustedQty: qty };
  };

  const unitRegexPart = '(?:kg|কেজি|গ্রাম|গ্রামের|gm|g|লিটার|লিতার|litre|liter|l|মিলি|ml|প্যাকেট|packet|প্যাক|ডজন|dozen|হালি|পিস|টা|টি|piece|pcs|বক্স|box)';

  // Replace Bengali word numbers if present before or after units
  for (const [word, val] of Object.entries(BANGLA_WORD_NUMBERS)) {
    // Replace full word with digits
    const wordPattern = new RegExp(`(^|\\s)${word}(\\s|$)`, 'i');
    if (wordPattern.test(text)) {
      text = text.replace(wordPattern, `$1${val}$2`).trim();
      break;
    }
  }

  // Pattern 1: Quantity + Unit + Product (e.g. "2 kg rice", "500 gm চিনি", "১ লিটার তেল")
  const pattern1 = new RegExp(`^([\\d.]+)\\s*(${unitRegexPart})?\\s+(.+)$`, 'i');
  const match1 = text.match(pattern1);
  if (match1) {
    const rawQty = parseFloat(match1[1]) || 1;
    const rawUnit = match1[2] || (rawQty < 10 && !match1[2] ? 'piece' : 'kg');
    const { unit, adjustedQty } = parseUnit(rawUnit, rawQty);
    let productQuery = match1[3].replace(/^(এর|টা|টি|দাও|যোগ করো|যোগ করুন)\s+/i, '').trim();

    return {
      raw: transcript,
      productQuery,
      quantity: adjustedQty,
      unit
    };
  }

  // Pattern 2: Product + Quantity + Unit (e.g. "চিনি ২ কেজি", "সয়াবিন তেল ১ লিটার", "ডিম ২ হালি", "লবণ ১ প্যাকেট")
  const pattern2 = new RegExp(`^(.+?)\\s+([\\d.]+)\\s*(${unitRegexPart})?$`, 'i');
  const match2 = text.match(pattern2);
  if (match2) {
    const productQuery = match2[1].replace(/^(এর|টা|টি)\s+/i, '').trim();
    const rawQty = parseFloat(match2[2]) || 1;
    const rawUnit = match2[3] || 'piece';
    const { unit, adjustedQty } = parseUnit(rawUnit, rawQty);

    return {
      raw: transcript,
      productQuery,
      quantity: adjustedQty,
      unit
    };
  }

  // Fallback: If no number found, assume 1 unit of product
  return {
    raw: transcript,
    productQuery: text,
    quantity: 1,
    unit: 'piece'
  };
};
