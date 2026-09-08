import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  PlusCircle, 
  Heart, 
  X, 
  Layers,
  Sparkles,
  PhoneCall,
  Globe,
  BarChart3
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenAddProduct: () => void;
  currency: Currency;
  onCurrencyToggle: () => void;
  onOpenWishlist: () => void;
  totalProductsCount: number;
  onOpenDomainModal: () => void;
  onOpenReports: (mode?: 'customer' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenAddProduct,
  currency,
  onCurrencyToggle,
  onOpenWishlist,
  totalProductsCount,
  onOpenDomainModal,
  onOpenReports,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Flash Deal
            </span>
            <span>Get 20% OFF using code <strong className="text-amber-300 font-mono tracking-wide">OPULUXE20</strong> • Complimentary Delivery over {formatPrice(500, currency)}</span>
            
            {/* Domain Badge */}
            <button
              id="top-domain-btn"
              onClick={onOpenDomainModal}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-semibold cursor-pointer transition-colors ml-2"
              title="Official domain & share info"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>www.opuluxe.com</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-slate-300 text-xs">
            <div className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer">
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span>Concierge: +880 1800-OPULUXE</span>
            </div>
            <button
              id="currency-toggle-top"
              onClick={onCurrencyToggle}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium border border-slate-700 transition-colors"
            >
              Currency: <span className="font-bold text-amber-300">{currency}</span> ({currency === 'BDT' ? '৳' : '$'})
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform duration-200">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 bg-clip-text text-transparent">
                    Opuluxe
                  </span>
                  <span className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-200">
                    Maison
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Haute Living & Luxury Online Shopping
                </p>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div 
              className={`relative flex items-center transition-all duration-200 rounded-xl bg-slate-100/90 border ${
                isSearchFocused ? 'border-emerald-500 bg-white ring-2 ring-emerald-500/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400 ml-3.5 shrink-0" />
              <input
                id="search-input-desktop"
                type="text"
                placeholder="Search products, brands, groceries, electronics..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full py-2.5 pl-3 pr-9 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency toggle for mobile */}
            <button
              id="currency-toggle-mobile"
              onClick={onCurrencyToggle}
              className="sm:hidden px-2 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
              title="Change Currency"
            >
              {currency === 'BDT' ? '৳ BDT' : '$ USD'}
            </button>

            {/* User Add Product Button - KEY FEATURE */}
            <button
              id="btn-add-product-navbar"
              onClick={onOpenAddProduct}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-semibold shadow-sm shadow-emerald-600/25 transition-all duration-150 hover:shadow-md cursor-pointer shrink-0"
              title="Add a new product to store"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Product</span>
              <span className="sm:hidden text-xs">Add</span>
            </button>

            {/* Wishlist Button */}
            <button
              id="btn-wishlist-navbar"
              onClick={onOpenWishlist}
              className="relative p-2.5 rounded-xl text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/80 transition-colors cursor-pointer"
              title="Saved items"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Reports & Analytics Button */}
            <button
              id="btn-reports-navbar"
              onClick={() => onOpenReports('customer')}
              className="flex items-center gap-1.5 p-2.5 sm:px-3 sm:py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300/80 font-semibold text-xs transition-colors cursor-pointer"
              title="Track Orders, Invoices & Store Reports"
            >
              <BarChart3 className="w-4 h-4 text-amber-700" />
              <span className="hidden md:inline">Track & Reports</span>
            </button>

            {/* Cart Drawer Trigger Button */}
            <button
              id="btn-open-cart-navbar"
              onClick={onOpenCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm cursor-pointer"
              title="View Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-emerald-400" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-900 text-[11px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">My Cart</span>
                <span className="text-xs font-bold text-white leading-tight">
                  {formatPrice(cartTotal, currency)}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Only shown on small screens) */}
        <div className="pb-2.5 md:hidden space-y-2">
          {/* Mobile Domain Indicator */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 px-0.5">
            <button 
              id="mobile-domain-badge"
              onClick={onOpenDomainModal}
              className="flex items-center gap-1 font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs cursor-pointer active:scale-95 transition-transform"
            >
              <Globe className="w-3 h-3 text-amber-600" />
              <span>www.opuluxe.com</span>
            </button>
            <button
              id="mobile-reports-btn-top"
              onClick={onOpenReports}
              className="flex items-center gap-1 font-bold text-amber-900 bg-amber-100/80 hover:bg-amber-200 px-2.5 py-0.5 rounded-lg border border-amber-300 shadow-2xs cursor-pointer active:scale-95 transition-transform text-[11px]"
            >
              <BarChart3 className="w-3 h-3 text-amber-700" />
              <span>Reports</span>
            </button>
          </div>

          <div className="relative flex items-center rounded-xl bg-slate-100 border border-slate-200">
            <Search className="w-4 h-4 text-slate-400 ml-3 shrink-0" />
            <input
              id="search-input-mobile"
              type="text"
              placeholder="Search luxury products in Opuluxe..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full py-2 pl-2.5 pr-8 text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 text-slate-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
