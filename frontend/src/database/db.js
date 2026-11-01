/**
 * GreenSaathi Client-Side Database Engine (greenSaathiDb)
 * 
 * Provides structured collections persisted in localStorage with safe schemas,
 * transactional CRUD operations, search filters, and JSON export/import.
 */
import { 
  SEED_BILLS, 
  SEED_DISTRICTS, 
  SEED_CITIZEN_ACTIVITY, 
  SEED_USER_PROFILE 
} from './dummyData';

const DB_STORAGE_KEY = 'greensaathi_db_v1';

class GreenSaathiDatabase {
  constructor() {
    this._init();
  }

  /**
   * Internal initialization: loads data from localStorage or seeds fresh database.
   */
  _init() {
    try {
      const raw = localStorage.getItem(DB_STORAGE_KEY);
      if (!raw) {
        this._state = this._getSeedState();
        this._save();
      } else {
        const parsed = JSON.parse(raw);
        this._state = {
          bills: Array.isArray(parsed.bills) ? parsed.bills : SEED_BILLS,
          districts: Array.isArray(parsed.districts) ? parsed.districts : SEED_DISTRICTS,
          activity: Array.isArray(parsed.activity) ? parsed.activity : SEED_CITIZEN_ACTIVITY,
          profile: parsed.profile ? parsed.profile : SEED_USER_PROFILE,
          meta: parsed.meta || { version: '1.0.0', lastUpdated: new Date().toISOString() }
        };
      }
    } catch (e) {
      console.warn('Database initialization failed, restoring seed state:', e);
      this._state = this._getSeedState();
      this._save();
    }
  }

  _getSeedState() {
    return {
      bills: JSON.parse(JSON.stringify(SEED_BILLS)),
      districts: JSON.parse(JSON.stringify(SEED_DISTRICTS)),
      activity: JSON.parse(JSON.stringify(SEED_CITIZEN_ACTIVITY)),
      profile: JSON.parse(JSON.stringify(SEED_USER_PROFILE)),
      meta: {
        version: '1.0.0',
        seededAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  _save() {
    try {
      this._state.meta.lastUpdated = new Date().toISOString();
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(this._state));
    } catch (err) {
      console.error('Database write error:', err);
    }
  }

  // ==========================================
  // 1. BILLING RECORDS COLLECTION
  // ==========================================
  bills = {
    getAll: () => {
      this._init();
      return [...this._state.bills];
    },

    getById: (id) => {
      this._init();
      return this._state.bills.find(b => b.id === id) || null;
    },

    add: (billData) => {
      this._init();
      const newBill = {
        id: `BILL-${Date.now().toString().slice(-6)}`,
        billNumber: billData.billNumber || `UG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        month: billData.month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        discom: billData.discom || 'UGVCL',
        consumerId: billData.consumerId || this._state.profile.consumerNumber,
        unitsKwh: Math.max(0, Number(billData.unitsKwh) || 0),
        billAmountInr: Math.max(0, Number(billData.billAmountInr) || 0),
        emissionsKg: Math.round((Math.max(0, Number(billData.unitsKwh) || 0) * 0.70) * 10) / 10,
        status: billData.status || 'Verified & Paid',
        paymentDate: billData.paymentDate || new Date().toISOString().split('T')[0],
        category: billData.category || 'Residential Domestic (R-LT)',
        tariffSlab: billData.tariffSlab || 'Slab 2 (101-250 kWh)'
      };

      // Add to front of bills list
      this._state.bills.unshift(newBill);
      this._save();
      return newBill;
    },

    delete: (id) => {
      this._init();
      const initialCount = this._state.bills.length;
      this._state.bills = this._state.bills.filter(b => b.id !== id);
      const changed = this._state.bills.length !== initialCount;
      if (changed) this._save();
      return changed;
    }
  };

  // ==========================================
  // 2. DISTRICT BENCHMARKS COLLECTION
  // ==========================================
  districts = {
    getAll: () => {
      this._init();
      return [...this._state.districts];
    },

    getById: (id) => {
      this._init();
      return this._state.districts.find(d => d.id === id) || null;
    }
  };

  // ==========================================
  // 3. CITIZEN ACTIVITY LOG COLLECTION
  // ==========================================
  activity = {
    getAll: () => {
      this._init();
      return [...this._state.activity];
    },

    add: (activityData) => {
      this._init();
      const newAct = {
        id: `ACT-${Date.now().toString().slice(-4)}`,
        citizenName: activityData.citizenName || this._state.profile.citizenName,
        district: activityData.district || this._state.profile.district,
        ward: activityData.ward || 'Sector 7',
        action: activityData.action,
        category: activityData.category || 'Mission LiFE Habit',
        pointsEarned: Math.max(0, Number(activityData.pointsEarned) || 10),
        timestamp: 'Just now',
        icon: activityData.icon || 'Sparkles'
      };

      this._state.activity.unshift(newAct);
      // Keep recent 20 activities
      if (this._state.activity.length > 20) {
        this._state.activity = this._state.activity.slice(0, 20);
      }
      this._save();
      return newAct;
    }
  };

  // ==========================================
  // 4. USER PROFILE COLLECTION
  // ==========================================
  profile = {
    get: () => {
      this._init();
      return { ...this._state.profile };
    },

    update: (updates) => {
      this._init();
      this._state.profile = { ...this._state.profile, ...updates };
      this._save();
      return { ...this._state.profile };
    }
  };

  // ==========================================
  // 5. DATABASE ADMINISTRATIVE UTILITIES
  // ==========================================
  resetToSeedData() {
    this._state = this._getSeedState();
    this._save();
    return true;
  }

  exportJSON() {
    this._init();
    return JSON.stringify(this._state, null, 2);
  }

  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.bills && parsed.districts) {
        this._state = {
          bills: parsed.bills,
          districts: parsed.districts,
          activity: parsed.activity || SEED_CITIZEN_ACTIVITY,
          profile: parsed.profile || SEED_USER_PROFILE,
          meta: { version: '1.0.0', importedAt: new Date().toISOString() }
        };
        this._save();
        return { success: true };
      }
      return { success: false, error: 'Invalid database JSON structure.' };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  getStats() {
    this._init();
    const bills = this._state.bills;
    const totalKwh = bills.reduce((acc, b) => acc + (b.unitsKwh || 0), 0);
    const totalSpend = bills.reduce((acc, b) => acc + (b.billAmountInr || 0), 0);
    const totalEmissions = bills.reduce((acc, b) => acc + (b.emissionsKg || 0), 0);

    return {
      totalBillsCount: bills.length,
      districtsCount: this._state.districts.length,
      activityLogsCount: this._state.activity.length,
      totalKwhTracked: totalKwh,
      totalSpendInr: totalSpend,
      totalEmissionsKg: Math.round(totalEmissions * 10) / 10,
      lastUpdated: this._state.meta.lastUpdated
    };
  }
}

// Export singleton instance
export const db = new GreenSaathiDatabase();
