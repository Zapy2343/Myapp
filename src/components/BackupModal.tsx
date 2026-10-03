import React, { useRef } from 'react';
import { X, Download, Upload, FileSpreadsheet, RotateCcw, ShieldCheck } from 'lucide-react';
import type { AppData } from '../types';
import { exportBackup, exportCSV, INITIAL_DATA } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  data: AppData;
  onClose: () => void;
  onRestoreData: (restoredData: AppData) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  data,
  onClose,
  onRestoreData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.sections && Array.isArray(parsed.sections)) {
          onRestoreData(parsed);
          alert('Data backup successfully restored!');
          onClose();
        } else {
          alert('Invalid backup file format. Missing sections data.');
        }
      } catch (err) {
        alert('Failed to parse the backup file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (
      confirm(
        'Are you sure you want to reset all data back to default starter templates? This will overwrite your current balances.'
      )
    ) {
      onRestoreData(INITIAL_DATA);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Data Backup & Export</h3>
              <p className="text-xs text-slate-400">
                100% private, local-first browser storage with easy backup
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
        <div className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3 text-xs text-slate-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white block mb-0.5">Offline-first & Zero Cloud Tracking</span>
              Your financial balances are stored strictly inside your browser's private storage. No bank logins or external servers ever see your numbers. You can transfer your data between devices anytime using the backup JSON file below.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Download Backup JSON */}
            <button
              onClick={() => exportBackup(data)}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 flex flex-col items-center justify-center text-center transition-all group"
            >
              <Download className="w-6 h-6 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-white">Download Backup</span>
              <span className="text-[11px] text-slate-400 mt-1">Full JSON file with all sections & history</span>
            </button>

            {/* Restore Backup JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 flex flex-col items-center justify-center text-center transition-all group"
            >
              <Upload className="w-6 h-6 text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold text-white">Restore Backup</span>
              <span className="text-[11px] text-slate-400 mt-1">Upload a previous JSON backup</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Export to CSV */}
          <button
            onClick={() => exportCSV(data)}
            className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 flex items-center justify-between text-xs text-slate-300 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold">Export to Spreadsheet (.CSV)</span>
            </div>
            <span className="text-[11px] text-slate-500">Excel / Google Sheets compatible</span>
          </button>

          {/* Reset to Default */}
          <div className="pt-3 border-t border-slate-800/80">
            <button
              onClick={handleReset}
              className="w-full p-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Sample Starter Data</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
