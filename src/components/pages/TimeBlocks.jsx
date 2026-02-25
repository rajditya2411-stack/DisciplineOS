import { useState } from 'react';
import { Plus, Pencil, Trash2, Check } from 'lucide-react';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { getBlockCategoryStyle } from '../../utils/categories';
import AddBlockModal from '../modals/AddBlockModal';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function TimeBlocks() {
  const [date, setDate] = useState(todayStr());
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const { getBlocksForDate, getTotalHoursForDate, addBlock, updateBlock, deleteBlock, toggleBlockDone } = useTimeBlocks();

  const blocks = getBlocksForDate(date);
  const totalHours = getTotalHoursForDate(date);

  const handleSave = (data) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, data);
      setEditingBlock(null);
    } else {
      addBlock({ ...data, date });
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">Time Blocks</h1>
            <p className="text-text-secondary mt-1">Plan and review your time blocks.</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 text-text-primary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => {
                setEditingBlock(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Block
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card p-6">
          <p className="text-text-secondary text-sm mb-4">
            <span className="font-medium text-text-primary">Total for {date}:</span> {totalHours.toFixed(1)} hours
          </p>
          {blocks.length === 0 ? (
            <div className="py-12 text-center text-text-secondary">
              No time blocks for this date. Add one to get started.
            </div>
          ) : (
            <ul className="space-y-3">
              {blocks.map((block) => {
                const style = getBlockCategoryStyle(block.category);
                return (
                  <li
                    key={block.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${style.border} ${style.bg}`}
                  >
                    <div>
                      <p className="text-text-primary font-medium">{block.title}</p>
                      <p className="text-text-secondary text-sm mt-0.5">
                        {block.category} • {block.start % 1 === 0 ? block.start : block.start.toFixed(1)} – {block.end % 1 === 0 ? block.end : block.end.toFixed(1)} ({block.end - block.start} hrs)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBlockDone(block.id)}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        aria-label={block.done ? 'Mark incomplete' : 'Mark done'}
                      >
                        <Check className={`w-5 h-5 ${block.done ? 'text-success' : 'text-text-secondary'}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBlock(block);
                          setModalOpen(true);
                        }}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4 text-text-secondary" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteBlock(block.id)}
                        className="p-2 rounded-lg hover:bg-white/50 transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-text-secondary" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <AddBlockModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleSave}
        editBlock={editingBlock}
        date={date}
      />
    </>
  );
}
