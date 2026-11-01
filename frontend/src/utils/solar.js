/**
 * Solar Rooftop Potential Calculation Utilities
 * 
 * Based on GEDA / Mission LiFE technical rules of thumb for Gujarat:
 * - 1 kW requires ~10 m² shadow-free roof area.
 * - 1 kW generates ~120 kWh per month (approx 4 kWh/day).
 * - Suggested capacity is capped by both roof capacity and household consumption demand.
 */
import { SOLAR_CONFIG } from '../data/config';

/**
 * Calculates rooftop solar technical and economic estimates.
 * 
 * @param {object} params
 * @param {number} params.monthlyKwh - Household monthly consumption (kWh)
 * @param {number} params.roofAreaSqm - Shadow-free roof area (m²)
 * @param {number} [params.customCostPerKw] - Optional installation cost per kW in INR
 * @param {number} [params.customTariff] - Optional electricity tariff in INR/kWh
 * @returns {object} Calculated solar estimates and breakdown
 */
export function calculateSolarPotential({
  monthlyKwh,
  roofAreaSqm,
  customCostPerKw = SOLAR_CONFIG.DEFAULT_INSTALLATION_COST_PER_KW,
  customTariff = SOLAR_CONFIG.DEFAULT_TARIFF_PER_KWH
}) {
  const kwh = Math.max(0, Number(monthlyKwh) || 0);
  const area = Math.max(0, Number(roofAreaSqm) || 0);
  const costPerKw = Math.max(1000, Number(customCostPerKw) || SOLAR_CONFIG.DEFAULT_INSTALLATION_COST_PER_KW);
  const tariff = Math.max(0.5, Number(customTariff) || SOLAR_CONFIG.DEFAULT_TARIFF_PER_KWH);

  // 1. Capacity based on roof area: 10 m² needed per kW
  const roofCapacityKw = area > 0 ? area / SOLAR_CONFIG.ROOF_SQM_PER_KW : 0;

  // 2. Capacity based on household demand: monthlyKwh / 120 kWh/kW
  // E.g., if monthly usage is 240 kWh, 2 kW capacity covers ~100% of demand.
  const demandCapacityKw = kwh > 0 ? kwh / SOLAR_CONFIG.MONTHLY_KWH_PER_KW : 0;

  // 3. Recommended capacity: limited by physical roof area and household demand
  let recommendedCapacityKw = Math.min(roofCapacityKw, demandCapacityKw);

  // If roof is too small for even 0.5 kW, cap accordingly
  if (recommendedCapacityKw < 0.5 && area > 0 && kwh > 0) {
    recommendedCapacityKw = Math.min(roofCapacityKw, 0.5);
  }

  // Rounded to 1 decimal place (e.g. 1.5 kW or 3.2 kW)
  const capacityKw = Math.round(recommendedCapacityKw * 10) / 10;

  // 4. Generation estimates
  const monthlyGenerationKwh = Math.round(capacityKw * SOLAR_CONFIG.MONTHLY_KWH_PER_KW);
  const annualGenerationKwh = Math.round(monthlyGenerationKwh * 12);

  // 5. Financial savings
  // Capped by monthly consumption so we don't overestimate direct bill offset
  const energyOffsetKwh = Math.min(monthlyGenerationKwh, kwh);
  const monthlySavingsInr = Math.round(energyOffsetKwh * tariff);
  const annualSavingsInr = Math.round(monthlySavingsInr * 12);

  // 6. System capital expenditure
  const estimatedInstallationCostInr = Math.round(capacityKw * costPerKw);

  // 7. Simple Payback Period (years) = Total Cost / Annual Savings
  let paybackYears = null;
  if (annualSavingsInr > 0 && estimatedInstallationCostInr > 0) {
    const rawPayback = estimatedInstallationCostInr / annualSavingsInr;
    paybackYears = Math.round(rawPayback * 10) / 10;
  }

  // 8. CO2 Avoided per year (using 0.70 kg/kWh baseline)
  const annualCo2AvoidedKg = Math.round(annualGenerationKwh * 0.70);

  return {
    roofCapacityKw: Math.round(roofCapacityKw * 10) / 10,
    demandCapacityKw: Math.round(demandCapacityKw * 10) / 10,
    capacityKw,
    monthlyGenerationKwh,
    annualGenerationKwh,
    monthlySavingsInr,
    annualSavingsInr,
    estimatedInstallationCostInr,
    paybackYears,
    annualCo2AvoidedKg,
    tariff,
    costPerKw,
    limitingFactor: roofCapacityKw < demandCapacityKw ? 'Roof Area' : 'Household Demand'
  };
}
