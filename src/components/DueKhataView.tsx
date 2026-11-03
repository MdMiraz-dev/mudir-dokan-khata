import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Search,
  Plus,
  Send,
  Phone,
  Calendar,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  DollarSign,
  Download,
  MessageCircle,
  FileSpreadsheet,
  X,
  Clock,
  Printer
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { Customer } from '../types';
import { openSmsApp, openWhatsApp, createDueSmsText } from '../utils/sms';
import { exportCustomersDueToExcel } from '../utils/csvExport';
import { generateCustomerDueReceiptPdf } from '../utils/pdfGenerator';

export const DueKhataView: React.FC = () => {
  const { customers, receiveCustomerPayment, giveCustomerDue, addCustomer, settings } = useKhata();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDueOnly, setFilterDueOnly] = useState(true);
  const [overdueDaysFilter, setOverdueDaysFilter] = useState<number>(0);

  // Modals
  const [paymentCustomer, setPaymentCustomer] = useState<Customer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [giveDueCustomer, setGiveDueCustomer] = useState<Customer | null>(null);
  const [giveDueAmount, setGiveDueAmount] = useState('');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustDue, setNewCustDue] = useState('0');

  // SMS Modal
  const [smsCustomer, setSmsCustomer] = useState<Customer | null>(null);
  const [smsCustomText, setSmsCustomText] = useState('');

  // Calculate overdue days
  const getCustomerOverdueDays = (customer: Customer): number => {
    if (!customer.lastTransactionDate) return 0;
    const diffTime = Math.abs(Date.now() - new Date(customer.lastTransactionDate).getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return (customers || []).filter((c) => {
      if (!c) return false;
      const matchesSearch =
        (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.phone || '').includes(searchQuery) ||
        (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesDue = !filterDueOnly || (c.totalDue || 0) > 0;
      const days = getCustomerOverdueDays(c);
      const matchesOverdue = overdueDaysFilter === 0 || ((c.totalDue || 0) > 0 && days >= overdueDaysFilter);

      return matchesSearch && matchesDue && matchesOverdue;
    });
  }, [customers, searchQuery, filterDueOnly, overdueDaysFilter]);

  const totalDueSum = useMemo(() => {
    return (customers || []).reduce((sum, c) => sum + (c?.totalDue || 0), 0);
  }, [customers]);

  const dueCustomerCount = useMemo(() => {
    return (customers || []).filter((c) => (c?.totalDue || 0) > 0).length;
  }, [customers]);

  const handleOpenSmsModal = (c: Customer) => {
    setSmsCustomer(c);
    setSmsCustomText(createDueSmsText(c, settings));
  };

  const handleAddCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim(),
      totalDue: parseFloat(newCustDue) || 0
    });

    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');
    setNewCustDue('0');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentCustomer) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    receiveCustomerPayment(paymentCustomer.id, amount);
    setPaymentCustomer(null);
    setPaymentAmount('');
  };

  const handleGiveDueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!giveDueCustomer) return;
    const amount = parseFloat(giveDueAmount);
    if (isNaN(amount) || amount <= 0) return;

    giveCustomerDue(giveDueCustomer.id, amount);
    setGiveDueCustomer(null);
    setGiveDueAmount('');
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Banner KPI Summary */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-800">মুদির দোকানের বাকির খাতা (Due Ledger)</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              গ্রাহকের বাকি হিসাব, বকেয়া আদায়, এসএমএস রিমাইন্ডার ও স্টেটমেন্ট
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => exportCustomersDueToExcel(customers, settings)}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-xl transition-colors border border-[#E8DFD3]"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#B2825C]" />
              <span>এক্সেল ডাউনলোড</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddCustomerOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন গ্রাহক যোগ</span>
            </button>
          </div>
        </div>

        {/* Quick Numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
          <div className="bg-red-50/70 border border-red-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-red-600">মোট বকেয়া বাকি</p>
            <p className="text-xl sm:text-2xl font-black text-red-700 mt-1">
              {settings.currency}{totalDueSum.toLocaleString()}
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3">
            <p className="text-xs font-semibold text-amber-700">বাকিদার গ্রাহক সংখ্যা</p>
            <p className="text-xl sm:text-2xl font-black text-amber-800 mt-1">
              {dueCustomerCount} জন
            </p>
          </div>

          <div className="bg-[#F5EEE7] border border-[#DEC4AD] rounded-xl p-3 col-span-2 sm:col-span-1">
            <p className="text-xs font-semibold text-[#83593B]">নিবন্ধিত মোট গ্রাহক</p>
            <p className="text-xl sm:text-2xl font-black text-[#6E472A] mt-1">
              {customers.length} জন
            </p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-4 py-2 border border-[#E8DFD3] rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs w-full md:w-auto">
          <button
            type="button"
            onClick={() => setFilterDueOnly(!filterDueOnly)}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
              filterDueOnly
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {filterDueOnly ? '● শুধু বাকি আছে এমন' : 'সকল গ্রাহক'}
          </button>

          <span className="text-slate-400">|</span>

          <span className="font-semibold text-slate-500">বাকি বয়স:</span>
          {[
            { label: 'সকল', days: 0 },
            { label: '৭+ দিন', days: 7 },
            { label: '১৫+ দিন', days: 15 },
            { label: '৩০+ দিন', days: 30 }
          ].map((item) => (
            <button
              key={item.days}
              type="button"
              onClick={() => setOverdueDaysFilter(item.days)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                overdueDaysFilter === item.days
                  ? 'bg-[#B2825C] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Ledger List */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3.5 px-4">গ্রাহকের নাম ও ঠিকানা</th>
                <th className="py-3.5 px-4">মোবাইল নম্বর</th>
                <th className="py-3.5 px-4">সর্বশেষ লেনদেন</th>
                <th className="py-3.5 px-4 text-right">বর্তমান বাকি</th>
                <th className="py-3.5 px-4 text-center">লেনদেন ও আদায়</th>
                <th className="py-3.5 px-4 text-center">রিমাইন্ডার ও রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    কোনো গ্রাহক পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const overdueDays = getCustomerOverdueDays(cust);
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-800">{cust.name}</p>
                        <p className="text-xs text-slate-400">{cust.address || 'ঠিকানা দেওয়া নেই'}</p>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {cust.phone}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 text-xs">
                        {new Date(cust.lastTransactionDate).toLocaleDateString([], {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {cust.totalDue > 0 && overdueDays > 0 && (
                          <span className={`block text-[11px] font-semibold mt-0.5 ${overdueDays >= 15 ? 'text-red-500' : 'text-amber-500'}`}>
                            {overdueDays} দিন ধরে বাকি
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <span
                          className={`font-black text-sm sm:text-base px-2.5 py-1 rounded-lg ${
                            cust.totalDue > 0
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-[#F5EEE7] text-[#83593B] border border-emerald-200'
                          }`}
                        >
                          {settings.currency}{cust.totalDue.toLocaleString()}
                        </span>
                      </td>

                      {/* Transaction Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* Receive Payment */}
                          <button
                            type="button"
                            onClick={() => {
                              setPaymentCustomer(cust);
                              setPaymentAmount('');
                            }}
                            className="px-2.5 py-1.5 bg-[#F5EEE7] hover:bg-[#ECDDCF] text-[#6E472A] rounded-lg text-xs font-bold transition-colors"
                          >
                            জমা নিন
                          </button>

                          {/* Give Due */}
                          <button
                            type="button"
                            onClick={() => {
                              setGiveDueCustomer(cust);
                              setGiveDueAmount('');
                            }}
                            className="px-2.5 py-1.5 bg-red-100 hover:bg-red-200 text-red-800 rounded-lg text-xs font-bold transition-colors"
                          >
                            বাকি দিন
                          </button>
                        </div>
                      </td>

                      {/* Reminder & Receipt Actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* SMS Reminder */}
                          <button
                            type="button"
                            onClick={() => handleOpenSmsModal(cust)}
                            disabled={cust.totalDue <= 0}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 disabled:opacity-30 text-blue-700 rounded-lg transition-colors"
                            title="বাকি রিমাইন্ডার SMS পাঠান"
                          >
                            <Send className="w-4 h-4" />
                          </button>

                          {/* WhatsApp Reminder */}
                          <button
                            type="button"
                            onClick={() => openWhatsApp(cust.phone, createDueSmsText(cust, settings))}
                            disabled={cust.totalDue <= 0}
                            className="p-1.5 bg-[#F5EEE7] hover:bg-emerald-100 disabled:opacity-30 text-[#83593B] rounded-lg transition-colors"
                            title="WhatsApp-এ মেসেজ পাঠান"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          {/* PDF Statement */}
                          <button
                            type="button"
                            onClick={() => generateCustomerDueReceiptPdf(cust, settings)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="পিডিএফ স্টেটমেন্ট ডাউনলোড"
                          >
                            <Printer className="w-4 h-4" />
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

      {/* MODAL: Receive Payment */}
      {paymentCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                পাওনা জমা গ্রহণ: <span className="text-[#B2825C]">{paymentCustomer.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setPaymentCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between">
                <span className="text-slate-500">বর্তমান বকেয়া:</span>
                <span className="font-bold text-red-600">{settings.currency}{paymentCustomer.totalDue.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  জমা টাকার পরিমাণ ({settings.currency}):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={paymentCustomer.totalDue}
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder="টাকার অংক লিখুন..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold"
                />
              </div>

              {/* Quick Fill Full Due */}
              <button
                type="button"
                onClick={() => setPaymentAmount(paymentCustomer.totalDue.toString())}
                className="text-xs text-[#B2825C] font-semibold hover:underline block"
              >
                পুরো বকেয়া জমা ({settings.currency}{paymentCustomer.totalDue})
              </button>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentCustomer(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  জমা নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Give Manual Due */}
      {giveDueCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800">
                নতুন বাকি যোগ: <span className="text-red-600">{giveDueCustomer.name}</span>
              </h3>
              <button
                type="button"
                onClick={() => setGiveDueCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGiveDueSubmit} className="space-y-4 mt-4">
              <div className="p-3 bg-slate-50 rounded-xl text-xs flex justify-between">
                <span className="text-slate-500">বর্তমান বকেয়া:</span>
                <span className="font-bold text-slate-700">{settings.currency}{giveDueCustomer.totalDue.toLocaleString()}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  বাকি টাকার পরিমাণ ({settings.currency}):
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={giveDueAmount}
                  onChange={(e) => setGiveDueAmount(e.target.value)}
                  placeholder="টাকার অংক লিখুন..."
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-hidden font-bold"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGiveDueCustomer(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  বাকি যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Send SMS Reminder */}
      {smsCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Send className="w-5 h-5 text-blue-600" />
                <span>বাকি রিমাইন্ডার মেসেজ পাঠান</span>
              </h3>
              <button
                type="button"
                onClick={() => setSmsCustomer(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="p-3 bg-blue-50 rounded-xl text-xs space-y-1 text-blue-900">
                <p><strong>গ্রাহক:</strong> {smsCustomer.name} ({smsCustomer.phone})</p>
                <p><strong>বকেয়া টাকা:</strong> {settings.currency}{smsCustomer.totalDue.toLocaleString()}</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  এসএমএস টেক্সট (প্রয়োজনে সম্পাদনা করুন):
                </label>
                <textarea
                  rows={4}
                  value={smsCustomText}
                  onChange={(e) => setSmsCustomText(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openSmsApp(smsCustomer.phone, smsCustomText)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                  <span>সরাসরি মোবাইলের মেসেজ অ্যাপ দিয়ে পাঠান</span>
                </button>

                <button
                  type="button"
                  onClick={() => openWhatsApp(smsCustomer.phone, smsCustomText)}
                  className="flex-1 py-3 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp দিয়ে পাঠান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Customer */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#B2825C]" />
                <span>নতুন গ্রাহক নিবন্ধন</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomerSubmit} className="space-y-4 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">গ্রাহকের পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="যেমন: হাজী মোহাম্মদ রফিকুল"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">মোবাইল নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="যেমন: 01711223344"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ঠিকানা / পরিচিতি</label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="যেমন: বাড়ি নং ১২, বাজার রোড"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">পূর্বের প্রারম্ভিক বাকি (থাকলে)</label>
                <input
                  type="number"
                  min="0"
                  value={newCustDue}
                  onChange={(e) => setNewCustDue(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  গ্রাহক সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
