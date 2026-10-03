import React from 'react';
import { X, History, TrendingUp, Calendar, Trash2 } from 'lucide-react';
import type { CurrencyCode, NetWorthSnapshot } from '../types';
import { formatCurrency, formatDate } from '../utils/formatters';

interface SnapshotHistoryModalProps {
  isOpen: boolean;
  snapshots: NetWorthSnapshot[];
  currency: CurrencyCode;
  privacyMode: boolean;
  onClose: () => void;
  onDeleteSnapshot: (snapshotId: string) => void;
}

export const SnapshotHistoryModal: React.FC<SnapshotHistoryModalProps> = ({
  isOpen,
  snapshots,
  currency,
  privacyMode,
  onClose,
  onDeleteSnapshot,
}) => {
  if (!isOpen) return null;

  // Sort descending by date
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Net Worth History & Snapshots</h3>
              <p className="text-xs text-slate-400">
                Track how your financial position evolves over time
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {sortedSnapshots.length === 0 ? (
            <div className="text-center py-10">
              <TrendingUp className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No snapshots recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">
                Click "Save Snapshot" on the dashboard to record your current net worth.
              </p>
            </div>
          ) : (
            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
              {sortedSnapshots.map((snap, index) => {
                const prev = sortedSnapshots[index + 1];
                let diff = 0;
                let diffPct = 0;
                if (prev) {
                  diff = snap.totalNetWorth - prev.totalNetWorth;
                  diffPct = prev.totalNetWorth > 0 ? (diff / prev.totalNetWorth) * 100 : 0;
                }

                return (
                  <div
                    key={snap.id}
                    className="relative pl-8 group"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-1.5 top-3.5 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-900 border border-slate-950" />

                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          <span>{formatDate(snap.date)}</span>
                          {snap.note && (
                            <span className="text-[11px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300">
                              {snap.note}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => {
                            if (confirm('Delete this historical snapshot?')) {
                              onDeleteSnapshot(snap.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity p-1"
                          title="Delete snapshot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline justify-between mt-2">
                        <span className="text-xl font-bold text-white tracking-tight">
                          {formatCurrency(snap.totalNetWorth, currency, privacyMode)}
                        </span>

                        {prev && (
                          <span
                            className={`text-xs font-semibold ${
                              diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                            }`}
                          >
                            {diff >= 0 ? '+' : ''}
                            {formatCurrency(diff, currency, privacyMode)} ({diffPct.toFixed(1)}%)
                          </span>
                        )}
                      </div>

                      {/* Section breakdown chips */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-2 border-t border-slate-850">
                        {snap.sectionBreakdown?.map((b) => (
                          <span
                            key={b.sectionId}
                            className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {b.sectionTitle}: {formatCurrency(b.total, currency, privacyMode)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
