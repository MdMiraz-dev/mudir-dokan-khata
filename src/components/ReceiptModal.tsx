import React from 'react';
import { Printer, Download, X, Store, CheckCircle } from 'lucide-react';
import { Sale } from '../types';
import { useKhata } from '../context/KhataContext';

interface ReceiptModalProps {
  sale: Sale | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { settings } = useKhata();
  if (!sale) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl border border-[#E8DFD3] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Actions */}
        <div className="p-3 bg-slate-50 border-b border-[#E8DFD3] flex items-center justify-between no-print">
          <span className="text-xs font-bold text-slate-700">ডিজিটাল ক্যাশ মেমো / রসিদ</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Printable Receipt Body */}
        <div id="thermal-receipt" className="p-5 font-mono text-xs text-slate-800 space-y-3 overflow-y-auto">
          {/* Shop Header */}
          <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-3">
            <h2 className="font-bold text-base text-slate-900">{settings.shopName}</h2>
            <p className="text-[11px] text-slate-500">{settings.address}</p>
            <p className="text-[11px] text-slate-500">মোবাইল: {settings.phone}</p>
            <p className="text-[10px] text-slate-400">প্রোপ্রাইটর: {settings.ownerName}</p>
          </div>

          {/* Invoice Info */}
          <div className="text-[11px] space-y-0.5 border-b border-dashed border-slate-300 pb-2">
            <div className="flex justify-between">
              <span>ইনভয়েস নং:</span>
              <span className="font-bold">{sale.id}</span>
            </div>
            <div className="flex justify-between">
              <span>তারিখ:</span>
              <span>{new Date(sale.date).toLocaleString()}</span>
            </div>
            {sale.customerName && (
              <div className="flex justify-between">
                <span>গ্রাহক:</span>
                <span className="font-bold">{sale.customerName}</span>
              </div>
            )}
          </div>

          {/* Items Table */}
          <div className="border-b border-dashed border-slate-300 pb-2">
            <div className="grid grid-cols-12 font-bold text-[10px] uppercase text-slate-500 pb-1">
              <span className="col-span-6">বিবরণ</span>
              <span className="col-span-2 text-center">পরিমাণ</span>
              <span className="col-span-4 text-right">মূল্য</span>
            </div>
            <div className="space-y-1">
              {sale.items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 text-[11px]">
                  <span className="col-span-6 truncate">{item.productName}</span>
                  <span className="col-span-2 text-center">{item.quantity}</span>
                  <span className="col-span-4 text-right font-medium">
                    {settings.currency}{item.totalPrice.toFixed(0)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Calculation */}
          <div className="space-y-1 text-[11px] pt-1 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span>উপমোট:</span>
              <span>{settings.currency}{sale.subtotal.toFixed(2)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between text-[#B2825C]">
                <span>ছাড়:</span>
                <span>-{settings.currency}{sale.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-1">
              <span>সর্বমোট:</span>
              <span>{settings.currency}{sale.total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-[#83593B]">
              <span>নগদ জমা:</span>
              <span>{settings.currency}{sale.paid.toFixed(2)}</span>
            </div>
            {sale.due > 0 && (
              <div className="flex justify-between font-bold text-red-600">
                <span>বাকি পাওনা:</span>
                <span>{settings.currency}{sale.due.toFixed(2)}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-2 text-[10px] text-slate-400 space-y-0.5">
            <p className="font-semibold text-slate-600">আবার আসবেন, ধন্যবাদ!</p>
            <p>বিক্রিত মাল ফেরত নেওয়া হয় (শর্ত প্রযোজ্য)</p>
            <p>সফটওয়্যার: Remix Remix মুদির দোকান খাতা</p>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 bg-slate-50 border-t border-[#E8DFD3] flex gap-2 no-print">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট রসিদ</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
          >
            বন্ধ
          </button>
        </div>
      </div>
    </div>
  );
};
