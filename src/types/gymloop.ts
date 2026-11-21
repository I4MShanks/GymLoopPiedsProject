export type AppMode = 'onboarding' | 'member' | 'owner';
export type OnboardingStep = 'splash' | 'goal';
export type MemberTab = 'home' | 'workout' | 'crowd' | 'checkin' | 'board' | 'loot' | 'profile';
export type OwnerTab = 'overview' | 'members' | 'crowd' | 'challenges' | 'rewards' | 'broadcast' | 'settings';
export type FocusGoal = 'Build muscle' | 'Fat loss' | 'Strength' | 'Mobility';
export type LeaderboardScope = 'This week' | 'Month' | 'Friends';

export interface WorkoutExercise {
  id: string;
  name: string;
  setsReps: string;
  weight?: string;
  completed: boolean;
  isCurrent?: boolean;
}

export interface HourlyCrowdPoint {
  hourLabel: string;
  shortLabel: string;
  count: number;
  isNow?: boolean;
  tier: 'chill' | 'moderate' | 'busy' | 'packed';
  benchFreePct: number;
}

export interface GymZone {
  id: string;
  name: string;
  occupied: number;
  total: number;
  status: 'Open' | 'Moderate' | 'Busy';
}

export interface LeaderboardMember {
  id: string;
  name: string;
  avatarEmoji: string;
  points: number;
  streakWeeks: number;
  isYou?: boolean;
  isFriend?: boolean;
  monthPoints: number;
}

export interface RewardTier {
  id: string;
  name: string;
  icon: string;
  requirementLabel: string;
  targetWeeks: number;
  unlocked: boolean;
  claimed?: boolean;
  description: string;
  color: 'green' | 'pink' | 'grape' | 'cyan';
  isTopMonthly?: boolean;
}

export interface GymChallenge {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  xpBonus: number;
  windowLabel: string;
  active: boolean;
}

export interface DropOffMember {
  id: string;
  name: string;
  daysAbsent: number;
  detail: string;
  nudged: boolean;
  lastNudgeAt?: string;
  streakLost?: number;
}

export interface GymMemberRecord {
  id: string;
  name: string;
  level: number;
  streakWeeks: number;
  weeklyGoal: number;
  thisWeekCount: number;
  points: number;
  status: 'On Streak' | 'At Risk' | 'Inside Now';
  lastVisit: string;
}

export interface BroadcastAnnouncement {
  id: string;
  title: string;
  message: string;
  sentAt: string;
  audience: string;
}

export interface CheckInHistoryItem {
  id: string;
  timestamp: string;
  xpEarned: number;
  code: string;
}
