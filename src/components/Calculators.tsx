import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Activity, ArrowLeft, Timer, Beef, Dumbbell, Flame, FlaskConical, HeartPulse, Ruler, Scale, TrendingUp } from 'lucide-react';
import { AnimatedNumber, Reveal, Ring, TiltCard } from './landing/fx';
import { RestTimer } from './landing/arcade';

type Sex = 'male' | 'female';
type CalcId = 'bmi' | 'bmr' | 'protein' | 'whr' | 'bench' | 'intensity' | 'gain' | 'creatine' | 'timer';

const CALCS: { id: CalcId; name: string; blurb: string; icon: React.ReactNode }[] = [
  { id: 'bmi', name: 'BMI', blurb: 'Body Mass Index & healthy range', icon: <Scale className="w-6 h-6" /> },
  { id: 'bmr', name: 'BMR', blurb: 'Calories burned at rest + daily total', icon: <Flame className="w-6 h-6" /> },
  { id: 'protein', name: 'Protein', blurb: 'Daily protein for your activity', icon: <Beef className="w-6 h-6" /> },
  { id: 'whr', name: 'Waist-to-Hip', blurb: 'Fat distribution & health risk', icon: <Ruler className="w-6 h-6" /> },
  { id: 'bench', name: 'Bench Press 1RM', blurb: 'One-rep max from a set', icon: <Dumbbell className="w-6 h-6" /> },
  { id: 'intensity', name: 'Exercise Intensity', blurb: 'Heart-rate training zones', icon: <HeartPulse className="w-6 h-6" /> },
  { id: 'gain', name: 'Weight Gain', blurb: 'Calories & time to target weight', icon: <TrendingUp className="w-6 h-6" /> },
  { id: 'creatine', name: 'Creatine', blurb: 'Daily creatine dose', icon: <FlaskConical className="w-6 h-6" /> },
  { id: 'timer', name: 'Rest Timer', blurb: 'Countdown between sets', icon: <Timer className="w-6 h-6" /> },
];

const ACTIVITY = [
  { k: 1.2, label: 'Sedentary', sub: 'little or no exercise' },
  { k: 1.375, label: 'Light', sub: '1–3 days / week' },
  { k: 1.55, label: 'Moderate', sub: '3–5 days / week' },
  { k: 1.725, label: 'Active', sub: '6–7 days / week' },
  { k: 1.9, label: 'Very active', sub: 'hard training / physical job' },
];

/* ---------- small UI pieces ---------- */
const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}> = ({ label, value, min, max, step = 1, unit, onChange }) => (
  <div className="mb-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-ink-3">{label}</span>
      <div className="flex items-center gap-1.5">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) onChange(v);
          }}
          className="w-20 text-right bg-base border border-line/15 rounded-lg px-2 py-1 text-sm font-bold text-ink tabular-nums focus:outline-none focus:border-primary"
        />
        {unit && <span className="text-xs text-ink-4 w-8">{unit}</span>}
      </div>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 accent-[var(--color-primary)] cursor-grab active:cursor-grabbing"
      aria-label={label}
    />
  </div>
);

