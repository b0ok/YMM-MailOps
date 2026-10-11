export interface HourlyTrafficData {
  hour: string;          // e.g. "08:00"
  timestamp: string;     // e.g. "8 AM"
  totalPackets: number;  // total incoming
  delivered: number;     // legitimate
  spamBlocked: number;   // filtered/quarantined
  sales: number;         // by department
  dev: number;
  acct: number;
  general: number;
  bandwidthKb: number;   // data transferred in KB
}

// Generate a realistic 24-hour historical distribution curve
// showing typical corporate daytime peaks (9am - 5pm) and off-hours maintenance/spam attempts
export function generate24HourTrafficData(): HourlyTrafficData[] {
  const hours: HourlyTrafficData[] = [];
  const now = new Date();

  for (let i = 23; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hourNum = d.getHours();
    const hourLabel = `${hourNum.toString().padStart(2, '0')}:00`;
    const displayLabel = d.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    // Business hours curve factor (higher between 8:00 and 18:00)
    let businessFactor = 1.0;
    if (hourNum >= 8 && hourNum <= 11) {
      businessFactor = 3.2; // Morning rush
    } else if (hourNum >= 12 && hourNum <= 16) {
      businessFactor = 2.8; // Afternoon active
    } else if (hourNum >= 17 && hourNum <= 19) {
      businessFactor = 1.9; // Evening wind-down
    } else {
      businessFactor = 0.6; // Night / early morning
    }

    const baseVolume = Math.floor((30 + Math.random() * 25) * businessFactor);
    // Spam attacks frequently occur during off-hours as well
    const spamRate = hourNum < 6 || hourNum > 21 ? 0.28 : 0.14 + Math.random() * 0.08;
    const spamBlocked = Math.max(1, Math.floor(baseVolume * spamRate));
    const delivered = baseVolume - spamBlocked;

    const sales = Math.floor(delivered * 0.38);
    const dev = Math.floor(delivered * 0.32);
    const acct = Math.floor(delivered * 0.20);
    const general = Math.max(1, delivered - (sales + dev + acct));
    const bandwidthKb = Math.floor(baseVolume * (45 + Math.random() * 30));

    hours.push({
      hour: hourLabel,
      timestamp: displayLabel,
      totalPackets: baseVolume,
      delivered,
      spamBlocked,
      sales,
      dev,
      acct,
      general,
      bandwidthKb,
    });
  }

  return hours;
}
