import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Receipt, 
  BarChart3, 
  Activity, 
  Settings, 
  Plus, 
  Trash2, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  Search, 
  Filter, 
  ShieldCheck, 
  Zap, 
  Sun, 
  MapPin, 
  Calendar, 
  IndianRupee,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { db } from '../database/db';

export default function CivicDatabase({ onNavigate }) {
  const [activeSubTab, setActiveSubTab] = useState('bills'); // 'bills', 'districts', 'activity', 'manage'
  const [bills, setBills] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [activity, setActivity] = useState([]);
  const [stats, setStats] = useState({});
  const [discomFilter, setDiscomFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // New Bill Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMonth, setNewMonth] = useState('June 2025');
  const [newKwh, setNewKwh] = useState('175');
  const [newAmount, setNewAmount] = useState('1220');
  const [newDiscom, setNewDiscom] = useState('UGVCL');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // JSON Raw Editor State
  const [jsonText, setJsonText] = useState('');

  // Load database collections
  const refreshDb = () => {
    setBills(db.bills.getAll());
    setDistricts(db.districts.getAll());
    setActivity(db.activity.getAll());
    setStats(db.getStats());
  };

  useEffect(() => {
    refreshDb();
  }, []);

  // Handle Add New Bill
  const handleAddBill = (e) => {
    e.preventDefault();
    if (!newKwh || Number(newKwh) <= 0) return;

    db.bills.add({
      month: newMonth,
      unitsKwh: Number(newKwh),
      billAmountInr: Number(newAmount) || 0,
      discom: newDiscom
    });

    db.activity.add({
      action: `Logged ${newMonth} bill: ${newKwh} kWh (${newDiscom})`,
      category: 'Energy Audit',
      pointsEarned: 25
    });

    setShowAddModal(false);
    refreshDb();
    setFeedbackMsg('New bill successfully inserted into the database!');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Handle Delete Bill
  const handleDeleteBill = (id) => {
    db.bills.delete(id);
    refreshDb();
    setFeedbackMsg('Record removed from local database.');
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Reset to original seed dummy data
  const handleResetData = () => {
    db.resetToSeedData();
    refreshDb();
    setFeedbackMsg('Database restored to default Gujarat demonstration seed data.');
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  // Export Database to JSON File
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(db.exportJSON());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `greensaathi_db_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Database from JSON String
  const handleImportJSON = () => {
    if (!jsonText.trim()) return;
    const res = db.importJSON(jsonText);
    if (res.success) {
      refreshDb();
      setFeedbackMsg('Database imported successfully from JSON!');
      setJsonText('');
    } else {
      alert(`Import failed: ${res.error}`);
    }
  };

  // Filtered Bills
  const filteredBills = bills.filter(b => {
    const matchesDiscom = discomFilter === 'all' || b.discom === discomFilter;
    const matchesQuery = b.month.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         b.billNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDiscom && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Feedback Banner */}
      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-emerald-700 text-white text-xs font-semibold shadow-md flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>Client-Side Civic Database Engine</span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-primary tracking-tight">
              Gujarat Civic Energy Database & Benchmarks
            </h1>
            <p className="text-sm text-on-surface-variant mt-1 max-w-2xl leading-relaxed">
              Real-time structured collections storing monthly smart meter billing logs, Gujarat 33-district benchmarks, and citizen Mission LiFE activity logs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              onClick={handleResetData}
              className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Database Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Billing Records
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-primary">{stats.totalBillsCount || 0}</span>
            <span className="text-xs text-on-surface-variant">Months</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
            {stats.totalKwhTracked || 0} kWh Tracked
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Total Spend Tracked
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-primary">₹{(stats.totalSpendInr || 0).toLocaleString('en-IN')}</span>
          </div>
          <span className="text-[11px] text-on-surface-variant block mt-0.5">
            Electricity Tariffs
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            Carbon Tracked
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-amber-800">{stats.totalEmissionsKg || 0}</span>
            <span className="text-xs text-on-surface-variant">kg CO₂e</span>
          </div>
          <span className="text-[11px] text-amber-700 font-semibold block mt-0.5">
            ~{Math.round(((stats.totalEmissionsKg || 0) / 20))} Trees Equivalent
          </span>
        </div>

        <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-container shadow-xs">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider block">
            District Benchmarks
          </span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="font-headline font-bold text-2xl text-primary">{stats.districtsCount || 0}</span>
            <span className="text-xs text-on-surface-variant">Hubs</span>
          </div>
          <span className="text-[11px] text-primary-container font-semibold block mt-0.5">
            #1 Gandhinagar (94.2)
          </span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="bg-surface-container-lowest rounded-2xl p-2 border border-surface-container/80 shadow-xs flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActiveSubTab('bills')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'bills'
              ? 'bg-primary-container text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Smart Meter Bills ({bills.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('districts')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'districts'
              ? 'bg-primary-container text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Gujarat District Leaderboard ({districts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activity')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'activity'
              ? 'bg-primary-container text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Civic Activity Stream ({activity.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('manage')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'manage'
              ? 'bg-primary-container text-white shadow-xs'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Database Engine & JSON</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: BILLING RECORDS DATABASE */}
      {/* ========================================================= */}
      {activeSubTab === 'bills' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container-low">
            <div className="flex items-center gap-2">
              <h2 className="font-headline font-bold text-lg text-on-surface">
                Household Electricity Billing Records
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                DISCOM Smart Meter Sync
              </span>
            </div>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-colors flex items-center gap-1.5 shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Billing Record</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-container-low p-3 rounded-xl">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-on-surface-variant/70" />
              <input
                type="text"
                placeholder="Search month or bill #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-surface-container-high bg-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-on-surface-variant shrink-0">DISCOM:</span>
              <select
                value={discomFilter}
                onChange={(e) => setDiscomFilter(e.target.value)}
                className="w-full bg-white text-xs font-semibold rounded-lg px-2.5 py-1.5 border border-surface-container-high focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Gujarat DISCOMs</option>
                <option value="UGVCL">UGVCL (Uttar Gujarat)</option>
                <option value="DGVCL">DGVCL (Dakshin Gujarat)</option>
                <option value="MGVCL">MGVCL (Madhya Gujarat)</option>
                <option value="PGVCL">PGVCL (Paschim Gujarat)</option>
                <option value="Torrent Power">Torrent Power</option>
              </select>
            </div>

            <div className="text-right text-xs text-on-surface-variant flex items-center justify-end font-medium">
              Showing {filteredBills.length} of {bills.length} stored records
            </div>
          </div>

          {/* Billing Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Bill Number</th>
                  <th className="py-3 px-3">Billing Month</th>
                  <th className="py-3 px-3">DISCOM</th>
                  <th className="py-3 px-3">Units (kWh)</th>
                  <th className="py-3 px-3">Amount (INR)</th>
                  <th className="py-3 px-3">Carbon (kg CO₂e)</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {bill.billNumber}
                    </td>
                    <td className="py-3 px-3 font-semibold text-on-surface">
                      {bill.month}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-bold text-[10px]">
                        {bill.discom}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-on-surface">
                      {bill.unitsKwh} kWh
                    </td>
                    <td className="py-3 px-3 font-bold text-primary">
                      ₹{bill.billAmountInr.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-amber-800 font-semibold">
                      {bill.emissionsKg} kg
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        {bill.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteBill(bill.id)}
                        title="Delete record from local database"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: GUJARAT DISTRICT LEADERBOARD */}
      {/* ========================================================= */}
      {activeSubTab === 'districts' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-surface-container-low">
            <div>
              <h2 className="font-headline font-bold text-lg text-on-surface">
                Gujarat District Energy Benchmarks
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Official Mission LiFE compliance and renewable rooftop solar adoption across Gujarat
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold">
              Ranked by LiFE Index
            </span>
          </div>

          {/* Top 3 Podium Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {districts.slice(0, 3).map((d, idx) => (
              <div 
                key={d.id} 
                className={`p-5 rounded-2xl border relative overflow-hidden ${
                  idx === 0 
                    ? 'bg-gradient-to-br from-emerald-50 to-primary-fixed/20 border-emerald-300' 
                    : idx === 1 
                    ? 'bg-gradient-to-br from-amber-50 to-amber-100/30 border-amber-300' 
                    : 'bg-surface-container-low border-surface-container'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    idx === 0 ? 'bg-emerald-600 text-white' : idx === 1 ? 'bg-amber-500 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    Rank #{d.rank}
                  </span>
                  <span className="text-xs font-bold text-primary font-headline">
                    Score: {d.lifeIndex} / 100
                  </span>
                </div>

                <h3 className="font-headline font-bold text-xl text-primary mt-1">
                  {d.name}
                </h3>
                <span className="text-xs text-on-surface-variant block mb-3 font-medium">
                  {d.zone}
                </span>

                <div className="space-y-1.5 text-xs bg-white/70 p-3 rounded-xl border border-white">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Rooftop Solar:</span>
                    <span className="font-bold text-amber-800">{d.rooftopSolarMw} MW ({d.rooftopCount.toLocaleString('en-IN')} roofs)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">CO₂ Offset:</span>
                    <span className="font-bold text-emerald-700">{d.co2OffsetTonnes.toLocaleString('en-IN')} tonnes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Citizens Engaged:</span>
                    <span className="font-bold text-on-surface">{d.citizensEngaged.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <p className="text-[11px] text-primary font-medium mt-3 italic">
                  "{d.highlight}"
                </p>
              </div>
            ))}
          </div>

          {/* Full District Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-surface-container bg-surface-container-low text-on-surface-variant font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-3">District</th>
                  <th className="py-3 px-3">LiFE Energy Index</th>
                  <th className="py-3 px-3">Rooftop Solar PV</th>
                  <th className="py-3 px-3">Annual CO₂ Offset</th>
                  <th className="py-3 px-3">Citizens Active</th>
                  <th className="py-3 px-3">Avg Household Usage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container-low">
                {districts.map((d) => (
                  <tr key={d.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-primary">
                      #{d.rank}
                    </td>
                    <td className="py-3 px-3 font-semibold text-on-surface">
                      {d.name} <span className="text-[10px] text-on-surface-variant/70 font-normal">({d.zone})</span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {d.lifeIndex} / 100
                    </td>
                    <td className="py-3 px-3 font-bold text-amber-800">
                      {d.rooftopSolarMw} MW
                    </td>
                    <td className="py-3 px-3 text-on-surface font-semibold">
                      {d.co2OffsetTonnes.toLocaleString('en-IN')} tonnes
                    </td>
                    <td className="py-3 px-3 text-primary-container font-semibold">
                      {d.citizensEngaged.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-3 text-on-surface-variant">
                      {d.avgKwhPerHousehold} kWh / mo
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 3: CITIZEN ACTIVITY LOG */}
      {/* ========================================================= */}
      {activeSubTab === 'activity' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
            <div>
              <h2 className="font-headline font-bold text-lg text-on-surface">
                Live Gujarat Civic Activity Stream
              </h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Real-time self-reported citizen actions and energy conservation milestones
              </p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          <div className="space-y-3">
            {activity.map((act) => (
              <div 
                key={act.id} 
                className="p-4 rounded-xl bg-surface-container-low/60 border border-surface-container flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-on-surface">{act.citizenName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-medium">
                        {act.district} • {act.ward}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface font-semibold mt-1">
                      {act.action}
                    </p>
                    <span className="text-[10px] text-gray-500 mt-0.5 block">
                      Category: {act.category} • {act.timestamp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold">
                    +{act.pointsEarned} Points
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 4: DATABASE ENGINE & JSON MANAGEMENT */}
      {/* ========================================================= */}
      {activeSubTab === 'manage' && (
        <div className="bg-surface-container-lowest rounded-2xl p-6 border border-surface-container/80 shadow-sm space-y-5">
          <div>
            <h2 className="font-headline font-bold text-lg text-on-surface">
              Client-Side Database Engine & JSON Manager
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Inspect raw collections, perform database backups, or import custom JSON payloads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Backup & Reset */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container space-y-4">
              <h3 className="font-bold text-sm text-primary">Database Backup & Recovery</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Download a complete, offline JSON snapshot of the entire database including all user bills, district tables, and activity records.
              </p>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-container transition-colors flex items-center justify-center gap-2 shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full JSON Snapshot</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetData}
                  className="w-full py-2.5 px-4 rounded-xl bg-white border border-red-200 text-red-700 hover:bg-red-50 font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Restore Factory Gujarat Seed Data</span>
                </button>
              </div>
            </div>

            {/* Right: Import JSON */}
            <div className="p-5 rounded-2xl bg-surface-container-low border border-surface-container space-y-4">
              <h3 className="font-bold text-sm text-primary">Import Database JSON</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Paste valid GreenSaathi database JSON below to overwrite and restore the state:
              </p>

              <textarea
                rows="4"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                placeholder='Paste {"bills": [...], "districts": [...]} here...'
                className="w-full p-2.5 rounded-xl border border-surface-container-high bg-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-primary"
              />

              <button
                type="button"
                onClick={handleImportJSON}
                className="w-full py-2.5 px-4 rounded-xl bg-primary-container text-white font-bold text-xs hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Upload className="w-4 h-4" />
                <span>Import & Overwrite Database</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW BILL RECORD */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-surface-container">
            <h3 className="font-headline font-bold text-lg text-primary mb-1">
              Add New Electricity Bill
            </h3>
            <p className="text-xs text-on-surface-variant mb-4">
              Insert an electricity billing cycle into the local database
            </p>

            <form onSubmit={handleAddBill} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Billing Month & Year
                </label>
                <input
                  type="text"
                  value={newMonth}
                  onChange={(e) => setNewMonth(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-primary"
                  placeholder="e.g. June 2025"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Electricity Consumption (kWh)
                </label>
                <input
                  type="number"
                  min="1"
                  value={newKwh}
                  onChange={(e) => setNewKwh(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Total Bill Amount (INR)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface uppercase mb-1">
                  Select DISCOM
                </label>
                <select
                  value={newDiscom}
                  onChange={(e) => setNewDiscom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs font-semibold focus:ring-2 focus:ring-primary"
                >
                  <option value="UGVCL">UGVCL (Uttar Gujarat)</option>
                  <option value="DGVCL">DGVCL (Dakshin Gujarat)</option>
                  <option value="MGVCL">MGVCL (Madhya Gujarat)</option>
                  <option value="PGVCL">PGVCL (Paschim Gujarat)</option>
                  <option value="Torrent Power">Torrent Power</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-container rounded-lg shadow-xs"
                >
                  Insert Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