const Segmented = <T extends string | number>({
  options,
  value,
  onChange,
  id,
}: {
  options: { v: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  id: string;
}) => (
  <div className="relative flex p-1 rounded-xl bg-base border border-line/12 mb-5">
    {options.map((o) => (
      <button
        key={String(o.v)}
        type="button"
        onClick={() => onChange(o.v)}
        className={`relative flex-1 min-h-[40px] px-2 text-xs sm:text-sm font-semibold rounded-lg cursor-pointer ${
          value === o.v ? 'text-onbright' : 'text-ink-3 hover:text-ink'
        }`}
      >
        {value === o.v && (
          <motion.span layoutId={`seg-${id}`} className="absolute inset-0 rounded-lg bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
        )}
        <span className="relative">{o.label}</span>
      </button>
    ))}
  </div>
);

const SexPick: React.FC<{ sex: Sex; setSex: (s: Sex) => void; id: string }> = ({ sex, setSex, id }) => (
  <Segmented id={id} value={sex} onChange={setSex} options={[{ v: 'male', label: '♂ Male' }, { v: 'female', label: '♀ Female' }]} />
);

const ActivityPick: React.FC<{ k: number; setK: (k: number) => void; id: string }> = ({ k, setK, id }) => (
  <div className="mb-5">
    <span className="text-sm text-ink-3 block mb-2">Activity level</span>
    <Segmented id={id} value={k} onChange={setK} options={ACTIVITY.map((a) => ({ v: a.k, label: a.label }))} />
    <p className="text-xs text-ink-4 -mt-3">{ACTIVITY.find((a) => a.k === k)?.sub}</p>
  </div>
);

const Result: React.FC<{ label: string; value: number; decimals?: number; prefix?: string; suffix?: string; big?: boolean }> = ({
  label,
  value,
  decimals = 0,
  prefix,
  suffix,
  big,
}) => (
  <div className={`rounded-2xl bg-base border border-line/12 ${big ? 'p-5' : 'p-4'}`}>
    <div className="font-pixel text-[10px] text-ink-4 tracking-wider mb-1">{label}</div>
    <div className={`font-display ${big ? 'text-4xl text-t-primary' : 'text-2xl text-ink'}`}>
      <AnimatedNumber value={Number.isFinite(value) ? value : 0} decimals={decimals} prefix={prefix} suffix={suffix} />
    </div>
  </div>
);

/** A horizontal scale with a marker that glides to the current value. */
const Scale5: React.FC<{ value: number; min: number; max: number; bands: { to: number; label: string; cls: string }[] }> = ({ value, min, max, bands }) => {
  const pos = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  let prev = min;
  return (
    <div className="mt-2 mb-1">
      <div className="relative h-4 rounded-full overflow-hidden flex">
        {bands.map((b) => {
          const w = ((Math.min(b.to, max) - prev) / (max - min)) * 100;
          prev = b.to;
          return <div key={b.label} className={b.cls} style={{ width: `${w}%` }} />;
        })}
      </div>
      <div className="relative h-6">
        <motion.div className="absolute -top-1 -translate-x-1/2" animate={{ left: `${pos}%` }} transition={{ type: 'spring', stiffness: 160, damping: 18 }}>
          <div className="w-0 h-0 border-x-[7px] border-x-transparent border-b-[9px] border-b-[var(--color-ink)] mx-auto" />
        </motion.div>
      </div>
      <div className="flex text-[10px] font-pixel text-ink-4 justify-between">
        {bands.map((b) => (
          <span key={b.label}>{b.label}</span>
        ))}
      </div>
    </div>
  );
};

const Verdict: React.FC<{ text: string; tone?: 'good' | 'warn' | 'bad' }> = ({ text, tone = 'good' }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={text}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`inline-flex px-3.5 py-1.5 rounded-full text-sm font-bold ${
        tone === 'good' ? 'bg-primary text-onbright' : tone === 'warn' ? 'bg-coin text-onbright' : 'bg-accent text-white'
      }`}
    >
      {text}
    </motion.div>
  </AnimatePresence>
);

const mifflin = (sex: Sex, kg: number, cm: number, age: number) => 10 * kg + 6.25 * cm - 5 * age + (sex === 'male' ? 5 : -161);

