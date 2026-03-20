// ─── Character System ───
export type CharacterClass = 'warrior' | 'mage' | 'healer' | 'ranger';

export interface CharacterStats {
  stamina: number;    // 체력
  intellect: number;  // 지력
  spirit: number;     // 정신력
  agility: number;    // 민첩
}

export interface Character {
  name: string;
  class: CharacterClass;
  level: number;
  xp: number;
  xpToNext: number;
  stats: CharacterStats;
  title: string;
  streak: number;
  createdAt: string;
}

// ─── Ritual / Quest System ───
export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type RitualCategory = 'body' | 'mind' | 'soul' | 'social';

export interface Ritual {
  id: string;
  name: string;
  emoji: string;
  category: RitualCategory;
  timeSlot: TimeSlot;
  xpReward: number;
  statBonus: Partial<CharacterStats>;
  description: string;
}

export interface QuestCompletion {
  ritualId: string;
  completedAt: string;
  bonusXp: number;
}

export interface DailyLog {
  date: string;
  completions: QuestCompletion[];
  totalXp: number;
  bossDefeated?: boolean;
  reflection?: string;
}

// ─── Skill Tree ───
export type SkillTier = 1 | 2 | 3 | 4;

export interface SkillNode {
  id: string;
  name: string;
  description: string;
  emoji: string;
  tier: SkillTier;
  category: RitualCategory;
  requiredLevel: number;
  requires: string[];
  unlocked: boolean;
  passive: string;
}

// ─── Boss Battle ───
export type BossType = 'slime' | 'goblin' | 'dragon' | 'phoenix';

export interface WeeklyBoss {
  type: BossType;
  name: string;
  hp: number;
  maxHp: number;
  weakness: RitualCategory;
  reward: string;
  emoji: string;
}

export interface BossChallenge {
  question: string;
  category: 'reflection' | 'planning' | 'gratitude';
  answered: boolean;
  answer?: string;
}

// ─── Guild ───
export interface GuildMember {
  name: string;
  class: CharacterClass;
  level: number;
  streak: number;
  avatar: string;
}

// ─── App State ───
export type ScreenName =
  | 'worldIntro'
  | 'onboarding'
  | 'ritualSelect'
  | 'home'
  | 'quest'
  | 'skillTree'
  | 'bossBattle'
  | 'guild'
  | 'profile';

export interface AppState {
  character: Character;
  rituals: Ritual[];
  dailyLogs: DailyLog[];
  skills: SkillNode[];
  currentBoss: WeeklyBoss | null;
  guildMembers: GuildMember[];
}
