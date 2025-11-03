'use client';

import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      iconBg: 'from-red-500 to-red-600',
      confirmBg: 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700',
      border: 'border-red-500/30',
    },
    warning: {
      iconBg: 'from-orange-500 to-orange-600',
      confirmBg: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      border: 'border-orange-500/30',
    },
    info: {
      iconBg: 'from-teal-500 to-cyan-600',
      confirmBg: 'from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700',
      border: 'border-teal-500/30',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fadeIn"
      onClick={onCancel}
    >
      <div
        className={`bg-gray-900 border ${styles.border} rounded-3xl shadow-2xl max-w-md w-full p-6 animate-slideUp`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${styles.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
            <p className="text-gray-300 text-sm">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 rounded-xl font-semibold hover:bg-gray-700 transition-colors border border-gray-700"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 bg-gradient-to-r ${styles.confirmBg} text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

