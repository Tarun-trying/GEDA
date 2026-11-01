import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  SEED_BILLS, 
  SEED_DISTRICTS, 
  SEED_CHALLENGES, 
  SEED_CITIZEN_ACTIVITY, 
  SEED_USER_PROFILE 
} from '../data/dummyData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class FileDatabase {
  constructor() {
    this._ensureStorage();
    this.reload();
  }

  _ensureStorage() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      this._state = this._getSeedState();
      this._save();
    }
  }

  _getSeedState() {
    return {
      bills: JSON.parse(JSON.stringify(SEED_BILLS)),
      districts: JSON.parse(JSON.stringify(SEED_DISTRICTS)),
      challenges: JSON.parse(JSON.stringify(SEED_CHALLENGES)),
      activity: JSON.parse(JSON.stringify(SEED_CITIZEN_ACTIVITY)),
      profile: JSON.parse(JSON.stringify(SEED_USER_PROFILE)),
      meta: {
        engine: 'GreenSaathi File-Backed JSON DB',
        version: '1.0.0',
        seededAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }
    };
  }

  reload() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this._state = JSON.parse(raw);
      } else {
        this._state = this._getSeedState();
        this._save();
      }
    } catch (err) {
      console.warn('Error reading database file, restoring seeds:', err);
      this._state = this._getSeedState();
      this._save();
    }
  }

  _save() {
    try {
      this._state.meta.lastUpdated = new Date().toISOString();
      fs.writeFileSync(DB_FILE, JSON.stringify(this._state, null, 2), 'utf-8');
    } catch (err) {
      console.error('Database file write failed:', err);
    }
  }

  // ==========================================
  // Bills Collection
  // ==========================================
  getBills() {
    this.reload();
    return [...this._state.bills];
  }

  addBill(bill) {
    this.reload();
    const newBill = {
      id: `BILL-${Date.now().toString().slice(-6)}`,
      billNumber: bill.billNumber || `UG-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
      month: bill.month || new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
      discom: bill.discom || 'UGVCL',
      consumerId: bill.consumerId || this._state.profile.consumerNumber,
      unitsKwh: Math.max(0, Number(bill.unitsKwh) || 0),
      billAmountInr: Math.max(0, Number(bill.billAmountInr) || 0),
      emissionsKg: Math.round((Math.max(0, Number(bill.unitsKwh) || 0) * 0.70) * 10) / 10,
      status: bill.status || 'Verified & Paid',
      paymentDate: bill.paymentDate || new Date().toISOString().split('T')[0],
      category: bill.category || 'Residential Domestic (R-LT)',
      tariffSlab: bill.tariffSlab || 'Slab 2 (101-250 kWh)'
    };

    this._state.bills.unshift(newBill);
    this._save();
    return newBill;
  }

  deleteBill(id) {
    this.reload();
    const beforeCount = this._state.bills.length;
    this._state.bills = this._state.bills.filter(b => b.id !== id);
    const deleted = this._state.bills.length !== beforeCount;
    if (deleted) this._save();
    return deleted;
  }

  // ==========================================
  // Districts Collection
  // ==========================================
  getDistricts() {
    this.reload();
    return [...this._state.districts];
  }

  getDistrictById(id) {
    this.reload();
    return this._state.districts.find(d => d.id === id) || null;
  }

  // ==========================================
  // Challenges Collection
  // ==========================================
  getChallenges() {
    this.reload();
    return [...this._state.challenges];
  }

  completeChallenge(id) {
    this.reload();
    const challenge = this._state.challenges.find(c => c.id === id);
    if (!challenge) return { success: false, message: 'Challenge not found' };

    if (this._state.profile.completedChallenges.includes(id)) {
      return { success: false, message: 'Challenge already completed' };
    }

    this._state.profile.completedChallenges.push(id);
    this._state.profile.totalPoints += challenge.points;

    // Log in activity
    this._state.activity.unshift({
      id: `ACT-${Date.now().toString().slice(-4)}`,
      citizenName: this._state.profile.citizenName,
      district: this._state.profile.district,
      ward: 'Sector 7',
      action: `Completed challenge: ${challenge.title}`,
      category: challenge.category,
      pointsEarned: challenge.points,
      timestamp: 'Just now',
      icon: challenge.iconName
    });

    this._save();
    return {
      success: true,
      pointsAwarded: challenge.points,
      totalPoints: this._state.profile.totalPoints,
      completedChallenges: this._state.profile.completedChallenges
    };
  }

  // ==========================================
  // Activity Feed Collection
  // ==========================================
  getActivity() {
    this.reload();
    return [...this._state.activity];
  }

  addActivity(act) {
    this.reload();
    const newAct = {
      id: `ACT-${Date.now().toString().slice(-4)}`,
      citizenName: act.citizenName || this._state.profile.citizenName,
      district: act.district || this._state.profile.district,
      ward: act.ward || 'Sector 7',
      action: act.action,
      category: act.category || 'Mission LiFE Habit',
      pointsEarned: Math.max(0, Number(act.pointsEarned) || 10),
      timestamp: 'Just now',
      icon: act.icon || 'Sparkles'
    };

    this._state.activity.unshift(newAct);
    if (this._state.activity.length > 25) {
      this._state.activity = this._state.activity.slice(0, 25);
    }
    this._save();
    return newAct;
  }

  // ==========================================
  // User Profile
  // ==========================================
  getProfile() {
    this.reload();
    return { ...this._state.profile };
  }

  updateProfile(updates) {
    this.reload();
    this._state.profile = { ...this._state.profile, ...updates };
    this._save();
    return { ...this._state.profile };
  }

  // ==========================================
  // Admin & Seed Management
  // ==========================================
  resetDatabase() {
    this._state = this._getSeedState();
    this._save();
    return true;
  }

  exportData() {
    this.reload();
    return this._state;
  }

  importData(data) {
    if (data && data.bills && data.districts) {
      this._state = {
        bills: data.bills,
        districts: data.districts,
        challenges: data.challenges || SEED_CHALLENGES,
        activity: data.activity || SEED_CITIZEN_ACTIVITY,
        profile: data.profile || SEED_USER_PROFILE,
        meta: {
          engine: 'GreenSaathi File-Backed JSON DB',
          version: '1.0.0',
          importedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        }
      };
      this._save();
      return { success: true };
    }
    return { success: false, error: 'Invalid schema' };
  }

  getStats() {
    this.reload();
    const bills = this._state.bills;
    const totalKwh = bills.reduce((acc, b) => acc + (b.unitsKwh || 0), 0);
    const totalSpend = bills.reduce((acc, b) => acc + (b.billAmountInr || 0), 0);
    const totalEmissions = bills.reduce((acc, b) => acc + (b.emissionsKg || 0), 0);

    return {
      billsCount: bills.length,
      districtsCount: this._state.districts.length,
      challengesCount: this._state.challenges.length,
      activityCount: this._state.activity.length,
      totalKwhTracked: totalKwh,
      totalSpendInr: totalSpend,
      totalEmissionsKg: Math.round(totalEmissions * 10) / 10,
      databaseFile: DB_FILE,
      lastUpdated: this._state.meta.lastUpdated
    };
  }
}

export const serverDb = new FileDatabase();
