export type CurrencyCode = 'USD' | 'NPR' | 'INR' | 'EUR' | 'GBP' | 'AUD' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export interface AssetItem {
  id: string;
  name: string;
  amount: number;
  institution?: string;
  notes?: string;
  updatedAt: string;
  // Specific to gold calculator if applied
  goldDetails?: {
    weight: number;
    unit: 'grams' | 'tolas' | 'oz';
    purity: '24K' | '22K' | '18K' | '14K';
    ratePerUnit: number;
  };
  // Specific to shares if user tracks invested vs current
  shareDetails?: {
    sharesCount?: number;
    buyPrice?: number;
    investedTotal?: number;
  };
}

export type SectionType = 'bank' | 'savings' | 'gold' | 'shares' | 'custom';

export interface AssetSection {
  id: string;
  title: string;
  description?: string;
  type: SectionType;
  iconName: string; // e.g., 'Landmark', 'PiggyBank', 'Coins', 'TrendingUp', 'Wallet', 'Home', 'Shield'
  color: string; // Tailwind color accent, e.g., 'blue', 'emerald', 'amber', 'purple', 'rose', 'cyan'
  items: AssetItem[];
  isCollapsed?: boolean;
}

export interface NetWorthSnapshot {
  id: string;
  date: string;
  totalNetWorth: number;
  sectionBreakdown: {
    sectionId: string;
    sectionTitle: string;
    total: number;
  }[];
  note?: string;
}

export interface AppData {
  currency: CurrencyCode;
  sections: AssetSection[];
  snapshots: NetWorthSnapshot[];
  lastUpdated: string;
}
