import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Calculator, Camera, Gift, Home, Menu, Moon, Sun, Trophy, Users, X } from 'lucide-react';
import { useHashRoute } from './lib/router';
import { useTheme } from './lib/theme';
import { HomeLanding } from './components/landing/HomeLanding';
import { MembersLanding } from './components/landing/MembersLanding';
import { OwnersLanding } from './components/landing/OwnersLanding';
import { Calculators } from './components/Calculators';
import {
  INITIAL_BROADCASTS,
  INITIAL_CHALLENGES,
  INITIAL_DROP_OFF_ALERTS,
  INITIAL_EXERCISES,
  INITIAL_GYM_ZONES,
  INITIAL_HOURLY_CROWD,
  INITIAL_LEADERBOARD,
  INITIAL_MEMBER_ROSTER,
  INITIAL_REWARD_TRACK,
} from './data/initialData';
import {
  AppMode,
  BroadcastAnnouncement,
  CheckInHistoryItem,
  DropOffMember,
  FocusGoal,
  GymChallenge,
  GymMemberRecord,
  LeaderboardMember,
  MemberTab,
  OnboardingStep,
  RewardTier,
  WorkoutExercise,
} from './types/gymloop';
import { MemberOnboarding } from './components/MemberOnboarding';
import { MemberHome } from './components/MemberHome';
import { WorkoutQuest } from './components/WorkoutQuest';
import { LiveCrowd } from './components/LiveCrowd';
import { QrCheckIn } from './components/QrCheckIn';
import { LeaderboardView } from './components/LeaderboardView';
import { LootAndProfile } from './components/LootAndProfile';
import { OwnerDashboard } from './components/OwnerDashboard';

