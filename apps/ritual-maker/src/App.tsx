import { useState, useEffect, useCallback, useRef } from 'react';
import type { ScreenName, Character, Ritual, DailyLog, SkillNode, WeeklyBoss, GuildMember, CharacterClass } from './types';
import { createSeedData, BOSSES, DEMO_GUILD, calculateLevel, getTitleForLevel, calculatePassiveBonus, requestNotificationPermission, sendNotification } from './data';
import OnboardingScreen from './components/OnboardingScreen';
import RitualSelectScreen from './components/RitualSelectScreen';
import HomeScreen from './components/HomeScreen';
import QuestScreen from './components/QuestScreen';
import SkillTreeScreen from './components/SkillTreeScreen';
import BossBattleScreen from './components/BossBattleScreen';
import GuildScreen from './components/GuildScreen';
import ProfileScreen from './components/ProfileScreen';
import LevelUpModal from './components/LevelUpModal';
import WorldIntroScreen from './components/WorldIntroScreen';
import ShareCardModal from './components/ShareCardModal';

const STORAGE_KEY = 'ritual-maker-state';

interface SavedState {
  character: Character;
  rituals: Ritual[];
  dailyLogs: DailyLog[];
  skills: SkillNode[];
  currentBoss: WeeklyBoss | null;
  guildMembers: GuildMember[];
  demoSeeded: boolean;
  onboardingDone: boolean;
}

function loadState(): SavedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw) as SavedState;
      if (state.character && state.dailyLogs && state.onboardingDone) return state;
    }
  } catch { /* ignore */ }
  return null;
}

