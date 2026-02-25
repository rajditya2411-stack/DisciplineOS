import { Plus } from 'lucide-react';

const goals = [
  { name: '100 Days of Code', template: true, current: 30, total: 100, streak: 5 },
  { name: '30-Day Content Challenge', template: false, current: 18, total: 30, streak: 12 },
];

export default function ActiveGoals() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">Active Goals</h3>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.name} className="space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-text-primary text-sm font-medium">{goal.name}</p>
              {goal.template && (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-text-secondary">
                  Template
                </span>
              )}
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-success rounded-full transition-all duration-300"
                style={{ width: `${(goal.current / goal.total) * 100}%` }}
              />
            </div>
            <p className="text-text-secondary text-xs">
              {goal.current}/{goal.total} days • 🔥 {goal.streak} day streak
            </p>
            <a href="#" className="text-primary text-xs font-medium hover:underline">
              View Details
            </a>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-border text-text-primary text-sm font-medium rounded-lg hover:bg-background transition-all duration-200"
      >
        <Plus className="w-4 h-4" />
        Start New Goal
      </button>
    </div>
  );
}
