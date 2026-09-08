import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirmDelete: (productId: string) => void;
  currency: Currency;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  product,
  onClose,
  onConfirmDelete,
  currency,
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Top bar with close */}
        <div className="flex justify-end p-3 pb-0">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 pt-0 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
            <Trash2 className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Delete This Product?
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              This will permanently remove the item from the Opuluxe boutique and any active carts.
            </p>
          </div>

          {/* Product Preview Snippet */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <img
              src={product.image}
              alt={product.title}
              className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
              }}
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-xs truncate">{product.title}</h4>
              <p className="text-[11px] text-slate-500 capitalize">{product.category}</p>
              <p className="text-xs font-bold text-emerald-700 mt-0.5">
                {formatPrice(product.price, currency)}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              id="cancel-delete-btn"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-btn"
              onClick={() => {
                onConfirmDelete(product.id);
                onClose();
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-md shadow-rose-600/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Yes, Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
