import { ChevronLeft, ChevronRight, Bell, ChevronDown, Menu, PanelLeftClose, PanelLeftOpen, Calendar as CalendarIcon } from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useState, useRef } from 'react';

export default function TopBar({ title = 'Dashboard', onMenuClick, onToggleSidebar, sidebarOpen }) {
  const { user, initials } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateInputRef = useRef(null);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(new Date(e.target.value));
    }
  };

  return (
    <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Menu (mobile) + Sidebar Toggle + Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-background transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-text-primary" />
        </button>
        
        <button
          type="button"
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 -ml-2 rounded-lg hover:bg-background transition-colors text-text-secondary hover:text-text-primary"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>

        <h1 className="text-text-primary text-2xl font-semibold">{title}</h1>
      </div>

      {/* Center: Date navigator */}
      <div className="hidden md:flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevDay}
          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <div className="relative">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-background text-text-primary text-base font-medium min-w-[240px] justify-center transition-all duration-200"
          >
            <CalendarIcon className="w-4 h-4 text-primary" />
            <span>{formatDate(selectedDate)}</span>
          </button>
          <input
            ref={dateInputRef}
            type="date"
            className="absolute opacity-0 pointer-events-none"
            onChange={handleDateChange}
            value={selectedDate.toISOString().split('T')[0]}
          />
        </div>

        <button
          type="button"
          onClick={handleNextDay}
          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setSelectedDate(new Date())}
          className="ml-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:opacity-90 transition-all duration-200"
        >
          Today
        </button>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <button
          type="button"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-background transition-all duration-200"
        >
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
            {initials}
          </div>
          <span className="hidden sm:block text-sm font-medium text-text-primary">{user.name}</span>
          <ChevronDown className="w-4 h-4 text-text-secondary hidden sm:block" />
        </button>
      </div>
    </header>
  );
}
