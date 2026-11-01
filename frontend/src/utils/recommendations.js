/**
 * Rule-Based Recommendation Engine
 * 
 * NOTE: These suggestions use deterministic business rules based on entered
 * household consumption and billing metrics. No AI or live grid APIs are required.
 */

/**
 * Generates tailored recommendations based on user consumption profile.
 * 
 * @param {object} params
 * @param {number} params.monthlyKwh - Household monthly consumption (kWh)
 * @param {number} [params.monthlyBill] - Optional monthly electricity bill (INR)
 * @param {number} [params.completedCount] - Number of completed challenges
 * @returns {Array<object>} Array of recommendation cards
 */
export function getSmartRecommendations({ monthlyKwh = 0, monthlyBill = 0, completedCount = 0 }) {
  const recommendations = [];
  const kwh = Number(monthlyKwh) || 0;
  const bill = Number(monthlyBill) || 0;

  // Rule 1: High Electricity Usage (> 280 kWh/month)
  if (kwh > 280) {
    recommendations.push({
      id: 'high-usage-ac',
      title: 'Optimize Air Conditioner & Heavy Loads',
      tag: 'High Energy Load',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconName: 'Wind',
      explanation: 'Your usage exceeds 280 kWh/month, indicating significant cooling or continuous heating loads. AC compressors can account for up to 55% of power bills during peak months.',
      actionTitle: 'Set AC to 24°C',
      actionDetails: 'Increasing thermostat from 18°C to 24°C saves up to 24% electricity without compromising indoor comfort.'
    });

    recommendations.push({
      id: 'heavy-appliances-maintenance',
      title: 'Inspect Refrigerators & Water Heaters',
      tag: 'Appliance Health',
      tagColor: 'bg-blue-100 text-blue-800 border-blue-200',
      iconName: 'Wrench',
      explanation: 'Dirty condenser coils and old gasket seals cause refrigerators to cycle more frequently, consuming an extra 40-70 kWh monthly.',
      actionTitle: 'Clean Coils & Check Gasket',
      actionDetails: 'Clean rear refrigerator coils every 6 months and ensure door seals are airtight.'
    });
  } 
  // Rule 2: Moderate Electricity Usage (140 - 280 kWh/month)
  else if (kwh >= 140) {
    recommendations.push({
      id: 'moderate-lighting-fans',
      title: 'Upgrade to 5-Star BLDC Fans & LEDs',
      tag: 'Lighting & Fans',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconName: 'Lightbulb',
      explanation: 'In moderate consumption households, ceiling fans and tube lights run 8-12 hours daily. BLDC fans consume only 28-32W compared to 75W for standard induction fans.',
      actionTitle: 'Switch to BLDC Tech',
      actionDetails: 'Replace oldest fans with BEE 5-star BLDC fans to save ~150 kWh annually per fan.'
    });

    recommendations.push({
      id: 'phantom-load-curb',
      title: 'Eliminate Standby Phantom Loads',
      tag: 'Power Leakage',
      tagColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      iconName: 'ZapOff',
      explanation: 'Devices kept on standby (set-top boxes, smart TVs, chargers, WiFi routers) consume a continuous 20-40W trickle draw 24/7.',
      actionTitle: 'Use Smart Strip / Master Switch',
      actionDetails: 'Turn off the wall socket or use a power strip for the entire entertainment center when not in use.'
    });
  } 
  // Rule 3: Low Electricity Usage (< 140 kWh/month)
  else {
    recommendations.push({
      id: 'low-usage-maintain',
      title: 'Excellent Baseline! Maintain Energy Stewardship',
      tag: 'Top 15% Efficient',
      tagColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconName: 'Award',
      explanation: 'Your household is operating with remarkable efficiency, well below the regional average of ~210 kWh/month.',
      actionTitle: 'Share Habits with Neighbors',
      actionDetails: 'Inspire your residential society or neighborhood by showcasing how small habit changes keep your consumption lean.'
    });
  }

  // Rule 4: Solar Rooftop Opportunity
  // For any household consuming > 120 kWh, rooftop solar offers attractive ROI
  if (kwh >= 120) {
    recommendations.push({
      id: 'solar-opportunity',
      title: 'Explore Rooftop Solar Potential',
      tag: 'Renewable Clean Power',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconName: 'Sun',
      explanation: `At ${kwh} kWh monthly consumption, a 1.5–3 kW rooftop solar system could generate the majority of your power and drastically lower DISCOM slab rates.`,
      actionTitle: 'Calculate Solar Savings',
      actionDetails: 'Navigate to our Solar Calculator tab to view required roof space and simple payback.'
    });
  }

  // Rule 5: Mission LiFE Everyday Action (Always included)
  const lifeTips = [
    {
      title: 'Mission LiFE Daily: Natural Cross-Ventilation',
      desc: 'Open opposing windows during early morning and late evening to flush indoor heat before switching on cooling equipment.',
      action: 'Open Windows 7:00 AM - 8:30 AM'
    },
    {
      title: 'Mission LiFE Daily: Unplug Idle Mobile Chargers',
      desc: 'A plugged-in mobile phone charger continues drawing 0.5 to 2 Watts even when no device is connected.',
      action: 'Unplug Chargers Immediately After Use'
    },
    {
      title: 'Mission LiFE Daily: Defrost Freezer Regularly',
      desc: 'Frost buildup thicker than 5mm forces your compressor to work 20% harder to maintain internal temperature.',
      action: 'Defrost When Frost Reaches 5mm'
    }
  ];

  // Pick a tip based on completed count or day
  const chosenLifeTip = lifeTips[completedCount % lifeTips.length];
  recommendations.push({
    id: 'mission-life-daily',
    title: chosenLifeTip.title,
    tag: 'Mission LiFE Action',
    tagColor: 'bg-teal-100 text-teal-800 border-teal-200',
    iconName: 'Leaf',
    explanation: chosenLifeTip.desc,
    actionTitle: 'Daily Habit',
    actionDetails: chosenLifeTip.action
  });

  return recommendations;
}
