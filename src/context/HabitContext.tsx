import React, { createContext, useContext, useEffect, useState } from 'react';
import type { HabitData, HabitEntry, DayData } from '../types';
import { format, subDays } from 'date-fns';

interface HabitContextProps {
  habits: HabitData[];
  entries: HabitEntry[];
  addHabit: (habit: Omit<HabitData, 'id' | 'createdAt'>) => void;
  editHabit: (id: string, updates: Partial<Omit<HabitData, 'id' | 'createdAt'>>) => void;
  deleteHabit: (id: string) => void;
  toggleHabit: (habitId: string, date: string) => void;
  updateEntryValue: (habitId: string, date: string, value: number) => void;
  getHeatmapData: () => DayData[];
  getCompletionRate: (habitId: string) => number;
  stackedPrompts: Array<{ trigger: string; action: string }>;
}

const HabitContext = createContext<HabitContextProps | undefined>(undefined);

const PRELOADED_HABITS: HabitData[] = [];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<HabitData[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : PRELOADED_HABITS;
  });

  const [entries, setEntries] = useState<HabitEntry[]>(() => {
    const saved = localStorage.getItem('entries');
    return saved ? JSON.parse(saved) : [];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('entries', JSON.stringify(entries));
  }, [entries]);

  const addHabit = (habitData: Omit<HabitData, 'id' | 'createdAt'>) => {
    const newHabit: HabitData = {
      ...habitData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    setHabits(prev => [...prev, newHabit]);
  };

  const editHabit = (id: string, updates: Partial<Omit<HabitData, 'id' | 'createdAt'>>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  };

  const deleteHabit = (id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setEntries(prev => prev.filter(e => e.habitId !== id));
  };

  const toggleHabit = (habitId: string, date: string) => {
    const habit = habits.find(h => h.id === habitId);
    setEntries((prev) => {
      const existingKey = prev.findIndex(e => e.habitId === habitId && e.date === date);
      if (existingKey >= 0) {
        const updated = [...prev];
        const currentEntry = updated[existingKey];
        
        // If it has a daily target (numeric protocol §7.5), increment it
        if (habit?.dailyTarget && habit.dailyTarget > 1) {
          const newVal = (currentEntry.value || 0) + 1;
          updated[existingKey] = { 
            ...currentEntry, 
            value: newVal,
            completed: newVal >= habit.dailyTarget 
          };
        } else {
          // Boolean toggle
          updated[existingKey] = { 
            ...currentEntry, 
            completed: !currentEntry.completed,
            value: currentEntry.completed ? 0 : 1
          };
        }
        return updated;
      } else {
        // Add new entry
        const newVal = 1;
        return [...prev, { 
          habitId, 
          date, 
          completed: habit?.dailyTarget ? newVal >= habit.dailyTarget : true,
          value: newVal
        }];
      }
    });
  };

  const updateEntryValue = (habitId: string, date: string, value: number) => {
    const habit = habits.find(h => h.id === habitId);
    setEntries((prev) => {
      const existingKey = prev.findIndex(e => e.habitId === habitId && e.date === date);
      if (existingKey >= 0) {
        const updated = [...prev];
        updated[existingKey] = { 
          ...updated[existingKey], 
          value,
          completed: habit?.dailyTarget ? value >= habit.dailyTarget : true 
        };
        return updated;
      } else {
        return [...prev, { 
          habitId, 
          date, 
          completed: habit?.dailyTarget ? value >= habit.dailyTarget : true,
          value 
        }];
      }
    });
  };

  const getHeatmapData = (): DayData[] => {
    // Generate data for the last 365 days based on entries
    const daysMap = new Map<string, number>();
    
    entries.forEach(entry => {
      if (entry.completed) {
        const d = entry.date;
        daysMap.set(d, (daysMap.get(d) || 0) + 1);
      }
    });

    const heatmapData: DayData[] = [];
    for (let i = 365; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      heatmapData.push({ date: d, count: daysMap.get(d) || 0 });
    }
    
    return heatmapData;
  };

  const getCompletionRate = (habitId: string) => {
    const habitEntries = entries.filter(e => e.habitId === habitId && e.completed);
    return habitEntries.length; // Placeholder for more complex calculation later
  };

  // Derive "Habit Stacks" to show as prompts
  const stackedPrompts = habits
    .filter(h => h.stackedOnId)
    .map(h => {
      const parent = habits.find(p => p.id === h.stackedOnId);
      return {
        trigger: parent ? parent.name : 'an existing habit',
        action: h.name
      };
    });

  return (
    <HabitContext.Provider value={{ habits, entries, addHabit, editHabit, deleteHabit, toggleHabit, updateEntryValue, getHeatmapData, getCompletionRate, stackedPrompts }}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
};
