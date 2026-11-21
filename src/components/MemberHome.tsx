import React from 'react';
import { Camera, CheckCircle2, ChevronRight, Flame, Trophy, Users, Zap } from 'lucide-react';
import { BroadcastAnnouncement, MemberTab, WorkoutExercise } from '../types/gymloop';

interface MemberHomeProps {
  memberName: string;
  streakWeeks: number;
  thisWeekCount: number;
  weeklyGoal: number;
  peopleInside: number;
  capacity: number;
  points: number;
  rank: number;
  exercises: WorkoutExercise[];
  latestBroadcast?: BroadcastAnnouncement;
  onNavigate: (tab: MemberTab) => void;
  onToggleExercise: (id: string) => void;
}

export const MemberHome: React.FC<MemberHomeProps> = ({
  memberName,
  streakWeeks,
  thisWeekCount,
  weeklyGoal,
  peopleInside,
  capacity,
  points,
  rank,
  exercises,
  latestBroadcast,
  onNavigate,
  onToggleExercise,
}) => {
  const occupancyPct = Math.min(100, Math.round((peopleInside / capacity) * 100));
  const crowdStatus =
    occupancyPct < 45
      ? { label: 'CHILL', emoji: '😌', color: 'var(--color-primary)' }
      : occupancyPct < 75
        ? { label: 'BUSY', emoji: '😤', color: 'var(--color-coin)' }
        : { label: 'PACKED', emoji: '🔥', color: 'var(--color-accent)' };

  const completedMoves = exercises.filter((e) => e.completed).length;
  const weeksToTee = Math.max(0, 20 - streakWeeks);
  const ringRadius = 28;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference - (occupancyPct / 100) * ringCircumference;

  return (
    <div className="space-y-6">
      {/* Greeting Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-ink-3 font-medium">yo {memberName} 👋</p>
          <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-tight">
            Let&apos;s get it.
          </h1>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          aria-label="Open player profile"
          className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent to-grape p-[2px] hover:scale-105 transition-transform cursor-pointer shrink-0"
        >
          <div className="w-full h-full rounded-[14px] bg-surface flex items-center justify-center text-2xl">
            😎
          </div>
        </button>
      </div>

      {/* Optional Broadcast Banner from Owner Boss Mode */}
      {latestBroadcast && (
        <div className="rounded-2xl bg-surface border border-sky/35 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-lg shrink-0">📣</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-t-sky truncate">
                IRON DEN · {latestBroadcast.title}
              </p>
              <p className="text-xs text-ink-3 truncate">{latestBroadcast.message}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('board')}
            className="text-xs font-semibold text-ink hover:text-t-primary whitespace-nowrap shrink-0 cursor-pointer"
          >
            View →
          </button>
        </div>
      )}

      {/* Main Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Streak Hero, Crowd Ring, Points & Today, Check-In */}
        <div className="lg:col-span-7 space-y-5">
          {/* Streak Hero Card */}
          <div className="rounded-3xl p-6 bg-gradient-to-r from-accent via-grape-hi to-primary sticker-pink relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <span className="font-pixel text-[10px] tracking-widest text-white/90 block mb-1">
                    STREAK
                  </span>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-5xl sm:text-6xl text-white tabular-nums leading-none">
                      {streakWeeks}
                    </span>
                    <Flame className="w-9 h-9 text-coin fill-coin" />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-white/95 mt-2">
                    {streakWeeks} weeks · {weeksToTee} to the T-shirt
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-pixel text-[10px] tracking-widest text-onbright font-bold block mb-1">
                    THIS WEEK
                  </span>
                  <div className="font-display text-3xl text-onbright tabular-nums">
                    {thisWeekCount}/{weeklyGoal}
                  </div>
                </div>
              </div>

              {/* Weekly Goal Pips */}
              <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${weeklyGoal}, minmax(0, 1fr))` }}>
                {Array.from({ length: weeklyGoal }).map((_, idx) => {
                  const filled = idx < thisWeekCount;
                  return (
                    <div
                      key={idx}
                      className={`h-2.5 rounded-full transition-all ${
                        filled
                          ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.75)]'
                          : 'bg-void/30'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Live Crowd Card */}
          <button
            type="button"
            onClick={() => onNavigate('crowd')}
            className="w-full text-left rounded-3xl bg-surface hover:bg-raised border border-line/12 p-5 sm:p-6 transition-colors cursor-pointer group"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-pixel text-[10px] text-ink-4 tracking-wider mb-1.5 flex items-center gap-2">
                  <span>IRON DEN · LIVE</span>
                  <Users className="w-3.5 h-3.5 text-t-sky" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="font-display text-2xl sm:text-3xl tracking-tight"
                    style={{ color: crowdStatus.color }}
                  >
                    {crowdStatus.label}
                  </span>
                  <span className="text-2xl">{crowdStatus.emoji}</span>
                </div>
                <p className="text-xs sm:text-sm text-ink-3 tabular-nums">
                  {peopleInside} people inside · {occupancyPct}% full
                </p>
              </div>

              {/* Circular Progress Ring */}
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
                  <circle
                    cx="36"
                    cy="36"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="7"
                  />
                  <circle
                    cx="36"
                    cy="36"
                    r={ringRadius}
                    fill="none"
                    stroke={crowdStatus.color}
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={ringOffset}
                    className="transition-all duration-300"
                  />
                </svg>
                <span className="absolute font-display text-sm text-ink tabular-nums">
                  {occupancyPct}%
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3.5 border-t border-line/8 flex items-center justify-between text-xs text-ink-3">
              <span>
                Best window: <strong className="text-ink">2–4 PM</strong> · rush at 6 PM
              </span>
              <span className="text-t-sky font-semibold group-hover:translate-x-0.5 transition-transform">
                Hourly graph →
              </span>
            </div>
          </button>

          {/* Points & Today Mini Cards */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onNavigate('board')}
              className="text-left rounded-2xl bg-surface hover:bg-raised border border-line/12 p-5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[10px] text-ink-4 tracking-wider">POINTS</span>
                <Trophy className="w-4 h-4 text-t-coin" />
              </div>
              <div className="font-display text-3xl text-t-coin tabular-nums mb-1">
                {points}
              </div>
              <p className="text-xs text-ink-3 tabular-nums">#{rank} at your gym</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('workout')}
              className="text-left rounded-2xl bg-surface hover:bg-raised border border-line/12 p-5 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-pixel text-[10px] text-ink-4 tracking-wider">TODAY</span>
                <Zap className="w-4 h-4 text-t-sky" />
              </div>
              <div className="font-display text-3xl text-t-sky mb-1">Push</div>
              <p className="text-xs text-ink-3 tabular-nums">
                {completedMoves}/{exercises.length} moves · 55m
              </p>
            </button>
          </div>

          {/* Primary Check-In CTA */}
          <button
            type="button"
            onClick={() => onNavigate('checkin')}
            className="w-full min-h-[54px] px-6 py-4 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-base sm:text-lg tracking-wide flex items-center justify-center gap-3 sticker-green transition-all cursor-pointer"
          >
            <Camera className="w-5 h-5" />
            <span>CHECK IN NOW</span>
          </button>
        </div>

        {/* Right Column: Today's Workout Quest Preview (Desktop full presence, accessible on mobile too) */}
        <div className="lg:col-span-5 rounded-3xl bg-surface border border-line/12 p-6 sticker-card">
          <div className="flex items-center justify-between mb-3">
            <span className="font-pixel text-[10px] text-t-sky tracking-wider">
              TODAY · MONDAY
            </span>
            <button
              type="button"
              onClick={() => onNavigate('workout')}
              className="text-xs font-semibold text-t-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Full Quest</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h2 className="font-display text-2xl text-ink mb-2">Push day 💥</h2>
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-3 mb-5">
            <span className="font-semibold text-t-sky">55 min</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-t-coin">+40 XP</span>
            <span aria-hidden="true">·</span>
            <span>by Coach Ravi</span>
          </div>

          <div className="space-y-2.5 mb-5">
            {exercises.map((ex) => (
              <button
                key={ex.id}
                type="button"
                onClick={() => onToggleExercise(ex.id)}
                className={`w-full min-h-[54px] px-4 py-3 rounded-2xl flex items-center justify-between gap-3 text-left transition-all cursor-pointer border ${
                  ex.isCurrent && !ex.completed
                    ? 'bg-raised border-accent shadow-[0_0_20px_rgba(0,119,182,0.18)]'
                    : ex.completed
                      ? 'bg-base/90 border-primary/25'
                      : 'bg-base/60 border-line/8 hover:border-line/20'
                }`}
              >
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      ex.completed ? 'text-ink-4 line-through' : 'text-ink'
                    }`}
                  >
                    {ex.name}
                  </p>
                  <p className="text-xs text-ink-4 tabular-nums">
                    {ex.setsReps}
                    {ex.weight ? ` · ${ex.weight}` : ''}
                  </p>
                </div>

                {ex.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-t-primary shrink-0" />
                ) : ex.isCurrent ? (
                  <span className="font-pixel text-[10px] bg-accent text-white px-2.5 py-1 rounded-full shrink-0">
                    NOW
                  </span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-line/25 shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-pixel text-[10px] text-ink-4">
                QUEST PROGRESS {completedMoves}/{exercises.length}
              </span>
              <span className="text-xs font-semibold text-t-primary tabular-nums">
                {Math.round((completedMoves / exercises.length) * 100)}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-void overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-sky transition-all duration-300"
                style={{ width: `${(completedMoves / exercises.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
