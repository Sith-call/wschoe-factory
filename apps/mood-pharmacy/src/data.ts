import type { MoodData, MoodKey, PrescriptionActivity, BreathingExercise, MusicSuggestion, MoodLog, Prescription } from './types';

// ─── Mood Definitions ───
export const MOODS: MoodData[] = [
  { key: 'happy',   label: '행복',  emoji: '\u2600\uFE0F', color: 'text-green-happy',   bgColor: 'bg-green-happy',   softBg: 'bg-green-soft',   description: '마음이 따뜻하고 기분이 좋아요' },
  { key: 'calm',    label: '평온',  emoji: '\uD83C\uDF3F', color: 'text-purple-calm',   bgColor: 'bg-purple-calm',   softBg: 'bg-purple-soft',  description: '고요하고 편안한 상태예요' },
  { key: 'anxious', label: '불안',  emoji: '\uD83C\uDF00', color: 'text-amber-light',   bgColor: 'bg-amber-light',   softBg: 'bg-amber-soft',   description: '마음이 불안하고 초조해요' },
  { key: 'sad',     label: '우울',  emoji: '\uD83C\uDF27\uFE0F', color: 'text-blue-sad',     bgColor: 'bg-blue-sad',     softBg: 'bg-blue-soft',    description: '기분이 가라앉고 우울해요' },
  { key: 'angry',   label: '분노',  emoji: '\uD83D\uDD25', color: 'text-red-intense',   bgColor: 'bg-red-intense',   softBg: 'bg-red-soft',     description: '화가 나고 답답해요' },
  { key: 'tired',   label: '피로',  emoji: '\uD83C\uDF19', color: 'text-on-surface-dim', bgColor: 'bg-on-surface-dim', softBg: 'bg-white/5',     description: '지치고 에너지가 없어요' },
  { key: 'excited', label: '설렘',  emoji: '\u2728',       color: 'text-amber',          bgColor: 'bg-amber',          softBg: 'bg-amber-soft',   description: '두근두근 기대되는 마음이에요' },
  { key: 'empty',   label: '공허',  emoji: '\uD83D\uDD73\uFE0F', color: 'text-on-surface-muted', bgColor: 'bg-on-surface-muted', softBg: 'bg-white/5', description: '아무 감정도 느껴지지 않아요' },
];

export const MOOD_MAP: Record<MoodKey, MoodData> = Object.fromEntries(MOODS.map(m => [m.key, m])) as Record<MoodKey, MoodData>;

