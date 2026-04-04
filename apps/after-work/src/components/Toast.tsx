import { useApp } from '../stores/AppContext';
import styles from './Toast.module.css';

export function Toast() {
  const { state } = useApp();

  if (!state.toastMessage) return null;

  return (
    <div className={styles.toast}>
      {state.toastMessage}
    </div>
  );
}
