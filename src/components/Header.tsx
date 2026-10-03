import React from 'react';
import {
  Eye,
  EyeOff,
  PlusCircle,
  Download,
  History,
  ShieldCheck,
  FolderPlus,
} from 'lucide-react';
import type { CurrencyCode } from '../types';
import { CURRENCIES } from '../utils/formatters';

interface HeaderProps {
  currency: CurrencyCode;
  onCurrencyChange: (currency: CurrencyCode) => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  onOpenAddSection: () => void;
  onOpenAddItem: () => void;
  onOpenSnapshots: () => void;
  onOpenBackup: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currency,
  onCurrencyChange,
  privacyMode,
  onTogglePrivacy,
  onOpenAddSection,
  onOpenAddItem,
  onOpenSnapshots,
  onOpenBackup,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <ShieldCheck className="w-6 h-6 text-slate-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white m-0">
                  Asset<span className="text-emerald-400">Flow</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Vault
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Personal Net Worth & Asset Overview</p>
            </div>
          </div>

          {/* Mobile Quick Action */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={onTogglePrivacy}
              className={`p-2 rounded-lg border transition-colors ${
                privacyMode
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
              }`}
              title={privacyMode ? 'Show Balances' : 'Hide Balances (Privacy Mode)'}
            >
              {privacyMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenAddItem}
              className="p-2 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-500 transition-colors"
              title="Add New Asset"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap justify-end gap-2 w-full sm:w-auto">
          {/* Privacy Toggle (Desktop) */}
          <button
            onClick={onTogglePrivacy}
            className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              privacyMode
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
            title={privacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode (Mask Balances)'}
          >
            {privacyMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Masked</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Privacy</span>
              </>
            )}
          </button>

          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => onCurrencyChange(e.target.value as CurrencyCode)}
              className="appearance-none bg-slate-900/90 border border-slate-800 text-slate-200 text-xs font-medium rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer hover:border-slate-700 transition-colors"
            >
              {Object.values(CURRENCIES).map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-100">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 text-[10px]">
              ▼
            </div>
          </div>

          {/* Snapshot History Button */}
          <button
            onClick={onOpenSnapshots}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium hover:text-white hover:border-slate-700 transition-colors"
            title="View Net Worth Timeline & Snapshots"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Snapshots</span>
          </button>

          {/* Data Backup / Export Button */}
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium hover:text-white hover:border-slate-700 transition-colors"
            title="Backup, Export & Import Data"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Backup</span>
          </button>

          {/* Add New Section Button */}
          <button
            onClick={onOpenAddSection}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium hover:bg-slate-750 hover:text-white transition-colors"
            title="Create a New Asset Section"
          >
            <FolderPlus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Add Section</span>
          </button>

          {/* Add Asset Button */}
          <button
            onClick={onOpenAddItem}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
