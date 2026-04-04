import { Pencil } from 'lucide-react';
import type { Entry } from '../types';
import { formatTime } from '../utils/date';
import styles from './TodayRecord.module.css';

interface TodayRecordProps {
  entry: Entry;
  onTap?: () => void;
}

export function TodayRecord({ entry, onTap }: TodayRecordProps) {
  return (
    <div className={styles.card} onClick={onTap} role={onTap ? 'button' : undefined}>
      <p className={styles.text}>&ldquo;{entry.text}&rdquo;</p>
      <div className={styles.footer}>
        <span className={styles.time}>{formatTime(entry.createdAt)}</span>
        {onTap && (
          <span className={styles.editHint}>
            <Pencil size={14} strokeWidth={1.5} />
          </span>
        )}
      </div>
    </div>
  );
}
