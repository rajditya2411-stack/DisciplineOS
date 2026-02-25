import { useMemo } from 'react';
import StatCard from '../dashboard/StatCard';
import TimeScheduler from '../dashboard/TimeScheduler';
import HabitChecklist from '../dashboard/HabitChecklist';
import WeeklyProgressChart from '../dashboard/WeeklyProgressChart';
import TimeDistributionChart from '../dashboard/TimeDistributionChart';
import YearHeatmap from '../dashboard/YearHeatmap';
import ActiveGoals from '../dashboard/ActiveGoals';
import MoneyAtStake from '../dashboard/MoneyAtStake';
import Milestones from '../dashboard/Milestones';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { habits, completions, getStreak } = useHabits();
  const { getBlocksForDate, getTotalHoursForDate } = useTimeBlocks();
  const date = todayStr();

  const completedToday = useMemo(() => {
    const day = completions[date] || {};
    return habits.filter((h) => day[h.id]).length;
  }, [habits, completions, date]);

  const totalHabits = habits.length;
  const completedPct = totalHabits ? Math.round((completedToday / totalHabits) * 100) : 0;

  const bestStreak = useMemo(() => {
    if (habits.length === 0) return { value: 0, name: null };
    let max = 0;
    let name = null;
    habits.forEach((h) => {
      const s = getStreak(h.id);
      if (s > max) {
        max = s;
        name = h.name;
      }
    });
    return { value: max, name };
  }, [habits, getStreak]);

  const totalScheduled = getTotalHoursForDate(date);
  const weeklyGoalLabel = totalHabits
    ? `${completedToday}/${totalHabits} today`
    : '0/0 today';

  return (
    <div className="space-y-8">
      {/* Row 1 - Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Habits" value={String(totalHabits)} />
        <StatCard
          label="Completed Today"
          progress={completedPct}
          centerValue={`${completedToday}/${totalHabits}`}
          progressLabel=""
        />
        <StatCard
          label="Best Streak"
          value={String(bestStreak.value)}
          subtext={bestStreak.name || '—'}
          icon="🔥"
        />
        <StatCard
          label="Scheduled Today"
          progress={totalScheduled <= 0 ? 0 : Math.min(100, Math.round(totalScheduled * 10))}
          progressLabel={`${totalScheduled.toFixed(1)} hrs`}
          largeRing
        />
      </div>

      {/* Row 2 - Scheduler + Habits */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6">
        <TimeScheduler />
        <HabitChecklist />
      </div>

      {/* Row 3 - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProgressChart />
        <TimeDistributionChart />
      </div>

      {/* Row 4 - Heatmap */}
      <YearHeatmap />

      {/* Row 5 - Bottom widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ActiveGoals />
        <MoneyAtStake />
        <Milestones />
      </div>
    </div>
  );
}
