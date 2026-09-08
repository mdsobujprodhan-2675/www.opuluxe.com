import React, { useState, useEffect, useMemo } from 'react';
import { 
  Product, 
  CartItem, 
  Currency, 
  SortOption, 
  Order,
  CustomerReportIssue 
} from './types';
import { INITIAL_PRODUCTS } from './data/mockProducts';
import { INITIAL_ORDERS, INITIAL_REPORT_ISSUES } from './data/mockReports';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CategoryBar } from './components/CategoryBar';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
import { AddProductModal } from './components/AddProductModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { WishlistModal } from './components/WishlistModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DomainModal } from './components/DomainModal';
import { ReportsModal } from './components/ReportsModal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Footer } from './components/Footer';
import { 
  PlusCircle, 
  ShoppingBag, 
  RotateCcw, 
  SearchX, 
  Sparkles,
  Layers,
  Heart,
  BarChart3
} from 'lucide-react';

export default function App() {
  // --- Persistent State ---
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_products') || localStorage.getItem('cartup_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading products from localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_cart') || localStorage.getItem('cartup_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_wishlist') || localStorage.getItem('cartup_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading wishlist from localStorage', e);
    }
    return [];
  });

  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_currency') || localStorage.getItem('cartup_currency');
      if (saved === 'USD' || saved === 'BDT') return saved;
    } catch (e) {}
    return 'BDT';
  });

  // --- Orders & Reports State ---
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading orders from localStorage', e);
    }
    return INITIAL_ORDERS;
  });

  const [reportIssues, setReportIssues] = useState<CustomerReportIssue[]>(() => {
    try {
      const saved = localStorage.getItem('opuluxe_report_issues');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading report issues', e);
    }
    return INITIAL_REPORT_ISSUES;
  });

  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [reportsPortalMode, setReportsPortalMode] = useState<'customer' | 'admin'>('customer');

  const handleOpenReports = (mode: 'customer' | 'admin' = 'customer') => {
    setReportsPortalMode(mode);
    setIsReportsOpen(true);
  };

  // --- Filtering & Sorting State ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOption, setSortOption] = useState<SortOption>('featured');
  const [priceFilter, setPriceFilter] = useState<'all' | 'under-1000' | '1000-5000' | 'above-5000'>('all');

  // --- Modal & Drawer Visibility ---
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState(false);

  // --- Toast Notifications ---
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Sync with localStorage ---
  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_products', JSON.stringify(products));
    } catch (e) {
      console.error('Error saving products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_currency', currency);
    } catch (e) {}
  }, [currency]);

  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_orders', JSON.stringify(orders));
    } catch (e) {
      console.error('Error saving orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('opuluxe_report_issues', JSON.stringify(reportIssues));
    } catch (e) {
      console.error('Error saving report issues', e);
    }
  }, [reportIssues]);

  // --- Cart Calculations ---
  const totalCartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (appliedCoupon === 'OPULUXE20' || appliedCoupon === 'CARTUP20') {
      return Math.round(cartSubtotal * 0.2);
    }
    return 0;
  }, [cartSubtotal, appliedCoupon]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal >= 500 || cartSubtotal === 0) return 0;
    return 60;
  }, [cartSubtotal]);

  const finalTotalAmount = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount + deliveryFee);
  }, [cartSubtotal, discountAmount, deliveryFee]);

  // --- Cart Handlers ---
  const handleAddToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId: product.id, product, quantity }];
    });
    addToast(`Added "${product.title}" to cart!`, 'success');
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    const item = cart.find((i) => i.productId === productId);
    setCart((prev) => prev.filter((i) => i.productId !== productId));
    if (item) {
      addToast(`Removed "${item.product.title}" from cart`, 'info');
    }
  };

  const handleClearCart = () => {
    setCart([]);
    addToast('Shopping cart cleared', 'info');
  };

  const handleApplyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'OPULUXE20' || clean === 'CARTUP20') {
      setAppliedCoupon('OPULUXE20');
      addToast('Privilege code OPULUXE20 applied! 20% discount granted.', 'success');
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    addToast('Coupon removed', 'info');
  };

  // --- Wishlist Handlers ---
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        addToast('Added to wishlist!', 'success');
        return [...prev, productId];
      }
    });
  };

  // --- Product Management (Add, Edit, Delete) - Core User Request ---
  const handleSaveProduct = (
    productData: Omit<Product, 'id' | 'createdAt' | 'reviewsCount' | 'rating'>,
    existingId?: string
  ) => {
    if (existingId) {
      // Edit existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === existingId
            ? {
                ...p,
                ...productData,
              }
            : p
        )
      );

      // Also update in cart if present
      setCart((prev) =>
        prev.map((item) =>
          item.productId === existingId
            ? { ...item, product: { ...item.product, ...productData } }
            : item
        )
      );

      addToast(`Product "${productData.title}" updated successfully!`, 'success');
    } else {
      // Add new product to store
      const newProduct: Product = {
        id: `prod-user-${Date.now()}`,
        ...productData,
        rating: 5.0,
        reviewsCount: 1,
        createdAt: Date.now(),
        isUserAdded: true,
      };

      setProducts((prev) => [newProduct, ...prev]);
      addToast(`New product "${productData.title}" added to Opuluxe!`, 'success');
    }
    setEditingProduct(null);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsAddProductOpen(true);
  };

  const handleOpenDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (productId: string) => {
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    // Also remove from cart
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    // Also remove from wishlist
    setWishlist((prev) => prev.filter((id) => id !== productId));

    if (target) {
      addToast(`"${target.title}" was deleted from store catalog.`, 'info');
    }
    setProductToDelete(null);
  };

  const handleResetCatalog = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem('opuluxe_products');
    localStorage.removeItem('cartup_products');
    addToast('Store catalog reset to default items', 'info');
  };

  // --- Filtering & Sorting Products ---
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesCategory && !matchesTags) {
          return false;
        }
      }

      // Price filter
      if (priceFilter === 'under-1000') {
        if (product.price >= 1000) return false;
      } else if (priceFilter === '1000-5000') {
        if (product.price < 1000 || product.price > 5000) return false;
      } else if (priceFilter === 'above-5000') {
        if (product.price <= 5000) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortOption === 'price-low') return a.price - b.price;
      if (sortOption === 'price-high') return b.price - a.price;
      if (sortOption === 'rating') return b.rating - a.rating;
      if (sortOption === 'newest') return b.createdAt - a.createdAt;
      return 0; // featured default
    });
  }, [products, selectedCategory, searchQuery, priceFilter, sortOption]);

  const handleOrderPlaced = (order: Order) => {
    // Record in orders list for Reports & Analytics
    setOrders((prev) => [order, ...prev]);

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const item = order.items.find((i) => i.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    // Clear cart upon successful order
    setCart([]);
    setAppliedCoupon(null);
    addToast(`Order ${order.id} confirmed and recorded in Store Reports!`, 'success');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    addToast(`Order ${orderId} marked as ${newStatus}`, 'info');
  };

  const handleAddReportIssue = (issueData: Omit<CustomerReportIssue, 'id' | 'createdAt' | 'status'>) => {
    const newIssue: CustomerReportIssue = {
      ...issueData,
      id: `RPT-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Open',
      createdAt: Date.now(),
    };
    setReportIssues((prev) => [newIssue, ...prev]);
    addToast(`Support ticket ${newIssue.id} logged in Customer Reports!`, 'success');
  };

  const handleUpdateIssueStatus = (issueId: string, newStatus: CustomerReportIssue['status']) => {
    setReportIssues((prev) =>
      prev.map((i) => (i.id === issueId ? { ...i, status: newStatus } : i))
    );
    addToast(`Ticket ${issueId} updated to ${newStatus}`, 'info');
  };

  const handleUpdateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, newStock) } : p))
    );
    addToast('Inventory stock replenished!', 'success');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceFilter('all');
    setSortOption('featured');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        currency={currency}
        onCurrencyToggle={() => setCurrency((c) => (c === 'BDT' ? 'USD' : 'BDT'))}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        totalProductsCount={products.length}
        onOpenDomainModal={() => setIsDomainModalOpen(true)}
        onOpenReports={handleOpenReports}
      />

      {/* Category Pills Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        products={products}
      />

      {/* Hero Banner with Opuluxe Exclusive Offers */}
      <HeroBanner
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        currency={currency}
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        productsCount={products.length}
      />

      {/* Main Content Area */}
      <main id="catalog-section" className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 pb-24 md:pb-12 space-y-6">
        {/* Section Header & Add/Reset Shortcuts */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {selectedCategory === 'all' ? 'All Products' : `Category: ${selectedCategory.toUpperCase()}`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                {filteredProducts.length} Items
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse top luxury deals, manage your items, or curate and add new products to Opuluxe
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Store Reports & Analytics Button */}
            <button
              id="main-btn-store-reports"
              onClick={() => handleOpenReports('admin')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-950 border border-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
              title="View Store Sales, Inventory, & Customer Reports"
            >
              <BarChart3 className="w-4 h-4 text-amber-700" />
              <span>Store Reports</span>
            </button>

            {/* Catalog management buttons */}
            <button
              id="main-btn-add-product"
              onClick={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs sm:text-sm font-bold shadow-sm shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Product</span>
            </button>

            {products.length < INITIAL_PRODUCTS.length && (
              <button
                id="btn-restore-catalog"
                onClick={handleResetCatalog}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                title="Restore original products"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Reset Defaults</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar
          sortOption={sortOption}
          onSortChange={setSortOption}
          priceFilter={priceFilter}
          onPriceFilterChange={setPriceFilter}
          filteredCount={filteredProducts.length}
          totalCount={products.length}
          onResetFilters={handleResetFilters}
          currency={currency}
        />

        {/* Products Grid - Optimized for Mobile (2-col) & Desktop (4-col) */}
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <SearchX className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No products found</h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1">
                We couldn't find any products matching your search or filters. You can add a new product or reset filters.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Clear Search & Filters
              </button>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsAddProductOpen(true);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add This Product</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cart.find((item) => item.productId === product.id);
              const isInWishlist = wishlist.includes(product.id);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isInWishlist={isInWishlist}
                  onToggleWishlist={handleToggleWishlist}
                  cartQuantity={cartItem ? cartItem.quantity : 0}
                  onAddToCart={handleAddToCart}
                  onUpdateCartQuantity={handleUpdateCartQuantity}
                  onQuickView={(prod) => setQuickViewProduct(prod)}
                  onEditProduct={handleOpenEditProduct}
                  onDeleteProduct={handleOpenDeleteProduct}
                />
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onOpenReports={handleOpenReports} />

      {/* --- MODALS & DRAWERS --- */}

      {/* Add / Edit Product Modal (Key Requirement: Add product) */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => {
          setIsAddProductOpen(false);
          setEditingProduct(null);
        }}
        onSaveProduct={handleSaveProduct}
        editingProduct={editingProduct}
        currency={currency}
      />

      {/* Delete Product Modal (Key Requirement: Delete product) */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
        currency={currency}
      />

      {/* Cart Drawer (Opuluxe luxury bag & cart management) */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        subtotal={cartSubtotal}
        discountAmount={discountAmount}
        deliveryFee={deliveryFee}
        totalAmount={finalTotalAmount}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Product Details / Quick View Modal */}
      <ProductDetailsModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        currency={currency}
        isInWishlist={quickViewProduct ? wishlist.includes(quickViewProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onEditProduct={handleOpenEditProduct}
        onDeleteProduct={handleOpenDeleteProduct}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProductIds={wishlist}
        products={products}
        currency={currency}
        onAddToCart={handleAddToCart}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      {/* Domain Info & Share Modal */}
      <DomainModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />

      {/* Advanced Reports & Analytics Dashboard Modal */}
      <ReportsModal
        isOpen={isReportsOpen}
        onClose={() => setIsReportsOpen(false)}
        orders={orders}
        products={products}
        reportIssues={reportIssues}
        currency={currency}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onUpdateIssueStatus={handleUpdateIssueStatus}
        onAddReportIssue={handleAddReportIssue}
        onUpdateProductStock={handleUpdateProductStock}
        initialMode={reportsPortalMode}
      />

      {/* Mobile Sticky Bottom Navigation (Phone / Mobile screens only) */}
      <MobileBottomNav
        cartCount={totalCartCount}
        cartTotal={cartSubtotal}
        wishlistCount={wishlist.length}
        currency={currency}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAddProduct={() => {
          setEditingProduct(null);
          setIsAddProductOpen(true);
        }}
        onNavigateHome={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCategories={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
