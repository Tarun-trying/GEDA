/**
 * LocalStorage Persistence Utilities for GreenSaathi
 * 
 * Handles safe read, write, validation, and demo data reset.
 * NOTE: Data is stored strictly on the local browser client and is not synchronized
 * across separate devices or cloud servers.
 */
import { DEFAULT_USER_DATA } from '../data/config';

const STORAGE_KEY = 'greensaathi_state_v1';

/**
 * Loads application state from localStorage with safe fallback to defaults.
 * @returns {object} Application state
 */
export function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_USER_DATA };
    }

    const parsed = JSON.parse(raw);

    // Validate and sanitize parsed state
    return {
      monthlyKwh: typeof parsed.monthlyKwh === 'number' && parsed.monthlyKwh >= 0 
        ? parsed.monthlyKwh 
        : DEFAULT_USER_DATA.monthlyKwh,
      monthlyBill: typeof parsed.monthlyBill === 'number' && parsed.monthlyBill >= 0 
        ? parsed.monthlyBill 
        : DEFAULT_USER_DATA.monthlyBill,
      totalPoints: typeof parsed.totalPoints === 'number' && parsed.totalPoints >= 0 
        ? parsed.totalPoints 
        : DEFAULT_USER_DATA.totalPoints,
      completedChallenges: Array.isArray(parsed.completedChallenges) 
        ? parsed.completedChallenges 
        : DEFAULT_USER_DATA.completedChallenges,
      solarInput: {
        monthlyKwh: parsed.solarInput && typeof parsed.solarInput.monthlyKwh === 'number'
          ? parsed.solarInput.monthlyKwh
          : (parsed.monthlyKwh || DEFAULT_USER_DATA.solarInput.monthlyKwh),
        roofAreaSqm: parsed.solarInput && typeof parsed.solarInput.roofAreaSqm === 'number'
          ? parsed.solarInput.roofAreaSqm
          : DEFAULT_USER_DATA.solarInput.roofAreaSqm,
        customCostPerKw: parsed.solarInput && typeof parsed.solarInput.customCostPerKw === 'number'
          ? parsed.solarInput.customCostPerKw
          : DEFAULT_USER_DATA.solarInput.customCostPerKw
      }
    };
  } catch (err) {
    console.warn('Failed to parse GreenSaathi localStorage data, falling back to defaults:', err);
    return { ...DEFAULT_USER_DATA };
  }
}

/**
 * Saves application state to localStorage safely.
 * @param {object} state - Full or partial state to persist
 */
export function saveState(state) {
  try {
    const current = loadSavedState();
    const updated = {
      ...current,
      ...state,
      solarInput: {
        ...current.solarInput,
        ...(state.solarInput || {})
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Could not save to localStorage:', err);
  }
}

/**
 * Resets application state back to clean default demonstration values.
 * @returns {object} Default state
 */
export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing localStorage:', err);
  }
  return { ...DEFAULT_USER_DATA };
}
