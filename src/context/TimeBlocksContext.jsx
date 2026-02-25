import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getBlockCategoryStyle } from '../utils/categories';

const STORAGE_KEY = 'discipline-tracker-timeblocks';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const TimeBlocksContext = createContext(null);

export function TimeBlocksProvider({ children }) {
  const [blocks, setBlocks] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks));
    } catch (_) {}
  }, [blocks]);

  const addBlock = useCallback(({ title, category, start, end, date = todayStr(), done = false }) => {
    const id = String(Date.now());
    setBlocks((prev) => [...prev, { id, title: title.trim(), category, start, end, date, done }]);
    return id;
  }, []);

  const updateBlock = useCallback((id, updates) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  }, []);

  const deleteBlock = useCallback((id) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const toggleBlockDone = useCallback((id) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, done: !b.done } : b))
    );
  }, []);

  const getBlocksForDate = useCallback(
    (date = todayStr()) => {
      return blocks
        .filter((b) => b.date === date)
        .sort((a, b) => a.start - b.start)
        .map((b) => {
          const style = getBlockCategoryStyle(b.category);
          const colorClass = style.bg.includes('/5') ? style.bg.replace('/5', '/10') : style.bg;
          return {
            ...b,
            color: colorClass,
            border: style.border,
          };
        });
    },
    [blocks]
  );

  const getTotalHoursForDate = useCallback(
    (date = todayStr()) => {
      return getBlocksForDate(date).reduce((sum, b) => sum + (b.end - b.start), 0);
    },
    [getBlocksForDate]
  );

  return (
    <TimeBlocksContext.Provider
      value={{
        blocks,
        addBlock,
        updateBlock,
        deleteBlock,
        toggleBlockDone,
        getBlocksForDate,
        getTotalHoursForDate,
      }}
    >
      {children}
    </TimeBlocksContext.Provider>
  );
}

export function useTimeBlocks() {
  const ctx = useContext(TimeBlocksContext);
  if (!ctx) throw new Error('useTimeBlocks must be used within TimeBlocksProvider');
  return ctx;
}
