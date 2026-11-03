import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  Plus,
  Trash2,
  Calendar,
  PieChart as PieIcon,
  Tag,
  X
} from 'lucide-react';
import { useKhata } from '../context/KhataContext';
import { Expense, ExpenseCategory } from '../types';

export const ShopExpensesView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, settings } = useKhata();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('rent');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => e.date.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  const totalMonthlyExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    addExpense({
      title: title.trim(),
      category,
      amount: parseFloat(amount) || 0,
      notes: notes.trim() || undefined
    });

    setIsAddOpen(false);
    setTitle('');
    setAmount('');
    setNotes('');
  };

  const categoryLabels: { [key in ExpenseCategory]: string } = {
    rent: 'দোকান ভাড়া',
    electricity: 'বিদ্যুৎ বিল',
    transport: 'মালামাল পরিবহন',
    staff: 'কর্মচারীর বেতন',
    packaging: 'পলিথিন ও ব্যাগ',
    tea_snacks: 'আপ্যায়ন ও চা-নাস্তা',
    repair: 'মেরামত ও মেইনটেন্যান্স',
    other: 'অন্যান্য খরচ'
  };

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">দোকানের যাবতীয় খরচ (Shop Expenses)</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            ভাড়া, বিদ্যুৎ বিল, পরিবহন ও অন্যান্য খরচের হিসাব
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-1.5 border border-[#E8DFD3] rounded-xl text-xs font-semibold bg-slate-50 outline-hidden"
          />

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন খরচ যোগ</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl p-5 shadow-md flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">চলতি মাসের মোট দোকান খরচ</p>
          <p className="text-2xl sm:text-3xl font-black text-[#DEC4AD] mt-1">
            {settings.currency}{totalMonthlyExpenses.toLocaleString()}
          </p>
        </div>
        <div className="p-3 bg-white/10 rounded-2xl">
          <DollarSign className="w-8 h-8 text-[#DEC4AD]" />
        </div>
      </div>

      {/* Expenses List Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-[#E8DFD3]">
              <tr>
                <th className="py-3 px-4">তারিখ</th>
                <th className="py-3 px-4">খরচের বিবরণ</th>
                <th className="py-3 px-4">ক্যাটাগরি</th>
                <th className="py-3 px-4 text-right">টাকার পরিমাণ</th>
                <th className="py-3 px-4">নোট / মন্তব্য</th>
                <th className="py-3 px-4 text-center">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    এই মাসে কোনো খরচ যুক্ত করা হয়নি
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                      {new Date(exp.date).toLocaleDateString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{exp.title}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 rounded-md text-xs text-slate-600 font-medium">
                        {categoryLabels[exp.category]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-black text-red-600">
                      -{settings.currency}{exp.amount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-xs">{exp.notes || '—'}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`আপনি কি "${exp.title}" খরচের রেকর্ডটি মুছতে চান?`)) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Add Expense */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#E8DFD3]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#B2825C]" />
                <span>নতুন দোকান খরচ যোগ</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3.5 mt-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">খরচের নাম / বিবরণ *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="যেমন: চলতি মাসের দোকান ভাড়া বা পল্লি বিদ্যুৎ বিল"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ক্যাটাগরি</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden bg-white text-slate-800"
                >
                  <option value="rent">দোকান ভাড়া</option>
                  <option value="electricity">বিদ্যুৎ বিল</option>
                  <option value="transport">মালামাল পরিবহন</option>
                  <option value="staff">কর্মচারীর বেতন</option>
                  <option value="packaging">পলিথিন ও ব্যাগ</option>
                  <option value="tea_snacks">আপ্যায়ন ও চা-নাস্তা</option>
                  <option value="repair">মেরামত ও রক্ষণাবেক্ষণ</option>
                  <option value="other">অন্যান্য খরচ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">টাকার পরিমাণ * ({settings.currency})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="যেমন: ১৫০০"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">নোট / মন্তব্য (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="যেমন: বিকাশের মাধ্যমে পরিশোধ"
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#B2825C] outline-hidden"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#B2825C] hover:bg-[#9E6F4B] text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                >
                  খরচ সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
