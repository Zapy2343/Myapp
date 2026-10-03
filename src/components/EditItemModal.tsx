import React, { useState, useEffect } from 'react';
import { X, Check, Scale } from 'lucide-react';
import type { AssetSection, AssetItem, CurrencyCode } from '../types';

interface EditItemModalProps {
  isOpen: boolean;
  sections: AssetSection[];
  initialSectionId?: string;
  itemToEdit: AssetItem | null;
  currency: CurrencyCode;
  onClose: () => void;
  onSave: (
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
  ) => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({
  isOpen,
  sections,
  initialSectionId,
  itemToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    initialSectionId || (sections[0] ? sections[0].id : '')
  );
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [institution, setInstitution] = useState('');
  const [notes, setNotes] = useState('');

  // Special share details (invested cost)
  const [investedTotal, setInvestedTotal] = useState<string>('');

  // Special gold details
  const [goldWeight, setGoldWeight] = useState<string>('');
  const [goldUnit, setGoldUnit] = useState<'grams' | 'tolas' | 'oz'>('grams');
  const [goldPurity, setGoldPurity] = useState<'24K' | '22K' | '18K' | '14K'>('24K');
  const [goldRate, setGoldRate] = useState<string>('');

  useEffect(() => {
    if (itemToEdit) {
      setName(itemToEdit.name || '');
      setAmount(itemToEdit.amount?.toString() || '');
      setInstitution(itemToEdit.institution || '');
      setNotes(itemToEdit.notes || '');

      if (itemToEdit.shareDetails) {
        setInvestedTotal(itemToEdit.shareDetails.investedTotal?.toString() || '');
      } else {
        setInvestedTotal('');
      }

      if (itemToEdit.goldDetails) {
        setGoldWeight(itemToEdit.goldDetails.weight.toString());
        setGoldUnit(itemToEdit.goldDetails.unit);
        setGoldPurity(itemToEdit.goldDetails.purity);
        setGoldRate(itemToEdit.goldDetails.ratePerUnit.toString());
      } else {
        setGoldWeight('');
        setGoldRate('');
      }
    } else {
      setName('');
      setAmount('');
      setInstitution('');
      setNotes('');
      setInvestedTotal('');
      setGoldWeight('');
      setGoldRate('');
    }

    if (initialSectionId) {
      setSelectedSectionId(initialSectionId);
    }
  }, [itemToEdit, initialSectionId, isOpen]);

  const targetSection = sections.find((s) => s.id === selectedSectionId);
  const isGoldSection = targetSection?.type === 'gold';
  const isShareSection = targetSection?.type === 'shares';

  const handleCalculateGold = () => {
    const w = parseFloat(goldWeight) || 0;
    const r = parseFloat(goldRate) || 0;
    const factor =
      goldPurity === '24K'
        ? 1.0
        : goldPurity === '22K'
        ? 22 / 24
        : goldPurity === '18K'
        ? 18 / 24
        : 14 / 24;
    const total = Math.round(w * r * factor);
    setAmount(total.toString());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedAmount = parseFloat(amount) || 0;

    let goldDetails: AssetItem['goldDetails'] = undefined;
    if (isGoldSection && parseFloat(goldWeight) > 0) {
      goldDetails = {
        weight: parseFloat(goldWeight),
        unit: goldUnit,
        purity: goldPurity,
        ratePerUnit: parseFloat(goldRate) || 0,
      };
    }

    let shareDetails: AssetItem['shareDetails'] = undefined;
    if (isShareSection && investedTotal) {
      shareDetails = {
        investedTotal: parseFloat(investedTotal) || 0,
      };
    }

    onSave(selectedSectionId, {
      id: itemToEdit ? itemToEdit.id : undefined,
      name: name.trim(),
      amount: parsedAmount,
      institution: institution.trim() || undefined,
      notes: notes.trim() || undefined,
      goldDetails,
      shareDetails,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <h3 className="text-base font-bold text-white">
              {itemToEdit ? 'Edit Asset Balance' : 'Add New Asset Balance'}
            </h3>
            <p className="text-xs text-slate-400">
              {itemToEdit
                ? 'Update your balance amount or details'
                : 'Record a new account or asset to your portfolio'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* Section Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category / Section
              </label>
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                disabled={!!itemToEdit}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 disabled:opacity-60 cursor-pointer"
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id}>
                    {sec.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Asset Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Asset / Account Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chase Checking, 24K Gold Bar, Apple (AAPL), Emergency HYSA"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Balance Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Current Balance / Value <span className="text-rose-400">*</span>
                </label>
                {isGoldSection && (
                  <span className="text-[11px] text-amber-400 font-medium">
                    (Or calculate using gold weight below)
                  </span>
                )}
              </div>
              <input
                type="number"
                step="any"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-base font-bold text-emerald-400 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Institution / Platform */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Institution / Broker / Vault (Optional)
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Bank of America, Fidelity, Safe Locker, Robinhood"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Extra Gold Fields if Gold Section */}
            {isGoldSection && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    Gold Weight & Rate Details (Optional)
                  </span>
                  <button
                    type="button"
                    onClick={handleCalculateGold}
                    className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 underline"
                  >
                    Auto-Compute Value
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Weight</span>
                    <input
                      type="number"
                      step="any"
                      value={goldWeight}
                      onChange={(e) => setGoldWeight(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Unit</span>
                    <select
                      value={goldUnit}
                      onChange={(e) => setGoldUnit(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="grams">Grams (g)</option>
                      <option value="tolas">Tolas</option>
                      <option value="oz">Troy Oz</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Purity</span>
                    <select
                      value={goldPurity}
                      onChange={(e) => setGoldPurity(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-white"
                    >
                      <option value="24K">24K (99.9%)</option>
                      <option value="22K">22K (91.6%)</option>
                      <option value="18K">18K (75%)</option>
                      <option value="14K">14K (58.3%)</option>
                    </select>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Rate Today</span>
                    <input
                      type="number"
                      step="any"
                      value={goldRate}
                      onChange={(e) => setGoldRate(e.target.value)}
                      placeholder="e.g. 85"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Extra Share Fields if Share Section */}
            {isShareSection && (
              <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                <span className="text-xs font-bold text-purple-300 block">
                  Invested Capital (Optional)
                </span>
                <p className="text-[11px] text-slate-400">
                  Enter the amount you originally invested to automatically calculate your overall gain or loss.
                </p>
                <input
                  type="number"
                  step="any"
                  value={investedTotal}
                  onChange={(e) => setInvestedTotal(e.target.value)}
                  placeholder="Total invested cost (e.g. 10000)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Notes / Account Details (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Account number last 4 digits, lock-in period, target maturity date"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{itemToEdit ? 'Save Changes' : 'Add Asset'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
