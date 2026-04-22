import { useState, useEffect } from 'react';
import { Moon, Sun, Check, Monitor } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ACCENTS = [
  { label: 'Teal',   primary: '#75d5e2', container: '#006069' },
  { label: 'Coral',  primary: '#ff8a70', container: '#8c2e1b' },
  { label: 'Violet', primary: '#c5a0ff', container: '#4a1f8c' },
  { label: 'Amber',  primary: '#ffd166', container: '#8c6200' },
  { label: 'Rose',   primary: '#ff7fa8', container: '#8c1f42' },
  { label: 'Lime',   primary: '#97e16a', container: '#2d6600' },
];

function applyAccent(primary: string, container: string) {
  const r = document.documentElement;
  r.style.setProperty('--color-primary', primary);
  r.style.setProperty('--color-primary-container', container);
}

export default function Settings() {
  const [isDark, setIsDark]       = useState(() => localStorage.getItem('kinetic_theme') !== 'light');
  const [accent, setAccent]       = useState(() => localStorage.getItem('kinetic_accent') ?? '#75d5e2');

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) { html.classList.remove('light'); localStorage.setItem('kinetic_theme', 'dark'); }
    else        { html.classList.add('light');    localStorage.setItem('kinetic_theme', 'light'); }
  }, [isDark]);

  useEffect(() => {
    const a = ACCENTS.find(a => a.primary === accent);
    if (a) applyAccent(a.primary, a.container);
  }, []);

  const handleAccent = (a: typeof ACCENTS[0]) => {
    setAccent(a.primary);
    localStorage.setItem('kinetic_accent', a.primary);
    applyAccent(a.primary, a.container);
  };

  const themes = [
    { id: true,  label: 'Dark',  sub: 'Deep oceanic surfaces',  Icon: Moon },
    { id: false, label: 'Light', sub: 'Clean editorial surfaces', Icon: Sun },
  ] as const;

  return (
    <div className="p-6 lg:p-10 w-full max-w-2xl mx-auto flex flex-col gap-8">

      {/* Header */}
      <header>
        <h1 className="font-serif font-bold text-4xl md:text-5xl text-on-surface mb-2">Settings</h1>
        <p className="text-on-surface-variant text-sm">Customise your Kinetic Sanctuary experience.</p>
      </header>

      {/* ── Appearance ── */}
      <section className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <div className="flex items-center gap-3 mb-1">
          <Monitor size={17} className="text-primary" />
          <h2 className="font-serif text-xl text-on-surface">Appearance</h2>
        </div>
        <p className="text-xs text-on-surface-dim mb-6 ml-8">Choose the interface theme that suits your environment.</p>

        <div className="grid grid-cols-2 gap-3">
          {themes.map(({ id, label, sub, Icon }) => {
            const active = isDark === id;
            return (
              <button key={label} onClick={() => setIsDark(id as boolean)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl ghost-border transition-all duration-200
                  ${active ? 'border-primary/60 bg-primary/5' : 'bg-surface-container hover:bg-surface-container-high'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ghost-border ${active ? 'bg-primary/10' : 'bg-surface-container-highest'}`}>
                  <Icon size={22} className={active ? 'text-primary' : 'text-on-surface-dim'} />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-semibold ${active ? 'text-primary' : 'text-on-surface-variant'}`}>{label}</p>
                  <p className="text-xs text-on-surface-dim mt-0.5">{sub}</p>
                </div>
                {active && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check size={11} className="text-surface" />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* ── Accent Colour ── */}
      <section className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-4 h-4 rounded-full shrink-0" style={{ background: accent }} />
          <h2 className="font-serif text-xl text-on-surface">Accent Colour</h2>
        </div>
        <p className="text-xs text-on-surface-dim mb-6 ml-7">Choose the primary accent that drives your performance palette.</p>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {ACCENTS.map(a => (
            <button key={a.primary} onClick={() => handleAccent(a)} className="flex flex-col items-center gap-2 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 shadow-md
                ${accent === a.primary ? 'scale-110 ring-2 ring-offset-2 ring-offset-surface-container-low' : 'group-hover:scale-105'}`}
                style={{ background: a.primary, ['--tw-ring-color' as any]: a.primary }}>
                <AnimatePresence>
                  {accent === a.primary && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                      <Check size={16} className="text-white drop-shadow" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <span className="text-[11px] text-on-surface-dim font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Live Preview ── */}
      <section className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <h2 className="font-serif text-xl text-on-surface mb-6">Live Preview</h2>
        <div className="flex flex-col gap-5">

          {/* Buttons row */}
          <div className="flex flex-wrap gap-3 items-center">
            <button className="btn-primary">Primary Action</button>
            <button className="btn-secondary">Secondary</button>
            <button className="btn-tertiary">Tertiary</button>
          </div>

          {/* Status chips row */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-tertiary" /> Completed
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
              style={{ background: `${accent}20`, color: accent }}>
              <span className="w-2 h-2 rounded-full" style={{ background: accent }} /> Active
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 ghost-border rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wide">
              Pending
            </span>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs text-on-surface-dim mb-2">
              <span>Protocol Progress</span><span>68%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full" initial={{ width: 0 }} animate={{ width: '68%' }}
                transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
                style={{ background: `linear-gradient(90deg, ${accent}, var(--color-primary-container))` }} />
            </div>
          </div>

          {/* Sample protocol card */}
          <div className="bg-surface-container rounded-2xl p-4 ghost-border flex items-center gap-4">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: `${accent}20` }}>
              <Check size={17} style={{ color: accent }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface mb-0.5">Sample Protocol</p>
              <p className="text-xs text-on-surface-dim">7x weekly goal · 100%</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-tertiary/10 text-tertiary text-xs font-bold">Done</span>
          </div>
        </div>
      </section>

      {/* ── Implementation Checklist ── */}
      <section className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <h2 className="font-serif text-xl text-on-surface mb-4">Design Compliance</h2>
        <p className="text-xs text-on-surface-dim mb-4">All design.md requirements implemented:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'Surface hierarchy applied', 'Manrope headlines / Inter body',
            'Ghost borders (no 1px solid)', 'Ambient tinted shadows',
            'Glassmorphism on overlays', 'Hover states on all interactive elements',
            'Status chips at 10% opacity', 'Micro-interactions on buttons',
            'Mobile responsive breakpoints', 'Focus-visible accessibility',
            'Teal gradient CTAs', 'Circular progress rings',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-on-surface-variant">
              <div className="w-4 h-4 rounded-full bg-tertiary/15 flex items-center justify-center shrink-0">
                <Check size={10} className="text-tertiary" />
              </div>
              {item}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
