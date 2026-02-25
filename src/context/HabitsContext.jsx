import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getHabitCategoryClass } from '../utils/categories';

const STORAGE_KEY = 'discipline-tracker-habits';
const COMPLETIONS_KEY = 'discipline-tracker-completions';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const HabitsContext = createContext(null);

export function HabitsProvider({ children }) {
  const [habits, setHabits] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  const [completions, setCompletions] = useState(() => {
    try {
      const raw = localStorage.getItem(COMPLETIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return {};
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (_) {}
  }, [habits]);

  useEffect(() => {
    try {
      localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
    } catch (_) {}
  }, [completions]);

  const addHabit = useCallback(({ name, category }) => {
    const id = String(Date.now());
    setHabits((prev) => [...prev, { id, name: name.trim(), category: category || 'Health' }]);
    return id;
  }, []);

  const updateHabit = useCallback((id, { name, category }) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, name: name?.trim() ?? h.name, category: category ?? h.category } : h))
    );
  }, []);

  const deleteHabit = useCallback((id) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setCompletions((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((date) => {
        if (next[date][id] !== undefined) {
          const nextDate = { ...next[date] };
          delete nextDate[id];
          if (Object.keys(nextDate).length) next[date] = nextDate;
          else delete next[date];
        }
      });
      return next;
    });
  }, []);

  const toggleCompletion = useCallback((habitId, date = todayStr()) => {
    setCompletions((prev) => {
      const day = { ...(prev[date] || {}) };
      day[habitId] = !day[habitId];
      const next = { ...prev };
      next[date] = day;
      return next;
    });
  }, []);

  const isCompleted = useCallback(
    (habitId, date = todayStr()) => {
      return !!completions[date]?.[habitId];
    },
    [completions]
  );

  const getStreak = useCallback(
    (habitId) => {
      let streak = 0;
      let d = new Date();
      const today = todayStr();
      while (true) {
        const dateStr = d.toISOString().slice(0, 10);
        if (dateStr > today) {
          d.setDate(d.getDate() - 1);
          continue;
        }
        if (!completions[dateStr]?.[habitId]) break;
        streak++;
        d.setDate(d.getDate() - 1);
      }
      return streak;
    },
    [completions]
  );

  const getTodaysHabitsWithMeta = useCallback(() => {
    const date = todayStr();
    return habits.map((h) => ({
      ...h,
      categoryColor: getHabitCategoryClass(h.category),
      done: !!completions[date]?.[h.id],
      streak: getStreak(h.id),
      completedAt: completions[date]?.[h.id] ? new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : null,
    }));
  }, [habits, completions, getStreak]);

  return (
    <HabitsContext.Provider
      value={{
        habits,
        completions,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleCompletion,
        isCompleted,
        getStreak,
        getTodaysHabitsWithMeta,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
}

export function useHabits() {
  const ctx = useContext(HabitsContext);
  if (!ctx) throw new Error('useHabits must be used within HabitsProvider');
  return ctx;
}
