import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-notes';
const NOTIFICATIONS_KEY = 'discipline-tracker-notifications';

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

  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const addNote = useCallback((text, date = todayStr(), reminderTime = null, priority = 'medium') => {
    const newNote = {
      id: String(Date.now()),
      text: text.trim(),
      date: new Date(date).toISOString(),
      reminderTime: reminderTime, // optional: "14:00"
      priority: priority // 'low', 'medium', 'high'
    };
    setNotes(prev => [newNote, ...prev]);
  }, []);

  const addNotification = useCallback((note) => {
    const newNotif = {
      id: String(Date.now()),
      noteId: note.id,
      text: note.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const updateNote = useCallback((id, text) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, text: text.trim() } : n));
  }, []);

  const deleteNote = useCallback((id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  return (
    <NotesContext.Provider value={{ 
      notes, addNote, updateNote, deleteNote, 
      notifications, addNotification, markNotificationRead, clearNotifications 
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error('useNotes must be used within NotesProvider');
  return ctx;
}
