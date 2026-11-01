/**
 * GreenSaathi Frontend API Client
 * 
 * Communicates with the Express backend on http://localhost:5000/api.
 * Includes automatic graceful fallback to client-side database if offline.
 */
import { db } from '../database/db';

const API_BASE_URL = 'http://localhost:5000/api';

async function safeFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    // Return null on failure so caller can fall back to local database
    return null;
  }
}

export const api = {
  // Health
  checkHealth: async () => {
    return await safeFetch('/health');
  },

  // Bills
  getBills: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const remote = await safeFetch(`/bills?${query}`);
    if (remote) return remote;
    // Fallback
    return db.bills.getAll();
  },

  addBill: async (billData) => {
    const remote = await safeFetch('/bills', {
      method: 'POST',
      body: JSON.stringify(billData)
    });
    if (remote) {
      db.bills.add(billData); // keep local in sync
      return remote;
    }
    return db.bills.add(billData);
  },

  deleteBill: async (id) => {
    const remote = await safeFetch(`/bills/${id}`, { method: 'DELETE' });
    db.bills.delete(id);
    return remote ? remote.success : true;
  },

  // Districts
  getDistricts: async () => {
    const remote = await safeFetch('/districts');
    if (remote) return remote;
    return db.districts.getAll();
  },

  // Challenges
  getChallenges: async () => {
    const remote = await safeFetch('/challenges');
    if (remote) return remote;
    return null;
  },

  completeChallenge: async (id) => {
    const remote = await safeFetch(`/challenges/${id}/complete`, { method: 'POST' });
    return remote;
  },

  // Activity Feed
  getActivity: async () => {
    const remote = await safeFetch('/activity');
    if (remote) return remote;
    return db.activity.getAll();
  },

  addActivity: async (actData) => {
    const remote = await safeFetch('/activity', {
      method: 'POST',
      body: JSON.stringify(actData)
    });
    db.activity.add(actData);
    return remote || actData;
  },

  // Database Administration
  getStats: async () => {
    const remote = await safeFetch('/db/stats');
    if (remote) return remote;
    return db.getStats();
  },

  resetDatabase: async () => {
    const remote = await safeFetch('/db/reset', { method: 'POST' });
    db.resetToSeedData();
    return remote ? remote.success : true;
  }
};
