import React from 'react';
import type { SkinRecord } from '../types';
import { formatDate, getPrevDate } from '../utils/date';
import { KEYWORD_LABELS, VARIABLE_LABELS, SCORE_LABELS } from '../types';
import type { SkinKeyword, Variable } from '../types';

interface DayDetailProps {
  date: string;
  records: Record<string, SkinRecord>;
  onClose: () => void;
  onEdit?: (date: string) => void;
}

const SCORE_COLORS: Record<number, string> = {
  1: '#e8a0a0',
  2: '#e8c4a0',
  3: '#e8dca0',
  4: '#a0d4a0',
  5: '#7ac27a',
};

export function DayDetail({ date, records, onClose, onEdit }: DayDetailProps) {
  const record = records[date];
  const prevDate = getPrevDate(date);
  const prevRecord = records[prevDate];

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" style={{ opacity: 1, transition: 'opacity 150ms' }} />
      <div
        className="relative bg-sd-bg rounded-t-2xl w-full max-w-[430px] max-h-[70vh] overflow-y-auto p-5 pb-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-sd-border rounded-full mx-auto mb-4" />

        <h3 className="font-heading text-lg text-sd-text mb-4">{formatDate(date)}</h3>

        {record.morningLog && (
          <div className="mb-4">
            <p className="font-body text-sm text-sd-text-secondary mb-2">아침 피부</p>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-number text-sm"
                style={{ backgroundColor: SCORE_COLORS[record.morningLog.score] }}
              >
                {record.morningLog.score}
              </span>
              <span className="font-body text-sm text-sd-text">
                {SCORE_LABELS[record.morningLog.score]}
              </span>
              <span className="font-body text-sm text-sd-text-secondary">
                {record.morningLog.keywords.map(k => KEYWORD_LABELS[k as SkinKeyword]).join(', ')}
              </span>
            </div>
            {record.morningLog.memo && (
              <p className="font-body text-sm text-sd-text-secondary italic">
                "{record.morningLog.memo}"
              </p>
            )}
          </div>
        )}

        {prevRecord?.nightLog && (
          <>
            <div className="border-t border-dashed border-sd-border my-4" />
            <div>
              <p className="font-body text-sm text-sd-text-secondary mb-2">전날 밤 기록</p>
              <p className="font-body text-sm text-sd-text mb-1">
                루틴: {prevRecord.nightLog.products.join(', ')}
              </p>
              {prevRecord.nightLog.variables.length > 0 && (
                <p className="font-body text-sm text-sd-text">
                  생활 변수: {prevRecord.nightLog.variables.map(v => VARIABLE_LABELS[v as Variable]).join(', ')}
                </p>
              )}
            </div>
          </>
        )}

        {record.nightLog && record.nightLog.variables.length > 0 && (
          <>
            <div className="border-t border-dashed border-sd-border my-4" />
            <div>
              <p className="font-body text-sm text-sd-text-secondary mb-2">이 날의 생활 변수</p>
              <div className="flex flex-wrap gap-1.5">
                {record.nightLog.variables.map(v => (
                  <span
                    key={v}
                    className="rounded-full px-3 py-1 text-sm font-body bg-sd-primary-light text-sd-text border border-sd-border"
                  >
                    {VARIABLE_LABELS[v as Variable]}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {!record.morningLog && !prevRecord?.nightLog && (
          <p className="font-body text-sm text-sd-text-secondary">기록이 없습니다</p>
        )}

        {onEdit && (
          <>
            <div className="border-t border-sd-border my-4" />
            <button
              onClick={() => onEdit(date)}
              className="w-full border border-sd-primary text-sd-primary rounded-xl px-5 py-2.5 font-body font-medium text-sm"
            >
              수정하기
            </button>
          </>
        )}
      </div>
    </div>
  );
}
