export const getThemeClasses = (theme: string = 'caramel') => {
  switch (theme) {
    case 'caramel':
    case 'pinterest':
      return {
        primary: 'bg-[#B2825C] hover:bg-[#9E6F4B] text-white',
        primaryText: 'text-[#B2825C]',
        primaryBorder: 'border-[#B2825C]',
        lightBg: 'bg-[#F5EEE7]',
        badge: 'bg-[#F5EEE7] text-[#83593B] border-[#DEC4AD]'
      };
    case 'blue':
      return {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        primaryText: 'text-blue-600',
        primaryBorder: 'border-blue-500',
        lightBg: 'bg-blue-50',
        badge: 'bg-blue-100 text-blue-800 border-blue-200'
      };
    case 'indigo':
      return {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        primaryText: 'text-indigo-600',
        primaryBorder: 'border-indigo-500',
        lightBg: 'bg-indigo-50',
        badge: 'bg-indigo-100 text-indigo-800 border-indigo-200'
      };
    case 'amber':
      return {
        primary: 'bg-amber-600 hover:bg-amber-700 text-white',
        primaryText: 'text-amber-600',
        primaryBorder: 'border-amber-500',
        lightBg: 'bg-amber-50',
        badge: 'bg-amber-100 text-amber-800 border-amber-200'
      };
    case 'slate':
      return {
        primary: 'bg-stone-800 hover:bg-stone-900 text-white',
        primaryText: 'text-stone-800',
        primaryBorder: 'border-stone-700',
        lightBg: 'bg-stone-100',
        badge: 'bg-stone-200 text-stone-800 border-stone-300'
      };
    case 'emerald':
      return {
        primary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        primaryText: 'text-emerald-600',
        primaryBorder: 'border-emerald-500',
        lightBg: 'bg-emerald-50',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200'
      };
    default:
      return {
        primary: 'bg-[#B2825C] hover:bg-[#9E6F4B] text-white',
        primaryText: 'text-[#B2825C]',
        primaryBorder: 'border-[#B2825C]',
        lightBg: 'bg-[#F5EEE7]',
        badge: 'bg-[#F5EEE7] text-[#83593B] border-[#DEC4AD]'
      };
  }
};
