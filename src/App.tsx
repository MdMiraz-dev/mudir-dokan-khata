import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Package,
  FileText,
  DollarSign,
  Bot,
  BookOpen,
  Settings as SettingsIcon,
  Mic,
  Menu,
  X,
  Award,
  Sparkles
} from 'lucide-react';
import { useKhata } from './context/KhataContext';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { POSView } from './components/POSView';
import { DueKhataView } from './components/DueKhataView';
import { InventoryView } from './components/InventoryView';
import { ReportsView } from './components/ReportsView';
import { ShopExpensesView } from './components/ShopExpensesView';
import { GeminiAssistantView } from './components/GeminiAssistantView';
import { MasailView } from './components/MasailView';
import { SettingsView } from './components/SettingsView';
import { ResumeView } from './components/ResumeView';
import { AboutView } from './components/AboutView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VoiceCartModal } from './components/VoiceCartModal';
import { GeminiLiveVoiceModal } from './components/GeminiLiveVoiceModal';
import { ReceiptModal } from './components/ReceiptModal';
import { Sale } from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedReceiptSale, setSelectedReceiptSale] = useState<Sale | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    isGlobalSearchOpen,
    setIsGlobalSearchOpen,
    isVoiceCartOpen,
    setIsVoiceCartOpen,
    isLiveVoiceOpen,
    setIsLiveVoiceOpen
  } = useKhata();

  const navigationTabs = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'pos', label: 'ক্যাশ কাউন্টার (POS)', icon: ShoppingCart },
    { id: 'due_khata', label: 'বাকির খাতা', icon: CreditCard },
    { id: 'inventory', label: 'পণ্য স্টক', icon: Package },
    { id: 'reports', label: 'রিপোর্ট ও এক্সপোর্ট', icon: FileText },
    { id: 'expenses', label: 'দোকান খরচ', icon: DollarSign },
    { id: 'ai_assistant', label: 'এআই ও বাজার দর', icon: Bot },
    { id: 'about', label: 'পরিচিতি (About)', icon: Award },
    { id: 'resume', label: 'সিভি / রেজুমে', icon: FileText },
    { id: 'masail', label: 'ব্যবসায়িক রুলস', icon: BookOpen },
    { id: 'settings', label: 'সেটিংস', icon: SettingsIcon }
  ];

  const handleSaleCompleted = (sale: Sale) => {
    setSelectedReceiptSale(sale);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col text-[#232323] pb-16 md:pb-6 overflow-x-hidden w-full max-w-full">
      {/* Top Main Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main App Container */}
      <div className="max-w-7xl w-full mx-auto px-2.5 sm:px-6 py-3 sm:py-4 flex-1 flex flex-col gap-3 sm:gap-4 overflow-x-hidden">
        {/* Desktop Tab Bar */}
        <nav className="hidden md:flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-[#E8DFD3] shadow-xs overflow-x-auto">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap select-none cursor-pointer ${
                  isActive
                    ? 'bg-[#B2825C] text-white shadow-xs'
                    : 'text-[#7A6E65] hover:bg-[#F5EEE7] hover:text-[#232323]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* View Switcher */}
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {activeTab === 'dashboard' && <DashboardView onNavigateTab={setActiveTab} />}
          {activeTab === 'pos' && <POSView onSaleCompleted={handleSaleCompleted} />}
          {activeTab === 'due_khata' && <DueKhataView />}
          {activeTab === 'inventory' && <InventoryView />}
          {activeTab === 'reports' && (
            <ReportsView onSelectSaleForReceipt={(s) => setSelectedReceiptSale(s)} />
          )}
          {activeTab === 'expenses' && <ShopExpensesView />}
          {activeTab === 'ai_assistant' && <GeminiAssistantView />}
          {activeTab === 'about' && <AboutView onNavigateTab={setActiveTab} />}
          {activeTab === 'resume' && <ResumeView />}
          {activeTab === 'masail' && <MasailView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar - Android Optimized */}
      <div className="no-print fixed bottom-0 inset-x-0 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DFD3] z-40 md:hidden flex items-center justify-around py-1.5 px-1 shadow-lg">
        {[
          { id: 'dashboard', label: 'হোম', icon: LayoutDashboard },
          { id: 'pos', label: 'কাউন্টার', icon: ShoppingCart },
          { id: 'due_khata', label: 'বাকি খাতা', icon: CreditCard },
          { id: 'inventory', label: 'পণ্য স্টক', icon: Package },
          { id: 'about', label: 'পরিচিতি', icon: Sparkles },
          { id: 'resume', label: 'সিভি', icon: Award }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-all ${
                isActive
                  ? 'text-[#B2825C] scale-105'
                  : 'text-[#8C827A] hover:text-[#232323]'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive ? 'bg-[#F5EEE7]' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="leading-tight mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Modals */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        onNavigateTab={setActiveTab}
      />

      <VoiceCartModal
        isOpen={isVoiceCartOpen}
        onClose={() => setIsVoiceCartOpen(false)}
      />

      <GeminiLiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      <ReceiptModal
        sale={selectedReceiptSale}
        onClose={() => setSelectedReceiptSale(null)}
      />
    </div>
  );
};
