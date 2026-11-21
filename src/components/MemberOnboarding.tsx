import React from 'react';
import { ArrowRight, Play, ShieldCheck, Sparkles, Target } from 'lucide-react';
import { FocusGoal, OnboardingStep } from '../types/gymloop';

interface MemberOnboardingProps {
  step: OnboardingStep;
  setStep: (step: OnboardingStep) => void;
  weeklyGoal: 3 | 4;
  setWeeklyGoal: (goal: 3 | 4) => void;
  selectedDays: string[];
  onToggleDay: (dayKey: string) => void;
  focusGoal: FocusGoal;
  setFocusGoal: (focus: FocusGoal) => void;
  onComplete: () => void;
  onOpenOwnerMode: () => void;
}

const WEEK_DAYS = [
  { key: 'Mon', label: 'M' },
  { key: 'Tue', label: 'T' },
  { key: 'Wed', label: 'W' },
  { key: 'Thu', label: 'T' },
  { key: 'Fri', label: 'F' },
  { key: 'Sat', label: 'S' },
  { key: 'Sun', label: 'S' },
];

const FOCUS_OPTIONS: { label: FocusGoal; emoji: string }[] = [
  { label: 'Build muscle', emoji: '💪' },
  { label: 'Fat loss', emoji: '🔥' },
  { label: 'Strength', emoji: '⚡' },
  { label: 'Mobility', emoji: '🧘' },
];

