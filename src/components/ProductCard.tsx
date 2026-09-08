import React from 'react';
import { 
  Star, 
  ShoppingBag, 
  Trash2, 
  Edit3, 
  Eye, 
  Heart, 
  Plus, 
  Minus,
  Check
} from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice, calculateDiscount } from '../utils/currency';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isInWishlist: boolean;
  onToggleWishlist: (productId: string) => void;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onQuickView: (product: Product) => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isInWishlist,
  onToggleWishlist,
  cartQuantity,
  onAddToCart,
  onUpdateCartQuantity,
  onQuickView,
  onEditProduct,
  onDeleteProduct,
}) => {
  const discountPercent = calculateDiscount(product.price, product.originalPrice);

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // fallback image if broken url
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs">
              {product.badge}
            </span>
          )}
          {discountPercent && !product.badge && (
            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider bg-rose-600 text-white shadow-xs">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isUserAdded && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
              User Added
            </span>
          )}
        </div>

        {/* Top Right Quick Actions */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist button */}
          <button
            id={`btn-wishlist-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md shadow-xs transition-colors ${
              isInWishlist
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'bg-white/90 text-slate-600 hover:text-rose-500 hover:bg-white'
            }`}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            id={`btn-quickview-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-xl bg-white/90 text-slate-600 hover:text-emerald-600 hover:bg-white shadow-xs backdrop-blur-md transition-colors"
            title="Quick view product details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Edit Product */}
          <button
            id={`btn-edit-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onEditProduct(product);
            }}
            className="p-2 rounded-xl bg-white/90 text-slate-600 hover:text-blue-600 hover:bg-white shadow-xs backdrop-blur-md transition-colors"
            title="Edit product"
          >
            <Edit3 className="w-4 h-4" />
          </button>

          {/* Delete Product - Key Requested Feature */}
          <button
            id={`btn-delete-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onDeleteProduct(product);
            }}
            className="p-2 rounded-xl bg-white/90 text-slate-500 hover:text-rose-600 hover:bg-rose-50 shadow-xs backdrop-blur-md transition-colors"
            title="Delete this product from store"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Stock warning pill if low stock */}
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-2 left-2.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
            Only {product.stock} left in stock!
          </div>
        )}
      </div>

      {/* Details Area */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4 justify-between space-y-2 sm:space-y-3">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] truncate max-w-[80px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-slate-700 font-bold text-[11px] sm:text-xs">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400 text-[10px] sm:text-[11px] font-normal hidden xs:inline">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 hover:text-emerald-700 transition-colors cursor-pointer leading-snug"
            title={product.title}
          >
            {product.title}
          </h3>

          {/* Description preview */}
          <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 mt-0.5 sm:mt-1 hidden sm:block">
            {product.description}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1.5">
              <span className="text-xs sm:text-base md:text-lg font-extrabold text-slate-900">
                {formatPrice(product.price, currency)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                  {formatPrice(product.originalPrice, currency)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart / Qty Stepper */}
          {cartQuantity > 0 ? (
            <div className="flex items-center rounded-lg sm:rounded-xl bg-emerald-50 border border-emerald-300 p-0.5 sm:p-1 text-emerald-800">
              <button
                id={`btn-cart-minus-${product.id}`}
                onClick={() => onUpdateCartQuantity(product.id, cartQuantity - 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-white hover:bg-emerald-100 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title="Decrease quantity"
              >
                <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
              <span className="px-1.5 sm:px-2.5 font-bold text-[11px] sm:text-xs">{cartQuantity}</span>
              <button
                id={`btn-cart-plus-${product.id}`}
                onClick={() => onUpdateCartQuantity(product.id, cartQuantity + 1)}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-md sm:rounded-lg bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white transition-colors cursor-pointer"
                title="Increase quantity"
              >
                <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          ) : (
            <button
              id={`btn-add-cart-${product.id}`}
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-emerald-600 active:bg-emerald-700 text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer shrink-0"
              title="Add to shopping cart"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Add</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
