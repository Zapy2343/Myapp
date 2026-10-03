import type { AppData, AssetSection } from '../types';

const STORAGE_KEY = 'vaultwatch_personal_finance_v1';

export const INITIAL_SECTIONS: AssetSection[] = [
  {
    id: 'sec-bank',
    title: 'Bank Accounts',
    description: 'Current & checking accounts for daily transactions',
    type: 'bank',
    iconName: 'Landmark',
    color: 'blue',
    items: [
      {
        id: 'bank-1',
        name: 'Primary Checking Account',
        institution: 'Main Bank',
        amount: 2500,
        notes: 'Monthly expenses & bills',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'bank-2',
        name: 'Secondary Operating Account',
        institution: 'Global Bank',
        amount: 1200,
        notes: 'Discretionary spending',
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'sec-savings',
    title: 'Savings Accounts',
    description: 'High-yield savings & emergency reserves',
    type: 'savings',
    iconName: 'PiggyBank',
    color: 'emerald',
    items: [
      {
        id: 'sav-1',
        name: 'Emergency Fund (HYSA)',
        institution: 'Online Savings Bank',
        amount: 8500,
        notes: '6 months rainy day reserve',
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'sav-2',
        name: 'Goal Savings Deposit',
        institution: 'Credit Union',
        amount: 3000,
        notes: 'Target fund for travel / upgrades',
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'sec-gold',
    title: 'Gold Savings',
    description: 'Physical gold bullion, coins & precious metals',
    type: 'gold',
    iconName: 'Coins',
    color: 'amber',
    items: [
      {
        id: 'gold-1',
        name: '24K Gold Bar',
        institution: 'Locker / Safe',
        amount: 4200,
        notes: '50 grams at ~84/gram',
        goldDetails: {
          weight: 50,
          unit: 'grams',
          purity: '24K',
          ratePerUnit: 84,
        },
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'gold-2',
        name: 'Gold Sovereign Coins',
        institution: 'Home Vault',
        amount: 2100,
        notes: '25 grams at ~84/gram',
        goldDetails: {
          weight: 25,
          unit: 'grams',
          purity: '24K',
          ratePerUnit: 84,
        },
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'sec-shares',
    title: 'Share Account',
    description: 'Stock portfolio, index funds & brokerage equity',
    type: 'shares',
    iconName: 'TrendingUp',
    color: 'purple',
    items: [
      {
        id: 'shr-1',
        name: 'Brokerage Stock Account',
        institution: 'Broker Platform',
        amount: 15400,
        notes: 'Index funds & long term holdings',
        shareDetails: {
          investedTotal: 13000,
        },
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'shr-2',
        name: 'Dividend / Growth Shares',
        institution: 'Trading Account',
        amount: 4800,
        notes: 'Blue chip company equities',
        shareDetails: {
          investedTotal: 4200,
        },
        updatedAt: new Date().toISOString(),
      },
    ],
  },
];

export const INITIAL_DATA: AppData = {
  currency: 'USD',
  sections: INITIAL_SECTIONS,
  snapshots: [
    {
      id: 'snap-init',
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      totalNetWorth: 36500,
      sectionBreakdown: [
        { sectionId: 'sec-bank', sectionTitle: 'Bank Accounts', total: 3200 },
        { sectionId: 'sec-savings', sectionTitle: 'Savings Accounts', total: 10500 },
        { sectionId: 'sec-gold', sectionTitle: 'Gold Savings', total: 5800 },
        { sectionId: 'sec-shares', sectionTitle: 'Share Account', total: 17000 },
      ],
      note: 'Starting net worth record last month',
    },
  ],
  lastUpdated: new Date().toISOString(),
};

export function loadAppData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw) as AppData;
    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return INITIAL_DATA;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to parse localStorage data, loading defaults', err);
    return INITIAL_DATA;
  }
}

export function saveAppData(data: AppData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function exportBackup(data: AppData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `finance_backup_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportCSV(data: AppData): void {
  const rows = [
    ['Section', 'Item Name', 'Institution', 'Amount', 'Currency', 'Notes', 'Last Updated'],
  ];

  data.sections.forEach((sec) => {
    sec.items.forEach((item) => {
      rows.push([
        `"${sec.title}"`,
        `"${item.name.replace(/"/g, '""')}"`,
        `"${(item.institution || '').replace(/"/g, '""')}"`,
        item.amount.toString(),
        data.currency,
        `"${(item.notes || '').replace(/"/g, '""')}"`,
        item.updatedAt || '',
      ]);
    });
  });

  const csvContent = rows.map((e) => e.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const dateStr = new Date().toISOString().split('T')[0];
  a.download = `assets_overview_${dateStr}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
