import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, BarChart3, BellRing, Check, Megaphone, Swords } from 'lucide-react';
import { AnimatedNumber, Blobs, LiveBars, Reveal, TiltCard } from './fx';

const PLANS = [
  { name: 'Starter', price: 999, members: 'Up to 100 members' },
  { name: 'Growth', price: 1799, members: '101–300 members', popular: true },
  { name: 'Pro', price: 2999, members: '301–500 members' },
];

export const OwnersLanding: React.FC<{ go: (p: string) => void }> = ({ go }) => {
  const [members, setMembers] = useState(250);
  const [fee, setFee] = useState(1500);
  const saved = Math.round(members * 0.05); // members kept per month if churn drops ~5 points
  const revenue = saved * fee;

  return (
    <div className="-mx-4 sm:-mx-6">
      <section className="relative isolate px-4 sm:px-6 pt-12 pb-16">
        <Blobs />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-pixel text-xs text-t-accent tracking-widest mb-4">
              P2 · FOR GYM OWNERS · BOSS MODE
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16 }}
              className="font-display text-5xl sm:text-6xl leading-[0.95] text-ink mb-6 text-balance"
            >
              Keep members. <span className="text-t-primary">Fill quiet hours.</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg text-ink-3 mb-9 max-w-xl">
              About half of new members quit within six months. GymLoop shows you who&apos;s slipping before they leave, and
              gives everyone else a reason to keep coming back.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="flex flex-col sm:flex-row gap-3">
              <button type="button" onClick={() => go('/boss')} className="shimmer min-h-[54px] px-8 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-lg flex items-center justify-center gap-3 sticker-green cursor-pointer">
                OPEN BOSS MODE <ArrowRight className="w-5 h-5" />
              </button>
              <button type="button" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="min-h-[54px] px-7 rounded-2xl bg-surface/80 hover:bg-raised border border-line/20 text-ink font-semibold flex items-center justify-center cursor-pointer">
                See pricing
              </button>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: 50, s: '%', l: 'of new members quit within 6 months' },
              { v: 45, s: '%', l: 'say crowds make it harder to stay consistent' },
              { v: 31, s: '%', l: 'lose motivation in the first few weeks' },
              { v: 2, s: '', l: 'members kept a month pays for GymLoop' },
            ].map((s, i) => (
              <Reveal key={s.l} delay={i * 0.1}>
                <div className="lift rounded-3xl bg-surface border border-line/12 p-6 h-full">
                  <div className="font-display text-5xl text-t-primary mb-2">
                    <AnimatedNumber value={s.v} suffix={s.s} />
                  </div>
                  <p className="text-sm text-ink-3">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { icon: <BarChart3 className="w-6 h-6" />, t: 'Busiest hours', d: 'Hourly headcount from real check-ins.' },
          { icon: <BellRing className="w-6 h-6" />, t: 'Drop-off alerts', d: 'Members with no visit in 10+ days, one tap to nudge.' },
          { icon: <Swords className="w-6 h-6" />, t: 'Challenges', d: 'Launch “Off-peak 2× XP” to shift the 6 PM rush.' },
          { icon: <Megaphone className="w-6 h-6" />, t: 'Broadcasts', d: 'Push announcements straight into the member app.' },
        ].map((f, i) => (
          <Reveal key={f.t} delay={i * 0.08}>
            <TiltCard className="rounded-3xl bg-surface border border-line/12 p-6 h-full">
              <div className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center mb-5">{f.icon}</div>
              <h3 className="font-display text-xl text-ink mb-2">{f.t}</h3>
              <p className="text-sm text-ink-3">{f.d}</p>
            </TiltCard>
          </Reveal>
        ))}
      </section>

      {/* ROI calculator */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <Reveal>
          <div className="rounded-3xl bg-surface border border-line/12 p-7 sm:p-10 grid lg:grid-cols-2 gap-10 items-center sticker-card">
            <div>
              <p className="font-pixel text-xs text-t-primary tracking-widest mb-2">RETENTION MATH</p>
              <h2 className="font-display text-3xl text-ink mb-6">What&apos;s a 5% churn drop worth?</h2>
              <label className="block text-sm text-ink-3 mb-1">
                Active members: <b className="text-ink">{members}</b>
              </label>
              <input type="range" min={50} max={600} step={10} value={members} onChange={(e) => setMembers(Number(e.target.value))} className="w-full accent-[var(--color-primary)] mb-6" />
              <label className="block text-sm text-ink-3 mb-1">
                Monthly fee: <b className="text-ink">₹{fee.toLocaleString('en-IN')}</b>
              </label>
              <input type="range" min={500} max={5000} step={100} value={fee} onChange={(e) => setFee(Number(e.target.value))} className="w-full accent-[var(--color-primary)]" />
              <p className="text-xs text-ink-5 mt-4">Illustrative estimate only, assuming GymLoop helps keep 5% more members each month.</p>
            </div>
            <div className="text-center">
              <div className="font-pixel text-[11px] text-ink-4 mb-2">REVENUE KEPT / MONTH</div>
              <div className="font-display text-6xl text-t-primary mb-2">
                <AnimatedNumber value={revenue} prefix="₹" />
              </div>
              <div className="text-sm text-ink-3 mb-6">
                <AnimatedNumber value={saved} /> members who would have walked
              </div>
              <LiveBars base={[30, 42, 50, 58, 66, 74, 82, 90]} highlight={7} className="h-24" />
            </div>
          </div>
        </Reveal>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 py-16 pb-24 scroll-mt-20">
        <Reveal>
          <h2 className="font-display text-4xl text-center text-ink mb-3">The shop</h2>
          <p className="text-center text-ink-3 mb-12">Gyms pay. Members play free. Per gym, per month.</p>
        </Reveal>
        <div className="grid md:grid-cols-4 gap-5">
          {PLANS.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <TiltCard
                className={`relative rounded-3xl p-7 h-full border-2 ${p.popular ? 'border-primary bg-raised sticker-green' : 'border-line/12 bg-surface'}`}
              >
                {p.popular && (
                  <span className="absolute -top-3 right-5 font-pixel text-[10px] px-2.5 py-1 rounded-lg bg-primary text-onbright">MOST PICKED</span>
                )}
                <p className="font-pixel text-xs text-ink-4 mb-3">{p.name.toUpperCase()}</p>
                <div className="font-display text-4xl text-ink mb-1">
                  <AnimatedNumber value={p.price} prefix="₹" />
                </div>
                <p className="text-xs text-ink-4 mb-5">/ month</p>
                <p className="flex items-center gap-2 text-sm text-ink-2">
                  <Check className="w-4 h-4 text-t-primary" /> {p.members}
                </p>
              </TiltCard>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <TiltCard className="rounded-3xl p-7 h-full border-2 border-line/12 bg-surface">
              <p className="font-pixel text-xs text-ink-4 mb-3">ENTERPRISE</p>
              <div className="font-display text-4xl text-ink mb-1">Custom</div>
              <p className="text-xs text-ink-4 mb-5">chains & 500+ members</p>
              <button type="button" onClick={() => go('/boss')} className="text-sm font-bold text-t-primary flex items-center gap-1.5 cursor-pointer">
                Try the dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </TiltCard>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
