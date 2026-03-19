interface IntroScreenProps {
  onStart: () => void;
}

const typeIcons = ['🛍️', '💸', '🎨', '📊', '🎁', '🏦', '✈️', '🍕'];

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        backgroundColor: '#f7f5f8',
        fontFamily: "'Plus Jakarta Sans', 'Noto Sans KR', sans-serif",
      }}
    >
      {/* Decorative blurred circles — Stitch exact */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(147,13,242,0.05)', filter: 'blur(60px)' }} />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full pointer-events-none" style={{ background: 'rgba(147,13,242,0.10)', filter: 'blur(60px)' }} />

      {/* Header — Stitch: p-4 pt-6, arrow_back text-2xl, title text-base font-bold pr-10 */}
      <div className="flex items-center p-4 pt-6 justify-between">
        <div className="flex w-10 h-10 shrink-0 items-center justify-center rounded-full hover:bg-[#930df2]/10 transition-colors cursor-pointer" style={{ color: '#0f172a' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </div>
        <h2 className="text-base font-bold leading-tight tracking-tight flex-1 text-center pr-10" style={{ color: '#0f172a' }}>
          소비 성격 테스트
        </h2>
      </div>

      {/* Hero Section — Stitch: px-6 pt-12 pb-8 (inline to guarantee spacing) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px 32px' }}>
        <div
          className="px-4 py-[6px] rounded-full text-[14px] font-bold mb-4"
          style={{ backgroundColor: 'rgba(147,13,242,0.1)', color: '#930df2' }}
        >
          소비 성격 테스트
        </div>
        <h1 className="text-[32px] font-bold leading-tight text-center tracking-tight mb-4" style={{ color: '#0f172a' }}>
          당신의 <span style={{ color: '#930df2' }}>소비 DNA</span>는?
        </h1>
        <p className="text-base font-medium leading-normal text-center" style={{ color: '#64748b' }}>
          10개의 질문으로 알아보는<br />나만의 소비 유형 진단
        </p>
      </div>

      {/* Icons Grid — Stitch: px-8 py-6 (inline to guarantee) */}
      <div style={{ padding: '24px 32px' }}>
        <div className="grid grid-cols-4 gap-4">
          {typeIcons.map((emoji, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded-2xl bg-white text-2xl"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid rgba(147,13,242,0.05)' }}
            >
              {emoji}
            </div>
          ))}
        </div>
      </div>

      {/* Flex spacer — pushes CTA to bottom */}
      <div className="flex-grow" />

      {/* Footer CTA — Stitch: p-6 pb-10, space-y-6 */}
      <div className="p-6 pb-10 flex flex-col items-center space-y-6">
        <div className="flex items-center space-x-3 text-[14px] font-medium" style={{ color: '#64748b' }}>
          <div className="flex items-center gap-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#64748b' }}>
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            약 1분 소요
          </div>
          <div className="w-px h-3" style={{ backgroundColor: '#cbd5e1' }} />
          <div className="flex items-center gap-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#64748b' }}>
              <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12z"/>
            </svg>
            총 10문항
          </div>
        </div>

        <button
          onClick={onStart}
          className="w-full h-16 text-white rounded-xl text-lg font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition-all group"
          style={{ background: 'linear-gradient(to right, #930df2, #b34eff)', boxShadow: '0 10px 25px rgba(147,13,242,0.25)' }}
        >
          <span>테스트 시작하기</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="group-hover:translate-x-1 transition-transform">
            <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
