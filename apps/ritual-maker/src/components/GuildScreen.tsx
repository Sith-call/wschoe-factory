import type { Character, GuildMember } from '../types';
import { CLASS_INFO } from '../data';

interface Props {
  character: Character;
  guildMembers: GuildMember[];
  onBack: () => void;
}

export default function GuildScreen({ character, guildMembers, onBack }: Props) {
  const classInfo = CLASS_INFO[character.class];

  // Combine player with guild for ranking
  const allMembers = [
    { name: character.name + ' (나)', class: character.class, level: character.level, streak: character.streak, avatar: classInfo.emoji, isPlayer: true },
    ...guildMembers.map(m => ({ ...m, isPlayer: false })),
  ].sort((a, b) => b.level !== a.level ? b.level - a.level : b.streak - a.streak);

  const guildLevel = Math.floor(allMembers.reduce((s, m) => s + m.level, 0) / allMembers.length);
  const totalStreak = allMembers.reduce((s, m) => s + m.streak, 0);

  return (
    <div className="min-h-[100dvh] p-4 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={onBack} className="text-on-surface-variant hover:text-white transition-colors text-lg">←</button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-white">루틴 길드</h1>
          <p className="text-xs text-on-surface-variant">함께 성장하는 동료들</p>
        </div>
      </div>

      {/* Guild Stats */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5 text-center">
          <div className="text-xl mb-0.5">🏰</div>
          <div className="text-lg font-bold text-white">{allMembers.length}</div>
          <div className="text-[10px] text-on-surface-variant">길드원</div>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5 text-center">
          <div className="text-xl mb-0.5">⭐</div>
          <div className="text-lg font-bold text-amber-400">Lv.{guildLevel}</div>
          <div className="text-[10px] text-on-surface-variant">길드 레벨</div>
        </div>
        <div className="p-3 rounded-xl bg-surface-container-highest/40 border border-white/5 text-center">
          <div className="text-xl mb-0.5">🔥</div>
          <div className="text-lg font-bold text-orange-400">{totalStreak}</div>
          <div className="text-[10px] text-on-surface-variant">총 스트릭</div>
        </div>
      </div>

      {/* Ranking */}
      <h2 className="text-sm font-semibold text-white mb-3">🏆 길드 랭킹</h2>
      <div className="space-y-2 mb-6">
        {allMembers.map((member, i) => {
          const memberClassInfo = CLASS_INFO[member.class];
          const rankEmoji = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                member.isPlayer
                  ? 'bg-amber-500/10 border-amber-500/30'
                  : 'bg-surface-container-highest/40 border-white/5'
              }`}
            >
              <div className="w-8 text-center text-lg">{rankEmoji}</div>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-black/20 border border-white/10">
                {member.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${member.isPlayer ? 'text-amber-400' : 'text-white'}`}>
                    {member.name}
                  </span>
                  <span className="text-[10px] text-on-surface-variant">{memberClassInfo.name}</span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-[10px] text-on-surface-variant">Lv.{member.level}</span>
                  <span className="text-[10px] text-orange-400">🔥 {member.streak}일</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Challenge */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/20 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">⚡</span>
          <span className="text-sm font-semibold text-white">이번 주 길드 챌린지</span>
        </div>
        <p className="text-xs text-on-surface-variant mb-3">
          길드원 모두 3일 연속 스트릭 달성하기
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 rounded-full bg-black/30 overflow-hidden">
            <div className="h-full rounded-full bg-purple-500 transition-all" style={{ width: '60%' }} />
          </div>
          <span className="text-[10px] text-purple-400 font-mono">3/5</span>
        </div>
        <div className="text-[10px] text-on-surface-variant mt-1.5">
          보상: 길드 전체 XP +50
        </div>
      </div>

      {/* Invite */}
      <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-white/20 text-on-surface-variant text-sm hover:border-white/40 hover:text-white transition-all active:scale-[0.98]">
        + 친구 초대하기
      </button>
    </div>
  );
}
