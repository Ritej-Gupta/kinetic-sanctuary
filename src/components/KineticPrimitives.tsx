/**
 * Kinetic Sanctuary — Shared UI Primitives
 * Implements design.md v3.0 §7 new features
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────────────────
// §7.3 Time-of-Day Context Banner
// ─────────────────────────────────────────────────────────────────────────────

interface TimeContext {
  greeting: string;
  accent: string;
  gradient: string;
}

function getTimeContext(hour: number): TimeContext {
  if (hour >= 5 && hour < 10) return {
    greeting: 'Morning Protocol',
    accent: '#75d5e2',
    gradient: 'radial-gradient(ellipse at top left, rgba(117,213,226,0.08) 0%, transparent 70%)',
  };
  if (hour >= 10 && hour < 15) return {
    greeting: 'Peak Window',
    accent: '#96ccff',
    gradient: 'radial-gradient(ellipse at top right, rgba(150,204,255,0.06) 0%, transparent 70%)',
  };
  if (hour >= 15 && hour < 19) return {
    greeting: 'Afternoon Momentum',
    accent: '#7ddc7a',
    gradient: 'radial-gradient(ellipse at center, rgba(125,220,122,0.06) 0%, transparent 70%)',
  };
  if (hour >= 19 && hour < 22) return {
    greeting: 'Wind Down',
    accent: '#c084fc',
    gradient: 'radial-gradient(ellipse at bottom, rgba(192,132,252,0.06) 0%, transparent 70%)',
  };
  return {
    greeting: 'Recovery Mode',
    accent: 'var(--color-surface-container-high)',
    gradient: 'none',
  };
}

export function TimeOfDayBanner() {
  const hour = new Date().getHours();
  const ctx  = getTimeContext(hour);

  return (
    <div
      className="w-full pointer-events-none absolute inset-0 z-0"
      style={{ background: ctx.gradient }}
    />
  );
}

export function useTimeContext() {
  const hour = new Date().getHours();
  return { ...getTimeContext(hour), hour, isFocusMode: hour >= 19 };
}

// ─────────────────────────────────────────────────────────────────────────────
// §7.10 Offline State Banner
// ─────────────────────────────────────────────────────────────────────────────

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const on  = () => setIsOffline(false);
    const off = () => setIsOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
          className="fixed top-0 left-0 right-0 z-[2000] flex items-center gap-3 px-6 py-3 bg-surface-container-high"
          style={{ boxShadow: 'var(--shadow-float)' }}
        >
          {/* Pulsing error dot */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: 'var(--color-error)' }} />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-error)', opacity: 0.7 }} />
          </span>
          <p className="text-sm text-on-surface-variant">
            Working offline. Your data is safe.
          </p>
          <WifiOff size={14} className="ml-auto text-on-surface-dim shrink-0" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §7.8 Quiet Win — Milestone Toast (NO confetti)
// ─────────────────────────────────────────────────────────────────────────────

export interface MilestoneToast {
  id: string;
  message: string;
}

const MILESTONE_MESSAGES: Record<number, string> = {
  7:   '7 days. The neural pathway is forming.',
  14:  '14 days. Momentum is real.',
  21:  '21 days. Automaticity begins.',
  66:  '66 days. This is no longer a habit. It\'s you.',
  100: '100 wins. Velocity confirmed.',
  365: '365 days. Identity-level change.',
};

export function getMilestoneMessage(streak: number): string | null {
  return MILESTONE_MESSAGES[streak] ?? null;
}

interface QuietWinToastProps {
  toasts: MilestoneToast[];
  onDismiss: (id: string) => void;
}

