import React from 'react';
import { 
  LayoutGrid, 
  Smartphone, 
  Shirt, 
  Apple, 
  Watch, 
  Home, 
  Sparkles 
} from 'lucide-react';
import { CATEGORIES } from '../data/mockProducts';
import { Product } from '../types';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  products: Product[];
}

export const CategoryBar: React.FC<CategoryBarProps> = ({
  selectedCategory,
  onSelectCategory,
  products,
}) => {
  const getIcon = (iconName: string) => {
    const props = { className: "w-4 h-4 shrink-0" };
    switch (iconName) {
      case 'Smartphone': return <Smartphone {...props} />;
      case 'Shirt': return <Shirt {...props} />;
      case 'Apple': return <Apple {...props} />;
      case 'Watch': return <Watch {...props} />;
      case 'Home': return <Home {...props} />;
      case 'Sparkles': return <Sparkles {...props} />;
      case 'LayoutGrid':
      default:
        return <LayoutGrid {...props} />;
    }
  };

  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return products.length;
    return products.filter((p) => p.category === categoryId).length;
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/70 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = getCategoryCount(cat.id);

            return (
              <button
                key={cat.id}
                id={`cat-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                    : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {getIcon(cat.icon)}
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-emerald-700/80 text-emerald-100'
                      : 'bg-slate-200/80 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
