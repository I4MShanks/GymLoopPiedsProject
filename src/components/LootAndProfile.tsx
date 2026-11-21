import React, { useState } from 'react';
import { Award, Check, Copy, Gift, Lock, Share2, Sparkles } from 'lucide-react';
import { RewardTier } from '../types/gymloop';

interface LootAndProfileProps {
  initialSection: 'loot' | 'profile';
  memberName: string;
  level: number;
  titleBadge: string;
  streakWeeks: number;
  totalCheckIns: number;
  bestStreak: number;
  rewards: RewardTier[];
  onClaimReward: (id: string) => void;
}

export const LootAndProfile: React.FC<LootAndProfileProps> = ({
  initialSection,
  memberName,
  level,
  titleBadge,
  streakWeeks,
  totalCheckIns,
  bestStreak,
  rewards,
  onClaimReward,
}) => {
  const [activeTab, setActiveTab] = useState<'loot' | 'profile'>(initialSection);
  const [selectedReward, setSelectedReward] = useState<RewardTier>(rewards[1] ?? rewards[0]);
  const [referralCopied, setReferralCopied] = useState(false);

  React.useEffect(() => {
    setActiveTab(initialSection);
  }, [initialSection]);

  const handleCopyReferral = () => {
    const referralCode = 'GYMLOOP-PARTH-2X';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Join me at Iron Den on GymLoop! Code: ${referralCode}`).catch(() => {});
    }
    setReferralCopied(true);
    window.setTimeout(() => setReferralCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Switcher */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-pixel text-[10px] text-[#FFD23F] tracking-wider block mb-2">
            SEASON 2027 · WEEK {streakWeeks}/52
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white tracking-tight">
            {activeTab === 'loot' ? 'Reward track 🎁' : 'Player card & inventory'}
          </h1>
        </div>

        <div className="inline-flex items-center gap-1 p-1 rounded-2xl bg-[#13122E] border border-white/12">
          <button
            type="button"
            onClick={() => setActiveTab('loot')}
            className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'loot' ? 'bg-[#FF3DA8] text-white' : 'text-slate-300 hover:text-white'
            }`}
          >
            Reward Track
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`min-h-[40px] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === 'profile' ? 'bg-[#39FF88] text-[#0B0A1F]' : 'text-slate-300 hover:text-white'
            }`}
          >
            Profile &amp; Loot
          </button>
        </div>
      </div>

      {/* Desktop displays both side-by-side or emphasizes selected tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 07 · Reward Track */}
        <div
          className={`lg:col-span-7 rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-7 sticker-card ${
            activeTab === 'profile' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-xl text-white">Battle-pass merch path</h2>
            <span className="text-xs text-slate-400">Can&apos;t be bought. Only earned.</span>
          </div>

          <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-4 before:bottom-4 before:w-1 before:rounded-full before:bg-gradient-to-b before:from-[#39FF88] before:via-[#FF3DA8] before:to-[#8B5CFF]/30">
            {rewards.map((item) => {
              const progressPct = item.isTopMonthly
                ? 0
                : Math.min(100, Math.round((streakWeeks / item.targetWeeks) * 100));
              const isSelected = selectedReward.id === item.id;
              const isActiveTrack = !item.unlocked && item.targetWeeks === 20;

              return (
                <div
                  key={item.id}
                  className={`w-full rounded-2xl p-4 border transition-all relative ${
                    item.unlocked
                      ? 'bg-[#0E2422] border-[#39FF88]/70'
                      : isActiveTrack || isSelected
                        ? 'bg-[#1D1433] border-[#FF3DA8] shadow-[0_0_20px_rgba(255,61,168,0.18)]'
                        : 'bg-[#0E0D26] border-white/10 hover:border-white/25'
                  }`}
                >
                  {/* Timeline Node */}
                  <span
                    className={`absolute -left-[22px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border-2 border-[#0B0A1F] ${
                      item.unlocked
                        ? 'bg-[#39FF88]'
                        : isActiveTrack
                          ? 'bg-[#FF3DA8]'
                          : 'bg-slate-600'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setSelectedReward(item)}
                    className="w-full text-left flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-12 h-12 rounded-2xl bg-[#0B0A1F] border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-white truncate">{item.name}</p>
                        <p className="text-xs text-slate-300 tabular-nums">
                          {item.unlocked
                            ? `${item.targetWeeks} weeks`
                            : item.isTopMonthly
                              ? item.requirementLabel
                              : `${item.targetWeeks} weeks · ${Math.max(
                                  0,
                                  item.targetWeeks - streakWeeks
                                )} to go`}
                        </p>
                      </div>
                    </div>

                    {item.unlocked ? (
                      <span className="font-pixel text-[10px] bg-[#39FF88] text-[#0B0A1F] px-2.5 py-1.5 rounded-lg font-bold shrink-0">
                        {item.claimed ? 'UNLOCKED' : 'CLAIM'}
                      </span>
                    ) : isActiveTrack ? (
                      <span className="font-pixel text-[10px] bg-[#FF3DA8] text-white px-2.5 py-1.5 rounded-lg font-bold tabular-nums shrink-0">
                        {progressPct}%
                      </span>
                    ) : (
                      <Lock className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>

                  {isSelected && (
                    <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between gap-3 text-xs text-slate-300">
                      <span>{item.description}</span>
                      {item.unlocked && !item.claimed && (
                        <button
                          type="button"
                          onClick={() => onClaimReward(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#39FF88] text-[#0B0A1F] font-bold shrink-0 cursor-pointer"
                        >
                          Claim now
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Earn It Back Rule */}
          <div className="mt-6 rounded-2xl bg-[#FFD23F]/8 border border-[#FFD23F]/45 p-4 text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-[#FFD23F]">Missed a week?</strong> No freezes — finish 3 goal
            weeks to earn your streak back.
          </div>
        </div>

        {/* Right: 09 · Profile & Inventory */}
        <div
          className={`lg:col-span-5 rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-7 sticker-card ${
            activeTab === 'loot' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#FF3DA8] via-[#8B5CFF] to-[#39FF88] p-[3px] mb-3 sticker-pink">
              <div className="w-full h-full rounded-[21px] bg-[#161436] flex items-center justify-center text-4xl">
                😎
              </div>
            </div>
            <h2 className="font-display text-2xl text-white">{memberName}</h2>
            <p className="font-pixel text-[10px] text-[#3DD6FF] tracking-widest mt-1 mb-3">
              LVL {level} · {titleBadge}
            </p>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFD23F] text-[#0B0A1F] text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Founding Member</span>
            </span>
          </div>

          {/* 3-stat row */}
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            <div className="rounded-2xl bg-[#0B0A1F] border border-white/10 p-3 text-center">
              <div className="font-display text-2xl text-[#3DD6FF] tabular-nums">{streakWeeks}</div>
              <div className="font-pixel text-[9px] text-slate-400 mt-0.5">STREAK</div>
            </div>
            <div className="rounded-2xl bg-[#0B0A1F] border border-white/10 p-3 text-center">
              <div className="font-display text-2xl text-[#FF3DA8] tabular-nums">
                {totalCheckIns}
              </div>
              <div className="font-pixel text-[9px] text-slate-400 mt-0.5">CHECK-INS</div>
            </div>
            <div className="rounded-2xl bg-[#0B0A1F] border border-white/10 p-3 text-center">
              <div className="font-display text-2xl text-[#39FF88] tabular-nums">{bestStreak}</div>
              <div className="font-pixel text-[9px] text-slate-400 mt-0.5">BEST</div>
            </div>
          </div>

          {/* Inventory 4-slot grid */}
          <div className="mb-6">
            <h3 className="font-pixel text-[10px] text-slate-400 tracking-wider mb-3">
              INVENTORY
            </h3>
            <div className="grid grid-cols-4 gap-2.5">
              {rewards.map((item) => (
                <div
                  key={item.id}
                  title={item.name}
                  className={`aspect-square rounded-2xl flex flex-col items-center justify-center border transition-all ${
                    item.unlocked
                      ? 'bg-[#0E2422] border-[#39FF88] shadow-[0_0_16px_rgba(57,255,136,0.2)]'
                      : 'bg-[#0B0A1F] border-white/10 opacity-45'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-[10px] font-medium text-slate-300 mt-1 truncate max-w-[90%]">
                    {item.name.split(' ').pop()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Badges */}
          <div className="mb-6">
            <h3 className="font-pixel text-[10px] text-slate-400 tracking-wider mb-3">
              BADGES
            </h3>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0A1F] border border-white/12 text-xs font-medium text-slate-200">
                <Award className="w-3.5 h-3.5 text-[#FFD23F]" />
                <span>Early bird</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0A1F] border border-white/12 text-xs font-medium text-slate-200">
                <span>🤝</span>
                <span>Brought a friend</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B0A1F] border border-white/12 text-xs font-medium text-slate-200">
                <span>🦵</span>
                <span>Leg day loyal</span>
              </span>
            </div>
          </div>

          {/* Invite Referral Button */}
          <button
            type="button"
            onClick={handleCopyReferral}
            className="w-full min-h-[48px] px-4 py-3 rounded-2xl bg-[#0B0A1F] hover:bg-[#19173D] border border-[#3DD6FF]/50 text-xs font-bold text-[#3DD6FF] flex items-center justify-between gap-2 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-[#FF3DA8]" />
              <span>Invite a friend → double streak week</span>
            </span>
            {referralCopied ? (
              <span className="inline-flex items-center gap-1 text-[#39FF88]">
                <Check className="w-3.5 h-3.5" /> Copied
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-300">
                <Copy className="w-3.5 h-3.5" />
                <Share2 className="w-3.5 h-3.5" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
