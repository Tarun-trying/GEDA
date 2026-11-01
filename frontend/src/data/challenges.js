/**
 * Predefined Mission LiFE Green Challenges
 * 
 * Each challenge reflects practical daily habits to reduce electricity demand
 * aligned with the 7 pillars of Mission LiFE (Lifestyle for Environment).
 * Note: These are self-reported citizen actions for awareness and gamification.
 */

export const GREEN_CHALLENGES = [
  {
    id: 'lights-off',
    title: 'Switch off unused lights',
    description: 'Turn off lights and decorative lamps when leaving a room unoccupied for more than 3 minutes.',
    points: 10,
    impact: '~0.4 kWh saved per day',
    category: 'Daily Habit',
    iconName: 'Lightbulb'
  },
  {
    id: 'standby-power',
    title: 'Avoid standby power for unused devices',
    description: 'Switch off the main plug socket for TVs, microwave ovens, chargers, and setup boxes to eliminate vampire draw.',
    points: 15,
    impact: '~8-10% reduction in base load',
    category: 'Vampire Load',
    iconName: 'PowerOff'
  },
  {
    id: 'daylight-utilization',
    title: 'Use daylight instead of lights when practical',
    description: 'Open curtains and position study/work desks near windows to harness natural sunlight throughout daylight hours.',
    points: 10,
    impact: 'Conserves 4-6 hours of fixture runtime',
    category: 'Natural Energy',
    iconName: 'Sun'
  },
  {
    id: 'air-conditioner-opt',
    title: 'Reduce unnecessary AC use',
    description: 'Set your air conditioner thermostat to the BEE recommended 24°C or higher, and turn it off when room temperature stabilizes.',
    points: 20,
    impact: '~6% electricity saved per degree above 18°C',
    category: 'High-Power Load',
    iconName: 'Wind'
  },
  {
    id: 'rooftop-solar-learning',
    title: 'Learn about rooftop solar',
    description: 'Explore rooftop solar feasibility, understand net-metering basics, and run the GreenSaathi solar potential estimator.',
    points: 15,
    impact: 'Steps toward long-term zero carbon generation',
    category: 'Renewables',
    iconName: 'SunMedium'
  }
];
