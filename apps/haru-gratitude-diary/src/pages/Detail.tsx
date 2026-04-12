import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getEntryByDate, saveEntry, deleteEntry } from '../utils/storage';
import { formatDateKorean, parseDate } from '../utils/date-helpers';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Detail() {
  const navigate = useNavigate();
  const { date } = useParams<{ date: string }>();
  const entry = date ? getEntryByDate(date) : undefined;

  const [editing, setEditing] = useState(false);
  const [editItems, setEditItems] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!date || !entry) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-5">
        <p className="text-sm text-on-surface-variant mb-4">기록을 찾을 수 없어요</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-sage"
        >
          돌아가기
        </button>
      </div>
    );
  }

  const dateStr = date;
  const displayDate = parseDate(dateStr);

  function startEdit() {
    const padded = [...entry!.items];
    while (padded.length < 3) padded.push('');
    setEditItems(padded);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
    setEditItems([]);
  }

  function handleSaveEdit() {
    const toSave = editItems.map((s) => s.trim()).filter((s) => s.length > 0);
    if (toSave.length === 0) return;
    saveEntry(dateStr, toSave);
    setEditing(false);
    setToast('수정했어요');
  }

  function handleDelete() {
    deleteEntry(dateStr);
    setDeleteConfirm(false);
    navigate(-1);
  }

  const handleEditChange = useCallback(
    (index: number, value: string) => {
      setEditItems((prev) => {
        const next = [...prev];
        next[index] = value;
        return next;
      });
    },
    [],
  );

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <header className="flex items-center px-4 pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-on-surface"
          aria-label="뒤로가기"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-sm font-semibold text-on-surface">
          {formatDateKorean(displayDate)}
        </h1>
        {!editing ? (
          <button
            onClick={startEdit}
            className="text-sm font-medium text-sage py-2 px-3 min-h-[44px]"
          >
            수정
          </button>
        ) : (
          <div className="w-[52px]" />
        )}
      </header>

      {/* Content */}
      <main className="flex-1 px-5 pt-6">
        <ul className="space-y-4">
          {(editing ? editItems : entry.items).map((item, i) => (
            <li key={i} className="flex gap-3">
              <span className="text-sage font-semibold text-lg w-5 text-right shrink-0 mt-0.5">
                {i + 1}
              </span>
              {editing ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleEditChange(i, e.target.value)}
                  className="flex-1 bg-surface-low border border-surface-high rounded-lg px-4 py-3 text-sm text-on-surface focus:border-sage transition-colors"
                  aria-label={`감사한 일 ${i + 1} 수정`}
                />
              ) : (
                <span className="text-sm text-on-surface leading-relaxed pt-0.5">
                  {item}
                </span>
              )}
            </li>
          ))}
        </ul>

        {editing && (
          <div className="flex gap-3 mt-8">
            <button
              onClick={cancelEdit}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-surface-high text-on-surface-variant min-h-[48px]"
            >
              취소
            </button>
            <button
              onClick={handleSaveEdit}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-sage text-sage-light min-h-[48px]"
            >
              저장
            </button>
          </div>
        )}
      </main>

      {/* Delete button */}
      {!editing && (
        <div className="px-5 pb-8 pt-4">
          <button
            onClick={() => setDeleteConfirm(true)}
            className="text-sm font-medium text-danger py-2 min-h-[44px]"
          >
            삭제
          </button>
        </div>
      )}

      <ConfirmDialog
        open={deleteConfirm}
        title="기록 삭제"
        message="이 날의 기록을 삭제할까요? 되돌릴 수 없어요."
        confirmLabel="삭제"
        danger
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(false)}
      />

      {toast && (
        <Toast
          message={toast}
          visible={!!toast}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
