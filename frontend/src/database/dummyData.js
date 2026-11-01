/**
 * GreenSaathi Gujarat Data Specifications (Clean Initial State)
 */

export const SEED_BILLS = [];

export const SEED_DISTRICTS = [
  {
    id: 'gandhinagar',
    name: 'Gandhinagar',
    zone: 'Capital Green Zone',
    rank: 1,
    lifeIndex: 94.2,
    co2OffsetTonnes: 18400,
    rooftopSolarMw: 28.5,
    rooftopCount: 14200,
    citizensEngaged: 38200,
    avgKwhPerHousehold: 178,
    highlight: 'Lowest per-capita grid emissions in urban Gujarat'
  },
  {
    id: 'surat',
    name: 'Surat',
    zone: 'South Gujarat Industrial Corridor',
    rank: 2,
    lifeIndex: 92.8,
    co2OffsetTonnes: 24100,
    rooftopSolarMw: 42.5,
    rooftopCount: 42500,
    citizensEngaged: 62500,
    avgKwhPerHousehold: 194,
    highlight: 'Highest total residential rooftop solar PV installations'
  },
  {
    id: 'ahmedabad',
    name: 'Ahmedabad',
    zone: 'Central Mega-Metropolitan',
    rank: 3,
    lifeIndex: 89.4,
    co2OffsetTonnes: 31800,
    rooftopSolarMw: 51.2,
    rooftopCount: 39100,
    citizensEngaged: 94100,
    avgKwhPerHousehold: 215,
    highlight: 'Largest active Mission LiFE citizen community'
  },
  {
    id: 'rajkot',
    name: 'Rajkot',
    zone: 'Saurashtra Hub',
    rank: 4,
    lifeIndex: 87.6,
    co2OffsetTonnes: 14200,
    rooftopSolarMw: 19.8,
    rooftopCount: 16800,
    citizensEngaged: 28400,
    avgKwhPerHousehold: 188,
    highlight: 'Strong MSME & residential solar synergy'
  },
  {
    id: 'vadodara',
    name: 'Vadodara',
    zone: 'Cultural Capital Zone',
    rank: 5,
    lifeIndex: 86.1,
    co2OffsetTonnes: 16900,
    rooftopSolarMw: 22.4,
    rooftopCount: 18200,
    citizensEngaged: 34700,
    avgKwhPerHousehold: 202,
    highlight: 'Leading community solar pilots across RWAs'
  },
  {
    id: 'mehsana',
    name: 'Mehsana',
    zone: 'North Gujarat Renewable Belt',
    rank: 6,
    lifeIndex: 84.5,
    co2OffsetTonnes: 11300,
    rooftopSolarMw: 15.6,
    rooftopCount: 11900,
    citizensEngaged: 19200,
    avgKwhPerHousehold: 182,
    highlight: 'High agricultural & agro-solar conversion'
  },
  {
    id: 'bhavnagar',
    name: 'Bhavnagar',
    zone: 'Coastal Energy Zone',
    rank: 7,
    lifeIndex: 82.9,
    co2OffsetTonnes: 9800,
    rooftopSolarMw: 12.1,
    rooftopCount: 9400,
    citizensEngaged: 16400,
    avgKwhPerHousehold: 191,
    highlight: 'Pioneering coastal microgrid conservation'
  },
  {
    id: 'jamnagar',
    name: 'Jamnagar',
    zone: 'Western Industrial Shoreline',
    rank: 8,
    lifeIndex: 81.3,
    co2OffsetTonnes: 8400,
    rooftopSolarMw: 10.5,
    rooftopCount: 8100,
    citizensEngaged: 14900,
    avgKwhPerHousehold: 208,
    highlight: 'Emerging clean energy transition benchmarks'
  }
];

export const SEED_CITIZEN_ACTIVITY = [];

export const SEED_USER_PROFILE = {
  citizenName: 'New Citizen',
  district: 'Gandhinagar',
  sector: 'Sector 7, Gandhinagar',
  consumerNumber: '',
  discom: 'UGVCL (Uttar Gujarat Vij Company Ltd)',
  totalPoints: 0,
  completedChallenges: [],
  activeMonthlyKwh: 0,
  activeMonthlyBill: 0,
  sanctionedLoadKw: 0,
  meterType: 'Smart Bidirectional Digital Meter'
};
