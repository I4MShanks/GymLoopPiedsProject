import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Lock, Play, QrCode, Trophy, Users, Zap } from 'lucide-react';
import { AnimatedNumber, Blobs, LiveBars, Reveal, TiltCard } from './fx';
import { Achievements, SpinWheel } from './arcade';
import { PowerUps } from '../gamify';

const LOOT = [
  { weeks: 5, emoji: '🔑', name: 'Anodized Keychain' },
  { weeks: 20, emoji: '👕', name: 'Heavyweight Loop Tee' },
  { weeks: 35, emoji: '🧥', name: 'Season Hoodie' },
];

export const MembersLanding: React.FC<{ go: (p: string) => void }> = ({ go }) => {
  const [weeks, setWeeks] = useState(12);
  const next = LOOT.find((l) => l.weeks > weeks);

  return (
    <div className="-mx-4 sm:-mx-6">
      <section className="relative isolate px-4 sm:px-6 pt-12 pb-16">
        <Blobs />
        <div className="synth-grid" />
        <div className="max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-pixel text-xs text-t-primary tracking-widest mb-4">
            P1 · FOR MEMBERS · FREE TO PLAY
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16 }}
            className="font-display text-5xl sm:text-7xl leading-[0.95] text-ink mb-6 text-balance"
          >
            Turn showing up into <span className="text-t-primary text-arcade-shadow">loot</span> you can&apos;t buy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-lg text-ink-3 max-w-2xl mx-auto mb-9"
          >
            Check the crowd before you leave home, hit your weekly quest, climb your gym&apos;s leaderboard and unlock
            limited merch with nothing but consistency.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <button type="button" onClick={() => go('/join')} className="shimmer min-h-[54px] px-8 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-lg flex items-center justify-center gap-3 sticker-green cursor-pointer">
              <Play className="w-5 h-5 fill-current" /> START YOUR QUEST
            </button>
            <button type="button" onClick={() => go('/app/home')} className="min-h-[54px] px-7 rounded-2xl bg-surface/80 hover:bg-raised border border-line/20 text-ink font-semibold flex items-center justify-center gap-2 cursor-pointer">
              Peek at the app <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-6">
        <Reveal>
          <TiltCard onClick={() => go('/app/crowd')} className="rounded-3xl bg-surface border border-line/12 p-7 h-full sticker-card">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-t-primary" />
              <h3 className="font-display text-2xl text-ink">Live crowd meter</h3>
            </div>
            <p className="text-sm text-ink-3 mb-6">Live headcount from desk check-ins and the best hour to go, so you never queue for a bench again.</p>
            <LiveBars base={[40, 62, 75, 50, 28, 20, 30, 25, 45, 80, 95, 88]} highlight={6} className="h-28" />
          </TiltCard>
        </Reveal>
        <Reveal delay={0.1}>
          <TiltCard onClick={() => go('/app/checkin')} className="rounded-3xl bg-surface border border-line/12 p-7 h-full sticker-card">
            <div className="flex items-center gap-3 mb-4">
              <QrCode className="w-6 h-6 text-t-primary" />
              <h3 className="font-display text-2xl text-ink">30-second QR check-in</h3>
            </div>
            <p className="text-sm text-ink-3 mb-6">A code that refreshes every 30 seconds at the desk. Every real check-in gives +50 XP toward your week.</p>
            <div className="flex items-center gap-5">
              <motion.div
                className="w-28 h-28 rounded-2xl bg-white p-3 grid grid-cols-6 gap-1"
                animate={{ rotate: [0, 0, 90, 90, 0] }}
                transition={{ duration: 6, repeat: Infinity, times: [0, 0.4, 0.5, 0.9, 1] }}
              >
                {Array.from({ length: 36 }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="rounded-[2px] bg-[#03045E]"
                    animate={{ opacity: [1, (i * 7) % 3 ? 1 : 0.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: (i % 6) * 0.1 }}
                  />
                ))}
              </motion.div>
              <div className="font-display text-4xl text-t-primary">
                +<AnimatedNumber value={50} /> XP
              </div>
            </div>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.05}>
          <TiltCard onClick={() => go('/app/board')} className="rounded-3xl bg-surface border border-line/12 p-7 h-full sticker-card">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-6 h-6 text-t-primary" />
              <h3 className="font-display text-2xl text-ink">Gym leaderboard</h3>
            </div>
            <p className="text-sm text-ink-3 mb-6">Weekly points reset every Monday. Top 3 each month win the limited cap.</p>
            <div className="flex items-end justify-center gap-3 h-32">
              {[
                { n: 2, h: '70%', c: 'bg-sky text-onbright' },
                { n: 1, h: '100%', c: 'bg-coin text-onbright' },
                { n: 3, h: '55%', c: 'bg-accent text-white' },
              ].map((p, i) => (
                <motion.div
                  key={p.n}
                  className={`w-20 rounded-t-xl flex items-start justify-center pt-2 font-display text-2xl ${p.c}`}
                  initial={{ height: 0 }}
                  whileInView={{ height: p.h }}
                  viewport={{ once: true }}
                  transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.2 + i * 0.15 }}
                >
                  {p.n}
                </motion.div>
              ))}
            </div>
          </TiltCard>
        </Reveal>
        <Reveal delay={0.15}>
          <TiltCard onClick={() => go('/app/workout')} className="rounded-3xl bg-surface border border-line/12 p-7 h-full sticker-card">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-t-primary" />
              <h3 className="font-display text-2xl text-ink">Daily workout quests</h3>
            </div>
            <p className="text-sm text-ink-3 mb-5">Your trainer&apos;s plan as a checklist. Tick off sets, finish the quest, bank the XP.</p>
            {['Bench press · 4×8', 'Incline DB press · 3×10', 'Shoulder press · 3×10'].map((t, i) => (
              <motion.div
                key={t}
                className="flex items-center justify-between rounded-xl bg-base border border-line/10 px-4 py-2.5 mb-2 text-sm text-ink-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12 }}
              >
                {t}
                <motion.span
                  className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center"
                  initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                  whileInView={{ backgroundColor: i < 2 ? 'var(--color-primary)' : 'rgba(0,0,0,0)' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + i * 0.25 }}
                />
              </motion.div>
            ))}
          </TiltCard>
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Reveal>
          <SpinWheel />
        </Reveal>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Reveal>
          <p className="font-pixel text-xs text-t-primary tracking-widest mb-2">ACHIEVEMENTS · TAP TO FLIP</p>
          <h2 className="font-display text-3xl sm:text-4xl text-ink mb-8">Badges for every habit</h2>
        </Reveal>
        <Achievements />
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <Reveal>
          <PowerUps streakWeeks={weeks} />
        </Reveal>
        <p className="text-xs text-ink-4 text-center mt-3">Drag the streak slider below to see powers unlock.</p>
      </section>

      {/* INTERACTIVE REWARD TRACK */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">
        <Reveal>
          <div className="rounded-3xl bg-surface border border-line/12 p-7 sm:p-10 sticker-card">
            <p className="font-pixel text-xs text-t-primary tracking-widest mb-2">DRAG TO SEE THE LOOT</p>
            <h2 className="font-display text-3xl sm:text-4xl text-ink mb-8">
              Streak: <AnimatedNumber value={weeks} className="text-t-primary" /> weeks
            </h2>
            <input
              type="range"
              min={0}
              max={40}
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full h-3 accent-[var(--color-primary)] cursor-grab active:cursor-grabbing mb-10"
              aria-label="Streak weeks"
            />
            <div className="grid grid-cols-3 gap-4">
              {LOOT.map((l) => {
                const unlocked = weeks >= l.weeks;
                return (
                  <motion.div
                    key={l.name}
                    animate={{ scale: unlocked ? 1 : 0.94, opacity: unlocked ? 1 : 0.5 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className={`relative rounded-2xl p-4 text-center border-2 ${unlocked ? 'border-primary bg-raised' : 'border-line/10 bg-base'}`}
                  >
                    <motion.div
                      className="text-4xl sm:text-5xl mb-2"
                      animate={unlocked ? { rotate: [0, -12, 12, 0], scale: [1, 1.25, 1] } : { rotate: 0, scale: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {l.emoji}
                    </motion.div>
                    <div className="text-xs sm:text-sm font-bold text-ink">{l.name}</div>
                    <div className="font-pixel text-[10px] text-ink-4 mt-1">{l.weeks} WEEKS</div>
                    {!unlocked && <Lock className="w-4 h-4 text-ink-4 absolute top-3 right-3" />}
                  </motion.div>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={next?.name ?? 'all'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-sm text-ink-3 mt-6 text-center"
              >
                {next ? (
                  <>
                    <b className="text-t-primary">{next.weeks - weeks} more weeks</b> to unlock the {next.name}.
                  </>
                ) : (
                  <>All loot unlocked. Now go for the monthly top-3 cap 🧢</>
                )}
              </motion.p>
            </AnimatePresence>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
