import { useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import { useHabits } from '../context/HabitContext';
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { format, subDays } from 'date-fns';
import { Activity, Target, Zap, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { Tooltip } from 'react-tooltip';

// ── Time period selector (spec §10) ──────────────────────────────────────
function PeriodSelector({ active, onChange }: { active: string; onChange: (p: string) => void }) {
  return (
    <div className="inline-flex gap-1.5 bg-surface-container-low p-1 rounded-xl">
      {['7D', '30D', '90D', '1Y'].map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${active === p ? 'bg-surface-container-highest text-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
          {p}
        </button>
      ))}
    </div>
  );
}

// ── Positive Correlation Insight Card (spec §8) ──────────────────────────
function InsightCard() {
  return (
    <div className="bg-surface-container-low rounded-2xl p-5 ghost-border flex gap-4 items-start">
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
        <Zap size={18} />
      </div>
      <div>
        <h3 className="font-serif text-base text-on-surface mb-1">Positive Correlation Detected</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Your Focus Score increases by <strong className="text-primary">0%</strong> on days you complete your Morning Protocol.
        </p>
        <button className="mt-3 text-xs font-semibold text-primary hover:underline flex items-center gap-1">
          View Regression Model <TrendingUp size={11} />
        </button>
      </div>
    </div>
  );
}

// ── Efficiency Distribution bars (spec §8) ───────────────────────────────
const EFFICIENCY_DATA = [
  { label: 'Deep Work',      pct: 0, qualifier: 'OPTIMAL',  color: 'var(--color-primary)' },
  { label: 'Light Tasks',    pct: 0, qualifier: '',          color: 'var(--color-secondary)' },
  { label: 'Administrative', pct: 0, qualifier: '',          color: 'var(--color-on-surface-dim)' },
];

function EfficiencySection() {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-surface-container-low rounded-2xl p-6 ghost-border">
      <h2 className="font-serif text-xl text-on-surface mb-1">Efficiency Distribution</h2>
      <p className="text-xs text-on-surface-dim mb-6 uppercase tracking-wider font-medium">Inferred from protocol completion patterns</p>
      <div className="flex flex-col gap-5">
        {EFFICIENCY_DATA.map(({ label, pct, qualifier, color }) => (
          <div key={label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface">{label}</span>
                {qualifier && <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-dim">{qualifier}</span>}
              </div>
              <span className="text-sm font-semibold" style={{ color }}>{pct}%</span>
            </div>
            <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="h-full rounded-full" style={{ background: color }} />
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

export default function Analytics() {
  const { entries, getHeatmapData } = useHabits();
  const [period, setPeriod] = useState('30D');

  const heatmapData = getHeatmapData();
  const today       = new Date();
  const startDate   = subDays(today, 48 * 7);
  const totalWins   = entries.filter(e => e.completed).length;

  const mockData = Array.from({ length: 14 }).map((_, i) => ({
    date: format(subDays(today, 13 - i), 'MMM dd'),
    exercise: +(Math.random() > 0.35),
    focusScore: Math.floor(Math.random() * 35 + 60),
  }));

  return (
    <div className="p-6 lg:p-10 w-full max-w-[1280px] mx-auto flex flex-col gap-8">

      {/* Header */}
      <header>
        <h1 className="font-serif font-bold text-4xl md:text-5xl text-on-surface mb-2">Performance Matrix</h1>
        <p className="text-on-surface-variant text-sm flex gap-3 items-center flex-wrap">
          Analyzing compounding velocity metrics
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
            <span className="w-2 h-2 rounded-full bg-primary" /> System Live
          </span>
        </p>
      </header>

      {/* ── Annual Momentum Heatmap (spec §5) ── */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
        className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h2 className="font-serif text-xl text-on-surface flex items-center gap-2">
              <Activity size={19} className="text-primary" /> Annual Momentum
            </h2>
            <p className="text-xs text-on-surface-dim mt-1 uppercase tracking-wider font-medium">Visualizing your baseline consistency for the year</p>
          </div>
          {/* Heatmap legend */}
          <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
            <span>Low Volume</span>
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-[2px] bg-[#1a2123]" title="Inactive" />
              <div className="w-3 h-3 rounded-[2px] bg-[#2b6e76]" title="Partial" />
              <div className="w-3 h-3 rounded-[2px] bg-primary" title="Consistent" />
              <div className="w-3 h-3 rounded-[2px] bg-tertiary" title="Exceptional" />
              <div className="w-3 h-3 rounded-[2px] bg-legendary shadow-glow-legendary" title="Legendary" />
            </div>
            <span>High Volume</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="min-w-[800px]">
            <CalendarHeatmap
              startDate={startDate} endDate={today} values={heatmapData}
              classForValue={(v: any) => !v || v.count === 0 ? 'heatmap-cell color-empty' : `heatmap-cell color-scale-${Math.min(v.count, 4)}`}
              showWeekdayLabels={true}
              tooltipDataAttrs={(v: any) => {
                if (!v?.date) return { 'data-tooltip-id': 'hm-tip', 'data-tooltip-content': 'No activity' } as any;
                return { 'data-tooltip-id': 'hm-tip', 'data-tooltip-content': `${v.count} protocols completed · ${v.date}` } as any;
              }}
            />
            <Tooltip id="hm-tip" className="z-50 !bg-surface-container-highest !text-on-surface !rounded-xl !text-xs !font-medium !px-3 !py-2" />
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-outline-variant/20 flex justify-between items-center text-xs text-on-surface-variant">
          <span>Total tracked nodes: <strong className="text-on-surface">{heatmapData.length} days</strong></span>
          <span>Total completions: <strong className="text-primary">{totalWins} verified</strong></span>
        </div>
      </motion.section>

      {/* ── §7.4 Resonance Map ── */}
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-surface-container-low rounded-2xl p-6 ghost-border">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <div>
            <h2 className="font-serif text-xl text-on-surface flex items-center gap-2">
              <Target size={19} className="text-secondary" /> The Resonance Map
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">Habit correlation — physical activity vs. mental focus</p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex gap-4 text-xs text-on-surface-variant">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-primary" />Physical Activity</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full" style={{ background: 'var(--color-secondary)' }} />Mental Focus</span>
            </div>
            <PeriodSelector active={period} onChange={setPeriod} />
          </div>
        </div>

        {/* §7.4 — Correlation coefficient display */}
        <div className="flex items-center gap-3 mb-5 px-1">
          <span className="font-serif font-bold text-3xl" style={{ color: 'var(--color-tertiary)' }}>0.00</span>
          <div>
            <p className="text-xs font-semibold text-on-surface">Positive Correlation</p>
            <p className="text-xs text-on-surface-dim">Exercise completion predicts focus score increase</p>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
              <defs>
                <linearGradient id="gPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#75d5e2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#75d5e2" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gSecondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#96ccff" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#96ccff" stopOpacity={0} />
                </linearGradient>
                {/* §7.4 intersection zone between lines */}
                <linearGradient id="gIntersect" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#75d5e2" stopOpacity={0.06} />
                  <stop offset="100%" stopColor="#96ccff" stopOpacity={0.06} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(63,73,73,0.35)" vertical={false} />
              <XAxis dataKey="date" stroke="#889393" fontSize={11} tickLine={false} axisLine={false} dy={8} />
              <YAxis yAxisId="l" stroke="#889393" fontSize={11} tickLine={false} axisLine={false} dx={8} />
              <YAxis yAxisId="r" orientation="right" stroke="#889393" fontSize={11} tickLine={false} axisLine={false} dx={-8} />
              <RechartsTooltip
                content={({ active, payload, label }: any) => {
                  if (!active || !payload?.length) return null;
                  return (
                    <div className="bg-surface-container-highest ghost-border rounded-xl px-4 py-3 text-xs"
                      style={{ boxShadow: 'var(--shadow-float)', backdropFilter: 'blur(12px)' }}>
                      <p className="text-on-surface-dim uppercase tracking-wider font-semibold mb-2">{label}</p>
                      {payload.map((p: any) => (
                        <p key={p.name} className="text-on-surface mb-1">
                          <span style={{ color: p.color }}>■ </span>{p.name}: <strong>{p.value}</strong>
                        </p>
                      ))}
                      <p className="mt-2 pt-2 border-t border-outline-variant/20">
                        Correlation: <strong style={{ color: 'var(--color-tertiary)' }}>0.00</strong>
                      </p>
                    </div>
                  );
                }}
              />
              {/* Intersection zone fill (§7.4) */}
              <Area yAxisId="r" type="monotone" dataKey="focusScore" stroke="none" fill="url(#gIntersect)" fillOpacity={1} dot={false} name="" legendType="none" />
              {/* Primary line */}
              <Area yAxisId="r" type="monotone" dataKey="focusScore" stroke="#75d5e2" strokeWidth={2.5} fill="url(#gPrimary)"
                dot={{ r: 3, fill: '#161d1f', stroke: '#75d5e2', strokeWidth: 2 }} name="Focus Yield"
                style={{ filter: 'drop-shadow(0 0 5px rgba(117,213,226,0.3))' }} />
              {/* Secondary line */}
              <Area yAxisId="l" type="monotone" dataKey="exercise" stroke="#96ccff" strokeWidth={2} fill="url(#gSecondary)"
                dot={{ r: 3, fill: '#161d1f', stroke: '#96ccff', strokeWidth: 2 }} name="Protocol Verified" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* ── Insight card + Efficiency Distribution (two-col on wide screens) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }} className="flex flex-col gap-4">
          <InsightCard />
          {/* Weekly matrix teaser */}
          <div className="bg-surface-container-low rounded-2xl p-5 ghost-border">
            <h3 className="font-serif text-base text-on-surface mb-4">This Week's Snapshot</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-on-surface-dim uppercase tracking-wider">
                    <th className="text-left pb-3 font-semibold">Protocol</th>
                    {['M','T','W','T','F','S','S'].map((d, i) => <th key={i} className="pb-3 font-semibold">{d}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {[
                    { name: 'Hydration',   days: [0,0,0,0,0,0,0] },
                    { name: 'Meditation',  days: [0,0,0,0,0,0,0] },
                    { name: 'Reading',     days: [0,0,0,0,0,0,0] },
                    { name: 'Daily Steps', days: [0,0,0,0,0,0,0] },
                  ].map(row => (
                    <tr key={row.name}>
                      <td className="py-2 pr-3 text-on-surface-variant font-medium truncate max-w-[80px]">{row.name}</td>
                      {row.days.map((d, i) => (
                        <td key={i} className="py-2 text-center">
                          {d ? <span className="text-tertiary font-bold">✓</span> : <span className="text-outline-variant">○</span>}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <EfficiencySection />
      </div>

    </div>
  );
}
