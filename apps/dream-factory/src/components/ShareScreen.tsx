import type { DreamEntry } from '../types';
import DreamIconComposition from './DreamIconComposition';

interface Props {
  entry: DreamEntry;
  onBack: () => void;
}

export default function ShareScreen({ entry, onBack }: Props) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
    alert('링크가 복사되었습니다!');
  };

  const handleKakaoShare = () => {
    alert('카카오톡 공유 기능은 실제 배포 후 사용 가능합니다.');
  };

  const handleSaveImage = () => {
    alert('이미지 저장 기능은 추후 업데이트 예정입니다.');
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col items-center screen-enter">
      {/* TopAppBar */}
      <header className="flex items-center w-full px-6 py-4 bg-transparent fixed top-0 z-50 max-w-[430px]">
        <button onClick={onBack} className="text-indigo-200 hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined text-3xl">arrow_back</span>
        </button>
        <h1 className="ml-4 font-headline text-lg tracking-wide text-indigo-200">꿈 공유하기</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-[430px] pt-24 pb-32 px-6">
        {/* Dream Card Hero */}
        <div className="relative group">
          {/* Asymmetrical Glow */}
          <div className="absolute -inset-4 bg-primary-container/20 blur-[64px] rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-1000"></div>

          {/* The Card */}
          <div className="relative w-full aspect-[430/640] border border-tertiary/30 rounded-lg flex flex-col overflow-hidden shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
            style={{
              background: `linear-gradient(180deg, transparent 0%, #1a1739 40%)`,
            }}
          >
            {/* Icon Art Composition — Visual Hero */}
            <div className="relative z-10 -mx-0">
              <DreamIconComposition
                place={entry.scene.place}
                weather={entry.scene.weather}
                objects={entry.scene.objects}
                emotion={entry.gradientType}
                size="large"
              />
            </div>

            {/* Content area with dark overlay */}
            <div className="relative flex-1 flex flex-col justify-between p-8 bg-gradient-to-t from-surface-dim via-surface-container-low to-transparent -mt-6">
              {/* Particle Overlay */}
              <div className="absolute inset-0 star-field-share opacity-10 pointer-events-none"></div>

              {/* Content Top */}
              <div className="relative z-10">
                <h2 className="font-headline text-2xl leading-snug text-on-background mb-4">
                  {entry.interpretation.title}
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {entry.interpretation.keywords.map((k, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-xs font-medium tracking-wider text-primary-fixed-dim">
                      #{k}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Bottom */}
              <div className="relative z-10 space-y-6">
                <div className="p-5 rounded-2xl bg-surface-dim/40 backdrop-blur-md border-l-2 border-tertiary">
                  <p className="text-on-surface-variant font-light italic leading-relaxed text-sm">
                    "{entry.interpretation.text.split('.')[0]}."
                  </p>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                    <span className="material-symbols-outlined text-tertiary icon-fill text-lg">auto_awesome</span>
                  </div>
                  <span className="font-headline italic text-sm text-tertiary/60 tracking-widest">꿈 공장</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sharing Actions */}
        <div className="grid grid-cols-3 gap-4 w-full mt-12">
          <button
            onClick={handleSaveImage}
            className="flex flex-col items-center justify-center gap-3 p-5 bg-surface-container-high/40 backdrop-blur-xl rounded-2xl border border-white/5 hover:bg-surface-container-highest transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-primary-container/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary">download</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">이미지로 저장</span>
          </button>
          <button
            onClick={handleKakaoShare}
            className="flex flex-col items-center justify-center gap-3 p-5 bg-surface-container-high/40 backdrop-blur-xl rounded-2xl border border-white/5 hover:bg-surface-container-highest transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-tertiary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary">chat</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">카카오톡 공유</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex flex-col items-center justify-center gap-3 p-5 bg-surface-container-high/40 backdrop-blur-xl rounded-2xl border border-white/5 hover:bg-surface-container-highest transition-colors group"
          >
            <div className="w-12 h-12 rounded-full bg-secondary-container/40 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary">link</span>
            </div>
            <span className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant">링크 복사</span>
          </button>
        </div>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-8 pb-8 pt-4 bg-indigo-950/60 backdrop-blur-xl rounded-t-[40px] border-t border-white/10 shadow-[0_-8px_32px_rgba(79,70,229,0.15)] max-w-[430px]">
        <button onClick={onBack} className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">edit_note</span>
          <span className="font-label text-[10px] tracking-wider">기록</span>
        </button>
        <button className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">auto_stories</span>
          <span className="font-label text-[10px] tracking-wider">갤러리</span>
        </button>
        <button className="flex flex-col items-center justify-center text-indigo-400/50 transition-all active:scale-90">
          <span className="material-symbols-outlined mb-1">insights</span>
          <span className="font-label text-[10px] tracking-wider">통계</span>
        </button>
      </nav>
    </div>
  );
}
