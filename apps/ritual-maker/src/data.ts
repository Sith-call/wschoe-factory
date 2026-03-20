import type {
  Character, CharacterClass, CharacterStats, Ritual, DailyLog,
  SkillNode, WeeklyBoss, BossChallenge, GuildMember, TimeSlot,
  RitualCategory, QuestCompletion,
} from './types';

// ─── Class Definitions ───
export const CLASS_INFO: Record<CharacterClass, {
  name: string; emoji: string; description: string;
  baseStats: CharacterStats; color: string; gradient: string;
}> = {
  warrior: {
    name: '전사', emoji: '⚔️', description: '체력과 의지로 루틴을 정복한다',
    baseStats: { stamina: 8, intellect: 3, spirit: 4, agility: 5 },
    color: '#ef4444', gradient: 'from-red-900/40 to-orange-900/30',
  },
  mage: {
    name: '마법사', emoji: '🔮', description: '지식과 학습으로 세계를 넓힌다',
    baseStats: { stamina: 3, intellect: 8, spirit: 5, agility: 4 },
    color: '#8b5cf6', gradient: 'from-violet-900/40 to-indigo-900/30',
  },
  healer: {
    name: '힐러', emoji: '✨', description: '마음의 평화로 모두를 치유한다',
    baseStats: { stamina: 4, intellect: 5, spirit: 8, agility: 3 },
    color: '#10b981', gradient: 'from-emerald-900/40 to-teal-900/30',
  },
  ranger: {
    name: '레인저', emoji: '🏹', description: '새로운 경험을 탐험하며 성장한다',
    baseStats: { stamina: 5, intellect: 4, spirit: 3, agility: 8 },
    color: '#f59e0b', gradient: 'from-amber-900/40 to-yellow-900/30',
  },
};

// ─── Rituals Library ───
export const ALL_RITUALS: Ritual[] = [
  // Morning
  { id: 'r01', name: '기상 스트레칭', emoji: '🧘', category: 'body', timeSlot: 'morning', xpReward: 15, statBonus: { stamina: 1 }, description: '5분 전신 스트레칭' },
  { id: 'r02', name: '물 한 잔', emoji: '💧', category: 'body', timeSlot: 'morning', xpReward: 10, statBonus: { stamina: 1 }, description: '일어나자마자 물 마시기' },
  { id: 'r03', name: '오늘의 3줄 계획', emoji: '📝', category: 'mind', timeSlot: 'morning', xpReward: 20, statBonus: { intellect: 1 }, description: '오늘 할 일 3가지 적기' },
  { id: 'r04', name: '5분 명상', emoji: '🧠', category: 'soul', timeSlot: 'morning', xpReward: 20, statBonus: { spirit: 1 }, description: '조용히 호흡에 집중하기' },
  { id: 'r05', name: '아침 산책', emoji: '🚶', category: 'body', timeSlot: 'morning', xpReward: 25, statBonus: { stamina: 1, agility: 1 }, description: '15분 동네 한 바퀴' },
  { id: 'r06', name: '뉴스 읽기', emoji: '📰', category: 'mind', timeSlot: 'morning', xpReward: 15, statBonus: { intellect: 1 }, description: '오늘의 주요 뉴스 파악' },
  // Afternoon
  { id: 'r07', name: '점심 후 산책', emoji: '🌿', category: 'body', timeSlot: 'afternoon', xpReward: 20, statBonus: { stamina: 1, spirit: 1 }, description: '10분 바깥 공기 마시기' },
  { id: 'r08', name: '30분 집중 작업', emoji: '🎯', category: 'mind', timeSlot: 'afternoon', xpReward: 30, statBonus: { intellect: 2 }, description: '뽀모도로 한 세트' },
  { id: 'r09', name: '동료와 대화', emoji: '💬', category: 'social', timeSlot: 'afternoon', xpReward: 15, statBonus: { spirit: 1 }, description: '업무 외 가벼운 대화' },
  { id: 'r10', name: '새로운 것 배우기', emoji: '📚', category: 'mind', timeSlot: 'afternoon', xpReward: 25, statBonus: { intellect: 1, agility: 1 }, description: '아티클/강의 하나' },
  // Evening
  { id: 'r11', name: '운동 30분', emoji: '💪', category: 'body', timeSlot: 'evening', xpReward: 35, statBonus: { stamina: 2, agility: 1 }, description: '헬스/러닝/홈트' },
  { id: 'r12', name: '감사일기', emoji: '🙏', category: 'soul', timeSlot: 'evening', xpReward: 20, statBonus: { spirit: 2 }, description: '오늘 감사한 것 3가지' },
  { id: 'r13', name: '독서 20분', emoji: '📖', category: 'mind', timeSlot: 'evening', xpReward: 25, statBonus: { intellect: 1, spirit: 1 }, description: '잠들기 전 독서' },
  { id: 'r14', name: '하루 정리', emoji: '📋', category: 'soul', timeSlot: 'evening', xpReward: 20, statBonus: { spirit: 1, intellect: 1 }, description: '오늘 한 일/배운 것 기록' },
  { id: 'r15', name: '내일 준비', emoji: '🎒', category: 'mind', timeSlot: 'evening', xpReward: 15, statBonus: { agility: 1 }, description: '내일 옷/가방 미리 준비' },
  { id: 'r16', name: '디지털 디톡스', emoji: '📵', category: 'soul', timeSlot: 'evening', xpReward: 25, statBonus: { spirit: 2 }, description: '취침 1시간 전 스마트폰 끄기' },
];

