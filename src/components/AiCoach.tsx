/**
 * AI Coach Panel — §7.1 Kinetic Sanctuary Design System v3.0
 *
 * Conversational coaching surface built on Gemini 2.0 Flash.
 * Voice: calm authority, never generic, never gamified.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, ThumbsDown, RefreshCw, Lightbulb, Sparkles } from 'lucide-react';
import { generateCoachInsight, suggestNextHabit, type HabitSummary } from '../services/gemini';

// ── Three-dot thinking animation ─────────────────────────────────────────────
function ThinkingDots() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ background: 'var(--color-primary)' }}
          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

// ── Abstract geometric AI glyph ───────────────────────────────────────────────
function CoachGlyph({ isThinking }: { isThinking: boolean }) {
  return (
    <motion.div
      animate={isThinking ? { boxShadow: ['0 0 12px rgba(117,213,226,0.2)', '0 0 28px rgba(117,213,226,0.4)', '0 0 12px rgba(117,213,226,0.2)'] } : {}}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: 'linear-gradient(135deg, var(--color-primary-container) 0%, var(--color-surface-container-highest) 100%)' }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" stroke="var(--color-primary)" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="2.5" fill="var(--color-primary)" opacity="0.8" />
        <line x1="10" y1="4.5" x2="10" y2="7.5" stroke="var(--color-primary)" strokeWidth="1.2" opacity="0.5" />
        <line x1="10" y1="12.5" x2="10" y2="15.5" stroke="var(--color-primary)" strokeWidth="1.2" opacity="0.5" />
      </svg>
    </motion.div>
  );
}

interface AiCoachProps {
  summary: HabitSummary;
  existingHabits: string[];
}

export default function AiCoach({ summary, existingHabits }: AiCoachProps) {
  const [insight, setInsight]       = useState<string>('');
  const [suggestion, setSuggestion] = useState<string>('');
  const [isLoading, setIsLoading]   = useState(false);
  const [rating, setRating]         = useState<'up' | 'down' | null>(null);
  const [hasLoaded, setHasLoaded]   = useState(false);
  const [showSuggest, setShowSuggest] = useState(false);

  const fetchInsight = async () => {
    setIsLoading(true);
    setRating(null);
    setInsight('');
    try {
      const text = await generateCoachInsight(summary);
      setInsight(text);
      setHasLoaded(true);
    } catch (err: any) {
      if (err?.message?.includes('429') || err?.status === 429) {
        setInsight('The coaching engine is currently at capacity (Rate Limit). Please wait 60 seconds.');
      } else {
        setInsight('Unable to reach the coaching engine. Check your connection.');
      }
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestion = async () => {
    setShowSuggest(true);
    setSuggestion('');
    try {
      const s = await suggestNextHabit(existingHabits, summary.topCategory);
      setSuggestion(s);
    } catch (err: any) {
      if (err?.message?.includes('429') || err?.status === 429) {
        setSuggestion('Rate limit reached. Try again in a minute.');
      } else {
        setSuggestion('Unable to generate a suggestion right now.');
      }
    }
  };

  // Auto-load on mount
  useEffect(() => {
    if (summary.totalHabits > 0) fetchInsight();
  }, []);

  return (
    <section className="bg-surface-container-low rounded-2xl overflow-hidden ghost-border relative">

      {/* Coach Signal bar — §7.1 4px gradient left edge */}
      <div className="absolute top-0 left-0 bottom-0 w-[4px]"
        style={{ background: 'linear-gradient(180deg, var(--color-primary) 0%, var(--color-secondary) 100%)' }} />

      <div className="pl-6 pr-5 pt-5 pb-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CoachGlyph isThinking={isLoading} />
            <div>
              <h3 className="font-serif text-base text-on-surface font-semibold leading-none">AI Coach</h3>
              <p className="text-[10px] text-on-surface-dim uppercase tracking-wider mt-0.5 font-medium">Powered by Gemini</p>
            </div>
          </div>
          <button
            onClick={fetchInsight}
            disabled={isLoading}
            className="w-8 h-8 rounded-xl bg-surface-container-highest flex items-center justify-center text-on-surface-dim hover:text-primary transition-colors disabled:opacity-40"
            title="Refresh insight"
          >
            <motion.div animate={isLoading ? { rotate: 360 } : {}} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
              <RefreshCw size={13} />
            </motion.div>
          </button>
        </div>

        {/* Message bubble */}
        <div className="bg-surface-container-high rounded-xl p-4 mb-4 min-h-[72px]">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ThinkingDots />
              </motion.div>
            ) : insight ? (
              <motion.p
                key="insight"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="text-sm text-on-surface leading-relaxed"
              >
                {insight}
              </motion.p>
            ) : (
              <motion.p key="empty" className="text-sm text-on-surface-dim">
                {summary.totalHabits === 0
                  ? 'Add your first protocol to activate the coach.'
                  : 'Tap refresh to load your coaching insight.'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Rating row — §7.1 subtle thumbs, no gamification weight */}
        {hasLoaded && insight && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-on-surface-dim uppercase tracking-wider font-medium">Rate this insight</span>
            <div className="flex gap-2">
              <button
                onClick={() => setRating('up')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${rating === 'up' ? 'bg-tertiary/15 text-tertiary' : 'text-on-surface-dim hover:text-primary'}`}
                aria-label="Helpful"
              >
                <ThumbsUp size={13} />
              </button>
              <button
                onClick={() => setRating('down')}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${rating === 'down' ? 'bg-error/15 text-error' : 'text-on-surface-dim hover:text-error'}`}
                aria-label="Not helpful"
              >
                <ThumbsDown size={13} />
              </button>
            </div>
          </motion.div>
        )}

        {/* Suggest next habit */}
        <button
          onClick={fetchSuggestion}
          className="w-full flex items-center gap-2 justify-center py-2.5 rounded-xl ghost-border text-xs font-semibold text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all duration-200"
        >
          <Sparkles size={12} /> Suggest next protocol
        </button>

        {/* Suggestion bubble */}
        <AnimatePresence>
          {showSuggest && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 bg-surface-container-high rounded-xl p-3 flex items-start gap-3">
                <Lightbulb size={14} className="text-primary shrink-0 mt-0.5" />
                {suggestion ? (
                  <p className="text-sm font-semibold text-on-surface">{suggestion}</p>
                ) : (
                  <ThinkingDots />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
