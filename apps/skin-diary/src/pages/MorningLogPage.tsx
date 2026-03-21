import React, { useState } from 'react';
import type { SkinKeyword, MorningLog, SkinRecord } from '../types';
import { getToday } from '../utils/date';
import { CloseIcon } from '../components/Icons';
import { ScoreSelector } from '../components/ScoreSelector';
import { KeywordChips } from '../components/KeywordChips';

interface MorningLogPageProps {
  records: Record<string, SkinRecord>;
  onSave: (date: string, morningLog: MorningLog) => void;
  onClose: () => void;
  editDate?: string | null;
}

export function MorningLogPage({ records, onSave, onClose, editDate }: MorningLogPageProps) {
  const targetDate = editDate || getToday();
  const existingLog = records[targetDate]?.morningLog;

  const [score, setScore] = useState<number | null>(existingLog?.score ?? null);
  const [keywords, setKeywords] = useState<SkinKeyword[]>(existingLog?.keywords || []);
  const [memo, setMemo] = useState(existingLog?.memo || '');

  const handleSave = () => {
    if (score === null) return;
    onSave(targetDate, {
      score: score as 1 | 2 | 3 | 4 | 5,
      keywords,
      memo: memo.trim() || undefined,
      loggedAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleClose = () => {
    if (score !== null && !existingLog) {
      if (confirm('저장하지 않고 나갈까요?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-sd-bg overflow-y-auto">
      <div className="max-w-[430px] mx-auto min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-sd-border">
          <button onClick={handleClose} aria-label="닫기" className="text-sd-text">
            <CloseIcon size={22} />
          </button>
          <span className="font-heading text-lg text-sd-text">아침 기록</span>
          <div className="w-[22px]" />
        </div>

        <div className="flex-1 px-5 py-6 space-y-8">
          {/* Score */}
          <div>
            <h2 className="font-heading text-2xl text-sd-text font-bold mb-6">
              오늘 아침 피부는 어때?
            </h2>
            <ScoreSelector value={score} onChange={setScore} />
          </div>

          {/* Keywords */}
          <div>
            <h3 className="font-heading text-lg text-sd-text mb-4">어떤 느낌이야?</h3>
            <KeywordChips selected={keywords} onChange={setKeywords} />
          </div>

          {/* Memo */}
          <div>
            <h3 className="font-heading text-lg text-sd-text mb-3">메모 (선택)</h3>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              placeholder="특이사항이 있다면 적어봐"
              rows={3}
              className="w-full rounded-lg border border-sd-border px-4 py-3 font-body text-sm text-sd-text bg-white focus:outline-none focus:border-sd-primary resize-none"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="px-5 pb-8 pt-4">
          <button
            onClick={handleSave}
            disabled={score === null}
            className="w-full bg-sd-primary text-white rounded-xl px-5 py-3 font-body font-medium disabled:opacity-50"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
}