// ─── Activities per Mood ───
const ACTIVITIES: Record<MoodKey, PrescriptionActivity[]> = {
  happy: [
    { title: '감사 일기 쓰기', description: '오늘 행복했던 순간 3가지를 적어보세요', duration: '10분', emoji: '\uD83D\uDCD3' },
    { title: '좋아하는 사람에게 연락하기', description: '행복을 나누면 두 배가 됩니다', duration: '5분', emoji: '\uD83D\uDCF1' },
    { title: '산책하며 사진 찍기', description: '행복한 순간을 기록으로 남겨보세요', duration: '20분', emoji: '\uD83D\uDCF8' },
  ],
  calm: [
    { title: '따뜻한 차 한 잔', description: '좋아하는 차를 천천히 음미해보세요', duration: '15분', emoji: '\uD83C\uDF75' },
    { title: '좋아하는 책 읽기', description: '평온한 지금, 독서하기 딱 좋은 시간이에요', duration: '30분', emoji: '\uD83D\uDCDA' },
    { title: '스트레칭', description: '부드러운 스트레칭으로 몸도 편안하게', duration: '10분', emoji: '\uD83E\uDDD8' },
  ],
  anxious: [
    { title: '걱정 목록 적어보기', description: '불안을 글로 쓰면 절반으로 줄어들어요', duration: '10분', emoji: '\u270D\uFE0F' },
    { title: '5분 명상하기', description: '눈을 감고 호흡에만 집중해보세요', duration: '5분', emoji: '\uD83E\uDDD8' },
    { title: '차가운 물로 세수하기', description: '냉수 자극이 불안한 마음을 진정시켜요', duration: '2분', emoji: '\uD83D\uDCA7' },
    { title: '동네 한 바퀴 산책', description: '걸으면서 생각을 정리해보세요', duration: '15분', emoji: '\uD83D\uDEB6' },
  ],
  sad: [
    { title: '따뜻한 음료 마시기', description: '핫초코나 라떼 한 잔이 위로가 될 거예요', duration: '10분', emoji: '\u2615' },
    { title: '좋아하는 음악 듣기', description: '감정을 음악에 맡겨보세요', duration: '15분', emoji: '\uD83C\uDFB5' },
    { title: '감정 일기 쓰기', description: '마음속 이야기를 글로 풀어보세요', duration: '10분', emoji: '\uD83D\uDCDD' },
    { title: '좋아하는 사람에게 연락하기', description: '혼자 삼키지 마세요, 누군가에게 기대도 괜찮아요', duration: '5분', emoji: '\uD83E\uDD17' },
  ],
  angry: [
    { title: '베개 펀칭', description: '안전하게 화를 풀어보세요', duration: '3분', emoji: '\uD83E\uDD4A' },
    { title: '찬물 한 잔 마시기', description: '6초만 참으면 후회할 말을 줄일 수 있어요', duration: '1분', emoji: '\uD83E\uDD64' },
    { title: '격한 운동하기', description: '뛰거나 스쿼트로 에너지를 태워보세요', duration: '15분', emoji: '\uD83C\uDFCB\uFE0F' },
    { title: '감정 편지 쓰기 (보내지 않기)', description: '화난 마음을 글로 쏟아내고 찢어버리세요', duration: '10분', emoji: '\u2709\uFE0F' },
  ],
  tired: [
    { title: '15분 낮잠', description: '짧은 수면이 에너지를 충전해줘요', duration: '15분', emoji: '\uD83D\uDE34' },
    { title: '햇빛 받으며 스트레칭', description: '햇빛은 천연 에너지 부스터예요', duration: '10분', emoji: '\u2600\uFE0F' },
    { title: '따뜻한 물 한 잔', description: '수분 보충만으로도 피로가 줄어들어요', duration: '2분', emoji: '\uD83D\uDCA7' },
    { title: '좋아하는 간식 먹기', description: '작은 보상으로 기분을 충전해보세요', duration: '10분', emoji: '\uD83C\uDF6B' },
  ],
  excited: [
    { title: '설렘 기록하기', description: '지금 이 두근거림을 일기에 남겨보세요', duration: '5분', emoji: '\uD83D\uDCDD' },
    { title: '좋아하는 취미 하기', description: '에너지가 넘칠 때 하고 싶은 것을 하세요', duration: '30분', emoji: '\uD83C\uDFA8' },
    { title: '신나는 음악 들으며 춤추기', description: '몸을 움직여 설렘을 표현해보세요', duration: '10분', emoji: '\uD83D\uDC83' },
  ],
  empty: [
    { title: '창밖 바라보기', description: '5분간 아무 생각 없이 밖을 바라보세요', duration: '5분', emoji: '\uD83C\uDF05' },
    { title: '좋아했던 것 목록 만들기', description: '예전에 좋아했던 것들을 떠올려보세요', duration: '10분', emoji: '\uD83D\uDCCB' },
    { title: '가벼운 산책', description: '몸을 움직이면 마음도 움직이기 시작해요', duration: '15분', emoji: '\uD83D\uDEB6' },
    { title: '따뜻한 물에 손 담그기', description: '체온이 올라가면 마음도 따뜻해져요', duration: '5분', emoji: '\uD83D\uDEC1' },
  ],
};

// ─── Affirmations per Mood ───
const AFFIRMATIONS: Record<MoodKey, string[]> = {
  happy: [
    '당신의 행복은 주변 사람들에게도 따뜻한 빛이 됩니다.',
    '이 순간을 충분히 즐기세요. 당신은 그럴 자격이 있어요.',
    '행복한 오늘이 내일의 힘이 됩니다.',
    '웃는 당신이 가장 아름다워요.',
  ],
  calm: [
    '평온한 마음은 가장 큰 힘입니다.',
    '고요함 속에서 진짜 나를 만날 수 있어요.',
    '지금 이 순간, 당신은 완전합니다.',
    '평화로운 마음이 최고의 약이에요.',
  ],
  anxious: [
    '괜찮아요, 불안은 당신을 지키려는 마음이에요.',
    '지금 이 순간만 집중하세요. 미래는 아직 오지 않았어요.',
    '당신이 걱정하는 일의 90%는 일어나지 않아요.',
    '깊게 숨 쉬세요. 당신은 충분히 잘 하고 있어요.',
    '불안은 파도와 같아요. 올라왔다가 반드시 내려갑니다.',
  ],
  sad: [
    '울어도 괜찮아요. 눈물은 마음의 빗물이에요.',
    '어두운 밤이 지나면 반드시 아침이 옵니다.',
    '슬픔을 느낄 수 있다는 건 깊이 사랑할 수 있다는 뜻이에요.',
    '지금은 힘들어도, 이 시간도 지나갈 거예요.',
    '당신의 슬픔을 안아줄게요. 혼자가 아니에요.',
  ],
  angry: [
    '화가 나는 건 자연스러운 거예요. 표현 방법만 바꿔봐요.',
    '6초만 참으면 다른 선택을 할 수 있어요.',
    '분노 뒤에는 상처받은 마음이 있어요. 그 마음을 돌봐주세요.',
    '당신의 감정은 정당해요. 다만 안전하게 표현해요.',
  ],
  tired: [
    '쉬는 것도 일의 일부예요. 충분히 쉬어도 돼요.',
    '당신은 이미 충분히 노력하고 있어요.',
    '지친 몸과 마음에게 고마워하세요. 여기까지 와줘서.',
    '오늘 하루도 수고했어요. 내일은 내일의 에너지가 있을 거예요.',
  ],
  excited: [
    '설레는 마음을 소중히 여기세요. 그것이 삶의 원동력이에요.',
    '두근거림은 새로운 시작의 신호예요.',
    '당신의 열정이 세상을 더 밝게 만들어요.',
    '이 에너지를 잘 활용하면 놀라운 일이 생길 거예요.',
  ],
  empty: [
    '아무것도 느끼지 못해도 괜찮아요. 그것도 하나의 감정이에요.',
    '공허함은 새로운 것을 채울 수 있는 공간이에요.',
    '지금은 쉬는 시간이에요. 곧 다시 느낄 수 있을 거예요.',
    '당신의 존재 자체가 의미 있어요.',
  ],
};

