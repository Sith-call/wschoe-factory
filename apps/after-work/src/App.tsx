import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './stores/AppContext';
import { TodayPage } from './pages/TodayPage';
import { RecordsPage } from './pages/RecordsPage';
import { SettingsPage } from './pages/SettingsPage';
import { Toast } from './components/Toast';
import { BottomNav } from './components/BottomNav';

export function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
        <Toast />
      </HashRouter>
    </AppProvider>
  );
}
