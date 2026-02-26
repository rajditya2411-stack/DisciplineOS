import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const pageTitles = {
  '/': 'Dashboard',
  '/habits': 'All Habits',
  '/time-blocks': 'Time Blocks',
  '/analytics': 'Analytics & Insights',
  '/weekly-review': 'Weekly Review',
  '/goals': 'Goals & Templates',
  '/milestones': 'Achievements',
  '/penalties': 'Penalty Tracker',
  '/settings': 'Settings',
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'Dashboard';

  return (
    <div className="min-h-screen bg-background font-sans">
      <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} desktopOpen={sidebarOpen} />
      <div className={`transition-all duration-200 min-h-screen flex flex-col ${sidebarOpen ? 'lg:ml-60' : 'lg:ml-0'}`}>
        <TopBar 
          title={title} 
          onMenuClick={() => setMobileSidebarOpen(true)} 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />
        <main className="flex-1 p-8 min-h-[calc(100vh-72px)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
