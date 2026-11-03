import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale, Customer, ShopSettings } from '../types';

export const generateSalesReportPdf = (
  sales: Sale[],
  settings: ShopSettings,
  monthName: string,
  totalRevenue: number,
  totalDue: number,
  totalProfit: number
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Title
  doc.setFontSize(18);
  doc.setTextColor(16, 185, 129); // Emerald
  doc.text(settings.shopName || 'Grocery Store', 105, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(`${settings.address || ''} | Mob: ${settings.phone || ''}`, 105, 21, { align: 'center' });
  doc.text(`Monthly Sales & Profit Report - ${monthName}`, 105, 27, { align: 'center' });

  // Summary Box
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 32, 182, 22, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Total Orders: ${sales.length}`, 20, 41);
  doc.text(`Total Sales: ${settings.currency} ${totalRevenue.toLocaleString()}`, 65, 41);
  doc.text(`Due Sales: ${settings.currency} ${totalDue.toLocaleString()}`, 115, 41);
  doc.text(`Estimated Profit: ${settings.currency} ${totalProfit.toLocaleString()}`, 155, 41);

  // Table
  const tableRows = sales.map((sale, index) => [
    index + 1,
    sale.id.slice(-6).toUpperCase(),
    new Date(sale.date).toLocaleDateString(),
    sale.customerName || 'Cash Customer',
    sale.items.length,
    `${settings.currency} ${sale.total.toFixed(2)}`,
    `${settings.currency} ${sale.paid.toFixed(2)}`,
    `${settings.currency} ${sale.due.toFixed(2)}`,
    sale.paymentMethod.toUpperCase()
  ]);

  autoTable(doc, {
    startY: 58,
    head: [['#', 'Invoice', 'Date', 'Customer', 'Items', 'Total', 'Paid', 'Due', 'Method']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [16, 185, 129],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    }
  });

  doc.save(`Monthly-Sales-Report-${monthName.replace(/\s+/g, '-')}.pdf`);
};

export const generateCustomerDueReceiptPdf = (
  customer: Customer,
  settings: ShopSettings
) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.setTextColor(16, 185, 129);
  doc.text(settings.shopName, 105, 20, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text(`Customer Due Ledger Statement`, 105, 28, { align: 'center' });

  doc.text(`Customer Name: ${customer.name}`, 20, 45);
  doc.text(`Phone: ${customer.phone}`, 20, 52);
  doc.text(`Address: ${customer.address || 'N/A'}`, 20, 59);

  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.text(`Total Due Balance: ${settings.currency} ${customer.totalDue.toLocaleString()}`, 20, 72);

  doc.save(`Due-Statement-${customer.name.replace(/\s+/g, '-')}.pdf`);
};
