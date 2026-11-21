import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { WorkoutExercise } from '../types/gymloop';

interface WorkoutQuestProps {
  exercises: WorkoutExercise[];
  questXpClaimed: boolean;
  onToggleExercise: (id: string) => void;
  onAddExercise: (name: string, setsReps: string, weight?: string) => void;
  onClaimQuestXp: () => void;
  onBack: () => void;
}

export const WorkoutQuest: React.FC<WorkoutQuestProps> = ({
  exercises,
  questXpClaimed,
  onToggleExercise,
  onAddExercise,
  onClaimQuestXp,
  onBack,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSets, setNewSets] = useState('3 × 10');
  const [newWeight, setNewWeight] = useState('15 kg');

  const completedCount = exercises.filter((e) => e.completed).length;
  const allComplete = completedCount === exercises.length && exercises.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddExercise(newName.trim(), newSets.trim() || '3 × 10', newWeight.trim() || undefined);
    setNewName('');
    setShowAddForm(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-line/5 hover:bg-line/10 border border-line/10 text-xs font-semibold text-ink-2 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-surface hover:bg-raised border border-line/15 text-xs font-semibold text-t-sky flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add bonus move</span>
        </button>
      </div>

      {/* Main Quest Card */}
      <div className="rounded-3xl bg-surface border border-line/12 p-6 sm:p-8 sticker-card">
        <span className="font-pixel text-[11px] text-t-sky tracking-wider block mb-2">
          TODAY · MONDAY
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-ink mb-3">
          Push day 💥
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs">
          <span className="px-3 py-1 rounded-full bg-sky/15 text-t-sky font-bold">
            55 min
          </span>
          <span className="px-3 py-1 rounded-full bg-coin/15 text-t-coin font-bold">
            +40 XP
          </span>
          <span className="text-ink-3 font-medium">by Coach Ravi</span>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 rounded-2xl bg-void border border-sky/35 grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <input
              type="text"
              placeholder="Exercise name (e.g. Lateral raises)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="sm:col-span-5 min-h-[44px] px-3.5 rounded-xl bg-surface border border-line/15 text-sm text-ink placeholder:text-ink-5 focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Sets × Reps"
              value={newSets}
              onChange={(e) => setNewSets(e.target.value)}
              className="sm:col-span-3 min-h-[44px] px-3.5 rounded-xl bg-surface border border-line/15 text-sm text-ink placeholder:text-ink-5 focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              placeholder="Weight"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="sm:col-span-2 min-h-[44px] px-3.5 rounded-xl bg-surface border border-line/15 text-sm text-ink placeholder:text-ink-5 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="sm:col-span-2 min-h-[44px] px-4 rounded-xl bg-primary text-onbright font-bold text-xs cursor-pointer"
            >
              Add
            </button>
          </form>
        )}

        <div className="space-y-3 mb-7">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => onToggleExercise(ex.id)}
              className={`w-full min-h-[64px] px-5 py-4 rounded-2xl flex items-center justify-between gap-4 text-left transition-all cursor-pointer border ${
                ex.isCurrent && !ex.completed
                  ? 'bg-raised border-accent shadow-[0_0_24px_rgba(255,46,46,0.2)]'
                  : ex.completed
                    ? 'bg-base border-primary/30'
                    : 'bg-base border-line/10 hover:border-line/25'
              }`}
            >
              <div>
                <p
                  className={`text-base font-semibold ${
                    ex.completed ? 'text-ink-4 line-through' : 'text-ink'
                  }`}
                >
                  {ex.name}
                </p>
                <p className="text-xs text-ink-4 tabular-nums mt-0.5">
                  {ex.setsReps}
                  {ex.weight ? ` · ${ex.weight}` : ''}
                </p>
              </div>

              {ex.completed ? (
                <div className="flex items-center gap-2 text-t-primary text-xs font-semibold">
                  <span>Done</span>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : ex.isCurrent ? (
                <span className="font-pixel text-[10px] bg-accent text-white px-3 py-1.5 rounded-full">
                  NOW
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full border-2 border-line/25" />
              )}
            </button>
          ))}
        </div>

        {/* Quest Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[11px] text-ink-3 tracking-wider">
              QUEST PROGRESS {completedCount}/{exercises.length}
            </span>
            <span className="font-mono text-xs font-bold text-t-primary tabular-nums">
              {Math.round((completedCount / exercises.length) * 100)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-void overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-sky transition-all duration-300"
              style={{ width: `${(completedCount / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Complete Quest Reward Button */}
        {allComplete ? (
          <button
            type="button"
            disabled={questXpClaimed}
            onClick={onClaimQuestXp}
            className={`w-full min-h-[52px] px-6 py-4 rounded-2xl font-display text-base flex items-center justify-center gap-2 transition-all ${
              questXpClaimed
                ? 'bg-primary/15 text-t-primary border border-primary/40 cursor-default'
                : 'bg-coin hover:bg-coin-hi text-onbright sticker-gold cursor-pointer'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{questXpClaimed ? '+40 XP CLAIMED FOR TODAY' : 'COMPLETE QUEST · CLAIM +40 XP'}</span>
          </button>
        ) : (
          <p className="text-center text-xs text-ink-4">
            Tap any move above as you finish your sets to unlock Coach Ravi&apos;s +40 XP bonus.
          </p>
        )}
      </div>
    </div>
  );
};
