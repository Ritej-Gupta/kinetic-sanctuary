import React, { useState, useEffect, useRef } from 'react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import {
  Target, Check, Zap, Flame, X,
  Search, SlidersHorizontal, Plus, HelpCircle, Link2, Moon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { HabitCategory } from '../types';
import {
  MomentumArc, QuietWinToastStack, getMilestoneMessage,
  useTimeContext,
} from './KineticPrimitives';
import type { MilestoneToast } from './KineticPrimitives';
import AiCoach from './AiCoach';

// ── Category colour chips ─────────────────────────────────────────────────
const CAT_COLOR: Record<string, string> = {
  'Physical Health': 'bg-emerald-500/10 text-emerald-400',
  'Mental Clarity':  'bg-violet-500/10 text-violet-400',
  'Learning':        'bg-amber-500/10 text-amber-400',
  'Activity':        'bg-sky-500/10 text-sky-400',
  'Productivity':    'bg-primary/10 text-primary',
  'Financial':       'bg-yellow-500/10 text-yellow-400',
  'Wellness':        'bg-rose-500/10 text-rose-400',
  'Social':          'bg-pink-500/10 text-pink-400',
  'Other':           'bg-surface-variant text-on-surface-dim',
};

const ALL_CATEGORIES: HabitCategory[] = [
  'Physical Health', 'Mental Clarity', 'Learning', 'Activity',
  'Productivity', 'Financial', 'Wellness', 'Social', 'Other',
];

// ── Animated number counter ───────────────────────────────────────────────
function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let ts = 0;
    const dur = 1400;
    const tick = (now: number) => {
      if (!ts) ts = now;
      const prog = Math.min((now - ts) / dur, 1);
      const ease = 1 - Math.pow(2, -10 * prog);
      setDisplay(Math.floor(ease * value));
      if (prog < 1) requestAnimationFrame(tick);
      else setDisplay(value);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}{suffix}</>;
}



