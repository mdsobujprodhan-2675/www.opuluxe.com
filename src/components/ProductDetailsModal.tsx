import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Plus, 
  Minus,
  Heart
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, calculateDiscount } from '../utils/currency';

interface ProductDetailsModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  currency: Currency;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  isOpen,
  onClose,
  currency,
  isInWishlist,
  onToggleWishlist,
  onAddToCart,
  onEditProduct,
  onDeleteProduct,
}) => {
  const [selectedQty, setSelectedQty] = useState(1);

  if (!isOpen || !product) return null;

  const discountPercent = calculateDiscount(product.price, product.originalPrice);

  const handleAdd = () => {
    onAddToCart(product, selectedQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 text-slate-500 hover:text-slate-800 hover:bg-white shadow-xs transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Area */}
          <div className="relative bg-slate-100 flex items-center justify-center p-6 aspect-square md:aspect-auto">
            <img
              src={product.image}
              alt={product.title}
              className="max-h-[360px] w-full object-contain drop-shadow-md rounded-2xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
              }}
            />
            {product.badge && (
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-xs font-bold uppercase bg-emerald-600 text-white shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Details Content */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              {/* Category & Rating */}
              <div className="flex items-center justify-between">
                <span className="uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs">
                  {product.category}
                </span>

                <div className="flex items-center gap-1 text-slate-800 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating}</span>
                  <span className="text-slate-400 text-xs font-normal">({product.reviewsCount} customer reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-emerald-700">
                  {formatPrice(product.price, currency)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base text-slate-400 line-through">
                      {formatPrice(product.originalPrice, currency)}
                    </span>
                    {discountPercent && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                        Save {discountPercent}%
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Stock status */}
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-semibold text-slate-700">
                  Status: {product.stock > 0 ? (
                    <span className="text-emerald-600 font-bold">In Stock ({product.stock} available)</span>
                  ) : (
                    <span className="text-rose-600 font-bold">Out of Stock</span>
                  )}
                </span>
              </div>

              {/* Description */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                <p>{product.description}</p>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Fast Delivery</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Original Item</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Easy Return</span>
                </div>
              </div>
            </div>

            {/* Actions: Quantity + Add to cart + Wishlist + Edit / Delete */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Qty Selector */}
                <div className="flex items-center rounded-xl bg-slate-100 border border-slate-200 p-1">
                  <button
                    onClick={() => setSelectedQty(Math.max(1, selectedQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3.5 text-sm font-bold text-slate-900">{selectedQty}</span>
                  <button
                    onClick={() => setSelectedQty(Math.min(product.stock, selectedQty + 1))}
                    className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <button
                  id="btn-modal-add-to-cart"
                  onClick={handleAdd}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {selectedQty > 1 ? `(${selectedQty})` : ''} to Cart</span>
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => onToggleWishlist(product.id)}
                  className={`p-3 rounded-xl border transition-colors ${
                    isInWishlist
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Edit & Delete Controls for Catalog Management */}
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    onClose();
                    onEditProduct(product);
                  }}
                  className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-semibold px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Product</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onDeleteProduct(product);
                  }}
                  className="flex items-center gap-1.5 text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Product</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
