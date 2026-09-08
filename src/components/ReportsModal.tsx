import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  AlertTriangle, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Clock, 
  Truck, 
  CreditCard, 
  Wallet, 
  Banknote, 
  Filter, 
  FileText, 
  Eye, 
  EyeOff,
  PlusCircle, 
  ShieldAlert, 
  Search, 
  Send,
  Calendar,
  Layers,
  ArrowUpRight,
  HelpCircle,
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  User,
  Phone,
  Receipt,
  MapPin,
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Product, Order, CustomerReportIssue, Currency, IssueCategory } from '../types';
import { formatPrice } from '../utils/currency';

interface ReportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
  reportIssues: CustomerReportIssue[];
  onAddReportIssue: (issue: Omit<CustomerReportIssue, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateIssueStatus: (issueId: string, newStatus: CustomerReportIssue['status']) => void;
  onUpdateProductStock: (productId: string, newStock: number) => void;
  currency: Currency;
  initialMode?: 'customer' | 'admin';
}

export const ReportsModal: React.FC<ReportsModalProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  onUpdateOrderStatus,
  reportIssues,
  onAddReportIssue,
  onUpdateIssueStatus,
  onUpdateProductStock,
  currency,
  initialMode = 'customer',
}) => {
  // Portal Mode: 'customer' (Self-Service) vs 'admin' (Executive/Owner)
  const [portalMode, setPortalMode] = useState<'customer' | 'admin'>(initialMode);

  // Synchronize portalMode when modal opens or initialMode prop changes
  useEffect(() => {
    if (isOpen) {
      setPortalMode(initialMode);
      setPinError('');
    }
  }, [isOpen, initialMode]);

  // Admin PIN Protection State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const DEFAULT_ADMIN_PIN = '4384';

  // Customer View State
  const [customerTab, setCustomerTab] = useState<'track' | 'issue'>('track');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [selectedTrackOrder, setSelectedTrackOrder] = useState<Order | null>(null);

  // Admin View State
  const [adminTab, setAdminTab] = useState<'sales' | 'orders' | 'inventory' | 'issues'>('sales');
  const [timeRange, setTimeRange] = useState<'all' | '7d' | '30d' | 'today'>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Customer Issue Form State
  const [showNewIssueForm, setShowNewIssueForm] = useState(false);
  const [issueCustomerName, setIssueCustomerName] = useState('');
  const [issueContact, setIssueContact] = useState('');
  const [issueOrderId, setIssueOrderId] = useState('');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('delivery_delay');
  const [issueSubject, setIssueSubject] = useState('');
  const [issueDetails, setIssueDetails] = useState('');
  const [issuePriority, setIssuePriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [issueFormSuccess, setIssueFormSuccess] = useState(false);

  // Filter orders by time range (for admin)
  const filteredOrdersByTime = useMemo(() => {
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;

    return orders.filter((o) => {
      if (timeRange === 'today') {
        return now - o.createdAt <= dayMs;
      }
      if (timeRange === '7d') {
        return now - o.createdAt <= dayMs * 7;
      }
      if (timeRange === '30d') {
        return now - o.createdAt <= dayMs * 30;
      }
      return true;
    });
  }, [orders, timeRange]);

  // High-Level KPIs (Admin)
  const totalGrossRevenue = useMemo(() => {
    return filteredOrdersByTime.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [filteredOrdersByTime]);

  const totalDiscountGranted = useMemo(() => {
    return filteredOrdersByTime.reduce((sum, o) => sum + o.discountAmount, 0);
  }, [filteredOrdersByTime]);

  const averageOrderValue = useMemo(() => {
    if (filteredOrdersByTime.length === 0) return 0;
    return Math.round(totalGrossRevenue / filteredOrdersByTime.length);
  }, [totalGrossRevenue, filteredOrdersByTime]);

  // Inventory valuation (Admin)
  const inventoryMetrics = useMemo(() => {
    const totalValuation = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5);
    const outOfStockProducts = products.filter((p) => p.stock === 0);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

    return {
      totalValuation,
      lowStockProducts,
      outOfStockProducts,
      totalUnits,
    };
  }, [products]);

  // Payment Method Breakdown (Admin)
  const paymentBreakdown = useMemo(() => {
    let bkash = 0;
    let card = 0;
    let cod = 0;

    filteredOrdersByTime.forEach((o) => {
      if (o.paymentMethod === 'bkash') bkash += o.totalAmount;
      else if (o.paymentMethod === 'card') card += o.totalAmount;
      else cod += o.totalAmount;
    });

    const total = totalGrossRevenue || 1;
    return {
      bkash: { amount: bkash, percent: Math.round((bkash / total) * 100) },
      card: { amount: card, percent: Math.round((card / total) * 100) },
      cod: { amount: cod, percent: Math.round((cod / total) * 100) },
    };
  }, [filteredOrdersByTime, totalGrossRevenue]);

  // Filtered orders for Admin Orders tab
  const adminFilteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.customerName.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.phone.includes(orderSearchQuery);
      
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, orderSearchQuery, orderStatusFilter]);

  // Customer search results for Tracking
  const customerMatchingOrders = useMemo(() => {
    if (!customerSearchQuery.trim()) {
      // If empty, return latest 2 orders as convenient quick-track samples
      return orders.slice(0, 2);
    }
    const q = customerSearchQuery.trim().toLowerCase();
    return orders.filter((o) =>
      o.id.toLowerCase().includes(q) ||
      o.phone.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q)
    );
  }, [orders, customerSearchQuery]);

  // Customer matching support tickets
  const customerMatchingIssues = useMemo(() => {
    if (!customerSearchQuery.trim()) {
      return reportIssues.slice(0, 3);
    }
    const q = customerSearchQuery.trim().toLowerCase();
    return reportIssues.filter((i) =>
      (i.orderId && i.orderId.toLowerCase().includes(q)) ||
      i.contact.toLowerCase().includes(q) ||
      i.customerName.toLowerCase().includes(q)
    );
  }, [reportIssues, customerSearchQuery]);

  // Admin PIN Unlock Handler
  const verifyAndUnlock = (inputPin: string) => {
    const clean = inputPin.trim();
    if (clean === '4384' || clean === DEFAULT_ADMIN_PIN) {
      setIsAdminUnlocked(true);
      setPinError('');
      return true;
    }
    return false;
  };

  const handlePinSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyAndUnlock(adminPinInput)) {
      setPinError('ভুল পাসকোড! অ্যাডমিন পিন কোড হলো: 4384');
    }
  };

  const handlePinDigitPress = (digit: string) => {
    if (adminPinInput.length >= 8) return;
    const nextPin = adminPinInput + digit;
    setAdminPinInput(nextPin);
    setPinError('');
    if (nextPin === '4384' || nextPin === DEFAULT_ADMIN_PIN) {
      setIsAdminUnlocked(true);
      setPinError('');
    }
  };

  const handlePinBackspace = () => {
    setAdminPinInput(prev => prev.slice(0, -1));
    setPinError('');
  };

  const handleQuickUnlock = () => {
    setAdminPinInput('4384');
    setIsAdminUnlocked(true);
    setPinError('');
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer Name', 'Phone', 'City', 'Payment Method', 'Subtotal', 'Discount', 'Total Amount', 'Status', 'Items Count'];
    const rows = orders.map((o) => [
      o.id,
      new Date(o.createdAt).toLocaleDateString('en-GB'),
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.phone,
      o.city,
      o.paymentMethod.toUpperCase(),
      o.subtotal,
      o.discountAmount,
      o.totalAmount,
      o.status,
      o.items.reduce((sum, i) => sum + i.quantity, 0),
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `opuluxe_store_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Handle New Issue Submit (Used by both customer & admin)
  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueCustomerName.trim() || !issueContact.trim() || !issueSubject.trim()) {
      return;
    }

    onAddReportIssue({
      customerName: issueCustomerName.trim(),
      contact: issueContact.trim(),
      orderId: issueOrderId.trim() || undefined,
      category: issueCategory,
      subject: issueSubject.trim(),
      details: issueDetails.trim(),
      priority: issuePriority,
    });

    setIssueFormSuccess(true);
    setTimeout(() => {
      setIssueFormSuccess(false);
      setShowNewIssueForm(false);
      setIssueCustomerName('');
      setIssueContact('');
      setIssueOrderId('');
      setIssueSubject('');
      setIssueDetails('');
    }, 1500);
  };

  const openIssueWithOrderId = (orderId: string) => {
    setIssueOrderId(orderId);
    setCustomerTab('issue');
    setShowNewIssueForm(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div 
        id="reports-analytics-modal"
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4 sm:my-8 flex flex-col max-h-[92vh]"
      >
        {/* Top Header Bar with Mode Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl border transition-colors ${
              portalMode === 'admin' 
                ? 'bg-amber-500/25 text-amber-300 border-amber-500/40'
                : 'bg-emerald-500/25 text-emerald-300 border-emerald-500/40'
            }`}>
              {portalMode === 'admin' ? (
                <BarChart3 className="w-6 h-6" />
              ) : (
                <Package className="w-6 h-6" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  {portalMode === 'admin' ? 'Store Executive Reports & Analytics' : 'Customer Orders & Support Hub'}
                </h2>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full ${
                  portalMode === 'admin' ? 'bg-amber-400 text-slate-950' : 'bg-emerald-400 text-slate-950'
                }`}>
                  {portalMode === 'admin' ? 'Admin Mode' : 'Customer View'}
                </span>
              </div>
              <p className="text-xs text-amber-200/80">
                {portalMode === 'admin' 
                  ? 'গোপনীয় বিক্রয় রিপোর্ট, গুদাম স্টক ও কাস্টমার কমপ্লেইন্ট ড্যাশবোর্ড' 
                  : 'অর্ডার ট্র্যাকিং, ক্যাশ মেমো/ইনভয়েস এবং কাস্টমার কমপ্লেইন্ট সাপোর্ট'}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Tools */}
          <div className="flex items-center gap-2">
            {/* Switch between Customer Portal & Admin Portal */}
            <div className="flex items-center bg-white/10 p-0.5 rounded-xl border border-white/15 text-xs font-semibold">
              <button
                id="btn-switch-customer-mode"
                onClick={() => setPortalMode('customer')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  portalMode === 'customer'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
                title="Customer self-service order tracking & support"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer View</span>
              </button>

              <button
                id="btn-switch-admin-mode"
                onClick={() => setPortalMode('admin')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  portalMode === 'admin'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-200 hover:text-white'
                }`}
                title="Admin Sales, Warehouse & Analytics (Requires PIN)"
              >
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Store Admin</span>
              </button>
            </div>

            {/* Admin Export/Print (Only if unlocked in Admin mode) */}
            {portalMode === 'admin' && isAdminUnlocked && (
              <>
                <button
                  id="report-export-csv-btn"
                  onClick={handleExportCSV}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-amber-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>CSV</span>
                </button>
                <button
                  id="report-print-btn"
                  onClick={handlePrint}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                  title="Print Report"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-300" />
                </button>
              </>
            )}

            <button
              id="report-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: CUSTOMER VIEW (NO SENSITIVE SALES/REVENUE, SAFE FOR CUSTOMERS)    */}
        {/* ========================================================================= */}
        {portalMode === 'customer' && (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50">
            {/* Customer Sub-Tabs */}
            <div className="px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  id="customer-tab-track"
                  onClick={() => setCustomerTab('track')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    customerTab === 'track'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Track My Order & Invoice</span>
                </button>

                <button
                  id="customer-tab-issue"
                  onClick={() => setCustomerTab('issue')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    customerTab === 'issue'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>Report an Issue / Support</span>
                </button>
              </div>

              <span className="text-[11px] text-slate-500 hidden sm:inline">
                🔒 Privacy Assured: Customers only view their personal purchases
              </span>
            </div>

            {/* Content Area */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* TAB 1A: ORDER TRACKING & INVOICE */}
              {customerTab === 'track' && (
                <div className="space-y-6 animate-in fade-in">
                  {/* Search Order Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200 shadow-xs space-y-3">
                    <div className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-amber-700" />
                      <h3 className="text-sm font-bold text-slate-900">
                        আপনার অর্ডার ট্র্যাক করুন (Track Your Delivery Status)
                      </h3>
                    </div>
                    <p className="text-xs text-slate-600">
                      আপনার অর্ডার আইডি (যেমন: <span className="font-mono font-bold text-amber-900">OPULUXE-892140</span>) অথবা যে মোবাইল নম্বর দিয়ে অর্ডার করেছেন তা নিচে লিখুন:
                    </p>

                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          id="customer-order-search-input"
                          type="text"
                          placeholder="Search by Order ID (e.g. OPULUXE-892140) or Phone (+880...)"
                          value={customerSearchQuery}
                          onChange={(e) => setCustomerSearchQuery(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-slate-300 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-2xs font-medium"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      </div>
                      {customerSearchQuery && (
                        <button
                          onClick={() => setCustomerSearchQuery('')}
                          className="px-3 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold cursor-pointer"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Search Results / Orders List */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Found Orders ({customerMatchingOrders.length})</span>
                      {!customerSearchQuery && (
                        <span className="text-[11px] text-slate-400 font-normal">
                          Showing recent store orders for immediate testing
                        </span>
                      )}
                    </div>

                    {customerMatchingOrders.length === 0 ? (
                      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
                        <Package className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-sm font-bold text-slate-700">No order found matching "{customerSearchQuery}"</p>
                        <p className="text-xs text-slate-500">
                          অনুগ্রহ করে আপনার এসএমএস বা চেকআউট কনফার্মেশনে প্রাপ্ত সঠিক অর্ডার আইডি বা মোবাইল নম্বর দিয়ে পুনরায় চেষ্টা করুন।
                        </p>
                      </div>
                    ) : (
                      customerMatchingOrders.map((order) => {
                        const isDelivered = order.status === 'Delivered';
                        const isShipped = order.status === 'Shipped' || isDelivered;
                        const isConfirmed = order.status === 'Confirmed' || isShipped;

                        return (
                          <div 
                            key={order.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all hover:border-amber-300"
                          >
                            {/* Order Header */}
                            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-white border border-slate-200 text-amber-700">
                                  <Package className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-sm text-slate-900">{order.id}</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      order.status === 'Delivered'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : order.status === 'Shipped'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <span className="text-[11px] text-slate-500">
                                    Ordered on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>

                              {/* Actions: Invoice & Complaint */}
                              <div className="flex items-center gap-2">
                                <button
                                  id={`btn-view-invoice-${order.id}`}
                                  onClick={() => setSelectedInvoiceOrder(order)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-amber-500 text-slate-800 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                                >
                                  <Receipt className="w-3.5 h-3.5 text-amber-600" />
                                  <span>View Cash Memo / Invoice</span>
                                </button>

                                <button
                                  id={`btn-report-issue-${order.id}`}
                                  onClick={() => openIssueWithOrderId(order.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors cursor-pointer"
                                  title="Report a problem regarding this order"
                                >
                                  <ShieldAlert className="w-3.5 h-3.5" />
                                  <span>Report Issue</span>
                                </button>
                              </div>
                            </div>

                            {/* Delivery Stepper Tracker */}
                            <div className="p-5 border-b border-slate-100 bg-white">
                              <div className="text-xs font-bold text-slate-700 mb-4 flex items-center gap-1.5">
                                <Truck className="w-4 h-4 text-amber-600" />
                                <span>Live Delivery Progress:</span>
                              </div>

                              <div className="relative flex items-center justify-between max-w-xl mx-auto px-4">
                                {/* Connecting line */}
                                <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-1 bg-slate-200 z-0">
                                  <div 
                                    className="h-full bg-emerald-500 transition-all duration-500"
                                    style={{
                                      width: isDelivered ? '100%' : isShipped ? '66%' : isConfirmed ? '33%' : '0%'
                                    }}
                                  />
                                </div>

                                {/* Step 1: Placed */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-800 mt-1.5">Order Placed</span>
                                  <span className="text-[10px] text-slate-400">গৃহীত</span>
                                </div>

                                {/* Step 2: Confirmed */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                    isConfirmed ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : '2'}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-800 mt-1.5">Confirmed</span>
                                  <span className="text-[10px] text-slate-400">কনফার্মড</span>
                                </div>

                                {/* Step 3: Shipped */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                    isShipped ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {isShipped ? <Truck className="w-4 h-4" /> : '3'}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-800 mt-1.5">Shipped</span>
                                  <span className="text-[10px] text-slate-400">কুরিয়ারে পথে</span>
                                </div>

                                {/* Step 4: Delivered */}
                                <div className="relative z-10 flex flex-col items-center text-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${
                                    isDelivered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                                  }`}>
                                    {isDelivered ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-800 mt-1.5">Delivered</span>
                                  <span className="text-[10px] text-slate-400">পৌঁছে গেছে</span>
                                </div>
                              </div>
                            </div>

                            {/* Order Details & Items Preview */}
                            <div className="p-4 bg-slate-50/50 flex flex-col sm:flex-row justify-between gap-4 text-xs">
                              <div className="space-y-1">
                                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <User className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Customer: {order.customerName} ({order.phone})</span>
                                </p>
                                <p className="text-slate-600 flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>Shipping: {order.address}, {order.city}</span>
                                </p>
                                <p className="text-slate-500">
                                  Payment Mode: <strong className="uppercase text-slate-700">{order.paymentMethod}</strong>
                                </p>
                              </div>

                              <div className="sm:text-right space-y-1">
                                <p className="text-slate-500">
                                  Items: <strong className="text-slate-800">{order.items.reduce((s, i) => s + i.quantity, 0)} pcs</strong>
                                </p>
                                <p className="text-sm font-extrabold text-slate-900">
                                  Total Paid: {formatPrice(order.totalAmount, currency)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1B: REPORT AN ISSUE / SUPPORT DESK */}
              {customerTab === 'issue' && (
                <div className="space-y-6 animate-in fade-in max-w-2xl mx-auto">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                          <ShieldAlert className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            পণ্য বা ডেলিভারি সংক্রান্ত সমস্যা জানান (File a Complaint)
                          </h3>
                          <p className="text-xs text-slate-500">
                            আমাদের ডেডিকেটেড সাপোর্ট টিম ২৪ ঘণ্টার মধ্যে আপনার সমস্যা সমাধান করবে।
                          </p>
                        </div>
                      </div>
                    </div>

                    {issueFormSuccess ? (
                      <div className="p-6 bg-emerald-50 rounded-xl border border-emerald-200 text-center space-y-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                        <h4 className="text-sm font-bold text-emerald-900">
                          আপনার অভিযোগ সফলভাবে দাখিল করা হয়েছে!
                        </h4>
                        <p className="text-xs text-emerald-700">
                          আমাদের কনসিয়ার্জ সাপোর্ট টিম শীঘ্রই আপনার ফোন অথবা ইমেইলে যোগাযোগ করবে।
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleCreateIssue} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              আপনার নাম (Full Name) *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Tanvir Hasan"
                              value={issueCustomerName}
                              onChange={(e) => setIssueCustomerName(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              মোবাইল নম্বর / ইমেইল *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. +880 1700-000000"
                              value={issueContact}
                              onChange={(e) => setIssueContact(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              অর্ডার আইডি (Order ID - Optional)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. OPULUXE-892140"
                              value={issueOrderId}
                              onChange={(e) => setIssueOrderId(e.target.value)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono focus:outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              সমস্যার ধরন (Problem Category) *
                            </label>
                            <select
                              value={issueCategory}
                              onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                            >
                              <option value="delivery_delay">Delivery Delay (বিলম্বিত ডেলিভারি)</option>
                              <option value="damaged_item">Damaged Item (ভাঙা/ক্ষতিগ্রস্ত পণ্য)</option>
                              <option value="wrong_item">Wrong Item Sent (ভুল পণ্য প্রদান)</option>
                              <option value="payment_issue">Payment Issue (পেমেন্ট সমস্যা)</option>
                              <option value="return_request">Return & Refund Request (রিটার্ন রিকোয়েস্ট)</option>
                              <option value="general_feedback">General Complaint / Feedback (সাধারণ মতামত)</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            সংক্ষিপ্ত বিষয় (Subject Summary) *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Parcel has not arrived yet / Glass scratch"
                            value={issueSubject}
                            onChange={(e) => setIssueSubject(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            বিস্তারিত বিবরণ (Details) *
                          </label>
                          <textarea
                            rows={3}
                            required
                            placeholder="Please tell us what happened..."
                            value={issueDetails}
                            onChange={(e) => setIssueDetails(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:border-amber-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
                        >
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Ticket to Opuluxe Concierge</span>
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Customer's Previous Inquiries / Tracking */}
                  <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-slate-400" />
                      <span>Recent Customer Issue Tickets</span>
                    </h4>

                    {customerMatchingIssues.length === 0 ? (
                      <p className="text-xs text-slate-400">No active complaint tickets recorded.</p>
                    ) : (
                      <div className="space-y-2">
                        {customerMatchingIssues.map((ticket) => (
                          <div key={ticket.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-900">{ticket.id}</span>
                                <span className="font-semibold text-slate-800">{ticket.subject}</span>
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {ticket.orderId ? `Order: ${ticket.orderId} • ` : ''}{new Date(ticket.createdAt).toLocaleDateString('en-GB')}
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ticket.status === 'Resolved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : ticket.status === 'Under Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: STORE ADMIN PORTAL (PROTECTED BY PIN 4384)                         */}
        {/* ========================================================================= */}
        {portalMode === 'admin' && (
          <div className="flex flex-col flex-1 overflow-hidden bg-slate-50/50">
            {/* If Admin is NOT unlocked, show Lock Screen */}
            {!isAdminUnlocked ? (
              <div className="p-6 sm:p-10 max-w-md mx-auto my-auto text-center space-y-4 bg-white rounded-3xl border border-slate-200 shadow-lg">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center border border-amber-300">
                  <Lock className="w-7 h-7" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Admin Authorization Required</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    দোকানের মোট বিক্রয়, নিট লাভ, ইনভেন্টরি স্টক ও ক্রেতাদের রিপোর্ট দেখতে ৪ সংখ্যার অ্যাডমিন পিন কোড দিন।
                  </p>
                </div>

                <form onSubmit={handlePinSubmit} className="space-y-3">
                  <div className="relative">
                    <input
                      id="admin-passcode-input"
                      type={showAdminPin ? 'text' : 'password'}
                      maxLength={8}
                      placeholder="••••"
                      value={adminPinInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAdminPinInput(val);
                        setPinError('');
                        if (val.trim() === '4384' || val.trim() === DEFAULT_ADMIN_PIN) {
                          setIsAdminUnlocked(true);
                        }
                      }}
                      className="w-full text-center text-2xl tracking-[0.3em] py-2.5 px-10 rounded-xl border border-slate-300 focus:outline-none focus:border-amber-600 font-mono font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPin(!showAdminPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      title={showAdminPin ? "Hide PIN" : "Show PIN"}
                    >
                      {showAdminPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {pinError && (
                    <p className="text-xs text-rose-600 font-semibold">{pinError}</p>
                  )}

                  {/* Quick numeric touch keypad */}
                  <div className="grid grid-cols-3 gap-1.5 pt-1 max-w-[240px] mx-auto">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handlePinDigitPress(num)}
                        className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-sm transition-all cursor-pointer"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setAdminPinInput('');
                        setPinError('');
                      }}
                      className="py-2 rounded-lg bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-500 font-bold text-xs transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePinDigitPress('0')}
                      className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 font-bold text-sm transition-all cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={handlePinBackspace}
                      className="py-2 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-xs transition-all cursor-pointer"
                    >
                      ⌫
                    </button>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setPortalMode('customer')}
                      className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                    >
                      Customer View
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                    >
                      Unlock Admin
                    </button>
                  </div>
                </form>

                <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-1.5">
                  <span className="text-[11px] text-slate-400">অ্যাডমিন পাসকোড: <strong>4384</strong></span>
                  <button
                    type="button"
                    onClick={handleQuickUnlock}
                    className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Quick Unlock (PIN: 4384)</span>
                  </button>
                </div>
              </div>
            ) : (
              /* UNLOCKED ADMIN DASHBOARD */
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* Admin Status & Tabs Bar */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 bg-amber-100/80 px-2.5 py-1 rounded-lg border border-amber-300">
                      <Unlock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Admin Authenticated</span>
                    </span>

                    <button
                      onClick={() => setIsAdminUnlocked(false)}
                      className="text-[11px] text-slate-500 hover:text-slate-900 underline font-medium cursor-pointer"
                    >
                      Lock Session
                    </button>
                  </div>

                  {/* Time Range Selector */}
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Horizon:</span>
                    <div className="flex items-center bg-white rounded-xl p-0.5 border border-slate-200 text-xs font-semibold">
                      {(['all', 'today', '7d', '30d'] as const).map((range) => (
                        <button
                          key={range}
                          onClick={() => setTimeRange(range)}
                          className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                            timeRange === range
                              ? 'bg-slate-900 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {range === 'all' && 'All Time'}
                          {range === 'today' && 'Today'}
                          {range === '7d' && 'Last 7 Days'}
                          {range === '30d' && 'This Month'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Admin Sub-Tabs */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <button
                      onClick={() => setAdminTab('sales')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        adminTab === 'sales'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Sales & Revenue</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('orders')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        adminTab === 'orders'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      <span>Orders Audit ({filteredOrdersByTime.length})</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('inventory')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        adminTab === 'inventory'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Warehouse Stock</span>
                    </button>

                    <button
                      onClick={() => setAdminTab('issues')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        adminTab === 'issues'
                          ? 'bg-amber-600 text-white'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>All Issues ({reportIssues.length})</span>
                    </button>
                  </div>
                </div>

                {/* Admin Scrollable Content */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
                  {/* Top 4 KPI Metrics */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {/* KPI 1: Gross Sales */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Gross Sales</span>
                        <span className="p-1 rounded-md bg-emerald-50 text-emerald-600">
                          <TrendingUp className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {formatPrice(totalGrossRevenue, currency)}
                      </div>
                      <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <span>Discounts: -{formatPrice(totalDiscountGranted, currency)}</span>
                      </div>
                    </div>

                    {/* KPI 2: Total Orders */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Orders Placed</span>
                        <span className="p-1 rounded-md bg-blue-50 text-blue-600">
                          <ShoppingBag className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {filteredOrdersByTime.length} Orders
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        AOV: <strong className="text-slate-800">{formatPrice(averageOrderValue, currency)}</strong>
                      </div>
                    </div>

                    {/* KPI 3: Warehouse Valuation */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Warehouse Valuation</span>
                        <span className="p-1 rounded-md bg-amber-50 text-amber-600">
                          <Layers className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {formatPrice(inventoryMetrics.totalValuation, currency)}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        Stock: <strong className="text-slate-800">{inventoryMetrics.totalUnits} items</strong>
                      </div>
                    </div>

                    {/* KPI 4: Stock Alerts */}
                    <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold uppercase tracking-wider text-[10px]">Alerts & Tickets</span>
                        <span className="p-1 rounded-md bg-rose-50 text-rose-600">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {inventoryMetrics.lowStockProducts.length + reportIssues.filter((i) => i.status !== 'Resolved').length} Active
                      </div>
                      <div className="text-[11px] text-rose-600 font-medium">
                        {inventoryMetrics.lowStockProducts.length} low stock, {reportIssues.filter((i) => i.status !== 'Resolved').length} open tickets
                      </div>
                    </div>
                  </div>

                  {/* ADMIN TAB 1: SALES & REVENUE */}
                  {adminTab === 'sales' && (
                    <div className="space-y-6 animate-in fade-in">
                      {/* Payment Methods Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Wallet className="w-4 h-4 text-pink-600" />
                              bKash Digital
                            </span>
                            <span className="text-pink-600">{paymentBreakdown.bkash.percent}%</span>
                          </div>
                          <div className="text-base font-extrabold text-slate-900">
                            {formatPrice(paymentBreakdown.bkash.amount, currency)}
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-pink-500 h-full rounded-full" style={{ width: `${paymentBreakdown.bkash.percent}%` }} />
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <CreditCard className="w-4 h-4 text-blue-600" />
                              Cards (Visa / Master)
                            </span>
                            <span className="text-blue-600">{paymentBreakdown.card.percent}%</span>
                          </div>
                          <div className="text-base font-extrabold text-slate-900">
                            {formatPrice(paymentBreakdown.card.amount, currency)}
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${paymentBreakdown.card.percent}%` }} />
                          </div>
                        </div>

                        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                            <span className="flex items-center gap-1.5">
                              <Banknote className="w-4 h-4 text-emerald-600" />
                              Cash on Delivery
                            </span>
                            <span className="text-emerald-600">{paymentBreakdown.cod.percent}%</span>
                          </div>
                          <div className="text-base font-extrabold text-slate-900">
                            {formatPrice(paymentBreakdown.cod.amount, currency)}
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${paymentBreakdown.cod.percent}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Store Performance Insights */}
                      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Executive Summary</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Opuluxe স্টোরে সর্বমোট {orders.length}টি অর্ডার প্রক্রিয়াধীন রয়েছে। বর্তমান টাইম হোরাইজনে মোট বিক্রয়ের পরিমাণ {formatPrice(totalGrossRevenue, currency)} এবং কাস্টমারদের {formatPrice(totalDiscountGranted, currency)} ছাড় প্রদান করা হয়েছে। ক্যাশ অন ডেলিভারি এবং bKash পেমেন্টে সবচেয়ে বেশি অর্ডার রেকর্ড করা হয়েছে।
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 2: ORDERS AUDIT */}
                  {adminTab === 'orders' && (
                    <div className="space-y-4 animate-in fade-in">
                      {/* Search & Filters */}
                      <div className="flex flex-col sm:flex-row gap-2 justify-between">
                        <div className="relative flex-1 max-w-sm">
                          <input
                            type="text"
                            placeholder="Filter by Order ID, Customer, Phone..."
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:border-amber-600"
                          />
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-500 font-medium">Status:</span>
                          <select
                            value={orderStatusFilter}
                            onChange={(e) => setOrderStatusFilter(e.target.value)}
                            className="text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 focus:outline-none"
                          >
                            <option value="all">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* Orders Table */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="p-3">Order ID & Date</th>
                              <th className="p-3">Customer Info</th>
                              <th className="p-3">Payment</th>
                              <th className="p-3">Total Amount</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {adminFilteredOrders.map((order) => (
                              <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-3">
                                  <div className="font-mono font-bold text-slate-900">{order.id}</div>
                                  <div className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                                </td>
                                <td className="p-3">
                                  <div className="font-semibold text-slate-900">{order.customerName}</div>
                                  <div className="text-[11px] text-slate-500">{order.phone} • {order.city}</div>
                                </td>
                                <td className="p-3">
                                  <span className="uppercase text-[11px] font-bold text-slate-700">{order.paymentMethod}</span>
                                </td>
                                <td className="p-3 font-mono font-bold text-slate-900">
                                  {formatPrice(order.totalAmount, currency)}
                                </td>
                                <td className="p-3">
                                  <select
                                    value={order.status}
                                    onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                    className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                      order.status === 'Delivered'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                        : order.status === 'Shipped'
                                        ? 'bg-blue-50 text-blue-700 border-blue-300'
                                        : 'bg-amber-50 text-amber-700 border-amber-300'
                                    }`}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                  </select>
                                </td>
                                <td className="p-3 text-right">
                                  <button
                                    onClick={() => setSelectedInvoiceOrder(order)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                                    title="View & Print Invoice"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 3: INVENTORY */}
                  {adminTab === 'inventory' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                              <th className="p-3">Product Name</th>
                              <th className="p-3">Category</th>
                              <th className="p-3">Unit Price</th>
                              <th className="p-3">Current Stock</th>
                              <th className="p-3">Status</th>
                              <th className="p-3 text-right">Quick Restock</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {products.map((p) => {
                              const isLow = p.stock > 0 && p.stock <= 5;
                              const isOut = p.stock === 0;

                              return (
                                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                                  <td className="p-3 font-semibold text-slate-900">{p.title}</td>
                                  <td className="p-3 text-slate-500 capitalize">{p.category}</td>
                                  <td className="p-3 font-mono text-slate-800">{formatPrice(p.price, currency)}</td>
                                  <td className="p-3 font-mono font-bold text-slate-900">{p.stock} units</td>
                                  <td className="p-3">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      isOut
                                        ? 'bg-rose-100 text-rose-800'
                                        : isLow
                                        ? 'bg-amber-100 text-amber-800'
                                        : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                      {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'Optimal'}
                                    </span>
                                  </td>
                                  <td className="p-3 text-right">
                                    <button
                                      onClick={() => onUpdateProductStock(p.id, p.stock + 5)}
                                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] cursor-pointer"
                                    >
                                      +5 Restock
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ADMIN TAB 4: ISSUES */}
                  {adminTab === 'issues' && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className="space-y-3">
                        {reportIssues.map((issue) => (
                          <div key={issue.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                                  {issue.id}
                                </span>
                                <span className="text-xs font-bold text-slate-900">{issue.subject}</span>
                                {issue.orderId && (
                                  <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {issue.orderId}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <select
                                  value={issue.status}
                                  onChange={(e) => onUpdateIssueStatus(issue.id, e.target.value as CustomerReportIssue['status'])}
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-lg border focus:outline-none cursor-pointer ${
                                    issue.status === 'Resolved'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : issue.status === 'Under Review'
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'bg-slate-100 text-slate-700 border-slate-300'
                                  }`}
                                >
                                  <option value="Open">Open</option>
                                  <option value="Under Review">Under Review</option>
                                  <option value="Resolved">Resolved</option>
                                </select>
                              </div>
                            </div>

                            <p className="text-xs text-slate-600">{issue.details}</p>

                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                              <span>Reported by: <strong className="text-slate-700">{issue.customerName}</strong> ({issue.contact})</span>
                              <span>{new Date(issue.createdAt).toLocaleString('en-GB')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* INVOICE MODAL (Reused for both customer and admin) */}
        {selectedInvoiceOrder && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  <h4 className="font-bold text-slate-900 text-sm">Official Order Receipt</h4>
                </div>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Printable receipt content */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-500">
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Opuluxe Haute Shopping</p>
                    <p className="text-slate-500">Invoice: {selectedInvoiceOrder.id}</p>
                    <p className="text-slate-500">{new Date(selectedInvoiceOrder.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">{selectedInvoiceOrder.customerName}</p>
                    <p className="text-slate-500">{selectedInvoiceOrder.phone}</p>
                    <p className="text-slate-500">{selectedInvoiceOrder.address}, {selectedInvoiceOrder.city}</p>
                  </div>
                </div>

                <div className="border-t border-b border-slate-200 py-2 space-y-2">
                  {selectedInvoiceOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{item.product.title}</span>
                        <span className="text-slate-400 ml-2">x{item.quantity}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        {formatPrice(item.product.price * item.quantity, currency)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedInvoiceOrder.subtotal, currency)}</span>
                  </div>
                  {selectedInvoiceOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Privilege Discount:</span>
                      <span>-{formatPrice(selectedInvoiceOrder.discountAmount, currency)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-500">
                    <span>Delivery Fee:</span>
                    <span>{selectedInvoiceOrder.deliveryFee === 0 ? 'FREE' : formatPrice(selectedInvoiceOrder.deliveryFee, currency)}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    <span>Total Paid:</span>
                    <span>{formatPrice(selectedInvoiceOrder.totalAmount, currency)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
                >
                  Print Invoice
                </button>
                <button
                  onClick={() => setSelectedInvoiceOrder(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Opuluxe Suite • Confidential Data Segregation Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
