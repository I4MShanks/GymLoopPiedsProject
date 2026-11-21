import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown, Pause, Play, RotateCcw, Skull, Swords } from 'lucide-react';
import { AnimatedNumber, Reveal, Ring } from './fx';

/* ---------------- Season countdown ---------------- */
export const SeasonCountdown: React.FC = () => {
  const end = useMemo(() => new Date('2027-03-31T23:59:59+05:30').getTime(), []);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, []);
  const left = Math.max(0, end - now);
  const parts = [
    { v: Math.floor(left / 86400000), l: 'DAYS' },
    { v: Math.floor((left / 3600000) % 24), l: 'HRS' },
    { v: Math.floor((left / 60000) % 60), l: 'MIN' },
    { v: Math.floor((left / 1000) % 60), l: 'SEC' },
  ];
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {parts.map((p, i) => (
        <React.Fragment key={p.l}>
          <div className="text-center">
            <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-xl bg-base border border-primary/40 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={p.v}
                  className="font-hud text-xl sm:text-2xl text-t-primary tabular-nums"
                  initial={{ y: -24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                >
                  {String(p.v).padStart(2, '0')}
                </motion.span>
              </AnimatePresence>
            </div>
            <div className="font-pixel text-[9px] text-ink-4 mt-1.5">{p.l}</div>
          </div>
          {i < 3 && <span className="font-hud text-xl text-t-primary blink -mt-5">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
};

/* ---------------- Weekly raid (community boss fight) ---------------- */
export const WeeklyRaid: React.FC = () => {
  const total = 1000;
  const [hp, setHp] = useState(388);
  const [hits, setHits] = useState<{ id: number; x: number; dmg: number }[]>([]);
  const idRef = useRef(0);
  useEffect(() => {
    const t = window.setInterval(() => setHp((h) => Math.max(0, h - Math.ceil(Math.random() * 3))), 2600);
    return () => window.clearInterval(t);
  }, []);
  const attack = () => {
    const dmg = 5 + Math.floor(Math.random() * 11);
    setHp((h) => Math.max(0, h - dmg));
    const id = ++idRef.current;
    setHits((p) => [...p, { id, x: 20 + Math.random() * 60, dmg }]);
    window.setTimeout(() => setHits((p) => p.filter((h) => h.id !== id)), 900);
    navigator.vibrate?.(20);
  };
  const pct = (hp / total) * 100;
  return (
    <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <span className="font-pixel text-[11px] text-t-accent tracking-widest flex items-center gap-2">
          <Swords className="w-4 h-4" /> WEEKLY RAID · IRON DEN
        </span>
        <span className="font-pixel text-[10px] text-ink-4">SQUAT BOSS · 1,000 HP</span>
      </div>
      <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
        <motion.button
          type="button"
          onClick={attack}
          whileTap={{ scale: 0.85, rotate: -6 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ y: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
          className="relative mx-auto w-28 h-28 rounded-3xl bg-accent text-white flex items-center justify-center shadow-[0_0_40px_-6px_var(--color-accent)] cursor-pointer"
          aria-label="Attack the raid boss"
        >
          <Skull className="w-14 h-14" />
          <AnimatePresence>
            {hits.map((h) => (
              <motion.span
                key={h.id}
                className="absolute font-hud text-lg text-t-coin pointer-events-none"
                style={{ left: `${h.x}%` }}
                initial={{ y: 0, opacity: 1, scale: 0.8 }}
                animate={{ y: -70, opacity: 0, scale: 1.3 }}
                transition={{ duration: 0.9 }}
              >
                -{h.dmg}
              </motion.span>
            ))}
          </AnimatePresence>
        </motion.button>
        <div>
          <h3 className="font-display text-2xl sm:text-3xl text-ink mb-1">Beat the squat boss together</h3>
          <p className="text-sm text-ink-3 mb-4">Every squat logged by any member deals damage. Tap the boss to log 5–15 reps.</p>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-pixel text-ink-4">BOSS HP</span>
            <span className="font-hud text-t-primary">
              <AnimatedNumber value={hp} /> / {total}
            </span>
          </div>
          <div className="h-4 rounded-full bg-base border border-line/15 overflow-hidden p-0.5">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent via-primary to-sky"
              animate={{ width: `${pct}%` }}
              transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            />
          </div>
          <p className="text-xs text-ink-4 mt-3">{hp === 0 ? 'Boss defeated! Everyone gets +75 XP 🎉' : 'Reward when defeated: +75 XP for every member who joined in.'}</p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- FAQ accordion ---------------- */
const FAQS = [
  ['Is GymLoop free for members?', 'Yes. Gyms pay a monthly plan; members play free.'],
  ['How does the live crowd count work?', 'It counts check-ins at the desk QR, so it reflects people actually inside right now.'],
  ['What if I miss a week?', 'Use a Streak Freeze. You earn one every 4 streak weeks (hold up to 2). No freeze left? Finish 3 goal weeks in a row to earn the streak back.'],
  ['What are power-ups?', 'Rewards for keeping your streak: Streak Freezes, Comeback Boost, Crowd Radar Pro and XP Magnet, unlocked at streak milestones.'],
  ['Can I buy the merch?', 'Never. Keychains, tees and hoodies are only unlocked by showing up.'],
  ['Does it work with any gym?', 'Any independent gym can join. The owner sets it up and prints the desk QR.'],
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {FAQS.map(([q, a], i) => (
        <Reveal key={q} delay={i * 0.05}>
          <div className={`rounded-2xl border bg-surface transition-colors ${open === i ? 'border-primary/60' : 'border-line/12'}`}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full min-h-[56px] px-5 flex items-center justify-between gap-4 text-left cursor-pointer"
            >
              <span className="font-semibold text-ink">{q}</span>
              <motion.span animate={{ rotate: open === i ? 180 : 0 }} className="text-t-primary shrink-0">
                <ChevronDown className="w-5 h-5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 text-sm text-ink-3">{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      ))}
    </div>
  );
};

/* ---------------- Daily loot spin ---------------- */
const PRIZES = ['+10 XP', '+25 XP', '2× XP HOUR', '+50 XP', '+15 XP', 'BADGE', '+20 XP', '+100 XP'];
const SEG = 360 / PRIZES.length;
const SPIN_KEY = 'gymloop-spin';

export const SpinWheel: React.FC = () => {
  const today = new Date().toDateString();
  const [saved, setSaved] = useState<{ day: string; prize: string } | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(SPIN_KEY) || 'null');
    } catch {
      return null;
    }
  });
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(saved?.day === today ? saved.prize : null);
  const usedToday = saved?.day === today;

  const spin = () => {
    if (spinning || usedToday) return;
    const idx = Math.floor(Math.random() * PRIZES.length);
    const target = 360 * 6 + (360 - idx * SEG - SEG / 2);
    setSpinning(true);
    setResult(null);
    setAngle((a) => a - (a % 360) + target);
    navigator.vibrate?.(15);
    window.setTimeout(() => {
      setSpinning(false);
      setResult(PRIZES[idx]);
      const rec = { day: today, prize: PRIZES[idx] };
      setSaved(rec);
      try {
        localStorage.setItem(SPIN_KEY, JSON.stringify(rec));
      } catch {
        /* ignore */
      }
      navigator.vibrate?.([30, 40, 30]);
    }, 3200);
  };

  const colors = ['var(--color-primary)', 'var(--color-accent)', 'var(--color-coin)', 'var(--color-raised)'];
  const gradient = PRIZES.map((_, i) => `${colors[i % 4]} ${i * SEG}deg ${(i + 1) * SEG}deg`).join(', ');

  return (
    <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card grid md:grid-cols-2 gap-8 items-center">
      <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-0 h-0 border-x-[12px] border-x-transparent border-t-[22px] border-t-[var(--color-ink)] drop-shadow" />
        <motion.div
          className="w-full h-full rounded-full border-4 border-primary shadow-[0_0_40px_-8px_var(--color-primary)] relative"
          style={{ background: `conic-gradient(${gradient})` }}
          animate={{ rotate: angle }}
          transition={{ duration: 3.1, ease: [0.12, 0.8, 0.2, 1] }}
        >
          {PRIZES.map((p, i) => (
            <div
              key={p}
              className="absolute left-1/2 top-1/2 origin-left font-pixel text-[9px] sm:text-[10px] text-white font-bold"
              style={{ transform: `rotate(${i * SEG + SEG / 2 - 90}deg) translateX(46px)`, textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}
            >
              {p}
            </div>
          ))}
          <div className="absolute inset-[38%] rounded-full bg-void border-2 border-primary" />
        </motion.div>
      </div>
      <div className="text-center md:text-left">
        <p className="font-pixel text-xs text-t-primary tracking-widest mb-2">DAILY LOOT SPIN</p>
        <h3 className="font-display text-3xl text-ink mb-3">One free spin a day</h3>
        <p className="text-sm text-ink-3 mb-6">Checked in today? Spin for bonus XP, a 2× XP hour or a rare badge.</p>
        <button
          type="button"
          onClick={spin}
          disabled={spinning || usedToday}
          className="shimmer min-h-[52px] px-8 rounded-2xl bg-primary hover:bg-primary-hi disabled:opacity-50 disabled:cursor-not-allowed text-onbright font-display text-lg sticker-green cursor-pointer"
        >
          {spinning ? 'SPINNING…' : usedToday ? 'COME BACK TOMORROW' : 'SPIN'}
        </button>
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 16 }}
              className="mt-5 inline-block px-5 py-3 rounded-2xl bg-raised border border-primary font-hud text-xl text-t-primary neon"
            >
              YOU WON {result}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

/* ---------------- Achievements (flip cards) ---------------- */
const BADGES = [
  { e: '🌅', n: 'Early Bird', d: 'Check in before 7 AM five times.', got: true },
  { e: '🤝', n: 'Squad Up', d: 'Bring a friend who checks in.', got: true },
  { e: '🦵', n: 'Leg Day Loyal', d: 'Never skip legs for 4 weeks.', got: true },
  { e: '😌', n: 'Off-Peak Hero', d: 'Train in the quiet window 10 times.', got: false },
  { e: '🔥', n: 'On Fire', d: 'Hit your weekly goal 10 weeks straight.', got: true },
  { e: '🧊', n: 'Comeback Kid', d: 'Earn back a lost streak.', got: false },
  { e: '⚔️', n: 'Raid Leader', d: 'Top damage in a weekly raid.', got: false },
  { e: '👑', n: 'Gym Royalty', d: 'Finish #1 on the monthly board.', got: false },
];

export const Achievements: React.FC = () => {
  const [flipped, setFlipped] = useState<number | null>(null);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {BADGES.map((b, i) => (
        <Reveal key={b.n} delay={i * 0.04}>
          <button
            type="button"
            onClick={() => setFlipped(flipped === i ? null : i)}
            className="relative w-full h-40 cursor-pointer [perspective:900px]"
            aria-label={`${b.n}: ${b.d}`}
          >
            <motion.div
              className="absolute inset-0 [transform-style:preserve-3d]"
              animate={{ rotateY: flipped === i ? 180 : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div
                className={`absolute inset-0 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 [backface-visibility:hidden] ${
                  b.got ? 'bg-raised border-primary shadow-[0_0_24px_-8px_var(--color-primary)]' : 'bg-base border-line/12'
                }`}
              >
                <span className={`text-4xl ${b.got ? '' : 'grayscale opacity-40'}`}>{b.e}</span>
                <span className="text-sm font-bold text-ink">{b.n}</span>
                <span className={`font-pixel text-[9px] ${b.got ? 'text-t-primary' : 'text-ink-5'}`}>{b.got ? 'UNLOCKED' : 'LOCKED'}</span>
              </div>
              <div className="absolute inset-0 rounded-2xl border-2 border-accent bg-surface p-4 flex items-center justify-center text-center text-sm text-ink-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
                {b.d}
              </div>
            </motion.div>
          </button>
        </Reveal>
      ))}
    </div>
  );
};

/* ---------------- Crowd heatmap (owners) ---------------- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM – 10 PM

const crowdAt = (d: number, h: number) => {
  const morning = Math.exp(-((h - 7.5) ** 2) / 2) * 0.85;
  const evening = Math.exp(-((h - 18.5) ** 2) / 3) * 1.0;
  const weekend = d >= 5 ? 0.7 : 1;
  const lateWeekend = d >= 5 ? Math.exp(-((h - 11) ** 2) / 4) * 0.6 : 0;
  return Math.min(1, (morning + evening) * weekend + lateWeekend + 0.08);
};

export const CrowdHeatmap: React.FC = () => {
  const [tip, setTip] = useState<string | null>(null);
  const [jitter, setJitter] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setJitter((j) => j + 1), 2500);
    return () => window.clearInterval(t);
  }, []);
  const nowD = (new Date().getDay() + 6) % 7;
  const nowH = new Date().getHours();
  return (
    <div className="hud-corners rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <p className="font-pixel text-[11px] text-t-primary tracking-widest mb-1 flex items-center gap-2">
            <span className="live-dot" /> LIVE CROWD HEATMAP
          </p>
          <h3 className="font-display text-2xl text-ink">When does your gym fill up?</h3>
        </div>
        <AnimatePresence mode="wait">
          <motion.span
            key={tip ?? 'hint'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="text-xs font-mono px-3 py-1.5 rounded-lg bg-base border border-line/12 text-ink-2"
          >
            {tip ?? 'Tap or hover a cell'}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {DAYS.map((d, di) => (
            <div key={d} className="flex items-center gap-1 mb-1">
              <span className="w-10 text-[10px] font-pixel text-ink-4">{d.toUpperCase()}</span>
              {HOURS.map((h, hi) => {
                const base = crowdAt(di, h);
                const live = di === nowD && h === nowH;
                const v = Math.max(0.05, Math.min(1, base + (live ? Math.sin(jitter) * 0.08 : 0)));
                return (
                  <motion.button
                    key={h}
                    type="button"
                    initial={{ opacity: 0, scale: 0.4 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (di * 17 + hi) * 0.004 }}
                    whileHover={{ scale: 1.3, zIndex: 2 }}
                    onPointerEnter={() => setTip(`${d} ${h % 12 || 12}${h < 12 ? 'AM' : 'PM'} · ~${Math.round(v * 75)} people`)}
                    onClick={() => setTip(`${d} ${h % 12 || 12}${h < 12 ? 'AM' : 'PM'} · ~${Math.round(v * 75)} people`)}
                    className={`flex-1 h-7 rounded-md cursor-pointer ${live ? 'ring-2 ring-[var(--color-ink)]' : ''}`}
                    style={{ background: `color-mix(in oklab, var(--color-primary) ${Math.round(v * 100)}%, var(--color-base))` }}
                    aria-label={`${d} ${h}:00, about ${Math.round(v * 75)} people`}
                  />
                );
              })}
            </div>
          ))}
          <div className="flex gap-1 pl-11 mt-1">
            {HOURS.map((h) => (
              <span key={h} className="flex-1 text-center text-[9px] font-pixel text-ink-5">
                {h % 3 === 0 ? `${h % 12 || 12}${h < 12 ? 'a' : 'p'}` : ''}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-xs text-ink-4 mt-4">Demo data. In your dashboard this is built from real check-ins.</p>
    </div>
  );
};

/* ---------------- Rest timer (tool) ---------------- */
export const RestTimer: React.FC = () => {
  const [total, setTotal] = useState(90);
  const [left, setLeft] = useState(90);
  const [running, setRunning] = useState(false);
  const [rounds, setRounds] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = window.setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          setRunning(false);
          setRounds((r) => r + 1);
          navigator.vibrate?.([200, 100, 200]);
          return 0;
        }
        return l - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [running]);
  const pick = (s: number) => {
    setTotal(s);
    setLeft(s);
    setRunning(false);
  };
  const mm = Math.floor(left / 60);
  const ss = String(left % 60).padStart(2, '0');
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="rounded-3xl bg-surface border border-line/12 p-6 sm:p-7">
        <span className="text-sm text-ink-3 block mb-3">Rest length</span>
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[30, 60, 90, 120, 150, 180, 240, 300].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pick(s)}
              className={`min-h-[44px] rounded-xl text-sm font-bold cursor-pointer ${
                total === s ? 'bg-primary text-onbright' : 'bg-base border border-line/12 text-ink-2 hover:border-primary/60'
              }`}
            >
              {s < 60 ? `${s}s` : `${s / 60}${s % 60 ? '.5' : ''}m`}
            </button>
          ))}
        </div>
        <p className="text-xs text-ink-4">Strength: 2–5 min · Hypertrophy: 60–90 s · Endurance: 30–60 s. Your phone vibrates when rest is over.</p>
      </div>
      <div className="rounded-3xl bg-surface border border-line/12 p-6 sm:p-7 flex flex-col items-center">
        <Ring
          pct={(left / total) * 100}
          size={210}
          label={
            <div className="text-center">
              <div className={`font-hud text-5xl text-ink tabular-nums ${left === 0 ? 'blink text-t-primary' : ''}`}>
                {mm}:{ss}
              </div>
              <div className="font-pixel text-[10px] text-ink-4 mt-1">{left === 0 ? 'GO!' : running ? 'RESTING' : 'READY'}</div>
            </div>
          }
        />
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={() => {
              if (left === 0) setLeft(total);
              setRunning((r) => !r);
            }}
            className="min-h-[50px] px-7 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-bold flex items-center gap-2 sticker-green cursor-pointer"
          >
            {running ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />} {running ? 'Pause' : left === 0 ? 'Next set' : 'Start'}
          </button>
          <button
            type="button"
            onClick={() => pick(total)}
            className="min-h-[50px] px-5 rounded-2xl bg-base border border-line/15 text-ink font-semibold flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </button>
        </div>
        <p className="font-pixel text-[10px] text-ink-4 mt-5">SETS RESTED: {rounds}</p>
      </div>
    </div>
  );
};
