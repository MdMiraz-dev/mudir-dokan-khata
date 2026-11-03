export type UnitType = 'kg' | 'gm' | 'litre' | 'ml' | 'packet' | 'piece' | 'dozen';

export type ProductCategory =
  | 'rice_flour'       // চাল, ডাল ও আটা
  | 'oil_ghee'          // তেল ও ঘি
  | 'spices_salt'       // মসলা ও লবণ
  | 'sugar_tea'         // চিনি ও চা পাতা
  | 'snacks_biscuits'   // বিস্কুট ও চানাচুর
  | 'dairy_beverage'    // দুধ ও পানীয়
  | 'soap_detergent'    // সাবান ও ওয়াশিং
  | 'personal_care'     // প্রসাধন ও যত্ন
  | 'other';            // অন্যান্য

export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  category: ProductCategory;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  unit: UnitType;
  minStock: number;
  barcode?: string;
  image?: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  totalDue: number;
  lastTransactionDate: string;
  createdAt: string;
}

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  unit: UnitType;
  unitPrice: number;
  totalPrice: number;
  costPrice?: number;
}

export type PaymentMethod = 'cash' | 'bkash' | 'nagad' | 'due' | 'mixed';

export interface Sale {
  id: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paid: number;
  due: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO String
  notes?: string;
  profit?: number;
}

export interface DueTransaction {
  id: string;
  customerId: string;
  type: 'sale_due' | 'payment_received' | 'adjustment' | 'manual_due';
  amount: number;
  previousDue: number;
  remainingDue: number;
  date: string;
  saleId?: string;
  notes?: string;
}

export type ExpenseCategory =
  | 'rent'
  | 'electricity'
  | 'transport'
  | 'staff'
  | 'packaging'
  | 'tea_snacks'
  | 'repair'
  | 'other';

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

export interface MasalaRule {
  id: string;
  title: string;
  details: string;
  source: string;
  category: 'weight_measure' | 'due_repayment' | 'hoarding_monopoly' | 'truthfulness' | 'general';
}

export interface ShopSettings {
  shopName: string;
  ownerName: string;
  founderName?: string;
  founderRole?: string;
  founderBio?: string;
  founderPhone?: string;
  founderLocation?: string;
  founderEducationIslamic?: string;
  founderEducationGeneral?: string;
  founderInstitute?: string;
  founderSkills?: string;
  founderFacebook?: string;
  founderWebsite?: string;
  founderYouTube?: string;
  founderGitHub?: string;
  founderFatherName?: string;
  founderHonor?: string;
  founderPhotoUrl?: string;
  phone: string;
  address: string;
  currency: string;
  language: 'bn' | 'en';
  colorTheme: 'caramel' | 'emerald' | 'blue' | 'indigo' | 'amber' | 'slate' | 'pinterest';
  pinLockEnabled: boolean;
  pinCode?: string;
  voiceGender: 'male' | 'female';
  voiceAutoSpeak: boolean;
  lowStockAlert: boolean;
  printThermalReceipt: boolean;
  smsSenderName?: string;
}

export interface ScannedProductRecord {
  id: string;
  name: string;
  banglaName?: string;
  sellingPrice?: number;
  costPrice?: number;
  category?: ProductCategory;
  unit?: UnitType;
  barcode?: string;
  scannedAt: string;
  imageThumbnail?: string;
  status: 'added' | 'pending';
}
