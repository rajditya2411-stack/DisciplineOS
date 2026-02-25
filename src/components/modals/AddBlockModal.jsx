import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BLOCK_CATEGORIES } from '../../utils/categories';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const HOUR_OPTIONS = [];
for (let h = 0; h <= 24; h++) {
  for (let m = 0; m < 60; m += 30) {
    if (h === 24 && m > 0) break;
    const value = h + m / 60;
    const label = `${h % 12 || 12}:${m === 0 ? '00' : m} ${h >= 12 ? 'PM' : 'AM'}`;
    HOUR_OPTIONS.push({ value, label });
  }
}

export default function AddBlockModal({ isOpen, onClose, onSave, editBlock = null, date = null }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Deep Work');
  const [start, setStart] = useState(9);
  const [end, setEnd] = useState(10);
  const [blockDate, setBlockDate] = useState(date || todayStr());

  useEffect(() => {
    if (isOpen) {
      if (editBlock) {
        setTitle(editBlock.title);
        setCategory(editBlock.category || 'Deep Work');
        setStart(editBlock.start);
        setEnd(editBlock.end);
        setBlockDate(editBlock.date || todayStr());
      } else {
        setTitle('');
        setCategory('Deep Work');
        setStart(9);
        setEnd(10);
        setBlockDate(date || todayStr());
      }
    }
  }, [isOpen, editBlock, date]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed || end <= start) return;
    onSave?.({ title: trimmed, category, start, end, date: blockDate });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div className="relative bg-card rounded-2xl shadow-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-text-primary">
            {editBlock ? 'Edit Block' : 'Add Time Block'}
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
            <label className="block text-sm font-medium text-text-primary mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deep Work - Client Proposal"
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
              {BLOCK_CATEGORIES.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Start</label>
              <select
                value={start}
                onChange={(e) => setStart(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {HOUR_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">End</label>
              <select
                value={end}
                onChange={(e) => setEnd(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {HOUR_OPTIONS.filter((o) => o.value > start).map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Date</label>
            <input
              type="date"
              value={blockDate}
              onChange={(e) => setBlockDate(e.target.value)}
              className="w-full border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
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
              disabled={!title.trim() || end <= start}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {editBlock ? 'Save' : 'Add Block'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
