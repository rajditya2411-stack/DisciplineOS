// Habit categories (for habits list)
export const HABIT_CATEGORIES = ['Health', 'Work', 'Learning', 'Personal'];

// Time block categories (for scheduler) - name and Tailwind border/bg
export const BLOCK_CATEGORIES = [
  { name: 'Deep Work', color: 'border-l-primary', bg: 'bg-primary/5' },
  { name: 'Content', color: 'border-l-gray-500', bg: 'bg-gray-500/5' },
  { name: 'Workout', color: 'border-l-success', bg: 'bg-success/5' },
  { name: 'Learning', color: 'border-l-gray-400', bg: 'bg-gray-400/5' },
  { name: 'Meals', color: 'border-l-warning', bg: 'bg-warning/5' },
  { name: 'Sleep', color: 'border-l-gray-400', bg: 'bg-gray-400/5' },
];

// Map habit category to badge Tailwind classes (grayscale)
export function getHabitCategoryClass(category) {
  const map = {
    Health: 'bg-success/20 text-success',
    Work: 'bg-primary/20 text-primary',
    Learning: 'bg-gray-400/20 text-gray-600',
    Personal: 'bg-gray-500/20 text-gray-600',
  };
  return map[category] || 'bg-gray-400/20 text-gray-600';
}

// Map block category name to border + bg for display
export function getBlockCategoryStyle(categoryName) {
  const found = BLOCK_CATEGORIES.find((c) => c.name === categoryName);
  if (found) return { border: found.color, bg: found.bg };
  return { border: 'border-l-gray-400', bg: 'bg-gray-400/5' };
}
