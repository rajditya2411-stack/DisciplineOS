import { useState } from 'react';
import { Plus, MoreVertical } from 'lucide-react';
import { useHabits } from '../../context/HabitsContext';
import { HABIT_CATEGORIES, getHabitCategoryClass } from '../../utils/categories';
import AddHabitModal from '../modals/AddHabitModal';

export default function Habits() {
  const { habits, addHabit, updateHabit, deleteHabit, getStreak } = useHabits();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const filtered =
    categoryFilter === 'All'
      ? habits
      : habits.filter((h) => h.category === categoryFilter);

  const handleSave = (data) => {
    if (editingHabit) {
      updateHabit(editingHabit.id, data);
      setEditingHabit(null);
    } else {
      addHabit(data);
    }
    setModalOpen(false);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">All Habits</h1>
            <p className="text-text-secondary mt-1">Manage and track all your habits.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-border rounded-lg px-3 py-2 text-text-secondary bg-card focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="All">All Categories</option>
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                setEditingHabit(null);
                setModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-text-secondary">
              {habits.length === 0
                ? 'No habits yet. Add one to get started.'
                : 'No habits in this category.'}
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {filtered.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center justify-between py-4 px-6 hover:bg-gray-50/50 group"
                >
                  <div>
                    <p className="text-text-primary font-medium">{habit.name}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full ${getHabitCategoryClass(habit.category)}`}>
                      {habit.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600 text-sm font-medium">🔥 {getStreak(habit.id)}</span>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setMenuOpenId(menuOpenId === habit.id ? null : habit.id)}
                        className="p-2 rounded-lg text-text-secondary hover:bg-gray-100 transition-colors"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {menuOpenId === habit.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            aria-hidden="true"
                            onClick={() => setMenuOpenId(null)}
                          />
                          <div className="absolute right-0 top-full mt-1 py-1 bg-card border border-border rounded-lg shadow-lg z-20 min-w-[120px]">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingHabit(habit);
                                setModalOpen(true);
                                setMenuOpenId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-gray-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                deleteHabit(habit.id);
                                setMenuOpenId(null);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <AddHabitModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSave}
        editHabit={editingHabit}
      />
    </>
  );
}
