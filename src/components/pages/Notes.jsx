import { useState } from 'react';
import { BookOpen, Plus, Trash2, Pin, PinOff, Search, Edit3, X, Save } from 'lucide-react';
import { useNotesLibrary } from '../../context/NotesLibraryContext';

export default function Notes() {
  const { notesLibrary, addNote, updateNote, deleteNote, togglePinned } = useNotesLibrary();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);

  const filteredNotes = notesLibrary.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    if (!title.trim() || !content.trim()) return;
    addNote(title, content, false);
    setTitle('');
    setContent('');
    setIsCreating(false);
  };

  const handleUpdate = (id) => {
    if (!title.trim() || !content.trim()) return;
    updateNote(id, title, content, notesLibrary.find(n => n.id === id)?.pinnedToDashboard);
    setEditingId(null);
    setTitle('');
    setContent('');
  };

  const startEdit = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setSelectedNote(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-primary" />
          My Notes
        </h1>
        <p className="text-text-secondary">Write, organize, and pin your notes to the dashboard</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Notes List */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {/* Search */}
            <div className="p-4 border-b border-border bg-background/30">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-text-secondary" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search notes..."
                  className="w-full bg-card border border-border rounded-lg pl-9 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Create Button */}
            {!isCreating && (
              <div className="p-4 border-b border-border">
                <button
                  onClick={() => setIsCreating(true)}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Note
                </button>
              </div>
            )}

            {/* Notes List */}
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto custom-scrollbar">
              {filteredNotes.length === 0 ? (
                <div className="p-8 text-center">
                  <BookOpen className="w-8 h-8 text-border mx-auto mb-2" />
                  <p className="text-text-secondary text-sm">{searchQuery ? 'No notes match your search.' : 'No notes yet. Create one!'}</p>
                </div>
              ) : (
                filteredNotes.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNote(note.id === selectedNote ? null : note.id);
                      setEditingId(null);
                    }}
                    className={`w-full text-left p-4 hover:bg-background/50 transition-colors border-l-4 ${
                      selectedNote === note.id ? 'border-l-primary bg-background/50' : 'border-l-transparent'
                    }`}
                  >
                    <h4 className="text-sm font-bold text-text-primary truncate">{note.title}</h4>
                    <p className="text-xs text-text-secondary mt-1">{formatDate(note.createdAt)}</p>
                    {note.pinnedToDashboard && (
                      <div className="mt-2 flex items-center gap-1">
                        <Pin className="w-3 h-3 text-primary fill-current" />
                        <span className="text-xs text-primary font-bold">Pinned</span>
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Note Editor/Viewer */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {isCreating ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-primary">Create Note</h2>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setTitle('');
                      setContent('');
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                  className="w-full h-64 bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none custom-scrollbar"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Save Note
                  </button>
                  <button
                    onClick={() => {
                      setIsCreating(false);
                      setTitle('');
                      setContent('');
                    }}
                    className="flex-1 bg-background text-text-secondary py-2 rounded-lg font-bold text-sm hover:bg-background/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : editingId ? (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-text-primary">Edit Note</h2>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setContent('');
                    }}
                    className="text-text-secondary hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm font-bold text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your note here..."
                  className="w-full h-64 bg-background border border-border rounded-lg px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none custom-scrollbar"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(editingId)}
                    className="flex-1 bg-primary text-white py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setTitle('');
                      setContent('');
                    }}
                    className="flex-1 bg-background text-text-secondary py-2 rounded-lg font-bold text-sm hover:bg-background/80 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedNote ? (
              <div className="p-6">
                {(() => {
                  const note = notesLibrary.find(n => n.id === selectedNote);
                  return (
                    <>
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                          <h2 className="text-2xl font-bold text-text-primary mb-1">{note.title}</h2>
                          <p className="text-xs text-text-secondary uppercase font-bold">{formatDate(note.updatedAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => togglePinned(note.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              note.pinnedToDashboard
                                ? 'bg-primary/10 text-primary hover:bg-primary/20'
                                : 'bg-background hover:bg-background/80 text-text-secondary'
                            }`}
                            title={note.pinnedToDashboard ? 'Unpin from dashboard' : 'Pin to dashboard'}
                          >
                            {note.pinnedToDashboard ? (
                              <Pin className="w-5 h-5 fill-current" />
                            ) : (
                              <PinOff className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => startEdit(note)}
                            className="p-2 rounded-lg bg-background hover:bg-background/80 text-text-secondary transition-colors"
                          >
                            <Edit3 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              deleteNote(note.id);
                              setSelectedNote(null);
                            }}
                            className="p-2 rounded-lg bg-background hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-text-primary whitespace-pre-wrap break-words leading-relaxed">{note.content}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-border mx-auto mb-3" />
                <p className="text-text-secondary font-medium">Select a note to view or create a new one</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