function saveState(state: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export default function App() {
  const savedState = loadState();
  const [screen, setScreen] = useState<ScreenName>(savedState ? 'home' : 'worldIntro');
  const [state, setState] = useState<SavedState | null>(savedState);
  const [levelUpInfo, setLevelUpInfo] = useState<{ newLevel: number } | null>(null);
  const [shareInfo, setShareInfo] = useState<{ type: 'profile' | 'levelUp' | 'bossDefeat'; bossName?: string } | null>(null);
  const [pendingClass, setPendingClass] = useState<CharacterClass | null>(null);
  const [pendingName, setPendingName] = useState<string>('');
  const prevLevelRef = useRef(savedState?.character.level || 0);

  useEffect(() => {
    if (state) saveState(state);
  }, [state]);

  // Request notification permission on first load
  useEffect(() => {
    if (state?.onboardingDone) {
      requestNotificationPermission();
    }
  }, [state?.onboardingDone]);

  // Schedule daily reminders
  useEffect(() => {
    if (!state?.onboardingDone) return;
    const scheduleReminder = () => {
      const now = new Date();
      const hour = now.getHours();
      const todayDate = now.toISOString().split('T')[0];
      const log = state.dailyLogs.find(l => l.date === todayDate);
      const completedCount = log?.completions.length || 0;
      const totalRituals = state.rituals.length;

      if (completedCount < totalRituals) {
        if (hour === 7 || hour === 12 || hour === 20) {
          const slot = hour <= 12 ? '아침' : hour <= 18 ? '오후' : '저녁';
          sendNotification(
            `${slot} 퀘스트를 기다리고 있어요! ⚔️`,
            `${state.character.name}님, 오늘 ${completedCount}/${totalRituals} 완료. Lv.${state.character.level} ${state.character.title}`,
          );
        }
      }
    };
    const interval = setInterval(scheduleReminder, 60 * 60 * 1000); // Check every hour
    return () => clearInterval(interval);
  }, [state]);

  // Level-up detection
  useEffect(() => {
    if (state && state.character.level > prevLevelRef.current && prevLevelRef.current > 0) {
      setLevelUpInfo({ newLevel: state.character.level });
    }
    if (state) prevLevelRef.current = state.character.level;
  }, [state?.character.level]);

  const navigate = useCallback((s: ScreenName) => setScreen(s), []);

  // Onboarding complete
  const handleOnboardingComplete = useCallback((name: string, selectedClass: CharacterClass) => {
    setPendingClass(selectedClass);
    setPendingName(name);
    setScreen('ritualSelect');
  }, []);

  // Ritual selection complete
  const handleRitualSelectComplete = useCallback((selectedRituals: Ritual[]) => {
    if (!pendingClass) return;
    const seed = createSeedData(pendingClass);
    const newState: SavedState = {
      character: { ...seed.character, name: pendingName || '모험가' },
      rituals: selectedRituals,
      dailyLogs: seed.dailyLogs,
      skills: seed.skills,
      currentBoss: BOSSES.week1,
      guildMembers: DEMO_GUILD,
      demoSeeded: true,
      onboardingDone: true,
    };
    setState(newState);
    prevLevelRef.current = newState.character.level;
    setScreen('home');
  }, [pendingClass, pendingName]);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = state?.dailyLogs.find(l => l.date === todayStr) || null;

  const handleCompleteRitual = useCallback((ritualId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const ritual = prev.rituals.find(r => r.id === ritualId);
      if (!ritual) return prev;

      const today = new Date().toISOString().split('T')[0];
      let logs = [...prev.dailyLogs];
      let existingLog = logs.find(l => l.date === today);

      if (!existingLog) {
        existingLog = { date: today, completions: [], totalXp: 0 };
        logs = [...logs, existingLog];
      }

      if (existingLog.completions.some(c => c.ritualId === ritualId)) return prev;

      const bonusXp = Math.random() > 0.7 ? 5 : 0;
      const classBonus = (
        (prev.character.class === 'warrior' && ritual.category === 'body') ||
        (prev.character.class === 'mage' && ritual.category === 'mind') ||
        (prev.character.class === 'healer' && ritual.category === 'soul') ||
        (prev.character.class === 'ranger' && ritual.category === 'social')
      ) ? Math.floor(ritual.xpReward * 0.2) : 0;

      // Apply passive skill bonuses
      const passives = calculatePassiveBonus(prev.skills);
      const morningBonus = ritual.timeSlot === 'morning' ? Math.floor(ritual.xpReward * passives.morningXpBonus) : 0;
      const baseXp = ritual.xpReward + bonusXp + classBonus + morningBonus;
      const xpGained = Math.floor(baseXp * passives.xpMultiplier);

      const updatedLog: DailyLog = {
        ...existingLog,
        completions: [...existingLog.completions, {
          ritualId,
          completedAt: new Date().toISOString(),
          bonusXp: bonusXp + classBonus,
        }],
        totalXp: existingLog.totalXp + xpGained,
      };

      logs = logs.map(l => l.date === today ? updatedLog : l);

      const { level, xp, xpToNext } = calculateLevel(
        logs.reduce((s, l) => s + l.totalXp, 0)
      );

      const newStats = { ...prev.character.stats };
      if (ritual.statBonus) {
        Object.entries(ritual.statBonus).forEach(([key, val]) => {
          if (val) {
            const statKey = key as keyof typeof newStats;
            newStats[statKey] = Math.min(20, newStats[statKey] + val);
          }
        });
      }

      // Apply stat bonuses from passives
      const passiveStats = passives.statBonuses;
      if (passiveStats) {
        Object.entries(passiveStats).forEach(([key, val]) => {
          if (val) {
            const statKey = key as keyof typeof newStats;
            newStats[statKey] = Math.min(20, newStats[statKey] + Math.floor(val * 0.1)); // Gradual application
          }
        });
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      const hadYesterday = logs.some(l => l.date === yesterdayStr && l.completions.length > 0);
      // Streak protection from passive
      const streak = hadYesterday
        ? prev.character.streak
        : passives.streakProtection
          ? prev.character.streak // Protected!
          : Math.max(1, prev.character.streak > 1 ? 1 : prev.character.streak);

      return {
        ...prev,
        character: {
          ...prev.character,
          level,
          xp,
          xpToNext,
          stats: newStats,
          title: getTitleForLevel(level),
          streak,
        },
        dailyLogs: logs,
      };
    });
  }, []);

  const handleUnlockSkill = useCallback((skillId: string) => {
    setState(prev => {
      if (!prev) return prev;
      const skill = prev.skills.find(s => s.id === skillId);
      if (!skill || skill.unlocked) return prev;
      if (prev.character.level < skill.requiredLevel) return prev;
      // Check prerequisites
      const prereqsMet = skill.requires.every(reqId => prev.skills.find(s => s.id === reqId)?.unlocked);
      if (!prereqsMet) return prev;

      return {
        ...prev,
        skills: prev.skills.map(s => s.id === skillId ? { ...s, unlocked: true } : s),
      };
    });
  }, []);

  const [returnScreen, setReturnScreen] = useState<ScreenName>('home');

  const handleUpdateRituals = useCallback((newRituals: Ritual[]) => {
    setState(prev => {
      if (!prev) return prev;
      return { ...prev, rituals: newRituals };
    });
    setScreen(returnScreen);
  }, [returnScreen]);

  const handleDefeatBoss = useCallback(() => {
    setState(prev => {
      if (!prev) return prev;
      const defeatedBossName = prev.currentBoss?.name;
      const bossKeys = Object.keys(BOSSES);
      const currentIdx = bossKeys.findIndex(k => BOSSES[k].type === prev.currentBoss?.type);
      const nextBoss = BOSSES[bossKeys[(currentIdx + 1) % bossKeys.length]] || null;

      // Show share card after boss defeat
      if (defeatedBossName) {
        setTimeout(() => setShareInfo({ type: 'bossDefeat', bossName: defeatedBossName }), 1500);
      }

      return {
        ...prev,
        currentBoss: nextBoss,
        character: { ...prev.character, xp: prev.character.xp + 100 },
      };
    });
  }, []);

  // Weekly logs for boss battle
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekStartStr = weekStart.toISOString().split('T')[0];
  const weeklyLogs = state?.dailyLogs.filter(l => l.date >= weekStartStr) || [];

  const showNav = state && !['worldIntro', 'onboarding', 'ritualSelect'].includes(screen);

  return (
    <div className="min-h-[100dvh] bg-surface relative overflow-hidden">
      {/* World Intro */}
      {screen === 'worldIntro' && (
        <WorldIntroScreen onComplete={() => setScreen('onboarding')} />
      )}

      {/* Onboarding */}
      {screen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {/* Ritual Selection */}
      {screen === 'ritualSelect' && pendingClass && (
        <RitualSelectScreen characterClass={pendingClass} onComplete={handleRitualSelectComplete} />
      )}

      {/* Main Screens */}
      {state && (
        <>
          {screen === 'home' && (
            <HomeScreen
              character={state.character}
              todayLog={todayLog}
              rituals={state.rituals}
              hasBoss={!!state.currentBoss}
              onNavigate={navigate}
            />
          )}
          {screen === 'quest' && (
            <QuestScreen
              character={state.character}
              rituals={state.rituals}
              todayLog={todayLog || { date: todayStr, completions: [], totalXp: 0 }}
              onComplete={handleCompleteRitual}
              onBack={() => navigate('home')}
            />
          )}
          {screen === 'skillTree' && (
            <SkillTreeScreen
              character={state.character}
              skills={state.skills}
              onUnlockSkill={handleUnlockSkill}
              onBack={() => navigate('home')}
            />
          )}
          {screen === 'ritualSelect' && (
            <RitualSelectScreen
              characterClass={state.character.class}
              onComplete={handleUpdateRituals}
              onBack={() => navigate(returnScreen)}
              initialRitualIds={state.rituals.map(r => r.id)}
            />
          )}
          {screen === 'bossBattle' && state.currentBoss && (
            <BossBattleScreen
              boss={state.currentBoss}
              weeklyLogs={weeklyLogs}
              onDefeatBoss={handleDefeatBoss}
              onBack={() => navigate('home')}
            />
          )}
          {screen === 'guild' && (
            <GuildScreen
              character={state.character}
              guildMembers={state.guildMembers}
              onBack={() => navigate('home')}
            />
          )}
          {screen === 'profile' && (
            <ProfileScreen
              character={state.character}
              dailyLogs={state.dailyLogs}
              skills={state.skills}
              rituals={state.rituals}
              onBack={() => navigate('home')}
              onEditRituals={() => { setReturnScreen('profile'); navigate('ritualSelect'); }}
              onShareProfile={() => setShareInfo({ type: 'profile' })}
            />
          )}
        </>
      )}

      {/* Bottom Navigation */}
      {showNav && (
        <nav className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest/95 backdrop-blur-sm border-t border-white/5 safe-area-bottom">
          <div className="flex">
            {[
              { screen: 'home' as const, emoji: '🏠', label: '홈' },
              { screen: 'quest' as const, emoji: '⚔️', label: '퀘스트' },
              { screen: 'skillTree' as const, emoji: '🌳', label: '스킬' },
              { screen: 'guild' as const, emoji: '🏰', label: '길드' },
              { screen: 'profile' as const, emoji: '👤', label: '프로필' },
            ].map(item => (
              <button
                key={item.screen}
                onClick={() => navigate(item.screen)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2 transition-colors ${
                  screen === item.screen ? 'text-amber-400' : 'text-on-surface-variant/60'
                }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className="text-[10px]">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Level Up Modal */}
      {levelUpInfo && state && (
        <LevelUpModal
          character={state.character}
          newLevel={levelUpInfo.newLevel}
          onClose={() => {
            setLevelUpInfo(null);
            setShareInfo({ type: 'levelUp' });
          }}
        />
      )}

      {/* Share Card Modal */}
      {shareInfo && state && (
        <ShareCardModal
          character={state.character}
          skills={state.skills}
          type={shareInfo.type}
          bossName={shareInfo.bossName}
          onClose={() => setShareInfo(null)}
        />
      )}
    </div>
  );
}
