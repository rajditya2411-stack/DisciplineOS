import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

export default function WeeklyReview() {
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();
  const [weekOffset, setWeekOffset] = useState(0);

  const weekData = useMemo(() => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1) + (weekOffset * 7);
    const monday = new Date(now.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dailyStats = days.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayCompletions = completions[dateStr] || {};
      const completed = habits.filter(h => dayCompletions[h.id]).length;
      return { name: label, completed, date: dateStr };
    });

    let totalPossible = habits.length * 7;
    let totalCompleted = dailyStats.reduce((sum, d) => sum + d.completed, 0);
    let timeLogged = 0;
    let blocksDone = 0;
    let totalBlocks = 0;

    blocks.forEach(b => {
      if (b.date >= monday.toISOString().slice(0, 10) && b.date <= sunday.toISOString().slice(0, 10)) {
        timeLogged += (b.end - b.start);
        totalBlocks++;
        if (b.done) blocksDone++;
      }
    });

    const bestDay = [...dailyStats].sort((a, b) => b.completed - a.completed)[0];

    return {
      monday,
      sunday,
      dailyStats,
      overallRate: totalPossible ? Math.round((totalCompleted / totalPossible) * 100) : 0,
      totalCompleted,
      totalPossible,
      bestDay: bestDay?.completed > 0 ? bestDay.name : '-',
      bestDayCount: bestDay?.completed || 0,
      timeLogged: Math.round(timeLogged),
      blocksDone,
      totalBlocks
    };
  }, [habits, completions, blocks, weekOffset]);

  const formatDateRange = () => {
    const options = { month: 'short', day: 'numeric' };
    return `${weekData.monday.toLocaleDateString('en-US', options)} - ${weekData.sunday.toLocaleDateString('en-US', options)}`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Weekly Review</h1>
          <p className="text-text-secondary mt-1">{formatDateRange()}</p>
        </div>
        <div className="flex bg-card rounded-xl p-1 border border-border items-center gap-2">
          <button 
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            ← Prev
          </button>
          <button 
            onClick={() => setWeekOffset(0)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              weekOffset === 0 ? 'bg-sidebar text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            This Week
          </button>
          <button 
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
          >
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ReviewStatCard title="OVERALL RATE" value={`${weekData.overallRate}%`} sub={`${weekData.totalCompleted}/${weekData.totalPossible} habits`} />
        <ReviewStatCard title="BEST DAY" value={weekData.bestDay} sub={`${weekData.bestDayCount} completed`} />
        <ReviewStatCard title="TIME LOGGED" value={`${weekData.timeLogged}h`} sub={`${weekData.blocksDone}/${weekData.totalBlocks} blocks done`} />
        <ReviewStatCard title="ACTIVE HABITS" value={habits.length} sub="being tracked" />
      </div>

      <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
        <h3 className="text-xl font-bold text-text-primary mb-8">Daily Habit Completions</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekData.dailyStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}}
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{fill: '#F9FAFB'}}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="completed" fill="#111827" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ReviewStatCard({ title, value, sub }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
      <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">{title}</p>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        <span className="text-xs text-text-secondary mt-1">{sub}</span>
      </div>
    </div>
  );
}
