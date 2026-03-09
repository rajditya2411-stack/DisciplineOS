import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-missed-logs';

const MissedLogsContext = createContext(null);

export function MissedLogsProvider({ children }) {
  const [missedReasons, setMissedReasons] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(missedReasons));
  }, [missedReasons]);

  const addReason = useCallback((taskId, taskName, date, reason, taskType = 'habit') => {
    const newRecord = {
      id: String(Date.now()),
      taskId,
      taskName,
      date,
      reason: reason.trim(),
      taskType,
      createdAt: new Date().toISOString()
    };
    setMissedReasons(prev => [newRecord, ...prev]);
  }, []);

  const updateReason = useCallback((id, reason) => {
    setMissedReasons(prev => 
      prev.map(r => r.id === id ? { ...r, reason: reason.trim() } : r)
    );
  }, []);

  const deleteReason = useCallback((id) => {
    setMissedReasons(prev => prev.filter(r => r.id !== id));
  }, []);

  const getReasonsForTask = useCallback((taskId, date) => {
    return missedReasons.filter(r => r.taskId === taskId && r.date === date);
  }, [missedReasons]);

  return (
    <MissedLogsContext.Provider value={{ 
      missedReasons, 
      addReason, 
      updateReason, 
      deleteReason,
      getReasonsForTask
    }}>
      {children}
    </MissedLogsContext.Provider>
  );
}

export function useMissedLogs() {
  const ctx = useContext(MissedLogsContext);
  if (!ctx) throw new Error('useMissedLogs must be used within MissedLogsProvider');
  return ctx;
}