// ─── Skill Trees ───
export const ALL_SKILLS: SkillNode[] = [
  // Tier 1 — Lv 2+
  { id: 's01', name: '새벽 전사', description: '아침 루틴 3회 연속 달성', emoji: '🌅', tier: 1, category: 'body', requiredLevel: 2, requires: [], unlocked: false, passive: '아침 XP +10%' },
  { id: 's02', name: '집중의 렌즈', description: '작업 루틴 5회 달성', emoji: '🔍', tier: 1, category: 'mind', requiredLevel: 2, requires: [], unlocked: false, passive: '지력 스탯 +1' },
  { id: 's03', name: '내면의 고요', description: '명상 3회 달성', emoji: '🕊️', tier: 1, category: 'soul', requiredLevel: 2, requires: [], unlocked: false, passive: '정신력 스탯 +1' },
  { id: 's04', name: '소통의 다리', description: '사회적 루틴 3회 달성', emoji: '🌉', tier: 1, category: 'social', requiredLevel: 2, requires: [], unlocked: false, passive: '길드 XP 보너스 +5%' },
  // Tier 2 — Lv 4+
  { id: 's05', name: '철벽 루틴', description: '7일 연속 스트릭 달성', emoji: '🛡️', tier: 2, category: 'body', requiredLevel: 4, requires: ['s01'], unlocked: false, passive: '체력 스탯 +2' },
  { id: 's06', name: '다독가', description: '독서 루틴 10회 달성', emoji: '📚', tier: 2, category: 'mind', requiredLevel: 4, requires: ['s02'], unlocked: false, passive: '지력 스탯 +2' },
  { id: 's07', name: '감정 마스터', description: '감사일기 10회 달성', emoji: '💎', tier: 2, category: 'soul', requiredLevel: 4, requires: ['s03'], unlocked: false, passive: '정신력 스탯 +2' },
  { id: 's08', name: '파티 리더', description: '길드 보스 3회 참여', emoji: '👑', tier: 2, category: 'social', requiredLevel: 4, requires: ['s04'], unlocked: false, passive: '팀 XP +10%' },
  // Tier 3 — Lv 7+
  { id: 's09', name: '불굴의 의지', description: '14일 연속 스트릭', emoji: '🔥', tier: 3, category: 'body', requiredLevel: 7, requires: ['s05'], unlocked: false, passive: '전체 XP +15%' },
  { id: 's10', name: '현자의 돌', description: '모든 카테고리 루틴 완료', emoji: '🪨', tier: 3, category: 'mind', requiredLevel: 7, requires: ['s06'], unlocked: false, passive: '보스 약점 공격 +20%' },
  { id: 's11', name: '치유의 오라', description: '30일 총 루틴 100회', emoji: '💚', tier: 3, category: 'soul', requiredLevel: 7, requires: ['s07'], unlocked: false, passive: '스트릭 보호 1회' },
  { id: 's12', name: '전설의 길드장', description: '길드 랭킹 1위', emoji: '⚡', tier: 3, category: 'social', requiredLevel: 7, requires: ['s08'], unlocked: false, passive: '모든 스탯 +1' },
  // Tier 4 — Lv 10+
  { id: 's13', name: '루틴의 신', description: '30일 연속 스트릭 + 모든 Tier 3 해금', emoji: '🏆', tier: 4, category: 'body', requiredLevel: 10, requires: ['s09', 's10', 's11', 's12'], unlocked: false, passive: '전설 칭호 획득' },
];

