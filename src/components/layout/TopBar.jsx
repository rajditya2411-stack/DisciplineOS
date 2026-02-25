import { ChevronLeft, ChevronRight, Bell, ChevronDown, Menu } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function TopBar({ title = 'Dashboard', onMenuClick }) {
  const { user, initials } = useUser();
  return (
    <header className="h-[72px] bg-card border-b border-border flex items-center justify-between px-8 sticky top-0 z-30">
      {/* Left: Menu (mobile) + Title */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-background transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-text-primary" />
        </button>
        <h1 className="text-text-primary text-2xl font-semibold">{title}</h1>
      </div>

      {/* Center: Date navigator */}
      <div className="hidden md:flex items-center gap-2">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-text-primary text-base font-medium min-w-[220px] text-center">
          Friday, February 21, 2026
        </span>
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-all duration-200"
          aria-label="Next day"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          type="button"
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