export const MemberOnboarding: React.FC<MemberOnboardingProps> = ({
  step,
  setStep,
  weeklyGoal,
  setWeeklyGoal,
  selectedDays,
  onToggleDay,
  focusGoal,
  setFocusGoal,
  onComplete,
  onOpenOwnerMode,
}) => {
  if (step === 'splash') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Splash Card */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-7">
              <span
                className="inline-block bg-[#FFD23F] text-[#0B0A1F] font-pixel text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg -rotate-3 sticker-gold font-bold"
              >
                FREE TO PLAY
              </span>
              <span
                className="inline-block bg-[#3DD6FF] text-[#0B0A1F] font-pixel text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg rotate-2 sticker-cyan font-bold"
              >
                NO CHEAT CODES
              </span>
            </div>

            <div className="mb-6 flex items-center justify-center lg:justify-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-[#161436] border border-white/15 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
                  <rect x="6" y="18" width="6" height="16" rx="2" fill="#3DD6FF" />
                  <rect x="12" y="14" width="6" height="24" rx="2" fill="#FF3DA8" />
                  <rect x="46" y="14" width="6" height="24" rx="2" fill="#FF3DA8" />
                  <rect x="52" y="18" width="6" height="16" rx="2" fill="#3DD6FF" />
                  <rect x="18" y="24" width="28" height="4" rx="2" fill="#E2E8F0" />
                  <circle cx="32" cy="28" r="5" fill="#FFD23F" />
                  <path d="M24 34 L40 34 L38 48 L26 48 Z" fill="#39FF88" />
                  <path d="M26 48 L22 58 M38 48 L42 58" stroke="#3DD6FF" strokeWidth="4" strokeLinecap="round" />
                  <path d="M24 36 L18 26 M40 36 L46 26" stroke="#FFD23F" strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-pixel text-xs text-[#39FF88] tracking-widest">
                LVL 01 · PLAYER SELECT
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-[#39FF88] text-arcade-shadow mb-5">
              GYM
              <br />
              LOOP
            </h1>

            <p className="font-pixel text-xs sm:text-sm tracking-widest text-slate-200 mb-8 max-w-md">
              SEE THE CROWD. SHOW UP MORE. EARN IT.
            </p>

            <div className="w-full max-w-sm flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setStep('goal')}
                className="w-full min-h-[54px] px-7 py-4 rounded-2xl bg-[#39FF88] hover:bg-[#52FF9A] active:translate-y-0.5 text-[#0B0A1F] font-display text-lg tracking-wide flex items-center justify-center gap-3 sticker-green transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PRESS START</span>
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1 px-1">
                <span>
                  Your gym: <strong className="text-white font-semibold">Iron Den, Pilani</strong>
                </span>
                <button
                  type="button"
                  onClick={onComplete}
                  className="text-[#3DD6FF] hover:underline font-medium cursor-pointer"
                >
                  Skip to Home →
                </button>
              </div>
            </div>
          </div>

          {/* Right Arcade Preview Card (Desktop Presence) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-[#13122E]/90 border border-white/12 p-6 sm:p-8 sticker-card">
              <div className="flex items-center justify-between mb-5">
                <span className="font-pixel text-[11px] text-[#FF3DA8] tracking-wider">
                  IRON DEN · PILANI
                </span>
                <span className="font-mono text-xs text-[#39FF88] tabular-nums">
                  23 inside · 31%
                </span>
              </div>

              <h2 className="font-display text-2xl text-white mb-3 text-balance">
                Turn showing up into loot you cannot buy.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Auto-detected via desk QR at Iron Den. Track live floor crowd before you walk over,
                hit your weekly check-in streak, and unlock limited streetwear drops.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0A1F]/80 border border-white/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔑</span>
                    <div>
                      <p className="text-sm font-semibold text-white">5-Week Streak</p>
                      <p className="text-xs text-slate-400">Anodized Metal Keychain</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-[#39FF88]">STAGE 1</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0A1F]/80 border border-white/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👕</span>
                    <div>
                      <p className="text-sm font-semibold text-white">20-Week Streak</p>
                      <p className="text-xs text-slate-400">Heavyweight Loop Tee</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-[#FF3DA8]">STAGE 2</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#0B0A1F]/80 border border-white/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧥</span>
                    <div>
                      <p className="text-sm font-semibold text-white">35-Week Streak</p>
                      <p className="text-xs text-slate-400">Embroidered Season Hoodie</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-[#8B5CFF]">STAGE 3</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenOwnerMode}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/12 text-xs font-medium text-slate-200 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Managing a gym? Switch to Boss Mode</span>
                <ArrowRight className="w-4 h-4 text-[#FFD23F]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 02 · Weekly Goal
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-8 sticker-card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-pixel text-[11px] text-[#39FF88] tracking-widest">
            STEP 2 / 3
          </span>
          <button
            type="button"
            onClick={() => setStep('splash')}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 flex items-center gap-2.5 text-balance">
          <span>Set your weekly quest</span>
          <Target className="w-7 h-7 text-[#FF3DA8] shrink-0" />
        </h1>
        <p className="text-sm text-slate-300 mb-6">
          How many days a week will you show up at Iron Den?
        </p>

        {/* 3 or 4 Days Goal Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setWeeklyGoal(3)}
            className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              weeklyGoal === 3
                ? 'bg-[#1D1B46] border-[#39FF88] sticker-green'
                : 'bg-[#0E0D26] border-white/10 hover:border-white/25'
            }`}
          >
            <div className="font-display text-4xl sm:text-5xl text-white tabular-nums mb-1">3</div>
            <div className="font-pixel text-[10px] text-slate-300 tracking-wider mb-3">
              DAYS / WK
            </div>
            <div className="text-xs font-medium text-slate-300">
              Tee at <span className="text-white font-bold tabular-nums">25 wks</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setWeeklyGoal(4)}
            className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              weeklyGoal === 4
                ? 'bg-[#172834] border-[#39FF88] sticker-green'
                : 'bg-[#0E0D26] border-white/10 hover:border-white/25'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="font-display text-4xl sm:text-5xl text-[#39FF88] tabular-nums mb-1">
                4
              </div>
              <span className="font-pixel text-[9px] text-[#FFD23F] bg-[#FFD23F]/15 px-2 py-1 rounded">
                FAST PACE
              </span>
            </div>
            <div className="font-pixel text-[10px] text-slate-200 tracking-wider mb-3">
              DAYS / WK
            </div>
            <div className="text-xs font-semibold text-[#FFD23F]">
              Tee at 20 wks 🔥
            </div>
          </button>
        </div>

        {/* Pick Your Days */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-slate-300 tracking-wider">
              PICK YOUR DAYS
            </span>
            <span className="text-xs text-slate-400 tabular-nums">
              {selectedDays.length} of {weeklyGoal} days selected
            </span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {WEEK_DAYS.map((day) => {
              const active = selectedDays.includes(day.key);
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => onToggleDay(day.key)}
                  aria-label={`Toggle ${day.key}`}
                  className={`min-h-[44px] rounded-full font-display text-sm flex items-center justify-center transition-all cursor-pointer ${
                    active
                      ? 'bg-[#39FF88] text-[#0B0A1F] shadow-[0_0_16px_rgba(57,255,136,0.35)]'
                      : 'bg-[#0E0D26] text-slate-400 border border-white/12 hover:border-white/30'
                  }`}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Focus */}
        <div className="mb-6">
          <span className="block font-pixel text-[10px] text-slate-300 tracking-wider mb-3">
            MAIN FOCUS
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {FOCUS_OPTIONS.map((opt) => {
              const selected = focusGoal === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setFocusGoal(opt.label)}
                  className={`min-h-[44px] px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                    selected
                      ? 'bg-[#FF3DA8] text-white shadow-[3px_3px_0px_#39FF88]'
                      : 'bg-[#0E0D26] text-slate-300 border border-white/10 hover:border-white/25'
                  }`}
                >
                  <span>{opt.emoji}</span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Founding Member Notice */}
        <div className="rounded-2xl bg-[#FFD23F]/8 border border-[#FFD23F]/40 p-4 mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#FFD23F] shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            <strong className="text-[#FFD23F]">Founding Member</strong> — join in the first 30 days
            for a badge that&apos;ll never drop again.
          </p>
        </div>

        {/* Lock It In CTA */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full min-h-[52px] px-6 py-4 rounded-2xl bg-[#39FF88] hover:bg-[#52FF9A] text-[#0B0A1F] font-display text-base tracking-wide flex items-center justify-center gap-2 sticker-green transition-all cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>LOCK IT IN →</span>
        </button>
      </div>
    </div>
  );
};