// ─── Boss Definitions ───
export const BOSSES: Record<string, WeeklyBoss> = {
  week1: { type: 'slime', name: '나태의 슬라임', hp: 100, maxHp: 100, weakness: 'body', reward: '의지의 반지', emoji: '🟢' },
  week2: { type: 'goblin', name: '혼란의 고블린', hp: 150, maxHp: 150, weakness: 'mind', reward: '집중의 목걸이', emoji: '👺' },
  week3: { type: 'dragon', name: '번아웃 드래곤', hp: 200, maxHp: 200, weakness: 'soul', reward: '회복의 방패', emoji: '🐉' },
  week4: { type: 'phoenix', name: '완벽주의 피닉스', hp: 250, maxHp: 250, weakness: 'social', reward: '균형의 왕관', emoji: '🔥' },
};

// ─── Boss Stories ───
export const BOSS_STORIES: Record<string, { intro: string; defeat: string; next: string }> = {
  slime: {
    intro: '매일 아침, "5분만 더..."라는 속삭임이 당신의 의지를 녹이고 있습니다. 나태의 슬라임은 당신의 게으름을 먹고 자랍니다. 움직여야 합니다. 몸이 기억하는 루틴의 힘으로 슬라임을 물리치세요.',
    defeat: '끈적한 나태가 사라지고, 몸이 가벼워집니다. 의지의 반지가 당신의 손에 빛나고 있습니다. 하지만 어둠 속에서 새로운 그림자가 다가옵니다...',
    next: '다음 장: 혼란의 고블린이 당신의 집중력을 노리고 있습니다.',
  },
  goblin: {
    intro: '할 일은 산더미인데 뭐부터 해야 할지 모르겠다. 혼란의 고블린이 당신의 생각을 어지럽히고 있습니다. 명확한 목표와 집중력으로 고블린의 속임수를 꿰뚫으세요.',
    defeat: '흩어졌던 생각이 정리됩니다. 집중의 목걸이가 당신의 마음을 투명하게 비추고 있습니다. 그런데... 저 멀리서 뜨거운 바람이 불어옵니다.',
    next: '다음 장: 번아웃 드래곤이 당신의 에너지를 태우고 있습니다.',
  },
  dragon: {
    intro: '열심히 달려왔지만, 마음속 불꽃이 꺼져가고 있습니다. 번아웃 드래곤은 과도한 열정이 만들어낸 그림자입니다. 쉬어가는 법을 배우고, 내면의 평화로 드래곤을 잠재우세요.',
    defeat: '드래곤의 불꽃이 잦아들고, 따뜻한 바람이 불어옵니다. 회복의 방패가 당신의 마음을 지켜줄 것입니다. 그러나 최후의 시련이 남아있습니다...',
    next: '다음 장: 완벽주의 피닉스가 재에서 되살아납니다.',
  },
  phoenix: {
    intro: '완벽하지 않으면 시작하지 않는다. 완벽주의 피닉스는 당신의 두려움이 만든 불사조입니다. "충분히 좋은 것"의 가치를 알고, 불완전함을 받아들이는 용기로 피닉스와 맞서세요.',
    defeat: '피닉스의 불꽃이 따뜻한 빛으로 변합니다. 균형의 왕관은 완벽하지 않아도 괜찮다는 것을 일깨워줍니다. 축하합니다, 모든 그림자를 물리쳤습니다!',
    next: '새로운 여정이 시작됩니다. 더 강한 루틴으로, 더 높은 곳을 향해.',
  },
};

// ─── World Intro ───
export const WORLD_INTRO = {
  title: '루틴의 세계에 오신 것을 환영합니다',
  story: '한때 모든 사람이 자신만의 리추얼을 지키며 살았습니다. 하지만 나태, 혼란, 번아웃, 완벽주의라는 네 그림자가 세상을 뒤덮었습니다. 당신은 리추얼의 힘을 되찾기 위해 모험을 떠나는 마지막 수호자입니다.',
  mission: '매일의 루틴을 수행하고, 스킬을 해금하며, 네 그림자를 물리치세요.',
};

