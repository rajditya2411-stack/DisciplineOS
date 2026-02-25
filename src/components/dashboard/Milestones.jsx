const milestones = [
  { icon: '🥇', name: '30-Day Streak', date: 'Unlocked Feb 15', locked: false },
  { icon: '💯', name: '100 Habits Completed', date: 'Unlocked Feb 10', locked: false },
  { icon: '🔒', name: '90-Day Streak', progress: '15 more days', locked: true },
];

export default function Milestones() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">🏆 Recent Achievements</h3>
      <ul className="space-y-4">
        {milestones.map((m) => (
          <li key={m.name} className="flex items-center gap-3">
            <span className={`text-2xl ${m.locked ? 'grayscale opacity-60' : ''}`}>{m.icon}</span>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-semibold ${m.locked ? 'text-text-secondary' : 'text-text-primary'}`}>
                {m.name}
              </p>
              <p className="text-text-secondary text-xs">{m.locked ? m.progress : m.date}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href="#" className="inline-block mt-4 text-primary text-sm font-medium hover:underline">
        View All Milestones
      </a>
    </div>
  );
}
