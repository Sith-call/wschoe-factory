import { useState, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PromptDisplay } from '../components/PromptDisplay';
import { CurationCards } from '../components/CurationCards';
import { EntryInput } from '../components/EntryInput';
import { TodayRecord } from '../components/TodayRecord';
import { useApp } from '../stores/AppContext';
import { getTodayString, getWeekStartString } from '../utils/date';
import { dateSeed, seededPickOne, seededPick } from '../utils/random';
import { prompts } from '../data/prompts';
import { curations } from '../data/curations';
import type { CurationCategory } from '../types';
import styles from './TodayPage.module.css';

const ALL_CATEGORIES: CurationCategory[] = ['eat', 'move', 'rest', 'meet', 'learn', 'make', 'watch'];

export function TodayPage() {
  const { state, saveEntry, showToast } = useApp();
  const [editMode, setEditMode] = useState(false);
  const [prefillText, setPrefillText] = useState('');

  const todayStr = getTodayString();
  const seed = dateSeed(todayStr);

  const todayPrompt = useMemo(() => seededPickOne(prompts, seed), [seed]);
  const todayCurations = useMemo(() => {
    const selectedCats = seededPick(ALL_CATEGORIES, 4, seed);
    return selectedCats.map((cat, i) => {
      const catCards = curations.filter(c => c.category === cat);
      return seededPickOne(catCards, seed + i + 1);
    });
  }, [seed]);

  const todayEntry = state.todayEntry;

  const statsLine = useMemo(() => {
    const total = state.entries.length;
    if (total === 0) return null;
    const weekStart = getWeekStartString();
    const weekCount = state.entries.filter(e => e.date >= weekStart).length;
    if (total === 1) return '첫 번째 한 줄.';
    if (weekCount <= 1) return `지금까지 ${total}번째 한 줄.`;
    return `이번 주 ${weekCount}번째 기록.`;
  }, [state.entries]);

  async function handleSave(text: string) {
    const now = new Date().toISOString();
    await saveEntry({
      date: todayStr,
      text,
      promptText: todayPrompt.text,
      curationIds: todayCurations.map(c => c.id),
      createdAt: todayEntry?.createdAt ?? now,
      updatedAt: now,
    });
    setEditMode(false);
    showToast('적었다.');
  }

  const showInput = !todayEntry || editMode;

  return (
    <div className={styles.page}>
      <PageHeader />

      <PromptDisplay text={todayPrompt.text} />

      {!todayEntry && (
        <CurationCards
          cards={todayCurations}
          onPickActivity={(activity) => setPrefillText(activity)}
        />
      )}

      <div className={styles.content}>
        {todayEntry && !editMode ? (
          <>
            <TodayRecord entry={todayEntry} onTap={() => setEditMode(true)} />
            {statsLine && <p className={styles.statsMsg}>{statsLine}</p>}
          </>
        ) : null}

        {showInput && (
          <EntryInput
            onSave={handleSave}
            initialText={editMode && todayEntry ? todayEntry.text : prefillText}
            isEdit={editMode}
            onCancel={editMode ? () => setEditMode(false) : undefined}
          />
        )}
      </div>
    </div>
  );
}
