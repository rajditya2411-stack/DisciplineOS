import { Link, useLocation } from 'react-router-dom';
import { Home, CheckSquare, Clock, BarChart3, Calendar, GraduationCap, Target, Ban, Settings, BookOpen } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Habits', path: '/habits' },
  { icon: Clock, label: 'Time Blocks', path: '/time-blocks' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Calendar, label: 'Weekly Review', path: '/weekly-review' },
  { icon: GraduationCap, label: 'Skills', path: '/skills' },
  { icon: Target, label: 'Goals & Templates', path: '/goals' },
  { icon: BookOpen, label: 'Notes', path: '/notes' },
  { icon: Ban, label: 'Missed Logs', path: '/missed-logs' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar({ isOpen, onClose, desktopOpen = true }) {
  const location = useLocation();
  const { user, initials } = useUser();
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-60 bg-sidebar flex flex-col transition-transform duration-200 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${desktopOpen ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-white text-lg font-bold">Discipline Tracker</h1>
        </div>

        {/* User section */}
        <div className="p-6 flex flex-col items-center gap-3 border-b border-white/10">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-sm">
            {initials}
          </div>
          <div className="text-center">
            <p className="text-white text-sm font-medium">{user.name}</p>
            <p className="text-gray-400 text-xs">Stay Disciplined</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose?.()}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-sidebar-hover text-white border-l-4 border-primary -ml-1 pl-5'
                    : 'text-white/80 hover:bg-sidebar-hover hover:text-white'
                }`}
              >
                <Icon className="w-4.5 h-4.5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
