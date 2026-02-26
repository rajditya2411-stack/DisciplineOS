import { useMemo } from 'react';
import { useHabits } from '../../context/HabitsContext';

const heatColors = ['#EBEDF0', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#374151'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Mon', 'Wed', 'Fri'];

export default function YearHeatmap() {
  const { habits, completions } = useHabits();

  const grid = useMemo(() => {
    const data = [];
    const now = new Date();
    // Start from 52 weeks ago
    const start = new Date(now);
    start.setDate(now.getDate() - (52 * 7));
    // Adjust to Monday
    const dayOfWeek = start.getDay();
    const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    start.setDate(diff);

    for (let week = 0; week < 52; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        const d = new Date(start);
        d.setDate(start.getDate() + (week * 7) + day);
        const dateStr = d.toISOString().slice(0, 10);
        const dayCompletions = completions[dateStr] || {};
        const completedCount = habits.filter(h => dayCompletions[h.id]).length;
        
        let level = 0;
        if (habits.length > 0) {
          const ratio = completedCount / habits.length;
          if (ratio > 0.8) level = 4;
          else if (ratio > 0.5) level = 3;
          else if (ratio > 0.2) level = 2;
          else if (ratio > 0) level = 1;
        }
        weekData.push({ level, count: completedCount, date: dateStr });
      }
      data.push(weekData);
    }
    return data;
  }, [habits, completions]);

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
      <h3 className="text-text-primary text-lg font-bold mb-6">Year in Review - Completion Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-1 min-w-max pb-2">
          <div className="flex flex-col justify-around pr-4 text-text-secondary text-[10px] font-bold uppercase tracking-wider">
            {days.map((d) => (
              <span key={d} className="h-3 leading-tight">{d}</span>
            ))}
          </div>
          <div className="flex gap-1">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className="w-3.5 h-3.5 rounded-sm hover:ring-2 hover:ring-primary/50 cursor-default transition-all"
                    style={{ backgroundColor: heatColors[day.level] }}
                    title={`${day.date} • ${day.count} habits completed`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-6">
        <div className="flex gap-8 text-text-secondary text-[10px] font-bold uppercase tracking-wider">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
        <div className="flex items-center gap-2 text-text-secondary text-xs font-medium">
          <span>Less</span>
          <div className="flex gap-1">
            {heatColors.map((c, i) => (
              <div key={i} className="w-3.5 h-3.5 rounded-sm" style={{ backgroundColor: c }} />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
