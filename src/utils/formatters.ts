import type { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  NPR: { code: 'NPR', symbol: 'रू', name: 'Nepalese Rupee' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
};

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = 'USD',
  privacyMode: boolean = false
): string {
  if (privacyMode) {
    return '••••••••';
  }

  const currency = CURRENCIES[currencyCode] || CURRENCIES.USD;
  
  // Format with standard localization
  let locale = 'en-US';
  if (currencyCode === 'NPR') locale = 'en-NP';
  if (currencyCode === 'INR') locale = 'en-IN';
  if (currencyCode === 'EUR') locale = 'de-DE';
  if (currencyCode === 'GBP') locale = 'en-GB';

  try {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${currency.symbol} ${formatted}`;
  } catch {
    return `${currency.symbol} ${amount.toLocaleString()}`;
  }
}

export function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(isoString);
}
