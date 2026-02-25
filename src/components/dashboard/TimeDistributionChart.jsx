import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const data = [
  { name: 'Work', value: 45, color: '#374151', hours: 18 },
  { name: 'Health', value: 25, color: '#6B7280', hours: 10 },
  { name: 'Learning', value: 20, color: '#9CA3AF', hours: 8 },
  { name: 'Personal', value: 10, color: '#D1D5DB', hours: 4 },
];

export default function TimeDistributionChart() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">Time Distribution by Category</h3>
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-text-primary text-xl font-bold">40 hrs</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2 text-sm">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-text-primary">{item.name}</span>
              <span className="text-text-secondary">• {item.hours} hrs ({item.value}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
