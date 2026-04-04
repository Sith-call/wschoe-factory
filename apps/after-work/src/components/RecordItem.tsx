import { useState, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import type { Entry } from '../types';
import { formatTime } from '../utils/date';
import { EntryInput } from './EntryInput';
import styles from './RecordItem.module.css';

interface RecordItemProps {
  entry: Entry;
  onUpdate: (entry: Entry) => void;
  onDelete: (date: string) => void;
}

export function RecordItem({ entry, onUpdate, onDelete }: RecordItemProps) {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTouchStart() {
    longPressTimer.current = setTimeout(() => {
      setShowDropdown(true);
    }, 600);
  }

  function handleTouchEnd() {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }

  function handleSave(text: string) {
    onUpdate({
      ...entry,
      text,
      updatedAt: new Date().toISOString(),
    });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className={styles.editWrapper}>
        <EntryInput
          initialText={entry.text}
          isEdit
          onSave={handleSave}
          onCancel={() => setEditing(false)}
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={styles.item}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onContextMenu={e => { e.preventDefault(); setShowDropdown(true); }}
      >
        <div className={styles.itemHeader}>
          <p className={styles.text}>&ldquo;{entry.text}&rdquo;</p>
          <button
            className={styles.moreBtn}
            onClick={e => { e.stopPropagation(); setShowDropdown(prev => !prev); }}
            aria-label="더보기"
          >
            <MoreHorizontal size={18} strokeWidth={1.5} />
          </button>
        </div>
        <div className={styles.meta}>
          <span className={styles.prompt}>{entry.promptText}</span>
          <span className={styles.time}>{formatTime(entry.createdAt)}</span>
        </div>

        {showDropdown && (
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownItem}
              onClick={() => { setShowDropdown(false); setEditing(true); }}
            >
              수정
            </button>
            <button
              className={`${styles.dropdownItem} ${styles.dropdownDanger}`}
              onClick={() => { setShowDropdown(false); setShowDeleteConfirm(true); }}
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className={styles.overlay} onClick={() => setShowDeleteConfirm(false)}>
          <div className={styles.confirmSheet} onClick={e => e.stopPropagation()}>
            <p className={styles.confirmText}>이 기록을 삭제할까요?</p>
            <p className={styles.confirmSub}>되돌릴 수 없어요.</p>
            <div className={styles.confirmActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeleteConfirm(false)}
              >
                취소
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  onDelete(entry.date);
                  setShowDeleteConfirm(false);
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
