import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Minus,
  Trash2,
  ShoppingCart,
  Mic,
  Barcode,
  User,
  CreditCard,
  CheckCircle,
  Receipt,
  X,
  Sparkles,
  Star,
  Heart,
  Bookmark,
  Send,
  MessageSquare,
  Compass,
  ArrowRight,
  ShieldCheck,
  Check,
  Clock,
  Layers,
  Sparkle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useKhata } from '../context/KhataContext';
import { Product, Customer, PaymentMethod, Sale } from '../types';

interface POSViewProps {
  onSaleCompleted: (sale: Sale) => void;
}

export const POSView: React.FC<POSViewProps> = ({ onSaleCompleted }) => {
  const {
    products,
    customers,
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    addSale,
    settings,
    setIsVoiceCartOpen
  } = useKhata();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [discountAmount, setDiscountAmount] = useState<string>('0');
  const [paidAmountInput, setPaidAmountInput] = useState<string>('');
  const [viewStyle, setViewStyle] = useState<'pinterest' | 'standard'>('pinterest');

  // Categories list with aesthetic emoji / icons
  const categories = [
    { id: 'all', label: 'সব পণ্য', emoji: '📦', count: products.length },
    { id: 'rice_flour', label: 'চাল ও ডাল', emoji: '🌾', count: products.filter(p => p.category === 'rice_flour').length },
    { id: 'oil_ghee', label: 'তেল ও ঘি', emoji: '🛢️', count: products.filter(p => p.category === 'oil_ghee').length },
    { id: 'spices_salt', label: 'মসলা ও লবণ', emoji: '🌶️', count: products.filter(p => p.category === 'spices_salt').length },
    { id: 'sugar_tea', label: 'চিনি ও চা', emoji: '☕', count: products.filter(p => p.category === 'sugar_tea').length },
    { id: 'snacks_biscuits', label: 'বিস্কুট', emoji: '🍪', count: products.filter(p => p.category === 'snacks_biscuits').length },
    { id: 'soap_detergent', label: 'সাবান', emoji: '🧼', count: products.filter(p => p.category === 'soap_detergent').length }
  ];

  // Helper for product category visual badge
  const getProductCategoryVisual = (category: string) => {
    switch (category) {
      case 'rice_flour':
        return { bg: 'from-[#FDF7ED] to-[#F5EFEB]', text: 'text-amber-800', emoji: '🌾', label: 'চাল ও ডাল' };
      case 'oil_ghee':
        return { bg: 'from-[#FFF9ED] to-[#FAEDE0]', text: 'text-orange-800', emoji: '🛢️', label: 'তেল ও ঘি' };
      case 'spices_salt':
        return { bg: 'from-[#FDF2F0] to-[#F9E6E2]', text: 'text-rose-800', emoji: '🌶️', label: 'মসলা ও লবণ' };
      case 'sugar_tea':
        return { bg: 'from-[#F2F8F4] to-[#E5EFE9]', text: 'text-emerald-800', emoji: '☕', label: 'চিনি ও চা' };
      case 'snacks_biscuits':
        return { bg: 'from-[#FAF5EF] to-[#EFE7DC]', text: 'text-amber-900', emoji: '🍪', label: 'বিস্কুট' };
      case 'soap_detergent':
        return { bg: 'from-[#F0F6FB] to-[#E2EEF8]', text: 'text-blue-800', emoji: '🧼', label: 'সাবান' };
      default:
        return { bg: 'from-[#F7F4F0] to-[#EFEBE5]', text: 'text-stone-800', emoji: '📦', label: 'মুদি পণ্য' };
    }
  };

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode && p.barcode.includes(searchQuery));
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  // Cart calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.totalPrice, 0);
  }, [cart]);

  const discount = parseFloat(discountAmount) || 0;
  const grandTotal = Math.max(0, subtotal - discount);

  // Default paid amount is grand total if cash/bkash, or 0 if due
  const paid = paidAmountInput !== '' ? parseFloat(paidAmountInput) || 0 : (paymentMethod === 'due' ? 0 : grandTotal);
  const due = Math.max(0, grandTotal - paid);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId);

  // Complete Order
  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    if (due > 0 && !selectedCustomerId) {
      alert('বাকি বিক্রয়ের ক্ষেত্রে অবশ্যই একজন নির্দিষ্ট গ্রাহক নির্বাচন করতে হবে!');
      return;
    }

    const newSale = addSale({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      customerPhone: selectedCustomer?.phone,
      items: [...cart],
      subtotal,
      discount,
      total: grandTotal,
      paid,
      due,
      paymentMethod,
      profit: grandTotal - cart.reduce((c, it) => c + (it.costPrice || it.unitPrice * 0.85) * it.quantity, 0)
    });

    // Trigger Confetti celebration
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.7 }
      });
    } catch (e) {}

    // Reset checkout form
    setDiscountAmount('0');
    setPaidAmountInput('');
    setSelectedCustomerId('');
    setPaymentMethod('cash');

    onSaleCompleted(newSale);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* ========================================================================= */}
      {/* PINTEREST LUXURY AESTHETIC POSTER BANNER (Header from Reference Image)    */}
      {/* ========================================================================= */}
      {viewStyle === 'pinterest' && (
        <div className="text-center bg-[#FAF6F0] border border-[#E8DFD5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
          {/* Subtle Top 4-Point Star Motif */}
          <div className="flex items-center justify-center gap-2 mb-2 text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase text-[#8C6546]">
            <span>✦</span>
            <span>DESIGN WITH EMPATHY • FRESH GROCERY & FAIR PRICE</span>
            <span>✦</span>
          </div>

          {/* Grand Editorial Serif Title with Cleanly Separated Subtitle */}
          <div className="flex flex-col items-center justify-center py-1">
            <h1
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-[#221F1D] tracking-tight leading-tight uppercase"
            >
              STORE PRODUCTS
            </h1>
            <p
              style={{ fontFamily: "'Great Vibes', cursive, 'Playfair Display', serif" }}
              className="text-xl sm:text-3xl text-[#8C6546] font-normal mt-1 sm:mt-1.5"
            >
              Fresh & Halal Selection
            </p>
          </div>

          {/* Poster Subtitle */}
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-[#7A6E65] uppercase mt-2 max-w-xl mx-auto">
            CRAFTING EXCELLENT STORE EXPERIENCES THAT CUSTOMERS TRUST & LOVE
          </p>

          <div className="w-16 h-0.5 bg-[#DEC8B3] mx-auto mt-3" />
        </div>
      )}

      {/* Main Grid: Products Showcase (7 Cols) & Cart / Checkout (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: PINTEREST PRODUCT SHOWCASE MOCKUP (7 Cols)                    */}
        {/* ========================================================================= */}
        <div className="lg:col-span-7 space-y-5">
          {/* View Toggle Bar & Quick Stats */}
          <div className="flex items-center justify-between bg-white p-2.5 sm:p-3 rounded-2xl border border-[#E8DFD5] shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#221F1D]">প্রদর্শন স্টাইল:</span>
              <div className="flex items-center bg-[#FAF6F0] p-1 rounded-xl border border-[#E8DFD5] text-xs">
                <button
                  type="button"
                  onClick={() => setViewStyle('pinterest')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    viewStyle === 'pinterest'
                      ? 'bg-[#A57D5C] text-white shadow-2xs'
                      : 'text-[#7A6E65] hover:text-[#221F1D]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>✦ Pinterest Aesthetic</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewStyle('standard')}
                  className={`px-3 py-1 rounded-lg font-bold transition-all ${
                    viewStyle === 'standard'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-[#7A6E65] hover:text-[#221F1D]'
                  }`}
                >
                  স্ট্যান্ডার্ড গ্রিড
                </button>
              </div>
            </div>

            <span className="text-xs font-bold text-[#7A6E65] bg-[#F4EFE6] px-2.5 py-1 rounded-xl border border-[#DEC8B3]">
              {filteredProducts.length}টি পণ্য মজুত
            </span>
          </div>

          {/* SMARTPHONE CANVAS MOCKUP (Exact visual structure from Pinterest image) */}
          <div
            className={`rounded-[32px] sm:rounded-[36px] p-3.5 sm:p-7 border relative overflow-hidden transition-all duration-300 ${
              viewStyle === 'pinterest'
                ? 'bg-[#FAF6F0] border-[#E8DFD5] shadow-xl shadow-[#A57D5C]/5'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Pinterest Surrounding Floating Badges on Screen (Visible on XL screens) */}
            {viewStyle === 'pinterest' && (
              <>
                {/* Left Floating 4-Color Swatch Pill */}
                <div className="hidden 2xl:flex flex-col items-center gap-2 p-2 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#E8DFD5] shadow-lg absolute -left-16 top-12 z-20">
                  <span className="w-5 h-5 rounded-full bg-[#FAF6F0] border border-[#DEC8B3]" title="Cream" />
                  <span className="w-5 h-5 rounded-full bg-[#DEC8B3] border border-[#B08968]" title="Sand" />
                  <span className="w-5 h-5 rounded-full bg-[#A57D5C] shadow-xs" title="Mocha" />
                  <span className="w-5 h-5 rounded-full bg-[#221F1D] shadow-xs" title="Espresso" />
                </div>

                {/* Right Floating Circular Mocha Stamp */}
                <div className="hidden 2xl:flex flex-col items-center justify-center text-center w-28 h-28 rounded-full bg-[#A57D5C] text-white p-2 shadow-xl absolute -right-12 -top-6 z-20 transform rotate-12 select-none border-2 border-white/50">
                  <span className="text-[10px] tracking-widest uppercase font-black">✦ FOCUS</span>
                  <span className="text-[8px] tracking-wider uppercase font-semibold leading-tight mt-1 opacity-90">
                    FRESH STOCK • 100% PURE • FAIR PRICE
                  </span>
                </div>
              </>
            )}

            {/* Top Greeting Header (From Pinterest Smartphone: "Good morning, Aisha 👋") */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD5]/60 mb-4">
              <div>
                <p className="text-xs text-[#7A6E65] font-semibold">
                  শুভ সকাল, {settings?.ownerName || 'আব্দুল মালেক'} 👋
                </p>
                <h3 className="text-base sm:text-lg font-black text-[#221F1D] tracking-tight">
                  {settings?.shopName || 'বিসমিল্লাহ্ জেনারেল স্টোর'}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  <span>কাউন্টার সচল</span>
                </span>
                <div className="w-9 h-9 rounded-full bg-[#A57D5C] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  {settings?.ownerName?.charAt(0) || 'ম'}
                </div>
              </div>
            </div>

            {/* DARK HERO CARD: "EXPLORE NEW PLACES" -> "EXPLORE FRESH COMMODITIES" */}
            <div className="bg-[#221F1D] text-white rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-5">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-2 max-w-[65%] z-10">
                  <span className="text-[10px] tracking-widest font-bold uppercase text-[#DEC8B3]">
                    ✦ FEATURED ARRIVALS
                  </span>
                  <h4
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-lg sm:text-2xl font-black tracking-tight text-white leading-tight uppercase"
                  >
                    EXPLORE FRESH PRODUCTS
                  </h4>
                  <p className="text-xs text-stone-300 font-normal leading-relaxed line-clamp-2">
                    বাছাইকৃত প্রিমিয়াম মিনিকেট চাল, খাঁটি সয়াবিন তেল ও রাঁধুনী মসলা
                  </p>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory('all')}
                      className="px-4 py-2 bg-[#A57D5C] hover:bg-[#8C6546] text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      সব পণ্য দেখুন (Explore Now)
                    </button>
                  </div>
                </div>

                {/* Hero Scenic Thumbnail Illustration */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-[#A57D5C]/40 to-stone-800 p-2 border border-stone-700 flex items-center justify-center shadow-inner shrink-0 transform rotate-3">
                  <div className="text-center">
                    <span className="text-3xl sm:text-4xl block mb-1">🌾</span>
                    <span className="text-[9px] font-bold text-[#DEC8B3] uppercase tracking-wider">
                      100% PURE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PILLOWY SOFT SEARCH BAR (Identical to Pinterest 'Search destination') */}
            <div className="relative mb-5">
              <div className="bg-[#F4EFE6] border border-[#E8DFD5] rounded-2xl p-2.5 flex items-center gap-2.5 shadow-inner">
                <Search className="w-4 h-4 text-[#A57D5C] ml-1 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="পণ্য, ক্যাটাগরি বা বারকোড খুঁজুন (Search destination)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-[#221F1D] placeholder-[#A89C92] outline-hidden font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsVoiceCartOpen(true)}
                  className="p-1.5 rounded-xl bg-white hover:bg-[#FAF6F0] text-[#A57D5C] border border-[#DEC8B3] shadow-2xs transition-colors shrink-0"
                  title="ভয়েসে বলুন"
                >
                  <Mic className="w-4 h-4 animate-pulse" />
                </button>
              </div>
            </div>

            {/* CATEGORIES SECTION (With "Categories" Title & "See all" from Pinterest Mockup) */}
            <div className="mb-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-black text-[#221F1D] tracking-tight uppercase">
                  Categories
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className="text-xs font-bold text-[#A57D5C] hover:text-[#8C6546] transition-colors"
                >
                  See all ({products.length})
                </button>
              </div>

              {/* Neumorphic Soft Clay Squircle Category Cards */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer select-none border ${
                        isSelected
                          ? 'bg-[#A57D5C] text-white border-[#8C6546] shadow-md shadow-[#A57D5C]/20 scale-105'
                          : 'bg-white hover:bg-[#F4EFE6] text-[#221F1D] border-[#E8DFD5] shadow-xs hover:border-[#DEC8B3]'
                      }`}
                    >
                      <span className="text-lg sm:text-xl">{cat.emoji}</span>
                      <span className="text-[10px] font-bold truncate max-w-full text-center leading-tight">
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* POPULAR PRODUCTS SECTION ("Popular places" from Pinterest Mockup) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-[#221F1D] tracking-tight uppercase">
                    Popular Items
                  </h4>
                  <span className="text-[10px] font-bold text-[#A57D5C] bg-[#F4EFE6] px-2 py-0.5 rounded-md border border-[#DEC8B3]">
                    জনপ্রিয় পণ্যসমূহ
                  </span>
                </div>

                <span className="text-xs text-[#7A6E65] font-medium">
                  {filteredProducts.length}টি আইটেম
                </span>
              </div>

              {/* Products Grid (Styled identically to Santorini card in Pinterest reference) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[580px] overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const inCart = cart.find((item) => item.productId === p.id);
                  const visual = getProductCategoryVisual(p.category);

                  return (
                    <div
                      key={p.id}
                      onClick={() => addToCart(p, 1)}
                      className={`rounded-3xl p-3.5 border transition-all duration-200 cursor-pointer select-none flex flex-col justify-between group ${
                        inCart
                          ? 'bg-[#F4EFE6] border-[#A57D5C] ring-2 ring-[#A57D5C]/30 shadow-md'
                          : 'bg-white hover:bg-slate-50/50 border-[#E8DFD5] hover:border-[#DEC8B3] shadow-xs hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* Top Product Image & Badge Row */}
                        <div
                          className={`w-full h-24 rounded-2xl bg-gradient-to-br ${visual.bg} p-2 flex items-center justify-between relative overflow-hidden border border-[#E8DFD5]/70 mb-2.5`}
                        >
                          <div className="flex items-center gap-2 z-10">
                            <span className="text-3xl p-1 bg-white/70 rounded-xl backdrop-blur-xs shadow-2xs">
                              {visual.emoji}
                            </span>
                            <div className="leading-tight">
                              <span className="text-[10px] font-bold text-[#A57D5C] uppercase tracking-wider block">
                                {visual.label}
                              </span>
                              <span className="text-[9px] text-stone-500 font-mono">
                                {p.barcode ? `BC: ${p.barcode}` : 'Standard'}
                              </span>
                            </div>
                          </div>

                          {/* Star Rating Badge (Like ★ 4.8 in Santorini card) */}
                          <div className="px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-xs border border-[#DEC8B3] text-[10px] font-bold text-[#221F1D] flex items-center gap-1 shadow-2xs z-10">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                            <span>4.9</span>
                          </div>
                        </div>

                        {/* Product Title & Stock Status */}
                        <h5 className="font-bold text-[#221F1D] text-xs sm:text-sm line-clamp-2 leading-snug mb-1 group-hover:text-[#A57D5C] transition-colors">
                          {p.banglaName || p.name}
                        </h5>

                        <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2">
                          <span className="truncate text-[10px] text-stone-400">{p.name}</span>
                          <span
                            className={`font-semibold text-[10px] ${
                              p.stock <= p.minStock ? 'text-red-600 font-bold' : 'text-[#7A6E65]'
                            }`}
                          >
                            স্টক: {p.stock} {p.unit}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Price & Add to Cart Row */}
                      <div className="pt-2.5 border-t border-[#E8DFD5]/80 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-[#A57D5C] block font-semibold leading-none">
                            মূল্য
                          </span>
                          <span className="font-black text-[#221F1D] text-sm sm:text-base font-mono">
                            {settings.currency}{p.sellingPrice}
                            <span className="text-[10px] font-normal text-stone-500 ml-0.5">
                              /{p.unit}
                            </span>
                          </span>
                        </div>

                        {/* Add Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(p, 1);
                          }}
                          className={`h-8 px-3 rounded-xl flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                            inCart
                              ? 'bg-[#A57D5C] text-white shadow-[#A57D5C]/30'
                              : 'bg-[#F4EFE6] hover:bg-[#A57D5C] hover:text-white text-[#5C3D24] border border-[#DEC8B3]'
                          }`}
                        >
                          {inCart ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{inCart.quantity} {p.unit}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>যোগ</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM TAGLINE & SOCIAL ROW (From Pinterest Reference Image) */}
            {viewStyle === 'pinterest' && (
              <div className="mt-6 pt-5 border-t border-[#E8DFD5] text-center space-y-2">
                <p
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-xs sm:text-sm font-semibold italic text-[#5C4535]"
                >
                  "GOOD SERVICE IS INVISIBLE, but the trust created is unforgettable."
                </p>
                <p className="text-[11px] text-[#8C7E75]">
                  সততা ও বিশ্বস্ততার সাথে হালাল মুদি ব্যবসা পরিচালনায় আমরা অঙ্গিকারবদ্ধ
                </p>

                {/* Aesthetic Social / Interaction Row */}
                <div className="flex items-center justify-center gap-6 pt-2 text-[#A57D5C]/80">
                  <Heart className="w-4 h-4 cursor-pointer hover:text-red-500 transition-colors" />
                  <MessageSquare className="w-4 h-4 cursor-pointer hover:text-[#221F1D] transition-colors" />
                  <Send className="w-4 h-4 cursor-pointer hover:text-[#221F1D] transition-colors" />
                  <Bookmark className="w-4 h-4 cursor-pointer hover:text-[#221F1D] transition-colors" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: POS CART & CHECKOUT (5 Cols) (Matching Luxury Theme)         */}
        {/* ========================================================================= */}
        <div className="lg:col-span-5 bg-[#FAF6F0] rounded-[32px] border border-[#E8DFD5] shadow-xl p-4 sm:p-6 flex flex-col h-fit sticky top-20">
          {/* Header */}
          <div className="flex items-center justify-between pb-3.5 border-b border-[#E8DFD5]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-[#A57D5C] text-white flex items-center justify-center shadow-md shadow-[#A57D5C]/20">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-base text-[#221F1D]">ক্যাশ কাউন্টার কার্ট</h3>
                <p className="text-[11px] text-[#7A6E65]">মোট {cart.length}টি পণ্য নির্বাচিত</p>
              </div>
            </div>

            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>খালি করুন</span>
              </button>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto max-h-64 divide-y divide-[#E8DFD5] my-3 pr-1">
            {cart.length === 0 ? (
              <div className="py-12 text-center text-[#A89C92]">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#A57D5C]" />
                <p className="text-xs sm:text-sm font-bold text-[#221F1D]">কার্ট খালি আছে</p>
                <p className="text-xs text-[#7A6E65] mt-1">বাম পাশের পণ্য কার্ডে ক্লিক করে কার্টে যোগ করুন</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.productId} className="py-3 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs sm:text-sm text-[#221F1D] truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-[#A57D5C] font-mono">
                      {settings.currency}{item.unitPrice} × {item.quantity} {item.unit}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.quantity - 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8DFD5] hover:bg-[#F4EFE6] text-[#221F1D] flex items-center justify-center font-bold"
                    >
                      <Minus className="w-3 h-3" />
                    </button>

                    <span className="w-7 text-center font-black text-xs text-[#221F1D]">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() => updateCartQty(item.productId, item.quantity + 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-[#E8DFD5] hover:bg-[#F4EFE6] text-[#221F1D] flex items-center justify-center font-bold"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <span className="w-16 text-right font-black text-xs sm:text-sm text-[#221F1D] font-mono">
                      {settings.currency}{item.totalPrice.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Customer Selector & Bill Calculations */}
          <div className="pt-3 border-t border-[#E8DFD5] space-y-3">
            <div>
              <label className="block text-xs font-bold text-[#221F1D] mb-1 flex items-center justify-between">
                <span>গ্রাহক নির্বাচন (বাকি বিক্রয়ের জন্য আবশ্যক):</span>
                {selectedCustomer && selectedCustomer.totalDue > 0 && (
                  <span className="text-red-600 font-bold">
                    বকেয়া: {settings.currency}{selectedCustomer.totalDue}
                  </span>
                )}
              </label>

              <select
                value={selectedCustomerId}
                onChange={(e) => setSelectedCustomerId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs sm:text-sm text-[#221F1D] outline-hidden focus:border-[#A57D5C]"
              >
                <option value="">সাধারণ নগদ খদ্দের (Walk-in Customer)</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.phone ? `(${c.phone})` : ''} — বাকি: ৳{c.totalDue}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Tabs */}
            <div>
              <label className="block text-xs font-bold text-[#221F1D] mb-1">
                পরিশোধের মাধ্যম (Payment Mode):
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { id: 'cash', label: 'নগদ ক্যাশ', icon: '💵' },
                  { id: 'bkash', label: 'বিকাশ/নগদ', icon: '📱' },
                  { id: 'due', label: 'বাকির খাতা', icon: '📝' }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as PaymentMethod)}
                    className={`py-2 px-1 rounded-xl font-bold flex items-center justify-center gap-1 border transition-all ${
                      paymentMethod === pm.id
                        ? 'bg-[#A57D5C] text-white border-[#8C6546] shadow-xs'
                        : 'bg-white text-[#7A6E65] border-[#E8DFD5] hover:bg-[#F4EFE6]'
                    }`}
                  >
                    <span>{pm.icon}</span>
                    <span>{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Discount & Paid Input */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="block font-bold text-[#221F1D] mb-1">ছাড়/ডিসকাউন্ট ({settings.currency}):</label>
                <input
                  type="number"
                  min="0"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  placeholder="০"
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#221F1D] outline-hidden focus:border-[#A57D5C]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#221F1D] mb-1">জমা টাকা ({settings.currency}):</label>
                <input
                  type="number"
                  min="0"
                  value={paidAmountInput}
                  onChange={(e) => setPaidAmountInput(e.target.value)}
                  placeholder={paymentMethod === 'due' ? '০' : grandTotal.toString()}
                  className="w-full px-3 py-2 bg-white border border-[#E8DFD5] rounded-xl text-xs font-semibold text-[#221F1D] outline-hidden focus:border-[#A57D5C]"
                />
              </div>
            </div>

            {/* Bill Summary Table */}
            <div className="p-3 bg-white rounded-2xl border border-[#E8DFD5] space-y-1.5 text-xs">
              <div className="flex justify-between text-[#7A6E65]">
                <span>উপমোট (Subtotal):</span>
                <span className="font-mono font-bold text-[#221F1D]">{settings.currency}{subtotal.toFixed(0)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>ছাড় (Discount):</span>
                  <span className="font-mono font-bold">-{settings.currency}{discount.toFixed(0)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm sm:text-base font-black text-[#221F1D] pt-1.5 border-t border-[#E8DFD5]">
                <span>সর্বমোট প্রদেয় বিল:</span>
                <span className="text-[#A57D5C] font-mono">{settings.currency}{grandTotal.toFixed(0)}</span>
              </div>

              {due > 0 && (
                <div className="flex justify-between text-red-600 font-bold pt-1 border-t border-dashed border-red-200">
                  <span>খাতায় বাকি থাকবে:</span>
                  <span className="font-mono">{settings.currency}{due.toFixed(0)}</span>
                </div>
              )}
            </div>

            {/* Checkout Confirmation Button */}
            <button
              type="button"
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#A57D5C] via-[#8C6546] to-[#6E472A] hover:from-[#8C6546] hover:to-[#5C3D24] disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-xl shadow-[#A57D5C]/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>বিক্রয় সম্পন্ন ও মেমো তৈরি করুন ({settings.currency}{grandTotal.toFixed(0)})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
