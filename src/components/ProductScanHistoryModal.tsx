import React, { useState, useMemo, useRef } from 'react';
import {
  Camera,
  Search,
  Trash2,
  CheckCircle,
  Plus,
  ShoppingCart,
  X,
  Sparkles,
  ArrowRight,
  Clock,
  Tag,
  Package,
  Check,
  AlertCircle,
  SlidersHorizontal,
  Layers
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { ScannedProductRecord, ProductCategory, UnitType } from '../types';

interface ProductScanHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForForm: (scannedItem: ScannedProductRecord) => void;
}

export const ProductScanHistoryModal: React.FC<ProductScanHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectForForm
}) => {
  const {
    scanHistory,
    addScanRecord,
    deleteScanRecord,
    clearScanHistory,
    updateScanRecordStatus,
    products,
    addProduct,
    updateProduct,
    addToCart,
    settings
  } = useKhata();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'added'>('all');
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [quickAddedId, setQuickAddedId] = useState<string | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Time formatter in Bengali
  const formatTime = (isoString: string): string => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'এইমাত্র';
      if (diffMins < 60) return `${diffMins} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
      if (diffDays === 1) return 'গতকাল';
      return new Date(isoString).toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'পূর্বে স্ক্যান করা';
    }
  };

  // OCR scanning directly from scan history modal
  const handleScanImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanNotice(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;
        try {
          const res = await fetch('/api/analyze-label', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Data })
          });
          const data = await res.json();
          if (data.name) {
            const sellingPrice = data.price ? parseFloat(data.price) : 0;
            const costPrice = data.costPrice
              ? parseFloat(data.costPrice)
              : sellingPrice > 0
              ? Math.round(sellingPrice * 0.88)
              : 0;

            const newRecord = addScanRecord({
              name: data.name,
              banglaName: data.banglaName || data.name,
              sellingPrice,
              costPrice,
              category: (data.category as ProductCategory) || 'rice_flour',
              unit: (data.unit as UnitType) || 'kg',
              barcode: data.barcode || undefined,
              imageThumbnail: base64Data.length < 500000 ? base64Data : undefined,
              status: 'pending'
            });

            setScanNotice({
              type: 'success',
              message: `"${newRecord.banglaName || newRecord.name}" সফলভাবে স্ক্যান হয়েছে!`
            });
            setTimeout(() => setScanNotice(null), 4000);
          } else {
            throw new Error(data.error || 'পণ্য বা লেবেল স্পষ্টভাবে পড়া যায়নি');
          }
        } catch (err: any) {
          setScanNotice({
            type: 'error',
            message: `স্ক্যান ব্যর্থ: ${err.message || 'ছবিটি আবার পরিষ্কারভাবে তুলুন'}`
          });
        } finally {
          setIsScanning(false);
          if (cameraInputRef.current) cameraInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsScanning(false);
    }
  };

  // Quick 1-Click Re-add to Inventory
  const handleQuickReAdd = (item: ScannedProductRecord) => {
    // Check if product already exists by name or barcode
    const existing = products.find(
      (p) =>
        (item.barcode && p.barcode === item.barcode) ||
        p.name.toLowerCase() === item.name.toLowerCase() ||
        (item.banglaName && p.banglaName && p.banglaName.toLowerCase() === item.banglaName.toLowerCase())
    );

    if (existing) {
      // Increment existing product stock by 10 (or 1 unit)
      const addedQty = existing.unit === 'kg' ? 10 : 5;
      updateProduct(existing.id, {
        stock: existing.stock + addedQty,
        sellingPrice: item.sellingPrice || existing.sellingPrice,
        costPrice: item.costPrice || existing.costPrice
      });
      updateScanRecordStatus(item.id, 'added');
      setQuickAddedId(item.id);
      setScanNotice({
        type: 'success',
        message: `"${existing.banglaName || existing.name}" এর স্টকে +${addedQty} যোগ করা হয়েছে!`
      });
    } else {
      // Create new product
      addProduct({
        name: item.name || item.banglaName || 'নতুন স্ক্যান করা পণ্য',
        banglaName: item.banglaName || item.name,
        category: item.category || 'other',
        costPrice: item.costPrice || 0,
        sellingPrice: item.sellingPrice || 0,
        stock: 20,
        unit: item.unit || 'kg',
        minStock: 5,
        barcode: item.barcode
      });
      updateScanRecordStatus(item.id, 'added');
      setQuickAddedId(item.id);
      setScanNotice({
        type: 'success',
        message: `"${item.banglaName || item.name}" সফলভাবে ইনভেন্টরিতে যুক্ত হয়েছে!`
      });
    }

    setTimeout(() => {
      setQuickAddedId(null);
      setScanNotice(null);
    }, 3500);
  };

  // Quick Add to POS Cart
  const handleAddToCart = (item: ScannedProductRecord) => {
    const existing = products.find(
      (p) =>
        (item.barcode && p.barcode === item.barcode) ||
        p.name.toLowerCase() === item.name.toLowerCase() ||
        (item.banglaName && p.banglaName && p.banglaName.toLowerCase() === item.banglaName.toLowerCase())
    );

    if (existing) {
      addToCart(existing, 1);
      setScanNotice({
        type: 'success',
        message: `"${existing.banglaName || existing.name}" ক্যাশ বিক্রয় মেমোতে যোগ করা হয়েছে!`
      });
    } else {
      // Create temporary/real product and add
      const newProd = {
        id: `prod-quick-${Date.now()}`,
        name: item.name,
        banglaName: item.banglaName || item.name,
        category: item.category || 'other',
        costPrice: item.costPrice || 0,
        sellingPrice: item.sellingPrice || 0,
        stock: 20,
        unit: item.unit || 'piece',
        minStock: 5,
        barcode: item.barcode,
        updatedAt: new Date().toISOString()
      };
      addProduct(newProd);
      addToCart(newProd, 1);
      setScanNotice({
        type: 'success',
        message: `"${item.banglaName || item.name}" যুক্ত করে ক্যাশ মেমোতে পাঠানো হয়েছে!`
      });
    }

    setTimeout(() => setScanNotice(null), 3000);
  };

  // Batch Re-Add All Pending Scans
  const handleBatchAddAllPending = () => {
    const pendingItems = scanHistory.filter((item) => item.status === 'pending');
    if (pendingItems.length === 0) return;

    let addedCount = 0;
    pendingItems.forEach((item) => {
      const existing = products.find(
        (p) =>
          (item.barcode && p.barcode === item.barcode) ||
          p.name.toLowerCase() === item.name.toLowerCase()
      );
      if (existing) {
        updateProduct(existing.id, { stock: existing.stock + 10 });
      } else {
        addProduct({
          name: item.name,
          banglaName: item.banglaName || item.name,
          category: item.category || 'other',
          costPrice: item.costPrice || 0,
          sellingPrice: item.sellingPrice || 0,
          stock: 15,
          unit: item.unit || 'kg',
          minStock: 5,
          barcode: item.barcode
        });
      }
      updateScanRecordStatus(item.id, 'added');
      addedCount++;
    });

    setScanNotice({
      type: 'success',
      message: `${addedCount}টি স্ক্যান করা পণ্য সফলভাবে ইনভেন্টরিতে যোগ করা হয়েছে!`
    });
    setTimeout(() => setScanNotice(null), 4000);
  };

  // Filtered List
  const filteredHistory = useMemo(() => {
    return scanHistory.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.banglaName && item.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.barcode && item.barcode.includes(searchQuery));
      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [scanHistory, searchQuery, statusFilter]);

  const pendingCount = useMemo(() => {
    return scanHistory.filter((s) => s.status === 'pending').length;
  }, [scanHistory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-800">
                  পণ্য স্ক্যান হিস্ট্রি (Product Scan History)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  {scanHistory.length}টি রেকর্ড
                </span>
              </div>
              <p className="text-xs text-slate-500">
                পূর্বে স্ক্যান করা পণ্যসমূহ দেখুন এবং এক ক্লিকে পুনরায় ইনভেন্টরিতে যোগ করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scan Notification Banner */}
        {scanNotice && (
          <div
            className={`mx-4 sm:mx-5 mt-3 p-3 rounded-2xl flex items-center justify-between text-xs sm:text-sm font-bold shadow-xs animate-in slide-in-from-top-2 ${
              scanNotice.type === 'success'
                ? 'bg-[#B2825C] text-white'
                : 'bg-red-600 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {scanNotice.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{scanNotice.message}</span>
            </div>
            <button
              type="button"
              onClick={() => setScanNotice(null)}
              className="p-1 hover:opacity-75"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Actions Bar: Direct Camera Scan + Quick Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3 bg-slate-50/70">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="স্ক্যান রেকর্ড খুঁজুন (নাম বা বারকোড)..."
                className="w-full pl-9 pr-4 py-2 border border-[#E8DFD3] rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-purple-500 outline-hidden"
              />
            </div>

            {/* Direct Camera Scan Trigger */}
            <div className="flex items-center gap-2">
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleScanImage}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                disabled={isScanning}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-600/20 active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>{isScanning ? 'স্ক্যান হচ্ছে...' : 'নতুন পণ্য স্ক্যান করুন'}</span>
              </button>
            </div>
          </div>

          {/* Sub-filters & Bulk Re-add Action */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E8DFD3]">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                সব ({scanHistory.length})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                পেন্ডিং ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('added')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  statusFilter === 'added'
                    ? 'bg-purple-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                যুক্ত হয়েছে ({scanHistory.length - pendingCount})
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={handleBatchAddAllPending}
                  className="px-3 py-1.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>পেন্ডিং সব যোগ করুন ({pendingCount})</span>
                </button>
              )}

              {scanHistory.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি সম্পূর্ণ স্ক্যান হিস্ট্রি মুছে ফেলতে চান?')) {
                      clearScanHistory();
                    }
                  }}
                  className="px-2.5 py-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>হিস্ট্রি ক্লিয়ার</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scan Records List (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {filteredHistory.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-50 rounded-3xl border border-dashed border-[#E8DFD3] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
                <Camera className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm sm:text-base">
                {scanHistory.length === 0
                  ? 'এখনও কোনো পণ্য স্ক্যান করা হয়নি'
                  : 'খোঁজ অনুযায়ী কোনো স্ক্যান রেকর্ড পাওয়া যায়নি'}
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                পণ্যের মোড়ক, লেবেল বা মূল্যের স্টিকারের ছবি তুললে স্বয়ংক্রিয়ভাবে নাম ও দাম শনাক্ত হয়ে এখানে জমা হবে।
              </p>
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="mt-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2 transition-colors shadow-xs"
              >
                <Camera className="w-4 h-4" />
                <span>প্রথম পণ্য স্ক্যান করুন</span>
              </button>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const margin =
                item.sellingPrice && item.costPrice
                  ? item.sellingPrice - item.costPrice
                  : 0;
              const marginPercent =
                item.sellingPrice && item.costPrice && item.sellingPrice > 0
                  ? Math.round((margin / item.sellingPrice) * 100)
                  : 0;

              const isJustAdded = quickAddedId === item.id;
              const alreadyInInventory = products.some(
                (p) =>
                  (item.barcode && p.barcode === item.barcode) ||
                  p.name.toLowerCase() === item.name.toLowerCase() ||
                  (item.banglaName && p.banglaName && p.banglaName.toLowerCase() === item.banglaName.toLowerCase())
              );

              return (
                <div
                  key={item.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                    isJustAdded
                      ? 'border-[#B2825C] bg-[#F5EEE7]/40 ring-2 ring-[#B2825C]/20'
                      : item.status === 'added'
                      ? 'border-[#E8DFD3] bg-white hover:border-slate-300'
                      : 'border-purple-200 bg-purple-50/20 hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Product Info & Image */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {item.imageThumbnail ? (
                        <img
                          src={item.imageThumbnail}
                          alt={item.name}
                          className="w-12 h-12 rounded-xl object-cover border border-[#E8DFD3] shrink-0 shadow-2xs"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 font-bold text-base shadow-2xs">
                          <Package className="w-6 h-6" />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <h4 className="font-bold text-slate-800 text-sm sm:text-base truncate">
                            {item.banglaName || item.name}
                          </h4>

                          {item.status === 'added' || alreadyInInventory ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#F5EEE7] text-[#6E472A] border border-[#DEC4AD] flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              <span>ইনভেন্টরিতে আছে</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>পেন্ডিং</span>
                            </span>
                          )}

                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            • {formatTime(item.scannedAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-500 truncate mb-1.5">
                          {item.name} {item.barcode ? `| বারকোড: ${item.barcode}` : ''}
                        </p>

                        {/* Price & Margins */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-bold text-[#83593B] bg-[#F5EEE7] px-2 py-0.5 rounded-md border border-[#DEC4AD]/60 font-mono">
                            বিক্রয়: {settings.currency}{item.sellingPrice || 0}/{item.unit || 'টি'}
                          </span>

                          {item.costPrice ? (
                            <span className="text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded-md">
                              কেনা: {settings.currency}{item.costPrice}
                            </span>
                          ) : null}

                          {margin > 0 && (
                            <span className="text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/50">
                              লাভ: +{settings.currency}{margin} ({marginPercent}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-1.5 justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Primary Re-Add Button */}
                      <button
                        type="button"
                        onClick={() => handleQuickReAdd(item)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs ${
                          alreadyInInventory
                            ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-[#E8DFD3]'
                            : 'bg-[#B2825C] hover:bg-[#9E6F4B] text-white'
                        }`}
                        title="স্টক যুক্ত করুন"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{alreadyInInventory ? 'স্টক যোগ (+)' : 'ইনভেন্টরিতে যোগ'}</span>
                      </button>

                      {/* Edit & Customize in Add Product Form */}
                      <button
                        type="button"
                        onClick={() => {
                          onSelectForForm(item);
                          onClose();
                        }}
                        className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-xl text-xs flex items-center gap-1 transition-colors border border-purple-200"
                        title="ফর্ম দিয়ে এডিট করে যোগ করুন"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>এডিট</span>
                      </button>

                      {/* Quick Add to POS Cart */}
                      <button
                        type="button"
                        onClick={() => handleAddToCart(item)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors border border-blue-200"
                        title="ক্যাশ কাউন্টার মেমোতে যুক্ত করুন"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>

                      {/* Delete from History */}
                      <button
                        type="button"
                        onClick={() => deleteScanRecord(item.id)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-xl transition-colors"
                        title="হিস্ট্রি থেকে বাদ দিন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>টিপস: প্যাকেটের মোড়ক স্ক্যান করলে কৃত্রিম বুদ্ধিমত্তা নাম ও সম্ভাব্য দাম স্বয়ংক্রিয়ভাবে সাজিয়ে নেয়।</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
