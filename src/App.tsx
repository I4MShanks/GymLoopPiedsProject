import React, { useMemo, useState } from 'react';
import { Camera, Gift, Home, Trophy, Users } from 'lucide-react';
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
  // Core Mode & Navigation
  const [appMode, setAppMode] = useState<AppMode>('onboarding');
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('splash');
  const [memberTab, setMemberTab] = useState<MemberTab>('home');

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
    <div className="min-h-screen bg-arcade-grid text-white flex flex-col">
      {/* 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 h-16 bg-[#0B0A1F]/85 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
          {/* Zone 1: Single text brand wordmark */}
          <button
            type="button"
            onClick={() => {
              setAppMode('onboarding');
              setOnboardingStep('splash');
            }}
            className="font-display text-xl tracking-tight text-[#39FF88] text-arcade-shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
          >
            GYMLOOP
          </button>

          {/* Zone 2: Clean single-line navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            {appMode === 'member' ? (
              <>
                <button
                  type="button"
                  onClick={() => setMemberTab('home')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    memberTab === 'home' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('workout')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    memberTab === 'workout' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Workout
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('crowd')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    memberTab === 'crowd' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Crowd
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('board')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    memberTab === 'board' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  type="button"
                  onClick={() => setMemberTab('loot')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    memberTab === 'loot' || memberTab === 'profile'
                      ? 'text-[#39FF88] font-semibold'
                      : 'hover:text-white'
                  }`}
                >
                  Loot
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setAppMode('onboarding');
                    setOnboardingStep('splash');
                  }}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    appMode === 'onboarding' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Onboarding
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppMode('member');
                    setMemberTab('home');
                  }}
                  className="whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer"
                >
                  Member App
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAppMode('member');
                    setMemberTab('crowd');
                  }}
                  className="whitespace-nowrap shrink-0 hover:text-white transition-colors cursor-pointer"
                >
                  Live Crowd
                </button>
                <button
                  type="button"
                  onClick={() => setAppMode('owner')}
                  className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    appMode === 'owner' ? 'text-[#39FF88] font-semibold' : 'hover:text-white'
                  }`}
                >
                  Boss Mode
                </button>
              </>
            )}
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="shrink-0">
            {appMode === 'owner' ? (
              <button
                type="button"
                onClick={() => {
                  setAppMode('member');
                  setMemberTab('home');
                }}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#FF3DA8] hover:bg-[#FF55B3] text-white text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                Member App
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAppMode('owner')}
                className="min-h-[40px] px-4 py-2 rounded-xl bg-[#161436] hover:bg-[#211E4F] border border-[#FFD23F]/50 text-[#FFD23F] text-xs font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
              >
                Boss Mode
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        className={`flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 ${
          appMode === 'member' ? 'pt-6 pb-24 md:pb-10' : 'py-6'
        }`}
      >
        {appMode === 'onboarding' && (
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
      </div>

      {/* Mobile Fixed 5-Tab Bottom Bar (Member App) - obeys <=15% sticky height & >=44px touch targets */}
      {appMode === 'member' && (
        <nav
          aria-label="Member navigation"
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#0E0D26]/95 backdrop-blur-md border-t border-white/10 grid grid-cols-5 items-center px-1"
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
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                  active ? 'text-[#39FF88]' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Subtle Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl bg-[#161436] border border-[#39FF88] text-xs font-bold text-[#39FF88] shadow-xl"
        >
          {toastMsg}
        </div>
      )}
    </div>
  );
}
