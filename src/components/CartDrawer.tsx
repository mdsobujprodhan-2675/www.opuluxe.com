import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Check, 
  Truck,
  Sparkles
} from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const FREE_DELIVERY_THRESHOLD = 500;
  const STANDARD_DELIVERY_FEE = 60;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (appliedCoupon === 'OPULUXE20' || appliedCoupon === 'CARTUP20') ? Math.round(subtotal * 0.2) : 0;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE;
  const finalTotal = Math.max(0, subtotal - discountAmount + deliveryFee);
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim());
    if (!success) {
      setCouponError('Invalid privilege code. Try OPULUXE20');
    } else {
      setCouponInput('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                <p className="text-xs text-slate-500">{items.reduce((s, i) => s + i.quantity, 0)} items in basket</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  id="btn-clear-cart"
                  onClick={onClearCart}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                id="btn-close-cart"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close cart"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Delivery Progress Bar */}
          {items.length > 0 && (
            <div className="bg-emerald-50 px-5 py-2.5 border-b border-emerald-100 text-xs">
              {amountNeededForFreeDelivery === 0 ? (
                <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked <strong>FREE Delivery</strong> on this order!</span>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      Add <strong>{formatPrice(amountNeededForFreeDelivery, currency)}</strong> more for free delivery
                    </span>
                    <span className="font-bold text-emerald-700">
                      {Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100))}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-emerald-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-10 h-10 stroke-1" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">Your cart is empty</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs">
                    Looks like you haven't added any products to your Opuluxe shopping bag yet.
                  </p>
                </div>
                <button
                  id="btn-empty-cart-shop"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  id={`cart-item-${item.productId}`}
                  className="flex gap-3 p-3 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0 bg-white"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          id={`btn-remove-cart-${item.productId}`}
                          onClick={() => onRemoveItem(item.productId)}
                          className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 capitalize">
                        {item.product.category}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-xs sm:text-sm text-slate-900">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>

                      {/* Qty controller */}
                      <div className="flex items-center rounded-lg bg-white border border-slate-200 p-0.5">
                        <button
                          id={`cart-minus-${item.productId}`}
                          onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
                          className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{item.quantity}</span>
                        <button
                          id={`cart-plus-${item.productId}`}
                          onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Breakdown */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-200 bg-white space-y-4">
              {/* Coupon Form */}
              <div>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Applied: {appliedCoupon} (-20%)</span>
                    </div>
                    <button
                      onClick={onRemoveCoupon}
                      className="text-rose-600 hover:text-rose-700 text-xs font-semibold px-2 py-0.5"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-1">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id="cart-coupon-input"
                          type="text"
                          placeholder="Privilege code (e.g. OPULUXE20)"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 text-xs uppercase font-mono rounded-xl border border-slate-300 focus:border-emerald-600 focus:outline-none"
                        />
                      </div>
                      <button
                        id="btn-apply-coupon"
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponError && <p className="text-[11px] text-rose-500">{couponError}</p>}
                  </form>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">{formatPrice(subtotal, currency)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount (20%)</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-[11px]">FREE</span>
                    ) : (
                      formatPrice(deliveryFee, currency)
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-sm sm:text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Amount</span>
                  <span className="text-emerald-700">{formatPrice(finalTotal, currency)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                id="btn-proceed-checkout"
                onClick={onProceedToCheckout}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
