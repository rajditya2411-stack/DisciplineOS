import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../utils/categories';

export default function AddHabitModal({ isOpen, onClose, onSave, editHabit = null }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Health');

  useEffect(() => {
    if (isOpen) {
      if (editHabit) {
        setName(editHabit.name);
        setCategory(editHabit.category || 'Health');
      } else {
        setName('');
        setCategory('Health');
      }
    }
  }, [isOpen, editHabit]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave?.({ name: trimmed, category });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-card rounded-2xl shadow-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {editHabit ? 'Edit Habit' : 'Add Habit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Workout"
              className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border rounded-lg text-text-primary font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {editHabit ? 'Save' : 'Add Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
