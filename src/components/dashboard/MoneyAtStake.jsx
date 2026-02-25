const stats = [
  { label: 'At Risk', value: '$35', color: 'text-warning', size: 'text-2xl' },
  { label: 'Unpaid', value: '$10', color: 'text-danger', size: 'text-2xl' },
  { label: 'Paid', value: '$45', color: 'text-success', size: 'text-2xl' },
  { label: 'Habits w/ Insurance', value: '5', color: 'text-text-primary', size: 'text-lg' },
];

const insuredHabits = [
  { name: 'Morning Workout', streak: 15, atRisk: '$5' },
  { name: 'Deep Work', streak: 23, atRisk: '$10' },
];

export default function MoneyAtStake() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">💸 Money at Stake</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="text-text-secondary text-xs">{s.label}</p>
            <p className={`font-bold ${s.color} ${s.size}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-danger/10 border border-danger/20 rounded-lg p-3 mb-4">
        <p className="text-danger text-sm font-medium">You have 2 unpaid penalties</p>
        <a href="#" className="text-primary text-xs font-medium hover:underline">
          Mark as paid
        </a>
      </div>
      <div className="space-y-2">
        <p className="text-text-secondary text-xs font-medium uppercase">Insured habits</p>
        {insuredHabits.map((h) => (
          <div key={h.name} className="flex justify-between items-center text-sm">
            <span className="text-text-primary">{h.name} • 🔥 {h.streak}</span>
            <span className="text-warning font-medium">{h.atRisk} at risk</span>
          </div>
        ))}
      </div>
    </div>
  );
}