/* ---------- calculators ---------- */
const BMI: React.FC = () => {
  const [h, setH] = useState(172);
  const [w, setW] = useState(68);
  const bmi = w / (h / 100) ** 2;
  const lo = 18.5 * (h / 100) ** 2;
  const hi = 24.9 * (h / 100) ** 2;
  const [verdict, tone] =
    bmi < 18.5 ? ['Underweight', 'warn'] : bmi < 25 ? ['Healthy weight', 'good'] : bmi < 30 ? ['Overweight', 'warn'] : ['Obese', 'bad'];
  return (
    <Panel
      inputs={
        <>
          <Slider label="Height" value={h} min={120} max={220} unit="cm" onChange={setH} />
          <Slider label="Weight" value={w} min={30} max={180} step={0.5} unit="kg" onChange={setW} />
        </>
      }
      results={
        <>
          <Result big label="YOUR BMI" value={bmi} decimals={1} />
          <Verdict text={verdict as string} tone={tone as 'good'} />
          <Scale5
            value={bmi}
            min={14}
            max={40}
            bands={[
              { to: 18.5, label: '<18.5', cls: 'bg-sky' },
              { to: 25, label: '18.5–25', cls: 'bg-primary' },
              { to: 30, label: '25–30', cls: 'bg-coin' },
              { to: 40, label: '30+', cls: 'bg-accent' },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Result label="HEALTHY FROM" value={lo} decimals={1} suffix=" kg" />
            <Result label="HEALTHY TO" value={hi} decimals={1} suffix=" kg" />
          </div>
        </>
      }
    />
  );
};

const BMR: React.FC = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState(20);
  const [h, setH] = useState(172);
  const [w, setW] = useState(68);
  const [k, setK] = useState(1.55);
  const bmr = mifflin(sex, w, h, age);
  return (
    <Panel
      inputs={
        <>
          <SexPick id="bmr-sex" sex={sex} setSex={setSex} />
          <Slider label="Age" value={age} min={15} max={80} unit="yrs" onChange={setAge} />
          <Slider label="Height" value={h} min={120} max={220} unit="cm" onChange={setH} />
          <Slider label="Weight" value={w} min={30} max={180} step={0.5} unit="kg" onChange={setW} />
          <ActivityPick id="bmr-act" k={k} setK={setK} />
        </>
      }
      results={
        <>
          <Result big label="BMR · KCAL / DAY AT REST" value={bmr} />
          <Result label="DAILY BURN (TDEE)" value={bmr * k} suffix=" kcal" />
          <div className="grid grid-cols-3 gap-3">
            <Result label="LOSE 0.5KG/WK" value={bmr * k - 500} />
            <Result label="MAINTAIN" value={bmr * k} />
            <Result label="GAIN 0.25KG/WK" value={bmr * k + 275} />
          </div>
          <Note>Mifflin–St Jeor equation × activity factor.</Note>
        </>
      }
    />
  );
};

const PROTEIN_LEVELS = [
  { v: 'sed', label: 'Sedentary', lo: 0.8, hi: 1.0 },
  { v: 'mod', label: 'Moderate', lo: 1.2, hi: 1.6 },
  { v: 'int', label: 'Intense', lo: 1.6, hi: 2.0 },
];

const Protein: React.FC = () => {
  const [w, setW] = useState(68);
  const [lvl, setLvl] = useState('mod');
  const L = PROTEIN_LEVELS.find((p) => p.v === lvl)!;
  const mid = ((L.lo + L.hi) / 2) * w;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Weight" value={w} min={30} max={180} step={0.5} unit="kg" onChange={setW} />
          <span className="text-sm text-ink-3 block mb-2">Activity level</span>
          <Segmented id="prot" value={lvl} onChange={setLvl} options={PROTEIN_LEVELS.map((p) => ({ v: p.v, label: p.label }))} />
          <p className="text-xs text-ink-4">
            {L.lo}–{L.hi} g of protein per kg of body weight
          </p>
        </>
      }
      results={
        <>
          <Result big label="DAILY PROTEIN TARGET" value={mid} suffix=" g" />
          <div className="grid grid-cols-2 gap-3">
            <Result label="LOW END" value={L.lo * w} suffix=" g" />
            <Result label="HIGH END" value={L.hi * w} suffix=" g" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Result label="PER MEAL (4 MEALS)" value={mid / 4} suffix=" g" />
            <Result label="FROM PROTEIN" value={mid * 4} suffix=" kcal" />
          </div>
          <Note>Healthy adults need roughly 0.8–2 g per kg depending on training.</Note>
        </>
      }
    />
  );
};

const WHR: React.FC = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [waist, setWaist] = useState(80);
  const [hip, setHip] = useState(95);
  const r = waist / hip;
  const [lowCut, highCut] = sex === 'male' ? [0.9, 1.0] : [0.8, 0.85];
  const [v, tone] = r < lowCut ? ['Low risk', 'good'] : r < highCut ? ['Moderate risk', 'warn'] : ['High risk', 'bad'];
  return (
    <Panel
      inputs={
        <>
          <SexPick id="whr-sex" sex={sex} setSex={setSex} />
          <Slider label="Waist (at navel)" value={waist} min={50} max={160} unit="cm" onChange={setWaist} />
          <Slider label="Hip (widest point)" value={hip} min={60} max={170} unit="cm" onChange={setHip} />
        </>
      }
      results={
        <>
          <Result big label="WAIST-TO-HIP RATIO" value={r} decimals={2} />
          <Verdict text={v as string} tone={tone as 'good'} />
          <Scale5
            value={r}
            min={0.6}
            max={1.2}
            bands={[
              { to: lowCut, label: `<${lowCut}`, cls: 'bg-primary' },
              { to: highCut, label: `${lowCut}–${highCut}`, cls: 'bg-coin' },
              { to: 1.2, label: `${highCut}+`, cls: 'bg-accent' },
            ]}
          />
          <Note>Higher ratios mean more fat stored around the waist, which is linked to heart disease and type 2 diabetes risk.</Note>
        </>
      }
    />
  );
};

