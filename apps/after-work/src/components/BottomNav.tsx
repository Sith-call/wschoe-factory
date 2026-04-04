import { useNavigate, useLocation } from 'react-router-dom';
import { Home, BookOpen } from 'lucide-react';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isToday = location.pathname === '/';
  const isRecords = location.pathname === '/records';

  // Only show on today and records pages
  if (!isToday && !isRecords) return null;

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.item} ${isToday ? styles.active : ''}`}
        onClick={() => navigate('/')}
      >
        <Home size={18} strokeWidth={1.5} />
        <span className={styles.label}>오늘</span>
      </button>
      <button
        className={`${styles.item} ${isRecords ? styles.active : ''}`}
        onClick={() => navigate('/records')}
      >
        <BookOpen size={18} strokeWidth={1.5} />
        <span className={styles.label}>기록</span>
      </button>
    </nav>
  );
}
