import { useState, useEffect } from 'react';
import { StickyNote, Plus, Trash2, Edit3, X, Save, Clock, Bell, AlertCircle, Search, BookOpen, ExternalLink, Pin, PinOff } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useNotesLibrary } from '../../context/NotesLibraryContext';
import { useNavigate } from 'react-router-dom';

export default function NotesWidget({ selectedDate }) {
  const navigate = useNavigate();
  const { notes, addNote, updateNote, deleteNote, addNotification } = useNotes();
  const { getPinnedNotes, togglePinned } = useNotesLibrary();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('quick'); // 'quick' or 'library'

  const activeDate = selectedDate || new Date().toISOString().slice(0, 10);
  const pinnedNotes = getPinnedNotes();

  const handleAdd = () => {
    if (!newNoteText.trim()) return;
    addNote(newNoteText, activeDate, reminderTime || null, priority);
    setNewNoteText('');
    setReminderTime('');
    setPriority('medium');
  };

  const filteredNotes = notes.filter(n => 
    n.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const upcomingReminders = notes
    .filter(n => n.reminderTime)
    .sort((a, b) => a.reminderTime.localeCompare(b.reminderTime))
    .slice(0, 2);

  const startEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleUpdate = (id) => {
    if (!editText.trim()) return;
    updateNote(id, editText);
    setEditingId(null);
  };

  const latestNote = notes[0];

  // Notification logic - check frequently for accurate timing
  useEffect(() => {
    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js').catch(err => {
        console.log('Service Worker registration failed:', err);
      });
    }

    const checkReminders = () => {
      const now = new Date();
      const currentDay = now.toISOString().slice(0, 10);
      const currentTime = now.toTimeString().slice(0, 5); // "HH:MM"
      const currentSecond = now.toTimeString().slice(0, 8); // "HH:MM:SS"

      notes.forEach(note => {
        if (!note.reminderTime) return;
        const noteDay = new Date(note.date).toISOString().slice(0, 10);
        if (note.reminderTime === currentTime && noteDay === currentDay) {
          // Check if already notified in this minute to avoid duplicates
          const storageKey = `notified-${note.id}-${currentTime}`;
          if (!localStorage.getItem(storageKey)) {
            // Always add to in-app notifications
            addNotification(note);

            // Try service worker notification first
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: 'SEND_NOTIFICATION',
                note: note
              });
            } else if (typeof Notification !== 'undefined' && Notification.permission === "granted") {
              // Fallback to direct notification
              new Notification("Discipline Reminder", {
                body: note.text,
                icon: "/favicon.ico",
                requireInteraction: true
              });
            }
            localStorage.setItem(storageKey, "true");
          }
        }
      });
    };

    if (typeof Notification !== 'undefined' && Notification.permission === "default") {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }

    // Check immediately on mount
    checkReminders();

    // Check every 500ms for more accuracy
    const interval = setInterval(checkReminders, 500);
    return () => clearInterval(interval);
  }, [notes, addNotification]);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Notes</h3>
          </div>
          <span className="text-[10px] font-bold text-text-secondary bg-background px-2 py-0.5 rounded-full">
            {notes.length + pinnedNotes.length}
          </span>
        </div>
        
        {pinnedNotes.length > 0 && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-[10px] text-primary font-bold uppercase mb-1">Pinned from Library</p>
            {pinnedNotes.slice(0, 1).map(note => (
              <p key={note.id} className="text-xs text-text-secondary truncate">{note.title}</p>
            ))}
            {pinnedNotes.length > 1 && <p className="text-[10px] text-text-secondary">+{pinnedNotes.length - 1} more</p>}
          </div>
        )}

        {upcomingReminders.length > 0 && (
          <div className="mb-3 p-2 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-[10px] text-primary font-bold uppercase mb-1">Upcoming Reminders</p>
            {upcomingReminders.map(rem => (
              <p key={rem.id} className="text-xs text-text-secondary">{rem.reminderTime} - {rem.text.substring(0, 30)}</p>
            ))}
          </div>
        )}
        
        {latestNote ? (
          <p className="text-sm text-text-primary line-clamp-2 italic">
            "{latestNote.text}"
          </p>
        ) : (
          <p className="text-sm text-text-secondary italic">No notes yet. Tap to add one.</p>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border border-border flex flex-col max-h-[80vh]">
            {/* Tabs Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('quick')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all ${
                    activeTab === 'quick'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Quick Notes
                </button>
                <button
                  onClick={() => setActiveTab('library')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-all flex items-center gap-1 ${
                    activeTab === 'library'
                      ? 'bg-primary text-white'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Library
                </button>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-background rounded-full transition-colors">
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            {/* Quick Notes Tab */}
            {activeTab === 'quick' && (
              <>
                <div className="p-6 border-b border-border bg-background/30 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      placeholder="Write a quick note..."
                      className="flex-1 bg-card border border-border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                      onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button 
                      onClick={handleAdd}
                      className="bg-primary text-white p-2 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Priority:</span>
                    <div className="flex gap-1">
                      {['low', 'medium', 'high'].map(p => (
                        <button
                          key={p}
                          onClick={() => setPriority(p)}
                          className={`px-2 py-1 text-[10px] font-bold rounded uppercase transition-colors ${
                            priority === p
                              ? p === 'high' ? 'bg-danger text-white' : p === 'medium' ? 'bg-primary text-white' : 'bg-success text-white'
                              : 'bg-background text-text-secondary'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-text-secondary uppercase">Reminder:</span>
                    <input 
                      type="time"
                      value={reminderTime}
                      onChange={(e) => setReminderTime(e.target.value)}
                      className="bg-card border border-border rounded-lg px-2 py-1 text-xs text-text-primary focus:outline-none flex-1"
                    />
                    {reminderTime && (
                      <button 
                        onClick={() => setReminderTime('')}
                        className="text-[10px] text-danger font-bold uppercase"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search notes..."
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 pl-9 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {filteredNotes.length === 0 ? (
                    <div className="text-center py-12">
                      <StickyNote className="w-12 h-12 text-border mx-auto mb-3" />
                      <p className="text-text-secondary text-sm">{searchQuery ? 'No notes match your search.' : 'Your notes list is empty.'}</p>
                    </div>
                  ) : (
                    filteredNotes.map((note) => (
                      <div key={note.id} className="group bg-background/50 rounded-2xl p-4 border border-border hover:border-primary/30 transition-all">
                        {editingId === note.id ? (
                          <div className="flex gap-2">
                            <input
                              autoFocus
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 bg-card border border-primary/50 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                            />
                            <button onClick={() => handleUpdate(note.id)} className="text-success p-1">
                              <Save className="w-5 h-5" />
                            </button>
                            <button onClick={() => setEditingId(null)} className="text-text-secondary p-1">
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-2">
                                {note.priority === 'high' && <AlertCircle className="w-4 h-4 text-danger mt-0.5 flex-shrink-0" />}
                                <p className="text-sm text-text-primary break-words">{note.text}</p>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 mt-2">
                                <p className="text-[10px] text-text-secondary uppercase font-bold tracking-tighter">
                                  {new Date(note.date).toLocaleDateString()}
                                </p>
                                {note.reminderTime && (
                                  <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {note.reminderTime}
                                  </span>
                                )}
                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                                  note.priority === 'high' ? 'bg-danger/10 text-danger' : note.priority === 'low' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'
                                }`}>
                                  {note.priority}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startEdit(note)} className="p-1.5 text-text-secondary hover:text-primary transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button onClick={() => deleteNote(note.id)} className="p-1.5 text-text-secondary hover:text-danger transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Library Tab */}
            {activeTab === 'library' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {pinnedNotes.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-border mx-auto mb-3" />
                    <p className="text-text-secondary text-sm mb-4">No pinned library notes</p>
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        navigate('/notes');
                      }}
                      className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Go to Notes App
                    </button>
                  </div>
                ) : (
                  <>
                    {pinnedNotes.map((note) => (
                      <div key={note.id} className="group bg-background/50 rounded-2xl p-4 border border-border hover:border-primary/30 transition-all">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-text-primary mb-1">{note.title}</h4>
                            <p className="text-xs text-text-secondary line-clamp-2">{note.content.substring(0, 80)}{note.content.length > 80 ? '...' : ''}</p>
                            <p className="text-[10px] text-text-secondary mt-2 uppercase font-bold">Pinned from Library</p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => togglePinned(note.id)}
                              className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                            >
                              <Pin className="w-4 h-4 fill-current" />
                            </button>
                            <button 
                              onClick={() => {
                                setIsModalOpen(false);
                                navigate('/notes');
                              }}
                              className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        navigate('/notes');
                      }}
                      className="w-full flex items-center justify-center gap-2 text-primary font-bold text-sm hover:bg-primary/10 p-3 rounded-lg transition-colors mt-4"
                    >
                      <BookOpen className="w-4 h-4" />
                      Manage All Notes
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
