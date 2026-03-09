import { useMemo, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Bell, X as XIcon } from 'lucide-react';
import StatCard from '../dashboard/StatCard';
import TimeScheduler from '../dashboard/TimeScheduler';
import HabitChecklist from '../dashboard/HabitChecklist';
import WeeklyProgressChart from '../dashboard/WeeklyProgressChart';
import TimeDistributionChart from '../dashboard/TimeDistributionChart';
import YearHeatmap from '../dashboard/YearHeatmap';
import ActiveSkills from '../dashboard/ActiveSkills';
import MissedLogsWidget from '../dashboard/MissedLogsWidget';
import GoalsWidget from '../dashboard/GoalsWidget';
import NotesWidget from '../dashboard/NotesWidget';
import { useHabits } from '../../context/HabitsContext';
import { useTimeBlocks } from '../../context/TimeBlocksContext';
import { useNotes } from '../../context/NotesContext';

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { habits, completions, getStreak } = useHabits();
  const { blocks } = useTimeBlocks();
  const { notifications, markNotificationRead, clearNotifications } = useNotes();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isToday = selectedDate === todayStr();
  const unreadCount = notifications.filter(n => !n.read).length;

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

  const activeDaysThisMonth = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = now;
    let count = 0;

    for (let d = new Date(monthStart); d <= monthEnd; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      const dayCompletions = completions[dateStr] || {};
      const completedHabits = habits.filter(h => dayCompletions[h.id]).length;
      const doneBlocks = blocks.filter(b => b.date === dateStr && b.done).length;
      if (completedHabits > 0 || doneBlocks > 0) count++;
    }
    return count;
  }, [habits, completions, blocks]);

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
              <CalendarIcon className="w-5 h-5 text-text-secondary" />
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
          
          <div className="relative">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsNotifOpen(!isNotifOpen);
              }}
              className="p-2 bg-background rounded-xl border border-border relative hover:bg-card transition-colors"
            >
              <Bell className="w-5 h-5 text-[#666]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-card">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            
            {isNotifOpen && (
              <>
                <div className="fixed inset-0 z-[60]" onClick={() => setIsNotifOpen(false)}></div>
                <div className="absolute right-0 mt-2 w-80 bg-card border border-border rounded-2xl shadow-2xl z-[70] overflow-hidden">
                  <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                    <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Reminders</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotifications();
                        setIsNotifOpen(false);
                      }} 
                      className="text-[10px] text-danger font-bold uppercase hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-border mx-auto mb-3" />
                        <p className="text-xs text-text-secondary">No reminders yet</p>
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          className={`p-4 border-b border-border last:border-0 hover:bg-background/50 transition-colors cursor-pointer ${!n.read ? 'bg-primary/10' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            markNotificationRead(n.id);
                          }}
                        >
                          <p className={`text-sm ${!n.read ? 'text-text-primary font-bold' : 'text-text-secondary'} break-words`}>{n.text}</p>
                          <p className="text-[10px] text-text-secondary mt-2 uppercase font-bold">{n.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
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
          label="Active Days This Month"
          value={String(activeDaysThisMonth)}
          subtext="Days with completions"
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
        <MissedLogsWidget />
        <GoalsWidget />
        <NotesWidget selectedDate={selectedDate} />
      </div>

      {/* Footer */}
      <footer className="pt-8 pb-4 flex justify-center border-t border-border/50">
        <p className="text-sm font-bold text-black uppercase tracking-widest">
          made by rajditya
        </p>
      </footer>
    </div>
  );
}