// ── Contextual Help bubble ────────────────────────────────────────────────
function HelpTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setShow(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  return (
    <div ref={ref} className="relative inline-flex">
      <button onClick={e => { e.stopPropagation(); setShow(v => !v); }} className="text-on-surface-dim hover:text-primary transition-colors">
        <HelpCircle size={14} />
      </button>
      <AnimatePresence>
        {show && (
          <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-surface-container-highest text-on-surface-variant text-xs rounded-xl p-3 z-50 leading-relaxed ghost-border shadow-lg">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-surface-container-highest" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────
function EmptyProtocols({ onAdd }: { onAdd: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
        <Zap size={34} className="text-primary opacity-50" />
      </div>
      <h3 className="font-serif text-2xl text-on-surface mb-2">No Protocols Yet</h3>
      <p className="text-on-surface-dim text-sm max-w-xs leading-relaxed mb-8">
        Define your first daily protocol to begin tracking momentum and building streaks.
      </p>
      <button onClick={onAdd} className="btn-primary flex items-center gap-2 px-6">
        <Plus size={15} /> Initiate First Protocol
      </button>
    </motion.div>
  );
}

// ── Focus Mode Card (spec §7) ─────────────────────────────────────────────
function FocusCard() {
  return (
    <div className="relative overflow-hidden bg-surface-container-lowest ghost-border rounded-2xl p-6">
      {/* Blur orb decoration */}
      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full pointer-events-none"
        style={{ background: 'rgba(0,96,105,0.25)', filter: 'blur(40px)' }} />

      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Zap size={20} />
        </div>
        <div>
          <h3 className="font-serif text-lg text-on-surface">Focus Mode</h3>
          <p className="text-xs text-on-surface-dim">Prepare your environment</p>
        </div>
      </div>

      <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
        Reduce friction by eliminating decision fatigue.
        Prepare your environment tonight for tomorrow's success.
      </p>

      <div className="space-y-3 mb-5">
        {['Device Notifications Disabled', 'Workspace Cleared', 'Water Prepared'].map(label => (
          <label key={label} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative w-5 h-5 rounded-[4px] ghost-border bg-surface-container-highest transition-colors group-hover:border-primary shrink-0 flex items-center justify-center">
              <input type="checkbox" className="peer absolute opacity-0 w-full h-full cursor-pointer" />
              <Check size={11} className="text-transparent peer-checked:text-primary transition-colors" />
            </div>
            <span className="text-sm text-on-surface-variant">{label}</span>
          </label>
        ))}
      </div>

      <button className="btn-secondary w-full">Review Evening Routine</button>
    </div>
  );
}

// ── Habit Stacking Card (spec §6) ─────────────────────────────────────────
function StackCard({ trigger, action }: { trigger: string; action: string }) {
  return (
    <div className="bg-surface-container-lowest ghost-border rounded-xl p-4 transition-all duration-300 hover:[border-color:rgba(150,204,255,0.3)]">
      {/* Trigger */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
          <span className="text-secondary text-sm">☕</span>
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-dim">Trigger</p>
          <p className="text-sm text-on-surface-variant">{trigger}</p>
        </div>
      </div>

      {/* Connector line */}
      <div className="ml-4 my-2 relative">
        <div className="h-6 w-[1px] bg-gradient-to-b from-secondary/60 via-primary/40 to-transparent mx-auto" />
        <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-surface-container-lowest mx-auto -mt-1" />
      </div>

      {/* Action */}
      <div className="flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <span className="text-primary text-sm">⚡</span>
        </span>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-on-surface-dim">Execute</p>
          <p className="text-sm font-semibold text-on-surface">{action}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export default function Dashboard({ onNavigateHabits: _onNav }: { onNavigateHabits?: () => void }) {
  const { habits, entries, toggleHabit, stackedPrompts, addHabit } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { isFocusMode } = useTimeContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName]         = useState('');
  const [newCat, setNewCat]           = useState<HabitCategory>('Productivity');
  const [newTarget, setNewTarget]     = useState(7);
  const [searchQ, setSearchQ]         = useState('');
  const [filterCat, setFilterCat]     = useState('All');
  const [filterSt, setFilterSt]       = useState<'All' | 'Completed' | 'Pending'>('All');
  const [showFilters, setShowFilters] = useState(false);
  const [toasts, setToasts]           = useState<MilestoneToast[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);

  const streak      = 0;
  const personalBest = 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addHabit({ name: newName.trim(), category: newCat, weeklyTarget: newTarget });
    setNewName(''); setIsModalOpen(false);
  };

  // §7.8 Quiet Win — replaces confetti
  const fireQuietWin = (currentStreak: number) => {
    const msg = getMilestoneMessage(currentStreak);
    if (!msg) return;
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message: msg }]);
  };

  const handleToggle = (id: string, done: boolean) => {
    // §5 — check-in micro-animation
    setCompletingId(id);
    setTimeout(() => setCompletingId(null), 450);
    toggleHabit(id, today);
    if (!done) fireQuietWin(streak); // milestone check
  };

  const todayDone  = entries.filter(e => e.date === today && e.completed).map(e => e.habitId);
  const progress   = habits.length === 0 ? 0 : Math.round((todayDone.length / habits.length) * 100);

  const allCats    = ['All', ...Array.from(new Set(habits.map(h => h.category)))];
  const filtered   = habits.filter(h => {
    const done = todayDone.includes(h.id);
    const q    = h.name.toLowerCase().includes(searchQ.toLowerCase()) || h.category.toLowerCase().includes(searchQ.toLowerCase());
    const cat  = filterCat === 'All' || h.category === filterCat;
    const st   = filterSt === 'All' ? true : filterSt === 'Completed' ? done : !done;
    return q && cat && st;
  });

  return (
    <div className="p-6 lg:p-10 w-full max-w-[1400px] mx-auto flex flex-col xl:flex-row gap-8 xl:gap-10 relative">
      {/* Quiet Win toasts (§7.8) */}
      <QuietWinToastStack toasts={toasts} onDismiss={id => setToasts(p => p.filter(t => t.id !== id))} />

      {/* ── CENTER COLUMN ── */}
      <div className="flex-1 min-w-0 flex flex-col gap-8 order-2 xl:order-1">
        
        {/* §7.9 Focus Mode specialized view Reordering */}
        {isFocusMode && (
          <div className="flex flex-col gap-8 order-1">
             <section className="bg-surface-container-low rounded-2xl p-6 ghost-border relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Moon size={40} /></div>
                <h2 className="font-serif text-xl text-on-surface mb-3 flex items-center gap-2">
                  <Flame size={19} className="text-secondary" /> Tonight's Wrap
                </h2>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-surface-container-high p-4 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-on-surface-dim mb-1">Protocols Cleared</p>
                    <p className="text-2xl font-serif font-bold text-tertiary">{todayDone.length}</p>
                  </div>
                  <div className="bg-surface-container-high p-4 rounded-xl">
                    <p className="text-[10px] uppercase font-bold text-on-surface-dim mb-1">Remaining</p>
                    <p className="text-2xl font-serif font-bold text-primary">{habits.length - todayDone.length}</p>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant mt-6 leading-relaxed">
                  Focus Mode is active. Systems are dimmed for recovery. 
                  {todayDone.length === habits.length ? " All protocols cleared. Identity confirmed." : " Finalize remaining protocols before full shutdown."}
                </p>
             </section>
          </div>
        )}

        {/* Momentum & Progress (Visual Heart) */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isFocusMode ? 'order-2' : ''}`}>
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-low rounded-2xl p-6 ghost-border relative overflow-hidden flex flex-col items-center justify-center min-h-[220px]">
             <MomentumArc current={streak} best={personalBest} />
          </motion.div>
          
          {/* Metric Cards (spec §3) */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { label: 'Current Streak', val: streak,   suffix: '', unit: 'Days',     color: '#96ccff', icon: <Flame size={18} />, grad: 'from-secondary/6' },
              { label: 'Total Velocity', val: progress,  suffix: '%', unit: 'Weekly', color: '#7ddc7a', icon: <Check size={18} />, grad: 'from-tertiary/6' },
            ].map((card, i) => (
              <motion.div key={card.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                className="bg-surface-container-low rounded-2xl p-6 ghost-border relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-b ${card.grad} to-transparent pointer-events-none`} />
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center mb-4" style={{ color: card.color }}>
                  {card.icon}
                </div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-on-surface-dim mb-4">{card.label}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-serif font-bold text-5xl leading-none" style={{ color: card.color }}>
                      <Counter value={card.val} suffix={card.suffix} />
                    </span>
                    <span className="ml-2 text-sm text-on-surface-variant">{card.unit}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Protocols List (Deep Work Area) */}
        <section className={`transition-opacity duration-700 ${isFocusMode ? 'order-0' : ''}`}>
           <div className="flex items-center justify-between mb-4">
             <div className="flex items-center gap-2">
                <Zap size={18} className="text-primary" />
                <h2 className="font-serif text-xl text-on-surface font-semibold tracking-tight">Active Protocols</h2>
             </div> <HelpTooltip text="Click any card to mark it complete. Milestone streaks trigger an editorial achievement notification." />
            </div>
            <button onClick={() => setShowFilters(v => !v)}
              className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${showFilters ? 'bg-primary/10 text-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
              <SlidersHorizontal size={13} /> Filters
            </button>

          {/* Search + filter row */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                <div className="flex flex-col sm:flex-row gap-3 pb-1">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-dim pointer-events-none" />
                    <input type="text" placeholder="Search protocols…" value={searchQ} onChange={e => setSearchQ(e.target.value)}
                      className="w-full bg-surface-container-high pl-9 pr-4 py-2.5 rounded-xl text-sm text-on-surface placeholder:text-on-surface-dim focus:outline-none ghost-border focus:border-primary transition-all" />
                  </div>
                  <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
                    className="bg-surface-container-high px-4 py-2.5 rounded-xl text-sm text-on-surface focus:outline-none ghost-border appearance-none cursor-pointer">
                    {allCats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="flex rounded-xl overflow-hidden ghost-border text-xs font-semibold">
                    {(['All', 'Pending', 'Completed'] as const).map(s => (
                      <button key={s} onClick={() => setFilterSt(s)}
                        className={`px-4 py-2.5 transition-colors ${filterSt === s ? 'bg-primary text-surface' : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cards */}
          {habits.length === 0 ? <EmptyProtocols onAdd={() => setIsModalOpen(true)} />
            : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center py-14 text-center">
                <Search size={30} className="text-on-surface-dim mb-4 opacity-40" />
                <p className="text-on-surface-variant text-sm mb-3">No protocols match your filter.</p>
                <button onClick={() => { setSearchQ(''); setFilterCat('All'); setFilterSt('All'); }} className="text-primary text-xs font-semibold hover:underline">Clear filters</button>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((habit, i) => {
                    const entry = entries.find(e => e.habitId === habit.id && e.date === today);
                    const currentVal = entry?.value || 0;
                    const dailyTarget = habit.dailyTarget || 1;
                    const pct = Math.min((currentVal / dailyTarget) * 100, 150); // cap at 150% visual width
                    const done = entry?.completed || false;
                    const overachieved = currentVal > dailyTarget;
                    const catCls = CAT_COLOR[habit.category] ?? CAT_COLOR['Other'];
                    
                    return (
                      <motion.div key={habit.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04, duration: 0.28 }}
                        onClick={e => { e.stopPropagation(); handleToggle(habit.id, done); }}
                        className={`bg-surface-container rounded-xl p-4 flex flex-col gap-3 cursor-pointer ghost-border hover:[background-color:var(--color-surface-container-high)] transition-all duration-200 relative overflow-hidden group`}>

                        {/* Left accent bar */}
                        <div className={`absolute top-0 left-0 bottom-0 w-[3px] rounded-l-xl transition-all duration-300 ${done ? 'bg-tertiary' : 'bg-transparent group-hover:bg-primary'}`} />

                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-4">
                            {/* Icon — §5 check-in micro-animation */}
                            <motion.div
                              animate={completingId === habit.id ? { scale: [1, 1.15, 1] } : {}}
                              transition={{ duration: 0.35, ease: [0.05, 0.7, 0.1, 1] }}
                              className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${done ? 'bg-tertiary/15 text-tertiary animate-checkin-glow' : 'bg-surface-container-highest text-on-surface-dim group-hover:text-primary'}`}>
                              {done ? <Check size={17} /> : <Zap size={17} />}
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <h4 className={`text-base font-semibold truncate ${done ? 'line-through text-on-surface-dim' : 'text-on-surface'}`}>{habit.name}</h4>
                                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${catCls}`}>{habit.category}</span>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold text-on-surface-dim">
                                {habit.weeklyTarget && <span className="flex items-center gap-1"><Target size={10} /> {habit.weeklyTarget}x / week</span>}
                              </div>
                            </div>
                          </div>

                          {/* Target Chip (§7.5) */}
                          <div className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-500
                            ${done ? 'bg-tertiary/10 text-tertiary' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                            {done ? 'Target Achieved' : `Goal: ${dailyTarget}`}
                          </div>
                        </div>

                        {/* §7.5 Protocol Bar */}
                        <div className="flex flex-col gap-2">
                          <div className="w-full h-[6px] bg-surface-container-highest rounded-full overflow-hidden relative">
                            <motion.div 
                              initial={false} 
                              animate={{ 
                                width: `${Math.min(pct, 100)}%`,
                                background: done 
                                  ? (overachieved ? 'var(--color-legendary)' : 'var(--color-tertiary)') 
                                  : 'linear-gradient(90deg, var(--color-primary-container), var(--color-primary))'
                              }} 
                              transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
                              className={`h-full rounded-full transition-shadow duration-500 ${overachieved ? 'shadow-glow-legendary' : (done ? 'shadow-glow-tertiary' : '')}`}
                            />
                            {/* Overachieve pulse (§7.5) */}
                            {overachieved && (
                              <motion.div 
                                className="absolute top-0 h-full w-1 bg-white/40 rounded-full"
                                animate={{ left: [`${Math.min(pct, 100)}%`, '0%'], opacity: [0, 1, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                              />
                            )}
                          </div>
                          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                            <span className={done ? 'text-tertiary' : 'text-on-surface-variant'}>
                              {currentVal} / {dailyTarget} {habit.unit || 'units'}
                            </span>
                            <span className={done ? 'text-tertiary' : 'text-on-surface-dim'}>
                              {Math.round(pct)}%
                            </span>
                          </div>
                        </div>

                        {/* CTA / Quick Actions if numeric */}
                        {!done && habit.dailyTarget && habit.dailyTarget > 1 && (
                           <div className="flex items-center gap-2 mt-1">
                              <button 
                                onClick={e => { e.stopPropagation(); handleToggle(habit.id, done); }}
                                className="text-[10px] text-primary font-bold uppercase tracking-wider py-1 px-3 ghost-border rounded-lg bg-surface-container-low hover:bg-surface-container-highest transition-all"
                              >
                                +1 {habit.unit || ''}
                              </button>
                           </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )
          }
        </section>
      </div>

      {/* ── RIGHT SIDEBAR ── */}
      <aside className="w-full xl:w-80 flex flex-col gap-8 order-1 xl:order-2">
        
        {/* Focus Mode Card (spec §7) */}
        {!isFocusMode && <FocusCard />}

        {/* Habit Stacking (spec §6) */}
        {stackedPrompts.length > 0 && (
          <section className="bg-surface-container-low rounded-2xl p-5 ghost-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-5 relative z-10">
              <Link2 size={15} className="text-secondary" />
              <h3 className="font-serif text-base font-semibold text-on-surface">Habit Stacking</h3>
              <HelpTooltip text="Habit stacking links a new behaviour to an existing one for faster habit adoption." />
            </div>
            <div className="flex flex-col gap-5 relative z-10">
              {stackedPrompts.map((p, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <StackCard trigger={p.trigger} action={p.action} />
                  <button className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-1 ml-10">
                    <Plus size={10} /> Link Habit
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* §7.9 Focus Mode — Today's Wrap (visible after 7pm) */}
        {isFocusMode && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-surface-container-lowest rounded-2xl p-5 ghost-border relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: 'rgba(192,132,252,0.08)', filter: 'blur(32px)', transform: 'translate(30%, -30%)' }} />
            <div className="flex items-center gap-2 mb-4">
              <Moon size={15} className="text-on-surface-dim" />
              <h3 className="font-serif text-base font-semibold text-on-surface">Today's Wrap</h3>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-on-surface-variant">Protocols completed</span>
                <span className="font-serif font-bold text-xl" style={{ color: todayDone.length === habits.length && habits.length > 0 ? 'var(--color-tertiary)' : 'var(--color-on-surface)' }}>
                  {todayDone.length}<span className="text-sm font-normal text-on-surface-dim">/{habits.length}</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: habits.length > 0 ? `${(todayDone.length / habits.length) * 100}%` : '0%' }}
                  transition={{ duration: 0.8, ease: [0.05, 0.7, 0.1, 1] }}
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, var(--color-primary-container), var(--color-primary))' }}
                />
              </div>
              <p className="text-xs text-on-surface-dim leading-relaxed mt-1">
                {todayDone.length === habits.length && habits.length > 0
                  ? 'All protocols completed. Prepare for tomorrow.'
                  : `${habits.length - todayDone.length} remaining. You still have time tonight.`}
              </p>
            </div>
          </motion.section>
        )}

        {/* §7.1 AI Coach Panel */}
        <AiCoach
          summary={{
            totalHabits: habits.length,
            completedToday: todayDone.length,
            streak,
            topCategory: habits.length > 0 ? (habits[0].category ?? 'Productivity') : 'Productivity',
            completionRate: progress,
          }}
          existingHabits={habits.map(h => h.name)}
        />

      </aside>

      {/* ── Add Protocol Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-modal w-full max-w-md rounded-2xl p-6 ghost-border"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-on-surface">New Protocol</h2>
                <button onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">Protocol Name</label>
                  <input type="text" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Read 10 pages"
                    className="w-full bg-surface-container-lowest ghost-border rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary transition-colors text-sm"
                    autoFocus />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">Category</label>
                  <select value={newCat} onChange={e => setNewCat(e.target.value as HabitCategory)}
                    className="w-full bg-surface-container-lowest ghost-border rounded-xl p-3 text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer text-sm">
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">
                    Weekly Target — <span className="text-primary normal-case tracking-normal">{newTarget}× / week</span>
                  </label>
                  <input type="range" min={1} max={7} value={newTarget} onChange={e => setNewTarget(+e.target.value)}
                    className="w-full accent-[var(--color-primary)] cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-on-surface-dim mt-1">{[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}</div>
                </div>
                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">Initiate</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
