import { useState, useRef, useCallback } from 'react';
import { getGrade, getGradeBadgeTextColor } from '../utils/score';
import type { GameResult } from '../hooks/useStorage';

interface ShareCardProps {
  result: GameResult;
  onClose: () => void;
}

export default function ShareCard({ result, onClose }: ShareCardProps) {
  const [toast, setToast] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const gradeInfo = getGrade(result.score);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleCopyLink = useCallback(async () => {
    const text = `[컬러 감각 테스트]\n나의 색 감각: ${gradeInfo.grade}등급 (상위 ${result.percentile}%)\n점수: ${result.score.toLocaleString()}점\n\n컬러 감각 테스트에서 확인해보세요!\nhttps://color-sense.app`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('복사되었습니다');
    } catch {
      showToast('복사에 실패했습니다');
    }
  }, [gradeInfo, result, showToast]);

  const handleSaveImage = useCallback(async () => {
    // Use html2canvas-like approach: create a canvas from the card
    // For MVP, we'll use clipboard text as fallback
    if (!cardRef.current) return;

    try {
      // Attempt to use the Canvas API to capture
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        showToast('이미지 저장을 지원하지 않는 환경입니다');
        return;
      }

      // Simple SVG-based capture
      const cardEl = cardRef.current;
      const width = cardEl.offsetWidth * 2;
      const height = cardEl.offsetHeight * 2;
      canvas.width = width;
      canvas.height = height;

      // Draw background
      ctx.scale(2, 2);
      ctx.fillStyle = '#1e1b2e';
      ctx.roundRect(0, 0, cardEl.offsetWidth, cardEl.offsetHeight, 12);
      ctx.fill();

      // Draw text content
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.font = '14px sans-serif';
      ctx.fillText('컬러 감각 테스트', 24, 36);

      ctx.fillStyle = gradeInfo.badgeColor;
      ctx.roundRect(24, 52, 56, 56, 8);
      ctx.fill();

      ctx.fillStyle = getGradeBadgeTextColor(gradeInfo.grade);
      ctx.font = 'bold 22px Archivo, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(gradeInfo.grade, 52, 87);
      ctx.textAlign = 'left';

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(`상위 ${result.percentile}%`, 24, 140);

      ctx.font = '600 20px Archivo, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(`${result.score.toLocaleString()}점`, 24, 170);

      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('당신의 눈은 몇 등급?', 24, 210);

      canvas.toBlob((blob) => {
        if (!blob) {
          showToast('이미지 생성에 실패했습니다');
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `color-sense-${gradeInfo.grade}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('저장되었습니다');
      });
    } catch {
      showToast('이미지 저장에 실패했습니다');
    }
  }, [gradeInfo, result, showToast]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      onClick={handleOverlayClick}
    >
      <div
        className={`w-full max-w-[480px] bg-white rounded-t-2xl pb-8 ${
          isClosing ? 'modal-exit' : 'modal-enter'
        }`}
      >
        <div className="px-5 pt-5">
          {/* Share card preview */}
          <div
            ref={cardRef}
            className="w-full rounded-xl p-6 mb-5"
            style={{
              backgroundColor: '#1e1b2e',
              aspectRatio: '4/5',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* App name */}
            <p
              className="text-sm text-white/70"
              style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
            >
              컬러 감각 테스트
            </p>

            {/* Badge + result */}
            <div>
              <div
                className="w-16 h-16 flex items-center justify-center rounded-lg mb-4"
                style={{ backgroundColor: gradeInfo.badgeColor }}
              >
                <span
                  className="text-2xl font-bold"
                  style={{
                    fontFamily: "'Archivo', system-ui",
                    color: getGradeBadgeTextColor(gradeInfo.grade),
                  }}
                >
                  {gradeInfo.grade}
                </span>
              </div>

              <p
                className="text-3xl font-bold text-white mb-1"
                style={{ fontFamily: "'Wanted Sans Variable', sans-serif" }}
              >
                상위 {result.percentile}%
              </p>

              <p
                className="text-xl font-semibold text-white/70 font-tabular"
                style={{ fontFamily: "'Archivo', system-ui" }}
              >
                {result.score.toLocaleString()}점
              </p>
            </div>

            {/* CTA text */}
            <div>
              <p className="text-base text-white mb-1">당신의 눈은 몇 등급?</p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex flex-col gap-2.5">
            <button
              onClick={handleSaveImage}
              className="w-full py-2.5 rounded-lg text-[15px] font-medium bg-[#f4f4f5] text-[#18181b]"
            >
              이미지 저장
            </button>

            <button
              onClick={handleCopyLink}
              className="w-full py-2.5 rounded-lg text-[15px] font-medium bg-[#f4f4f5] text-[#18181b]"
            >
              링크 복사
            </button>
          </div>

          {/* Close */}
          <button
            onClick={handleClose}
            className="w-full mt-4 py-2 text-sm text-[#a1a1aa] text-center"
          >
            닫기
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#18181b] text-white text-sm px-4 py-2 rounded-lg z-60">
          {toast}
        </div>
      )}
    </div>
  );
}
