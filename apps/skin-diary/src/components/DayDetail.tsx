import React, { useMemo } from 'react';
import type { SkinRecord, SkinKeyword, Variable, TroubleArea } from '../types';
import { formatDate, getPrevDate } from '../utils/date';
import { KEYWORD_LABELS, VARIABLE_LABELS, SCORE_LABELS, TROUBLE_AREA_LABELS } from '../types';
import { getCustomVariables } from '../utils/storage';

interface Props {
  date: string;
  record?: SkinRecord;
  records: Record<string, SkinRecord>;
  onClose: () => void;
  onEditMorning?: (date: string) => void;
  onEditNight?: (date: string) => void;
}

export function DayDetail({ date, record, records, onClose, onEditMorning, onEditNight }: Props) {
  // Build a variable label resolver that includes custom variables
  const resolveVariableLabel = useMemo(() => {
    const customVars = getCustomVariables();
    const customMap = new Map(customVars.map(v => [v.id, v.label]));
    return (v: string) => VARIABLE_LABELS[v as Variable] || customMap.get(v) || v;
  }, []);

  // The previous night's log affects today's morning
  const prevDate = getPrevDate(date);
  const prevRecord = records[prevDate];

  const morningLog = record?.morningLog;
  const nightLog = record?.nightLog;
  // Show the previous night's log as "cause" for today's morning
  const causativeNightLog = prevRecord?.nightLog;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-inverse-surface/40" />
      <div
        className="relative w-full max-w-[430px] bg-surface rounded-t-[32px] p-6 pb-10 max-h-[80vh] overflow-y-auto no-scrollbar"
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center mb-4">
          <div className="w-10 h-1 bg-outline-variant/30 rounded-full" />
        </div>

        <h2 className="font-headline text-xl font-medium text-on-surface mb-6">
          {formatDate(date)}
        </h2>

        {/* Previous night (cause) */}
        {causativeNightLog && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                전날 밤 기록 (원인)
              </h3>
              {onEditNight && (
                <button onClick={() => onEditNight(prevDate)} className="text-xs text-primary font-medium">
                  수정
                </button>
              )}
            </div>
            <div className="space-y-2">
              {causativeNightLog.products.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">제품</span>
                  <p className="text-sm text-on-surface mt-1">
                    {causativeNightLog.products.join(', ')}
                  </p>
                </div>
              )}
              {causativeNightLog.variables.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">변수</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {causativeNightLog.variables.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-surface-container-highest text-[11px] text-on-surface-variant">
                        {resolveVariableLabel(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {causativeNightLog.memo && (
                <p className="text-xs text-on-surface-variant italic mt-2">{causativeNightLog.memo}</p>
              )}
            </div>
          </section>
        )}

        {/* Morning (result) */}
        {morningLog ? (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                아침 기록 (결과)
              </h3>
              {onEditMorning && (
                <button onClick={() => onEditMorning(date)} className="text-xs text-primary font-medium">
                  수정
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="font-headline text-xl text-white">{morningLog.score}</span>
                </div>
                <span className="text-sm font-medium text-on-surface">{SCORE_LABELS[morningLog.score]}</span>
              </div>
              {morningLog.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {morningLog.keywords.map(kw => (
                    <span key={kw} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                      {KEYWORD_LABELS[kw]}
                    </span>
                  ))}
                </div>
              )}
              {morningLog.troubleAreas && morningLog.troubleAreas.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">트러블 부위</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {morningLog.troubleAreas.map(area => (
                      <span key={area} className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-[11px]">
                        {TROUBLE_AREA_LABELS[area]}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {morningLog.memo && (
                <p className="text-xs text-on-surface-variant italic">{morningLog.memo}</p>
              )}
            </div>
          </section>
        ) : (
          <section className="mb-6">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              아침 기록
            </h3>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <p className="text-sm text-on-surface-variant mb-3">기록이 없어요</p>
              {onEditMorning && (
                <button
                  onClick={() => onEditMorning(date)}
                  className="text-xs font-semibold text-primary"
                >
                  지금 기록하기
                </button>
              )}
            </div>
          </section>
        )}

        {/* Tonight's night log */}
        {nightLog ? (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                오늘 밤 기록
              </h3>
              {onEditNight && (
                <button onClick={() => onEditNight(date)} className="text-xs text-primary font-medium">
                  수정
                </button>
              )}
            </div>
            <div className="space-y-2">
              {nightLog.products.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">제품</span>
                  <p className="text-sm text-on-surface mt-1">{nightLog.products.join(', ')}</p>
                </div>
              )}
              {nightLog.variables.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">변수</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {nightLog.variables.map((v, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-surface-container-highest text-[11px] text-on-surface-variant">
                        {resolveVariableLabel(v)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {nightLog.memo && (
                <p className="text-xs text-on-surface-variant italic mt-2">{nightLog.memo}</p>
              )}
            </div>
          </section>
        ) : (
          <section className="mb-6">
            <h3 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-3">
              밤 기록
            </h3>
            <div className="bg-surface-container-low rounded-xl p-4 text-center">
              <p className="text-sm text-on-surface-variant mb-3">기록이 없어요</p>
              {onEditNight && (
                <button
                  onClick={() => onEditNight(date)}
                  className="text-xs font-semibold text-primary"
                >
                  지금 기록하기
                </button>
              )}
            </div>
          </section>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-surface-container-highest text-on-surface-variant font-body text-sm font-medium"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
