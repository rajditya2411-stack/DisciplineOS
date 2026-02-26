import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { useMemo } from 'react';

export default function TimeDistributionChart() {
  const { blocks } = useTimeBlocks();

  const data = useMemo(() => {
    const categories = {};
    blocks.forEach(b => {
      categories[b.category] = (categories[b.category] || 0) + (b.end - b.start);
    });
    const total = Object.values(categories).reduce((a, b) => a + b, 0);
    return Object.entries(categories).map(([name, hours]) => ({
      name,
      hours: Math.round(hours * 10) / 10,
      value: total ? Math.round((hours / total) * 100) : 0
    })).sort((a, b) => b.hours - a.hours);
  }, [blocks]);

  const totalHours = useMemo(() => data.reduce((sum, item) => sum + item.hours, 0), [data]);

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 border border-border">
      <h3 className="text-text-primary text-lg font-bold mb-6">Time Distribution</h3>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.length ? data : [{name: 'None', value: 1}]}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={index === 0 ? '#F59E0B' : '#111827'} />
                ))}
                {!data.length && <Cell fill="#E5E7EB" />}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-text-primary text-2xl font-bold">{Math.round(totalHours)}h</span>
          </div>
        </div>
        <div className="flex-1 space-y-3 w-full">
          {data.map((item, idx) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: idx === 0 ? '#F59E0B' : '#111827' }}
                />
                <span className="text-text-primary font-medium">{item.name}</span>
              </div>
              <span className="text-text-secondary font-bold">{item.hours}h ({item.value}%)</span>
            </div>
          ))}
          {data.length === 0 && <p className="text-text-secondary text-center">No logs yet</p>}
        </div>
      </div>
    </div>
  );
}
