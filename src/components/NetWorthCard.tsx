import {
  Sparkles,
  Camera,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
} from 'lucide-react';
import type { AssetSection, CurrencyCode, NetWorthSnapshot } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface NetWorthCardProps {
  sections: AssetSection[];
  currency: CurrencyCode;
  privacyMode: boolean;
  latestSnapshot?: NetWorthSnapshot;
  onTakeSnapshot: () => void;
}

const SECTION_COLOR_MAP: Record<string, { bg: string; text: string; bar: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', bar: 'bg-blue-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', bar: 'bg-emerald-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', bar: 'bg-amber-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', bar: 'bg-purple-500' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', bar: 'bg-rose-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', bar: 'bg-cyan-500' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', bar: 'bg-indigo-500' },
};

export const NetWorthCard: React.FC<NetWorthCardProps> = ({
  sections,
  currency,
  privacyMode,
  latestSnapshot,
  onTakeSnapshot,
}) => {
  // Compute total net worth
  const totalNetWorth = sections.reduce((sum, sec) => {
    const secSum = sec.items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    return sum + secSum;
  }, 0);

  // Compute breakdown and percentages
  const sectionBreakdown = sections.map((sec) => {
    const secTotal = sec.items.reduce((s, i) => s + (Number(i.amount) || 0), 0);
    const percentage = totalNetWorth > 0 ? (secTotal / totalNetWorth) * 100 : 0;
    return {
      id: sec.id,
      title: sec.title,
      total: secTotal,
      color: sec.color,
      percentage,
      itemCount: sec.items.length,
    };
  });

  // Calculate change vs latest snapshot
  let diffAmount = 0;
  let diffPercent = 0;
  if (latestSnapshot && latestSnapshot.totalNetWorth > 0) {
    diffAmount = totalNetWorth - latestSnapshot.totalNetWorth;
    diffPercent = (diffAmount / latestSnapshot.totalNetWorth) * 100;
  }

  const totalItemCount = sections.reduce((s, sec) => s + sec.items.length, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 p-6 sm:p-8 shadow-2xl">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              Total Net Worth & Assets
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full border border-slate-700/60">
              <ShieldCheck className="w-3 h-3 text-emerald-400" /> All assets verified
            </span>
          </div>

          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {formatCurrency(totalNetWorth, currency, privacyMode)}
            </h2>

            {latestSnapshot && (
              <div
                className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  diffAmount >= 0
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}
              >
                {diffAmount >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {diffAmount >= 0 ? '+' : ''}
                  {formatCurrency(diffAmount, currency, privacyMode)} (
                  {diffPercent.toFixed(1)}%)
                </span>
                <span className="text-slate-400 text-[10px] font-normal">
                  vs {formatDate(latestSnapshot.date)}
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-2 flex items-center gap-2">
            <span>Aggregated across {sections.length} sections and {totalItemCount} balance accounts.</span>
          </p>
        </div>

        {/* Snapshot Quick Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={onTakeSnapshot}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Record a snapshot of your current net worth to track changes over time"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>Save Snapshot</span>
          </button>
        </div>
      </div>

      {/* Visual Asset Allocation Bar */}
      <div className="relative z-10 mt-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-medium text-slate-300 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Asset Allocation
          </span>
          <span className="text-[11px] text-slate-500">100% of recorded wealth</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-3 bg-slate-800/90 rounded-full overflow-hidden flex shadow-inner">
          {sectionBreakdown.map((sec) => {
            if (sec.percentage <= 0) return null;
            const colorClass =
              SECTION_COLOR_MAP[sec.color]?.bar || 'bg-slate-500';
            return (
              <div
                key={sec.id}
                style={{ width: `${sec.percentage}%` }}
                className={`${colorClass} transition-all duration-500 hover:brightness-125 relative group cursor-pointer`}
                title={`${sec.title}: ${sec.percentage.toFixed(1)}%`}
              />
            );
          })}
        </div>

        {/* Section Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {sectionBreakdown.map((sec) => {
            const colors = SECTION_COLOR_MAP[sec.color] || SECTION_COLOR_MAP.blue;
            return (
              <div
                key={sec.id}
                className="bg-slate-950/60 rounded-xl p-3 border border-slate-800/60 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-medium text-slate-300 truncate" title={sec.title}>
                    {sec.title}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {sec.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="text-sm font-bold text-white tracking-tight truncate">
                  {formatCurrency(sec.total, currency, privacyMode)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
