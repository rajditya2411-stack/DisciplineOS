import { useState } from 'react';
import { Plus, MoreVertical, Check } from 'lucide-react';
import { useHabits } from '../../context/HabitsContext';
import { HABIT_CATEGORIES } from '../../utils/categories';
import AddHabitModal from '../modals/AddHabitModal';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function HabitChecklist({ selectedDate }) {
  const { toggleCompletion, updateHabit, deleteHabit, addHabit, habits, completions, getStreak } = useHabits();
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const date = selectedDate || todayStr();
  const isToday = date === todayStr();

  const habitsWithMeta = habits.map((h) => ({
    ...h,
    done: !!completions[date]?.[h.id],
    streak: getStreak(h.id),
    completedAt: completions[date]?.[h.id] ? "Checked" : null,
  }));
  const filtered =
    categoryFilter === 'All'
      ? habitsWithMeta
      : habitsWithMeta.filter((h) => h.category === categoryFilter);

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
      <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-text-primary text-lg font-semibold">
            {isToday ? "Today's Habits" : "Habits for " + date}
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
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
              className="flex items-center justify-center gap-2 px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary/5 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Habit
            </button>
          </div>
        </div>

        <ul className="divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <li className="py-8 text-center text-text-secondary text-sm">
              {habitsWithMeta.length === 0
                ? 'No habits yet. Add one to get started.'
                : 'No habits in this category for today.'}
            </li>
          ) : (
            filtered.map((habit) => (
              <li
                key={habit.id}
                className={`flex items-center justify-between py-4 first:pt-0 last:pb-0 group ${habit.done ? 'opacity-80' : ''}`}
              >
                <button
                  type="button"
                  onClick={() => toggleCompletion(habit.id, date)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                      habit.done ? 'bg-primary border-primary' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {habit.done && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-text-primary text-sm font-medium truncate">{habit.name}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 text-xs font-medium rounded-full ${habit.categoryColor}`}>
                      {habit.category}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-gray-600 font-bold text-sm">🔥 {habit.streak}</span>
                  {habit.completedAt && (
                    <span className="text-text-secondary text-xs">{habit.completedAt}</span>
                  )}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setMenuOpenId(menuOpenId === habit.id ? null : habit.id)}
                      className="p-1.5 rounded-lg text-text-secondary opacity-0 group-hover:opacity-100 hover:bg-background transition-all duration-200"
                      aria-label="More options"
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
            ))
          )}
        </ul>
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
