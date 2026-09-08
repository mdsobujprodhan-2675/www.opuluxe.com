import React from 'react';
import { 
  Home, 
  LayoutGrid, 
  Plus, 
  Heart, 
  ShoppingBag 
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface MobileBottomNavProps {
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  currency: Currency;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAddProduct: () => void;
  onNavigateHome: () => void;
  onOpenCategories: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  cartCount,
  cartTotal,
  wishlistCount,
  currency,
  onOpenCart,
  onOpenWishlist,
  onOpenAddProduct,
  onNavigateHome,
  onOpenCategories,
}) => {
  return (
    <div 
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl px-2 py-1.5 pb-safe"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home / Shop */}
        <button
          id="mobile-nav-home"
          onClick={onNavigateHome}
          className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-amber-700 transition-colors cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Shop</span>
        </button>

        {/* Categories */}
        <button
          id="mobile-nav-categories"
          onClick={onOpenCategories}
          className="flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-amber-700 transition-colors cursor-pointer"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-semibold mt-0.5">Categories</span>
        </button>

        {/* Highlighted Add Product (+) Button */}
        <button
          id="mobile-nav-add-product"
          onClick={onOpenAddProduct}
          className="flex flex-col items-center justify-center -mt-5 cursor-pointer group"
          title="Add New Product"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 via-amber-600 to-slate-900 flex items-center justify-center text-white shadow-lg shadow-amber-600/30 group-active:scale-95 transition-transform border-4 border-white">
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-amber-800 mt-0.5">Add Item</span>
        </button>

        {/* Wishlist */}
        <button
          id="mobile-nav-wishlist"
          onClick={onOpenWishlist}
          className="relative flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
        >
          <Heart className="w-5 h-5" />
          {wishlistCount > 0 && (
            <span className="absolute 0 top-0.5 right-2 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
              {wishlistCount}
            </span>
          )}
          <span className="text-[10px] font-semibold mt-0.5">Saved</span>
        </button>

        {/* Bag / Cart */}
        <button
          id="mobile-nav-cart"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center p-1.5 text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">
            {cartCount > 0 ? formatPrice(cartTotal, currency) : 'Cart'}
          </span>
        </button>
      </div>
    </div>
  );
};
