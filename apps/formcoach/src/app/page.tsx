import Link from "next/link";

const features = [
  {
    title: "AI 맞춤 운동 계획",
    desc: "당신의 목표와 체력 수준에 맞는 주간 운동 계획을 AI가 자동 생성합니다.",
    icon: "M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z",
  },
  {
    title: "실시간 운동 가이드",
    desc: "세트별 가이드와 휴식 타이머로 효과적인 운동을 도와드립니다.",
    icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "진행 상황 추적",
    desc: "운동 기록과 통계를 한눈에 확인하고, 성장하는 모습을 확인하세요.",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z",
  },
  {
    title: "동기부여 시스템",
    desc: "연속 출석 배지와 도전 과제로 운동 습관을 만들어보세요.",
    icon: "M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.003 6.003 0 01-5.54 0",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 px-4 pb-20 pt-16 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white" />
        </div>
        <div className="relative mx-auto max-w-lg text-center">
          <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
            AI 피트니스 코치
          </div>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight">
            당신만을 위한
            <br />
            AI 운동 코치
          </h1>
          <p className="mb-8 text-lg text-brand-100">
            목표에 맞는 맞춤 운동 계획부터 실시간 코칭까지,
            <br />
            FormCoach가 함께합니다.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/signup"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-white px-8 text-lg font-bold text-brand-700 shadow-lg transition hover:bg-brand-50"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-[52px] items-center justify-center rounded-xl border-2 border-white/30 px-8 text-lg font-semibold text-white transition hover:bg-white/10"
            >
              로그인
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-lg px-4 py-16">
        <h2 className="mb-2 text-center text-2xl font-bold text-gray-900">
          스마트한 운동 관리
        </h2>
        <p className="mb-10 text-center text-gray-500">
          FormCoach의 주요 기능을 만나보세요
        </p>
        <div className="grid gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                <svg
                  className="h-6 w-6 text-brand-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={f.icon}
                  />
                </svg>
              </div>
              <div>
                <h3 className="mb-1 font-bold text-gray-900">{f.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-50 px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="mb-3 text-2xl font-bold text-gray-900">
            지금 바로 시작하세요
          </h2>
          <p className="mb-6 text-gray-600">
            무료로 시작하고, AI가 만들어주는 맞춤 운동 계획을 경험해보세요.
          </p>
          <Link
            href="/signup"
            className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-brand-600 px-8 text-lg font-bold text-white shadow-lg transition hover:bg-brand-700"
          >
            회원가입
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-4 py-8 text-center text-sm text-gray-400">
        <p>FormCoach &copy; 2026. All rights reserved.</p>
      </footer>
    </div>
  );
}