const Bench: React.FC = () => {
  const [kg, setKg] = useState(60);
  const [reps, setReps] = useState(6);
  const orm = reps === 1 ? kg : kg * (1 + reps / 30);
  const table = [100, 95, 90, 85, 80, 75, 70, 65, 60];
  const repsAt = [1, 2, 4, 6, 8, 10, 12, 16, 20];
  return (
    <Panel
      inputs={
        <>
          <Slider label="Weight lifted" value={kg} min={10} max={250} step={2.5} unit="kg" onChange={setKg} />
          <Slider label="Reps to fatigue" value={reps} min={1} max={15} unit="reps" onChange={setReps} />
          <Note>Lift a challenging weight until you can&apos;t do another clean rep, then enter it here.</Note>
        </>
      }
      results={
        <>
          <Result big label="ESTIMATED 1 REP MAX" value={orm} decimals={1} suffix=" kg" />
          <div className="rounded-2xl bg-base border border-line/12 p-4">
            <div className="font-pixel text-[10px] text-ink-4 mb-3">TRAINING LOADS</div>
            <div className="space-y-1.5">
              {table.map((p, i) => (
                <div key={p} className="flex items-center gap-3 text-xs">
                  <span className="w-10 text-ink-3 tabular-nums">{p}%</span>
                  <div className="flex-1 h-2.5 rounded-full bg-raised overflow-hidden">
                    <motion.div className="h-full rounded-full bg-primary" animate={{ width: `${p}%` }} transition={{ delay: i * 0.03 }} />
                  </div>
                  <span className="w-16 text-right font-bold text-ink tabular-nums">{((orm * p) / 100).toFixed(1)} kg</span>
                  <span className="w-12 text-right text-ink-4">×{repsAt[i]}</span>
                </div>
              ))}
            </div>
          </div>
          <Note>Epley formula: weight × (1 + reps ÷ 30). Most accurate under 10 reps.</Note>
        </>
      }
    />
  );
};

const Intensity: React.FC = () => {
  const [age, setAge] = useState(20);
  const [rest, setRest] = useState(70);
  const [cur, setCur] = useState(140);
  const max = 220 - age;
  const reserve = max - rest;
  const pct = Math.max(0, Math.min(100, ((cur - rest) / reserve) * 100));
  const zone = (lo: number, hi: number) => `${Math.round(rest + reserve * lo)}–${Math.round(rest + reserve * hi)}`;
  const label = pct < 50 ? 'Very light' : pct < 70 ? 'Moderate' : pct < 85 ? 'Vigorous' : 'Maximum';
  const zones = [
    { n: 'Warm-up', r: [0.5, 0.6], cls: 'bg-sky' },
    { n: 'Fat burn', r: [0.6, 0.7], cls: 'bg-coin' },
    { n: 'Cardio', r: [0.7, 0.8], cls: 'bg-primary' },
    { n: 'Hard', r: [0.8, 0.9], cls: 'bg-accent' },
    { n: 'Max', r: [0.9, 1.0], cls: 'bg-grape' },
  ];
  return (
    <Panel
      inputs={
        <>
          <Slider label="Age" value={age} min={15} max={80} unit="yrs" onChange={setAge} />
          <Slider label="Resting heart rate" value={rest} min={40} max={100} unit="bpm" onChange={setRest} />
          <Slider label="Heart rate during workout" value={cur} min={60} max={210} unit="bpm" onChange={setCur} />
        </>
      }
      results={
        <>
          <div className="flex items-center gap-5">
            <Ring
              pct={pct}
              size={130}
              label={
                <div className="text-center">
                  <div className="font-display text-2xl text-ink">
                    <AnimatedNumber value={pct} suffix="%" />
                  </div>
                  <div className="font-pixel text-[9px] text-ink-4">EFFORT</div>
                </div>
              }
            />
            <div>
              <Verdict text={label} tone={pct < 70 ? 'good' : pct < 85 ? 'warn' : 'bad'} />
              <p className="text-sm text-ink-3 mt-3">
                Max heart rate <b className="text-ink">{max} bpm</b>
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {zones.map((z) => (
              <div key={z.n} className="flex items-center gap-3 rounded-xl bg-base border border-line/10 px-3 py-2">
                <span className={`w-3 h-3 rounded-full ${z.cls}`} />
                <span className="text-sm text-ink-2 flex-1">{z.n}</span>
                <span className="font-mono text-sm font-bold text-ink tabular-nums">{zone(z.r[0], z.r[1])} bpm</span>
              </div>
            ))}
          </div>
          <Note>Karvonen method (heart-rate reserve). Moderate = 50–70%, vigorous = 70–85%.</Note>
        </>
      }
    />
  );
};

