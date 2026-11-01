import React, { useState } from 'react';
import { 
  Calculator, 
  CloudFog, 
  TreePine, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight
} from 'lucide-react';
import { calculateEmissions, isValidConsumption } from '../utils/emissions';
import { DEFAULT_EMISSION_FACTOR, REGIONAL_AVERAGE_KWH } from '../data/config';
import RecommendationCard from '../components/RecommendationCard';
import { getSmartRecommendations } from '../utils/recommendations';

export default function FootprintCalculator({ 
  userData, 
  onSave, 
  onNavigate 
}) {
  const [kwhInput, setKwhInput] = useState(String(userData.monthlyKwh ?? 180));
  const [billInput, setBillInput] = useState(userData.monthlyBill ? String(userData.monthlyBill) : '');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Live or current calculation state
  const activeKwh = isValidConsumption(kwhInput) ? Number(kwhInput) : userData.monthlyKwh;
  const emissions = calculateEmissions(activeKwh);
  const recommendations = getSmartRecommendations({
    monthlyKwh: activeKwh,
    monthlyBill: Number(billInput) || 0,
    completedCount: userData.completedChallenges.length
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!isValidConsumption(kwhInput)) {
      setValidationError('Please enter a valid, non-negative electricity consumption number in kWh.');
      return;
    }

    const parsedKwh = Math.round(Number(kwhInput));
    let parsedBill = 0;
    if (billInput.trim() !== '') {
      const numBill = Number(billInput);
      if (Number.isNaN(numBill) || numBill < 0) {
        setValidationError('Please enter a valid, non-negative amount for your monthly bill in INR (or leave blank).');
        return;
      }
      parsedBill = Math.round(numBill);
    }

    // Persist to parent and localStorage
    onSave({
      monthlyKwh: parsedKwh,
      monthlyBill: parsedBill
    });

    setSuccessMessage('Footprint calculated and saved to your dashboard successfully!');
    setTimeout(() => setSuccessMessage(''), 4000);
  };

  const handleQuickPreset = (presetKwh, presetBill) => {
    setKwhInput(String(presetKwh));
    setBillInput(String(presetBill));
    setValidationError('');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5 text-emerald-700" />
              <span>Electricity Carbon Accounting</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-primary tracking-tight">
              Household Carbon Footprint Calculator
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Quantify the greenhouse gas emissions resulting from your monthly electricity usage using GEDA baseline emission factors.
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 text-xs self-start md:self-auto">
            <span className="text-on-surface-variant font-medium">Configured Emission Factor:</span>
            <span className="font-bold text-primary text-sm flex items-center gap-1">
              <Zap className="w-4 h-4 text-amber-500" />
              {DEFAULT_EMISSION_FACTOR} kg CO₂e / kWh
            </span>
            <span className="text-[10px] text-gray-500 italic">Illustrative prototype baseline</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form on Left, Output Metrics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Column (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm relative">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-low">
            <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
              <span>Input Consumption</span>
            </h2>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Local Persistence
            </span>
          </div>

          {/* Quick Preset Buttons for Hackathon Demonstrator */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-on-surface-variant mb-2">
              Quick Prototype Presets:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset(120, 850)}
                className="py-1.5 px-2 text-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
              >
                1 BHK (~120 kWh)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(180, 1250)}
                className="py-1.5 px-2 text-xs rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold transition-colors"
              >
                2 BHK (~180 kWh)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset(320, 2400)}
                className="py-1.5 px-2 text-xs rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors"
              >
                3+ BHK (~320 kWh)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input: kWh */}
            <div>
              <label 
                htmlFor="kwhInput" 
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
              >
                Monthly Electricity Consumption (kWh) *
              </label>
              <div className="relative">
                <input
                  id="kwhInput"
                  type="number"
                  min="0"
                  step="1"
                  value={kwhInput}
                  onChange={(e) => setKwhInput(e.target.value)}
                  placeholder="e.g. 180"
                  className="w-full pl-3.5 pr-14 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white transition-all"
                  required
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-on-surface-variant/70 pointer-events-none">
                  kWh/mo
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Found on your DGVCL / UGVCL / PGVCL / MGVCL electricity bill.
              </p>
            </div>

            {/* Input: Bill INR */}
            <div>
              <label 
                htmlFor="billInput" 
                className="block text-xs font-bold text-on-surface uppercase tracking-wider mb-1.5"
              >
                Monthly Electricity Bill in INR (Optional)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-bold text-on-surface-variant/70 pointer-events-none">
                  ₹
                </span>
                <input
                  id="billInput"
                  type="number"
                  min="0"
                  step="10"
                  value={billInput}
                  onChange={(e) => setBillInput(e.target.value)}
                  placeholder="e.g. 1250"
                  className="w-full pl-8 pr-12 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-base font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white transition-all"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-on-surface-variant/70 pointer-events-none">
                  INR
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Used to tailor potential bill savings and financial payback.
              </p>
            </div>

            {/* Validation Error Message */}
            {validationError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <Calculator className="w-4 h-4 text-primary-fixed" />
              <span>Calculate Carbon Footprint</span>
            </button>
          </form>

          {/* Assumption disclaimer box */}
          <div className="mt-5 pt-4 border-t border-surface-container-low text-[11px] text-on-surface-variant flex items-start gap-2">
            <Info className="w-4 h-4 text-primary-container shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Demo Parameter Disclosure:</strong> The emission factor of <strong>{DEFAULT_EMISSION_FACTOR} kg CO₂e/kWh</strong> is a clearly named configuration constant configured for this hackathon prototype. It illustrates typical coal-heavy regional grid intensity and does not represent an independently verified live DISCOM grid dispatch rate.
            </p>
          </div>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-low">
              <h2 className="font-headline font-bold text-base text-on-surface flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Calculated Carbon Breakdown</span>
              </h2>
              <span className="text-xs text-on-surface-variant">
                Based on {emissions.monthlyKwh} kWh / month
              </span>
            </div>

            {/* 3 Result Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
              {/* Monthly */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-surface-container text-center">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Monthly Emissions
                </span>
                <span className="font-headline font-bold text-2xl sm:text-3xl text-primary block">
                  {emissions.monthlyEmissionsKg}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">
                  kg CO₂e / month
                </span>
              </div>

              {/* Annual Estimate */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-surface-container text-center">
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block mb-1">
                  Annualized Estimate
                </span>
                <span className="font-headline font-bold text-2xl sm:text-3xl text-amber-800 block">
                  {emissions.annualEmissionsTonnes}
                </span>
                <span className="text-xs font-semibold text-on-surface-variant">
                  Tonnes CO₂e / year
                </span>
              </div>

              {/* Tree Absorption Offset */}
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                  Tree Offset Needed
                </span>
                <span className="font-headline font-bold text-2xl sm:text-3xl text-emerald-700 block">
                  ~{emissions.treesNeeded}
                </span>
                <span className="text-xs font-semibold text-emerald-800">
                  Mature Trees / Year
                </span>
              </div>
            </div>

            {/* Benchmark Comparison Bar */}
            <div className="bg-surface-container-low/60 rounded-xl p-4 border border-surface-container mb-4">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-on-surface">Municipal Benchmark Comparison</span>
                <span className={emissions.isLowerThanAverage ? 'text-emerald-700' : 'text-amber-800'}>
                  {Math.abs(emissions.differenceFromAverage)}% {emissions.isLowerThanAverage ? 'Below' : 'Above'} Regional Avg
                </span>
              </div>

              <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full transition-all duration-500 ${emissions.isLowerThanAverage ? 'bg-emerald-600' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, Math.round((emissions.monthlyKwh / 400) * 100))}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-on-surface-variant mt-1.5 font-medium">
                <span>0 kWh (Net Zero)</span>
                <span className="text-primary font-bold">Gujarat Avg: {REGIONAL_AVERAGE_KWH} kWh</span>
                <span>400+ kWh</span>
              </div>
            </div>

            {/* Formula Explanation */}
            <div className="bg-surface-container/50 rounded-xl p-3.5 text-xs text-on-surface-variant space-y-1 font-mono">
              <div className="font-bold text-on-surface font-sans text-xs mb-1">
                Applied Calculation Formulas:
              </div>
              <div>• Monthly Emissions = {emissions.monthlyKwh} kWh × {emissions.emissionFactor} kg CO₂e/kWh = <strong>{emissions.monthlyEmissionsKg} kg CO₂e</strong></div>
              <div>• Annualized Estimate = {emissions.monthlyEmissionsKg} kg × 12 = <strong>{emissions.annualEmissionsKg} kg ({emissions.annualEmissionsTonnes} Tonnes)</strong></div>
              <div>• Offset Equivalent = {emissions.annualEmissionsKg} kg ÷ 20 kg/tree/year = <strong>~{emissions.treesNeeded} Trees</strong></div>
            </div>
          </div>

          {/* Jump to Solar Banner */}
          <div className="bg-gradient-to-r from-secondary-container/20 to-amber-50 rounded-2xl p-4 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                <TreePine className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-on-surface">
                  Ready to eliminate this carbon footprint?
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Run the Solar Calculator to see how many rooftop panels can offset {emissions.monthlyKwh} kWh.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('solar')}
              className="px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-container transition-colors shrink-0 flex items-center gap-1.5"
            >
              <span>Solar Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tailored Recommendations based on calculated output */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
        <h3 className="font-headline font-bold text-lg text-on-surface mb-1">
          Targeted Interventions For {emissions.monthlyKwh} kWh Consumption
        </h3>
        <p className="text-xs text-on-surface-variant mb-4">
          Actionable conservation steps recommended by our rule-based engine
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec) => (
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
