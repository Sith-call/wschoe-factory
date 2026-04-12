import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar } from 'lucide-react';

const TABS = [
  { path: '/', label: '홈', icon: Home },
  { path: '/calendar', label: '캘린더', icon: Calendar },
] as const;

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-cream border-t border-surface-high flex"
      aria-label="메인 내비게이션"
    >
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path;
        const Icon = tab.icon;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex-1 flex flex-col items-center justify-center py-3 min-h-[56px] transition-colors ${
              isActive
                ? 'text-sage'
                : 'text-on-surface-variant'
            }`}
            aria-current={isActive ? 'page' : undefined}
            aria-label={tab.label}
          >
            <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
            <span className={`text-xs mt-1 ${isActive ? 'font-semibold' : 'font-normal'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
