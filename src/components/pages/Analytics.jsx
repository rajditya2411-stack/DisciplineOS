import { useMemo, useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

export default function Analytics() {
  const { habits, completions } = useHabits();
  const { blocks } = useTimeBlocks();
  const [range, setRange] = useState('30d');

  const stats = useMemo(() => {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(now.getDate() - days);
    
    let totalPossible = 0;
    let totalCompleted = 0;
    let timeLogged = 0;
    const habitCounts = {};

    // Calculate habit stats
    for (let i = 0; i < days; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      
      totalPossible += habits.length;
      const dayCompletions = completions[dateStr] || {};
      habits.forEach(h => {
        if (dayCompletions[h.id]) {
          totalCompleted++;
          habitCounts[h.name] = (habitCounts[h.name] || 0) + 1;
        }
      });
    }

    // Calculate time stats
    blocks.forEach(b => {
      if (b.date >= startDate.toISOString().slice(0, 10)) {
        timeLogged += (b.end - b.start);
      }
    });

    const avgCompletion = totalPossible ? Math.round((totalCompleted / totalPossible) * 100) : 0;
    const bestHabit = Object.entries(habitCounts).sort((a, b) => b[1] - a[1])[0] || ['-', 0];

    return {
      avgCompletion,
      totalCompletions: totalCompleted,
      timeLogged: Math.round(timeLogged),
      bestHabit: bestHabit[0],
      bestHabitCount: bestHabit[1]
    };
  }, [habits, completions, blocks, range]);

  const chartData = useMemo(() => {
    const data = [];
    const now = new Date();
    const days = 30;
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayCompletions = completions[dateStr] || {};
      const completed = habits.filter(h => dayCompletions[h.id]).length;
      const pct = habits.length ? (completed / habits.length) * 100 : 0;
      data.push({
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: Math.round(pct)
      });
    }
    return data;
  }, [habits, completions]);

  const distributionData = useMemo(() => {
    const categories = {};
    blocks.forEach(b => {
      categories[b.category] = (categories[b.category] || 0) + (b.end - b.start);
    });
    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    return Object.entries(categories).map(([name, hours]) => ({
      name,
      hours: Math.round(hours * 10) / 10,
      value: total ? Math.round((hours / total) * 100) : 0
    }));
  }, [blocks]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Analytics</h1>
          <p className="text-text-secondary mt-1">Track your discipline progress over time</p>
        </div>
        <div className="flex bg-card rounded-xl p-1 border border-border">
          {['7d', '30d', '90d'].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                range === r ? 'bg-sidebar text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="AVG COMPLETION" value={`${stats.avgCompletion}%`} sub={`Last ${range.replace('d', ' days')}`} />
        <StatCard title="TOTAL COMPLETIONS" value={stats.totalCompletions} sub="Habit check-ins" />
        <StatCard title="TIME LOGGED" value={`${stats.timeLogged}h`} sub="In time blocks" />
        <StatCard title="BEST HABIT" value={stats.bestHabit} sub={`${stats.bestHabitCount} completions`} />
      </div>

      <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
        <h3 className="text-xl font-bold text-text-primary mb-8">Completion Rate - Last 30 Days</h3>
        <div className="h-[300px] w-100%">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#9CA3AF', fontSize: 12}}
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#111827" 
                strokeWidth={2} 
                dot={false}
                activeDot={{ r: 4, fill: '#111827' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold text-text-primary mb-6">Habit Completions</h3>
          {habits.length === 0 ? (
            <p className="text-text-secondary text-sm">No habit data yet.</p>
          ) : (
            <div className="space-y-3">
              {habits.map(h => {
                const count = Object.values(completions).filter(day => day[h.id]).length;
                return (
                  <div key={h.id} className="flex items-center justify-between text-sm">
                    <span className="text-text-primary font-medium">{h.name}</span>
                    <span className="text-text-secondary font-bold">{count}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm min-h-[350px]">
          <h3 className="text-lg font-bold text-text-primary mb-6">Time Distribution</h3>
          <div className="flex flex-col items-center">
            <div className="h-[180px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData.length ? distributionData : [{name: 'Empty', value: 1}]}
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : '#111827'} stroke="#111827" />
                    ))}
                    {!distributionData.length && <Cell fill="#E5E7EB" stroke="#111827" />}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-xl font-bold text-text-primary">{stats.timeLogged}h</span>
              </div>
            </div>
            <div className="mt-6 w-full space-y-2">
              {distributionData.map((item, idx) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: idx === 0 ? '#F59E0B' : '#111827' }} />
                    <span className="text-text-primary font-medium">{item.name}</span>
                  </div>
                  <span className="text-text-secondary font-bold">{item.hours}h ({item.value}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
      <p className="text-[10px] font-bold text-text-secondary tracking-widest uppercase mb-3">{title}</p>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-text-primary">{value}</span>
        <span className="text-xs text-text-secondary mt-1">{sub}</span>
      </div>
    </div>
  );
}
