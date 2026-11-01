import React, { useState } from 'react';
import { 
  Sun, 
  Zap, 
  Ruler, 
  IndianRupee, 
  Calendar, 
  Clock, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { calculateSolarPotential } from '../utils/solar';
import { SOLAR_CONFIG } from '../data/config';

export default function SolarCalculator({ 
  userData, 
  onSaveSolar 
}) {
  const initialSolar = userData.solarInput || {};

  const [monthlyKwh, setMonthlyKwh] = useState(
    initialSolar.monthlyKwh ? String(initialSolar.monthlyKwh) : String(userData.monthlyKwh || 180)
  );
  const [roofAreaSqm, setRoofAreaSqm] = useState(
    initialSolar.roofAreaSqm ? String(initialSolar.roofAreaSqm) : '30'
  );
  const [costPerKw, setCostPerKw] = useState(
    initialSolar.customCostPerKw ? String(initialSolar.customCostPerKw) : String(SOLAR_CONFIG.DEFAULT_INSTALLATION_COST_PER_KW)
  );
  const [tariff, setTariff] = useState(String(SOLAR_CONFIG.DEFAULT_TARIFF_PER_KWH));
  const [errorMsg, setErrorMsg] = useState('');

  // Validate and calculate
  const numKwh = Math.max(0, Number(monthlyKwh) || 0);
  const numArea = Math.max(0, Number(roofAreaSqm) || 0);
  const numCost = Math.max(1000, Number(costPerKw) || SOLAR_CONFIG.DEFAULT_INSTALLATION_COST_PER_KW);
  const numTariff = Math.max(0.5, Number(tariff) || SOLAR_CONFIG.DEFAULT_TARIFF_PER_KWH);

  const solarResults = calculateSolarPotential({
    monthlyKwh: numKwh,
    roofAreaSqm: numArea,
    customCostPerKw: numCost,
    customTariff: numTariff
  });

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    setErrorMsg('');
  };

  const handleSaveCalculation = (e) => {
    e.preventDefault();
    if (numKwh <= 0 || numArea <= 0) {
      setErrorMsg('Please enter positive numbers for consumption and available roof area.');
      return;
    }

    if (onSaveSolar) {
      onSaveSolar({
        monthlyKwh: numKwh,
        roofAreaSqm: numArea,
        customCostPerKw: numCost
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
              <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>Gujarat Rooftop Solar Feasibility Engine</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-primary tracking-tight">
              Rooftop Solar Potential & Payback Estimator
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Estimate appropriate rooftop photovoltaic capacity, monthly clean energy generation, electricity bill reductions, and approximate investment payback periods.
            </p>
          </div>

          <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container flex flex-col gap-1 text-xs self-start md:self-auto">
            <span className="text-on-surface-variant font-medium">Gujarat Solar Benchmark:</span>
            <span className="font-bold text-amber-800 text-sm flex items-center gap-1">
              ☀️ 5.8 kWh/m²/day
            </span>
            <span className="text-[10px] text-gray-500">Tier-1 High Solar Irradiance</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Form Left (5 cols) & Results Right (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Inputs (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-surface-container-low">
            <h2 className="font-headline font-bold text-base text-on-surface">
              Household & Roof Parameters
            </h2>
            <span className="text-xs text-on-surface-variant">
              Live Evaluation
            </span>
          </div>

          <form onSubmit={handleSaveCalculation} className="space-y-4">
            {/* Input 1: Monthly Consumption */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="solarKwh" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Monthly Electricity Usage (kWh) *
                </label>
                <span className="text-xs font-bold text-primary">{numKwh} kWh</span>
              </div>
              <input
                id="solarKwh"
                type="number"
                min="10"
                step="5"
                value={monthlyKwh}
                onChange={handleInputChange(setMonthlyKwh)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white"
                required
              />
              <p className="text-[11px] text-on-surface-variant mt-1">
                Synchronized with your footprint calculator or entered separately.
              </p>
            </div>

            {/* Input 2: Roof Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="roofArea" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Shadow-Free Roof Area (m²) *
                </label>
                <span className="text-xs font-bold text-primary">
                  {numArea} m² (~{Math.round(numArea * 10.76)} sq. ft.)
                </span>
              </div>
              <input
                id="roofArea"
                type="number"
                min="5"
                step="1"
                value={roofAreaSqm}
                onChange={handleInputChange(setRoofAreaSqm)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white"
                required
              />
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant mt-1">
                <span>Rule of thumb: 10 m² per 1 kW</span>
                <span>(30 m² ≈ 320 sq. ft.)</span>
              </div>
            </div>

            {/* Input 3: Optional Installation Cost */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="costPerKw" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Estimated Cost Per kW (INR)
                </label>
                <span className="text-xs font-bold text-primary">₹{Number(costPerKw).toLocaleString('en-IN')}</span>
              </div>
              <input
                id="costPerKw"
                type="number"
                min="20000"
                step="1000"
                value={costPerKw}
                onChange={handleInputChange(setCostPerKw)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white"
              />
              <p className="text-[11px] text-on-surface-variant mt-1">
                Editable assumption (typically ₹45,000 - ₹55,000 / kW in Gujarat).
              </p>
            </div>

            {/* Input 4: Optional Grid Tariff */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="tariff" className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Electricity Slab Tariff (₹ / kWh)
                </label>
                <span className="text-xs font-bold text-primary">₹{tariff} / kWh</span>
              </div>
              <input
                id="tariff"
                type="number"
                min="2"
                max="15"
                step="0.1"
                value={tariff}
                onChange={handleInputChange(setTariff)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-surface-container-high bg-surface-container-low/50 text-on-surface text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-white"
              />
              <p className="text-[11px] text-on-surface-variant mt-1">
                Residential weighted tariff under Gujarat DISCOM regulations.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-container text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Save & Update Solar Estimates</span>
            </button>
          </form>
        </div>

        {/* Results Column (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main Sizing Hero Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-surface-container-low">
              <div>
                <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                  Recommended System Sizing
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="font-headline font-bold text-3xl sm:text-4xl text-primary">
                    {solarResults.capacityKw} kW
                  </span>
                  <span className="text-xs font-semibold text-on-surface-variant">
                    Rooftop Solar PV
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs self-start sm:self-auto">
                <span className="font-bold block">Limiting Constraint:</span>
                <span>{solarResults.limitingFactor} ({solarResults.limitingFactor === 'Roof Area' ? `${solarResults.roofCapacityKw} kW max roof capacity` : `${solarResults.demandCapacityKw} kW matches 100% load`})</span>
              </div>
            </div>

            {/* 4 Technical & Financial Outputs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                  Monthly Generation
                </span>
                <span className="font-headline font-bold text-xl text-primary mt-1 block">
                  {solarResults.monthlyGenerationKwh}
                </span>
                <span className="text-[10px] text-on-surface-variant">kWh / month</span>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl border border-surface-container text-center">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase block">
                  Annual Generation
                </span>
                <span className="font-headline font-bold text-xl text-primary mt-1 block">
                  {solarResults.annualGenerationKwh}
                </span>
                <span className="text-[10px] text-on-surface-variant">kWh / year</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Monthly Bill Savings
                </span>
                <span className="font-headline font-bold text-xl text-emerald-700 mt-1 block">
                  ₹{solarResults.monthlySavingsInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-800">per month</span>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">
                  Annual Bill Savings
                </span>
                <span className="font-headline font-bold text-xl text-emerald-700 mt-1 block">
                  ₹{solarResults.annualSavingsInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-800">per year</span>
              </div>
            </div>

            {/* Financial Investment & Payback Period Card */}
            <div className="bg-gradient-to-br from-primary via-primary-container to-tertiary text-white rounded-xl p-5 mb-4 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-primary-fixed uppercase tracking-wider block">
                    Estimated Capital Expenditure
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-headline font-bold text-2xl sm:text-3xl text-white">
                      ₹{solarResults.estimatedInstallationCostInr.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-primary-fixed-dim">
                      (@ ₹{solarResults.costPerKw.toLocaleString('en-IN')}/kW)
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-center sm:text-right min-w-[150px]">
                  <span className="text-[11px] font-semibold text-secondary-fixed block">
                    Simple Payback Period
                  </span>
                  <span className="font-headline font-bold text-2xl text-secondary-container mt-0.5 block">
                    {solarResults.paybackYears ? `${solarResults.paybackYears} Years` : 'N/A'}
                  </span>
                  <span className="text-[10px] text-white/80">
                    Break-even timeline
                  </span>
                </div>
              </div>
            </div>

            {/* Environmental Offset Impact */}
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Annual CO₂ Emissions Avoided by this Solar Array:
              </span>
              <span className="font-bold text-sm text-emerald-700">
                {solarResults.annualCo2AvoidedKg} kg CO₂e / year
              </span>
            </div>
          </div>

          {/* Transparent Assumptions & Disclaimers Box as Required */}
          <div className="bg-surface-container-lowest rounded-2xl p-5 border border-surface-container/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <Info className="w-4 h-4 text-primary-container" />
              <span>Visible Technical Assumptions & Prototype Disclaimers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-on-surface-variant bg-surface-container-low p-3.5 rounded-xl font-mono">
              <div>• Usable Roof Area: ~<strong>10 m² per 1 kW</strong></div>
              <div>• Solar Yield: ~<strong>120 kWh per 1 kW / month</strong></div>
              <div>• Installation Baseline: <strong>₹50,000 / kW</strong></div>
              <div>• Electricity Tariff: <strong>₹6.50 / kWh</strong></div>
            </div>

            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              <strong>Notice:</strong> These figures are preliminary mathematical estimates for awareness and educational hackathon presentation only. They do not constitute a formal technical rooftop structural audit, shading analysis, or guaranteed return on investment. Subsidies (e.g. PM Surya Ghar Muft Bijli Yojana) are intentionally excluded from this baseline calculator to avoid asserting unverified eligibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
