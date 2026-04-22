import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Plus, X, Zap, ChevronRight, Check } from 'lucide-react';
import { useHabits } from '../context/HabitContext';
import { format } from 'date-fns';

export default function QuickEntryFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const { habits, toggleHabit } = useHabits();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleQuickComplete = (id: string) => {
    toggleHabit(id, today);
    // Auto-close after a short delay for feedback
    setTimeout(() => {
      setIsOpen(false);
      setSelectedId(null);
    }, 400);
  };

  return (
    <LayoutGroup>
      <div className="fixed bottom-20 right-6 z-[1000] md:bottom-10 md:right-10">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            <motion.button
              layoutId="fab-container"
              key="fab"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center shadow-glow-primary text-on-primary z-50 backdrop-blur-xl border border-white/20"
            >
              <motion.div layoutId="fab-icon">
                <Plus size={28} />
              </motion.div>
            </motion.button>
          ) : (
            <motion.div
              layoutId="fab-container"
              key="sheet"
              initial={{ borderRadius: '2rem', opacity: 0 }}
              animate={{ borderRadius: '1.5rem', opacity: 1 }}
              exit={{ borderRadius: '2rem', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-surface-container-highest glass-modal ghost-border w-[320px] max-h-[480px] overflow-hidden flex flex-col shadow-float absolute bottom-0 right-0"
            >
              {/* Header */}
              <div className="p-5 flex items-center justify-between border-b border-outline-variant/10">
                <div className="flex items-center gap-2">
                   <motion.div layoutId="fab-icon" className="text-primary">
                    <Zap size={18} fill="currentColor" />
                   </motion.div>
                   <h3 className="font-serif text-lg font-bold text-on-surface">Quick Protocol</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Habit Picker */}
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-dim px-2 mb-1">Select Protocol</p>
                {habits.length === 0 ? (
                  <p className="text-xs text-on-surface-dim p-4 italic text-center">No active protocols.</p>
                ) : (
                  habits.map(h => (
                    <button
                      key={h.id}
                      onClick={() => setSelectedId(h.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border text-left
                        ${selectedId === h.id 
                          ? 'bg-primary/10 border-primary/30 text-on-surface' 
                          : 'bg-surface-container-low border-transparent text-on-surface-variant hover:bg-surface-container-high'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${selectedId === h.id ? 'bg-primary text-on-primary' : 'bg-surface-container-highest'}`}>
                        <Zap size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{h.name}</p>
                        <p className="text-[10px] font-medium opacity-60">{h.category}</p>
                      </div>
                      {selectedId === h.id ? (
                        <Check size={14} className="text-primary" />
                      ) : (
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {/* Footer / Confirm */}
              <div className="p-4 bg-surface-container/50 border-t border-outline-variant/10">
                <button
                  disabled={!selectedId}
                  onClick={() => selectedId && handleQuickComplete(selectedId)}
                  className="w-full btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 py-3"
                >
                  <Check size={16} /> Initiate Completion
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}
