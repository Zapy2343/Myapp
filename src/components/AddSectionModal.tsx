import React, { useState, useEffect } from 'react';
import { X, Check, FolderPlus, Palette } from 'lucide-react';
import type { AssetSection } from '../types';
import { AVAILABLE_ICONS, DynamicIcon } from './DynamicIcon';

interface AddSectionModalProps {
  isOpen: boolean;
  sectionToEdit: AssetSection | null;
  onClose: () => void;
  onSave: (sectionData: {
    id?: string;
    title: string;
    description?: string;
    iconName: string;
    color: string;
  }) => void;
}

const COLOR_OPTIONS = [
  { name: 'emerald', bg: 'bg-emerald-500', label: 'Emerald' },
  { name: 'blue', bg: 'bg-blue-500', label: 'Blue' },
  { name: 'amber', bg: 'bg-amber-500', label: 'Amber / Gold' },
  { name: 'purple', bg: 'bg-purple-500', label: 'Purple' },
  { name: 'cyan', bg: 'bg-cyan-500', label: 'Cyan' },
  { name: 'rose', bg: 'bg-rose-500', label: 'Rose' },
  { name: 'indigo', bg: 'bg-indigo-500', label: 'Indigo' },
];

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  sectionToEdit,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Landmark');
  const [color, setColor] = useState('cyan');

  useEffect(() => {
    if (sectionToEdit) {
      setTitle(sectionToEdit.title);
      setDescription(sectionToEdit.description || '');
      setIconName(sectionToEdit.iconName);
      setColor(sectionToEdit.color);
    } else {
      setTitle('');
      setDescription('');
      setIconName('Layers');
      setColor('cyan');
    }
  }, [sectionToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: sectionToEdit?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      iconName,
      color,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {sectionToEdit ? 'Edit Asset Section' : 'Create New Asset Section'}
              </h3>
              <p className="text-xs text-slate-400">
                Organize your assets into custom categories
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

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Title */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Section Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real Estate, Crypto, Retirement / 401(k), Cash"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Short Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Physical properties, digital currencies, liquid cash"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Choose Icon
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setIconName(icon.name)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all ${
                      iconName === icon.name
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                    title={icon.label}
                  >
                    <DynamicIcon name={icon.name} className="w-5 h-5 mb-1" />
                    <span className="text-[10px] truncate max-w-full">{icon.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Accent Picker */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-slate-400" />
                Color Theme
              </label>
              <div className="flex items-center gap-2.5 flex-wrap">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.name)}
                    className={`w-7 h-7 rounded-full ${c.bg} transition-all flex items-center justify-center ${
                      color === c.name
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110 shadow-md'
                        : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={c.label}
                  >
                    {color === c.name && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </button>
                ))}
              </div>
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-950 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{sectionToEdit ? 'Save Section' : 'Create Section'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