const Gain: React.FC = () => {
  const [sex, setSex] = useState<Sex>('male');
  const [age, setAge] = useState(20);
  const [h, setH] = useState(172);
  const [w, setW] = useState(58);
  const [target, setTarget] = useState(65);
  const [k, setK] = useState(1.55);
  const [pace, setPace] = useState(0.25);
  const tdee = mifflin(sex, w, h, age) * k;
  const surplus = (pace * 7700) / 7;
  const diff = Math.max(0, target - w);
  const weeks = diff / pace;
  return (
    <Panel
      inputs={
        <>
          <SexPick id="gain-sex" sex={sex} setSex={setSex} />
          <Slider label="Age" value={age} min={15} max={80} unit="yrs" onChange={setAge} />
          <Slider label="Height" value={h} min={120} max={220} unit="cm" onChange={setH} />
          <Slider label="Current weight" value={w} min={30} max={150} step={0.5} unit="kg" onChange={setW} />
          <Slider label="Target weight" value={target} min={30} max={160} step={0.5} unit="kg" onChange={setTarget} />
          <ActivityPick id="gain-act" k={k} setK={setK} />
          <span className="text-sm text-ink-3 block mb-2">Pace</span>
          <Segmented
            id="gain-pace"
            value={pace}
            onChange={setPace}
            options={[
              { v: 0.25, label: '0.25 kg/wk' },
              { v: 0.5, label: '0.5 kg/wk' },
              { v: 0.75, label: '0.75 kg/wk' },
            ]}
          />
        </>
      }
      results={
        <>
          <Result big label="EAT THIS MUCH DAILY" value={diff ? tdee + surplus : tdee} suffix=" kcal" />
          <div className="grid grid-cols-2 gap-3">
            <Result label="MAINTENANCE" value={tdee} suffix=" kcal" />
            <Result label="DAILY SURPLUS" value={diff ? surplus : 0} prefix="+" suffix=" kcal" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Result label="TO GAIN" value={diff} decimals={1} suffix=" kg" />
            <Result label="TIME NEEDED" value={Math.ceil(weeks)} suffix=" wks" />
          </div>
          <Note>About 7,700 kcal ≈ 1 kg of body weight. Slower gains keep more of it as muscle. Pair with ~1.6–2 g/kg protein.</Note>
        </>
      }
    />
  );
};

const Creatine: React.FC = () => {
  const [w, setW] = useState(68);
  const [mode, setMode] = useState('maint');
  const dose = mode === 'gen' ? 3 : mode === 'maint' ? Math.min(5, Math.max(3, 0.03 * w)) : 0.3 * w;
  return (
    <Panel
      inputs={
        <>
          <Slider label="Weight" value={w} min={30} max={150} step={0.5} unit="kg" onChange={setW} />
          <span className="text-sm text-ink-3 block mb-2">Purpose of use</span>
          <Segmented
            id="creat"
            value={mode}
            onChange={setMode}
            options={[
              { v: 'gen', label: 'General' },
              { v: 'maint', label: 'Maintenance' },
              { v: 'load', label: 'Loading' },
            ]}
          />
          <p className="text-xs text-ink-4">
            {mode === 'gen'
              ? 'General use without training.'
              : mode === 'maint'
                ? 'Daily dose alongside training.'
                : 'Short loading phase with training, for 5–7 days.'}
          </p>
        </>
      }
      results={
        <>
          <Result big label="CREATINE PER DAY" value={dose} decimals={1} suffix=" g" />
          {mode === 'load' && (
            <div className="grid grid-cols-2 gap-3">
              <Result label="SPLIT INTO 4 DOSES" value={dose / 4} decimals={1} suffix=" g each" />
              <Result label="THEN MAINTAIN AT" value={Math.min(5, Math.max(3, 0.03 * w))} decimals={1} suffix=" g/day" />
            </div>
          )}
          <Note>Common sports-nutrition guidance: loading ≈ 0.3 g/kg/day for 5–7 days, maintenance ≈ 3–5 g/day. Drink plenty of water. Check with a doctor if you have kidney issues.</Note>
        </>
      }
    />
  );
};