// ─── Breathing Exercises ───
const BREATHING_EXERCISES: Record<MoodKey, BreathingExercise[]> = {
  happy: [
    { name: '감사 호흡', pattern: '4-4-4', description: '숨을 들이쉬며 감사한 것을 떠올리세요', rounds: 5 },
  ],
  calm: [
    { name: '평온 호흡', pattern: '5-5-5', description: '천천히 깊게 호흡하며 평화를 느끼세요', rounds: 5 },
  ],
  anxious: [
    { name: '4-7-8 호흡법', pattern: '4-7-8', description: '4초 들이쉬고, 7초 참고, 8초 내쉬세요', rounds: 4 },
    { name: '박스 호흡', pattern: '4-4-4-4', description: '4초씩 들이쉬고-참고-내쉬고-참기를 반복', rounds: 4 },
  ],
  sad: [
    { name: '위로 호흡', pattern: '6-2-6', description: '길게 들이쉬고 짧게 참은 뒤 길게 내쉬세요', rounds: 5 },
  ],
  angry: [
    { name: '냉각 호흡', pattern: '4-7-8', description: '코로 들이쉬고 입으로 후~ 내쉬세요', rounds: 6 },
  ],
  tired: [
    { name: '에너지 호흡', pattern: '3-3-6', description: '빠르게 들이쉬고 천천히 내쉬세요', rounds: 5 },
  ],
  excited: [
    { name: '집중 호흡', pattern: '4-4-4', description: '규칙적 호흡으로 설레는 에너지를 정돈하세요', rounds: 4 },
  ],
  empty: [
    { name: '존재 호흡', pattern: '5-3-5', description: '호흡하고 있다는 것 자체를 느껴보세요', rounds: 6 },
  ],
};

