import React, { useState, useEffect } from 'react';
import { X, Image as ImageIcon, Sparkles, Check, Plus, AlertCircle } from 'lucide-react';
import { Product, Currency } from '../types';
import { CATEGORIES, PRESET_IMAGES } from '../data/mockProducts';
import { formatPrice } from '../utils/currency';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'reviewsCount' | 'rating'>, existingId?: string) => void;
  editingProduct?: Product | null;
  currency: Currency;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSaveProduct,
  editingProduct,
  currency,
}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('electronics');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState('20');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingProduct) {
      setTitle(editingProduct.title);
      setPrice(editingProduct.price.toString());
      setOriginalPrice(editingProduct.originalPrice ? editingProduct.originalPrice.toString() : '');
      setCategory(editingProduct.category);
      setImage(editingProduct.image);
      setStock(editingProduct.stock.toString());
      setDescription(editingProduct.description);
      setBadge(editingProduct.badge || '');
    } else {
      // Default initial state
      setTitle('');
      setPrice('');
      setOriginalPrice('');
      setCategory('electronics');
      setImage(PRESET_IMAGES[0].url);
      setStock('15');
      setDescription('');
      setBadge('');
    }
    setErrors({});
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Product title is required';
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      errs.price = 'Please enter a valid price greater than 0';
    }
    if (originalPrice && (isNaN(Number(originalPrice)) || Number(originalPrice) < Number(price))) {
      errs.originalPrice = 'Original price must be equal or higher than regular price';
    }
    if (!image.trim()) errs.image = 'Product image is required';
    if (!description.trim()) errs.description = 'Description is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSaveProduct(
      {
        title: title.trim(),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        image: image.trim(),
        stock: Number(stock) || 10,
        description: description.trim(),
        badge: badge.trim() || undefined,
        isUserAdded: true,
      },
      editingProduct ? editingProduct.id : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingProduct ? 'Edit Product' : 'Add New Product to Opuluxe'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {editingProduct
                ? 'Update product specifications, price, or inventory'
                : 'Publish a new item to the shopping catalog instantly'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Product Title *
            </label>
            <input
              id="input-product-title"
              type="text"
              placeholder="e.g., Wireless Gaming Headset with Microphone"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                errors.title ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10'
              }`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{errors.title}</p>}
          </div>

          {/* Pricing & Stock Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Selling Price (৳ BDT) *
              </label>
              <input
                id="input-product-price"
                type="number"
                min="1"
                placeholder="1200"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                  errors.price ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10'
                }`}
              />
              {errors.price && <p className="text-xs text-rose-500 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Original Price (Optional)
              </label>
              <input
                id="input-product-original-price"
                type="number"
                min="1"
                placeholder="1500"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
              {errors.originalPrice && <p className="text-xs text-rose-500 mt-1">{errors.originalPrice}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Stock Inventory
              </label>
              <input
                id="input-product-stock"
                type="number"
                min="0"
                placeholder="25"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Category and Promotional Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                id="select-product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm text-slate-800 bg-white focus:outline-none"
              >
                {CATEGORIES.filter(c => c.id !== 'all').map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.nameBn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Badge / Tag (Optional)
              </label>
              <select
                id="select-product-badge"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 text-sm text-slate-800 bg-white focus:outline-none"
              >
                <option value="">No Badge</option>
                <option value="Best Seller">Best Seller</option>
                <option value="Hot Deal">Hot Deal</option>
                <option value="Super Sale">Super Sale</option>
                <option value="New Arrival">New Arrival</option>
                <option value="Organic">Organic</option>
                <option value="Trending">Trending</option>
              </select>
            </div>
          </div>

          {/* Image URL & Preset Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Product Image URL *
              </label>
              <span className="text-xs text-emerald-600 font-medium">Or pick a sample below</span>
            </div>
            <div className="flex gap-2">
              <input
                id="input-product-image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                  errors.image ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10'
                }`}
              />
            </div>
            {errors.image && <p className="text-xs text-rose-500 mt-1">{errors.image}</p>}

            {/* Quick Preset Selector */}
            <div className="mt-2.5">
              <p className="text-[11px] text-slate-500 font-semibold mb-1.5">Quick Presets (1-Click Select):</p>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setImage(preset.url);
                      setCategory(preset.category);
                      if (!title) setTitle(preset.label);
                    }}
                    className={`shrink-0 flex items-center gap-1.5 p-1 rounded-lg border text-xs transition-all ${
                      image === preset.url
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.label}
                      className="w-6 h-6 rounded object-cover"
                    />
                    <span className="truncate max-w-[100px]">{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description *
            </label>
            <textarea
              id="input-product-description"
              rows={3}
              placeholder="Describe the product features, specifications, and warranty details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all ${
                errors.description ? 'border-rose-500 ring-2 ring-rose-500/10' : 'border-slate-300 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10'
              }`}
            />
            {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
          </div>

          {/* Live Preview Card */}
          {title && image && price && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Live Store Preview:</span>
              <div className="flex items-center gap-3">
                <img
                  src={image}
                  alt={title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-slate-900 text-sm truncate">{title}</h4>
                  <p className="text-xs text-slate-500 capitalize">{category} • Stock: {stock}</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-sm font-bold text-emerald-700">
                      {formatPrice(Number(price), currency)}
                    </span>
                    {originalPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {formatPrice(Number(originalPrice), currency)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="submit-product-form"
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm font-bold shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{editingProduct ? 'Update Product' : 'Add to Catalog'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
