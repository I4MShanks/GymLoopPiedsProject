import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Calculator, Dumbbell, Flame, Gift, Play, QrCode, Store, Users } from 'lucide-react';
import { AnimatedNumber, Blobs, LiveBars, LiveTicker, Reveal, Ring, TiltCard, useLiveValue } from './fx';
import { FAQ, SeasonCountdown, WeeklyRaid } from './arcade';

const TITLE = ['G', 'Y', 'M', ' ', 'L', 'O', 'O', 'P'];

export const HomeLanding: React.FC<{ go: (p: string) => void }> = ({ go }) => {
  const inside = useLiveValue(23, 14, 48);
  const pct = Math.round((inside / 75) * 100);

  return (
    <div className="-mx-4 sm:-mx-6">
      {/* HERO */}
      <section className="relative isolate px-4 sm:px-6 pt-10 pb-16 lg:pt-16">
        <Blobs />
        <div className="synth-grid" />
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface/80 border border-line/15 backdrop-blur mb-7"
            >
              <span className="live-dot" />
              <span className="font-pixel text-[11px] tracking-wider text-ink-3">
                LIVE AT IRON DEN · <AnimatedNumber value={inside} /> INSIDE
              </span>
            </motion.div>

            <h1 className="glitch font-hud font-black text-6xl sm:text-8xl lg:text-9xl leading-[0.9] tracking-tight text-t-primary neon mb-6">
              {TITLE.map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 40, rotate: -8 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 + i * 0.06 }}
                  whileHover={{ y: -8, rotate: i % 2 ? 6 : -6 }}
                >
                  {ch === ' ' ? ' ' : ch}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="font-pixel text-xs sm:text-sm tracking-widest text-ink-2 mb-9"
            >
              SEE THE CROWD. SHOW UP MORE. EARN IT.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <button
                type="button"
                onClick={() => go('/join')}
                className="shimmer min-h-[54px] px-8 rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-lg flex items-center justify-center gap-3 sticker-green cursor-pointer"
              >
                <Play className="w-5 h-5 fill-current" /> PRESS START
              </button>
              <button
                type="button"
                onClick={() => go('/owners')}
                className="min-h-[54px] px-7 rounded-2xl bg-surface/80 hover:bg-raised border border-line/20 text-ink font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                I run a gym <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>

          {/* Live preview card */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.3 }}
          >
            <TiltCard className="rounded-3xl bg-surface/90 border border-line/15 p-6 sm:p-7 sticker-card backdrop-blur">
              <div className="flex items-center justify-between mb-5">
                <span className="font-pixel text-[11px] text-t-accent tracking-wider">IRON DEN · PILANI</span>
                <span className="flex items-center gap-2 font-pixel text-[10px] text-t-primary">
                  <span className="live-dot" /> LIVE
                </span>
              </div>
              <div className="flex items-center gap-6 mb-6">
                <Ring
                  pct={pct}
                  size={128}
                  label={
                    <div className="text-center">
                      <div className="font-display text-3xl text-ink">
                        <AnimatedNumber value={pct} suffix="%" />
                      </div>
                      <div className="font-pixel text-[9px] text-ink-4">FULL</div>
                    </div>
                  }
                />
                <div>
                  <div className="font-display text-2xl text-t-primary">{pct < 40 ? 'CHILL 😌' : pct < 70 ? 'BUSY 😤' : 'PACKED 🔥'}</div>
                  <div className="text-sm text-ink-3 mt-1">
                    <AnimatedNumber value={inside} /> people inside
                  </div>
                  <div className="text-xs text-ink-4 mt-2">
                    Best window: <b className="text-t-coin">2–4 PM</b>
                  </div>
                </div>
              </div>
              <LiveBars base={[55, 82, 88, 58, 30, 22, 31, 26, 40, 72, 96, 90, 64, 34]} highlight={6} className="h-24" />
              <div className="flex justify-between font-pixel text-[9px] text-ink-5 mt-2">
                <span>6A</span>
                <span>12P</span>
                <span>6P</span>
                <span>10P</span>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      <LiveTicker />

      {/* PICK YOUR PATH */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <Reveal>
          <p className="font-pixel text-xs text-t-primary tracking-widest mb-3 text-center">▶ CHOOSE YOUR PLAYER</p>
          <h2 className="font-display text-4xl sm:text-5xl text-center text-ink mb-12">Who&apos;s playing today?</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Dumbbell className="w-7 h-7" />,
              tag: 'P1 · MEMBERS',
              title: 'I lift there',
              text: 'Weekly quests, live crowd, streaks and merch you can’t buy.',
              to: '/members',
              color: 'bg-primary text-onbright',
            },
            {
              icon: <Store className="w-7 h-7" />,
              tag: 'P2 · GYM OWNERS',
              title: 'I run the place',
              text: 'Busiest hours, drop-off alerts, challenges and broadcasts.',
              to: '/owners',
              color: 'bg-accent text-white',
            },
            {
              icon: <Calculator className="w-7 h-7" />,
              tag: 'TOOLS',
              title: 'Run the numbers',
              text: 'BMI, BMR, protein, 1RM, heart-rate zones and more.',
              to: '/calculators',
              color: 'bg-coin text-onbright',
            },
          ].map((c, i) => (
            <Reveal key={c.to} delay={i * 0.1}>
              <TiltCard
                onClick={() => go(c.to)}
                className="group h-full rounded-3xl bg-surface border border-line/12 p-7 sticker-card hover:border-primary/60"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${c.color}`}>{c.icon}</div>
                <p className="font-pixel text-[10px] text-ink-4 tracking-widest mb-2">{c.tag}</p>
                <h3 className="font-display text-2xl text-ink mb-2">{c.title}</h3>
                <p className="text-sm text-ink-3 leading-relaxed mb-6">{c.text}</p>
                <span className="inline-flex items-center gap-2 text-sm font-bold text-t-primary">
                  Enter <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
                </span>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SEASON + RAID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 grid lg:grid-cols-5 gap-6 items-stretch">
        <Reveal className="lg:col-span-2">
          <div className="hud-corners h-full rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card flex flex-col justify-between gap-6">
            <div>
              <p className="font-pixel text-[11px] text-t-coin tracking-widest mb-2">SEASON 2027 · Q1</p>
              <h3 className="font-display text-2xl sm:text-3xl text-ink mb-2">Season ends in</h3>
              <p className="text-sm text-ink-3">Finish the season on a streak to unlock the Season Hoodie before it&apos;s gone for good.</p>
            </div>
            <SeasonCountdown />
          </div>
        </Reveal>
        <Reveal className="lg:col-span-3" delay={0.1}>
          <WeeklyRaid />
        </Reveal>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <Reveal>
          <h2 className="font-display text-4xl text-center text-ink mb-12">How to play</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 relative">
          {[
            { n: '01', icon: <Flame className="w-6 h-6" />, t: 'Set your quest', d: 'Pick 3 or 4 days a week and your focus.' },
            { n: '02', icon: <QrCode className="w-6 h-6" />, t: 'Check in', d: 'Scan the rotating desk QR. No couch check-ins.' },
            { n: '03', icon: <Gift className="w-6 h-6" />, t: 'Earn the loot', d: 'Keychain → Tee → Hoodie. Never for sale.' },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="lift rounded-3xl bg-surface/70 border border-line/12 p-7 h-full">
                <div className="flex items-center justify-between mb-5">
                  <span className="font-display text-5xl text-t-accent/40">{s.n}</span>
                  <motion.div
                    className="w-12 h-12 rounded-2xl bg-raised text-t-primary flex items-center justify-center"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.4, ease: 'easeInOut' }}
                  >
                    {s.icon}
                  </motion.div>
                </div>
                <h3 className="font-display text-xl text-ink mb-2">{s.t}</h3>
                <p className="text-sm text-ink-3">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="max-w-3xl mx-auto mt-20">
          <Reveal>
            <h2 className="font-display text-4xl text-center text-ink mb-8">Player FAQ</h2>
          </Reveal>
          <FAQ />
        </div>
        <Reveal delay={0.2}>
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go('/app/home')}
              className="min-h-[50px] px-7 rounded-2xl bg-surface hover:bg-raised border border-line/20 text-ink font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4" /> Try the demo app
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
};
