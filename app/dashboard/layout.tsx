'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, LogOut, TrendingDown, TrendingUp, Menu, X, History, Package, Users, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardProvider, useDashboard } from './DashboardContext';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: LayoutDashboard },
  { href: '/dashboard/produtos', label: 'Produtos', icon: Package },
  { href: '/dashboard/funcionarios', label: 'Funcionários', icon: Users },
  { href: '/dashboard/retiradas', label: 'Registrar Retiradas', icon: TrendingDown },
  { href: '/dashboard/entradas', label: 'Registrar Entradas', icon: TrendingUp },
  { href: '/dashboard/logs', label: 'Logs de movimentações', icon: History },
];

function DashboardLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading, error, refetch } = useDashboard();
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const logged = sessionStorage.getItem('logged');
    const name = sessionStorage.getItem('userName');
    const role = sessionStorage.getItem('userRole');
    if (!logged) {
      router.replace('/');
      return;
    }
    if (name) setUserName(name);
    if (role) setUserRole(role);
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('logged');
      sessionStorage.removeItem('userId');
      sessionStorage.removeItem('userName');
      sessionStorage.removeItem('userRole');
    }
    router.replace('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex md:w-56 lg:w-64 flex-col fixed left-0 top-0 h-full bg-white border-r border-slate-200 z-30">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <LayoutDashboard className="text-white w-5 h-5" />
          </div>
          <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
            CleanStock
          </span>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon size={20} className="shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar - mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-50 transform transition-transform duration-200 md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600 w-6 h-6" />
            <span className="font-bold text-indigo-700">CleanStock</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-500">
            <X size={20} />
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600'
                }`}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:pl-56 lg:pl-64 min-h-screen">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
          <div className="px-4 sm:px-6 h-14 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              aria-label="Abrir menu"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1 md:flex-none" />
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end mr-2">
                <span className="text-sm font-semibold text-slate-700">{userName || 'Usuário'}</span>
                <span className="text-xs text-slate-400">{userRole || 'Admin'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 py-6 md:py-8">
          {error && (
            <div className="mb-4 flex items-center justify-between gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
              <span className="flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </span>
              <button
                onClick={() => refetch()}
                className="text-sm font-medium text-rose-700 hover:underline"
              >
                Tentar novamente
              </button>
            </div>
          )}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <Loader2 size={40} className="animate-spin text-indigo-600" />
              <p className="text-slate-500">Carregando...</p>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </DashboardProvider>
  );
}