// ─── Passive Effect Calculator ───
export function calculatePassiveBonus(skills: SkillNode[]): {
  xpMultiplier: number;
  morningXpBonus: number;
  statBonuses: Partial<CharacterStats>;
  streakProtection: boolean;
  bossWeaknessBonus: number;
  guildXpBonus: number;
  teamXpBonus: number;
} {
  const unlocked = skills.filter(s => s.unlocked);
  let xpMultiplier = 1.0;
  let morningXpBonus = 0;
  const statBonuses: Partial<CharacterStats> = {};
  let streakProtection = false;
  let bossWeaknessBonus = 0;
  let guildXpBonus = 0;
  let teamXpBonus = 0;

  for (const skill of unlocked) {
    switch (skill.id) {
      case 's01': morningXpBonus += 0.1; break; // 아침 XP +10%
      case 's02': statBonuses.intellect = (statBonuses.intellect || 0) + 1; break;
      case 's03': statBonuses.spirit = (statBonuses.spirit || 0) + 1; break;
      case 's04': guildXpBonus += 0.05; break;
      case 's05': statBonuses.stamina = (statBonuses.stamina || 0) + 2; break;
      case 's06': statBonuses.intellect = (statBonuses.intellect || 0) + 2; break;
      case 's07': statBonuses.spirit = (statBonuses.spirit || 0) + 2; break;
      case 's08': teamXpBonus += 0.1; break;
      case 's09': xpMultiplier += 0.15; break; // 전체 XP +15%
      case 's10': bossWeaknessBonus += 0.2; break;
      case 's11': streakProtection = true; break;
      case 's12': // 모든 스탯 +1
        statBonuses.stamina = (statBonuses.stamina || 0) + 1;
        statBonuses.intellect = (statBonuses.intellect || 0) + 1;
        statBonuses.spirit = (statBonuses.spirit || 0) + 1;
        statBonuses.agility = (statBonuses.agility || 0) + 1;
        break;
      case 's13': xpMultiplier += 0.1; break; // 전설 추가 보너스
    }
  }

  return { xpMultiplier, morningXpBonus, statBonuses, streakProtection, bossWeaknessBonus, guildXpBonus, teamXpBonus };
}

// ─── Notification Helpers ───
export function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return Promise.resolve(false);
  if (Notification.permission === 'granted') return Promise.resolve(true);
  if (Notification.permission === 'denied') return Promise.resolve(false);
  return Notification.requestPermission().then(p => p === 'granted');
}

export function sendNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.svg' });
  }
}

export function generateBossChallenges(): BossChallenge[] {
  const pool: BossChallenge[] = [
    { question: '이번 주 가장 뿌듯했던 순간은?', category: 'reflection', answered: false },
    { question: '루틴을 건너뛴 날, 이유는 무엇이었나요?', category: 'reflection', answered: false },
    { question: '다음 주에 새로 시도해보고 싶은 루틴은?', category: 'planning', answered: false },
    { question: '이번 주 나에게 감사한 한 가지는?', category: 'gratitude', answered: false },
    { question: '가장 어려웠던 루틴은? 어떻게 개선할까요?', category: 'planning', answered: false },
    { question: '이번 주 나를 웃게 만든 작은 일은?', category: 'gratitude', answered: false },
  ];
  return pool.sort(() => Math.random() - 0.5).slice(0, 3);
}

// ─── Demo Guild Members ───
export const DEMO_GUILD: GuildMember[] = [
  { name: '김서준', class: 'warrior', level: 5, streak: 12, avatar: '⚔️' },
  { name: '이지은', class: 'healer', level: 7, streak: 21, avatar: '✨' },
  { name: '박민재', class: 'mage', level: 4, streak: 8, avatar: '🔮' },
  { name: '최유나', class: 'ranger', level: 6, streak: 15, avatar: '🏹' },
  { name: '정하준', class: 'warrior', level: 3, streak: 5, avatar: '⚔️' },
];

// ─── XP & Level Calculations ───
export function xpForLevel(level: number): number {
  return Math.floor(80 * Math.pow(1.4, level - 1));
}

