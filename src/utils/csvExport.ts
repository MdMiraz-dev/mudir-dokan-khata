import * as XLSX from 'xlsx';
import { Sale, Customer, Product, ShopSettings } from '../types';

export const exportSalesToExcel = (sales: Sale[], settings: ShopSettings, monthName: string) => {
  const data = sales.map((sale, index) => ({
    'Serial': index + 1,
    'Invoice ID': sale.id,
    'Date': new Date(sale.date).toLocaleString(),
    'Customer Name': sale.customerName || 'Cash Sale',
    'Customer Phone': sale.customerPhone || 'N/A',
    'Items Count': sale.items.length,
    'Subtotal': sale.subtotal,
    'Discount': sale.discount,
    'Total Amount': sale.total,
    'Paid Amount': sale.paid,
    'Due Amount': sale.due,
    'Payment Method': sale.paymentMethod,
    'Profit': sale.profit || 0
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Data');

  XLSX.writeFile(workbook, `Monthly-Sales-${monthName.replace(/\s+/g, '-')}.xlsx`);
};

export const exportProductsToExcel = (products: Product[]) => {
  const data = products.map((p, idx) => ({
    'SL': idx + 1,
    'Product Name': p.name,
    'Bangla Name': p.banglaName || '',
    'Category': p.category,
    'Stock': p.stock,
    'Unit': p.unit,
    'Cost Price': p.costPrice,
    'Selling Price': p.sellingPrice,
    'Min Stock Alert': p.minStock,
    'Barcode': p.barcode || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory');
  XLSX.writeFile(workbook, `Inventory-Stock-${new Date().toISOString().slice(0, 10)}.xlsx`);
};

export const exportCustomersDueToExcel = (customers: Customer[], settings: ShopSettings) => {
  const data = customers.map((c, idx) => ({
    'SL': idx + 1,
    'Customer Name': c.name,
    'Phone': c.phone,
    'Address': c.address || '',
    'Total Due': c.totalDue,
    'Last Transaction': new Date(c.lastTransactionDate).toLocaleDateString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Due Ledger');
  XLSX.writeFile(workbook, `Customers-Due-Ledger-${new Date().toISOString().slice(0, 10)}.xlsx`);
};
