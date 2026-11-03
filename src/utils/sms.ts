import { Customer, ShopSettings } from '../types';

export const createDueSmsText = (customer: Customer, settings: ShopSettings): string => {
  return `আসসালামু আলাইকুম ${customer.name}, "${settings.shopName}"-এ আপনার বর্তমান বাকি বকেয়া ৳${customer.totalDue.toLocaleString()}। অনুগ্রহ করে সুবিধাজনক সময়ে পরিশোধ করার জন্য অনুরোধ করা হলো। যোগাযোগ: ${settings.phone}। ধন্যবাদ!`;
};

export const openSmsApp = (phone: string, text: string) => {
  const encodedText = encodeURIComponent(text);
  // SMS URI format
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const separator = isIos ? '&' : '?';
  window.open(`sms:${phone}${separator}body=${encodedText}`, '_blank');
};

export const openWhatsApp = (phone: string, text: string) => {
  let cleanPhone = phone.replace(/[^\d+]/g, '');
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '88' + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  window.open(`https://wa.me/${cleanPhone}?text=${encodedText}`, '_blank');
};
