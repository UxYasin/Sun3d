'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { OrderStoreService } from '@/lib/order-store';
import {
  CustomerOrder,
  PaymentStatus,
  ProductionStatus,
  CustomerSummary,
  Template,
  PaymentSettings,
  BusinessSettings
} from '@/types/nameplate';
import { MOCK_TEMPLATES, SIZE_LABELS } from '@/data/mock-templates';
import { NameplatePreview } from '@/components/nameplate/NameplatePreview';
import {
  Shield,
  ShieldCheck,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Layers,
  CreditCard,
  Settings,
  Search,
  CheckCircle2,
  Clock,
  Package,
  AlertCircle,
  Eye,
  Check,
  X,
  Phone,
  Mail,
  User as UserIcon,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

type AdminTab = 'dashboard' | 'orders' | 'customers' | 'templates' | 'payments' | 'settings';

function AdminMain() {
  const router = useRouter();
  const { user, switchRole, isLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(OrderStoreService.getPaymentSettings());
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>(OrderStoreService.getBusinessSettings());

  // Filter & Search states for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [productionFilter, setProductionFilter] = useState<string>('all');

  // Customer selection filter
  const [selectedCustomerIdFilter, setSelectedCustomerIdFilter] = useState<string | null>(null);

  // Selected Order for Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Toast / Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const reloadData = () => {
    setOrders(OrderStoreService.getOrders());
    setCustomers(OrderStoreService.getCustomersList());
    setTemplates(OrderStoreService.getAdminTemplates());
    setPaymentSettings(OrderStoreService.getPaymentSettings());
    setBusinessSettings(OrderStoreService.getBusinessSettings());
  };

  useEffect(() => {
    reloadData();
    OrderStoreService.syncWithServer().then(() => reloadData());

    const handleSync = () => reloadData();
    window.addEventListener('sun3d_store_synced', handleSync);
    return () => window.removeEventListener('sun3d_store_synced', handleSync);
  }, [user]);

  // If user is not admin, show guard screen
  if (!isLoading && (!user || user.role !== 'admin')) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-zinc-900 p-8 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none text-center space-y-4">
          <div className="w-14 h-14 rounded-[20px] bg-amber-100 dark:bg-amber-950 text-[#8b3dff] flex items-center justify-center mx-auto">
            <Shield className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black text-neutral-900 dark:text-white">
            Admin CMS Access Restricted
          </h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You are currently signed in as a <strong>{user ? user.role : 'Visitor'}</strong>. The Business Administration CMS requires the <code>admin</code> role.
          </p>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                switchRole('admin');
                showToast('Switched to Sun3D Operations Admin profile!');
              }}
              className="w-full py-3 bg-[#8b3dff] hover:bg-[#772ce8] text-neutral-950 text-xs font-bold rounded-xl shadow-none transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>1-Click Switch to Admin Profile</span>
            </button>

            <Link
              href="/"
              className="block w-full py-2.5 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl transition-colors"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIONS ---
  const handleUpdatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    const updated = OrderStoreService.updateOrderPaymentStatus(orderId, status);
    if (updated) {
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      reloadData();
      showToast(`Order #${updated.orderNumber} payment marked as "${status}".`);
    }
  };

  const handleUpdateProductionStatus = (orderId: string, status: ProductionStatus) => {
    const updated = OrderStoreService.updateOrderProductionStatus(orderId, status);
    if (updated) {
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
      reloadData();
      showToast(`Order #${updated.orderNumber} production moved to "${status}".`);
    }
  };

  const handleToggleTemplate = (tplId: string) => {
    const updated = OrderStoreService.toggleTemplateEnabled(tplId);
    setTemplates(updated);
    showToast('Template visibility updated.');
  };

  const handleSavePaymentSettings = (e: React.FormEvent) => {
    e.preventDefault();
    OrderStoreService.updatePaymentSettings(paymentSettings);
    showToast('bKash and Nagad payment settings saved successfully!');
  };

  const handleSaveBusinessSettings = (e: React.FormEvent) => {
    e.preventDefault();
    OrderStoreService.updateBusinessSettings(businessSettings);
    showToast('Business & workshop settings updated successfully!');
  };

  // --- STATS CALCULATION ---
  const stats = {
    totalOrders: orders.length,
    newOrders: orders.filter((o) => o.productionStatus === 'New').length,
    paymentPending: orders.filter((o) => o.paymentStatus === 'submitted').length,
    paid: orders.filter((o) => o.paymentStatus === 'paid').length,
    working: orders.filter((o) => o.productionStatus === 'Working').length,
    ready: orders.filter((o) => o.productionStatus === 'Ready').length,
    completed: orders.filter((o) => o.productionStatus === 'Completed').length,
    totalRevenue: orders
      .filter((o) => o.paymentStatus === 'paid')
      .reduce((sum, o) => sum + o.price, 0)
  };

  // --- FILTERED ORDERS ---
  const filteredOrders = orders.filter((o) => {
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
    if (productionFilter !== 'all' && o.productionStatus !== productionFilter) return false;
    if (selectedCustomerIdFilter && o.customerId !== selectedCustomerIdFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      const matchId = o.orderNumber.toLowerCase().includes(q) || o.id.toLowerCase().includes(q);
      const matchCustomer = o.customerName.toLowerCase().includes(q) || o.customerPhone.includes(q);
      const matchHouse = o.houseName.toLowerCase().includes(q);
      const matchTrx = o.transactionId?.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchHouse && !matchTrx) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-neutral-900 text-white dark:bg-[#8b3dff] dark:text-neutral-950 px-4 py-3 rounded-[20px] text-xs font-bold shadow-none flex items-center gap-2 animate-fade-in border border-[#8b3dff]/30">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Banner */}
      <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-none flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[20px] bg-[#8b3dff] text-white font-black text-xl flex items-center justify-center shadow-none">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white">
                Sun3D Operations CMS
              </h1>
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#8b3dff] text-neutral-950 shadow-xs">
                Admin Center
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Manage incoming household orders, verify bKash/Nagad payments, and track laser manufacturing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => switchRole('customer')}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 transition-colors"
          >
            Switch to Customer View
          </button>
          <Link
            href="/editor"
            className="px-4 py-2 bg-neutral-900 hover:bg-black text-white dark:bg-[#8b3dff] dark:hover:bg-[#772ce8] dark:text-neutral-950 rounded-xl text-xs font-bold transition-all"
          >
            Launch Editor
          </Link>
        </div>
      </div>

      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-8 overflow-x-auto">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'customers', label: `Customers (${customers.length})`, icon: Users },
          { id: 'templates', label: `Templates (${templates.length})`, icon: Layers },
          { id: 'payments', label: 'Payment Settings', icon: CreditCard },
          { id: 'settings', label: 'Business Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as AdminTab);
                if (tab.id === 'orders') setSelectedCustomerIdFilter(null);
              }}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0',
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-[#8b3dff] dark:text-neutral-950 shadow-none'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ============================================================ */}
      {/* TAB 1: DASHBOARD OVERVIEW */}
      {/* ============================================================ */}
      {activeTab === 'dashboard' && (
        <div className="space-y-8 animate-fade-in">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'New Orders', count: stats.newOrders, color: 'text-[#8b3dff] bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' },
              { label: 'Payment Pending', count: stats.paymentPending, color: 'text-orange-600 bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800' },
              { label: 'Paid & Verified', count: stats.paid, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' },
              { label: 'In Laser Cutting', count: stats.working, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800' },
              { label: 'Ready for Dispatch', count: stats.ready, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800' },
              { label: 'Delivered', count: stats.completed, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800' }
            ].map((card) => (
              <div
                key={card.label}
                className={cn('p-4 rounded-[20px] border flex flex-col justify-between', card.color)}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider opacity-85">
                  {card.label}
                </span>
                <span className="text-2xl sm:text-3xl font-black mt-2">
                  {card.count}
                </span>
              </div>
            ))}
          </div>

          {/* Revenue & Quick Action Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-[24px] bg-neutral-900 text-white dark:bg-zinc-900 border border-neutral-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Total Verified Gross Revenue
                </span>
                <h3 className="text-3xl font-black text-[#a855f7] mt-2">
                  ৳{stats.totalRevenue.toLocaleString()} BDT
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  From {stats.paid} verified manual payments via bKash & Nagad.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
                <span>Active Channels: bKash, Nagad</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Urgent Payment Pending List */}
            <div className="md:col-span-2 p-6 rounded-[24px] bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 shadow-none flex flex-col justify-between">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    Action Required: Verify Pending Payments ({stats.paymentPending})
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setPaymentFilter('submitted');
                    setActiveTab('orders');
                  }}
                  className="text-xs font-bold text-[#8b3dff] hover:underline"
                >
                  View All Pending
                </button>
              </div>

              <div className="space-y-2">
                {orders
                  .filter((o) => o.paymentStatus === 'submitted')
                  .slice(0, 3)
                  .map((ord) => (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedOrder(ord)}
                      className="p-3 bg-neutral-50 dark:bg-zinc-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between cursor-pointer hover:border-[#8b3dff] transition-colors"
                    >
                      <div>
                        <span className="font-mono text-xs font-black text-neutral-900 dark:text-white">
                          #{ord.orderNumber}
                        </span>
                        <span className="text-xs text-neutral-600 dark:text-neutral-300 ml-2 font-semibold">
                          {ord.houseName}
                        </span>
                        <p className="text-[11px] text-neutral-500">
                          {ord.paymentMethod}: <strong>{ord.transactionId}</strong> • Sender: {ord.senderPhone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          ৳{ord.price.toLocaleString()}
                        </span>
                        <span className="px-2.5 py-1 bg-[#8b3dff] text-neutral-950 text-[11px] font-bold rounded-lg shadow-xs">
                          Inspect & Verify
                        </span>
                      </div>
                    </div>
                  ))}

                {stats.paymentPending === 0 && (
                  <p className="text-xs text-neutral-400 py-4 text-center">
                    All submitted payments have been verified! Zero backlogs.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-base text-neutral-900 dark:text-white">
                Recent Orders
              </h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-bold text-[#8b3dff] hover:underline"
              >
                View full table →
              </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-none">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-zinc-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Nameplate</th>
                      <th className="p-4">Ratio</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Production</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-50/60 dark:hover:bg-zinc-800/40">
                        <td className="p-4 font-mono font-bold text-neutral-900 dark:text-white">
                          #{ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-neutral-900 dark:text-white block">{ord.customerName}</span>
                          <span className="text-[11px] text-neutral-400">{ord.customerPhone}</span>
                        </td>
                        <td className="p-4 text-neutral-800 dark:text-neutral-200 font-semibold">{ord.houseName}</td>
                        <td className="p-4">{ord.size}</td>
                        <td className="p-4 font-black text-neutral-900 dark:text-white">৳{ord.price.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold uppercase', ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : ord.paymentStatus === 'submitted' ? 'bg-amber-100 text-amber-800' : 'bg-neutral-100 text-neutral-600')}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 dark:bg-zinc-800">
                            {ord.productionStatus}
                          </span>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="px-2.5 py-1 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-zinc-800 hover:bg-[#8b3dff] hover:text-neutral-950 rounded-lg transition-colors"
                          >
                            Open
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ORDERS MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-fade-in">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-zinc-900 rounded-[20px] border border-neutral-200 dark:border-neutral-800 p-4 shadow-none flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search by order #, phone, family name, TrxID..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#8b3dff]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-1 lg:pb-0">
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                <span className="text-[11px] font-semibold text-neutral-500 px-2">Payment:</span>
                {['all', 'submitted', 'paid', 'unpaid'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setPaymentFilter(st)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all',
                      paymentFilter === st
                        ? 'bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    )}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 p-1 rounded-xl shrink-0">
                <span className="text-[11px] font-semibold text-neutral-500 px-2">Production:</span>
                {['all', 'New', 'Working', 'Ready', 'Completed'].map((p) => (
                  <button
                    key={p}
                    onClick={() => setProductionFilter(p)}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-bold transition-all',
                      productionFilter === p
                        ? 'bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-xs'
                        : 'text-neutral-500 hover:text-neutral-900'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedCustomerIdFilter && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
              <span>Filtering orders for customer ID: <strong>{selectedCustomerIdFilter}</strong></span>
              <button
                onClick={() => setSelectedCustomerIdFilter(null)}
                className="font-bold underline"
              >
                Clear customer filter
              </button>
            </div>
          )}

          {/* Orders Table */}
          <div className="bg-white dark:bg-zinc-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-none">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-zinc-800/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 uppercase font-bold">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Nameplate Name</th>
                    <th className="p-4">Ratio</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Production Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-medium">
                  {filteredOrders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-neutral-50/60 dark:hover:bg-zinc-800/40">
                      <td className="p-4 font-mono font-bold text-neutral-900 dark:text-white">
                        #{ord.orderNumber}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-neutral-900 dark:text-white block">{ord.customerName}</span>
                        <span className="text-[11px] text-neutral-400">{ord.customerPhone}</span>
                      </td>
                      <td className="p-4 text-neutral-900 dark:text-white font-semibold">
                        {ord.houseName}
                        <span className="block text-[10px] text-neutral-400">{ord.proprietor}</span>
                      </td>
                      <td className="p-4 font-mono">{ord.size}</td>
                      <td className="p-4 font-black text-neutral-900 dark:text-white">
                        ৳{ord.price.toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1',
                            ord.paymentStatus === 'paid' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                            ord.paymentStatus === 'submitted' && 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
                            ord.paymentStatus === 'unpaid' && 'bg-neutral-100 text-neutral-600',
                            ord.paymentStatus === 'rejected' && 'bg-rose-100 text-rose-800'
                          )}
                        >
                          {ord.paymentStatus}
                        </span>
                        {ord.transactionId && (
                          <span className="block font-mono text-[9px] text-neutral-400 mt-0.5">
                            {ord.paymentMethod}: {ord.transactionId}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'px-3 py-1 rounded-full text-[10px] font-bold',
                            ord.productionStatus === 'Working' && 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
                            ord.productionStatus === 'Ready' && 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
                            ord.productionStatus === 'Completed' && 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
                            ord.productionStatus === 'New' && 'bg-amber-100 text-amber-800',
                            ord.productionStatus === 'Payment Pending' && 'bg-orange-100 text-orange-800'
                          )}
                        >
                          {ord.productionStatus}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400 text-[11px]">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white dark:bg-[#8b3dff] dark:hover:bg-[#772ce8] dark:text-neutral-950 rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          Inspect & Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredOrders.length === 0 && (
                <div className="p-12 text-center text-xs text-neutral-500">
                  No orders match your filter criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CUSTOMERS DIRECTORY */}
      {/* ============================================================ */}
      {activeTab === 'customers' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="font-black text-base text-neutral-900 dark:text-white">
              Customer Directory ({customers.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Click any customer to inspect their full purchase history and custom nameplate orders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {customers.map((cust) => (
              <div
                key={cust.id}
                onClick={() => {
                  setSelectedCustomerIdFilter(cust.id);
                  setActiveTab('orders');
                }}
                className="bg-white dark:bg-zinc-900 p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none hover:shadow-none transition-shadow cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-[20px] bg-amber-100 dark:bg-amber-950 text-[#8b3dff] font-black text-lg flex items-center justify-center">
                      {cust.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{cust.name}</h4>
                      <span className="text-[10px] text-neutral-400 font-mono">ID: {cust.id}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <p className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{cust.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{cust.phone}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Total Orders</span>
                    <span className="font-black text-neutral-900 dark:text-white">{cust.totalOrders}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Total Spent</span>
                    <span className="font-black text-[#8b3dff] dark:text-[#a855f7]">৳{cust.totalSpent.toLocaleString()}</span>
                  </div>
                  <span className="text-[10px] font-bold text-[#8b3dff] hover:underline flex items-center gap-0.5">
                    <span>Orders</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 4: TEMPLATES MANAGEMENT */}
      {/* ============================================================ */}
      {activeTab === 'templates' && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <h3 className="font-black text-base text-neutral-900 dark:text-white">
              Templates Catalog Management ({templates.length})
            </h3>
            <p className="text-xs text-neutral-500">
              Toggle visibility, edit display names, categories, and featured badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white dark:bg-zinc-900 p-5 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      {tpl.name}
                    </h4>
                    {tpl.badge && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#8b3dff] text-neutral-950">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {tpl.category} • {tpl.material}
                  </p>
                  <p className="text-[11px] font-mono text-neutral-400 mt-1">
                    Sizes: {tpl.supportedSizes.join(', ')} • Price: ৳{tpl.priceStartingAt.toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleTemplate(tpl.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-bold transition-all border',
                      tpl.enabled !== false
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-neutral-100 text-neutral-500 border-neutral-200'
                    )}
                  >
                    {tpl.enabled !== false ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 5: PAYMENT SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'payments' && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none space-y-6 animate-fade-in">
          <div>
            <h3 className="font-black text-lg text-neutral-900 dark:text-white">
              Manual bKash & Nagad Configuration
            </h3>
            <p className="text-xs text-neutral-500">
              Configure recipient numbers and step-by-step instructions displayed to customers at checkout.
            </p>
          </div>

          <form onSubmit={handleSavePaymentSettings} className="space-y-6">
            {/* bKash Section */}
            <div className="p-5 bg-pink-50/50 dark:bg-pink-950/20 rounded-[20px] border border-pink-200 dark:border-pink-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-pink-600 text-sm">bKash Configuration</span>
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={paymentSettings.bkashEnabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, bkashEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Channel Enabled</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  bKash Account Number
                </label>
                <input
                  type="text"
                  value={paymentSettings.bkashNumber}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, bkashNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Customer Instructions
                </label>
                <textarea
                  rows={2}
                  value={paymentSettings.bkashInstructions}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, bkashInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Nagad Section */}
            <div className="p-5 bg-orange-50/50 dark:bg-orange-950/20 rounded-[20px] border border-orange-200 dark:border-orange-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-black text-orange-600 text-sm">Nagad Configuration</span>
                <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  <input
                    type="checkbox"
                    checked={paymentSettings.nagadEnabled}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, nagadEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Channel Enabled</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nagad Account Number
                </label>
                <input
                  type="text"
                  value={paymentSettings.nagadNumber}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, nagadNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs font-mono text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Customer Instructions
                </label>
                <textarea
                  rows={2}
                  value={paymentSettings.nagadInstructions}
                  onChange={(e) => setPaymentSettings({ ...paymentSettings, nagadInstructions: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white dark:bg-[#8b3dff] dark:hover:bg-[#772ce8] dark:text-neutral-950 font-bold text-xs rounded-xl shadow-none transition-all"
            >
              Save Payment Settings
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 6: BUSINESS SETTINGS */}
      {/* ============================================================ */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none space-y-6 animate-fade-in">
          <div>
            <h3 className="font-black text-lg text-neutral-900 dark:text-white">
              Business & Workshop Profile
            </h3>
            <p className="text-xs text-neutral-500">
              Basic business identity settings shown on customer receipts and footers.
            </p>
          </div>

          <form onSubmit={handleSaveBusinessSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Business Display Name
              </label>
              <input
                type="text"
                value={businessSettings.businessName}
                onChange={(e) => setBusinessSettings({ ...businessSettings, businessName: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={businessSettings.contactPhone}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, contactPhone: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Support Email
                </label>
                <input
                  type="email"
                  value={businessSettings.contactEmail}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, contactEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                Workshop & Manufacturing Address
              </label>
              <input
                type="text"
                value={businessSettings.workshopAddress}
                onChange={(e) => setBusinessSettings({ ...businessSettings, workshopAddress: e.target.value })}
                className="w-full px-3 py-2 bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-neutral-900 hover:bg-black text-white dark:bg-[#8b3dff] dark:hover:bg-[#772ce8] dark:text-neutral-950 font-bold text-xs rounded-xl shadow-none transition-all mt-4"
            >
              Save Business Profile
            </button>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* ORDER DETAIL INSPECTION MODAL */}
      {/* ============================================================ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-[24px] border border-neutral-200 dark:border-neutral-800 shadow-none p-6 sm:p-8 max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-black text-neutral-900 dark:text-white">
                    Order #{selectedOrder.orderNumber}
                  </span>
                  <span className="text-xs text-neutral-400">
                    ({new Date(selectedOrder.createdAt).toLocaleDateString()})
                  </span>
                </div>
                <p className="text-xs text-neutral-500">
                  Customer: <strong>{selectedOrder.customerName}</strong> ({selectedOrder.customerPhone})
                </p>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Design Visual Simulation */}
              <div className="lg:col-span-6 space-y-4">
                <div className="bg-neutral-100 dark:bg-zinc-950 rounded-[20px] p-4 sm:p-6 border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-neutral-500">
                    <span>Manufacturing Spec</span>
                    <span>Ratio: {selectedOrder.size}</span>
                  </div>

                  <NameplatePreview
                    template={MOCK_TEMPLATES.find((t) => t.id === selectedOrder.templateId) || MOCK_TEMPLATES[0]}
                    size={selectedOrder.size}
                    customValues={selectedOrder.finalDesignData || {
                      houseName: selectedOrder.houseName,
                      proprietor: selectedOrder.proprietor,
                      address: selectedOrder.address,
                      holdingNumber: selectedOrder.holdingNumber
                    }}
                    className="shadow-none"
                  />
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-zinc-800/60 rounded-xl text-xs space-y-1">
                  <p><span className="font-bold">House Name:</span> {selectedOrder.houseName}</p>
                  <p><span className="font-bold">Proprietor:</span> {selectedOrder.proprietor}</p>
                  <p><span className="font-bold">Address:</span> {selectedOrder.address}</p>
                  <p><span className="font-bold">Holding:</span> {selectedOrder.holdingNumber}</p>
                </div>
              </div>

              {/* Right Column: Payment & Production Controls */}
              <div className="lg:col-span-6 space-y-6">
                {/* Payment Verification Box */}
                <div className="p-5 rounded-[20px] bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Payment Verification
                    </h4>
                    <span className="font-black text-sm text-neutral-900 dark:text-white">
                      ৳{selectedOrder.price.toLocaleString()} BDT
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <p className="flex justify-between">
                      <span className="text-neutral-500">Channel:</span>
                      <strong className="text-neutral-900 dark:text-white">{selectedOrder.paymentMethod}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-500">Submitted TrxID:</span>
                      <strong className="font-mono text-neutral-900 dark:text-white">{selectedOrder.transactionId || 'None submitted yet'}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-500">Sender Phone:</span>
                      <strong className="font-mono text-neutral-900 dark:text-white">{selectedOrder.senderPhone || 'N/A'}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-neutral-500">Current Payment Status:</span>
                      <strong className="capitalize text-[#8b3dff] dark:text-[#a855f7]">{selectedOrder.paymentStatus}</strong>
                    </p>
                  </div>

                  {/* Payment Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'paid')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Mark Paid</span>
                    </button>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'rejected')}
                      className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      Reject TrxID
                    </button>
                    <button
                      onClick={() => handleUpdatePaymentStatus(selectedOrder.id, 'submitted')}
                      className="flex-1 py-2 bg-neutral-200 dark:bg-zinc-700 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      Set Pending
                    </button>
                  </div>
                </div>

                {/* Production Status Box */}
                <div className="p-5 rounded-[20px] bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                      Production State Control
                    </h4>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      {selectedOrder.productionStatus}
                    </span>
                  </div>

                  <p className="text-[11px] text-neutral-500">
                    Advancing production immediately updates the customer's live order tracking timeline:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    {(['New', 'Working', 'Ready', 'Completed', 'Cancelled'] as ProductionStatus[]).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateProductionStatus(selectedOrder.id, st)}
                        className={cn(
                          'py-2 px-2 rounded-xl text-xs font-bold transition-all border',
                          selectedOrder.productionStatus === st
                            ? 'bg-neutral-900 text-white dark:bg-[#8b3dff] dark:text-neutral-950 border-neutral-900 dark:border-amber-400'
                            : 'bg-white dark:bg-zinc-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                        )}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-zinc-950 flex flex-col justify-between">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div className="p-12 text-center text-xs text-neutral-500">Loading Admin CMS...</div>}>
          <AdminMain />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
