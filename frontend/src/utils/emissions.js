/**
 * Carbon Footprint Calculation Utilities
 */
import { DEFAULT_EMISSION_FACTOR, KG_CO2_PER_TREE_PER_YEAR, REGIONAL_AVERAGE_KWH } from '../data/config';

/**
 * Validates that an input is a finite, non-negative number.
 * @param {any} value - The input value to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export function isValidConsumption(value) {
  if (value === null || value === undefined || value === '') return false;
  const num = Number(value);
  return !Number.isNaN(num) && Number.isFinite(num) && num >= 0;
}

/**
 * Calculates monthly and annual carbon emissions from electricity consumption.
 * Formula:
 *   Monthly Emissions (kg CO2e) = Monthly Consumption (kWh) * Emission Factor (kg CO2e/kWh)
 *   Annual Emissions (kg CO2e) = Monthly Emissions * 12
 * 
 * @param {number} monthlyKwh - Monthly electricity consumption in kilowatt-hours
 * @param {number} emissionFactor - Emission factor in kg CO2e/kWh (defaults to 0.7)
 * @returns {object} Calculated emission breakdown
 */
export function calculateEmissions(monthlyKwh, emissionFactor = DEFAULT_EMISSION_FACTOR) {
  const kwh = Math.max(0, Number(monthlyKwh) || 0);
  const factor = Math.max(0, Number(emissionFactor) || DEFAULT_EMISSION_FACTOR);

  const monthlyEmissions = Math.round((kwh * factor) * 10) / 10;
  const annualEmissions = Math.round((monthlyEmissions * 12) * 10) / 10;
  
  // Estimate number of mature trees required to absorb annual emissions
  const treesNeeded = annualEmissions > 0 ? Math.max(1, Math.round(annualEmissions / KG_CO2_PER_TREE_PER_YEAR)) : 0;

  // Compare against Gujarat urban average (210 kWh)
  const differenceFromAverage = kwh > 0 ? Math.round(((kwh - REGIONAL_AVERAGE_KWH) / REGIONAL_AVERAGE_KWH) * 100) : -100;

  return {
    monthlyKwh: kwh,
    emissionFactor: factor,
    monthlyEmissionsKg: monthlyEmissions,
    annualEmissionsKg: annualEmissions,
    annualEmissionsTonnes: Math.round((annualEmissions / 1000) * 100) / 100,
    treesNeeded,
    differenceFromAverage, // e.g. -14% or +25%
    isLowerThanAverage: differenceFromAverage <= 0
  };
}
