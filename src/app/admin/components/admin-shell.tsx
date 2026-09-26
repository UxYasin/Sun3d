'use client';

import React from 'react';
import Link from 'next/link';
import {
  Bell,
  CreditCard,
  ExternalLink,
  Layers,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  Settings,
  ShoppingBag,
  Sun,
  UserCog,
  Users,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export type AdminTab =
  | 'dashboard'
  | 'orders'
  | 'customers'
  | 'templates'
  | 'payments'
  | 'settings';

export interface AdminNavCounts {
  orders: number;
  customers: number;
  templates: number;
  pending: number;
}

const TAB_LABELS: Record<AdminTab, string> = {
  dashboard: 'Dashboard',
  orders: 'Orders',
  customers: 'Customers',
  templates: 'Designs',
  payments: 'Payment Settings',
  settings: 'Business Settings',
};

const NAV_GROUPS: {
  title: string;
  items: { id: AdminTab; label: string; icon: React.ElementType }[];
}[] = [
  {
    title: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'orders', label: 'Orders', icon: ShoppingBag },
      { id: 'customers', label: 'Customers', icon: Users },
    ],
  },
  {
    title: 'Catalogue',
    items: [
      { id: 'templates', label: 'Designs', icon: Layers },
      { id: 'payments', label: 'Payments', icon: CreditCard },
    ],
  },
  {
    title: 'System',
    items: [{ id: 'settings', label: 'Business Settings', icon: Settings }],
  },
];

export const ThemeToggle = () => {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.classList.contains('dark') ? 'light' : 'dark';
    root.classList.toggle('dark', next === 'dark');
    try {
      localStorage.setItem('sun3d_theme', next);
    } catch {
      /* ignore */
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggle} title="Toggle theme">
      {/* Driven by CSS so the icon always matches the active theme. */}
      <Sun className="size-4 dark:hidden" />
      <Moon className="hidden size-4 dark:block" />
    </Button>
  );
};

export const AdminSidebar = ({
  activeTab,
  counts,
  onChangeTab,
  onSwitchToCustomer,
  isOpen,
  onClose,
}: {
  activeTab: AdminTab;
  counts: AdminNavCounts;
  onChangeTab: (tab: AdminTab) => void;
  onSwitchToCustomer: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const badgeFor = (id: AdminTab) => {
    if (id === 'orders') return counts.orders;
    if (id === 'customers') return counts.customers;
    if (id === 'templates') return counts.templates;
    return undefined;
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 shrink-0 bg-white border-r flex flex-col transition-transform lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand — same height as the editor navbar */}
        <div className="h-[68px] shrink-0 flex items-center gap-2.5 px-4 border-b">
          <span className="size-8 rounded-md bg-[#0073ff] text-white text-sm font-bold flex items-center justify-center">
            S
          </span>
          <span className="font-semibold text-sm tracking-tight">Sun3D</span>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            Admin
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="ml-auto lg:hidden"
          >
            <X className="size-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="px-4 mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.title}
              </p>
              <ul className="flex flex-col gap-y-0.5 px-2">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const badge = badgeFor(item.id);

                  return (
                    <li key={item.id}>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          onChangeTab(item.id);
                          onClose();
                        }}
                        className={cn(
                          'w-full justify-start gap-x-2.5 h-9 px-3 text-sm font-medium',
                          isActive && 'bg-muted text-primary font-semibold'
                        )}
                      >
                        <Icon className="size-4 stroke-2 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {badge !== undefined && (
                          <span className="ml-auto text-[11px] text-muted-foreground">
                            {badge}
                          </span>
                        )}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="p-2 border-t">
          <Button
            variant="ghost"
            onClick={onSwitchToCustomer}
            className="w-full justify-start gap-x-2.5 h-9 px-3 text-sm font-medium"
          >
            <UserCog className="size-4 stroke-2 shrink-0" />
            <span>Customer View</span>
          </Button>
          <Button
            variant="ghost"
            asChild
            className="w-full justify-start gap-x-2.5 h-9 px-3 text-sm font-medium"
          >
            <Link href="/editor">
              <ExternalLink className="size-4 stroke-2 shrink-0" />
              <span>Launch Editor</span>
            </Link>
          </Button>
        </div>
      </aside>
    </>
  );
};

export const AdminTopbar = ({
  activeTab,
  userName,
  search,
  onSearch,
  pendingCount,
  onOpenNav,
  notifications,
}: {
  activeTab: AdminTab;
  userName: string;
  search: string;
  onSearch: (value: string) => void;
  pendingCount: number;
  onOpenNav: () => void;
  notifications: { id: string; label: string }[];
}) => {
  const [showNotifications, setShowNotifications] = React.useState(false);

  const initials =
    userName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'AD';

  return (
    <header className="h-[68px] shrink-0 bg-white border-b flex items-center gap-x-3 px-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={onOpenNav}
        className="lg:hidden"
      >
        <Menu className="size-4" />
      </Button>

      {/* Breadcrumb */}
      <div className="hidden sm:flex items-center gap-x-2 text-xs">
        <span className="text-muted-foreground">Workspace</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-medium text-foreground">
          {TAB_LABELS[activeTab]}
        </span>
      </div>

      <Separator orientation="vertical" className="h-6 hidden sm:block" />

      {/* Search */}
      <div className="relative ml-auto w-full max-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search orders, customers…"
          className="h-9 pl-9 text-sm"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications((v) => !v)}
        >
          <Bell className="size-4" />
          {pendingCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </Button>

        {showNotifications && notifications.length > 0 && (
          <div className="absolute right-0 mt-2 w-72 rounded-md border bg-popover text-popover-foreground shadow-md overflow-hidden z-50">
            <p className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground border-b">
              Needs attention
            </p>
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="px-3 py-2 text-xs text-foreground border-b last:border-0"
                >
                  {n.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <ThemeToggle />

      <div
        title={userName}
        className="size-8 rounded-md bg-[#0073ff] text-white text-xs font-semibold flex items-center justify-center shrink-0"
      >
        {initials}
      </div>
    </header>
  );
};

export { TAB_LABELS };
