import { useNavigate, useLocation } from 'react-router-dom';
import { Settings, ArrowLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title?: string;
  showBack?: boolean;
}

export function PageHeader({ title, showBack }: PageHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  if (isHome) {
    return (
      <header className={styles.header}>
        <div className={styles.spacer} />
        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => navigate('/settings')}
            aria-label="설정"
          >
            <Settings size={20} strokeWidth={1.5} />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header className={styles.header}>
      {showBack ? (
        <button
          className={styles.iconBtn}
          onClick={() => navigate('/')}
          aria-label="뒤로"
        >
          <ArrowLeft size={20} strokeWidth={1.5} />
        </button>
      ) : (
        <div className={styles.spacer} />
      )}
      {title && <span className={styles.title}>{title}</span>}
      <div className={styles.spacer} />
    </header>
  );
}
