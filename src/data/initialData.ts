import {
  BroadcastAnnouncement,
  DropOffMember,
  GymChallenge,
  GymMemberRecord,
  GymZone,
  HourlyCrowdPoint,
  LeaderboardMember,
  RewardTier,
  WorkoutExercise,
} from '../types/gymloop';

export const INITIAL_EXERCISES: WorkoutExercise[] = [
  {
    id: 'ex-1',
    name: 'Bench press',
    setsReps: '4 × 8',
    weight: '40 kg',
    completed: true,
  },
  {
    id: 'ex-2',
    name: 'Incline DB press',
    setsReps: '3 × 10',
    weight: '14 kg',
    completed: true,
  },
  {
    id: 'ex-3',
    name: 'Shoulder press',
    setsReps: '3 × 10',
    weight: '12 kg',
    completed: false,
    isCurrent: true,
  },
  {
    id: 'ex-4',
    name: 'Cable flys',
    setsReps: '3 × 12',
    completed: false,
  },
  {
    id: 'ex-5',
    name: 'Tricep pushdown',
    setsReps: '3 × 12',
    completed: false,
  },
];

export const INITIAL_HOURLY_CROWD: HourlyCrowdPoint[] = [
  { hourLabel: '6 AM', shortLabel: '6a', count: 31, tier: 'moderate', benchFreePct: 58 },
  { hourLabel: '7 AM', shortLabel: '7a', count: 52, tier: 'packed', benchFreePct: 24 },
  { hourLabel: '8 AM', shortLabel: '8a', count: 56, tier: 'packed', benchFreePct: 18 },
  { hourLabel: '9 AM', shortLabel: '9a', count: 33, tier: 'moderate', benchFreePct: 54 },
  { hourLabel: '10 AM', shortLabel: '10a', count: 17, tier: 'chill', benchFreePct: 82 },
  { hourLabel: '11 AM', shortLabel: '11a', count: 14, tier: 'chill', benchFreePct: 88 },
  { hourLabel: '12 PM', shortLabel: '12p', count: 12, tier: 'chill', benchFreePct: 90 },
  { hourLabel: '1 PM', shortLabel: '1p', count: 16, tier: 'chill', benchFreePct: 84 },
  { hourLabel: '2 PM', shortLabel: 'NOW', count: 23, isNow: true, tier: 'chill', benchFreePct: 74 },
  { hourLabel: '3 PM', shortLabel: '3p', count: 20, tier: 'chill', benchFreePct: 80 },
  { hourLabel: '4 PM', shortLabel: '4p', count: 41, tier: 'moderate', benchFreePct: 45 },
  { hourLabel: '5 PM', shortLabel: '5p', count: 60, tier: 'packed', benchFreePct: 12 },
  { hourLabel: '6 PM', shortLabel: '6p', count: 58, tier: 'packed', benchFreePct: 15 },
  { hourLabel: '7 PM', shortLabel: '7p', count: 53, tier: 'packed', benchFreePct: 22 },
  { hourLabel: '8 PM', shortLabel: '8p', count: 37, tier: 'moderate', benchFreePct: 48 },
  { hourLabel: '9 PM', shortLabel: '9p', count: 21, tier: 'chill', benchFreePct: 76 },
];

export const INITIAL_GYM_ZONES: GymZone[] = [
  { id: 'z-1', name: 'Bench & Dumbbell Bay', occupied: 5, total: 14, status: 'Open' },
  { id: 'z-2', name: 'Squat Racks & Platforms', occupied: 4, total: 6, status: 'Moderate' },
  { id: 'z-3', name: 'Cable & Machine Floor', occupied: 9, total: 24, status: 'Open' },
  { id: 'z-4', name: 'Cardio & Turf Zone', occupied: 5, total: 18, status: 'Open' },
];

export const INITIAL_LEADERBOARD: LeaderboardMember[] = [
  { id: 'lb-1', name: 'Kabir', avatarEmoji: '🦁', points: 465, monthPoints: 1820, streakWeeks: 19, isFriend: true },
  { id: 'lb-2', name: 'Riya', avatarEmoji: '🦊', points: 420, monthPoints: 1690, streakWeeks: 16, isFriend: true },
  { id: 'lb-3', name: 'Aman', avatarEmoji: '🐼', points: 385, monthPoints: 1540, streakWeeks: 14, isFriend: false },
  { id: 'lb-4', name: 'You', avatarEmoji: '😎', points: 340, monthPoints: 1410, streakWeeks: 12, isYou: true, isFriend: true },
  { id: 'lb-5', name: 'Sneha', avatarEmoji: '🐯', points: 315, monthPoints: 1320, streakWeeks: 11, isFriend: true },
  { id: 'lb-6', name: 'Dev', avatarEmoji: '🐸', points: 290, monthPoints: 1185, streakWeeks: 9, isFriend: false },
  { id: 'lb-7', name: 'Aarav', avatarEmoji: '⚡', points: 265, monthPoints: 1050, streakWeeks: 8, isFriend: false },
];

