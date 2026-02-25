import { useState } from 'react';
import { Plus, Check, Pencil, Trash2 } from 'lucide-react';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { BLOCK_CATEGORIES } from '../../utils/categories';
import AddBlockModal from '../modals/AddBlockModal';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const hours = [];
for (let h = 6; h <= 24; h++) {
  hours.push({ label: `${h === 12 ? 12 : h % 12}:00 ${h >= 12 ? 'PM' : 'AM'}`, value: h });
  if (h < 24) hours.push({ label: `${h === 12 ? 12 : h % 12}:30 ${h >= 12 ? 'PM' : 'AM'}`, value: h + 0.5 });
}

const slotHeight = 40;
const startHour = 6;

function getBlockStyle(block) {
  const top = (block.start - startHour) * 2 * slotHeight;
  const height = (block.end - block.start) * 2 * slotHeight;
  return { top: `${top}px`, height: `${height}px` };
}

export default function TimeScheduler() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const date = todayStr();
  const {
    getBlocksForDate,
    getTotalHoursForDate,
    addBlock,
    updateBlock,
    deleteBlock,
    toggleBlockDone,
  } = useTimeBlocks();

  const blocks = getBlocksForDate(date);
  const totalHours = getTotalHoursForDate(date);
  const byCategory = blocks.reduce((acc, b) => {
    acc[b.category] = (acc[b.category] || 0) + (b.end - b.start);
    return acc;
  }, {});

  const handleSave = (data) => {
    if (editingBlock) {
      updateBlock(editingBlock.id, data);
      setEditingBlock(null);
    } else {
      addBlock({ ...data, date });
    }
    setModalOpen(false);
  };

  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;

  return (
    <>
      <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-text-primary text-lg font-semibold">Today&apos;s Schedule</h2>
          <button
            type="button"
            onClick={() => {
              setEditingBlock(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          {BLOCK_CATEGORIES.map((a) => (
            <button
              key={a.name}
              type="button"
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-card text-sm font-medium text-text-primary hover:shadow-md transition-all duration-200 border-l-4 ${a.color}`}
            >
              {a.name}
            </button>
          ))}
        </div>

        <div className="relative min-h-[600px]">
          <div className="flex gap-4">
            <div className="w-16 shrink-0 space-y-0">
              {hours.map((hr, i) => (
                <div
                  key={i}
                  className="text-text-secondary text-xs font-medium"
                  style={{ height: slotHeight }}
                >
                  {i % 2 === 0 ? hr.label : ''}
                </div>
              ))}
            </div>
            <div className="flex-1 relative" style={{ minHeight: hours.length * slotHeight }}>
              {hours.map((_, i) => (
                <div
                  key={i}
                  className="absolute left-0 right-0 border-b border-border/50 hover:bg-gray-50 transition-colors group"
                  style={{ top: i * slotHeight, height: slotHeight }}
                >
                  <span className="opacity-0 group-hover:opacity-100 text-xs text-text-secondary ml-2">+ Add</span>
                </div>
              ))}
              {currentHour >= startHour && currentHour <= 24 && (
                <div
                  className="absolute left-0 right-0 h-0.5 bg-danger z-10"
                  style={{ top: (currentHour - startHour) * 2 * slotHeight }}
                >
                  <div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-danger" />
                </div>
              )}
              {blocks.map((block) => (
                <div
                  key={block.id}
                  className={`absolute left-2 right-2 rounded-lg border-l-4 ${block.border} ${block.color} p-3 cursor-pointer hover:shadow-md transition-all duration-200 group`}
                  style={getBlockStyle(block)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-text-primary text-sm font-semibold">{block.title}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                        {block.category}
                      </span>
                      <p className="text-text-secondary text-xs mt-1">{block.end - block.start} hrs</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => toggleBlockDone(block.id)}
                        className="p-1 rounded hover:bg-white/50"
                        aria-label={block.done ? 'Mark incomplete' : 'Mark done'}
                      >
                        <Check className={`w-5 h-5 shrink-0 ${block.done ? 'text-success' : 'text-text-secondary'}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBlock(block);
                          setModalOpen(true);
                        }}
                        className="p-1 rounded hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteBlock(block.id);
                        }}
                        className="p-1 rounded hover:bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <p className="text-text-secondary text-sm">
            <span className="font-medium text-text-primary">Total scheduled:</span>{' '}
            {totalHours.toFixed(1)} hours
          </p>
          {Object.keys(byCategory).length > 0 && (
            <p className="text-text-secondary text-xs mt-1">
              {Object.entries(byCategory)
                .map(([cat, hrs]) => `${cat}: ${hrs}h`)
                .join(' | ')}
            </p>
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
