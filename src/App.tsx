import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import Habits from './components/Habits';
import QuickEntryFAB from './components/QuickEntryFAB';
import { OfflineBanner, useTimeContext } from './components/KineticPrimitives';
import { LayoutDashboard, Target, BarChart2, Settings as SettingsIcon, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import './index.css';

type Tab = 'dashboard' | 'habits' | 'insights' | 'settings';

const NAV_ITEMS: { id: Tab; label: string; Icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { id: 'habits',    label: 'Habits',      Icon: Target },
  { id: 'insights',  label: 'Insights',    Icon: BarChart2 },
  { id: 'settings',  label: 'Settings',    Icon: SettingsIcon },
];

// Shimmer boot screen
function SystemBootScreen() {
  return (
    <div className="w-full max-w-5xl mx-auto p-8 lg:p-10 flex flex-col gap-8">
      <div>
        <div className="w-1/3 h-12 rounded-xl animate-shimmer mb-4" />
        <div className="w-1/4 h-4 rounded-md animate-shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[1, 2, 3].map(n => <div key={n} className="h-[140px] rounded-2xl animate-shimmer" />)}
      </div>
      <div className="flex flex-col gap-3">
        <div className="w-1/4 h-7 rounded-lg animate-shimmer mb-2" />
        {[1, 2, 3, 4].map(n => <div key={n} className="h-[80px] rounded-xl animate-shimmer" />)}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Restore theme
    const theme = localStorage.getItem('kinetic_theme');
    if (theme === 'light') document.documentElement.classList.add('light');
    // Restore accent
    const accent = localStorage.getItem('kinetic_accent');
    if (accent) {
      const ACCENTS: Record<string, string> = {
        '#75d5e2': '#006069', '#ff8a70': '#8c2e1b',
        '#c5a0ff': '#4a1f8c', '#ffd166': '#8c6200',
        '#ff7fa8': '#8c1f42', '#97e16a': '#2d6600',
      };
      document.documentElement.style.setProperty('--color-primary', accent);
      if (ACCENTS[accent]) document.documentElement.style.setProperty('--color-primary-container', ACCENTS[accent]);
    }
    const t = setTimeout(() => setIsBooting(false), 1400);
    return () => clearTimeout(t);
  }, []);

  const { isFocusMode: _focusMode, gradient } = useTimeContext();
  const isFocus = _focusMode;

  return (
    <div className={`min-h-screen bg-surface flex font-sans text-on-surface relative transition-all duration-1000 ${isFocus ? 'focus-mode-active' : ''}`}>
      {/* §7.9 Focus Mode Dimming Overlay */}
      <AnimatePresence>
        {isFocus && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1] pointer-events-none bg-black/10 backdrop-grayscale-[0.25] backdrop-brightness-[0.92]"
          />
        )}
      </AnimatePresence>

      {/* Time-of-day ambient gradient (§7.3) */}
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: gradient }} />

      {/* Offline banner (§7.10) */}
      <OfflineBanner />

      {/* ── Left Sidebar (256px fixed, desktop) ── */}
      <aside className="hidden md:flex w-[256px] shrink-0 flex-col bg-surface min-h-screen sticky top-0">

        {/* Brand / Profile */}
        <div className="px-5 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
              <span className="text-primary font-serif font-bold text-sm">KS</span>
            </div>
            <div>
              <h1 className="font-serif text-base font-bold text-primary leading-tight">Kinetic Sanctuary</h1>
              <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-[0.15em]">Precision Performance</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 flex flex-col gap-1">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left
                  ${isActive
                    ? 'bg-surface-container-low text-primary border-r-2 border-primary'
                    : 'text-on-surface-variant/70 hover:bg-surface-container-low hover:text-primary'
                  }`}
              >
                <Icon size={18} className="shrink-0" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Quick Entry integrated via FAB Component */}
        <div className="p-4" />
      </aside>

      {/* ── Main Column ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Glassmorphic Top App Bar ── */}
        <header className="sticky top-0 z-50 glass border-b border-outline-variant/20 px-6 md:px-8 h-[72px] flex items-center justify-between">
          <div className="font-serif font-bold text-xl text-on-surface tracking-tight uppercase">
            Kinetic Sanctuary
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-surface-container-high hover:bg-surface-bright transition-colors flex items-center justify-center text-on-surface-variant hover:text-primary" aria-label="Notifications">
              <Bell size={17} />
            </button>
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center">
              <span className="text-primary font-serif font-bold text-xs">KS</span>
            </div>
          </div>
        </header>

        {/* ── Mobile Bottom Nav ── */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-outline-variant/20 flex items-center">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = activeTab === id;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant/60'}`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </button>
            );
          })}
        </nav>

        {/* ── Page Content ── */}
        <main className="flex-1 pb-20 md:pb-0 overflow-auto">
          <AnimatePresence mode="wait">
            {isBooting ? (
              <motion.div key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <SystemBootScreen />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              >
                {activeTab === 'dashboard' ? <Dashboard onNavigateHabits={() => setActiveTab('habits')} />
                  : activeTab === 'habits' ? <Habits />
                  : activeTab === 'insights' ? <Analytics />
                  : <Settings />}
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <QuickEntryFAB />
    </div>
  );
}
