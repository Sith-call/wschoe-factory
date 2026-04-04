import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useApp } from '../stores/AppContext';
import { useNavigate } from 'react-router-dom';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const { state, saveSettings, clearAll, showToast } = useApp();
  const navigate = useNavigate();
  const [deleteStep, setDeleteStep] = useState(0); // 0=none, 1=first confirm, 2=second confirm

  function handleNotificationToggle() {
    saveSettings({
      ...state.settings,
      notificationEnabled: !state.settings.notificationEnabled,
    });
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    saveSettings({
      ...state.settings,
      notificationTime: e.target.value,
    });
  }

  function handleExport() {
    if (state.entries.length === 0) {
      showToast('내보낼 데이터가 없어요.');
      return;
    }

    const data = {
      appName: '퇴근하면 뭐하지?',
      exportedAt: new Date().toISOString(),
      entries: state.entries.map(e => ({
        date: e.date,
        text: e.text,
        prompt: e.promptText,
        createdAt: e.createdAt,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `after-work-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('내보내기 완료.');
  }

  async function handleDelete() {
    if (deleteStep === 0) {
      setDeleteStep(1);
    } else if (deleteStep === 1) {
      setDeleteStep(2);
    } else {
      await clearAll();
      setDeleteStep(0);
      showToast('모든 데이터를 삭제했어요.');
      navigate('/');
    }
  }

  return (
    <div className={styles.page}>
      <PageHeader title="설정" showBack />

      <div className={styles.content}>
        {/* Notification section */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>알림</span>
          <div className={styles.row}>
            <div>
              <span className={styles.rowLabel}>알림 받기</span>
              <span className={styles.rowDesc}>매일 이 시간에 한 줄 쓰기 알림</span>
            </div>
            <button
              className={`${styles.toggle} ${state.settings.notificationEnabled ? styles.toggleOn : ''}`}
              onClick={handleNotificationToggle}
              role="switch"
              aria-checked={state.settings.notificationEnabled}
            >
              <span className={styles.toggleKnob} />
            </button>
          </div>
          {state.settings.notificationEnabled && (
            <div className={styles.row}>
              <span className={styles.rowLabel}>알림 시간</span>
              <input
                type="time"
                className={styles.timeInput}
                value={state.settings.notificationTime}
                onChange={handleTimeChange}
              />
            </div>
          )}
        </div>

        {/* Data section */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>데이터</span>
          <button className={styles.row} onClick={handleExport}>
            <span className={styles.rowLabel}>데이터 내보내기</span>
            <span className={styles.rowArrow}>&rsaquo;</span>
          </button>
          <button className={styles.row} onClick={handleDelete}>
            <span className={styles.rowLabelDanger}>
              {deleteStep === 0 && '모든 데이터 삭제'}
              {deleteStep === 1 && '정말 삭제하시겠어요?'}
              {deleteStep === 2 && '되돌릴 수 없어요. 삭제할까요?'}
            </span>
            <span className={styles.rowArrow}>&rsaquo;</span>
          </button>
        </div>

        {/* Info section */}
        <div className={styles.section}>
          <span className={styles.sectionLabel}>정보</span>
          <div className={styles.row}>
            <span className={styles.rowLabel}>버전</span>
            <span className={styles.rowValue}>1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
