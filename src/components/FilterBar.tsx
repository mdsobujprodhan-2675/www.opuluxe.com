import React from 'react';
import { SlidersHorizontal, ArrowUpDown, RotateCcw } from 'lucide-react';
import { SortOption, Currency } from '../types';
import { formatPrice } from '../utils/currency';

interface FilterBarProps {
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  priceFilter: 'all' | 'under-1000' | '1000-5000' | 'above-5000';
  onPriceFilterChange: (filter: 'all' | 'under-1000' | '1000-5000' | 'above-5000') => void;
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
  currency: Currency;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  sortOption,
  onSortChange,
  priceFilter,
  onPriceFilterChange,
  filteredCount,
  totalCount,
  onResetFilters,
  currency,
}) => {
  const isFiltered = priceFilter !== 'all';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-b border-slate-200/70">
      {/* Product count */}
      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
        <span className="font-semibold text-slate-900">
          Showing {filteredCount} {filteredCount === 1 ? 'product' : 'products'}
        </span>
        {filteredCount < totalCount && (
          <span className="text-slate-400 text-xs">
            (filtered from {totalCount} total)
          </span>
        )}
        {isFiltered && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-semibold ml-2 underline underline-offset-2 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Controls: Price range & Sort */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Price Range Pills */}
        <div className="flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl text-xs">
          <button
            onClick={() => onPriceFilterChange('all')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              priceFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Prices
          </button>
          <button
            onClick={() => onPriceFilterChange('under-1000')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              priceFilter === 'under-1000'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            &lt; {formatPrice(1000, currency)}
          </button>
          <button
            onClick={() => onPriceFilterChange('1000-5000')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              priceFilter === '1000-5000'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {formatPrice(1000, currency)} - {formatPrice(5000, currency)}
          </button>
          <button
            onClick={() => onPriceFilterChange('above-5000')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
              priceFilter === 'above-5000'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            &gt; {formatPrice(5000, currency)}
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 text-xs text-slate-700 shadow-xs">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-semibold text-slate-500 hidden sm:inline">Sort:</span>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="featured">Featured / Best Match</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="newest">Newest Added</option>
          </select>
        </div>
      </div>
    </div>
  );
};
