import React, { useState, useMemo, useRef } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Camera,
  CheckCircle,
  X,
  Upload,
  Sparkles,
  CheckSquare,
  Square,
  SlidersHorizontal,
  Layers,
  TrendingUp,
  Coins,
  History,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { Product, ProductCategory, UnitType, ScannedProductRecord } from '../types';
import { exportProductsToExcel } from '../utils/csvExport';
import { ProductScanHistoryModal } from './ProductScanHistoryModal';

export const InventoryView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    bulkUpdateProducts,
    deleteProduct,
    scanHistory,
    addScanRecord,
    updateScanRecordStatus,
    settings
  } = useKhata();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterLowStockOnly, setFilterLowStockOnly] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isScanHistoryOpen, setIsScanHistoryOpen] = useState(false);

  // Single Product Form State
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('rice_flour');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [stock, setStock] = useState('');
  const [unit, setUnit] = useState<UnitType>('kg');
  const [minStock, setMinStock] = useState('10');
  const [barcode, setBarcode] = useState('');

  // AI Label Scanner State
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Multi-Selection State for Bulk Edit
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [bulkSuccessNotice, setBulkSuccessNotice] = useState<string | null>(null);

  // Bulk Edit Form Controls
  const [applyStock, setApplyStock] = useState(true);
  const [stockMode, setStockMode] = useState<'add' | 'set' | 'subtract'>('add');
  const [stockValue, setStockValue] = useState('10');

  const [applySellingPrice, setApplySellingPrice] = useState(false);
  const [sellingPriceMode, setSellingPriceMode] = useState<
    'set' | 'increase_fixed' | 'increase_percent' | 'decrease_fixed' | 'decrease_percent'
  >('increase_fixed');
  const [sellingPriceValue, setSellingPriceValue] = useState('5');

  const [applyCostPrice, setApplyCostPrice] = useState(false);
  const [costPriceMode, setCostPriceMode] = useState<
    'set' | 'increase_fixed' | 'increase_percent' | 'decrease_fixed' | 'decrease_percent'
  >('increase_fixed');
  const [costPriceValue, setCostPriceValue] = useState('5');

  const [applyMinStock, setApplyMinStock] = useState(false);
  const [minStockValue, setMinStockValue] = useState('15');

  const resetForm = () => {
    setName('');
    setBanglaName('');
    setCategory('rice_flour');
    setCostPrice('');
    setSellingPrice('');
    setStock('');
    setUnit('kg');
    setMinStock('10');
    setBarcode('');
    setAiAnalysisResult(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setBanglaName(p.banglaName || '');
    setCategory(p.category);
    setCostPrice(p.costPrice.toString());
    setSellingPrice(p.sellingPrice.toString());
    setStock(p.stock.toString());
    setUnit(p.unit);
    setMinStock(p.minStock.toString());
    setBarcode(p.barcode || '');
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !banglaName.trim()) return;

    const payload = {
      name: name.trim() || banglaName.trim(),
      banglaName: banglaName.trim() || name.trim(),
      category,
      costPrice: parseFloat(costPrice) || 0,
      sellingPrice: parseFloat(sellingPrice) || 0,
      stock: parseFloat(stock) || 0,
      unit,
      minStock: parseFloat(minStock) || 5,
      barcode: barcode.trim() || undefined
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      addProduct(payload);
      setIsAddModalOpen(false);
    }
    resetForm();
  };

  // AI OCR Label Scanning
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingImage(true);
    setAiAnalysisResult(null);

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
            const pName = data.name;
            const bName = data.banglaName || data.name;
            const pSellingPrice = data.price ? parseFloat(data.price) : 0;
            const pCostPrice = data.costPrice
              ? parseFloat(data.costPrice)
              : pSellingPrice > 0
              ? Math.round(pSellingPrice * 0.88)
              : 0;

            setBanglaName(bName);
            setName(pName);
            if (pSellingPrice > 0) {
              setSellingPrice(pSellingPrice.toString());
              setCostPrice(pCostPrice.toString());
            }
            if (data.category) setCategory(data.category as ProductCategory);
            if (data.unit) setUnit(data.unit as UnitType);
            if (data.barcode) setBarcode(data.barcode);

            // Automatically record in Scan History
            addScanRecord({
              name: pName,
              banglaName: bName,
              sellingPrice: pSellingPrice,
              costPrice: pCostPrice,
              category: (data.category as ProductCategory) || category,
              unit: (data.unit as UnitType) || unit,
              barcode: data.barcode || barcode || undefined,
              imageThumbnail: base64Data.length < 500000 ? base64Data : undefined,
              status: 'pending'
            });

            setAiAnalysisResult(`শনাক্ত ও হিস্ট্রিতে সংরক্ষিত: "${bName}" (${pSellingPrice ? `৳${pSellingPrice}` : ''})`);
          } else {
            throw new Error(data.error || 'পণ্য পড়া যায়নি');
          }
        } catch (err: any) {
          setAiAnalysisResult(`স্ক্যান ব্যর্থ: ${err.message || 'আবার ছবি তুলুন'}`);
        } finally {
          setIsAnalyzingImage(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (e: any) {
      setIsAnalyzingImage(false);
    }
  };

  const handleSelectScannedItem = (item: ScannedProductRecord) => {
    resetForm();
    setName(item.name || '');
    setBanglaName(item.banglaName || item.name || '');
    if (item.category) setCategory(item.category);
    if (item.unit) setUnit(item.unit);
    if (item.sellingPrice) setSellingPrice(item.sellingPrice.toString());
    if (item.costPrice) setCostPrice(item.costPrice.toString());
    if (item.barcode) setBarcode(item.barcode);
    setStock('20');
    setIsAddModalOpen(true);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.banglaName && p.banglaName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.barcode && p.barcode.includes(searchQuery));
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesLowStock = !filterLowStockOnly || p.stock <= p.minStock;
      return matchesSearch && matchesCategory && matchesLowStock;
    });
  }, [products, searchQuery, selectedCategory, filterLowStockOnly]);

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= p.minStock).length;
  }, [products]);

  const totalStockValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.stock * p.costPrice, 0);
  }, [products]);

  // Selection Logic
  const allFilteredSelected =
    filteredProducts.length > 0 &&
    filteredProducts.every((p) => selectedProductIds.includes(p.id));

  const someFilteredSelected =
    filteredProducts.some((p) => selectedProductIds.includes(p.id)) && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredProducts.map((p) => p.id));
      setSelectedProductIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const newIds = new Set([...selectedProductIds, ...filteredProducts.map((p) => p.id)]);
      setSelectedProductIds(Array.from(newIds));
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const clearSelection = () => {
    setSelectedProductIds([]);
  };

  const selectedProducts = useMemo(() => {
    const idSet = new Set(selectedProductIds);
    return products.filter((p) => idSet.has(p.id));
  }, [products, selectedProductIds]);

  // Helper to calculate preview values for a product during bulk edit
  const calculateNewProductValues = (p: Product) => {
    let newStock = p.stock;
    let newSellingPrice = p.sellingPrice;
    let newCostPrice = p.costPrice;
    let newMinStock = p.minStock;

    if (applyStock && stockValue !== '') {
      const val = parseFloat(stockValue) || 0;
      if (stockMode === 'add') newStock = p.stock + val;
      else if (stockMode === 'set') newStock = Math.max(0, val);
      else if (stockMode === 'subtract') newStock = Math.max(0, p.stock - val);
    }

    if (applySellingPrice && sellingPriceValue !== '') {
      const val = parseFloat(sellingPriceValue) || 0;
      if (sellingPriceMode === 'set') newSellingPrice = Math.max(0, val);
      else if (sellingPriceMode === 'increase_fixed') newSellingPrice = p.sellingPrice + val;
      else if (sellingPriceMode === 'increase_percent') {
        newSellingPrice = Math.round(p.sellingPrice * (1 + val / 100));
      } else if (sellingPriceMode === 'decrease_fixed') {
        newSellingPrice = Math.max(0, p.sellingPrice - val);
      } else if (sellingPriceMode === 'decrease_percent') {
        newSellingPrice = Math.max(0, Math.round(p.sellingPrice * (1 - val / 100)));
      }
    }

    if (applyCostPrice && costPriceValue !== '') {
      const val = parseFloat(costPriceValue) || 0;
      if (costPriceMode === 'set') newCostPrice = Math.max(0, val);
      else if (costPriceMode === 'increase_fixed') newCostPrice = p.costPrice + val;
      else if (costPriceMode === 'increase_percent') {
        newCostPrice = Math.round(p.costPrice * (1 + val / 100));
      } else if (costPriceMode === 'decrease_fixed') {
        newCostPrice = Math.max(0, p.costPrice - val);
      } else if (costPriceMode === 'decrease_percent') {
        newCostPrice = Math.max(0, Math.round(p.costPrice * (1 - val / 100)));
      }
    }

    if (applyMinStock && minStockValue !== '') {
      newMinStock = Math.max(0, parseFloat(minStockValue) || 0);
    }

    return { newStock, newSellingPrice, newCostPrice, newMinStock };
  };

  // Execute Bulk Update
  const handleApplyBulkUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProductIds.length === 0) return;

    if (!applyStock && !applySellingPrice && !applyCostPrice && !applyMinStock) {
      alert('অনুগ্রহ করে অন্তত একটি অপশন (স্টক বা মূল্য) পরিবর্তনের জন্য সক্রিয় করুন।');
      return;
    }

    bulkUpdateProducts(selectedProductIds, (p) => {
      const { newStock, newSellingPrice, newCostPrice, newMinStock } = calculateNewProductValues(p);
      const updates: Partial<Product> = {};
      if (applyStock && stockValue !== '') updates.stock = newStock;
      if (applySellingPrice && sellingPriceValue !== '') updates.sellingPrice = newSellingPrice;
      if (applyCostPrice && costPriceValue !== '') updates.costPrice = newCostPrice;
      if (applyMinStock && minStockValue !== '') updates.minStock = newMinStock;
      return updates;
    });

    setIsBulkEditModalOpen(false);
    setBulkSuccessNotice(
      `${selectedProductIds.length}টি পণ্যের স্টক ও মূল্য সফলভাবে আপডেট করা হয়েছে!`
    );
    clearSelection();
    setTimeout(() => setBulkSuccessNotice(null), 4000);
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800">
                পণ্য ও স্টক ইনভেন্টরি (Inventory Stock)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#6E472A] border border-emerald-200">
                বাল্ক আপডেট সক্রিয়
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              একসাথে একাধিক পণ্য নির্বাচন করে স্টক বৃদ্ধি ও দাম দ্রুত পরিবর্তন করুন
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Scan History Trigger */}
            <button
              type="button"
              onClick={() => setIsScanHistoryOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold text-xs sm:text-sm rounded-xl transition-all border border-purple-200 shadow-2xs relative"
              title="পূর্বে স্ক্যান করা পণ্যের তালিকা দেখুন ও পুনরায় যোগ করুন"
            >
              <History className="w-4 h-4 text-purple-600" />
              <span>স্ক্যান হিস্ট্রি</span>
              {scanHistory.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-purple-600 text-white ml-0.5">
                  {scanHistory.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => exportProductsToExcel(products)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors border border-[#E8DFD3]"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#B2825C]" />
              <span>এক্সেল ডাউনলোড</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন পণ্য যোগ</span>
            </button>
          </div>
        </div>

        {/* Quick Stock Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
          <div className="bg-slate-50 border border-[#E8DFD3] rounded-xl p-3">
            <p className="text-xs font-semibold text-slate-500">মোট পণ্য সংখ্যা</p>
            <p className="text-xl sm:text-2xl font-black text-slate-800 mt-1">
              {products.length}টি আইটেম
            </p>
          </div>

          <div className="bg-[#F5EEE7] border border-[#DEC4AD] rounded-xl p-3">
            <p className="text-xs font-semibold text-[#83593B]">বর্তমান স্টকের মোট মান (কেনা দাম)</p>
            <p className="text-xl sm:text-2xl font-black text-[#6E472A] mt-1">
              {settings.currency}{totalStockValue.toLocaleString()}
            </p>
          </div>

          <div className="bg-red-50/70 border border-red-200 rounded-xl p-3 col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold text-red-600">কম স্টক সতর্কতা (Low Stock)</p>
            <p className="text-xl sm:text-2xl font-black text-red-700 mt-1">
              {lowStockCount}টি পণ্য শেষ হওয়ার পথে
            </p>
          </div>
        </div>

        {/* Recent Scanned Items Quick Bar (Instant Re-Add on Mobile / Counter) */}
        {scanHistory.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">
                  <Camera className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  সম্প্রতি স্ক্যান করা পণ্য (Recently Scanned Items)
                </span>
                <span className="text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 hidden sm:inline">
                  {scanHistory.length}টি সংরক্ষিত
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsScanHistoryOpen(true)}
                className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1 transition-colors"
              >
                <span>সব হিস্ট্রি দেখুন ({scanHistory.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {scanHistory.slice(0, 3).map((item) => {
                const alreadyAdded = products.some(
                  (p) =>
                    (item.barcode && p.barcode === item.barcode) ||
                    p.name.toLowerCase() === item.name.toLowerCase() ||
                    (item.banglaName && p.banglaName && p.banglaName.toLowerCase() === item.banglaName.toLowerCase())
                );

                return (
                  <div
                    key={item.id}
                    className="p-2.5 bg-gradient-to-r from-purple-50/50 to-indigo-50/30 border border-purple-100 rounded-xl flex items-center justify-between gap-2 shadow-2xs hover:border-purple-300 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-800 text-xs truncate">
                        {item.banglaName || item.name}
                      </p>
                      <p className="text-[11px] text-purple-700 font-mono font-medium">
                        {settings.currency}{item.sellingPrice || 0}/{item.unit || 'টি'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const existing = products.find(
                            (p) =>
                              (item.barcode && p.barcode === item.barcode) ||
                              p.name.toLowerCase() === item.name.toLowerCase() ||
                              (item.banglaName && p.banglaName && p.banglaName.toLowerCase() === item.banglaName.toLowerCase())
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
                          setBulkSuccessNotice(
                            `"${item.banglaName || item.name}" সফলভাবে ইনভেন্টরিতে যোগ/আপডেট করা হয়েছে!`
                          );
                          setTimeout(() => setBulkSuccessNotice(null), 3500);
                        }}
                        className="px-2 py-1 bg-white hover:bg-[#F5EEE7] text-[#83593B] border border-emerald-200 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                        title="স্টকে যোগ করুন"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{alreadyAdded ? '+১০ স্টক' : 'যোগ'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectScannedItem(item)}
                        className="p-1 text-slate-400 hover:text-purple-700 hover:bg-white rounded-lg transition-colors"
                        title="এডিট করে বিস্তারিত যোগ করুন"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Success Notice Banner */}
      {bulkSuccessNotice && (
        <div className="p-3.5 bg-[#B2825C] text-white rounded-2xl flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{bulkSuccessNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setBulkSuccessNotice(null)}
            className="p-1 hover:bg-[#9E6F4B] rounded-lg text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STICKY / FLOATING BULK ACTIONS TOOLBAR (Appears when items are selected) */}
      {selectedProductIds.length > 0 && (
        <div className="bg-slate-900 text-white rounded-2xl p-3.5 sm:p-4 shadow-xl border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#F5EEE7]0/20 text-[#DEC4AD] flex items-center justify-center font-bold text-xs border border-[#B2825C]/30">
              {selectedProductIds.length}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-slate-100">
                {selectedProductIds.length}টি পণ্য নির্বাচিত হয়েছে
              </p>
              <p className="text-[11px] text-slate-400">
                একসাথে স্টক যোগ, নতুন রেট নির্ধারণ বা দামের সমন্বয় করুন
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {/* Primary Bulk Edit Trigger Button */}
            <button
              type="button"
              onClick={() => {
                setApplyStock(true);
                setStockMode('add');
                setStockValue('10');
                setApplySellingPrice(false);
                setIsBulkEditModalOpen(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-[#B2825C] to-[#8C6241] hover:from-[#9E6F4B] hover:to-[#785135] text-white font-bold rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-all transform active:scale-95"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>একত্রিত আপডেট (Bulk Edit)</span>
            </button>

            {/* Quick Price Update Shortcut */}
            <button
              type="button"
              onClick={() => {
                setApplyStock(false);
                setApplySellingPrice(true);
                setSellingPriceMode('increase_fixed');
                setSellingPriceValue('5');
                setIsBulkEditModalOpen(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-[#DEC4AD]" />
              <span>দাম পরিবর্তন</span>
            </button>

            {/* Quick Stock Add Shortcut */}
            <button
              type="button"
              onClick={() => {
                setApplyStock(true);
                setStockMode('add');
                setStockValue('50');
                setApplySellingPrice(false);
                setIsBulkEditModalOpen(true);
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
            >
              <Package className="w-3.5 h-3.5 text-teal-400" />
              <span>স্টক যোগ (+)</span>
            </button>

            {/* Deselect Button */}
            <button
              type="button"
              onClick={clearSelection}
              className="px-3 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-colors"
            >
              নির্বাচন বাতিল
            </button>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা বারকোড দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 border border-[#E8DFD3] rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          {/* Quick Category Filters */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-[#E8DFD3] rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 outline-hidden"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            <option value="rice_flour">চাল, ডাল ও আটা</option>
            <option value="oil_ghee">তেল ও ঘি</option>
            <option value="spices_salt">মসলা ও লবণ</option>
            <option value="sugar_tea">চিনি ও চা পাতা</option>
            <option value="snacks_biscuits">বিস্কুট ও স্ন্যাক্স</option>
            <option value="soap_detergent">সাবান ও ডিটারজেন্ট</option>
          </select>

          <button
            type="button"
            onClick={() => setFilterLowStockOnly(!filterLowStockOnly)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterLowStockOnly
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filterLowStockOnly ? '● শুধু কম স্টক প্রদর্শন' : 'সকল স্টক'}
          </button>

          {/* Quick Select All / Deselect All Button */}
          <button
            type="button"
            onClick={toggleSelectAll}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-semibold transition-colors flex items-center gap-1.5"
          >
            {allFilteredSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-[#B2825C]" />
                <span>সব বাতিল</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>সবগুলো সিলেক্ট করুন</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Inventory Table with Bulk Multi-Select Checkboxes */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-[#E8DFD3]">
              <tr>
                {/* Select All Checkbox Column */}
                <th className="py-3.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = someFilteredSelected;
                    }}
                    onChange={toggleSelectAll}
                    title="সকল দৃশ্যমান পণ্য নির্বাচন করুন"
                    className="w-4 h-4 rounded text-[#B2825C] focus:ring-[#B2825C] border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="py-3.5 px-4">পণ্যের নাম</th>
                <th className="py-3.5 px-4">ক্যাটাগরি</th>
                <th className="py-3.5 px-4 text-right">কেনা দাম</th>
                <th className="py-3.5 px-4 text-right">বিক্রয় মূল্য</th>
                <th className="py-3.5 px-4 text-center">বর্তমান স্টক</th>
                <th className="py-3.5 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোনো পণ্য পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isLow = p.stock <= p.minStock;
                  const isSelected = selectedProductIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-[#F5EEE7]/70 border-l-4 border-l-emerald-600'
                          : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Individual Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectProduct(p.id)}
                          className="w-4 h-4 rounded text-[#B2825C] focus:ring-[#B2825C] border-slate-300 cursor-pointer"
                        />
                      </td>

                      <td
                        className="py-3 px-4 cursor-pointer"
                        onClick={() => toggleSelectProduct(p.id)}
                      >
                        <p className="font-bold text-slate-800">{p.banglaName || p.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {p.name} {p.barcode ? `| বারকোড: ${p.barcode}` : ''}
                        </p>
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md font-medium">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right text-slate-600 font-mono">
                        {settings.currency}{p.costPrice.toFixed(0)}/{p.unit}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-[#83593B] font-mono">
                        {settings.currency}{p.sellingPrice.toFixed(0)}/{p.unit}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                          >
                            -
                          </button>
                          <span
                            className={`font-black px-2 py-0.5 rounded-md ${
                              isLow
                                ? 'bg-red-100 text-red-700 animate-pulse'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            {p.stock} {p.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateProduct(p.id, { stock: p.stock + 1 })}
                            className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                            title="একক এডিট"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`আপনি কি "${p.banglaName || p.name}" পণ্যটি মুছে ফেলতে চান?`)) {
                                deleteProduct(p.id);
                                setSelectedProductIds((prev) => prev.filter((id) => id !== p.id));
                              }
                            }}
                            className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: BULK EDIT COMPREHENSIVE MODAL                   */}
      {/* ========================================================= */}
      {isBulkEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-[#E8DFD3] max-h-[92vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#B2825C] to-[#8C6241] text-white flex items-center justify-center shadow-md">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                    <span>একত্রিত স্টক ও মূল্য আপডেট (Bulk Edit)</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-[#6E472A]">
                      {selectedProductIds.length}টি পণ্য
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    নির্বাচিত সকল পণ্যের স্টক ও দাম এক ক্লিকে হালনাগাদ করুন
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBulkEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Products Chips */}
            <div className="my-3.5 p-3 bg-slate-50 rounded-2xl border border-[#E8DFD3]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-[#B2825C]" />
                  নির্বাচিত পণ্যের তালিকা ({selectedProducts.length}):
                </span>
                <span className="text-[11px] text-slate-400">
                  (ক্রসে চাপ দিলে সেটি তালিকা থেকে বাদ পড়বে)
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {selectedProducts.map((p) => (
                  <span
                    key={p.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-[#E8DFD3] rounded-lg text-xs font-semibold text-slate-700 shadow-2xs"
                  >
                    <span>{p.banglaName || p.name}</span>
                    <span className="text-[10px] text-slate-400">({p.stock}{p.unit})</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectProduct(p.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bulk Update Controls Form */}
            <form onSubmit={handleApplyBulkUpdate} className="space-y-4">
              {/* SECTION A: STOCK LEVEL UPDATE */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  applyStock
                    ? 'border-[#B2825C] bg-[#F5EEE7]/20 ring-1 ring-emerald-500/30'
                    : 'border-[#E8DFD3] bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyStock}
                      onChange={(e) => setApplyStock(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B2825C] focus:ring-[#B2825C]"
                    />
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Package className="w-4 h-4 text-[#B2825C]" />
                      স্টক পরিমাণ আপডেট (Stock Update)
                    </span>
                  </label>
                  <span className="text-xs text-slate-400">নতুন চালানের স্টক যোগ বা পরিবর্তন</span>
                </div>

                {applyStock && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        স্টক পরিবর্তনের ধরন:
                      </label>
                      <select
                        value={stockMode}
                        onChange={(e) => setStockMode(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#B2825C] outline-hidden font-medium"
                      >
                        <option value="add">➕ বর্তমান স্টকে যোগ করুন (যেমন: +১০)</option>
                        <option value="set">📌 নির্দিষ্ট স্টক সেট করুন (যেমন: ১০০)</option>
                        <option value="subtract">➖ বর্তমান স্টক থেকে বিয়োগ করুন (যেমন: -৫)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        পরিমাণ (সংখ্যায়):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required={applyStock}
                        value={stockValue}
                        onChange={(e) => setStockValue(e.target.value)}
                        placeholder="যেমন: ১০ বা ৫০"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                      />
                    </div>

                    {/* Stock Quick Presets */}
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="text-slate-400 font-medium">দ্রুত প্রি-সেট:</span>
                      {[
                        { label: '+১০ যোগ', mode: 'add', val: '10' },
                        { label: '+২৫ যোগ', mode: 'add', val: '25' },
                        { label: '+৫০ যোগ', mode: 'add', val: '50' },
                        { label: '+১০০ যোগ', mode: 'add', val: '100' },
                        { label: '০ তে রিসেট (খালি)', mode: 'set', val: '0' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setStockMode(preset.mode as any);
                            setStockValue(preset.val);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-[#F5EEE7] hover:text-[#83593B] border border-[#E8DFD3] rounded-lg font-medium text-slate-600 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: SELLING PRICE UPDATE */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  applySellingPrice
                    ? 'border-[#B2825C] bg-[#F5EEE7]/20 ring-1 ring-emerald-500/30'
                    : 'border-[#E8DFD3] bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applySellingPrice}
                      onChange={(e) => setApplySellingPrice(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B2825C] focus:ring-[#B2825C]"
                    />
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-[#B2825C]" />
                      বিক্রয় মূল্য আপডেট (Selling Price Update)
                    </span>
                  </label>
                  <span className="text-xs text-slate-400">খুচরা মূল্য সমন্বয়</span>
                </div>

                {applySellingPrice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 animate-in fade-in">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        মূল্য সমন্বয়ের ধরন:
                      </label>
                      <select
                        value={sellingPriceMode}
                        onChange={(e) => setSellingPriceMode(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#B2825C] outline-hidden font-medium"
                      >
                        <option value="increase_fixed">📈 নির্দিষ্ট টাকা বৃদ্ধি (+৳)</option>
                        <option value="increase_percent">📊 শতাংশ বৃদ্ধি (+%)</option>
                        <option value="decrease_fixed">📉 নির্দিষ্ট টাকা কমান (-৳)</option>
                        <option value="decrease_percent">🏷️ শতাংশ কমান (-% ছাড়)</option>
                        <option value="set">📌 নির্দিষ্ট বিক্রয় মূল্য সেট করুন (৳)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        মান ({sellingPriceMode.includes('percent') ? '%' : settings.currency}):
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required={applySellingPrice}
                        value={sellingPriceValue}
                        onChange={(e) => setSellingPriceValue(e.target.value)}
                        placeholder="যেমন: ৫ বা ১০"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-[#83593B] focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                      />
                    </div>

                    {/* Price Quick Presets */}
                    <div className="sm:col-span-2 flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="text-slate-400 font-medium">দ্রুত রেট:</span>
                      {[
                        { label: '+৳২ বৃদ্ধি', mode: 'increase_fixed', val: '2' },
                        { label: '+৳৫ বৃদ্ধি', mode: 'increase_fixed', val: '5' },
                        { label: '+৫% বৃদ্ধি', mode: 'increase_percent', val: '5' },
                        { label: '+১০% বৃদ্ধি', mode: 'increase_percent', val: '10' },
                        { label: '-৫% ডিসকাউন্ট', mode: 'decrease_percent', val: '5' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setSellingPriceMode(preset.mode as any);
                            setSellingPriceValue(preset.val);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-[#F5EEE7] hover:text-[#83593B] border border-[#E8DFD3] rounded-lg font-medium text-slate-600 transition-colors"
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION C: COST PRICE UPDATE (কেনা দাম) */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  applyCostPrice
                    ? 'border-[#B2825C] bg-[#F5EEE7]/20 ring-1 ring-emerald-500/30'
                    : 'border-[#E8DFD3] bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={applyCostPrice}
                      onChange={(e) => setApplyCostPrice(e.target.checked)}
                      className="w-4 h-4 rounded text-[#B2825C] focus:ring-[#B2825C]"
                    />
                    <span className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-[#B2825C]" />
                      কেনা দাম আপডেট (Cost Price Update)
                    </span>
                  </label>
                  <span className="text-xs text-slate-400">পাইকারি ক্রয়ের খরচ সমন্বয়</span>
                </div>

                {applyCostPrice && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 animate-in fade-in">
                    <div>
                      <select
                        value={costPriceMode}
                        onChange={(e) => setCostPriceMode(e.target.value as any)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:ring-2 focus:ring-[#B2825C] outline-hidden font-medium"
                      >
                        <option value="increase_fixed">📈 নির্দিষ্ট টাকা বৃদ্ধি (+৳)</option>
                        <option value="increase_percent">📊 শতাংশ বৃদ্ধি (+%)</option>
                        <option value="decrease_fixed">📉 নির্দিষ্ট টাকা কমান (-৳)</option>
                        <option value="set">📌 নির্দিষ্ট ক্রয়মূল্য সেট করুন</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        required={applyCostPrice}
                        value={costPriceValue}
                        onChange={(e) => setCostPriceValue(e.target.value)}
                        placeholder="মান লিখুন..."
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* LIVE PREVIEW TABLE: Shows before & after for selected products */}
              <div className="p-4 bg-slate-50 border border-[#E8DFD3] rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>পরিবর্তনের লাইভ প্রিভিউ (Live Preview):</span>
                  <span className="text-[11px] text-slate-500">
                    পূর্বের মান ➔ আপডেটের পরের মান
                  </span>
                </div>

                <div className="max-h-44 overflow-y-auto border border-[#E8DFD3] rounded-xl bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-500 font-semibold border-b border-[#E8DFD3] sticky top-0">
                      <tr>
                        <th className="py-2 px-3">পণ্য</th>
                        {applyStock && <th className="py-2 px-3 text-center">স্টক পরিবর্তন</th>}
                        {applySellingPrice && <th className="py-2 px-3 text-right">বিক্রয় মূল্য</th>}
                        {applyCostPrice && <th className="py-2 px-3 text-right">কেনা দাম</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono">
                      {selectedProducts.map((p) => {
                        const { newStock, newSellingPrice, newCostPrice } =
                          calculateNewProductValues(p);
                        return (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-sans font-medium text-slate-800 truncate max-w-[140px]">
                              {p.banglaName || p.name}
                            </td>

                            {applyStock && (
                              <td className="py-2 px-3 text-center">
                                <span className="text-slate-400">{p.stock}</span>
                                <span className="mx-1 text-slate-300">➔</span>
                                <span
                                  className={`font-bold ${
                                    newStock > p.stock
                                      ? 'text-[#B2825C]'
                                      : newStock < p.stock
                                      ? 'text-red-500'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {newStock} {p.unit}
                                </span>
                              </td>
                            )}

                            {applySellingPrice && (
                              <td className="py-2 px-3 text-right">
                                <span className="text-slate-400">{p.sellingPrice}</span>
                                <span className="mx-1 text-slate-300">➔</span>
                                <span
                                  className={`font-bold ${
                                    newSellingPrice > p.sellingPrice
                                      ? 'text-[#B2825C]'
                                      : newSellingPrice < p.sellingPrice
                                      ? 'text-amber-600'
                                      : 'text-slate-700'
                                  }`}
                                >
                                  {settings.currency}{newSellingPrice}
                                </span>
                              </td>
                            )}

                            {applyCostPrice && (
                              <td className="py-2 px-3 text-right">
                                <span className="text-slate-400">{p.costPrice}</span>
                                <span className="mx-1 text-slate-300">➔</span>
                                <span className="font-bold text-slate-800">
                                  {settings.currency}{newCostPrice}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsBulkEditModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs sm:text-sm transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-[#B2825C] to-[#8C6241] hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-98"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {selectedProductIds.length}টি পণ্যের আপডেট নিশ্চিত করুন
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD / EDIT SINGLE PRODUCT                        */}
      {/* ========================================================= */}
      {(isAddModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#B2825C]" />
                <span>
                  {editingProduct
                    ? 'পণ্য তথ্য সংশোধন (Edit)'
                    : 'নতুন পণ্য নিবন্ধন (Add Product)'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI OCR Scanner Trigger */}
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>এআই লেবেল ও প্রাইস ট্যাগ স্ক্যানার</span>
                </p>
                <p className="text-[11px] text-purple-700">
                  পণ্যের ছবি বা প্যাকেজিং তুললে নাম ও দাম স্বয়ংক্রিয়ভাবে পূরণ হবে
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsScanHistoryOpen(true)}
                  className="px-2.5 py-1.5 bg-white hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="পূর্বে স্ক্যান করা তালিকা থেকে নির্বাচন করুন"
                >
                  <History className="w-3.5 h-3.5 text-purple-600" />
                  <span>হিস্ট্রি ({scanHistory.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzingImage}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{isAnalyzingImage ? 'স্ক্যান হচ্ছে...' : 'ছবি তুলুন'}</span>
                </button>
              </div>
            </div>

            {aiAnalysisResult && (
              <p className="mt-2 text-xs font-semibold text-purple-800 bg-purple-100/60 p-2 rounded-lg">
                {aiAnalysisResult}
              </p>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-3.5 mt-4 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    পণ্যের বাংলা নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={banglaName}
                    onChange={(e) => setBanglaName(e.target.value)}
                    placeholder="যেমন: মিনিকেট চাল"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    ইংরেজি নাম (Optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Miniket Rice"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ক্যাটাগরি</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden bg-white text-slate-800"
                  >
                    <option value="rice_flour">চাল, ডাল ও আটা</option>
                    <option value="oil_ghee">তেল ও ঘি</option>
                    <option value="spices_salt">মসলা ও লবণ</option>
                    <option value="sugar_tea">চিনি ও চা পাতা</option>
                    <option value="snacks_biscuits">বিস্কুট ও স্ন্যাক্স</option>
                    <option value="soap_detergent">সাবান ও ডিটারজেন্ট</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">একক (Unit)</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as UnitType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden bg-white text-slate-800"
                  >
                    <option value="kg">কেজি (kg)</option>
                    <option value="litre">লিটার (litre)</option>
                    <option value="packet">প্যাকেট (packet)</option>
                    <option value="piece">পিস (piece)</option>
                    <option value="gm">গ্রাম (gm)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    কেনা দাম ({settings.currency})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="যেমন: ৬৫"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    বিক্রয় মূল্য * ({settings.currency})
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="any"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="যেমন: ৭২"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    প্রারম্ভিক স্টক পরিমাণ
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="যেমন: ১০০"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    কম স্টক সতর্কতা লেভেল
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minStock}
                    onChange={(e) => setMinStock(e.target.value)}
                    placeholder="যেমন: ২০"
                    className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  বারকোড কোড (Optional)
                </label>
                <input
                  type="text"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="যেমন: 8901001"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  {editingProduct ? 'পরিবর্তন সংরক্ষণ করুন' : 'পণ্য যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: PRODUCT SCAN HISTORY MODAL                       */}
      {/* ========================================================= */}
      <ProductScanHistoryModal
        isOpen={isScanHistoryOpen}
        onClose={() => setIsScanHistoryOpen(false)}
        onSelectForForm={handleSelectScannedItem}
      />
    </div>
  );
};