const Note: React.FC<{ children: React.ReactNode }> = ({ children }) => <p className="text-xs text-ink-4 leading-relaxed">{children}</p>;

const Panel: React.FC<{ inputs: React.ReactNode; results: React.ReactNode }> = ({ inputs, results }) => (
  <div className="grid lg:grid-cols-2 gap-6">
    <div className="rounded-3xl bg-surface border border-line/12 p-6 sm:p-7">{inputs}</div>
    <div className="rounded-3xl bg-surface border border-line/12 p-6 sm:p-7 space-y-4">{results}</div>
  </div>
);

const VIEWS: Record<CalcId, React.FC> = {
  bmi: BMI,
  bmr: BMR,
  protein: Protein,
  whr: WHR,
  bench: Bench,
  intensity: Intensity,
  gain: Gain,
  creatine: Creatine,
  timer: RestTimer,
};

export const Calculators: React.FC<{ active?: string; go: (p: string) => void }> = ({ active, go }) => {
  const current = useMemo(() => CALCS.find((c) => c.id === active), [active]);
  const View = current ? VIEWS[current.id] : null;

  return (
    <div className="py-4">
      <>
        {!current ? (
          <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Reveal>
              <p className="font-pixel text-xs text-t-primary tracking-widest mb-3">
                <Activity className="w-4 h-4 inline -mt-1 mr-1" /> TOOLS
              </p>
              <h1 className="font-hud font-black text-4xl sm:text-5xl text-t-primary neon mb-3">FITNESS TOOLS</h1>
              <p className="text-ink-3 mb-10 max-w-2xl">Quick reference numbers for your training and nutrition. Drag the sliders and the results update live.</p>
            </Reveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {CALCS.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.05}>
                  <TiltCard onClick={() => go(`/calculators/${c.id}`)} className="group h-full rounded-3xl bg-surface border border-line/12 p-5 sm:p-6 hover:border-primary/60 sticker-card">
                    <motion.div whileHover={{ rotate: -10, scale: 1.1 }} className="w-12 h-12 rounded-2xl bg-primary text-onbright flex items-center justify-center mb-4">
                      {c.icon}
                    </motion.div>
                    <h3 className="font-display text-lg sm:text-xl text-ink mb-1">{c.name}</h3>
                    <p className="text-xs sm:text-sm text-ink-3">{c.blurb}</p>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
            <p className="text-xs text-ink-5 mt-10">These are general estimates from standard formulas, not medical advice.</p>
          </motion.div>
        ) : (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <button type="button" onClick={() => go('/calculators')} className="inline-flex items-center gap-2 text-sm text-ink-3 hover:text-ink mb-5 cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> All calculators
            </button>
            <div className="flex items-center gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-primary text-onbright flex items-center justify-center">{current.icon}</div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl text-ink">{current.id === 'timer' ? current.name : `${current.name} calculator`}</h1>
                <p className="text-sm text-ink-3">{current.blurb}</p>
              </div>
            </div>
            {/* quick switcher */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-5 -mx-1 px-1">
              {CALCS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => go(`/calculators/${c.id}`)}
                  className={`relative shrink-0 px-3.5 py-2 rounded-full text-xs font-semibold cursor-pointer ${
                    c.id === current.id ? 'text-onbright' : 'text-ink-3 bg-surface border border-line/12 hover:text-ink'
                  }`}
                >
                  {c.id === current.id && <motion.span layoutId="calc-pill" className="absolute inset-0 rounded-full bg-primary" />}
                  <span className="relative">{c.name}</span>
                </button>
              ))}
            </div>
            {View && <View />}
            <p className="text-xs text-ink-5 mt-8">General estimates from standard formulas, not medical advice.</p>
          </motion.div>
        )}
      </>
    </div>
  );
};
