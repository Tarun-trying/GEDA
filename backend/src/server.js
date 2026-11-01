import express from 'express';
import cors from 'cors';
import { serverDb } from './database/db.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'GreenSaathi GEDA Mission LiFE API',
    timestamp: new Date().toISOString()
  });
});

// 2. Bills Endpoints
app.get('/api/bills', (req, res) => {
  let bills = serverDb.getBills();
  const { discom, search } = req.query;

  if (discom && discom !== 'all') {
    bills = bills.filter(b => b.discom === discom);
  }
  if (search) {
    const q = search.toLowerCase();
    bills = bills.filter(b => 
      b.month.toLowerCase().includes(q) || 
      b.billNumber.toLowerCase().includes(q)
    );
  }

  res.json(bills);
});

app.post('/api/bills', (req, res) => {
  const { month, unitsKwh, billAmountInr, discom } = req.body;
  if (unitsKwh === undefined || Number(unitsKwh) < 0) {
    return res.status(400).json({ error: 'Valid unitsKwh is required.' });
  }

  const createdBill = serverDb.addBill({
    month,
    unitsKwh: Number(unitsKwh),
    billAmountInr: Number(billAmountInr) || 0,
    discom
  });

  res.status(201).json(createdBill);
});

app.delete('/api/bills/:id', (req, res) => {
  const deleted = serverDb.deleteBill(req.params.id);
  if (deleted) {
    res.json({ success: true, message: 'Bill record removed' });
  } else {
    res.status(404).json({ error: 'Bill record not found' });
  }
});

// 3. Districts Leaderboard Endpoints
app.get('/api/districts', (req, res) => {
  const districts = serverDb.getDistricts();
  res.json(districts);
});

app.get('/api/districts/:id', (req, res) => {
  const district = serverDb.getDistrictById(req.params.id);
  if (district) {
    res.json(district);
  } else {
    res.status(404).json({ error: 'District not found' });
  }
});

// 4. Challenges Endpoints
app.get('/api/challenges', (req, res) => {
  const challenges = serverDb.getChallenges();
  res.json(challenges);
});

app.post('/api/challenges/:id/complete', (req, res) => {
  const result = serverDb.completeChallenge(req.params.id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

// 5. Citizen Activity Feed Endpoints
app.get('/api/activity', (req, res) => {
  const activities = serverDb.getActivity();
  res.json(activities);
});

app.post('/api/activity', (req, res) => {
  const { action, category, pointsEarned, citizenName, district } = req.body;
  if (!action) {
    return res.status(400).json({ error: 'Action description is required.' });
  }

  const newActivity = serverDb.addActivity({
    action,
    category,
    pointsEarned,
    citizenName,
    district
  });

  res.status(201).json(newActivity);
});

// 6. User Profile Endpoints
app.get('/api/profile', (req, res) => {
  const profile = serverDb.getProfile();
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const updated = serverDb.updateProfile(req.body);
  res.json(updated);
});

// 7. Calculations Endpoints
app.post('/api/calculate/emissions', (req, res) => {
  const { monthlyKwh, emissionFactor = 0.70 } = req.body;
  const kwh = Math.max(0, Number(monthlyKwh) || 0);
  const factor = Math.max(0, Number(emissionFactor) || 0.70);

  const monthlyEmissions = Math.round((kwh * factor) * 10) / 10;
  const annualEmissions = Math.round((monthlyEmissions * 12) * 10) / 10;
  const treesNeeded = Math.max(1, Math.round(annualEmissions / 20));
  const diffFromAvg = Math.round(((kwh - 210) / 210) * 100);

  res.json({
    monthlyKwh: kwh,
    emissionFactor: factor,
    monthlyEmissionsKg: monthlyEmissions,
    annualEmissionsKg: annualEmissions,
    annualEmissionsTonnes: Math.round((annualEmissions / 1000) * 100) / 100,
    treesNeeded,
    differenceFromAverage: diffFromAvg,
    isLowerThanAverage: diffFromAvg <= 0
  });
});

app.post('/api/calculate/solar', (req, res) => {
  const { 
    monthlyKwh = 180, 
    roofAreaSqm = 30, 
    costPerKw = 50000, 
    tariff = 6.50 
  } = req.body;

  const kwh = Math.max(0, Number(monthlyKwh) || 0);
  const area = Math.max(0, Number(roofAreaSqm) || 0);
  const numCost = Math.max(1000, Number(costPerKw) || 50000);
  const numTariff = Math.max(0.5, Number(tariff) || 6.50);

  const roofCap = area > 0 ? area / 10 : 0;
  const demandCap = kwh > 0 ? kwh / 120 : 0;
  const recommendedKw = Math.round(Math.min(roofCap, demandCap) * 10) / 10;

  const monthlyGen = Math.round(recommendedKw * 120);
  const annualGen = monthlyGen * 12;
  const energyOffset = Math.min(monthlyGen, kwh);
  const monthlySavings = Math.round(energyOffset * numTariff);
  const annualSavings = monthlySavings * 12;
  const estimatedCost = Math.round(recommendedKw * numCost);
  const paybackYears = annualSavings > 0 ? Math.round((estimatedCost / annualSavings) * 10) / 10 : null;
  const annualCo2Avoided = Math.round(annualGen * 0.70);

  res.json({
    capacityKw: recommendedKw,
    roofCapacityKw: Math.round(roofCap * 10) / 10,
    demandCapacityKw: Math.round(demandCap * 10) / 10,
    monthlyGenerationKwh: monthlyGen,
    annualGenerationKwh: annualGen,
    monthlySavingsInr: monthlySavings,
    annualSavingsInr: annualSavings,
    estimatedInstallationCostInr: estimatedCost,
    paybackYears,
    annualCo2AvoidedKg: annualCo2Avoided
  });
});

// 8. Database Administration
app.get('/api/db/stats', (req, res) => {
  res.json(serverDb.getStats());
});

app.post('/api/db/reset', (req, res) => {
  serverDb.resetDatabase();
  res.json({ success: true, message: 'Database reset to default seed data' });
});

app.get('/api/db/export', (req, res) => {
  res.json(serverDb.exportData());
});

app.post('/api/db/import', (req, res) => {
  const result = serverDb.importData(req.body);
  if (result.success) {
    res.json({ success: true, message: 'Database successfully imported' });
  } else {
    res.status(400).json(result);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`GreenSaathi Backend API Server listening on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
