import { useState } from 'react';
import { StickyNote, Plus, Trash2, Edit3, X, Save } from 'lucide-react';
import { useNotes } from '../../context/NotesContext';

export default function NotesWidget({ selectedDate }) {
  const { notes, addNote, updateNote, deleteNote } = useNotes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const activeDate = selectedDate || new Date().toISOString().slice(0, 10);

  const handleAdd = () => {
    if (!newNoteText.trim()) return;
    addNote(newNoteText, activeDate);
    setNewNoteText('');
  };

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

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Quick Notes</h3>
          </div>
          <span className="text-[10px] font-bold text-text-secondary bg-background px-2 py-0.5 rounded-full">
            {notes.length}
          </span>
        </div>
        
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
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">All Notes</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-background rounded-full transition-colors">
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            <div className="p-6 border-b border-border bg-background/30">
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
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {notes.length === 0 ? (
                <div className="text-center py-12">
                  <StickyNote className="w-12 h-12 text-border mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">Your notes list is empty.</p>
                </div>
              ) : (
                notes.map((note) => (
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
                          <p className="text-sm text-text-primary break-words">{note.text}</p>
                          <p className="text-[10px] text-text-secondary mt-2 uppercase font-bold tracking-tighter">
                            {new Date(note.date).toLocaleDateString()} • {new Date(note.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
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
          </div>
        </div>
      )}
    </>
  );
}
