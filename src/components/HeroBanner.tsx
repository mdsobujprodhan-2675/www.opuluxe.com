import React, { useState } from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Tag, 
  Copy, 
  Check, 
  ArrowRight,
  PlusCircle
} from 'lucide-react';
import { Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface HeroBannerProps {
  onOpenAddProduct: () => void;
  currency: Currency;
  onExploreClick: () => void;
  productsCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenAddProduct,
  currency,
  onExploreClick,
  productsCount,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText('OPULUXE20');
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
      {/* Main Promo Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 text-white shadow-xl border border-amber-900/30">
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
          {/* Left Text Content */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Opuluxe Haute Flagship • {productsCount} Curated Pieces</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Haute Living & <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                Luxury Lifestyle, Delivered.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Experience the pinnacle of luxury goods, prestigious watches, bespoke fashion, and premium electronics. Curate and add bespoke products, or acquire rare items with complimentary concierge delivery!
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-explore-btn"
                onClick={onExploreClick}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:gap-3 cursor-pointer"
              >
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-add-product-btn"
                onClick={onOpenAddProduct}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 hover:border-slate-600 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>Add Product</span>
              </button>
            </div>
          </div>

          {/* Right Promo Voucher Box */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-amber-500/20 p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Opuluxe Exclusive Privilege</h3>
                    <p className="text-xs text-slate-400">Privilege 20% Off Entire Collection</p>
                  </div>
                </div>
                <span className="text-amber-400 text-xs font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">
                  VIP Privilege
                </span>
              </div>

              {/* Coupon Code Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-dashed border-amber-500/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Code:</span>
                  <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                    OPULUXE20
                  </span>
                </div>
                <button
                  id="copy-coupon-btn"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/30 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-semibold border border-amber-500/30 transition-all cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-[12px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                <span>Free delivery threshold:</span>
                <span className="font-bold text-emerald-400">{formatPrice(500, currency)}+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Badges Bar */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 px-6 py-3.5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Express Delivery</p>
              <p className="text-[11px] text-slate-400">Doorstep within 24h</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">100% Genuine</p>
              <p className="text-[11px] text-slate-400">Verified authentic items</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">7 Days Easy Return</p>
              <p className="text-[11px] text-slate-400">Hassle-free guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-white">Cash on Delivery</p>
              <p className="text-[11px] text-slate-400">Pay when you receive</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
