import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Customer,
  Sale,
  Expense,
  MasalaRule,
  ShopSettings,
  SaleItem,
  ScannedProductRecord
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_EXPENSES,
  INITIAL_MASALA_RULES,
  DEFAULT_SETTINGS
} from '../utils/initialData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const INITIAL_SCAN_HISTORY: ScannedProductRecord[] = [
  {
    id: 'scan_init_1',
    name: 'Teer Pure Soybean Oil 5L',
    banglaName: 'তীর পিওর সয়াবিন তেল ৫ লিটার',
    sellingPrice: 890,
    costPrice: 830,
    category: 'oil_ghee',
    unit: 'litre',
    barcode: '8941100523',
    scannedAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    status: 'added'
  },
  {
    id: 'scan_init_2',
    name: 'Miniket Premium Rice 25kg',
    banglaName: 'মিনিকেট প্রিমিয়াম চাল ২৫ কেজি',
    sellingPrice: 1750,
    costPrice: 1580,
    category: 'rice_flour',
    unit: 'kg',
    barcode: '8941129481',
    scannedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    status: 'pending'
  },
  {
    id: 'scan_init_3',
    name: 'Radhuni Turmeric Powder 200g',
    banglaName: 'রাঁধুনী হলুদ গুঁড়া ২০০ গ্রাম',
    sellingPrice: 95,
    costPrice: 82,
    category: 'spices_salt',
    unit: 'packet',
    barcode: '8941002341',
    scannedAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    status: 'added'
  }
];

interface KhataContextType {
  products: Product[];
  customers: Customer[];
  sales: Sale[];
  expenses: Expense[];
  masalaRules: MasalaRule[];
  settings: ShopSettings;
  cart: SaleItem[];
  scanHistory: ScannedProductRecord[];
  addScanRecord: (record: Omit<ScannedProductRecord, 'id' | 'scannedAt'>) => ScannedProductRecord;
  deleteScanRecord: (id: string) => void;
  clearScanHistory: () => void;
  updateScanRecordStatus: (id: string, status: 'added' | 'pending') => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addSale: (sale: Omit<Sale, 'id' | 'date'>) => Sale;
  addProduct: (product: Omit<Product, 'id' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  bulkUpdateProducts: (
    ids: string[],
    updateFnOrObj: Partial<Product> | ((prev: Product) => Partial<Product>)
  ) => void;
  deleteProduct: (id: string) => void;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'lastTransactionDate'>) => Customer;
  receiveCustomerPayment: (customerId: string, amount: number, note?: string) => void;
  giveCustomerDue: (customerId: string, amount: number, note?: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'date'>) => void;
  deleteExpense: (id: string) => void;
  addMasalaRule: (rule: Omit<MasalaRule, 'id'>) => void;
  deleteMasalaRule: (id: string) => void;
  updateSettings: (newSettings: Partial<ShopSettings>) => void;
  // Modals
  isVoiceCartOpen: boolean;
  setIsVoiceCartOpen: (open: boolean) => void;
  isLiveVoiceOpen: boolean;
  setIsLiveVoiceOpen: (open: boolean) => void;
  isGlobalSearchOpen: boolean;
  setIsGlobalSearchOpen: (open: boolean) => void;
}

const KhataContext = createContext<KhataContextType | undefined>(undefined);

