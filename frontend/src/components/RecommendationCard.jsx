import React from 'react';
import { 
  Wind, 
  Wrench, 
  Lightbulb, 
  ZapOff, 
  Award, 
  Sun, 
  Leaf, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const iconMap = {
  Wind,
  Wrench,
  Lightbulb,
  ZapOff,
  Award,
  Sun,
  Leaf
};

export default function RecommendationCard({ recommendation, onActionClick }) {
  const { 
    id, 
    title, 
    tag, 
    tagColor, 
    iconName, 
    explanation, 
    actionTitle, 
    actionDetails 
  } = recommendation;

  const IconComponent = iconMap[iconName] || Leaf;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-surface-container/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-surface-container text-primary-container shrink-0">
            <IconComponent className="w-5 h-5 text-primary" />
          </div>
          {tag && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${tagColor || 'bg-gray-100 text-gray-800'}`}>
              {tag}
            </span>
          )}
        </div>

        <h3 className="font-headline font-bold text-base text-on-surface mb-2">
          {title}
        </h3>

        <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
          {explanation}
        </p>
      </div>

      <div className="mt-2 pt-3 border-t border-surface-container-low">
        <div className="bg-surface-container-low/80 rounded-lg p-3">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-xs font-bold text-primary uppercase tracking-wide flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {actionTitle}
            </span>
            {id === 'solar-opportunity' && onActionClick && (
              <button
                type="button"
                onClick={() => onActionClick('solar')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors"
              >
                Open Calculator <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-xs text-on-surface-variant">
            {actionDetails}
          </p>
        </div>
      </div>
    </div>
  );
}
