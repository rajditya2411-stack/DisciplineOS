import { useMemo } from 'react';

const heatColors = ['#EBEDF0', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#374151'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Mon', 'Wed', 'Fri'];

// Generate random placeholder data: 52 weeks x 7 days
function generateHeatmapData() {
  const grid = [];
  for (let week = 0; week < 52; week++) {
    const row = [];
    for (let day = 0; day < 7; day++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.7) level = 4;
      else if (rand > 0.5) level = 3;
      else if (rand > 0.3) level = 2;
      else if (rand > 0.15) level = 1;
      row.push(level);
    }
    grid.push(row);
  }
  return grid;
}

export default function YearHeatmap() {
  const grid = useMemo(() => generateHeatmapData(), []);

  return (
    <div className="bg-card rounded-2xl shadow-card p-6 transition-all duration-200">
      <h3 className="text-text-primary text-base font-semibold mb-4">Year in Review - Completion Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col justify-around pr-2 text-text-secondary text-xs font-medium">
            {days.map((d) => (
              <span key={d} className="h-3 leading-tight">{d}</span>
            ))}
          </div>
          {/* Grid */}
          <div className="flex gap-0.5">
            {grid.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-0.5">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className="w-3 h-3 rounded-sm hover:ring-2 hover:ring-primary/50 cursor-default transition-all"
                    style={{ backgroundColor: heatColors[level] }}
                    title={`Week ${wi + 1}, Day ${di + 1} • ${level * 25}% • ${level * 2 + 2} habits`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Month labels - simplified */}
        <div className="flex gap-8 mt-2 pl-8 text-text-secondary text-xs">
          {months.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 mt-4 text-text-secondary text-xs">
        <span>Less</span>
        <div className="flex gap-0.5">
          {heatColors.map((c, i) => (
            <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />
          ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
