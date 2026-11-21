import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  Check,
  Flame,
  Gift,
  Lightbulb,
  Megaphone,
  Plus,
  Search,
  Send,
  Settings,
  Swords,
  Users,
  X,
} from 'lucide-react';
import {
  BroadcastAnnouncement,
  DropOffMember,
  GymChallenge,
  GymMemberRecord,
  HourlyCrowdPoint,
  OwnerTab,
  RewardTier,
} from '../types/gymloop';

interface OwnerDashboardProps {
  peopleInside: number;
  capacity: number;
  onUpdateCapacity: (nextCap: number) => void;
  hourlyCrowd: HourlyCrowdPoint[];
  dropOffAlerts: DropOffMember[];
  onNudgeMember: (id: string) => void;
  memberRoster: GymMemberRecord[];
  challenges: GymChallenge[];
  onCreateChallenge: (title: string, target: number, unit: string, xpBonus: number, windowLabel: string) => void;
  onToggleChallenge: (id: string) => void;
  rewards: RewardTier[];
  broadcasts: BroadcastAnnouncement[];
  onSendBroadcast: (title: string, message: string, audience: string) => void;
}

const SIDEBAR_ITEMS: { id: OwnerTab; label: string; icon: React.ReactNode }[] = [
  { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'members', label: 'Members', icon: <Users className="w-4 h-4" /> },
  { id: 'crowd', label: 'Crowd', icon: <Flame className="w-4 h-4" /> },
  { id: 'challenges', label: 'Challenges', icon: <Swords className="w-4 h-4" /> },
  { id: 'rewards', label: 'Rewards', icon: <Gift className="w-4 h-4" /> },
  { id: 'broadcast', label: 'Broadcast', icon: <Megaphone className="w-4 h-4" /> },
  { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
];

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  peopleInside,
  capacity,
  onUpdateCapacity,
  hourlyCrowd,
  dropOffAlerts,
  onNudgeMember,
  memberRoster,
  challenges,
  onCreateChallenge,
  onToggleChallenge,
  rewards,
  broadcasts,
  onSendBroadcast,
}) => {
  const [activeTab, setActiveTab] = useState<OwnerTab>('overview');
  const [hoveredHour, setHoveredHour] = useState<HourlyCrowdPoint | null>(null);
  const [showChallengeModal, setShowChallengeModal] = useState(false);

  // New Challenge Form state
  const [chTitle, setChTitle] = useState('');
  const [chTarget, setChTarget] = useState('500');
  const [chUnit, setChUnit] = useState('reps');
  const [chXp, setChXp] = useState('80');
  const [chWindow, setChWindow] = useState('This week');

  // Members Filter state
  const [memberQuery, setMemberQuery] = useState('');
  const [memberFilter, setMemberFilter] = useState<'All' | 'On Streak' | 'At Risk' | 'Inside Now'>('All');

  // Broadcast Form state
  const [bcTitle, setBcTitle] = useState('Off-peak 2x XP starts now');
  const [bcMessage, setBcMessage] = useState(
    'Benches are 80% open from 1–4 PM. Clock in via QR for double XP!'
  );
  const [bcAudience, setBcAudience] = useState('All 248 active members');
  const [bcSentFeedback, setBcSentFeedback] = useState(false);

  // Settings local state
  const [capInput, setCapInput] = useState(String(capacity));
  const [settingsSaved, setSettingsSaved] = useState(false);

  const occupancyPct = Math.min(100, Math.round((peopleInside / capacity) * 100));
  const pendingRiskCount = Math.max(
    0,
    11 - dropOffAlerts.filter((d) => d.nudged).length
  );
  const maxBar = Math.max(...hourlyCrowd.map((h) => h.count), 60);

  const offPeakChallenge = challenges.find((c) => c.title.toLowerCase().includes('off-peak'));

  const handleSubmitChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chTitle.trim()) return;
    onCreateChallenge(
      chTitle.trim(),
      Number(chTarget) || 500,
      chUnit.trim() || 'reps',
      Number(chXp) || 50,
      chWindow.trim() || 'This week'
    );
    setChTitle('');
    setShowChallengeModal(false);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bcTitle.trim() || !bcMessage.trim()) return;
    onSendBroadcast(bcTitle.trim(), bcMessage.trim(), bcAudience);
    setBcSentFeedback(true);
    window.setTimeout(() => setBcSentFeedback(false), 2500);
  };

  const filteredMembers = memberRoster.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(memberQuery.toLowerCase());
    const matchesStatus = memberFilter === 'All' || m.status === memberFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-3xl bg-base border border-line/12 overflow-hidden sticker-card grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
      {/* Sidebar */}
      <aside className="lg:col-span-3 xl:col-span-2 bg-base border-b lg:border-b-0 lg:border-r border-line/10 p-5 flex flex-col justify-between gap-6">
        <div>
          <div className="mb-6">
            <div className="font-display text-xl tracking-tight text-t-primary text-arcade-shadow-sm">
              GYMLOOP
            </div>
            <div className="font-pixel text-[9px] text-ink-4 tracking-wider mt-1">
              OWNER · IRON DEN
            </div>
          </div>

          <nav className="flex lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {SIDEBAR_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`min-h-[42px] px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-primary text-onbright shadow-[0_0_20px_rgba(255,214,0,0.22)]'
                      : 'text-ink-3 hover:bg-line/6 hover:text-ink'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Plan Card */}
        <div className="hidden lg:block rounded-2xl bg-surface border border-coin/40 p-4">
          <div className="font-pixel text-[9px] text-t-coin tracking-wider mb-1">
            PLAN · GROWTH
          </div>
          <div className="text-xs font-semibold text-ink tabular-nums mb-2">
            248 / 300 members
          </div>
          <div className="h-1.5 rounded-full bg-void overflow-hidden">
            <div className="h-full bg-coin rounded-full" style={{ width: '82%' }} />
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="lg:col-span-9 xl:col-span-10 p-5 sm:p-7 space-y-6">
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-ink-4 tabular-nums mb-1">Sat, 21 Nov · 2:05 PM</p>
            <h1 className="font-display text-2xl sm:text-3xl text-ink tracking-tight">
              Good afternoon, boss 👋
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setShowChallengeModal(true)}
            className="min-h-[44px] px-5 py-2.5 rounded-full bg-primary hover:bg-primary-hi text-onbright text-xs font-bold flex items-center gap-1.5 sticker-green transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New challenge</span>
          </button>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div className="rounded-2xl bg-surface border border-line/10 p-5">
                <span className="font-pixel text-[9px] text-ink-4 tracking-wider block mb-2">
                  INSIDE NOW
                </span>
                <div className="font-display text-4xl text-t-primary tabular-nums mb-1.5">
                  {peopleInside}
                </div>
                <p className="text-xs text-ink-3 tabular-nums">
                  {occupancyPct}% capacity · {occupancyPct < 45 ? 'Chill' : occupancyPct < 75 ? 'Busy' : 'Packed'}
                </p>
              </div>

              <div className="rounded-2xl bg-surface border border-line/10 p-5">
                <span className="font-pixel text-[9px] text-ink-4 tracking-wider block mb-2">
                  APP ADOPTION
                </span>
                <div className="font-display text-4xl text-t-sky tabular-nums mb-1.5">
                  82%
                </div>
                <p className="text-xs text-t-primary font-medium">▲ goal 80% hit</p>
              </div>

              <div className="rounded-2xl bg-surface border border-line/10 p-5">
                <span className="font-pixel text-[9px] text-ink-4 tracking-wider block mb-2">
                  ON A STREAK
                </span>
                <div className="font-display text-4xl text-t-coin tabular-nums mb-1.5">
                  164
                </div>
                <p className="text-xs text-ink-3 tabular-nums">66% of members</p>
              </div>

              <div className="rounded-2xl bg-raised border border-accent p-5">
                <span className="font-pixel text-[9px] text-t-accent tracking-wider block mb-2">
                  DROP-OFF RISK
                </span>
                <div className="font-display text-4xl text-t-accent tabular-nums mb-1.5">
                  {pendingRiskCount}
                </div>
                <p className="text-xs text-ink-3">no visit in 10+ days</p>
              </div>
            </div>

            {/* Chart + Drop-off Alerts */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-stretch">
              {/* Busiest Hours Chart */}
              <div className="xl:col-span-7 rounded-2xl bg-surface border border-line/10 p-5 sm:p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-sm font-bold text-ink">Busiest hours · this week</h2>
                    {hoveredHour && (
                      <p className="text-xs text-t-sky tabular-nums mt-0.5">
                        {hoveredHour.hourLabel}: avg {hoveredHour.count} members ({hoveredHour.benchFreePct}% benches open)
                      </p>
                    )}
                  </div>
                  <span className="px-3 py-1 rounded-full bg-void border border-line/10 text-[11px] font-medium text-ink-3">
                    Avg headcount
                  </span>
                </div>

                <div className="h-60 flex items-end gap-1.5 sm:gap-2 pt-4 pb-2">
                  {hourlyCrowd.map((bar) => {
                    const hPct = Math.max(12, Math.round((bar.count / maxBar) * 100));
                    const color =
                      bar.tier === 'packed'
                        ? 'var(--color-accent)'
                        : bar.tier === 'moderate'
                          ? 'var(--color-coin)'
                          : 'var(--color-primary)';

                    return (
                      <button
                        key={bar.hourLabel}
                        type="button"
                        onMouseEnter={() => setHoveredHour(bar)}
                        onClick={() => setHoveredHour(bar)}
                        className="flex-1 h-full flex flex-col items-center justify-end gap-1.5 group cursor-pointer"
                      >
                        <div
                          className="w-full rounded-t-lg transition-all duration-200 opacity-90 group-hover:opacity-100 group-hover:ring-1 group-hover:ring-white"
                          style={{ height: `${hPct}%`, backgroundColor: color }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between font-mono text-[10px] text-ink-4 pt-2 border-t border-line/8">
                  <span>6 AM</span>
                  <span>9 AM</span>
                  <span>12 PM</span>
                  <span>3 PM</span>
                  <span>6 PM</span>
                  <span>9 PM</span>
                </div>

                {/* Actionable Recommendation */}
                <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-3">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-t-coin shrink-0" />
                    <span>
                      Run a <strong className="text-t-sky">&ldquo;Off-peak 2x XP&rdquo;</strong>{' '}
                      challenge 1–4 PM to shift ~15% of the evening rush.
                    </span>
                  </div>
                  {offPeakChallenge && (
                    <button
                      type="button"
                      onClick={() => onToggleChallenge(offPeakChallenge.id)}
                      className={`min-h-[34px] px-3 py-1 rounded-lg font-bold text-[11px] transition-colors cursor-pointer ${
                        offPeakChallenge.active
                          ? 'bg-primary/20 text-t-primary border border-primary/50'
                          : 'bg-sky text-onbright hover:bg-sky-hi'
                      }`}
                    >
                      {offPeakChallenge.active ? 'Active in App ✓' : 'Launch Challenge'}
                    </button>
                  )}
                </div>
              </div>

              {/* Drop-off Alerts */}
              <div className="xl:col-span-5 rounded-2xl bg-surface border border-line/10 p-5 sm:p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-t-coin" />
                      <h2 className="text-sm font-bold text-ink">Drop-off alerts</h2>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-accent text-white text-[11px] font-bold tabular-nums">
                      {pendingRiskCount}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dropOffAlerts.map((member) => (
                      <div
                        key={member.id}
                        className="rounded-xl bg-base border border-line/8 px-3.5 py-3 flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-ink truncate">{member.name}</p>
                          <p className="text-xs text-ink-4 truncate">{member.detail}</p>
                        </div>

                        <button
                          type="button"
                          disabled={member.nudged}
                          onClick={() => onNudgeMember(member.id)}
                          className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                            member.nudged
                              ? 'bg-line/10 text-t-primary cursor-default'
                              : 'bg-primary hover:bg-primary-hi text-onbright cursor-pointer'
                          }`}
                        >
                          {member.nudged ? 'Nudged ✓' : 'Nudge'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-medium text-t-coin mt-4 pt-3 border-t border-line/8">
                  Keeping 2 members/month pays for GymLoop.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="rounded-2xl bg-surface border border-line/10 p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[220px] max-w-sm">
                <Search className="w-4 h-4 text-ink-4 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={memberQuery}
                  onChange={(e) => setMemberQuery(e.target.value)}
                  placeholder="Search Iron Den members..."
                  className="w-full min-h-[42px] pl-10 pr-4 rounded-xl bg-base border border-line/12 text-xs text-ink placeholder:text-ink-5 focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center gap-1 p-1 rounded-xl bg-base border border-line/10">
                {(['All', 'On Streak', 'At Risk', 'Inside Now'] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setMemberFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                      memberFilter === status
                        ? 'bg-primary text-onbright'
                        : 'text-ink-3 hover:text-ink'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-line/10 text-ink-4 font-pixel text-[9px]">
                    <th className="py-3 pr-4">MEMBER</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">STREAK</th>
                    <th className="py-3 px-4 text-right">THIS WK</th>
                    <th className="py-3 px-4 text-right">POINTS</th>
                    <th className="py-3 pl-4 text-right">LAST VISIT</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/6">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-line/[0.03]">
                      <td className="py-3 pr-4 font-bold text-ink">
                        {m.name}{' '}
                        <span className="text-[11px] font-normal text-ink-4">LVL {m.level}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            m.status === 'At Risk'
                              ? 'text-t-accent'
                              : m.status === 'Inside Now'
                                ? 'text-t-primary'
                                : 'text-t-sky'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-ink">
                        {m.streakWeeks} wks
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-ink-3">
                        {m.thisWeekCount}/{m.weeklyGoal}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-t-coin font-semibold">
                        {m.points}
                      </td>
                      <td className="py-3 pl-4 text-right text-ink-4">{m.lastVisit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CROWD TAB */}
        {activeTab === 'crowd' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-surface border border-line/10 p-6 space-y-4">
              <span className="font-pixel text-[10px] text-t-primary">REAL-TIME FLOOR LOAD</span>
              <div className="font-display text-5xl text-ink tabular-nums">
                {peopleInside} <span className="text-xl text-ink-4">/ {capacity}</span>
              </div>
              <p className="text-xs text-ink-3">
                Current occupancy is {occupancyPct}%. Peak forecast hits 60 members at 5:00 PM.
              </p>
              <div className="h-3 rounded-full bg-base overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-coin to-accent"
                  style={{ width: `${occupancyPct}%` }}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-surface border border-line/10 p-6 space-y-3">
              <span className="font-pixel text-[10px] text-t-sky">EVENING RUSH RELIEF</span>
              <h3 className="font-display text-xl text-ink">Shift 15% to 1–4 PM</h3>
              <p className="text-xs text-ink-3 leading-relaxed">
                Off-peak 2x XP challenges incentivize students with afternoon free slots to scan in
                before 4 PM, freeing squat racks during the 6 PM rush.
              </p>
              {offPeakChallenge && (
                <button
                  type="button"
                  onClick={() => onToggleChallenge(offPeakChallenge.id)}
                  className="min-h-[42px] px-4 py-2 rounded-xl bg-sky text-onbright text-xs font-bold cursor-pointer"
                >
                  {offPeakChallenge.active ? 'Pause Off-Peak 2x XP' : 'Activate Off-Peak 2x XP'}
                </button>
              )}
            </div>
          </div>
        )}

        {/* CHALLENGES TAB */}
        {activeTab === 'challenges' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((ch) => {
                const pct = Math.min(100, Math.round((ch.current / ch.target) * 100));
                return (
                  <div
                    key={ch.id}
                    className="rounded-2xl bg-surface border border-line/10 p-5 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-ink">{ch.title}</h3>
                        <p className="text-xs text-ink-4">
                          {ch.windowLabel} · +{ch.xpBonus} XP
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onToggleChallenge(ch.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold cursor-pointer ${
                          ch.active
                            ? 'bg-primary text-onbright'
                            : 'bg-line/10 text-ink-3'
                        }`}
                      >
                        {ch.active ? 'Active' : 'Paused'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-ink-3 tabular-nums">
                      <span>
                        {ch.current} / {ch.target} {ch.unit}
                      </span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-base overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* REWARDS TAB */}
        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((rw) => (
              <div
                key={rw.id}
                className="rounded-2xl bg-surface border border-line/10 p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <span className="text-3xl">{rw.icon}</span>
                  <div>
                    <h3 className="text-base font-bold text-ink">{rw.name}</h3>
                    <p className="text-xs text-t-sky font-semibold">{rw.requirementLabel}</p>
                    <p className="text-xs text-ink-4 mt-1">{rw.description}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-t-primary tabular-nums shrink-0">
                  {rw.targetWeeks === 5 ? '42 claimed' : rw.targetWeeks === 20 ? '14 in stock' : 'Pre-order'}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* BROADCAST TAB */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <form
              onSubmit={handleBroadcastSubmit}
              className="lg:col-span-7 rounded-2xl bg-surface border border-line/10 p-6 space-y-4"
            >
              <h2 className="font-display text-lg text-ink">Send Push Broadcast</h2>
              <p className="text-xs text-ink-4">
                Appears live inside the Member App banner at Iron Den.
              </p>

              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1.5">
                  Headline
                </label>
                <input
                  type="text"
                  value={bcTitle}
                  onChange={(e) => setBcTitle(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-base border border-line/15 text-sm text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={3}
                  value={bcMessage}
                  onChange={(e) => setBcMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-base border border-line/15 text-sm text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1.5">
                  Audience
                </label>
                <select
                  value={bcAudience}
                  onChange={(e) => setBcAudience(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-base border border-line/15 text-sm text-ink focus:outline-none focus:border-primary"
                >
                  <option>All 248 active members</option>
                  <option>Drop-off risk members (11)</option>
                  <option>Evening rush regulars (5–8 PM)</option>
                </select>
              </div>

              <button
                type="submit"
                className="min-h-[46px] px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hi text-onbright text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send to Member App</span>
              </button>

              {bcSentFeedback && (
                <p className="text-xs font-semibold text-t-primary flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> Broadcast delivered to Member App!
                </p>
              )}
            </form>

            <div className="lg:col-span-5 rounded-2xl bg-surface border border-line/10 p-6 space-y-3">
              <h3 className="font-pixel text-[10px] text-ink-4 tracking-wider">
                SENT HISTORY
              </h3>
              {broadcasts.map((b) => (
                <div key={b.id} className="rounded-xl bg-base border border-line/8 p-3.5">
                  <div className="flex items-center justify-between text-[11px] text-t-sky mb-1">
                    <span className="font-bold">{b.title}</span>
                    <span className="text-ink-4">{b.sentAt}</span>
                  </div>
                  <p className="text-xs text-ink-3">{b.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-lg rounded-2xl bg-surface border border-line/10 p-6 space-y-4">
            <h2 className="font-display text-lg text-ink">Iron Den Configuration</h2>
            <div>
              <label className="block text-xs font-semibold text-ink-3 mb-1.5">
                Gym Floor Capacity (used for Chill/Busy/Packed ring)
              </label>
              <input
                type="number"
                min={20}
                max={300}
                value={capInput}
                onChange={(e) => setCapInput(e.target.value)}
                className="w-full min-h-[44px] px-3.5 rounded-xl bg-base border border-line/15 text-sm text-ink tabular-nums focus:outline-none focus:border-primary"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const parsed = Number(capInput);
                if (parsed >= 20 && parsed <= 300) {
                  onUpdateCapacity(parsed);
                  setSettingsSaved(true);
                  window.setTimeout(() => setSettingsSaved(false), 2000);
                }
              }}
              className="min-h-[44px] px-5 py-2.5 rounded-xl bg-primary text-onbright text-xs font-bold cursor-pointer"
            >
              Save Capacity
            </button>
            {settingsSaved && (
              <p className="text-xs text-t-primary font-semibold">
                Capacity updated across Member &amp; Boss views.
              </p>
            )}
          </div>
        )}
      </main>

      {/* New Challenge Modal */}
      {showChallengeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-surface border border-line/15 p-6 sticker-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl text-ink">Launch Gym Challenge</h2>
              <button
                type="button"
                onClick={() => setShowChallengeModal(false)}
                aria-label="Close modal"
                className="w-9 h-9 rounded-xl bg-line/8 flex items-center justify-center text-ink-3 hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitChallenge} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-3 mb-1">
                  Challenge Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 500 pull-ups this week"
                  value={chTitle}
                  onChange={(e) => setChTitle(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 rounded-xl bg-void border border-line/15 text-sm text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-3 mb-1">
                    Target
                  </label>
                  <input
                    type="number"
                    value={chTarget}
                    onChange={(e) => setChTarget(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-void border border-line/15 text-sm text-ink tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-3 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={chUnit}
                    onChange={(e) => setChUnit(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-void border border-line/15 text-sm text-ink"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-ink-3 mb-1">
                    XP Bonus
                  </label>
                  <input
                    type="number"
                    value={chXp}
                    onChange={(e) => setChXp(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-void border border-line/15 text-sm text-ink tabular-nums"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ink-3 mb-1">
                    Window
                  </label>
                  <input
                    type="text"
                    value={chWindow}
                    onChange={(e) => setChWindow(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 rounded-xl bg-void border border-line/15 text-sm text-ink"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] rounded-2xl bg-primary hover:bg-primary-hi text-onbright font-display text-sm tracking-wide cursor-pointer"
              >
                PUBLISH TO IRON DEN →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
