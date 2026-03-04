import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-notes';

const NotesContext = createContext(null);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function NotesProvider({ children }) {
  const [notes, setNotes] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const addNote = useCallback((text, date = todayStr()) => {
    const newNote = {
      id: String(Date.now()),
      text: text.trim(),
      date: new Date(date).toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback((id, text) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text: text.trim() } : n));
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
