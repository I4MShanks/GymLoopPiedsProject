import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown, ChevronUp, Crown, Flame, Gift, Shield } from 'lucide-react';
import { AnimatedNumber, Ring } from './landing/fx';

/* ---------------- Confetti ---------------- */
export const Confetti: React.FC<{ fire: number }> = ({ fire }) => {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: `${fire}-${i}`,
        x: (Math.random() - 0.5) * 520,
        y: -120 - Math.random() * 260,
        r: Math.random() * 720 - 360,
        c: ['var(--color-primary)', 'var(--color-accent)', 'var(--color-coin)', 'var(--color-sky)'][i % 4],
        s: 6 + Math.random() * 8,
      })),
    [fire],
  );
  if (!fire) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-20">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-sm"
          style={{ width: p.s, height: p.s * 0.6, background: p.c }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.x, y: [0, p.y, p.y + 380], opacity: [1, 1, 0], rotate: p.r }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

/* ---------------- Mascot ---------------- */
const Loopy: React.FC<{ mood: 'happy' | 'hype' | 'worried' }> = ({ mood }) => (
  <motion.svg
    viewBox="0 0 64 64"
    className="w-20 h-20 shrink-0"
    animate={{ y: [0, -5, 0], rotate: mood === 'hype' ? [0, -6, 6, 0] : 0 }}
    transition={{ duration: mood === 'hype' ? 0.9 : 2.4, repeat: Infinity, ease: 'easeInOut' }}
    aria-hidden="true"
  >
    {/* body: a friendly dumbbell-bot */}
    <rect x="4" y="22" width="8" height="20" rx="3" style={{ fill: 'var(--color-accent)' }} />
    <rect x="52" y="22" width="8" height="20" rx="3" style={{ fill: 'var(--color-accent)' }} />
    <rect x="12" y="29" width="6" height="6" rx="2" style={{ fill: 'var(--color-sky)' }} />
    <rect x="46" y="29" width="6" height="6" rx="2" style={{ fill: 'var(--color-sky)' }} />
    <rect x="17" y="14" width="30" height="36" rx="10" style={{ fill: 'var(--color-primary)' }} />
    <rect x="21" y="20" width="22" height="14" rx="5" style={{ fill: 'var(--color-void)' }} />
    {mood === 'worried' ? (
      <>
        <rect x="25" y="26" width="4" height="3" rx="1" style={{ fill: 'var(--color-sky)' }} />
        <rect x="35" y="26" width="4" height="3" rx="1" style={{ fill: 'var(--color-sky)' }} />
      </>
    ) : (
      <>
        <motion.rect
          x="25" y="24" width="4" height="6" rx="2"
          style={{ fill: 'var(--color-sky)' }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3 }}
        />
        <motion.rect
          x="35" y="24" width="4" height="6" rx="2"
          style={{ fill: 'var(--color-sky)' }}
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3 }}
        />
      </>
    )}
    <path
      d={mood === 'worried' ? 'M26 44 Q32 40 38 44' : 'M25 40 Q32 47 39 40'}
      strokeWidth="3"
      strokeLinecap="round"
      fill="none"
      style={{ stroke: 'var(--color-void)' }}
    />
    <rect x="30" y="6" width="4" height="9" rx="2" style={{ fill: 'var(--color-coin)' }} />
    <circle cx="32" cy="6" r="4" style={{ fill: 'var(--color-coin)' }} />
  </motion.svg>
);

