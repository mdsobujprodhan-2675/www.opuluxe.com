import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  Smartphone, 
  ShoppingBag,
  ArrowRight,
  Printer
} from 'lucide-react';
import { CartItem, Currency, Order } from '../types';
import { formatPrice } from '../utils/currency';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  subtotal,
  discountAmount,
  deliveryFee,
  totalAmount,
  onOrderPlaced,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'card'>('cod');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'Please enter your full name';
    if (!phone.trim() || phone.length < 8) errs.phone = 'Valid phone number is required';
    if (!address.trim()) errs.address = 'Delivery address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder: Order = {
      id: `OPULUXE-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...items],
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
      customerName: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city,
      paymentMethod,
      status: 'Confirmed',
      createdAt: Date.now(),
    };

    setConfirmedOrder(newOrder);
    onOrderPlaced(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {confirmedOrder ? (
          /* Order Success Confirmation Screen */
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Order Confirmed
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                Thank You For Your Order!
              </h2>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                We have received your order. Our team is packing your items for swift delivery.
              </p>
            </div>

            {/* Receipt Box */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Order Number</p>
                  <p className="font-mono font-bold text-slate-900 text-sm">{confirmedOrder.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-400 font-semibold uppercase">Payment</p>
                  <p className="font-bold text-emerald-700 uppercase text-xs">
                    {confirmedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : confirmedOrder.paymentMethod.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Customer:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.customerName} ({confirmedOrder.phone})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Address:</span>
                  <span className="font-semibold text-slate-900 text-right max-w-[240px] truncate">{confirmedOrder.address}, {confirmedOrder.city}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Items Ordered:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.items.reduce((s, i) => s + i.quantity, 0)} items</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                  <span>Grand Total:</span>
                  <span className="text-emerald-700">{formatPrice(confirmedOrder.totalAmount, currency)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                id="btn-order-success-close"
                onClick={() => {
                  setConfirmedOrder(null);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition-colors cursor-pointer"
              >
                <span>Continue Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Opuluxe Checkout</h2>
                  <p className="text-xs text-slate-500">Provide shipping and payment details</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Shipping Details */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>1. Delivery Details</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="checkout-name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                          errors.name ? 'border-rose-500' : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        id="checkout-phone"
                        type="tel"
                        placeholder="+880 1700-000000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                          errors.phone ? 'border-rose-500' : 'border-slate-300 focus:border-emerald-600'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Address *</label>
                    <input
                      id="checkout-address"
                      type="text"
                      placeholder="House, Road, Area / Sector..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl border text-xs sm:text-sm focus:outline-none ${
                        errors.address ? 'border-rose-500' : 'border-slate-300 focus:border-emerald-600'
                      }`}
                    />
                    {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">City / Region</label>
                    <select
                      id="checkout-city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 text-xs sm:text-sm bg-white focus:outline-none"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barisal">Barisal</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>2. Select Payment Method</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* COD */}
                  <label 
                    className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Banknote className="w-5 h-5 text-emerald-700" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Cash on Delivery</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Pay in cash upon doorstep receipt</span>
                  </label>

                  {/* bKash / Mobile */}
                  <label 
                    className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'bkash'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Smartphone className="w-5 h-5 text-pink-600" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bkash'}
                        onChange={() => setPaymentMethod('bkash')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900">bKash / Nagad</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Instant mobile banking payment</span>
                  </label>

                  {/* Card */}
                  <label 
                    className={`flex flex-col p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <CreditCard className="w-5 h-5 text-indigo-600" />
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900">Card / Online</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">Visa, Mastercard & Amex</span>
                  </label>
                </div>
              </div>

              {/* Order Summary Recap */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Items ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span>{formatPrice(subtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Voucher Discount:</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Shipping Fee:</span>
                  <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-900 font-bold pt-2 border-t border-slate-200 text-sm">
                  <span>Total Amount Payable:</span>
                  <span className="text-emerald-700">{formatPrice(totalAmount, currency)}</span>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  Back to Cart
                </button>
                <button
                  id="btn-place-order-confirm"
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Order ({formatPrice(totalAmount, currency)})</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
