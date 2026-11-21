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
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#13122E] hover:bg-[#1A183D] border border-white/15 text-xs font-semibold text-[#3DD6FF] flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add bonus move</span>
        </button>
      </div>

      {/* Main Quest Card */}
      <div className="rounded-3xl bg-[#13122E] border border-white/12 p-6 sm:p-8 sticker-card">
        <span className="font-pixel text-[11px] text-[#3DD6FF] tracking-wider block mb-2">
          TODAY · MONDAY
        </span>

        <h1 className="font-display text-3xl sm:text-4xl text-white mb-3">
          Push day 💥
        </h1>

        <div className="flex flex-wrap items-center gap-2.5 mb-6 text-xs">
          <span className="px-3 py-1 rounded-full bg-[#3DD6FF]/15 text-[#3DD6FF] font-bold">
            55 min
          </span>
          <span className="px-3 py-1 rounded-full bg-[#FFD23F]/15 text-[#FFD23F] font-bold">
            +40 XP
          </span>
          <span className="text-slate-300 font-medium">by Coach Ravi</span>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 rounded-2xl bg-[#0B0A1F] border border-[#3DD6FF]/35 grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <input
              type="text"
              placeholder="Exercise name (e.g. Lateral raises)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="sm:col-span-5 min-h-[44px] px-3.5 rounded-xl bg-[#13122E] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#39FF88]"
            />
            <input
              type="text"
              placeholder="Sets × Reps"
              value={newSets}
              onChange={(e) => setNewSets(e.target.value)}
              className="sm:col-span-3 min-h-[44px] px-3.5 rounded-xl bg-[#13122E] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#39FF88]"
            />
            <input
              type="text"
              placeholder="Weight"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="sm:col-span-2 min-h-[44px] px-3.5 rounded-xl bg-[#13122E] border border-white/15 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#39FF88]"
            />
            <button
              type="submit"
              className="sm:col-span-2 min-h-[44px] px-4 rounded-xl bg-[#39FF88] text-[#0B0A1F] font-bold text-xs cursor-pointer"
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
                  ? 'bg-[#1D153A] border-[#FF3DA8] shadow-[0_0_24px_rgba(255,61,168,0.2)]'
                  : ex.completed
                    ? 'bg-[#0E0D26] border-[#39FF88]/30'
                    : 'bg-[#0E0D26] border-white/10 hover:border-white/25'
              }`}
            >
              <div>
                <p
                  className={`text-base font-semibold ${
                    ex.completed ? 'text-slate-400 line-through' : 'text-white'
                  }`}
                >
                  {ex.name}
                </p>
                <p className="text-xs text-slate-400 tabular-nums mt-0.5">
                  {ex.setsReps}
                  {ex.weight ? ` · ${ex.weight}` : ''}
                </p>
              </div>

              {ex.completed ? (
                <div className="flex items-center gap-2 text-[#39FF88] text-xs font-semibold">
                  <span>Done</span>
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : ex.isCurrent ? (
                <span className="font-pixel text-[10px] bg-[#FF3DA8] text-white px-3 py-1.5 rounded-full">
                  NOW
                </span>
              ) : (
                <span className="w-6 h-6 rounded-full border-2 border-white/25" />
              )}
            </button>
          ))}
        </div>

        {/* Quest Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="font-pixel text-[11px] text-slate-300 tracking-wider">
              QUEST PROGRESS {completedCount}/{exercises.length}
            </span>
            <span className="font-mono text-xs font-bold text-[#39FF88] tabular-nums">
              {Math.round((completedCount / exercises.length) * 100)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-[#0B0A1F] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#39FF88] to-[#3DD6FF] transition-all duration-300"
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
                ? 'bg-[#39FF88]/15 text-[#39FF88] border border-[#39FF88]/40 cursor-default'
                : 'bg-[#FFD23F] hover:bg-[#FFE066] text-[#0B0A1F] sticker-gold cursor-pointer'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>{questXpClaimed ? '+40 XP CLAIMED FOR TODAY' : 'COMPLETE QUEST · CLAIM +40 XP'}</span>
          </button>
        ) : (
          <p className="text-center text-xs text-slate-400">
            Tap any move above as you finish your sets to unlock Coach Ravi&apos;s +40 XP bonus.
          </p>
        )}
      </div>
    </div>
  );
};
