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
                className="inline-block bg-coin text-onbright font-pixel text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg -rotate-3 sticker-gold font-bold"
              >
                FREE TO PLAY
              </span>
              <span
                className="inline-block bg-sky text-onbright font-pixel text-[11px] tracking-wider px-3.5 py-1.5 rounded-lg rotate-2 sticker-cyan font-bold"
              >
                NO CHEAT CODES
              </span>
            </div>

            <div className="mb-6 flex items-center justify-center lg:justify-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-line/15 flex items-center justify-center shadow-lg">
                <svg viewBox="0 0 64 64" className="w-11 h-11" aria-hidden="true">
                  <rect x="6" y="18" width="6" height="16" rx="2" style={{fill:"var(--color-sky)"}} />
                  <rect x="12" y="14" width="6" height="24" rx="2" style={{fill:"var(--color-accent)"}} />
                  <rect x="46" y="14" width="6" height="24" rx="2" style={{fill:"var(--color-accent)"}} />
                  <rect x="52" y="18" width="6" height="16" rx="2" style={{fill:"var(--color-sky)"}} />
                  <rect x="18" y="24" width="28" height="4" rx="2" style={{fill:"var(--color-ink)"}} />
                  <circle cx="32" cy="28" r="5" style={{fill:"var(--color-coin)"}} />
                  <path d="M24 34 L40 34 L38 48 L26 48 Z" style={{fill:"var(--color-primary)"}} />
                  <path d="M26 48 L22 58 M38 48 L42 58" style={{stroke:"var(--color-sky)"}} strokeWidth="4" strokeLinecap="round" />
                  <path d="M24 36 L18 26 M40 36 L46 26" style={{stroke:"var(--color-coin)"}} strokeWidth="3.5" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-pixel text-xs text-t-primary tracking-widest">
                LVL 01 · PLAYER SELECT
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl lg:text-8xl leading-[0.9] tracking-tight text-t-primary text-arcade-shadow mb-5">
              GYM
              <br />
              LOOP
            </h1>

            <p className="font-pixel text-xs sm:text-sm tracking-widest text-ink-2 mb-8 max-w-md">
              SEE THE CROWD. SHOW UP MORE. EARN IT.
            </p>

            <div className="w-full max-w-sm flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setStep('goal')}
                className="w-full min-h-[54px] px-7 py-4 rounded-2xl bg-primary hover:bg-primary-hi active:translate-y-0.5 text-onbright font-display text-lg tracking-wide flex items-center justify-center gap-3 sticker-green transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>PRESS START</span>
              </button>

              <div className="flex items-center justify-between text-xs text-ink-4 pt-1 px-1">
                <span>
                  Your gym: <strong className="text-ink font-semibold">Iron Den, Pilani</strong>
                </span>
                <button
                  type="button"
                  onClick={onComplete}
                  className="text-t-sky hover:underline font-medium cursor-pointer"
                >
                  Skip to Home →
                </button>
              </div>
            </div>
          </div>

          {/* Right Arcade Preview Card (Desktop Presence) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-surface/90 border border-line/12 p-6 sm:p-8 sticker-card">
              <div className="flex items-center justify-between mb-5">
                <span className="font-pixel text-[11px] text-t-accent tracking-wider">
                  IRON DEN · PILANI
                </span>
                <span className="font-mono text-xs text-t-primary tabular-nums">
                  23 inside · 31%
                </span>
              </div>

              <h2 className="font-display text-2xl text-ink mb-3 text-balance">
                Turn showing up into loot you cannot buy.
              </h2>
              <p className="text-sm text-ink-3 leading-relaxed mb-6">
                Auto-detected via desk QR at Iron Den. Track live floor crowd before you walk over,
                hit your weekly check-in streak, and unlock limited streetwear drops.
              </p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-void/80 border border-line/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🔑</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">5-Week Streak</p>
                      <p className="text-xs text-ink-4">Anodized Metal Keychain</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-t-primary">STAGE 1</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-void/80 border border-line/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">👕</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">20-Week Streak</p>
                      <p className="text-xs text-ink-4">Heavyweight Loop Tee</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-t-accent">STAGE 2</span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-void/80 border border-line/8">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🧥</span>
                    <div>
                      <p className="text-sm font-semibold text-ink">35-Week Streak</p>
                      <p className="text-xs text-ink-4">Embroidered Season Hoodie</p>
                    </div>
                  </div>
                  <span className="font-pixel text-[10px] text-t-accent">STAGE 3</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onOpenOwnerMode}
                className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-line/5 hover:bg-line/10 border border-line/12 text-xs font-medium text-ink-2 flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Managing a gym? Switch to Boss Mode</span>
                <ArrowRight className="w-4 h-4 text-t-coin" />
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
      <div className="w-full max-w-2xl rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card">
        <div className="flex items-center justify-between mb-3">
          <span className="font-pixel text-[11px] text-t-primary tracking-widest">
            STEP 2 / 3
          </span>
          <button
            type="button"
            onClick={() => setStep('splash')}
            className="text-xs text-ink-4 hover:text-ink transition-colors cursor-pointer"
          >
            ← Back
          </button>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-2 flex items-center gap-2.5 text-balance">
          <span>Set your weekly quest</span>
          <Target className="w-7 h-7 text-t-accent shrink-0" />
        </h1>
        <p className="text-sm text-ink-3 mb-6">
          How many days a week will you show up at Iron Den?
        </p>

        {/* 3 or 4 Days Goal Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setWeeklyGoal(3)}
            className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              weeklyGoal === 3
                ? 'bg-raised border-primary sticker-green'
                : 'bg-base border-line/10 hover:border-line/25'
            }`}
          >
            <div className="font-display text-4xl sm:text-5xl text-ink tabular-nums mb-1">3</div>
            <div className="font-pixel text-[10px] text-ink-3 tracking-wider mb-3">
              DAYS / WK
            </div>
            <div className="text-xs font-medium text-ink-3">
              Tee at <span className="text-ink font-bold tabular-nums">25 wks</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setWeeklyGoal(4)}
            className={`text-left p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              weeklyGoal === 4
                ? 'bg-tint border-primary sticker-green'
                : 'bg-base border-line/10 hover:border-line/25'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="font-display text-4xl sm:text-5xl text-t-primary tabular-nums mb-1">
                4
              </div>
              <span className="font-pixel text-[9px] text-t-coin bg-coin/15 px-2 py-1 rounded">
                FAST PACE
              </span>
            </div>
            <div className="font-pixel text-[10px] text-ink-2 tracking-wider mb-3">
              DAYS / WK
            </div>
            <div className="text-xs font-semibold text-t-coin">
              Tee at 20 wks 🔥
            </div>
          </button>
        </div>

        {/* Pick Your Days */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-ink-3 tracking-wider">
              PICK YOUR DAYS
            </span>
            <span className="text-xs text-ink-4 tabular-nums">
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
                      ? 'bg-primary text-onbright shadow-[0_0_16px_rgba(0,180,216,0.35)]'
                      : 'bg-base text-ink-4 border border-line/12 hover:border-line/30'
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
          <span className="block font-pixel text-[10px] text-ink-3 tracking-wider mb-3">
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
                      ? 'bg-accent text-white shadow-[3px_3px_0px_var(--color-primary)]'
                      : 'bg-base text-ink-3 border border-line/10 hover:border-line/25'
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
        <div className="rounded-2xl bg-coin/8 border border-coin/40 p-4 mb-6 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-t-coin shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-ink-2 leading-relaxed">
            <strong className="text-t-coin">Founding Member</strong> — join in the first 30 days
            for a badge that&apos;ll never drop again.
          </p>
        </div>

        {/* Lock It In CTA */}
        <button
          type="button"
          onClick={onComplete}
          className="w-full min-h-[52px] px-6 py-4 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-base tracking-wide flex items-center justify-center gap-2 sticker-green transition-all cursor-pointer"
        >
          <ShieldCheck className="w-5 h-5" />
          <span>LOCK IT IN →</span>
        </button>
      </div>
    </div>
  );
};
