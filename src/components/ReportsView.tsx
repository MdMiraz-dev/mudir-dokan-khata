import React, { useState, useMemo } from 'react';
import {
  FileText,
  FileSpreadsheet,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  CreditCard,
  Package,
  Receipt,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useKhata } from '../context/KhataContext';
import { generateSalesReportPdf } from '../utils/pdfGenerator';
import { exportSalesToExcel, exportCustomersDueToExcel, exportProductsToExcel } from '../utils/csvExport';
import { Sale } from '../types';

interface ReportsViewProps {
  onSelectSaleForReceipt?: (sale: Sale) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ onSelectSaleForReceipt }) => {
  const { sales, expenses, customers, products, settings } = useKhata();

  // Selected Month
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Filter sales for the selected month
  const filteredSales = useMemo(() => {
    return sales.filter((s) => s.date.startsWith(selectedMonth));
  }, [sales, selectedMonth]);

  // Aggregate metrics
  const totalRevenue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.total, 0);
  }, [filteredSales]);

  const totalPaid = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.paid, 0);
  }, [filteredSales]);

  const totalDue = useMemo(() => {
    return filteredSales.reduce((sum, s) => sum + s.due, 0);
  }, [filteredSales]);

  const totalProfit = useMemo(() => {
    return (filteredSales || []).reduce((sum, s) => {
      // Calculate profit if stored or default ~12% gross margin
      if (typeof s?.profit === 'number') return sum + s.profit;
      const cost = (s?.items || []).reduce(
        (c, it) => c + (it?.costPrice || (it?.unitPrice || 0) * 0.85) * (it?.quantity || 1),
        0
      );
      return sum + ((s?.total || 0) - cost);
    }, 0);
  }, [filteredSales]);

  const monthlyExpenses = useMemo(() => {
    return expenses
      .filter((e) => e.date.startsWith(selectedMonth))
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses, selectedMonth]);

  const netProfit = totalProfit - monthlyExpenses;

  // Chart data: daily sales in selected month
  const dailySalesData = useMemo(() => {
    const map: { [day: string]: number } = {};
    filteredSales.forEach((s) => {
      const day = s.date.slice(8, 10);
      map[day] = (map[day] || 0) + s.total;
    });

    const [year, month] = selectedMonth.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate() || 30;
    const data = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = i < 10 ? `0${i}` : `${i}`;
      data.push({
        day: `${dStr} তারিখ`,
        sales: map[dStr] || 0
      });
    }
    return data;
  }, [filteredSales]);

  // Payment method distribution
  const paymentMethodData = useMemo(() => {
    let cash = 0;
    let due = 0;
    let digital = 0;

    filteredSales.forEach((s) => {
      cash += s.paid;
      due += s.due;
      if (s.paymentMethod === 'bkash' || s.paymentMethod === 'nagad') {
        digital += s.paid;
      }
    });

    return [
      { name: 'নগদ আদায়', value: cash, color: '#10b981' },
      { name: 'বাকি পাওনা', value: due, color: '#ef4444' }
    ].filter((item) => item.value > 0);
  }, [filteredSales]);

  // Format month name for display
  const monthDisplayTitle = useMemo(() => {
    const [year, month] = selectedMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' });
  }, [selectedMonth]);

  // PDF Export Trigger
  const handleDownloadPdf = () => {
    if (filteredSales.length === 0) {
      setExportNotice('নির্বাচিত মাসে কোনো বিক্রয় রেকর্ড নেই। তবে একটি নমুনা ফরম্যাট তৈরি করা হচ্ছে...');
    }
    generateSalesReportPdf(
      filteredSales.length > 0 ? filteredSales : sales,
      settings,
      monthDisplayTitle,
      totalRevenue,
      totalDue,
      totalProfit
    );
    setExportNotice('পিডিএফ রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  // Excel Export Trigger
  const handleDownloadExcel = () => {
    exportSalesToExcel(
      filteredSales.length > 0 ? filteredSales : sales,
      settings,
      monthDisplayTitle
    );
    setExportNotice('এক্সেল (.xlsx) রিপোর্ট সফলভাবে ডাউনলোড হয়েছে!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Month Filter */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-800">ব্যবসায়িক লাভ-লোকসান ও বিক্রয় রিপোর্ট</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            মাসিক বিক্রয় বিশ্লেষণ, নগদ ও বাকি রিপোর্ট এবং এক্সপোর্ট
          </p>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-[#E8DFD3] rounded-xl px-3 py-1.5">
          <Calendar className="w-4 h-4 text-[#B2825C]" />
          <span className="text-xs font-semibold text-slate-600">মাস নির্বাচন:</span>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="text-xs font-bold text-slate-800 bg-transparent outline-hidden cursor-pointer"
          />
        </div>
      </div>

      {/* NEW DISTINCT EXPORT SECTION */}
      <div className="bg-gradient-to-r from-[#222120] via-[#2A2623] to-[#1F1E1D] rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-[#38332E] relative overflow-hidden">
        {/* Background decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#B2825C]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#35312C] border border-[#48423B] rounded-full text-xs font-bold text-[#DEC8B3]">
              <Download className="w-3.5 h-3.5 animate-bounce" />
              <span>রিপোর্ট এক্সপোর্ট ও ডাউনলোড সেকশন (Export Hub)</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {monthDisplayTitle}-এর পূর্ণাঙ্গ বিক্রয় রিপোর্ট সংগ্রহ করুন
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              এক ক্লিকে আপনার দোকানের বিক্রয়, বাকি পাওনা ও মুনাফার পুঙ্খানুপুঙ্খ বিবরণ PDF ও Excel শিটে সংরক্ষণ করুন।
            </p>
          </div>

          {/* VISUALLY DISTINCT DOWNLOAD BUTTONS */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 w-full sm:w-auto justify-center">
            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-2xl shadow-lg hover:shadow-red-500/25 transition-all transform active:scale-95 border border-rose-400/30 text-sm group"
            >
              <div className="p-1.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-normal text-rose-100">অফিসিয়াল ফরম্যাট</span>
                <span className="block text-sm sm:text-base font-bold">Download PDF</span>
              </div>
            </button>

            {/* Download Excel Button */}
            <button
              type="button"
              onClick={handleDownloadExcel}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#B2825C] to-[#8C6241] hover:from-[#9E6F4B] hover:to-[#785135] text-white font-bold rounded-2xl shadow-lg hover:shadow-[#B2825C]/25 transition-all transform active:scale-95 border border-emerald-400/30 text-sm group"
            >
              <div className="p-1.5 bg-white/20 rounded-xl group-hover:bg-white/30 transition-colors">
                <FileSpreadsheet className="w-5 h-5 text-white" />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-[11px] font-normal text-[#C7BEB5]">স্প্রেডশিট ডেটা</span>
                <span className="block text-sm sm:text-base font-bold">Download Excel</span>
              </div>
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {exportNotice && (
          <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-center text-xs font-semibold text-[#DEC8B3] animate-in fade-in">
            {exportNotice}
          </div>
        )}

        {/* Sub-Export Shortcuts */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <span>অতিরিক্ত রিপোর্ট:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => exportProductsToExcel(products)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Package className="w-3.5 h-3.5 text-[#DEC8B3]" />
              <span>স্টক ইনভেন্টরি (.xlsx)</span>
            </button>
            <button
              type="button"
              onClick={() => exportCustomersDueToExcel(customers, settings)}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-teal-300" />
              <span>বাকির খাতা লেজার (.xlsx)</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <p className="text-xs font-semibold text-slate-500">মোট বিক্রয় ({monthDisplayTitle})</p>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {settings.currency}{totalRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-[#B2825C] mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>মোট {filteredSales.length}টি ইনভয়েস</span>
          </p>
        </div>

        {/* Gross Profit */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <p className="text-xs font-semibold text-slate-500">আনুমানিক মোট লাভ</p>
          <p className="text-xl sm:text-2xl font-bold text-[#B2825C] mt-1">
            {settings.currency}{totalProfit.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">দোকান খরচ বাদে: {settings.currency}{netProfit.toLocaleString()}</p>
        </div>

        {/* Cash Collected */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <p className="text-xs font-semibold text-slate-500">নগদ সংগৃহীত</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
            {settings.currency}{totalPaid.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">ক্যাশ ও ডিজিটাল পেমেন্ট</p>
        </div>

        {/* Due Amount */}
        <div className="bg-white p-4 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <p className="text-xs font-semibold text-slate-500">বাকি বিক্রয়</p>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
            {settings.currency}{totalDue.toLocaleString()}
          </p>
          <p className="text-[11px] text-red-500 mt-1">গ্রাহকের কাছে বকেয়া</p>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#B2825C]" />
            <span>দৈনিক বিক্রয় গ্রাফ ({monthDisplayTitle})</span>
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySalesData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                <Tooltip
                  formatter={(val: number) => [`${settings.currency}${val}`, 'বিক্রয়']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash vs Due Pie Chart */}
        <div className="bg-white p-5 rounded-2xl border border-[#E8DFD3] shadow-xs flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-2">নগদ বনাম বাকির অনুপাত</h3>
          <div className="flex-1 h-52 flex items-center justify-center">
            {paymentMethodData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={75}
                    innerRadius={45}
                  >
                    {paymentMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: number) => [`${settings.currency}${val}`, 'পরিমাণ']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">কোনো তথ্য নেই</p>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 text-xs font-medium pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#B2825C]" />
              <span>নগদ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span>বাকি</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sales Ledger Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-[#B2825C]" />
            <span>বিক্রয় ইনভয়েস তালিকা ({filteredSales.length})</span>
          </h3>
          <span className="text-xs text-slate-500">{monthDisplayTitle}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">ইনভয়েস #</th>
                <th className="py-3 px-4">তারিখ ও সময়</th>
                <th className="py-3 px-4">গ্রাহক</th>
                <th className="py-3 px-4 text-center">পণ্য সংখ্যা</th>
                <th className="py-3 px-4 text-right">মোট বিল</th>
                <th className="py-3 px-4 text-right">নগদ</th>
                <th className="py-3 px-4 text-right">বাকি</th>
                <th className="py-3 px-4 text-center">রসিদ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    এই মাসে এখনো কোনো বিক্রয় সম্পন্ন হয়নি
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-700">{sale.id}</td>
                    <td className="py-3 px-4 text-slate-500 text-xs">
                      {new Date(sale.date).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {sale.customerName || <span className="text-slate-400">ক্যাশ ক্রেতা</span>}
                    </td>
                    <td className="py-3 px-4 text-center text-slate-600">{sale.items.length}টি</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {settings.currency}{sale.total.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-[#B2825C]">
                      {settings.currency}{sale.paid.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-red-600">
                      {sale.due > 0 ? `${settings.currency}${sale.due.toFixed(2)}` : '—'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectSaleForReceipt && onSelectSaleForReceipt(sale)}
                        className="p-1.5 hover:bg-[#F5EEE7] text-[#83593B] rounded-lg transition-colors"
                        title="রসিদ দেখুন / প্রিন্ট করুন"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
