import React from 'react';

export default function StatCard({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accentColor = 'bg-primary-container',
  badgeText,
  badgeType = 'neutral',
  onClick
}) {
  const badgeClasses = {
    positive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    info: 'bg-sky-100 text-sky-800 border-sky-200',
    neutral: 'bg-surface-container text-on-surface-variant'
  };

  return (
    <div 
      onClick={onClick}
      className={`
        relative bg-surface-container-lowest rounded-xl p-5 border border-surface-container/70
        shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden
        ${onClick ? 'cursor-pointer hover:border-primary-fixed-dim' : ''}
      `}
    >
      {/* Top accent border bar (Stitch UI style) */}
      <div className={`absolute top-0 left-0 right-0 h-1.5 ${accentColor}`} />

      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-lg bg-surface-container text-primary-container">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-headline font-bold text-3xl text-on-surface tracking-tight">
          {value}
        </span>
        {unit && (
          <span className="text-sm font-semibold text-on-surface-variant">
            {unit}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 pt-2 border-t border-surface-container-low text-xs">
        {subtitle && (
          <span className="text-on-surface-variant line-clamp-1">
            {subtitle}
          </span>
        )}
        {badgeText && (
          <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${badgeClasses[badgeType] || badgeClasses.neutral}`}>
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
}
