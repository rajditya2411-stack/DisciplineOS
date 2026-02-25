import StatCard from '../components/dashboard/StatCard';
import TimeScheduler from '../components/dashboard/TimeScheduler';
import HabitChecklist from '../components/dashboard/HabitChecklist';
import WeeklyProgressChart from '../components/dashboard/WeeklyProgressChart';
import TimeDistributionChart from '../components/dashboard/TimeDistributionChart';
import YearHeatmap from '../components/dashboard/YearHeatmap';
import ActiveGoals from '../components/dashboard/ActiveGoals';
import MoneyAtStake from '../components/dashboard/MoneyAtStake';
import Milestones from '../components/dashboard/Milestones';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Row 1 - Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Habits" value="12" trend="↗ +2 this week" />
        <StatCard
          label="Completed Today"
          progress={67}
          centerValue="8/12"
          progressLabel=""
        />
        <StatCard
          label="Best Streak"
          value="23"
          subtext="Morning Workout"
          icon="🔥"
        />
        <StatCard
          label="Weekly Goal"
          progress={80}
          progressLabel="32/40 habits"
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