// ─── Music Suggestions ───
const MUSIC_SUGGESTIONS: Record<MoodKey, MusicSuggestion[]> = {
  happy: [
    { genre: '팝/댄스', description: '신나는 비트로 행복을 더 크게', emoji: '\uD83C\uDFB6', examples: ['IU - Blueming', 'AKMU - 사랑이 식을 시간'] },
    { genre: '보사노바', description: '여유로운 리듬으로 행복을 느긋하게', emoji: '\uD83C\uDF34', examples: ['The Girl from Ipanema', 'Summer Samba'] },
  ],
  calm: [
    { genre: '앰비언트', description: '고요한 사운드스케이프', emoji: '\uD83C\uDF0A', examples: ['Brian Eno - Music for Airports', 'Tycho - Dive'] },
    { genre: '클래식', description: '부드러운 피아노 선율', emoji: '\uD83C\uDFB9', examples: ['쇼팽 - 녹턴', '드뷔시 - 달빛'] },
  ],
  anxious: [
    { genre: 'Lo-fi', description: '부드러운 비트가 불안을 낮춰줘요', emoji: '\uD83C\uDFA7', examples: ['Lo-fi Hip Hop Radio', 'Jinsang - Solitude'] },
    { genre: '자연 소리', description: '빗소리, 파도 소리로 마음을 안정', emoji: '\uD83C\uDF27\uFE0F', examples: ['빗소리 ASMR', '파도 소리'] },
  ],
  sad: [
    { genre: '발라드', description: '감정에 공감해주는 따뜻한 목소리', emoji: '\uD83C\uDFA4', examples: ['이소라 - 바람이 분다', '성시경 - 거리에서'] },
    { genre: '재즈', description: '블루지한 선율이 위로가 돼요', emoji: '\uD83C\uDFB7', examples: ['Chet Baker - Almost Blue', 'Bill Evans - Peace Piece'] },
  ],
  angry: [
    { genre: '록/메탈', description: '강렬한 사운드로 에너지를 발산', emoji: '\uD83E\uDD18', examples: ['Linkin Park', 'System of a Down'] },
    { genre: '일렉트로닉', description: '강한 비트에 분노를 실어보내세요', emoji: '\u26A1', examples: ['The Prodigy', 'Pendulum'] },
  ],
  tired: [
    { genre: '어쿠스틱', description: '잔잔한 기타 선율로 몸을 쉬게', emoji: '\uD83C\uDFB8', examples: ['Jason Mraz', '정승환 - 눈사람'] },
    { genre: '뉴에이지', description: '편안한 선율로 심신을 회복', emoji: '\uD83C\uDF1F', examples: ['야니', '이루마 - River Flows in You'] },
  ],
  excited: [
    { genre: '인디팝', description: '트렌디한 비트로 설렘을 극대화', emoji: '\uD83D\uDE80', examples: ['잔나비 - 주저하는 연인들', 'HYUKOH - Comes and Goes'] },
    { genre: '하우스', description: '그루브한 리듬으로 에너지를 채워요', emoji: '\uD83C\uDF89', examples: ['Disclosure', 'Daft Punk'] },
  ],
  empty: [
    { genre: '포크', description: '담백한 목소리가 마음을 깨워줘요', emoji: '\uD83C\uDF43', examples: ['김사월 - 잠이 오질 않네요', 'Bon Iver'] },
    { genre: '앰비언트 팝', description: '공간감 있는 사운드로 감정을 채워요', emoji: '\uD83C\uDF0C', examples: ['Sigur Ros', 'Radiohead - No Surprises'] },
  ],
};

// ─── Intensity Labels ───
export const INTENSITY_LABELS = ['아주 조금', '조금', '보통', '꽤 많이', '매우 강하게'] as const;

// ─── Prescription Generator ───
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generatePrescription(mood: MoodKey, intensity: number, memo: string): Prescription {
  const id = `rx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date();
  return {
    id,
    date: now.toISOString().split('T')[0],
    mood,
    intensity,
    memo,
    activity: randomPick(ACTIVITIES[mood]),
    affirmation: randomPick(AFFIRMATIONS[mood]),
    breathing: randomPick(BREATHING_EXERCISES[mood]),
    musicGenre: randomPick(MUSIC_SUGGESTIONS[mood]),
    isFavorite: false,
  };
}

// ─── Demo Data Generator ───
export function generateDemoData(): { logs: MoodLog[]; prescriptions: Prescription[] } {
  const logs: MoodLog[] = [];
  const prescriptions: Prescription[] = [];
  const today = new Date();
  const moodSequence: MoodKey[] = ['tired', 'anxious', 'sad', 'angry', 'calm', 'happy', 'excited'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const mood = moodSequence[6 - i];
    const intensity = Math.floor(Math.random() * 3) + 2; // 2-4
    const memos = [
      '오늘 회의가 너무 길었다',
      '상사한테 또 깨졌다...',
      '혼자 점심 먹으니 외롭다',
      '퇴근 후 운동을 못 갔다',
      '카페에서 맛있는 커피 마심',
      '오랜만에 친구를 만났다!',
      '새 프로젝트 시작이 기대된다',
    ];
    const memo = memos[6 - i];
    const rx = generatePrescription(mood, intensity, memo);
    rx.date = dateStr;
    rx.id = `rx-demo-${i}`;
    if (i === 3 || i === 1) rx.isFavorite = true;

    const log: MoodLog = {
      id: `log-demo-${i}`,
      date: dateStr,
      mood,
      intensity,
      memo,
      prescriptionId: rx.id,
      timestamp: d.toISOString(),
    };

    logs.push(log);
    prescriptions.push(rx);
  }

  return { logs, prescriptions };
}

// ─── Stats Helpers ───
export function getMoodCounts(logs: MoodLog[]): Record<MoodKey, number> {
  const counts: Record<MoodKey, number> = {
    happy: 0, calm: 0, anxious: 0, sad: 0,
    angry: 0, tired: 0, excited: 0, empty: 0,
  };
  for (const log of logs) {
    counts[log.mood]++;
  }
  return counts;
}

export function getStreak(logs: MoodLog[]): number {
  if (logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const d = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split('T')[0];
    if (sorted.some(l => l.date === dateStr)) {
      streak++;
    } else if (dateStr < today) {
      break;
    }
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

export function getCalendarDays(year: number, month: number): (string | null)[] {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (string | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    days.push(dateStr);
  }
  return days;
}
