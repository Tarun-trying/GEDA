import React from 'react';
import { 
  Lightbulb, 
  PowerOff, 
  Sun, 
  Wind, 
  SunMedium, 
  Check, 
  Sparkles,
  Info
} from 'lucide-react';

const iconMap = {
  Lightbulb,
  PowerOff,
  Sun,
  Wind,
  SunMedium
};

export default function ChallengeCard({ 
  challenge, 
  isCompleted, 
  onComplete 
}) {
  const { id, title, description, points, impact, category, iconName } = challenge;
  const IconComponent = iconMap[iconName] || Sparkles;

  return (
    <div className={`
      relative bg-surface-container-lowest rounded-xl p-5 border transition-all duration-200
      flex flex-col justify-between
      ${isCompleted 
        ? 'border-emerald-300 bg-emerald-50/20 shadow-xs' 
        : 'border-surface-container/80 shadow-sm hover:shadow-md hover:border-emerald-200'}
    `}>
      {/* Top Tag & Points Badge */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
            {category}
          </span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>+{points} Points</span>
          </div>
        </div>

        {/* Challenge Header & Icon */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className={`
            p-2.5 rounded-xl shrink-0 transition-colors
            ${isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-surface-container text-primary'}
          `}>
            <IconComponent className="w-5 h-5" />
          </div>

          <div>
            <h3 className="font-headline font-bold text-base text-on-surface leading-snug">
              {title}
            </h3>
            <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Estimated Impact Note */}
        {impact && (
          <div className="mt-2.5 mb-4 px-2.5 py-1.5 rounded-lg bg-surface-container-low text-[11px] text-emerald-800 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Estimated Impact: {impact}</span>
          </div>
        )}
      </div>

      {/* Completion Action & Verification Label */}
      <div className="pt-3 border-t border-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <span className="text-[10px] text-on-surface-variant/70 flex items-center gap-1">
          <Info className="w-3 h-3 text-gray-400 shrink-0" />
          Self-reported citizen action
        </span>

        {isCompleted ? (
          <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold shadow-xs">
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Completed (+{points} pts)</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onComplete(id, points)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-sm hover:shadow transition-all duration-150 active:scale-[0.98]"
          >
            <span>Mark Complete</span>
            <span className="px-1.5 py-0.2 bg-white/20 rounded text-[10px]">+{points}</span>
          </button>
        )}
      </div>
    </div>
  );
}