export function calculateLevel(totalXp: number): { level: number; xp: number; xpToNext: number } {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, xp: remaining, xpToNext: xpForLevel(level) };
}

// ─── Time Slot Helpers ───
export const TIME_SLOT_INFO: Record<TimeSlot, { label: string; emoji: string; hours: string; gradient: string }> = {
  morning: { label: '아침 퀘스트', emoji: '🌅', hours: '06:00 - 12:00', gradient: 'from-amber-500/20 to-orange-500/10' },
  afternoon: { label: '오후 퀘스트', emoji: '☀️', hours: '12:00 - 18:00', gradient: 'from-sky-500/20 to-blue-500/10' },
  evening: { label: '저녁 퀘스트', emoji: '🌙', hours: '18:00 - 24:00', gradient: 'from-indigo-500/20 to-purple-500/10' },
};

export const CATEGORY_INFO: Record<RitualCategory, { label: string; emoji: string; color: string }> = {
  body: { label: '체력', emoji: '💪', color: '#ef4444' },
  mind: { label: '지력', emoji: '🧠', color: '#8b5cf6' },
  soul: { label: '정신력', emoji: '✨', color: '#10b981' },
  social: { label: '사교', emoji: '💬', color: '#f59e0b' },
};

// ─── Titles by Level ───
const TITLES: Record<number, string> = {
  1: '수련생',
  2: '견습 모험가',
  3: '루틴 워커',
  4: '습관 파이터',
  5: '일상 마스터',
  6: '리추얼 나이트',
  7: '루틴 챔피언',
  8: '전설의 수행자',
  9: '마스터 리추얼리스트',
  10: '루틴의 신',
};

export function getTitleForLevel(level: number): string {
  if (level >= 10) return TITLES[10];
  return TITLES[level] || TITLES[1];
}

// ─── Seed Demo Data (3 days of history) ───
export function createSeedData(characterClass: CharacterClass = 'warrior'): {
  character: Character;
  dailyLogs: DailyLog[];
  skills: SkillNode[];
  rituals: Ritual[];
} {
  const classInfo = CLASS_INFO[characterClass];
  const now = new Date();

  const selectedRituals = ALL_RITUALS.filter((_, i) => [0, 2, 3, 7, 10, 11, 12, 14].includes(i));

  const logs: DailyLog[] = [];
  let totalXp = 0;

  for (let dayOffset = 2; dayOffset >= 0; dayOffset--) {
    const date = new Date(now);
    date.setDate(date.getDate() - dayOffset);
    const dateStr = date.toISOString().split('T')[0];

    const completionCount = dayOffset === 0 ? 3 : dayOffset === 1 ? 6 : 5;
    const completions: QuestCompletion[] = selectedRituals
      .slice(0, completionCount)
      .map(r => ({
        ritualId: r.id,
        completedAt: dateStr + 'T' + (r.timeSlot === 'morning' ? '08' : r.timeSlot === 'afternoon' ? '14' : '20') + ':00:00',
        bonusXp: Math.random() > 0.7 ? 5 : 0,
      }));

    const dayXp = completions.reduce((sum, c) => {
      const ritual = selectedRituals.find(r => r.id === c.ritualId);
      return sum + (ritual?.xpReward || 0) + c.bonusXp;
    }, 0);

    totalXp += dayXp;
    logs.push({ date: dateStr, completions, totalXp: dayXp });
  }

  const { level, xp, xpToNext } = calculateLevel(totalXp);

  const skills = ALL_SKILLS.map(s => ({
    ...s,
    unlocked: s.tier === 1 && s.requiredLevel <= level,
  }));

  return {
    character: {
      name: '모험가',
      class: characterClass,
      level,
      xp,
      xpToNext,
      stats: { ...classInfo.baseStats },
      title: getTitleForLevel(level),
      streak: 3,
      createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    },
    dailyLogs: logs,
    skills,
    rituals: selectedRituals,
  };
}

// ─── Stat Descriptions for Profile ───
export const STAT_DESCRIPTIONS: Record<keyof CharacterStats, string> = {
  stamina: '체력 — 신체 활동과 건강 관련 루틴',
  intellect: '지력 — 학습과 업무 집중 루틴',
  spirit: '정신력 — 명상과 자기 성찰 루틴',
  agility: '민첩 — 새로운 경험과 도전 루틴',
};
