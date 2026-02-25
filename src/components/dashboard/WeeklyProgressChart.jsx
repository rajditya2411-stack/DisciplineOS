import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', value: 80 },
  { day: 'Tue', value: 75 },
  { day: 'Wed', value: 90 },
  { day: 'Thu', value: 85 },
  { day: 'Fri', value: 70 },
  { day: 'Sat', value: 95 },
  { day: 'Sun', value: 88 },
];

export default function WeeklyProgressChart() {
  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">Completion Rate - Last 7 Days</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#374151" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#374151" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
            <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(v) => `${v}%`} />
            <Area type="monotone" dataKey="value" stroke="#374151" strokeWidth={2} fill="url(#fillCompletion)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <p className="text-text-secondary text-sm mt-2">Average: 83%</p>
    </div>
  );
}
