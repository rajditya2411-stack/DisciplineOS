import { useState } from 'react';
import { Plus, Check, Pencil, Trash2, Clock } from 'lucide-react';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { BLOCK_CATEGORIES } from '../../utils/categories';
import AddBlockModal from '../modals/AddBlockModal';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

const formatTime = (hour) => {
  const h = Math.floor(hour);
  const m = hour % 1 === 0 ? '00' : '30';
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
};

export default function TimeScheduler({ selectedDate }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState(null);
  const [filter, setFilter] = useState('All');
  const date = selectedDate || todayStr();
  const isToday = date === todayStr();
  const {
    getBlocksForDate,
    getTotalHoursForDate,
    addBlock,
    updateBlock,
    deleteBlock,
    toggleBlockDone,
  } = useTimeBlocks();

  const allBlocks = getBlocksForDate(date);
  const filteredBlocks = filter === 'All' 
    ? allBlocks 
    : allBlocks.filter(b => b.category === filter);
    
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
      <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-text-primary text-lg font-bold">
              {isToday ? "Today's Schedule" : "Schedule for " + date}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditingBlock(null);
              setModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Add Block
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('All')}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filter === 'All' 
                ? 'bg-sidebar text-white border-sidebar' 
                : 'bg-transparent text-text-secondary border-border hover:border-text-secondary'
            }`}
          >
            All
          </button>
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setFilter(cat.name)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                filter === cat.name 
                  ? 'bg-sidebar text-white border-sidebar' 
                  : 'bg-transparent text-text-secondary border-border hover:border-text-secondary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredBlocks.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-border rounded-xl">
              <p className="text-text-secondary text-sm">No blocks scheduled</p>
            </div>
          ) : (
            filteredBlocks.map((block) => (
              <div
                key={block.id}
                onClick={() => {
                  setEditingBlock(block);
                  setModalOpen(true);
                }}
                className={`group relative flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-primary/30 transition-all cursor-pointer shadow-sm`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-10 rounded-full ${block.border.replace('border-l-4', 'bg-current')} opacity-60`} />
                  <div>
                    <h3 className={`text-sm font-bold transition-all ${block.done ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                      {block.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-text-secondary uppercase">
                        {formatTime(block.start)} - {formatTime(block.end)}
                      </span>
                      <span className="text-[10px] font-bold text-text-secondary">•</span>
                      <span className="text-[10px] font-bold text-text-secondary uppercase">{block.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBlockDone(block.id);
                    }}
                    className={`p-1.5 rounded-lg hover:bg-background transition-colors ${block.done ? 'text-success' : 'text-text-secondary'}`}
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(block.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-background text-danger transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Scheduled</span>
          <span className="text-sm font-bold text-text-primary">{totalHours.toFixed(1)}h</span>
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
