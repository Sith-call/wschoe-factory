import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { deleteAllEntries } from '../utils/storage';
import { generateDemoData } from '../utils/demo-data';
import Toast from '../components/Toast';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Settings() {
  const navigate = useNavigate();
  const [toast, setToast] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  function handleGenerateDemo() {
    generateDemoData();
    setToast('데모 데이터를 만들었어요');
  }

  function handleDeleteAll() {
    deleteAllEntries();
    setDeleteConfirm(false);
    setToast('모든 데이터를 삭제했어요');
    setTimeout(() => navigate('/', { replace: true }), 1200);
  }

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
        <h1 className="flex-1 text-center text-sm font-semibold text-on-surface pr-11">
          설정
        </h1>
      </header>

      <main className="flex-1 px-5 pt-6 space-y-6">
        {/* Data management */}
        <section>
          <h2 className="text-xs font-medium text-on-surface-variant mb-3">데이터 관리</h2>
          <div className="space-y-3">
            <button
              onClick={handleGenerateDemo}
              className="w-full text-left bg-surface-low border border-surface-high rounded-lg px-4 py-3.5 text-sm font-medium text-on-surface min-h-[48px]"
            >
              데모 데이터 생성
              <span className="block text-xs text-on-surface-variant font-normal mt-0.5">
                주간 회고 체험용 샘플 데이터를 만들어요
              </span>
            </button>

            <button
              onClick={() => setDeleteConfirm(true)}
              className="w-full text-left bg-surface-low border border-surface-high rounded-lg px-4 py-3.5 text-sm font-medium text-danger min-h-[48px]"
            >
              모든 데이터 삭제
              <span className="block text-xs text-on-surface-variant font-normal mt-0.5">
                모든 감사 기록을 삭제해요. 되돌릴 수 없어요.
              </span>
            </button>
          </div>
        </section>

        {/* App info */}
        <section>
          <h2 className="text-xs font-medium text-on-surface-variant mb-3">앱 정보</h2>
          <div className="bg-surface-low border border-surface-high rounded-lg px-4 py-3.5">
            <p className="text-sm font-medium text-on-surface">하루 감사 일기</p>
            <p className="text-xs text-on-surface-variant mt-1">
              매일 감사한 일 3가지를 기록하고, 주간 회고로 나를 발견하세요.
            </p>
            <p className="text-xs text-on-surface-variant mt-2">v1.0.0</p>
          </div>
        </section>
      </main>

      <ConfirmDialog
        open={deleteConfirm}
        title="모든 데이터 삭제"
        message="모든 감사 기록이 삭제돼요. 되돌릴 수 없어요."
        confirmLabel="삭제"
        danger
        onConfirm={handleDeleteAll}
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