export const MascotNudge: React.FC<{ name: string; streakWeeks: number; thisWeek: number; goal: number }> = ({ name, streakWeeks, thisWeek, goal }) => {
  const hour = new Date().getHours();
  const left = goal - thisWeek;
  const lines = useMemo(() => {
    const l: { t: string; mood: 'happy' | 'hype' | 'worried' }[] = [];
    if (left <= 0) l.push({ t: `Weekly quest DONE, ${name}! Week ${streakWeeks + 1} is locked in 🔥`, mood: 'hype' });
    else if (left === 1) l.push({ t: `Just 1 more check-in to keep your ${streakWeeks}-week streak alive!`, mood: 'hype' });
    else l.push({ t: `${left} check-ins left this week. Don't let the ${streakWeeks}-week streak slip!`, mood: 'worried' });
    if (hour >= 13 && hour < 16) l.push({ t: 'Iron Den is chill right now. Perfect time for a session 😌', mood: 'happy' });
    if (hour >= 17 && hour < 20) l.push({ t: 'Rush hour! Go after 8 PM for free benches.', mood: 'happy' });
    l.push({ t: 'Finish all 3 daily quests to open today’s chest 🎁', mood: 'happy' });
    l.push({ t: `You're 8 weeks from the Loop Tee. Keep showing up!`, mood: 'hype' });
    return l;
  }, [name, streakWeeks, left, hour]);
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setI((x) => (x + 1) % lines.length), 5000);
    return () => window.clearInterval(t);
  }, [lines.length]);
  const cur = lines[i % lines.length];
  return (
    <div className="flex items-end gap-3">
      <Loopy mood={cur.mood} />
      <div className="relative flex-1 min-h-[64px] rounded-2xl rounded-bl-sm bg-surface border border-line/15 px-4 py-3 mb-3">
        <span className="font-pixel text-[9px] text-t-primary tracking-widest">LOOPY</span>
        <AnimatePresence mode="wait">
          <motion.p
            key={cur.t}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-sm font-semibold text-ink"
          >
            {cur.t}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------------- Daily quests + chest ---------------- */
type Quest = { id: string; t: string; need: number; have: number; xp: number };

export const DailyQuests: React.FC<{ onXp?: (xp: number) => void }> = ({ onXp }) => {
  const [quests, setQuests] = useState<Quest[]>([
    { id: 'q1', t: 'Check in at the gym', need: 1, have: 0, xp: 50 },
    { id: 'q2', t: 'Complete 3 exercises', need: 3, have: 2, xp: 20 },
    { id: 'q3', t: 'Train in the off-peak window', need: 1, have: 0, xp: 30 },
  ]);
  const [opened, setOpened] = useState(false);
  const [fire, setFire] = useState(0);
  const allDone = quests.every((q) => q.have >= q.need);

  const bump = (id: string) => {
    setQuests((qs) => qs.map((q) => (q.id === id && q.have < q.need ? { ...q, have: q.have + 1 } : q)));
    navigator.vibrate?.(10);
  };
  const openChest = () => {
    if (!allDone || opened) return;
    setOpened(true);
    setFire((f) => f + 1);
    onXp?.(100);
    navigator.vibrate?.([30, 50, 30, 50, 60]);
  };

  return (
    <div className="hud-corners relative rounded-3xl bg-surface border border-line/12 p-5 sm:p-6">
      <Confetti fire={fire} />
      <div className="flex items-center justify-between mb-4">
        <span className="font-pixel text-[11px] text-t-primary tracking-widest">DAILY QUESTS</span>
        <span className="font-pixel text-[10px] text-ink-4">RESETS AT MIDNIGHT</span>
      </div>
      <div className="space-y-3">
        {quests.map((q) => {
          const done = q.have >= q.need;
          return (
            <motion.button
              key={q.id}
              type="button"
              onClick={() => bump(q.id)}
              whileTap={{ scale: 0.97 }}
              className={`w-full text-left rounded-2xl border px-4 py-3 cursor-pointer ${done ? 'bg-raised border-primary/70' : 'bg-base border-line/12'}`}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className={`text-sm font-semibold ${done ? 'text-t-primary' : 'text-ink'}`}>{q.t}</span>
                <span className="font-hud text-xs text-t-coin shrink-0">+{q.xp} XP</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 rounded-full bg-void/60 border border-line/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-sky"
                    animate={{ width: `${(q.have / q.need) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 160, damping: 18 }}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {done ? (
                    <motion.span
                      key="ok"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-6 h-6 rounded-full bg-primary text-onbright flex items-center justify-center"
                    >
                      <Check className="w-4 h-4" />
                    </motion.span>
                  ) : (
                    <motion.span key="n" className="font-mono text-xs text-ink-4 w-6 text-right">
                      {q.have}/{q.need}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>
      <motion.button
        type="button"
        onClick={openChest}
        disabled={!allDone || opened}
        animate={allDone && !opened ? { rotate: [0, -4, 4, -4, 0], scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 0.6, repeat: allDone && !opened ? Infinity : 0, repeatDelay: 0.8 }}
        className={`mt-4 w-full min-h-[56px] rounded-2xl flex items-center justify-center gap-3 font-display text-base cursor-pointer disabled:cursor-default ${
          opened ? 'bg-raised text-t-primary border border-primary' : allDone ? 'bg-coin text-onbright sticker-green' : 'bg-base text-ink-4 border border-line/12'
        }`}
      >
        <Gift className="w-5 h-5" />
        {opened ? 'CHEST OPENED · +100 XP' : allDone ? 'OPEN CHEST!' : 'Finish all quests to open the chest'}
      </motion.button>
      <p className="text-[11px] text-ink-5 mt-2 text-center">Demo: tap a quest to add progress.</p>
    </div>
  );
};

/* ---------------- Daily XP goal ring ---------------- */
export const XpGoal: React.FC<{ xpToday: number; goal?: number }> = ({ xpToday, goal = 100 }) => (
  <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-5 flex items-center gap-5">
    <Ring
      pct={Math.min(100, (xpToday / goal) * 100)}
      size={96}
      label={<span className="font-hud text-lg text-ink"><AnimatedNumber value={xpToday} /></span>}
    />
    <div>
      <p className="font-pixel text-[10px] text-ink-4 tracking-widest mb-1">DAILY XP GOAL</p>
      <p className="font-display text-xl text-ink">{xpToday >= goal ? 'Goal smashed! 🎯' : `${goal - xpToday} XP to go`}</p>
      <p className="text-xs text-ink-3 mt-1">Hit {goal} XP a day to earn the “Consistent” badge.</p>
    </div>
  </div>
);

/* ---------------- Streak calendar ---------------- */
export const StreakCalendar: React.FC<{ streakWeeks: number }> = ({ streakWeeks }) => {
  // 5 weeks × 7 days; demo pattern of check-ins (4 per week target)
  const pattern = [
    [1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 0, 1, 0, 1, 1, 0],
    [1, 0, 1, 0, 0, 0, 0],
  ];
  const todayIdx = (new Date().getDay() + 6) % 7;
  return (
    <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
            <Flame className="w-9 h-9 text-t-coin fill-coin" />
          </motion.div>
          <div>
            <div className="font-hud text-3xl text-ink leading-none">{streakWeeks}</div>
            <div className="font-pixel text-[9px] text-ink-4">WEEK STREAK</div>
          </div>
        </div>
        <span className="font-pixel text-[10px] text-t-primary">BEST: {Math.max(14, streakWeeks)}</span>
      </div>
      <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-1.5 text-center">
        <span />
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <span key={i} className="font-pixel text-[9px] text-ink-5">
            {d}
          </span>
        ))}
        {pattern.map((wk, wi) => {
          const perfect = wk.reduce((a, b) => a + b, 0) >= 4;
          const isCurrent = wi === pattern.length - 1;
          return (
            <React.Fragment key={wi}>
              <span className="w-5 flex items-center justify-center">
                {perfect && !isCurrent ? <Crown className="w-3.5 h-3.5 text-t-coin" /> : null}
              </span>
              {wk.map((v, di) => {
                const today = isCurrent && di === todayIdx;
                const future = isCurrent && di > todayIdx;
                return (
                  <motion.div
                    key={di}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (wi * 7 + di) * 0.012, type: 'spring', stiffness: 300, damping: 18 }}
                    className={`aspect-square rounded-lg flex items-center justify-center text-[11px] ${
                      v ? 'bg-primary text-onbright shadow-[0_0_12px_-3px_var(--color-primary)]' : future ? 'bg-base/40 border border-dashed border-line/15' : 'bg-base border border-line/10'
                    } ${today ? 'ring-2 ring-[var(--color-coin)]' : ''}`}
                  >
                    {v ? '🔥' : ''}
                  </motion.div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-xs text-ink-4 mt-4 flex items-center gap-1.5">
        <Shield className="w-3.5 h-3.5" /> No streak freezes. Miss a week? Finish 3 goal weeks in a row to earn it back.
      </p>
    </div>
  );
};

/* ---------------- Weekly league ---------------- */
const LEAGUES = [
  { n: 'Bronze', c: '#B87333' },
  { n: 'Silver', c: '#A8B5C4' },
  { n: 'Gold', c: '#E6B422' },
  { n: 'Sapphire', c: '#0077B6' },
  { n: 'Diamond', c: '#90E0EF' },
];
const PLAYERS = [
  ['Kabir', 612], ['Riya', 540], ['Aman', 488], ['You', 340], ['Sneha', 315], ['Dev', 290], ['Ishita', 260],
  ['Rohan', 190], ['Neha', 160], ['Varun', 120], ['Arjun', 80], ['Meera', 45],
] as const;

export const LeagueCard: React.FC<{ myPoints: number }> = ({ myPoints }) => {
  const rows = useMemo(
    () => PLAYERS.map(([n, p]) => ({ n, p: n === 'You' ? myPoints : p })).sort((a, b) => b.p - a.p),
    [myPoints],
  );
  const cur = 3; // Sapphire
  const promote = 4;
  const demote = rows.length - 3;
  const daysLeft = 7 - ((new Date().getDay() + 6) % 7);
  return (
    <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="font-pixel text-[10px] text-ink-4 tracking-widest">WEEKLY LEAGUE</p>
          <h3 className="font-display text-2xl text-ink">{LEAGUES[cur].n} League</h3>
        </div>
        <span className="font-pixel text-[10px] px-2.5 py-1.5 rounded-lg bg-base border border-line/12 text-ink-3">{daysLeft}D LEFT</span>
      </div>
      <div className="flex items-center justify-between gap-2 mb-5">
        {LEAGUES.map((l, i) => (
          <motion.div
            key={l.n}
            className={`flex-1 flex flex-col items-center gap-1 ${i > cur ? 'opacity-35' : ''}`}
            animate={i === cur ? { y: [0, -4, 0] } : {}}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <div
              className={`w-9 h-10 [clip-path:polygon(50%_0,100%_25%,100%_75%,50%_100%,0_75%,0_25%)] ${i === cur ? 'scale-125' : ''}`}
              style={{ background: l.c, boxShadow: i === cur ? `0 0 18px ${l.c}` : undefined }}
            />
            <span className={`font-pixel text-[8px] ${i === cur ? 'text-t-primary' : 'text-ink-5'}`}>{l.n.toUpperCase()}</span>
          </motion.div>
        ))}
      </div>
      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
        {rows.map((r, i) => {
          const me = r.n === 'You';
          return (
            <React.Fragment key={r.n}>
              {i === promote && (
                <div className="flex items-center gap-2 py-1 text-[10px] font-pixel text-t-primary">
                  <ChevronUp className="w-3.5 h-3.5" /> PROMOTION ZONE ABOVE
                  <span className="flex-1 h-px bg-primary/40" />
                </div>
              )}
              {i === demote && (
                <div className="flex items-center gap-2 py-1 text-[10px] font-pixel text-t-accent">
                  <ChevronDown className="w-3.5 h-3.5" /> DEMOTION ZONE BELOW
                  <span className="flex-1 h-px bg-accent/40" />
                </div>
              )}
              <motion.div
                layout
                className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm ${me ? 'bg-primary text-onbright font-bold' : 'bg-base border border-line/10 text-ink-2'}`}
              >
                <span className="w-5 font-hud text-xs">{i + 1}</span>
                <span className="flex-1">{r.n}</span>
                <span className="font-hud text-xs">{r.p} XP</span>
              </motion.div>
            </React.Fragment>
          );
        })}
      </div>
      <p className="text-xs text-ink-4 mt-3">Top 4 move up to Diamond on Monday. Bottom 3 drop to Gold.</p>
    </div>
  );
};
