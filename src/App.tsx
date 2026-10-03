import { useState, useEffect } from 'react';
import type {
  CurrencyCode,
  AssetSection,
  AssetItem,
  AppData,
} from './types';
import { loadAppData, saveAppData } from './utils/storage';
import { Header } from './components/Header';
import { NetWorthCard } from './components/NetWorthCard';
import { SectionCard } from './components/SectionCard';
import { EditItemModal } from './components/EditItemModal';
import { AddSectionModal } from './components/AddSectionModal';
import { GoldCalculatorModal } from './components/GoldCalculatorModal';
import { SnapshotHistoryModal } from './components/SnapshotHistoryModal';
import { BackupModal } from './components/BackupModal';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';

export function App() {
  const [appData, setAppData] = useState<AppData>(() => loadAppData());
  const [privacyMode, setPrivacyMode] = useState<boolean>(() => {
    return localStorage.getItem('vaultwatch_privacy_mode') === 'true';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [itemToEdit, setItemToEdit] = useState<AssetItem | null>(null);

  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<AssetSection | null>(null);

  const [isGoldCalcOpen, setIsGoldCalcOpen] = useState(false);
  const [goldCalcItem, setGoldCalcItem] = useState<AssetItem | null>(null);
  const [goldCalcSectionId, setGoldCalcSectionId] = useState<string>('');

  const [isSnapshotsOpen, setIsSnapshotsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage when appData changes
  useEffect(() => {
    saveAppData(appData);
  }, [appData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleTogglePrivacy = () => {
    setPrivacyMode((prev) => {
      const next = !prev;
      localStorage.setItem('vaultwatch_privacy_mode', String(next));
      return next;
    });
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setAppData((prev) => ({
      ...prev,
      currency: newCurrency,
    }));
    showToast(`Currency switched to ${newCurrency}`);
  };

  // --- Asset Items Handlers ---
  const handleOpenAddItem = (sectionId?: string) => {
    setItemToEdit(null);
    setActiveSectionId(sectionId || (appData.sections[0]?.id ?? ''));
    setIsAddItemOpen(true);
  };

  const handleOpenEditItem = (sectionId: string, item: AssetItem) => {
    setActiveSectionId(sectionId);
    setItemToEdit(item);
    setIsAddItemOpen(true);
  };

  const handleInlineUpdateAmount = (
    sectionId: string,
    itemId: string,
    newAmount: number
  ) => {
    setAppData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((i) => {
            if (i.id !== itemId) return i;
            return {
              ...i,
              amount: newAmount,
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      }),
    }));
    showToast('Balance updated');
  };

  const handleSaveItem = (
    sectionId: string,
    itemData: {
      id?: string;
      name: string;
      amount: number;
      institution?: string;
      notes?: string;
      goldDetails?: AssetItem['goldDetails'];
      shareDetails?: AssetItem['shareDetails'];
    }
  ) => {
    setAppData((prev) => {
      return {
        ...prev,
        sections: prev.sections.map((sec) => {
          if (sec.id !== sectionId) return sec;

          if (itemData.id) {
            // Edit existing item
            return {
              ...sec,
              items: sec.items.map((i) => {
                if (i.id !== itemData.id) return i;
                return {
                  ...i,
                  name: itemData.name,
                  amount: itemData.amount,
                  institution: itemData.institution,
                  notes: itemData.notes,
                  goldDetails: itemData.goldDetails,
                  shareDetails: itemData.shareDetails,
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          } else {
            // Create new item
            const newItem: AssetItem = {
              id: 'item-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
              name: itemData.name,
              amount: itemData.amount,
              institution: itemData.institution,
              notes: itemData.notes,
              goldDetails: itemData.goldDetails,
              shareDetails: itemData.shareDetails,
              updatedAt: new Date().toISOString(),
            };
            return {
              ...sec,
              items: [...sec.items, newItem],
            };
          }
        }),
      };
    });
    showToast(itemData.id ? 'Asset updated' : 'New asset added');
  };

  const handleDeleteItem = (sectionId: string, itemId: string) => {
    setAppData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.filter((i) => i.id !== itemId),
        };
      }),
    }));
    showToast('Item deleted');
  };

  // --- Section Handlers ---
  const handleOpenAddSection = () => {
    setSectionToEdit(null);
    setIsAddSectionOpen(true);
  };

  const handleOpenEditSection = (section: AssetSection) => {
    setSectionToEdit(section);
    setIsAddSectionOpen(true);
  };

  const handleSaveSection = (data: {
    id?: string;
    title: string;
    description?: string;
    iconName: string;
    color: string;
  }) => {
    setAppData((prev) => {
      if (data.id) {
        // Edit section
        return {
          ...prev,
          sections: prev.sections.map((sec) => {
            if (sec.id !== data.id) return sec;
            return {
              ...sec,
              title: data.title,
              description: data.description,
              iconName: data.iconName,
              color: data.color,
            };
          }),
        };
      } else {
        // Add new section
        const newSec: AssetSection = {
          id: 'sec-' + Date.now(),
          title: data.title,
          description: data.description,
          type: 'custom',
          iconName: data.iconName,
          color: data.color,
          items: [],
        };
        return {
          ...prev,
          sections: [...prev.sections, newSec],
        };
      }
    });
    showToast(data.id ? 'Section updated' : 'New section created');
  };

  const handleDeleteSection = (sectionId: string) => {
    setAppData((prev) => ({
      ...prev,
      sections: prev.sections.filter((sec) => sec.id !== sectionId),
    }));
    showToast('Section deleted');
  };

  // --- Gold Calculator Modal Trigger ---
  const handleOpenGoldCalculator = (sectionId: string, item: AssetItem) => {
    setGoldCalcSectionId(sectionId);
    setGoldCalcItem(item);
    setIsGoldCalcOpen(true);
  };

  const handleSaveGoldCalculator = (
    sectionId: string,
    itemId: string,
    calculatedAmount: number,
    goldDetails: {
      weight: number;
      unit: 'grams' | 'tolas' | 'oz';
      purity: '24K' | '22K' | '18K' | '14K';
      ratePerUnit: number;
    }
  ) => {
    setAppData((prev) => ({
      ...prev,
      sections: prev.sections.map((sec) => {
        if (sec.id !== sectionId) return sec;
        return {
          ...sec,
          items: sec.items.map((i) => {
            if (i.id !== itemId) return i;
            return {
              ...i,
              amount: calculatedAmount,
              goldDetails,
              updatedAt: new Date().toISOString(),
            };
          }),
        };
      }),
    }));
    showToast('Gold valuation updated');
  };

  // --- Snapshots ---
  const handleTakeSnapshot = () => {
    const totalNetWorth = appData.sections.reduce((sum, sec) => {
      return sum + sec.items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    }, 0);

    const breakdown = appData.sections.map((sec) => ({
      sectionId: sec.id,
      sectionTitle: sec.title,
      total: sec.items.reduce((s, i) => s + (Number(i.amount) || 0), 0),
    }));

    const newSnapshot = {
      id: 'snap-' + Date.now(),
      date: new Date().toISOString(),
      totalNetWorth,
      sectionBreakdown: breakdown,
      note: 'Manual snapshot',
    };

    setAppData((prev) => ({
      ...prev,
      snapshots: [newSnapshot, ...(prev.snapshots || [])],
    }));

    showToast('Snapshot recorded to history!');
  };

  const handleDeleteSnapshot = (snapshotId: string) => {
    setAppData((prev) => ({
      ...prev,
      snapshots: prev.snapshots.filter((s) => s.id !== snapshotId),
    }));
  };

  // Latest snapshot for comparison (excluding one taken right now if fresh)
  const latestSnapshot = appData.snapshots && appData.snapshots.length > 0 ? appData.snapshots[0] : undefined;

  // Filter sections by search query if user types
  const filteredSections = appData.sections
    .map((sec) => {
      if (!searchQuery.trim()) return sec;
      const q = searchQuery.toLowerCase();
      const matchesSection = sec.title.toLowerCase().includes(q);
      const filteredItems = sec.items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          (i.institution && i.institution.toLowerCase().includes(q)) ||
          (i.notes && i.notes.toLowerCase().includes(q))
      );
      if (matchesSection) return sec;
      return {
        ...sec,
        items: filteredItems,
      };
    })
    .filter((sec) => {
      if (!searchQuery.trim()) return true;
      return (
        sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sec.items.length > 0
      );
    });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl shadow-emerald-950 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Sticky Header */}
      <Header
        currency={appData.currency}
        onCurrencyChange={handleCurrencyChange}
        privacyMode={privacyMode}
        onTogglePrivacy={handleTogglePrivacy}
        onOpenAddSection={handleOpenAddSection}
        onOpenAddItem={() => handleOpenAddItem()}
        onOpenSnapshots={() => setIsSnapshotsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 sm:py-8 flex-1 w-full space-y-8">
        {/* Net Worth Hero Overview Card */}
        <NetWorthCard
          sections={appData.sections}
          currency={appData.currency}
          privacyMode={privacyMode}
          latestSnapshot={latestSnapshot}
          onTakeSnapshot={handleTakeSnapshot}
        />

        {/* Section Header & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Asset Categories & Balances
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Click any balance amount to edit instantly, or use the menu for more options.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assets, banks, notes..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-700"
              />
            </div>

            <button
              onClick={handleOpenAddSection}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 hover:text-white transition-colors shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span>+ New Section</span>
            </button>
          </div>
        </div>

        {/* Sections Grid / List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSections.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              currency={appData.currency}
              privacyMode={privacyMode}
              onAddItem={handleOpenAddItem}
              onEditItem={handleOpenEditItem}
              onDeleteItem={handleDeleteItem}
              onInlineUpdateAmount={handleInlineUpdateAmount}
              onEditSection={handleOpenEditSection}
              onDeleteSection={handleDeleteSection}
              onOpenGoldCalculator={handleOpenGoldCalculator}
            />
          ))}
        </div>

        {/* Peace of Mind reassurance banner */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/70 to-slate-900 border border-slate-800/80 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Your Financial Clarity & Peace of Mind</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                All data is encrypted in your local browser storage. No cloud server access, no passwords required, completely private to you.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsBackupOpen(true)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 hover:text-white border border-slate-700 shrink-0 transition-colors"
          >
            Export Backup File
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        <p>AssetFlow Vault • Personal Asset Overview & Net Worth Tracker</p>
      </footer>

      {/* Modals */}
      <EditItemModal
        isOpen={isAddItemOpen}
        sections={appData.sections}
        initialSectionId={activeSectionId}
        itemToEdit={itemToEdit}
        currency={appData.currency}
        onClose={() => setIsAddItemOpen(false)}
        onSave={handleSaveItem}
      />

      <AddSectionModal
        isOpen={isAddSectionOpen}
        sectionToEdit={sectionToEdit}
        onClose={() => setIsAddSectionOpen(false)}
        onSave={handleSaveSection}
      />

      <GoldCalculatorModal
        isOpen={isGoldCalcOpen}
        item={goldCalcItem}
        sectionId={goldCalcSectionId}
        currency={appData.currency}
        onClose={() => setIsGoldCalcOpen(false)}
        onSave={handleSaveGoldCalculator}
      />

      <SnapshotHistoryModal
        isOpen={isSnapshotsOpen}
        snapshots={appData.snapshots || []}
        currency={appData.currency}
        privacyMode={privacyMode}
        onClose={() => setIsSnapshotsOpen(false)}
        onDeleteSnapshot={handleDeleteSnapshot}
      />

      <BackupModal
        isOpen={isBackupOpen}
        data={appData}
        onClose={() => setIsBackupOpen(false)}
        onRestoreData={(restored) => setAppData(restored)}
      />
    </div>
  );
}

export default App;
