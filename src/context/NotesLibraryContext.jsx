import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'discipline-tracker-notes-library';

const NotesLibraryContext = createContext(null);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function NotesLibraryProvider({ children }) {
  const [notesLibrary, setNotesLibrary] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (_) {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notesLibrary));
  }, [notesLibrary]);

  const addNote = useCallback((title, content, pinnedToDashboard = false) => {
    const newNote = {
      id: String(Date.now()),
      title: title.trim(),
      content: content.trim(),
      pinnedToDashboard: pinnedToDashboard,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotesLibrary(prev => [newNote, ...prev]);
    return newNote.id;
  }, []);

  const updateNote = useCallback((id, title, content, pinnedToDashboard) => {
    setNotesLibrary(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, title: title.trim(), content: content.trim(), pinnedToDashboard, updatedAt: new Date().toISOString() } 
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id) => {
    setNotesLibrary(prev => prev.filter(n => n.id !== id));
  }, []);

  const togglePinned = useCallback((id) => {
    setNotesLibrary(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, pinnedToDashboard: !n.pinnedToDashboard } 
          : n
      )
    );
  }, []);

  const getPinnedNotes = useCallback(() => {
    return notesLibrary.filter(n => n.pinnedToDashboard);
  }, [notesLibrary]);

  return (
    <NotesLibraryContext.Provider value={{ 
      notesLibrary, 
      addNote, 
      updateNote, 
      deleteNote,
      togglePinned,
      getPinnedNotes
    }}>
      {children}
    </NotesLibraryContext.Provider>
  );
}

export function useNotesLibrary() {
  const ctx = useContext(NotesLibraryContext);
  if (!ctx) throw new Error('useNotesLibrary must be used within NotesLibraryProvider');
  return ctx;
}