export const INITIAL_REWARD_TRACK: RewardTier[] = [
  {
    id: 'rw-1',
    name: 'Keychain',
    icon: '🔑',
    requirementLabel: '5 weeks',
    targetWeeks: 5,
    unlocked: true,
    claimed: true,
    description: 'Anodized neon-green Iron Den metal locker tag. Never sold online.',
    color: 'green',
  },
  {
    id: 'rw-2',
    name: 'Loop Tee',
    icon: '👕',
    requirementLabel: '20 weeks · 8 to go',
    targetWeeks: 20,
    unlocked: false,
    description: 'Heavyweight 280 GSM boxy streetwear tee with reflective GymLoop back hit.',
    color: 'pink',
  },
  {
    id: 'rw-3',
    name: 'Season Hoodie',
    icon: '🧥',
    requirementLabel: '35 weeks',
    targetWeeks: 35,
    unlocked: false,
    description: 'Acid-wash void fleece hoodie embroidered with your founding member number.',
    color: 'grape',
  },
  {
    id: 'rw-4',
    name: 'Limited Cap',
    icon: '🧢',
    requirementLabel: 'Monthly top 3',
    targetWeeks: 99,
    unlocked: false,
    isTopMonthly: true,
    description: '5-panel unstructured dad cap reserved strictly for the monthly gym podium.',
    color: 'cyan',
  },
];

export const INITIAL_CHALLENGES: GymChallenge[] = [
  {
    id: 'ch-1',
    title: '1,000 squats this week',
    target: 1000,
    current: 612,
    unit: 'squats',
    xpBonus: 75,
    windowLabel: 'Resets in 2d 14h',
    active: true,
  },
  {
    id: 'ch-2',
    title: 'Off-peak 2x XP window',
    target: 120,
    current: 74,
    unit: 'check-ins',
    xpBonus: 100,
    windowLabel: '1–4 PM daily',
    active: false,
  },
];

export const INITIAL_DROP_OFF_ALERTS: DropOffMember[] = [
  {
    id: 'do-1',
    name: 'Rohan M.',
    daysAbsent: 14,
    detail: '14 days · lost 9-wk streak',
    nudged: false,
    streakLost: 9,
  },
  {
    id: 'do-2',
    name: 'Ishita K.',
    daysAbsent: 12,
    detail: '12 days · new member',
    nudged: false,
  },
  {
    id: 'do-3',
    name: 'Varun S.',
    daysAbsent: 11,
    detail: '11 days · 1 week to tee',
    nudged: false,
  },
  {
    id: 'do-4',
    name: 'Neha J.',
    daysAbsent: 10,
    detail: '10 days · 3-day goal',
    nudged: false,
  },
];

export const INITIAL_MEMBER_ROSTER: GymMemberRecord[] = [
  { id: 'm-1', name: 'Parth P.', level: 14, streakWeeks: 12, weeklyGoal: 4, thisWeekCount: 2, points: 340, status: 'On Streak', lastVisit: 'Today · 10:15 AM' },
  { id: 'm-2', name: 'Kabir S.', level: 18, streakWeeks: 19, weeklyGoal: 4, thisWeekCount: 4, points: 465, status: 'Inside Now', lastVisit: 'Inside now' },
  { id: 'm-3', name: 'Riya V.', level: 16, streakWeeks: 16, weeklyGoal: 4, thisWeekCount: 3, points: 420, status: 'Inside Now', lastVisit: 'Inside now' },
  { id: 'm-4', name: 'Aman T.', level: 15, streakWeeks: 14, weeklyGoal: 4, thisWeekCount: 3, points: 385, status: 'On Streak', lastVisit: 'Yesterday' },
  { id: 'm-5', name: 'Sneha R.', level: 12, streakWeeks: 11, weeklyGoal: 3, thisWeekCount: 2, points: 315, status: 'On Streak', lastVisit: '2 days ago' },
  { id: 'm-6', name: 'Rohan M.', level: 10, streakWeeks: 0, weeklyGoal: 4, thisWeekCount: 0, points: 180, status: 'At Risk', lastVisit: '14 days ago' },
  { id: 'm-7', name: 'Ishita K.', level: 3, streakWeeks: 1, weeklyGoal: 3, thisWeekCount: 0, points: 75, status: 'At Risk', lastVisit: '12 days ago' },
  { id: 'm-8', name: 'Varun S.', level: 17, streakWeeks: 19, weeklyGoal: 4, thisWeekCount: 0, points: 410, status: 'At Risk', lastVisit: '11 days ago' },
  { id: 'm-9', name: 'Neha J.', level: 7, streakWeeks: 4, weeklyGoal: 3, thisWeekCount: 0, points: 155, status: 'At Risk', lastVisit: '10 days ago' },
];

export const INITIAL_BROADCASTS: BroadcastAnnouncement[] = [
  {
    id: 'bc-1',
    title: 'Squat Challenge at 61%',
    message: 'Iron Den hit 612/1,000 community squats. Drop 25 reps today for +75 XP.',
    sentAt: 'Today · 11:30 AM',
    audience: 'All 248 active members',
  },
];
