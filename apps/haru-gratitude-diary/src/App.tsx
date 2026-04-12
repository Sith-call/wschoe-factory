import { Routes, Route, Navigate } from 'react-router-dom';
import { isOnboardingSeen } from './utils/storage';
import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Entry from './pages/Entry';
import CalendarPage from './pages/CalendarPage';
import Detail from './pages/Detail';
import WeeklyReflection from './pages/WeeklyReflection';
import Settings from './pages/Settings';

function OnboardingGuard() {
  if (!isOnboardingSeen()) {
    return <Onboarding />;
  }
  return <Home />;
}

export default function App() {
  return (
    <div className="max-w-[430px] mx-auto min-h-screen bg-cream relative">
      <Routes>
        <Route path="/" element={<OnboardingGuard />} />
        <Route path="/entry" element={<Entry />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/detail/:date" element={<Detail />} />
        <Route path="/weekly" element={<WeeklyReflection />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
