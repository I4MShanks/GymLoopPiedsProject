import React, { useState } from 'react';
import { Crown, Plus, Swords } from 'lucide-react';
import { GymChallenge, LeaderboardMember, LeaderboardScope } from '../types/gymloop';

interface LeaderboardViewProps {
  members: LeaderboardMember[];
  challenges: GymChallenge[];
  onContributeChallenge: (challengeId: string, amount: number) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  members,
  challenges,
  onContributeChallenge,
}) => {
  const [scope, setScope] = useState<LeaderboardScope>('This week');

  const filtered = members
    .filter((m) => (scope === 'Friends' ? m.isFriend || m.isYou : true))
    .slice()
    .sort((a, b) =>
      scope === 'Month' ? b.monthPoints - a.monthPoints : b.points - a.points
    );

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  const getScore = (m: LeaderboardMember) => (scope === 'Month' ? m.monthPoints : m.points);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Scope Filter */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-pixel text-[10px] text-[#3DD6FF] tracking-wider block mb-2">
            RESETS IN 2D 14H
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
            Iron Den leaderboard 🏆
          </h1>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#13122E] border border-white/12">
          {(['This week', 'Month', 'Friends'] as LeaderboardScope[]).map((tab) => {
            const active = scope === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setScope(tab)}
                className={`min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#39FF88] text-[#0B0A1F]'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Podium & Ranked List */}
        <div className="lg:col-span-7 rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-7 sticker-card">
          {/* Podium */}
          <div className="grid grid-cols-3 gap-3 items-end pt-4 pb-6 mb-5 border-b border-white/10">
            {/* #2 */}
            {second ? (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-1">{second.avatarEmoji}</div>
                <span className="text-xs font-semibold text-white mb-2 truncate max-w-full">
                  {second.name}
                </span>
                <div className="w-full h-24 rounded-t-2xl bg-[#3B429F] flex flex-col items-center justify-center p-2">
                  <span className="font-display text-2xl text-white tabular-nums">2</span>
                  <span className="font-mono text-[11px] text-slate-200 tabular-nums">
                    {getScore(second)} pts
                  </span>
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* #1 */}
            {first ? (
              <div className="flex flex-col items-center">
                <Crown className="w-6 h-6 text-[#FFD23F] fill-[#FFD23F] mb-1" />
                <div className="text-4xl mb-1">{first.avatarEmoji}</div>
                <span className="text-xs font-bold text-[#FFD23F] mb-2 truncate max-w-full">
                  {first.name}
                </span>
                <div className="w-full h-32 rounded-t-2xl bg-[#FFD23F] text-[#0B0A1F] flex flex-col items-center justify-center p-2 shadow-[0_0_24px_rgba(255,210,63,0.3)]">
                  <span className="font-display text-3xl tabular-nums">1</span>
                  <span className="font-mono text-xs font-bold tabular-nums">
                    {getScore(first)} pts
                  </span>
                </div>
              </div>
            ) : (
              <div />
            )}

            {/* #3 */}
            {third ? (
              <div className="flex flex-col items-center">
                <div className="text-3xl mb-1">{third.avatarEmoji}</div>
                <span className="text-xs font-semibold text-white mb-2 truncate max-w-full">
                  {third.name}
                </span>
                <div className="w-full h-20 rounded-t-2xl bg-[#FF3DA8] flex flex-col items-center justify-center p-2">
                  <span className="font-display text-2xl text-white tabular-nums">3</span>
                  <span className="font-mono text-[11px] text-white/90 tabular-nums">
                    {getScore(third)} pts
                  </span>
                </div>
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* Ranked Rows */}
          <div className="space-y-2.5">
            {rest.map((member, index) => {
              const rank = index + 4;
              return (
                <div
                  key={member.id}
                  className={`min-h-[54px] px-4 py-3 rounded-2xl flex items-center justify-between gap-3 border ${
                    member.isYou
                      ? 'bg-[#39FF88]/12 border-[#39FF88] shadow-[0_0_18px_rgba(57,255,136,0.16)]'
                      : 'bg-[#0E0D26] border-white/8'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-display text-sm text-slate-400 w-5 tabular-nums">
                      {rank}
                    </span>
                    <span className="text-xl shrink-0">{member.avatarEmoji}</span>
                    <span
                      className={`text-sm font-bold truncate ${
                        member.isYou ? 'text-[#39FF88]' : 'text-white'
                      }`}
                    >
                      {member.name}
                    </span>
                    <span className="text-[11px] text-slate-400 hidden sm:inline tabular-nums">
                      · {member.streakWeeks}w streak
                    </span>
                  </div>

                  <span
                    className={`font-display text-base tabular-nums ${
                      member.isYou ? 'text-[#39FF88]' : 'text-white'
                    }`}
                  >
                    {getScore(member)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Gym Challenges */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl bg-[#13122E] border border-white/12 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Swords className="w-5 h-5 text-[#FF3DA8]" />
              <h2 className="font-display text-lg text-white">Gym Challenges</h2>
            </div>

            <div className="space-y-4">
              {challenges
                .filter((c) => c.active)
                .map((challenge) => {
                  const pct = Math.min(100, Math.round((challenge.current / challenge.target) * 100));
                  const stepAmount = challenge.unit === 'squats' ? 25 : 1;
                  return (
                    <div
                      key={challenge.id}
                      className="rounded-2xl bg-[#0B0A1F] border border-[#FF3DA8]/45 p-4 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-white">{challenge.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {challenge.windowLabel} · +{challenge.xpBonus} XP reward
                          </p>
                        </div>
                        <span className="font-mono text-xs font-bold text-[#FF3DA8] tabular-nums">
                          {challenge.current}/{challenge.target}
                        </span>
                      </div>

                      <div className="h-2.5 rounded-full bg-[#161436] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#FF3DA8] to-[#FFD23F] transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => onContributeChallenge(challenge.id, stepAmount)}
                        className="w-full min-h-[42px] px-4 py-2 rounded-xl bg-[#FF3DA8] hover:bg-[#FF55B3] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>
                          Log +{stepAmount} {challenge.unit}
                        </span>
                      </button>
                    </div>
                  );
                })}
            </div>

            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Top 3 on the monthly leaderboard unlock the exclusive <strong className="text-[#3DD6FF]">Limited Cap 🧢</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
