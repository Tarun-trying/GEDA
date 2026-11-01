import React from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';

export default function ResetModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl p-6 shadow-xl border border-surface-container">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="font-headline font-bold text-lg text-on-surface">
              Reset Demonstration State?
            </h3>
            <p className="text-xs text-on-surface-variant">
              GEDA Mission LiFE Demo Session
            </p>
          </div>
        </div>

        <p className="text-sm text-on-surface-variant mb-5 leading-relaxed">
          This will restore the sample household electricity consumption, reset all completed challenges, and return points to the initial demo baseline. Your browser's localStorage will be cleared.
        </p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-surface-container-low">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-on-surface-variant bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
