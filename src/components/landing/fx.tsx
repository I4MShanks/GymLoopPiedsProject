import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'motion/react';

/** Fades + slides children in when they scroll into view. */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({
  children,
  delay = 0,
  className,
  y = 28,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.6, delay, ease: [0.2, 0.8, 0.2, 1] }}
  >
    {children}
  </motion.div>
);

/** Counts up to `value` when visible, and animates smoothly whenever it changes. */
export const AnimatedNumber: React.FC<{ value: number; decimals?: number; prefix?: string; suffix?: string; className?: string }> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const from = useRef(0);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(from.current, value, {
      duration: 1.1,
      ease: [0.2, 0.8, 0.2, 1],
      onUpdate: (v) => setShown(v),
    });
    from.current = value;
    return () => controls.stop();
  }, [value, inView]);
  return (
    <span ref={ref} className={`font-score tabular-nums ${className ?? ''}`}>
      {prefix}
      {shown.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/** Card that tilts slightly toward the pointer / finger for a tactile feel. */
export const TiltCard: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className,
  onClick,
}) => {
  const [rot, setRot] = useState({ x: 0, y: 0 });
  return (
    <motion.div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setRot({ x: -py * 8, y: px * 10 });
      }}
      onPointerLeave={() => setRot({ x: 0, y: 0 })}
      animate={{ rotateX: rot.x, rotateY: rot.y }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{ transformPerspective: 900 }}
      className={`hud-corners neon-edge ${className ?? ''} ${onClick ? 'cursor-pointer' : ''}`}
    >
      {children}
    </motion.div>
  );
};

/** Background glow blobs that slowly drift. */
export const Blobs: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden -z-10" aria-hidden="true">
    <div className="blob w-80 h-80 bg-accent -top-20 -left-16" />
    <div className="blob w-96 h-96 bg-primary top-1/3 -right-24" style={{ animationDelay: '-5s' }} />
    <div className="blob w-72 h-72 bg-coin bottom-0 left-1/3" style={{ animationDelay: '-9s', opacity: 0.35 }} />
  </div>
);

/** A number that wanders a little every few seconds, like a live feed. */
export function useLiveValue(start: number, min: number, max: number, everyMs = 2800) {
  const [v, setV] = useState(start);
  useEffect(() => {
    const t = window.setInterval(() => {
      setV((p) => Math.max(min, Math.min(max, p + (Math.random() > 0.5 ? 1 : -1) * Math.ceil(Math.random() * 2))));
    }, everyMs);
    return () => window.clearInterval(t);
  }, [min, max, everyMs]);
  return v;
}

const FEED = [
  'Riya checked in · +50 XP',
  'Kabir hit a 15-week streak 🔥',
  'Iron Den is CHILL right now · 31% full',
  'Aman unlocked the Loop Tee 👕',
  'Squat challenge 612 / 1,000',
  'Sneha joined as a Founding Member ⭐',
  'Best window today: 2–4 PM',
];

/** Endless ticker of live gym activity. */
export const LiveTicker: React.FC = () => (
  <div className="relative overflow-hidden border-y border-line/10 bg-surface/60 backdrop-blur py-3">
    <div className="marquee gap-10 pr-10">
      {[...FEED, ...FEED].map((t, i) => (
        <span key={i} className="flex items-center gap-2.5 font-pixel text-[11px] tracking-wider text-ink-3 whitespace-nowrap">
          <span className="live-dot" />
          {t}
        </span>
      ))}
    </div>
  </div>
);

/** Animated circular gauge. */
export const Ring: React.FC<{ pct: number; size?: number; label?: React.ReactNode }> = ({ pct, size = 120, label }) => {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="10" fill="none" style={{ stroke: 'var(--color-raised)' }} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          style={{ stroke: 'var(--color-primary)' }}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (c * pct) / 100 }}
          transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{label}</div>
    </div>
  );
};

/** Bars that grow in and gently re-shuffle to look live. */
export const LiveBars: React.FC<{ base: number[]; highlight?: number; className?: string }> = ({ base, highlight, className }) => {
  const [vals, setVals] = useState(base);
  useEffect(() => {
    const t = window.setInterval(() => {
      setVals(base.map((b) => Math.max(8, Math.min(100, b + (Math.random() - 0.5) * 14))));
    }, 2200);
    return () => window.clearInterval(t);
  }, [base]);
  return (
    <div className={`flex items-end gap-1.5 ${className ?? ''}`}>
      {vals.map((v, i) => (
        <motion.div
          key={i}
          className={`flex-1 rounded-md ${i === highlight ? 'bg-primary' : v > 70 ? 'bg-accent' : v > 45 ? 'bg-coin' : 'bg-sky'}`}
          initial={{ height: 0 }}
          animate={{ height: `${v}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.03 }}
          style={i === highlight ? { boxShadow: '0 0 14px var(--color-primary)' } : undefined}
        />
      ))}
    </div>
  );
};
