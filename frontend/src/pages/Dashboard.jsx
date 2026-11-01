import React from 'react';
import { 
  Zap, 
  CloudFog, 
  Award, 
  CheckCircle, 
  ArrowRight, 
  Info, 
  Lightbulb, 
  Sun, 
  Calculator,
  Compass,
  TreePine,
  ShieldCheck,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import RecommendationCard from '../components/RecommendationCard';
import { calculateEmissions } from '../utils/emissions';
import { getSmartRecommendations } from '../utils/recommendations';
import { TIERS, REGIONAL_AVERAGE_KWH } from '../data/config';

export default function Dashboard({ 
  userData, 
  onNavigate 
}) {
  const { monthlyKwh, totalPoints, completedChallenges, monthlyBill } = userData;

  // Real calculation from user metrics
  const emissions = calculateEmissions(monthlyKwh);

  // Recommendations based on current user inputs
  const recommendations = getSmartRecommendations({
    monthlyKwh,
    monthlyBill,
    completedCount: completedChallenges.length
  });

  // Current Citizen Tier
  const currentTier = [...TIERS].reverse().find(t => totalPoints >= t.minPoints) || TIERS[0];
  const nextTier = TIERS.find(t => t.minPoints > totalPoints) || null;
  const pointsToNextTier = nextTier ? nextTier.minPoints - totalPoints : 0;

  // Chart data: Illustrative historical regional baseline + Current Month actual state
  // Clearly labeled so users know past months are illustrative context
  const chartData = [
    { month: 'May (Sample)', kwh: 220, isCurrent: false },
    { month: 'Jun (Sample)', kwh: 235, isCurrent: false },
    { month: 'Jul (Sample)', kwh: 210, isCurrent: false },
    { month: 'Aug (Sample)', kwh: 195, isCurrent: false },
    { month: 'Sep (Sample)', kwh: 190, isCurrent: false },
    { month: 'Current Month', kwh: monthlyKwh, isCurrent: true },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Welcome Civic Banner & Tier Ribbon */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-tertiary text-white p-6 sm:p-8 shadow-md">
        {/* Decorative blur circles */}
        <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-secondary-container/20 blur-2xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-52 h-52 rounded-full bg-primary-fixed/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-primary-fixed text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
              Mission LiFE Verified Citizen • Sector 7, Gandhinagar
            </div>

            <h1 className="font-headline font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-white">
              Welcome to GreenSaathi
            </h1>

            <p className="text-sm sm:text-base text-primary-fixed-dim leading-relaxed">
              Your current electricity footprint is{' '}
              <span className="font-bold text-white underline decoration-secondary-container decoration-2 underline-offset-4">
                {Math.abs(emissions.differenceFromAverage)}% {emissions.isLowerThanAverage ? 'lower' : 'higher'}
              </span>{' '}
              than the Gandhinagar municipal average ({REGIONAL_AVERAGE_KWH} kWh/mo).
            </p>

            {/* Quick Action Navigation Pills */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('footprint')}
                className="px-3.5 py-2 rounded-xl bg-secondary-container text-amber-950 font-bold text-xs hover:bg-secondary-fixed transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Calculator className="w-4 h-4 text-amber-900" />
                <span>Update Consumption</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('challenges')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Take Green Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('solar')}
                className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs transition-all flex items-center gap-1.5 backdrop-blur-md active:scale-95"
              >
                <Sun className="w-4 h-4 text-amber-300" />
                <span>Estimate Solar</span>
              </button>
            </div>
          </div>

          {/* Tier Status Card */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/15 min-w-[270px] lg:max-w-xs w-full shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-primary-fixed uppercase tracking-wider">
                Citizen Tier
              </span>
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-secondary-container/20 text-secondary-fixed font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {currentTier.name.split(' ')[0]}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-headline font-bold text-3xl text-white">
                {totalPoints}
              </span>
              <span className="text-xs font-semibold text-primary-fixed">
                Green Points
              </span>
            </div>

            <div className="text-xs text-primary-fixed-dim mb-2.5 flex items-center justify-between">
              <span>{currentTier.name}</span>
              {nextTier ? (
                <span className="font-bold text-secondary-container">
                  +{pointsToNextTier} pts to next tier
                </span>
              ) : (
                <span className="font-bold text-emerald-300">Max Tier Achieved!</span>
              )}
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-secondary-container h-full rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, Math.round((totalPoints / 70) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-primary-fixed/80 mt-1.5">
              <span>Prakriti Mitr (0)</span>
              <span>Surya Ratna (60+)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid (StatCards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <StatCard
          title="Monthly Electricity"
          value={monthlyKwh}
          unit="kWh"
          icon={Zap}
          accentColor="bg-primary-container"
          subtitle="User reported billing cycle"
          badgeText={emissions.isLowerThanAverage ? 'Efficient' : 'Above Avg'}
          badgeType={emissions.isLowerThanAverage ? 'positive' : 'warning'}
          onClick={() => onNavigate('footprint')}
        />

        <StatCard
          title="Estimated Emissions"
          value={emissions.monthlyEmissionsKg}
          unit="kg CO₂e"
          icon={CloudFog}
          accentColor="bg-amber-500"
          subtitle={`~${emissions.annualEmissionsTonnes} tonnes / year`}
          badgeText="At 0.70 kg/kWh"
          badgeType="info"
          onClick={() => onNavigate('footprint')}
        />

        <StatCard
          title="Green Points Earned"
          value={totalPoints}
          unit="pts"
          icon={Award}
          accentColor="bg-emerald-600"
          subtitle="Mission LiFE gamification"
          badgeText={currentTier.badge}
          badgeType="positive"
          onClick={() => onNavigate('challenges')}
        />

        <StatCard
          title="Completed Challenges"
          value={`${completedChallenges.length}`}
          unit="of 5"
          icon={CheckCircle}
          accentColor="bg-tertiary-container"
          subtitle="Self-reported habit actions"
          badgeText={`${Math.round((completedChallenges.length / 5) * 100)}% done`}
          badgeType={completedChallenges.length === 5 ? 'positive' : 'neutral'}
          onClick={() => onNavigate('challenges')}
        />
      </div>

      {/* 3. Main Split Section: Consumption Chart vs Tip & Mission LiFE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left (8 cols): Consumption History Recharts Graph */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-headline font-bold text-lg text-on-surface">
                  Electricity Consumption Baseline
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface-variant">
                  Sample Trend
                </span>
              </div>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Comparing your active month against illustrative regional benchmarks
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#86c5b3]" />
                <span className="text-on-surface-variant text-[11px]">Illustrative Past</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-primary-container" />
                <span className="font-bold text-primary text-[11px]">Your Active Month</span>
              </div>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaedff" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 11, fill: '#3f4945' }}
                  axisLine={{ stroke: '#eaedff' }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#3f4945' }}
                  axisLine={{ stroke: '#eaedff' }}
                  tickLine={false}
                  unit=" kWh"
                />
                <Tooltip
                  cursor={{ fill: 'rgba(234, 237, 255, 0.4)' }}
                  formatter={(val, name, item) => [
                    `${val} kWh (${Math.round(val * 0.70)} kg CO₂e)`,
                    item.payload.isCurrent ? 'User Reported Month' : 'Sample Benchmark'
                  ]}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#eaedff',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }}
                />
                <Bar dataKey="kwh" radius={[6, 6, 0, 0]} maxBarSize={48}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.isCurrent ? '#0b5345' : '#86c5b3'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Clarification banner as strictly required */}
          <div className="mt-4 pt-3 border-t border-surface-container-low flex items-start gap-2 text-xs text-on-surface-variant bg-surface-container-low/60 rounded-xl p-3">
            <Info className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong className="text-on-surface">Data Transparency Notice:</strong> The current month figure ({monthlyKwh} kWh) reflects your active calculation state. Months marked as (Sample) are illustrative reference points to display seasonal patterns and are not invented personal records.
            </p>
          </div>
        </div>

        {/* Right (4 cols): Sustainability Tip & Offset Equivalence */}
        <div className="lg:col-span-4 space-y-4">
          {/* Sustainability Tip Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container/80 shadow-sm">
            <div className="flex items-center gap-2 mb-2.5 text-primary">
              <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h3 className="font-headline font-bold text-sm text-on-surface">
                Sustainability Tip of the Day
              </h3>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed">
              Set air conditioners to <strong>24°C</strong> instead of 18°C. In Gujarat's climate, every 1°C increase reduces your compressor electricity draw by <strong>~6%</strong>, cutting approximately ₹280 from your monthly DISCOM bill.
            </p>

            <div className="mt-4 pt-3 border-t border-surface-container-low flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-emerald-700">Mission LiFE Interventions</span>
              <button
                type="button"
                onClick={() => onNavigate('challenges')}
                className="font-bold text-primary hover:text-primary-container flex items-center gap-1"
              >
                View Challenges <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Tree Offset Card */}
          <div className="bg-gradient-to-br from-emerald-800 to-primary text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Ecological Context
              </span>
              <TreePine className="w-5 h-5 text-emerald-300" />
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-headline font-bold text-3xl text-white">
                {emissions.treesNeeded}
              </span>
              <span className="text-xs font-semibold text-emerald-200">
                Trees Required
              </span>
            </div>

            <p className="text-xs text-emerald-100/90 leading-relaxed mt-1">
              It takes approximately {emissions.treesNeeded} mature trees a full year to absorb the {emissions.annualEmissionsKg} kg CO₂e emitted by your household's annual electricity usage.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('solar')}
              className="mt-3.5 w-full py-2 px-3 rounded-xl bg-white text-primary font-bold text-xs hover:bg-emerald-50 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Sun className="w-3.5 h-3.5 text-amber-600" />
              <span>Offset With Rooftop Solar</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Smart Recommendations Carousel / Grid */}
      <div className="bg-surface-container-lowest rounded-2xl p-5 sm:p-6 border border-surface-container/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-primary" />
              <h2 className="font-headline font-bold text-lg text-on-surface">
                Rule-Based Smart Recommendations
              </h2>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Personalized interventions evaluated deterministically from your {monthlyKwh} kWh monthly consumption
            </p>
          </div>

          <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container px-2.5 py-1 rounded-full self-start sm:self-auto">
            {recommendations.length} Actionable Items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.slice(0, 3).map((rec) => (
            <RecommendationCard 
              key={rec.id} 
              recommendation={rec} 
              onActionClick={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
