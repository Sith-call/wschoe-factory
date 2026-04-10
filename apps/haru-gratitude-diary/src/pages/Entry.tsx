import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getEntryByDate, saveEntry, getAllEntries } from '../utils/storage';
import { formatDateKorean, toDateString, parseDate } from '../utils/date-helpers';
import Toast from '../components/Toast';

const SAVE_MESSAGES = [
  '오늘의 감사를 기록했어요',
  '따뜻한 하루 되세요',
  '감사를 적는 당신이 멋져요',
  '소중한 기록이에요',
  '오늘도 감사한 하루였네요',
];

function getSaveMessage(): string {
  const idx = Math.floor(Math.random() * SAVE_MESSAGES.length);
  return SAVE_MESSAGES[idx];
}

const PROMPT_SETS = [
  ['오늘 나를 웃게 한 순간은?', '고마웠던 사람이 있나요?', '작지만 좋았던 일은?'],
  ['오늘 맛있게 먹은 건 뭔가요?', '마음이 따뜻해진 순간은?', '나를 위해 한 일은?'],
  ['오늘 배운 것이 있나요?', '감사하게 느낀 풍경은?', '내일이 기대되는 이유는?'],
  ['누군가에게 도움을 받았나요?', '편안하게 쉴 수 있었던 순간은?', '오늘 해낸 일은?'],
  ['웃긴 일이 있었나요?', '자연에서 느낀 감사는?', '소소하지만 확실한 행복은?'],
];

function getTodayPrompts(): string[] {
  const idx = new Date().getDate() % PROMPT_SETS.length;
  return PROMPT_SETS[idx];
}

export default function Entry() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const targetDate = dateParam || toDateString(new Date());
  const displayDate = parseDate(targetDate);

  const [items, setItems] = useState<string[]>(['', '', '']);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const firstInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const existing = getEntryByDate(targetDate);
    if (existing) {
      const padded = [...existing.items];
      while (padded.length < 3) padded.push('');
      setItems(padded);
    }
  }, [targetDate]);

  useEffect(() => {
    const timer = setTimeout(() => firstInput.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const filledItems = items.filter((s) => s.trim().length > 0);
  const canSave = filledItems.length >= 1;

  const handleSave = useCallback(() => {
    if (!canSave) return;
    const toSave = items.map((s) => s.trim()).filter((s) => s.length > 0);
    saveEntry(targetDate, toSave);
    setToastMsg(getSaveMessage());
    setTimeout(() => navigate('/', { replace: true }), 1200);
  }, [canSave, items, targetDate, navigate]);

  const handleBack = () => {
    const hasContent = items.some((s) => s.trim().length > 0);
    if (hasContent) {
      if (window.confirm('작성 중인 내용이 있어요. 나갈까요?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-4 pb-2">
        <button
          onClick={handleBack}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-on-surface pr-11">
          {formatDateKorean(displayDate)}
        </h1>
      </header>

      {/* Input fields */}
      <main className="flex-1 px-5 pt-6 space-y-4">
        {items.map((value, i) => (
          <div key={i} className="flex items-start gap-3">
            <span className="text-sage font-semibold text-lg mt-2.5 w-5 text-right shrink-0">
              {i + 1}
            </span>
            <input
              ref={i === 0 ? firstInput : undefined}
              type="text"
              value={value}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && i < 2) {
                  e.preventDefault();
                  const next = document.querySelector<HTMLInputElement>(
                    `[data-entry-index="${i + 1}"]`,
                  );
                  next?.focus();
                }
                if (e.key === 'Enter' && i === 2 && canSave) {
                  handleSave();
                }
              }}
              data-entry-index={i}
              placeholder={getTodayPrompts()[i] || '감사한 일을 적어보세요'}
              className="flex-1 bg-surface-low border border-surface-high rounded-lg px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-sage transition-colors"
              aria-label={`감사한 일 ${i + 1}`}
            />
          </div>
        ))}
      </main>

      {/* Save button */}
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold min-h-[48px] transition-colors ${
            canSave
              ? 'bg-sage text-sage-light'
              : 'bg-surface-high text-on-surface-variant/50 cursor-not-allowed'
          }`}
        >
          저장
        </button>
      </div>

      {toastMsg && (
        <Toast message={toastMsg} visible={!!toastMsg} onClose={() => setToastMsg(null)} />
      )}
    </div>
  );
}