export function QuietWinToastStack({ toasts, onDismiss }: QuietWinToastProps) {
  // Auto-dismiss after 4s
  useEffect(() => {
    if (toasts.length === 0) return;
    const t = setTimeout(() => onDismiss(toasts[0].id), 4000);
    return () => clearTimeout(t);
  }, [toasts, onDismiss]);

  return (
    <div className="fixed bottom-6 right-6 z-[1500] flex flex-col gap-3 items-end">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40, transition: { duration: 0.35 } }}
            transition={{ duration: 0.3, ease: [0.05, 0.7, 0.1, 1] }}
            className="flex items-center gap-3 bg-surface-container-highest ghost-border rounded-2xl px-5 py-3.5 max-w-xs"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            {/* Left legendary glow bar */}
            <div className="w-1 self-stretch rounded-full shrink-0" style={{ background: 'var(--color-legendary)', boxShadow: 'var(--shadow-glow-legendary)' }} />
            <p className="text-sm font-serif italic" style={{ color: 'var(--color-legendary)' }}>
              "{toast.message}"
            </p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §7.2 Momentum Arc — Dual-ring streak visualization
// ─────────────────────────────────────────────────────────────────────────────

interface MomentumArcProps {
  current: number;   // current streak (days)
  best: number;      // personal best streak
}

export function MomentumArc({ current, best }: MomentumArcProps) {
  const size  = 120;
  const cx    = size / 2;
  const cy    = size / 2;
  const outerR = 52;
  const innerR = 40;
  const strokeW = 4;

  const arc = (r: number, pct: number) => {
    const circ = 2 * Math.PI * r;
    return { circ, offset: circ * (1 - Math.min(pct, 1)) };
  };

  const outer = arc(outerR, 1);                                 // personal best reference ring
  const inner = arc(innerR, best > 0 ? current / best : current / 100);

  // Color: shifts primary → tertiary as streak approaches PB
  const ratio    = best > 0 ? Math.min(current / best, 1) : 0;
  const arcColor = ratio >= 1 ? 'var(--color-legendary)' : ratio > 0.7 ? 'var(--color-tertiary)' : 'var(--color-primary)';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="block overflow-visible">
          {/* Outer ring — personal best context */}
          <circle
            cx={cx} cy={cy} r={outerR}
            fill="none"
            strokeWidth={strokeW - 1}
            stroke="var(--color-surface-container-highest)"
            strokeDasharray={outer.circ}
            strokeDashoffset={0}
            opacity={0.3}
          />
          {/* Inner track */}
          <circle
            cx={cx} cy={cy} r={innerR}
            fill="none"
            strokeWidth={strokeW}
            stroke="var(--color-surface-container-highest)"
          />
          {/* Inner fill — current streak */}
          <circle
            cx={cx} cy={cy} r={innerR}
            fill="none"
            strokeWidth={strokeW}
            stroke={arcColor}
            strokeLinecap="round"
            strokeDasharray={inner.circ}
            strokeDashoffset={inner.offset}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: `stroke-dashoffset 400ms cubic-bezier(0.05,0.7,0.1,1)`,
              filter: `drop-shadow(0 0 6px ${arcColor === 'var(--color-legendary)' ? 'rgba(240,192,96,0.4)' : 'rgba(117,213,226,0.4)'})`,
            }}
          />
          {/* Personal best marker dot on outer ring */}
          {best > 0 && (
            <circle
              cx={cx}
              cy={cy - outerR}
              r={3}
              fill="var(--color-on-surface-dim)"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                opacity: 0.5,
              }}
            />
          )}
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif font-extrabold text-2xl leading-none" style={{ color: arcColor }}>
            {current}
          </span>
          <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-on-surface-dim mt-0.5">
            Day Streak
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs text-on-surface-dim">
          Best: <span className="text-on-surface-variant font-medium">{best} days</span>
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// §7.9 Focus Mode overlay wrapper
// ─────────────────────────────────────────────────────────────────────────────

export function FocusModeWrapper({ children, isFocusMode }: { children: React.ReactNode; isFocusMode: boolean }) {
  return (
    <div className={`transition-all duration-700 ${isFocusMode ? '[&>*:not([data-focus-primary])]:brightness-90' : ''}`}>
      {isFocusMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none fixed inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse at center, #080f11 0%, transparent 70%)', mixBlendMode: 'multiply' }}
        />
      )}
      {children}
    </div>
  );
}
