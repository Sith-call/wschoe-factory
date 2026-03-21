import { Session, PetStage, Achievement } from './types';

const STORAGE_KEY = 'focus-timer-sessions';
const SETTINGS_KEY = 'focus-timer-settings';
const DEMO_KEY = 'focus-timer-demo';
const ACHIEVEMENTS_KEY = 'focus-timer-achievements';

export interface TimerSettings {
  focusDuration: number; // minutes
  breakDuration: number; // minutes
}

export function getSettings(): TimerSettings {
  const data = localStorage.getItem(SETTINGS_KEY);
  return data ? JSON.parse(data) : { focusDuration: 25, breakDuration: 5 };
}

export function saveSettings(settings: TimerSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function saveSession(session: Session): void {
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function getSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

export function getTodaysSessions(): Session[] {
  const today = new Date().toISOString().split('T')[0];
  return getSessions().filter(s => s.date === today);
}

export function getWeekSessions(): Session[] {
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 6);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  return getSessions().filter(s => s.date >= weekAgoStr);
}

export function isDemoMode(): boolean {
  return localStorage.getItem(DEMO_KEY) === 'true';
}

export function loadDemoData(): void {
  const sessions: Session[] = [];
  const now = new Date();

  for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
    const d = new Date(now);
    d.setDate(d.getDate() - dayOffset);
    const dateStr = d.toISOString().split('T')[0];
    const dayOfWeek = d.getDay(); // 0=Sun, 6=Sat

    // More sessions on weekdays, fewer on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const sessionCount = isWeekend
      ? Math.floor(Math.random() * 3) + 1
      : Math.floor(Math.random() * 4) + 3;

    for (let j = 0; j < sessionCount; j++) {
      // Lower energy on Fridays
      const isFriday = dayOfWeek === 5;
      const baseEnergy = isFriday ? 2 : 3;
      const energy = Math.min(5, Math.max(1, baseEnergy + Math.floor(Math.random() * 3) - 1));

      const hour = 9 + j * 1.5;
      const sessionDate = new Date(d);
      sessionDate.setHours(Math.floor(hour), Math.floor((hour % 1) * 60), 0, 0);

      sessions.push({
        date: dateStr,
        focusMinutes: [20, 25, 25, 30, 25][Math.floor(Math.random() * 5)],
        energy,
        completedAt: sessionDate.toISOString(),
      });
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  localStorage.setItem(DEMO_KEY, 'true');
}

export function clearData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(DEMO_KEY);
  localStorage.removeItem(ACHIEVEMENTS_KEY);
}

// ─── Focus Pet ───────────────────────────────────────────────

const PET_STAGES: PetStage[] = [
  { emoji: '\uD83E\uDD5A', name: '\uC54C', message: '\uC544\uC9C1 \uC7A0\uB4E4\uC5B4 \uC788\uC5B4\uC694...', minSessions: 0 },
  { emoji: '\uD83D\uDC23', name: '\uBCD1\uC544\uB9AC', message: '\uC090\uC57D! \uC9D1\uC911\uD558\uBA74 \uC790\uB77C\uC694!', minSessions: 5 },
  { emoji: '\uD83D\uDC14', name: '\uB2ED', message: '\uAF2C\uB07C\uC624! \uC9D1\uC911\uB825\uC774 \uC291\uC291!', minSessions: 15 },
  { emoji: '\uD83E\uDD85', name: '\uB3C5\uC218\uB9AC', message: '\uD558\uB298\uC744 \uB0A0 \uC900\uBE44 \uC644\uB8CC!', minSessions: 30 },
  { emoji: '\uD83D\uDD25\uD83D\uDC26\u200D\uD83D\uDD25', name: '\uBD88\uC0AC\uC870', message: '\uC804\uC124\uC758 \uC9D1\uC911 \uB9C8\uC2A4\uD130!', minSessions: 50 },
];

export function getPetStage(): PetStage {
  const totalSessions = getSessions().length;
  let stage = PET_STAGES[0];
  for (const s of PET_STAGES) {
    if (totalSessions >= s.minSessions) {
      stage = s;
    }
  }
  return stage;
}

export function getPreviousPetStage(): PetStage | null {
  const totalSessions = getSessions().length;
  let prevStage: PetStage | null = null;
  for (const s of PET_STAGES) {
    if (totalSessions >= s.minSessions) {
      // current stage is s, previous is whatever came before
    } else {
      break;
    }
    prevStage = s;
  }
  // Return the stage before current
  const currentIdx = PET_STAGES.indexOf(prevStage!);
  return currentIdx > 0 ? PET_STAGES[currentIdx - 1] : null;
}

export function didPetJustEvolve(): boolean {
  const totalSessions = getSessions().length;
  return PET_STAGES.some(s => s.minSessions === totalSessions && s.minSessions > 0);
}

// ─── Achievements ────────────────────────────────────────────

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ACHIEVEMENT_DEFS: AchievementDef[] = [
  { id: 'first_step', name: '\uCCAB \uBC1C\uAC78\uC74C', description: '\uCCAB \uBC88\uC9F8 \uC138\uC158 \uC644\uB8CC', icon: '\uD83D\uDC63' },
  { id: 'habit_start', name: '\uC2B5\uAD00\uC758 \uC2DC\uC791', description: '5\uD68C \uC138\uC158 \uC644\uB8CC', icon: '\uD83C\uDF31' },
  { id: 'focus_master', name: '\uC9D1\uC911 \uB2EC\uC778', description: '25\uD68C \uC138\uC158 \uC644\uB8CC', icon: '\uD83C\uDFC6' },
  { id: 'early_bird', name: '\uC0C8\uBCBD\uD615 \uC778\uAC04', description: '\uC624\uC804 7\uC2DC \uC804\uC5D0 \uC138\uC158 \uC644\uB8CC', icon: '\uD83C\uDF05' },
  { id: 'night_warrior', name: '\uC57C\uADFC \uC804\uC0AC', description: '\uC624\uD6C4 9\uC2DC \uC774\uD6C4\uC5D0 \uC138\uC158 \uC644\uB8CC', icon: '\uD83C\uDF19' },
  { id: 'full_energy', name: '\uC5D0\uB108\uC9C0 \uB9CC\uB545', description: '\uC5D0\uB108\uC9C0 5\uC810 \uD3C9\uAC00', icon: '\u26A1' },
  { id: 'streak_3', name: '3\uC77C \uC5F0\uC18D', description: '3\uC77C \uC5F0\uC18D \uC9D1\uC911', icon: '\uD83D\uDD25' },
  { id: 'streak_7', name: '\uC77C\uC8FC\uC77C \uC5F0\uC18D', description: '7\uC77C \uC5F0\uC18D \uC9D1\uC911', icon: '\uD83D\uDCAB' },
  { id: 'marathon', name: '\uB9C8\uB77C\uD1A4 \uC9D1\uC911', description: '\uD558\uB8E8 8\uD68C \uC774\uC0C1 \uC138\uC158', icon: '\uD83C\uDFC3' },
  { id: 'perfect_week', name: '\uC644\uBCBD\uD55C \uD55C \uC8FC', description: '7\uC77C \uBAA8\uB450 \uC138\uC158 \uC644\uB8CC', icon: '\uD83D\uDC8E' },
];

function getUnlockedAchievements(): Record<string, string> {
  const data = localStorage.getItem(ACHIEVEMENTS_KEY);
  return data ? JSON.parse(data) : {};
}

function saveUnlockedAchievements(unlocked: Record<string, string>): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked));
}

