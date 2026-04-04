import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { WeeklyCard } from '../components/WeeklyCard';
import { RecordItem } from '../components/RecordItem';
import { useApp } from '../stores/AppContext';
import { formatDateKorean } from '../utils/date';
import styles from './RecordsPage.module.css';

export function RecordsPage() {
  const navigate = useNavigate();
  const { state, saveEntry, removeEntry, showToast } = useApp();
  const entries = state.entries;

  const grouped = useMemo(() => {
    const groups: { date: string; label: string; entry: typeof entries[0] }[] = [];
    entries.forEach(entry => {
      groups.push({
        date: entry.date,
        label: formatDateKorean(entry.date),
        entry,
      });
    });
    return groups;
  }, [entries]);

  async function handleUpdate(entry: typeof entries[0]) {
    await saveEntry(entry);
    showToast('수정했다.');
  }

  async function handleDelete(date: string) {
    await removeEntry(date);
    showToast('삭제했다.');
  }

  return (
    <div className={styles.page}>
      <PageHeader title="기록" showBack />

      <div className={styles.content}>
        {entries.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyMain}>아직 없어요.</p>
            <button
              className={styles.emptyLink}
              onClick={() => navigate('/')}
            >
              첫 한 줄은 오늘 화면에서.
            </button>
          </div>
        ) : (
          <>
            <WeeklyCard entries={entries} />

            {grouped.map(({ date, label, entry }) => (
              <div key={date}>
                <div className={styles.dateDivider}>
                  <span className={styles.dateLabel}>{label}</span>
                </div>
                <RecordItem
                  entry={entry}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
