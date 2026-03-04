import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { HabitsProvider } from './context/HabitsContext';
import { TimeBlocksProvider } from './context/TimeBlocksContext';
import { SkillsProvider } from './context/SkillsContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/pages/Dashboard';
import Habits from './components/pages/Habits';
import TimeBlocks from './components/pages/TimeBlocks';
import Analytics from './components/pages/Analytics';
import WeeklyReview from './components/pages/WeeklyReview';
import Skills from './components/pages/Skills';
import GoalsTemplates from './components/pages/GoalsTemplates';
import { GoalsProvider } from './context/GoalsContext';
import { NotesProvider } from './context/NotesContext';
import MissedLogs from './components/pages/MissedLogs';
import Settings from './components/pages/Settings';

export default function App() {
  return (
    <UserProvider>
      <HabitsProvider>
        <TimeBlocksProvider>
          <SkillsProvider>
            <GoalsProvider>
              <NotesProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="habits" element={<Habits />} />
                      <Route path="time-blocks" element={<TimeBlocks />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="weekly-review" element={<WeeklyReview />} />
                      <Route path="skills" element={<Skills />} />
                      <Route path="goals" element={<GoalsTemplates />} />
                      <Route path="missed-logs" element={<MissedLogs />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                  </Routes>
                </BrowserRouter>
              </NotesProvider>
            </GoalsProvider>
          </SkillsProvider>
        </TimeBlocksProvider>
      </HabitsProvider>
    </UserProvider>
  );
}
