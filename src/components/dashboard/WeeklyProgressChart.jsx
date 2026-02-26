import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useHabits } from '../../context/HabitsContext';
import { useMemo } from 'react';

export default function WeeklyProgressChart() {
  const { habits, completions } = useHabits();

  const data = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));

    return days.map((label, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayCompletions = completions[dateStr] || {};
      const completedCount = habits.filter(h => dayCompletions[h.id]).length;
      return {
        name: label,
        completed: completedCount,
        pct: habits.length ? Math.round((completedCount / habits.length) * 100) : 0
      };
    });
  }, [habits, completions]);

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
      <h3 className="text-text-primary text-lg font-bold mb-6">Weekly Progress</h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 600}} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#9CA3AF', fontSize: 12}}
              domain={[0, Math.max(habits.length, 5)]}
            />
            <Tooltip 
              cursor={{fill: '#F9FAFB'}}
              contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.pct > 70 ? '#10B981' : '#111827'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
