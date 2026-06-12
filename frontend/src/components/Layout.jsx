import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  PlusCircle,
  BarChart3,
  Sparkles,
  User,
  LogOut,
  Leaf,
  Moon,
  Sun,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/log', label: 'Log Activity', icon: PlusCircle },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/insights', label: 'AI Insights', icon: Sparkles },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const displayName = user?.name || 'User';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg transition-colors duration-300">
      {/* ─── Desktop Sidebar ───────────────────────── */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:w-[280px] lg:z-50">
        <div className="flex flex-col h-full gradient-primary text-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-20 left-0 w-32 h-32 bg-white/5 rounded-full -translate-x-1/2" />

          {/* Logo */}
          <div className="px-6 py-8 relative">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">EcoStep</h1>
                <p className="text-xs text-white/60 font-medium">Carbon Tracker</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 relative">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                      isActive
                        ? 'bg-white/20 text-white shadow-lg shadow-black/10 backdrop-blur-sm'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span>{item.label}</span>
                  {/* Active indicator */}
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      isActive ? 'ml-auto w-1.5 h-1.5 rounded-full bg-accent-light' : 'hidden'
                    }
                  >
                    <span />
                  </NavLink>
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="px-4 pb-6 space-y-3 relative">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            {/* User section */}
            <div className="border-t border-white/10 pt-4">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-accent/80 flex items-center justify-center text-xs font-bold text-white">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Mobile Top Bar ────────────────────────── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-primary dark:text-primary-light" />
            <span className="font-bold text-dark dark:text-white">EcoStep</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-accent" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-dark dark:text-white" />
              ) : (
                <Menu className="w-5 h-5 text-dark dark:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="animate-slide-down border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface">
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary dark:bg-primary-light/10 dark:text-primary-light'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <button
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* ─── Bottom Navigation (Mobile) ────────────── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-around py-2 px-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'text-primary dark:text-primary-light'
                      : 'text-gray-400 dark:text-gray-500'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.label.split(' ')[0]}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ─── Main Content ──────────────────────────── */}
      <main className="lg:ml-[280px] min-h-screen pt-16 pb-24 lg:pt-0 lg:pb-0">
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
