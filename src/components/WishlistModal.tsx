import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProductIds: string[];
  products: Product[];
  currency: Currency;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (productId: string) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProductIds,
  products,
  currency,
  onAddToCart,
  onRemoveFromWishlist,
}) => {
  if (!isOpen) return null;

  const wishlistProducts = products.filter((p) => wishlistProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Your Wishlist</h2>
              <p className="text-xs text-slate-500">{wishlistProducts.length} saved favorites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-3">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
                <Heart className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-800">Your wishlist is empty</p>
              <p className="text-xs text-slate-500">Tap the heart icon on any product to save it here for later.</p>
            </div>
          ) : (
            wishlistProducts.map((prod) => (
              <div
                key={prod.id}
                className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 justify-between"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 truncate max-w-[170px]">{prod.title}</h4>
                    <p className="text-xs font-bold text-emerald-700 mt-0.5">{formatPrice(prod.price, currency)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(prod);
                      onRemoveFromWishlist(prod.id);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
