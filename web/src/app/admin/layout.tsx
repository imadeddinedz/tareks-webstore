'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Tag, LogOut, Menu, X, Rocket, FolderOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const ADMIN_NAV = [
  { name: 'Tableau de bord', href: '/admin', icon: LayoutDashboard },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Catégories', href: '/admin/categories', icon: FolderOpen },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Clients', href: '/admin/customers', icon: Users },
  { name: 'Promotions', href: '/admin/promotions', icon: Tag },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // If login page, don't show the dashboard shell
  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
        {children}
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      toast.success('Déconnexion réussie');
      router.push('/admin/login');
      router.refresh();
    } catch {
      toast.error('Erreur de déconnexion');
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] text-gray-900 flex flex-col md:flex-row overflow-hidden" data-theme="light">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white shadow-md">
            <Rocket size={16} />
          </div>
          <span className="font-heading font-bold text-gray-900">Admin</span>
        </Link>
        <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-500 hover:text-gray-800 transition-colors">
          <Menu size={20} />
        </button>
      </div>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <nav className={`fixed inset-y-0 left-0 w-[260px] bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 flex flex-col shadow-lg md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--brand)] flex items-center justify-center text-white shadow-sm">
              <Rocket size={16} />
            </div>
            <div>
              <span className="font-bold text-sm leading-tight block text-gray-900">HTS Admin</span>
              <span className="text-[10px] text-amber-600 font-medium uppercase tracking-wider">Workspace</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-gray-400 hover:text-gray-700 bg-gray-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all font-medium text-sm group relative",
                  isActive
                    ? "bg-amber-50 text-amber-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-sm bg-amber-500"
                  />
                )}
                <item.icon size={16} className={cn("transition-colors", isActive ? "text-amber-500" : "text-gray-400 group-hover:text-amber-500")} />
                <span suppressHydrationWarning>{item.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg w-full text-left font-medium text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors group"
          >
            <LogOut size={16} className="text-gray-400 group-hover:text-red-500" />
            <span suppressHydrationWarning>Déconnexion</span>
          </button>
        </div>
      </nav>

      {/* Main Area */}
      <main className="flex-1 relative overflow-y-auto h-[var(--vh,100vh)] bg-[#F1F5F9]">
        <div className="relative z-10 w-full h-full flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
