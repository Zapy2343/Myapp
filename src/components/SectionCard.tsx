import React, { useState } from 'react';
import {
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Scale,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import type { AssetSection, AssetItem, CurrencyCode } from '../types';
import { formatCurrency, formatRelativeTime } from '../utils/formatters';
import { DynamicIcon } from './DynamicIcon';

interface SectionCardProps {
  section: AssetSection;
  currency: CurrencyCode;
  privacyMode: boolean;
  onAddItem: (sectionId: string) => void;
  onEditItem: (sectionId: string, item: AssetItem) => void;
  onDeleteItem: (sectionId: string, itemId: string) => void;
  onInlineUpdateAmount: (sectionId: string, itemId: string, newAmount: number) => void;
  onEditSection: (section: AssetSection) => void;
  onDeleteSection: (sectionId: string) => void;
  onOpenGoldCalculator?: (sectionId: string, item: AssetItem) => void;
}

const COLOR_THEMES: Record<string, { ring: string; border: string; badge: string; iconBg: string; text: string }> = {
  blue: {
    ring: 'focus-within:border-blue-500/50',
    border: 'border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    iconBg: 'bg-blue-500/15 text-blue-400',
    text: 'text-blue-400',
  },
  emerald: {
    ring: 'focus-within:border-emerald-500/50',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
    text: 'text-emerald-400',
  },
  amber: {
    ring: 'focus-within:border-amber-500/50',
    border: 'border-amber-500/20',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    iconBg: 'bg-amber-500/15 text-amber-400',
    text: 'text-amber-400',
  },
  purple: {
    ring: 'focus-within:border-purple-500/50',
    border: 'border-purple-500/20',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    iconBg: 'bg-purple-500/15 text-purple-400',
    text: 'text-purple-400',
  },
  rose: {
    ring: 'focus-within:border-rose-500/50',
    border: 'border-rose-500/20',
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    iconBg: 'bg-rose-500/15 text-rose-400',
    text: 'text-rose-400',
  },
  cyan: {
    ring: 'focus-within:border-cyan-500/50',
    border: 'border-cyan-500/20',
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    iconBg: 'bg-cyan-500/15 text-cyan-400',
    text: 'text-cyan-400',
  },
  indigo: {
    ring: 'focus-within:border-indigo-500/50',
    border: 'border-indigo-500/20',
    badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    iconBg: 'bg-indigo-500/15 text-indigo-400',
    text: 'text-indigo-400',
  },
};

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  currency,
  privacyMode,
  onAddItem,
  onEditItem,
  onDeleteItem,
  onInlineUpdateAmount,
  onEditSection,
  onDeleteSection,
  onOpenGoldCalculator,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<string>('');

  const theme = COLOR_THEMES[section.color] || COLOR_THEMES.blue;
  const sectionTotal = section.items.reduce((s, i) => s + (Number(i.amount) || 0), 0);

  const startInlineEdit = (item: AssetItem) => {
    setEditingItemId(item.id);
    setTempAmount(item.amount.toString());
  };

  const saveInlineEdit = (itemId: string) => {
    const parsed = parseFloat(tempAmount);
    if (!isNaN(parsed) && parsed >= 0) {
      onInlineUpdateAmount(section.id, itemId, parsed);
    }
    setEditingItemId(null);
  };

  const cancelInlineEdit = () => {
    setEditingItemId(null);
  };

  return (
    <div
      className={`rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden transition-all duration-300 ${
        theme.ring
      }`}
    >
      {/* Section Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-900/50">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.iconBg}`}
          >
            <DynamicIcon name={section.iconName} className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight truncate">
                {section.title}
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${theme.badge}`}
              >
                {section.items.length} {section.items.length === 1 ? 'account' : 'accounts'}
              </span>
            </div>
            {section.description && (
              <p className="text-xs text-slate-400 truncate">{section.description}</p>
            )}
          </div>
        </div>

        {/* Section Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="text-right mr-1">
            <div className="text-xs text-slate-400 font-medium">Subtotal</div>
            <div className="text-base sm:text-lg font-bold text-white tracking-tight">
              {formatCurrency(sectionTotal, currency, privacyMode)}
            </div>
          </div>

          <button
            onClick={() => onAddItem(section.id)}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            title="Add balance item"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Section Action Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-750 text-slate-400 hover:text-slate-200 transition-colors"
              title="Section settings"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl py-1 z-30">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEditSection(section);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Edit Section Details</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (
                        confirm(
                          `Are you sure you want to delete "${section.title}" and all its recorded items?`
                        )
                      ) {
                        onDeleteSection(section.id);
                      }
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Section</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-slate-800/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Section Items List */}
      {!isCollapsed && (
        <div className="divide-y divide-slate-800/60">
          {section.items.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">No assets recorded in this section yet.</p>
              <button
                onClick={() => onAddItem(section.id)}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add first item</span>
              </button>
            </div>
          ) : (
            section.items.map((item) => {
              const isEditingThis = editingItemId === item.id;

              // Check if share item has gain/loss tracking
              const hasShareDetails =
                item.shareDetails && item.shareDetails.investedTotal !== undefined;
              const invested = item.shareDetails?.investedTotal || 0;
              const gainLoss = item.amount - invested;
              const gainLossPercent = invested > 0 ? (gainLoss / invested) * 100 : 0;

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-850/40 transition-colors group"
                >
                  {/* Left: Name, Notes, Institution */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm sm:text-base font-semibold text-slate-100 truncate">
                        {item.name}
                      </span>
                      {item.institution && (
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-750">
                          {item.institution}
                        </span>
                      )}
                      {/* Gold Details Badge */}
                      {item.goldDetails && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          <Scale className="w-3 h-3" />
                          {item.goldDetails.weight} {item.goldDetails.unit} ({item.goldDetails.purity})
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400 flex-wrap">
                      {item.notes && <span className="truncate">{item.notes}</span>}
                      {item.updatedAt && (
                        <span className="text-[11px] text-slate-500">
                          Updated {formatRelativeTime(item.updatedAt)}
                        </span>
                      )}
                      {/* Stock Gain / Loss pill */}
                      {hasShareDetails && invested > 0 && (
                        <span
                          className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-1.5 py-0.5 rounded ${
                            gainLoss >= 0
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}
                        >
                          {gainLoss >= 0 ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {gainLoss >= 0 ? '+' : ''}
                          {formatCurrency(gainLoss, currency, privacyMode)} ({gainLossPercent.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount & Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    {/* Inline Editing Amount or Static Display */}
                    {isEditingThis ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          step="any"
                          value={tempAmount}
                          onChange={(e) => setTempAmount(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveInlineEdit(item.id);
                            if (e.key === 'Escape') cancelInlineEdit();
                          }}
                          className="w-28 sm:w-36 bg-slate-950 border border-emerald-500 rounded-lg px-2.5 py-1 text-right text-sm font-bold text-white focus:outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => saveInlineEdit(item.id)}
                          className="p-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Save amount"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={cancelInlineEdit}
                          className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-400"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => startInlineEdit(item)}
                        className="cursor-pointer group/amt flex items-baseline gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Click to quickly edit amount"
                      >
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {formatCurrency(item.amount, currency, privacyMode)}
                        </span>
                        <Edit2 className="w-3 h-3 text-slate-500 opacity-0 group-hover/amt:opacity-100 transition-opacity" />
                      </div>
                    )}

                    {/* Gold Calculator Quick Trigger Button */}
                    {(section.type === 'gold' || item.goldDetails) && onOpenGoldCalculator && (
                      <button
                        onClick={() => onOpenGoldCalculator(section.id, item)}
                        className="p-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors"
                        title="Open Gold Weight & Rate Calculator"
                      >
                        <Scale className="w-4 h-4" />
                      </button>
                    )}

                    {/* Item Edit & Delete Buttons */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEditItem(section.id, item)}
                        className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                        title="Full edit item"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${item.name}" from ${section.title}?`)) {
                            onDeleteItem(section.id, item.id);
                          }
                        }}
                        className="p-1.5 rounded-lg hover:bg-rose-500/15 text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