const MOBILE_BOTTOM_TABS: { id: MemberTab; label: string; icon: React.ReactNode }[] = [
  { id: 'home', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { id: 'crowd', label: 'Crowd', icon: <Users className="w-5 h-5" /> },
  { id: 'checkin', label: 'Check-in', icon: <Camera className="w-5 h-5" /> },
  { id: 'board', label: 'Board', icon: <Trophy className="w-5 h-5" /> },
  { id: 'loot', label: 'Loot', icon: <Gift className="w-5 h-5" /> },
];

export default function App() {
  // Routing (each page has its own URL)
  const [path, go] = useHashRoute();
  const [theme, toggleTheme] = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const segs = path.split('/').filter(Boolean);
  const page = segs[0] ?? 'home';
  const appMode: AppMode = page === 'app' ? 'member' : page === 'boss' ? 'owner' : 'onboarding';
  const VALID_TABS: MemberTab[] = ['home', 'workout', 'crowd', 'checkin', 'board', 'loot', 'profile'];
  const memberTab: MemberTab = VALID_TABS.includes(segs[1] as MemberTab) ? (segs[1] as MemberTab) : 'home';
  const setMemberTab = (t: MemberTab) => go(`/app/${t}`);
  const setAppMode = (m: AppMode) => go(m === 'member' ? '/app/home' : m === 'owner' ? '/boss' : '/');
  const onboardingStep: OnboardingStep = 'goal';
  const setOnboardingStep = (st: OnboardingStep) => go(st === 'splash' ? '/members' : '/join');

  // Onboarding / Member Preferences
  const [weeklyGoal, setWeeklyGoal] = useState<3 | 4>(4);
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Wed', 'Fri', 'Sat']);
  const [focusGoal, setFocusGoal] = useState<FocusGoal>('Build muscle');

  // Live Shared Gym State (connects Member App & Owner Boss Mode)
  const [streakWeeks, setStreakWeeks] = useState<number>(12);
  const [thisWeekCount, setThisWeekCount] = useState<number>(2);
  const [totalCheckIns, setTotalCheckIns] = useState<number>(47);
  const [peopleInside, setPeopleInside] = useState<number>(23);
  const [capacity, setCapacity] = useState<number>(75);
  const [lastUpdatedSeconds, setLastUpdatedSeconds] = useState<number>(30);
  const [points, setPoints] = useState<number>(340);

  // Workout Quest State
  const [exercises, setExercises] = useState<WorkoutExercise[]>(INITIAL_EXERCISES);
  const [questXpClaimed, setQuestXpClaimed] = useState<boolean>(false);

  // Check-in History
  const [checkInHistory, setCheckInHistory] = useState<CheckInHistoryItem[]>([]);

  // Leaderboard & Challenges
  const [leaderboard, setLeaderboard] = useState<LeaderboardMember[]>(INITIAL_LEADERBOARD);
  const [challenges, setChallenges] = useState<GymChallenge[]>(INITIAL_CHALLENGES);

  // Rewards
  const [rewards, setRewards] = useState<RewardTier[]>(INITIAL_REWARD_TRACK);

  // Owner Dashboard State
  const [dropOffAlerts, setDropOffAlerts] = useState<DropOffMember[]>(INITIAL_DROP_OFF_ALERTS);
  const [memberRoster, setMemberRoster] = useState<GymMemberRecord[]>(INITIAL_MEMBER_ROSTER);
  const [broadcasts, setBroadcasts] = useState<BroadcastAnnouncement[]>(INITIAL_BROADCASTS);

  // Toast feedback
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2600);
  };

  // Sync user's points with leaderboard
  const syncedLeaderboard = useMemo(() => {
    return leaderboard.map((m) =>
      m.isYou
        ? { ...m, points, monthPoints: m.monthPoints + (points - 340), streakWeeks }
        : m
    );
  }, [leaderboard, points, streakWeeks]);

  const userRank = useMemo(() => {
    const sorted = syncedLeaderboard.slice().sort((a, b) => b.points - a.points);
    const idx = sorted.findIndex((m) => m.isYou);
    return idx >= 0 ? idx + 1 : 4;
  }, [syncedLeaderboard]);

  const handleToggleDay = (dayKey: string) => {
    setSelectedDays((prev) =>
      prev.includes(dayKey) ? prev.filter((d) => d !== dayKey) : [...prev, dayKey]
    );
  };

  const handleCompleteOnboarding = () => {
    setAppMode('member');
    setMemberTab('home');
    showToast(`Quest locked: ${weeklyGoal} days/wk (${focusGoal})`);
  };

  const handleAwardPoints = (delta: number) => {
    setPoints((prev) => prev + delta);
  };

  const handleToggleExercise = (id: string) => {
    setExercises((prev) => {
      const updated = prev.map((ex) =>
        ex.id === id ? { ...ex, completed: !ex.completed, isCurrent: false } : ex
      );
      const firstIncompleteIdx = updated.findIndex((e) => !e.completed);
      return updated.map((ex, i) => ({
        ...ex,
        isCurrent: i === firstIncompleteIdx,
      }));
    });
  };

  const handleAddExercise = (name: string, setsReps: string, weight?: string) => {
    setExercises((prev) => [
      ...prev,
      {
        id: `ex-${Date.now()}`,
        name,
        setsReps,
        weight,
        completed: false,
      },
    ]);
    showToast(`Added "${name}" to Push day`);
  };

  const handleClaimQuestXp = () => {
    if (questXpClaimed) return;
    setQuestXpClaimed(true);
    handleAwardPoints(40);
    showToast('Push day complete! +40 XP added');
  };

  const handleSimulateDeskScan = (code: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    handleAwardPoints(50);
    setTotalCheckIns((prev) => prev + 1);
    setPeopleInside((prev) => Math.min(capacity, prev + 1));
    setThisWeekCount((prev) => {
      const next = prev + 1;
      if (next >= weeklyGoal && prev < weeklyGoal) {
        setStreakWeeks((s) => s + 1);
        return weeklyGoal;
      }
      return Math.min(weeklyGoal, next);
    });
    setCheckInHistory((prev) => [
      { id: `chk-${Date.now()}`, timestamp: `Today · ${nowTime}`, xpEarned: 50, code },
      ...prev,
    ]);
    setMemberRoster((prev) =>
      prev.map((m) =>
        m.name === 'Parth P.'
          ? {
              ...m,
              points: m.points + 50,
              thisWeekCount: Math.min(m.weeklyGoal, m.thisWeekCount + 1),
              status: 'Inside Now',
              lastVisit: 'Inside now',
            }
          : m
      )
    );
    showToast('Clocked in at Iron Den! +50 XP');
  };

  const handleRefreshCrowd = () => {
    setLastUpdatedSeconds(0);
    setPeopleInside((prev) => {
      const jitter = Math.random() > 0.5 ? 1 : -1;
      return Math.max(10, Math.min(capacity, prev + jitter));
    });
    showToast('Live floor count refreshed');
  };

  const handleContributeChallenge = (challengeId: string, amount: number) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === challengeId ? { ...c, current: Math.min(c.target, c.current + amount) } : c
      )
    );
    handleAwardPoints(10);
    showToast(`+${amount} logged! +10 XP toward challenge`);
  };

  const handleClaimReward = (id: string) => {
    setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, claimed: true } : r)));
    showToast('Merch reward claimed at Iron Den desk!');
  };

  const handleNudgeMember = (id: string) => {
    setDropOffAlerts((prev) =>
      prev.map((m) => (m.id === id ? { ...m, nudged: true, lastNudgeAt: 'Just now' } : m))
    );
    const target = dropOffAlerts.find((d) => d.id === id);
    if (target) {
      showToast(`Nudge sent to ${target.name} ("Your streak misses you!")`);
    }
  };

  const handleCreateChallenge = (
    title: string,
    target: number,
    unit: string,
    xpBonus: number,
    windowLabel: string
  ) => {
    setChallenges((prev) => [
      {
        id: `ch-${Date.now()}`,
        title,
        target,
        current: 0,
        unit,
        xpBonus,
        windowLabel,
        active: true,
      },
      ...prev,
    ]);
    showToast(`Challenge "${title}" is now live in Member App`);
  };

  const handleToggleChallenge = (id: string) => {
    setChallenges((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const handleSendBroadcast = (title: string, message: string, audience: string) => {
    setBroadcasts((prev) => [
      {
        id: `bc-${Date.now()}`,
        title,
        message,
        audience,
        sentAt: 'Just now',
      },
      ...prev,
    ]);
    showToast('Broadcast pushed to Member App');
  };

  return (
    <div className="min-h-screen bg-arcade-grid text-ink flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 h-16 bg-void/80 backdrop-blur-xl border-b border-line/10">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => go('/')}
            className="font-display text-xl tracking-tight text-t-primary text-arcade-shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            GYMLOOP
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-ink-3">
            {(appMode === 'member'
              ? [
                  { to: '/app/home', label: 'Home', on: memberTab === 'home' },
                  { to: '/app/workout', label: 'Workout', on: memberTab === 'workout' },
                  { to: '/app/crowd', label: 'Crowd', on: memberTab === 'crowd' },
                  { to: '/app/checkin', label: 'Check-in', on: memberTab === 'checkin' },
                  { to: '/app/board', label: 'Leaderboard', on: memberTab === 'board' },
                  { to: '/app/loot', label: 'Loot', on: memberTab === 'loot' || memberTab === 'profile' },
                  { to: '/calculators', label: 'Calculators', on: false },
                ]
              : [
                  { to: '/', label: 'Home', on: page === 'home' },
                  { to: '/members', label: 'For Members', on: page === 'members' || page === 'join' },
                  { to: '/owners', label: 'For Gym Owners', on: page === 'owners' || page === 'boss' },
                  { to: '/calculators', label: 'Calculators', on: page === 'calculators' },
                  { to: '/app/home', label: 'Demo App', on: false },
                ]
            ).map((l) => (
              <button
                key={l.to}
                type="button"
                onClick={() => go(l.to)}
                className={`relative px-3.5 py-2 rounded-full whitespace-nowrap cursor-pointer ${l.on ? 'text-onbright font-semibold' : 'hover:text-ink'}`}
              >
                {l.on && (
                  <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />
                )}
                <span className="relative">{l.label}</span>
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode'}
              className="relative w-16 h-9 rounded-full bg-surface border border-line/20 cursor-pointer overflow-hidden"
            >
              <motion.span
                className="absolute top-1 w-7 h-7 rounded-full bg-primary text-onbright flex items-center justify-center"
                animate={{ left: theme === 'dark' ? 4 : 32, rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ type: 'spring', stiffness: 400, damping: 26 }}
              >
                {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </motion.span>
            </button>
            <button
              type="button"
              onClick={() => go(appMode === 'owner' ? '/app/home' : '/boss')}
              className={`hidden sm:inline-flex min-h-[38px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer ${
                appMode === 'owner' ? 'bg-accent hover:bg-accent-hi text-white' : 'bg-surface hover:bg-raised border border-coin/60 text-t-coin'
              }`}
            >
              {appMode === 'owner' ? 'Member App' : 'Boss Mode'}
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
              className="md:hidden w-10 h-10 rounded-xl bg-surface border border-line/15 flex items-center justify-center text-ink cursor-pointer"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-16 left-0 right-0 bg-void/95 backdrop-blur-xl border-b border-line/10 px-4 py-3 flex flex-col gap-1"
            >
              {[
                ['/', 'Home'],
                ['/members', 'For Members'],
                ['/owners', 'For Gym Owners'],
                ['/calculators', 'Calculators'],
                ['/app/home', 'Member App'],
                ['/boss', 'Boss Mode'],
              ].map(([to, label], i) => (
                <motion.button
                  key={to}
                  type="button"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => {
                    setMenuOpen(false);
                    go(to);
                  }}
                  className="text-left min-h-[46px] px-4 rounded-xl text-ink-2 hover:bg-surface font-medium cursor-pointer"
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content Area */}
      <div
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 ${
          appMode === 'member' ? 'pt-6 pb-24 md:pb-10' : ['home', 'members', 'owners'].includes(page) ? 'pb-6' : 'py-6'
        }`}
      >
        <motion.div
          key={path}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        >
        {page === 'home' && <HomeLanding go={go} />}
        {page === 'members' && <MembersLanding go={go} />}
        {page === 'owners' && <OwnersLanding go={go} />}
        {page === 'calculators' && <Calculators active={segs[1]} go={go} />}
        {page === 'join' && (
          <MemberOnboarding
            step={onboardingStep}
            setStep={setOnboardingStep}
            weeklyGoal={weeklyGoal}
            setWeeklyGoal={setWeeklyGoal}
            selectedDays={selectedDays}
            onToggleDay={handleToggleDay}
            focusGoal={focusGoal}
            setFocusGoal={setFocusGoal}
            onComplete={handleCompleteOnboarding}
            onOpenOwnerMode={() => setAppMode('owner')}
          />
        )}
        {!['home', 'members', 'owners', 'calculators', 'join', 'app', 'boss'].includes(page) && (
          <div className="py-32 text-center">
            <p className="font-display text-6xl text-t-primary mb-4">404</p>
            <p className="text-ink-3 mb-6">This level doesn&apos;t exist.</p>
            <button type="button" onClick={() => go('/')} className="px-6 py-3 rounded-xl bg-primary text-onbright font-bold cursor-pointer">
              Back to start
            </button>
          </div>
        )}

        {appMode === 'member' && (
          <>
            {memberTab === 'home' && (
              <MemberHome
                memberName="Parth"
                streakWeeks={streakWeeks}
                thisWeekCount={thisWeekCount}
                weeklyGoal={weeklyGoal}
                peopleInside={peopleInside}
                capacity={capacity}
                points={points}
                rank={userRank}
                exercises={exercises}
                latestBroadcast={broadcasts[0]}
                onNavigate={setMemberTab}
                onToggleExercise={handleToggleExercise}
              />
            )}

            {memberTab === 'workout' && (
              <WorkoutQuest
                exercises={exercises}
                questXpClaimed={questXpClaimed}
                onToggleExercise={handleToggleExercise}
                onAddExercise={handleAddExercise}
                onClaimQuestXp={handleClaimQuestXp}
                onBack={() => setMemberTab('home')}
              />
            )}

            {memberTab === 'crowd' && (
              <LiveCrowd
                peopleInside={peopleInside}
                capacity={capacity}
                hourlyCrowd={INITIAL_HOURLY_CROWD}
                zones={INITIAL_GYM_ZONES}
                lastUpdatedSeconds={lastUpdatedSeconds}
                onRefreshCrowd={handleRefreshCrowd}
              />
            )}

            {memberTab === 'checkin' && (
              <QrCheckIn
                thisWeekCount={thisWeekCount}
                weeklyGoal={weeklyGoal}
                history={checkInHistory}
                onSimulateDeskScan={handleSimulateDeskScan}
              />
            )}

            {memberTab === 'board' && (
              <LeaderboardView
                members={syncedLeaderboard}
                challenges={challenges}
                onContributeChallenge={handleContributeChallenge}
              />
            )}

            {(memberTab === 'loot' || memberTab === 'profile') && (
              <LootAndProfile
                initialSection={memberTab === 'profile' ? 'profile' : 'loot'}
                memberName="Parth P."
                level={14}
                titleBadge="GRINDER"
                streakWeeks={streakWeeks}
                totalCheckIns={totalCheckIns}
                bestStreak={Math.max(14, streakWeeks)}
                rewards={rewards}
                onClaimReward={handleClaimReward}
              />
            )}
          </>
        )}

        {appMode === 'owner' && (
          <OwnerDashboard
            peopleInside={peopleInside}
            capacity={capacity}
            onUpdateCapacity={setCapacity}
            hourlyCrowd={INITIAL_HOURLY_CROWD}
            dropOffAlerts={dropOffAlerts}
            onNudgeMember={handleNudgeMember}
            memberRoster={memberRoster}
            challenges={challenges}
            onCreateChallenge={handleCreateChallenge}
            onToggleChallenge={handleToggleChallenge}
            rewards={rewards}
            broadcasts={broadcasts}
            onSendBroadcast={handleSendBroadcast}
          />
        )}
        </motion.div>
      </div>

      {/* Mobile Fixed 5-Tab Bottom Bar (Member App) - obeys <=15% sticky height & >=44px touch targets */}
      {appMode === 'member' && (
        <nav
          aria-label="Member navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-base/95 backdrop-blur-md border-t border-line/10 grid grid-cols-5 items-center px-1"
        >
          {MOBILE_BOTTOM_TABS.map((tab) => {
            const active =
              memberTab === tab.id ||
              (tab.id === 'loot' && memberTab === 'profile') ||
              (tab.id === 'home' && memberTab === 'workout');

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setMemberTab(tab.id)}
                className={`relative min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                  active ? 'text-t-primary' : 'text-ink-4 hover:text-ink'
                }`}
              >
                {active && (
                  <motion.span layoutId="tab-glow" className="absolute top-1 w-10 h-1 rounded-full bg-primary" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                )}
                <motion.span animate={{ y: active ? -2 : 0, scale: active ? 1.12 : 1 }}>{tab.icon}</motion.span>
                <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            key={toastMsg}
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-surface border border-primary text-xs font-bold text-t-primary shadow-xl"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
