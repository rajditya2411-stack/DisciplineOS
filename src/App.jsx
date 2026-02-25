import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { HabitsProvider } from './context/HabitsContext';
import { TimeBlocksProvider } from './context/TimeBlocksContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Habits from './components/pages/Habits';
import TimeBlocks from './components/pages/TimeBlocks';
import Analytics from './components/pages/Analytics';
import WeeklyReview from './components/pages/WeeklyReview';
import Goals from './components/pages/Goals';
import MilestonesPage from './components/pages/MilestonesPage';
import Penalties from './components/pages/Penalties';
import Settings from './components/pages/Settings';

export default function App() {
  return (
    <UserProvider>
      <HabitsProvider>
        <TimeBlocksProvider>
          <BrowserRouter>
            <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="habits" element={<Habits />} />
          <Route path="time-blocks" element={<TimeBlocks />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="weekly-review" element={<WeeklyReview />} />
          <Route path="goals" element={<Goals />} />
          <Route path="milestones" element={<MilestonesPage />} />
          <Route path="penalties" element={<Penalties />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
        </TimeBlocksProvider>
      </HabitsProvider>
    </UserProvider>
  );
}
