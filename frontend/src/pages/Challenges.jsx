import React, { useState } from 'react';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Leaf, 
  Info,
  Zap,
  Filter
} from 'lucide-react';
import ChallengeCard from '../components/ChallengeCard';
import { GREEN_CHALLENGES } from '../data/challenges';
import { TIERS } from '../data/config';

export default function Challenges({ 
  userData, 
  onCompleteChallenge 
}) {
  const { totalPoints, completedChallenges } = userData;
  const [filter, setFilter] = useState('all'); // 'all', 'available', 'completed'
  const [toastMessage, setToastMessage] = useState('');

  // Current Citizen Tier
  const currentTier = [...TIERS].reverse().find(t => totalPoints >= t.minPoints) || TIERS[0];
  const nextTier = TIERS.find(t => t.minPoints > totalPoints) || null;

  const handleComplete = (id, points) => {
    // Check if already completed to prevent duplicate points
    if (completedChallenges.includes(id)) {
      return;
    }

    const challenge = GREEN_CHALLENGES.find(c => c.id === id);
    onCompleteChallenge(id, points);

    setToastMessage(`Congratulations! You earned +${points} Green Points for "${challenge?.title || 'Challenge'}"!`);
    setTimeout(() => {
      setToastMessage('');
    }, 4500);
  };

  const filteredChallenges = GREEN_CHALLENGES.filter((c) => {
    const isCompleted = completedChallenges.includes(c.id);
    if (filter === 'completed') return isCompleted;
    if (filter === 'available') return !isCompleted;
    return true;
  });

  const completionPercentage = Math.round((completedChallenges.length / GREEN_CHALLENGES.length) * 100);

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 max-w-md bg-emerald-700 text-white p-4 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce">
          <div className="p-1.5 rounded-full bg-white/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div className="text-xs font-semibold leading-relaxed">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-container to-secondary-dark rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-fixed text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5 text-emerald-300" />
              <span>Mission LiFE (Lifestyle for Environment) Gamification</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Mission LiFE Green Challenges
            </h1>
            <p className="text-sm text-primary-fixed-dim leading-relaxed">
              Adopt micro-habits that curb household electricity wastage. Complete each self-reported action once to unlock Green Points and progress your citizen tier.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 min-w-[240px] text-center">
            <span className="text-[11px] font-bold text-primary-fixed uppercase tracking-wider block mb-1">
              Total Green Points
            </span>
            <div className="flex items-center justify-center gap-1.5 font-headline font-bold text-3xl sm:text-4xl text-white">
              <Zap className="w-6 h-6 text-secondary-container fill-secondary-container" />
              <span>{totalPoints}</span>
            </div>
            <span className="text-xs text-secondary-fixed font-semibold mt-1 block">
              Tier: {currentTier.name}
            </span>
          </div>
        </div>
      </div>

      {/* Progress & Filter Bar */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Progress Metric */}
        <div className="flex-1 max-w-md">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-on-surface">Challenges Completed</span>
            <span className="text-emerald-700">{completedChallenges.length} of {GREEN_CHALLENGES.length} ({completionPercentage}%)</span>
          </div>
          <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-xl self-start md:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'all' 
                ? 'bg-white text-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            All ({GREEN_CHALLENGES.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('available')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'available' 
                ? 'bg-white text-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Available ({GREEN_CHALLENGES.length - completedChallenges.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === 'completed' 
                ? 'bg-white text-primary shadow-xs' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Completed ({completedChallenges.length})
          </button>
        </div>
      </div>

      {/* Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredChallenges.map((challenge) => {
          const isDone = completedChallenges.includes(challenge.id);
          return (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              isCompleted={isDone}
              onComplete={handleComplete}
            />
          );
        })}
      </div>

      {/* Transparency & Disclaimer Box */}
      <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container flex items-start gap-3 text-xs text-on-surface-variant">
        <Info className="w-5 h-5 text-primary-container shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-on-surface">Self-Reported Citizen Action Guidelines:</h4>
          <p className="leading-relaxed">
            These challenges are self-reported pledges designed to cultivate positive ecological habits. Points are tracked locally in your browser's localStorage and cannot be redeemed for legal currency or government certificates. Completed challenges do not automatically reset upon page reload to preserve your progress during demonstrations.
          </p>
        </div>
      </div>
    </div>
  );
}
