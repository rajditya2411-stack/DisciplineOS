import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import TimeScheduler from '../dashboard/TimeScheduler';
import HabitChecklist from '../dashboard/HabitChecklist';
import WeeklyProgressChart from '../dashboard/WeeklyProgressChart';
import TimeDistributionChart from '../dashboard/TimeDistributionChart';
import YearHeatmap from '../dashboard/YearHeatmap';
import ActiveSkills from '../dashboard/ActiveSkills';
import MoneyAtStake from '../dashboard/MoneyAtStake';
import GoalsWidget from '../dashboard/GoalsWidget';
import NotesWidget from '../dashboard/NotesWidget';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { habits, completions, getStreak } = useHabits();
  const { getTotalHoursForDate } = useTimeBlocks();
  const [selectedDate, setSelectedDate] = useState(todayStr());

  const isToday = selectedDate === todayStr();

  const completedToday = useMemo(() => {
    const day = completions[selectedDate] || {};
    return habits.filter((h) => day[h.id]).length;
  }, [habits, completions, selectedDate]);

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

  const totalScheduled = getTotalHoursForDate(selectedDate);

  const formatDate = (dateString) => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const changeDate = (days) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    setSelectedDate(d.toISOString().slice(0, 10));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Date Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider">
              {isToday ? "Today's Overview" : "Schedule Overview"}
            </h2>
            <p className="text-xs text-text-secondary font-medium">{formatDate(selectedDate)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-background rounded-xl p-1 border border-border">
            <button 
              onClick={() => changeDate(-1)}
              className="p-1.5 hover:bg-card rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <input 
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-text-primary px-2 outline-none cursor-pointer"
            />
            <button 
              onClick={() => changeDate(1)}
              className="p-1.5 hover:bg-card rounded-lg transition-colors text-text-secondary hover:text-text-primary"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          {!isToday && (
            <button 
              onClick={() => setSelectedDate(todayStr())}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-sm hover:opacity-90 transition-all"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Row 1 - Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard label="Total Habits" value={String(totalHabits)} />
        <StatCard
          label={isToday ? "Completed Today" : "Completed on Date"}
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
          label={isToday ? "Scheduled Today" : "Scheduled on Date"}
          progress={totalScheduled <= 0 ? 0 : Math.min(100, Math.round(totalScheduled * 10))}
          progressLabel={`${totalScheduled.toFixed(1)} hrs`}
          largeRing
        />
      </div>

      {/* Row 2 - Scheduler + Habits */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-6 items-start">
        <TimeScheduler selectedDate={selectedDate} />
        <HabitChecklist selectedDate={selectedDate} />
      </div>

      {/* Row 3 - Charts */}
      {isToday && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <WeeklyProgressChart />
          <TimeDistributionChart />
        </div>
      )}

      {/* Row 4 - Heatmap */}
      <div className="w-full overflow-hidden">
        <YearHeatmap />
      </div>

      {/* Row 5 - Bottom widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ActiveSkills />
        <MoneyAtStake />
        <GoalsWidget />
        <NotesWidget selectedDate={selectedDate} />
      </div>
    </div>
  );
}
