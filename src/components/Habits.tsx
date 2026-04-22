import React, { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';
import { Plus, Pencil, Trash2, Check, X, Target, Zap, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { HabitCategory } from '../types';
import confetti from 'canvas-confetti';

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

interface HabitForm { name: string; category: HabitCategory; weeklyTarget: number; }
const EMPTY: HabitForm = { name: '', category: 'Productivity', weeklyTarget: 7 };

export default function Habits() {
  const { habits, entries, addHabit, editHabit, deleteHabit, getCompletionRate } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [mode, setMode]           = useState<'add' | 'edit'>('add');
  const [isOpen, setIsOpen]       = useState(false);
  const [editId, setEditId]       = useState<string | null>(null);
  const [form, setForm]           = useState<HabitForm>(EMPTY);
  const [delConfirm, setDelConfirm] = useState<string | null>(null);

  const todayDone = entries.filter(e => e.date === today && e.completed).map(e => e.habitId);

  const openAdd = () => { setMode('add'); setForm(EMPTY); setIsOpen(true); };
  const openEdit = (id: string) => {
    const h = habits.find(h => h.id === id);
    if (!h) return;
    setMode('edit'); setEditId(id);
    setForm({ name: h.name, category: h.category as HabitCategory, weeklyTarget: h.weeklyTarget ?? 7 });
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (mode === 'add') {
      addHabit({ name: form.name.trim(), category: form.category, weeklyTarget: form.weeklyTarget });
      confetti({ particleCount: 70, spread: 55, origin: { y: 0.55 }, colors: ['#75d5e2', '#7ddc7a'] });
    } else if (editId) {
      editHabit(editId, { name: form.name.trim(), category: form.category, weeklyTarget: form.weeklyTarget });
    }
    setIsOpen(false); setEditId(null);
  };

  return (
    <div className="p-6 lg:p-10 w-full max-w-3xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-on-surface mb-2">Protocols</h1>
          <p className="text-on-surface-variant text-sm">
            {habits.length} active · {todayDone.length} completed today
          </p>
        </div>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
          onClick={openAdd} className="btn-primary flex items-center gap-2 shrink-0">
          <Plus size={15} /> New Protocol
        </motion.button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total',       val: habits.length,                              icon: <Zap size={14} className="text-primary" /> },
          { label: "Today's Wins", val: todayDone.length,                          icon: <Check size={14} className="text-tertiary" /> },
          { label: 'All Entries', val: entries.filter(e => e.completed).length,    icon: <BarChart2 size={14} className="text-secondary" /> },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-low rounded-2xl p-4 ghost-border flex flex-col gap-2">
            <div className="flex items-center gap-1.5 text-[10px] text-on-surface-dim uppercase tracking-wider font-semibold">
              {s.icon} {s.label}
            </div>
            <span className="font-serif font-bold text-3xl text-on-surface">{s.val}</span>
          </div>
        ))}
      </div>

      {/* Protocol list */}
      {habits.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-surface-container-high ghost-border flex items-center justify-center mb-6">
            <Zap size={34} className="text-primary opacity-50" />
          </div>
          <h3 className="font-serif text-2xl text-on-surface mb-2">No Protocols Yet</h3>
          <p className="text-on-surface-dim text-sm mb-8 max-w-xs leading-relaxed">
            Click "New Protocol" to add your first daily habit and start building momentum.
          </p>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2 px-6">
            <Plus size={15} /> Add First Protocol
          </button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {habits.map((habit, i) => {
              const done      = todayDone.includes(habit.id);
              const total     = getCompletionRate(habit.id);
              const catCls    = CAT_COLOR[habit.category] ?? CAT_COLOR['Other'];
              const isDeleting = delConfirm === habit.id;

              return (
                <motion.div key={habit.id} layout
                  initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -36, scale: 0.96 }}
                  transition={{ delay: i * 0.03, duration: 0.28 }}
                  className="bg-surface-container-low rounded-2xl ghost-border overflow-hidden transition-all duration-200 hover:[background-color:var(--color-surface-container)]">

                  {/* Main row */}
                  <div className="flex items-center gap-4 p-4">
                    {/* Status dot */}
                    <div className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${done ? 'bg-tertiary/15 text-tertiary' : 'bg-surface-container-high text-on-surface-dim'}`}>
                      {done ? <Check size={16} /> : <Zap size={16} />}
                    </div>

                    {/* Info block */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`font-semibold text-base ${done ? 'line-through text-on-surface-dim' : 'text-on-surface'}`}>
                          {habit.name}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${catCls}`}>
                          {habit.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-dim">
                        {habit.weeklyTarget && (
                          <span className="flex items-center gap-1"><Target size={10} /> {habit.weeklyTarget}× / week</span>
                        )}
                        <span>{total} completions</span>
                        <span>Since {format(new Date(habit.createdAt), 'MMM d')}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button onClick={() => openEdit(habit.id)}
                        className="w-8 h-8 rounded-xl ghost-border bg-surface-container flex items-center justify-center text-on-surface-dim hover:text-primary hover:border-primary/40 transition-all"
                        title="Edit">
                        <Pencil size={13} />
                      </button>
                      <button onClick={() => setDelConfirm(isDeleting ? null : habit.id)}
                        className="w-8 h-8 rounded-xl ghost-border bg-surface-container flex items-center justify-center text-on-surface-dim hover:text-error hover:border-error/20 transition-all"
                        title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Inline delete confirmation */}
                  <AnimatePresence>
                    {isDeleting && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="px-4 pb-4 pt-3 flex items-center gap-3 bg-error/5 border-t border-error/10">
                          <p className="text-sm text-error flex-1">Delete "{habit.name}" and all its history?</p>
                          <button onClick={() => { deleteHabit(habit.id); setDelConfirm(null); }}
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-error/15 text-error hover:bg-error/25 transition-colors">
                            Delete
                          </button>
                          <button onClick={() => setDelConfirm(null)}
                            className="btn-secondary px-3 py-1.5 text-xs rounded-xl">
                            Cancel
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-surface-dim/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              className="glass-modal ghost-border w-full max-w-md rounded-2xl p-6"
              onClick={e => e.stopPropagation()}>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-on-surface">
                  {mode === 'add' ? 'New Protocol' : 'Edit Protocol'}
                </h2>
                <button onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full ghost-border bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors">
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                {/* Name */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">Protocol Name</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Read 10 pages"
                    className="w-full bg-surface-container-lowest ghost-border rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors"
                    autoFocus />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as HabitCategory }))}
                    className="w-full bg-surface-container-lowest ghost-border rounded-xl p-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer">
                    {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Weekly target */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-on-surface-dim mb-2 font-semibold">
                    Weekly Target — <span className="text-primary normal-case tracking-normal">{form.weeklyTarget}× / week</span>
                  </label>
                  <input type="range" min={1} max={7} value={form.weeklyTarget}
                    onChange={e => setForm(f => ({ ...f, weeklyTarget: +e.target.value }))}
                    className="w-full accent-[var(--color-primary)] cursor-pointer" />
                  <div className="flex justify-between text-[10px] text-on-surface-dim mt-1">
                    {[1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
                  </div>
                </div>

                <div className="flex gap-3 mt-2">
                  <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{mode === 'add' ? 'Initiate' : 'Save Changes'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
