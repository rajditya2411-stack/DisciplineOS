import { ChevronDown, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function TopBar({ title = 'Dashboard', onMenuClick, onToggleSidebar, sidebarOpen }) {
  const { user, initials } = useUser();

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

      {/* Right: User */}
      <div className="flex items-center gap-4">
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
