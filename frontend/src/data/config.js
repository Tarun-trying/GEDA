/**
 * GreenSaathi Configuration Constants & Assumptions
 * 
 * NOTE FOR REVIEWERS & HACKATHON JUDGES:
 * All emission factors, tariffs, and solar coefficients below are illustrative
 * configuration parameters designed for this Mission LiFE prototype demonstration.
 * They can be adjusted here without modifying UI components.
 */

// 1. Carbon Emission Factors
// Illustrative Gujarat grid average emission intensity in kg CO2e per kWh
// Official CEA CO2 baseline database varies across states; 0.70 is an illustrative baseline.
export const DEFAULT_EMISSION_FACTOR = 0.70; // kg CO2e / kWh

// Approximate CO2 absorption of one mature tree per year in kg
export const KG_CO2_PER_TREE_PER_YEAR = 20;

// Benchmark Gujarat urban household average monthly consumption (kWh)
export const REGIONAL_AVERAGE_KWH = 210;

// 2. Solar Estimation Parameters (GEDA / Mission LiFE illustrative values)
export const SOLAR_CONFIG = {
  // Approximate usable roof area required per kW of solar PV (in sq. metres)
  ROOF_SQM_PER_KW: 10,

  // Approximate solar electricity generation per kW installed per month (in kWh)
  // Gujarat boasts high solar irradiance (~5.5 - 6.0 kWh/m²/day), yielding ~120 kWh/kW/month.
  MONTHLY_KWH_PER_KW: 120,

  // Illustrative installation cost per kW in INR (before any state/central subsidies)
  DEFAULT_INSTALLATION_COST_PER_KW: 50000, // ₹50,000 / kW

  // Illustrative weighted residential electricity tariff in INR per kWh
  DEFAULT_TARIFF_PER_KWH: 6.50, // ₹6.50 / kWh

  // Maximum recommended capacity ceiling for typical residential demo (in kW)
  MAX_RECOMMENDED_CAPACITY_KW: 10,
  
  // Minimum solar installation unit in kW
  MIN_CAPACITY_KW: 1
};

// 3. User tier thresholds for Green Points
export const TIERS = [
  { name: 'Prakriti Mitr (Nature Friend)', minPoints: 0, badge: '🌱' },
  { name: 'Urja Guardian (Energy Saver)', minPoints: 30, badge: '⚡' },
  { name: 'Surya Ratna (Solar Champion)', minPoints: 60, badge: '☀️' },
];

// 4. Default Clean Profile Values (Wiped to Zero Slate)
export const DEFAULT_USER_DATA = {
  monthlyKwh: 0,
  monthlyBill: 0,
  totalPoints: 0,
  completedChallenges: [],
  solarInput: {
    monthlyKwh: 0,
    roofAreaSqm: 0,
    customCostPerKw: 50000
  }
};