export function getAchievements(): Achievement[] {
  const unlocked = getUnlockedAchievements();
  return ACHIEVEMENT_DEFS.map(def => ({
    id: def.id,
    name: def.name,
    description: def.description,
    icon: def.icon,
    unlockedAt: unlocked[def.id] || null,
  }));
}

function getCurrentStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const dateSet = new Set(sessions.map(s => s.date));
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    if (dateSet.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function hasAllDaysOfWeek(sessions: Session[]): boolean {
  const daysOfWeek = new Set<number>();
  for (const s of sessions) {
    const d = new Date(s.date + 'T00:00:00');
    daysOfWeek.add(d.getDay());
  }
  return daysOfWeek.size === 7;
}

export function checkAchievements(): string[] {
  const sessions = getSessions();
  const unlocked = getUnlockedAchievements();
  const newlyUnlocked: string[] = [];
  const now = new Date().toISOString();

  const check = (id: string, condition: boolean) => {
    if (!unlocked[id] && condition) {
      unlocked[id] = now;
      newlyUnlocked.push(id);
    }
  };

  const totalCount = sessions.length;

  // 1. First session
  check('first_step', totalCount >= 1);

  // 2. 5 sessions
  check('habit_start', totalCount >= 5);

  // 3. 25 sessions
  check('focus_master', totalCount >= 25);

  // 4. Before 7 AM
  check('early_bird', sessions.some(s => {
    const hour = new Date(s.completedAt).getHours();
    return hour < 7;
  }));

  // 5. After 9 PM
  check('night_warrior', sessions.some(s => {
    const hour = new Date(s.completedAt).getHours();
    return hour >= 21;
  }));

  // 6. Energy 5
  check('full_energy', sessions.some(s => s.energy === 5));

  // 7. 3-day streak
  check('streak_3', getCurrentStreak(sessions) >= 3);

  // 8. 7-day streak
  check('streak_7', getCurrentStreak(sessions) >= 7);

  // 9. 8+ sessions in one day
  check('marathon', (() => {
    const dayCounts: Record<string, number> = {};
    sessions.forEach(s => { dayCounts[s.date] = (dayCounts[s.date] || 0) + 1; });
    return Object.values(dayCounts).some(c => c >= 8);
  })());

  // 10. All 7 days of week
  check('perfect_week', hasAllDaysOfWeek(sessions));

  if (newlyUnlocked.length > 0) {
    saveUnlockedAchievements(unlocked);
  }

  return newlyUnlocked;
}
