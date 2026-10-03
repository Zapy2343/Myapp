import React, { useState, useEffect } from 'react';
import { X, Scale, Sparkles, Check, Info } from 'lucide-react';
import type { AssetItem, CurrencyCode } from '../types';
import { formatCurrency } from '../utils/formatters';

interface GoldCalculatorModalProps {
  isOpen: boolean;
  item: AssetItem | null;
  sectionId: string;
  currency: CurrencyCode;
  onClose: () => void;
  onSave: (
    sectionId: string,
    itemId: string,
    calculatedAmount: number,
    goldDetails: {
      weight: number;
      unit: 'grams' | 'tolas' | 'oz';
      purity: '24K' | '22K' | '18K' | '14K';
      ratePerUnit: number;
    }
  ) => void;
}

export const GoldCalculatorModal: React.FC<GoldCalculatorModalProps> = ({
  isOpen,
  item,
  sectionId,
  currency,
  onClose,
  onSave,
}) => {
  if (!isOpen || !item) return null;

  const initialDetails = item.goldDetails || {
    weight: 10,
    unit: 'grams',
    purity: '24K',
    ratePerUnit: 85,
  };

  const [weight, setWeight] = useState<number>(initialDetails.weight || 10);
  const [unit, setUnit] = useState<'grams' | 'tolas' | 'oz'>(
    initialDetails.unit || 'grams'
  );
  const [purity, setPurity] = useState<'24K' | '22K' | '18K' | '14K'>(
    initialDetails.purity || '24K'
  );
  const [ratePerUnit, setRatePerUnit] = useState<number>(
    initialDetails.ratePerUnit || 85
  );

  // Re-initialize when modal opens with new item
  useEffect(() => {
    if (item.goldDetails) {
      setWeight(item.goldDetails.weight);
      setUnit(item.goldDetails.unit);
      setPurity(item.goldDetails.purity);
      setRatePerUnit(item.goldDetails.ratePerUnit);
    }
  }, [item]);

  // Purity factors relative to 24K
  const PURITY_FACTORS: Record<string, number> = {
    '24K': 1.0,
    '22K': 22 / 24, // 0.9167
    '18K': 18 / 24, // 0.75
    '14K': 14 / 24, // 0.5833
  };

  // Calculate total:
  // Note: if user enters rate for 24K, purity scales it, or rate can be direct
  const purityFactor = PURITY_FACTORS[purity] || 1.0;
  const calculatedTotal = Math.round(weight * ratePerUnit * purityFactor);

  const handleApply = () => {
    onSave(sectionId, item.id, calculatedTotal, {
      weight,
      unit,
      purity,
      ratePerUnit,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-amber-500/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Gold & Precious Metals Valuation</h3>
              <p className="text-xs text-amber-300/80">
                Calculate value for <span className="font-semibold text-white">{item.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Weight & Unit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Gold Weight
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={weight || ''}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 50"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Weight Unit
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="grams">Grams (g)</option>
                <option value="tolas">Tolas (1 tola = ~11.66g)</option>
                <option value="oz">Troy Ounces (oz)</option>
              </select>
            </div>
          </div>

          {/* Purity & Rate Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Purity
              </label>
              <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {(['24K', '22K', '18K', '14K'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurity(p)}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-colors ${
                      purity === p
                        ? 'bg-amber-500 text-slate-950 shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Rate Today (per {unit === 'grams' ? 'gram' : unit === 'tolas' ? 'tola' : 'oz'})
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={ratePerUnit || ''}
                onChange={(e) => setRatePerUnit(parseFloat(e.target.value) || 0)}
                placeholder="e.g. 85 or 140000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Instant Computed Total Display */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="text-xs text-amber-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Calculated Market Value</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight mt-0.5">
                {formatCurrency(calculatedTotal, currency)}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                {weight} {unit} × {formatCurrency(ratePerUnit, currency)} / {unit}
                {purity !== '24K' && ` × ${(purityFactor * 100).toFixed(1)}% purity (${purity})`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              Tip: You can update today's local gold rate per {unit === 'grams' ? 'gram' : unit === 'tolas' ? 'tola' : 'oz'} anytime to instantly refresh your total gold portfolio value!
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Apply to Asset</span>
          </button>
        </div>
      </div>
    </div>
  );
};