export const KhataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const data = loadFromStorage('grocer_products', INITIAL_PRODUCTS);
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const data = loadFromStorage('grocer_customers', INITIAL_CUSTOMERS);
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    try {
      const data = loadFromStorage('grocer_sales', []);
      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const data = loadFromStorage('grocer_expenses', INITIAL_EXPENSES);
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [masalaRules, setMasalaRules] = useState<MasalaRule[]>(() => {
    try {
      const data = loadFromStorage('grocer_masala', INITIAL_MASALA_RULES);
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_MASALA_RULES;
    } catch {
      return INITIAL_MASALA_RULES;
    }
  });

  const [settings, setSettings] = useState<ShopSettings>(() => {
    try {
      const data = loadFromStorage('grocer_settings', DEFAULT_SETTINGS);
      const loaded = { ...DEFAULT_SETTINGS, ...(data || {}) };
      if (!loaded.colorTheme || loaded.colorTheme === 'emerald') {
        loaded.colorTheme = 'caramel';
      }
      return loaded;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [scanHistory, setScanHistory] = useState<ScannedProductRecord[]>(() => {
    try {
      const data = loadFromStorage('grocer_scan_history', INITIAL_SCAN_HISTORY);
      return Array.isArray(data) && data.length > 0 ? data : INITIAL_SCAN_HISTORY;
    } catch {
      return INITIAL_SCAN_HISTORY;
    }
  });

  const [cart, setCart] = useState<SaleItem[]>([]);

  // Modals
  const [isVoiceCartOpen, setIsVoiceCartOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Sync to storage
  useEffect(() => {
    saveToStorage('grocer_products', products);
  }, [products]);

  useEffect(() => {
    saveToStorage('grocer_customers', customers);
  }, [customers]);

  useEffect(() => {
    saveToStorage('grocer_sales', sales);
  }, [sales]);

  useEffect(() => {
    saveToStorage('grocer_expenses', expenses);
  }, [expenses]);

  useEffect(() => {
    saveToStorage('grocer_masala', masalaRules);
  }, [masalaRules]);

  useEffect(() => {
    saveToStorage('grocer_settings', settings);
  }, [settings]);

  useEffect(() => {
    saveToStorage('grocer_scan_history', scanHistory);
  }, [scanHistory]);

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * item.unitPrice
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.banglaName || product.name,
          quantity,
          unit: product.unit,
          unitPrice: product.sellingPrice,
          totalPrice: product.sellingPrice * quantity,
          costPrice: product.costPrice
        }
      ];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateCartQty = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? {
              ...item,
              quantity,
              totalPrice: quantity * item.unitPrice
            }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Complete Sale
  const addSale = (saleData: Omit<Sale, 'id' | 'date'>): Sale => {
    const newSale: Sale = {
      ...saleData,
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString()
    };

    // Deduct inventory
    setProducts((prev) =>
      prev.map((p) => {
        const soldItem = saleData.items.find((item) => item.productId === p.id);
        if (soldItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - soldItem.quantity),
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      })
    );

    // Update customer due if customer exists
    if (saleData.customerId && saleData.due > 0) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === saleData.customerId
            ? {
                ...c,
                totalDue: c.totalDue + saleData.due,
                lastTransactionDate: new Date().toISOString()
              }
            : c
        )
      );
    }

    setSales((prev) => [newSale, ...prev]);
    clearCart();
    return newSale;
  };

  // Product management
  const addProduct = (p: Omit<Product, 'id' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...p,
      id: `prod-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
    );
  };

  const bulkUpdateProducts = (
    ids: string[],
    updateFnOrObj: Partial<Product> | ((prev: Product) => Partial<Product>)
  ) => {
    const idSet = new Set(ids);
    const now = new Date().toISOString();
    setProducts((prev) =>
      prev.map((p) => {
        if (!idSet.has(p.id)) return p;
        const changes =
          typeof updateFnOrObj === 'function' ? updateFnOrObj(p) : updateFnOrObj;
        return {
          ...p,
          ...changes,
          updatedAt: now
        };
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // Customer Management
  const addCustomer = (c: Omit<Customer, 'id' | 'createdAt' | 'lastTransactionDate'>): Customer => {
    const newCust: Customer = {
      ...c,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastTransactionDate: new Date().toISOString()
    };
    setCustomers((prev) => [newCust, ...prev]);
    return newCust;
  };

  const receiveCustomerPayment = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              totalDue: Math.max(0, c.totalDue - amount),
              lastTransactionDate: new Date().toISOString()
            }
          : c
      )
    );
  };

  const giveCustomerDue = (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              totalDue: c.totalDue + amount,
              lastTransactionDate: new Date().toISOString()
            }
          : c
      )
    );
  };

  // Expense management
  const addExpense = (e: Omit<Expense, 'id' | 'date'>) => {
    const newExp: Expense = {
      ...e,
      id: `exp-${Date.now()}`,
      date: new Date().toISOString()
    };
    setExpenses((prev) => [newExp, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Scan History Management
  const addScanRecord = (record: Omit<ScannedProductRecord, 'id' | 'scannedAt'>): ScannedProductRecord => {
    const newRecord: ScannedProductRecord = {
      ...record,
      id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      scannedAt: new Date().toISOString()
    };
    setScanHistory((prev) => [newRecord, ...prev]);
    return newRecord;
  };

  const deleteScanRecord = (id: string) => {
    setScanHistory((prev) => prev.filter((r) => r.id !== id));
  };

  const clearScanHistory = () => {
    setScanHistory([]);
  };

  const updateScanRecordStatus = (id: string, status: 'added' | 'pending') => {
    setScanHistory((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Masala Rule
  const addMasalaRule = (r: Omit<MasalaRule, 'id'>) => {
    const newRule: MasalaRule = {
      ...r,
      id: `masala-${Date.now()}`
    };
    setMasalaRules((prev) => [newRule, ...prev]);
  };

  const deleteMasalaRule = (id: string) => {
    setMasalaRules((prev) => prev.filter((r) => r.id !== id));
  };

  const updateSettings = (newSettings: Partial<ShopSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <KhataContext.Provider
      value={{
        products,
        customers,
        sales,
        expenses,
        masalaRules,
        settings,
        cart,
        scanHistory,
        addScanRecord,
        deleteScanRecord,
        clearScanHistory,
        updateScanRecordStatus,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        addSale,
        addProduct,
        updateProduct,
        bulkUpdateProducts,
        deleteProduct,
        addCustomer,
        receiveCustomerPayment,
        giveCustomerDue,
        addExpense,
        deleteExpense,
        addMasalaRule,
        deleteMasalaRule,
        updateSettings,
        isVoiceCartOpen,
        setIsVoiceCartOpen,
        isLiveVoiceOpen,
        setIsLiveVoiceOpen,
        isGlobalSearchOpen,
        setIsGlobalSearchOpen
      }}
    >
      {children}
    </KhataContext.Provider>
  );
};

export const useKhata = () => {
  const context = useContext(KhataContext);
  if (!context) {
    throw new Error('useKhata must be used within a KhataProvider');
  }
  return context;
};
