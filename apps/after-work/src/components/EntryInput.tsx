import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import styles from './EntryInput.module.css';

const MAX_LENGTH = 100;

interface EntryInputProps {
  onSave: (text: string) => void;
  initialText?: string;
  isEdit?: boolean;
  onCancel?: () => void;
}

export function EntryInput({ onSave, initialText = '', isEdit = false, onCancel }: EntryInputProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);
  const [saved, setSaved] = useState(false);

  const trimmed = text.trim();
  const canSave = trimmed.length > 0;
  const isWarning = text.length >= 80;

  function handleSave() {
    if (!canSave) return;
    onSave(trimmed);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    if (!isEdit) setText('');
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="한 줄 적기..."
          value={text}
          onChange={e => {
            if (e.target.value.length <= MAX_LENGTH) {
              setText(e.target.value);
            }
          }}
          onKeyDown={handleKeyDown}
          maxLength={MAX_LENGTH}
        />
        <button
          className={`${styles.saveBtn} ${saved ? styles.savedBtn : ''}`}
          onClick={handleSave}
          disabled={!canSave || saved}
          aria-label="저장"
        >
          {saved ? <Check size={18} strokeWidth={1.5} /> : (isEdit ? '수정' : '적기')}
        </button>
      </div>
      <div className={styles.footer}>
        {isEdit && onCancel && (
          <button className={styles.cancelBtn} onClick={onCancel}>취소</button>
        )}
        <span className={`${styles.counter} ${isWarning ? styles.counterWarning : ''}`}>
          {text.length}/{MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
