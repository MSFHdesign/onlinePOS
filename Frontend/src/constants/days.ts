/**
 * Day of week constants in Danish for consistent ordering and labeling
 */

export interface DayInfo {
  key: string;
  label: string;
}

export const ORDERED_DAYS: DayInfo[] = [
  { key: 'monday', label: 'Mandag' },
  { key: 'tuesday', label: 'Tirsdag' },
  { key: 'wednesday', label: 'Onsdag' },
  { key: 'thursday', label: 'Torsdag' },
  { key: 'friday', label: 'Fredag' },
  { key: 'saturday', label: 'Lørdag' },
  { key: 'sunday', label: 'Søndag' }
];

/**
 * Array of day keys in correct order
 */
export const DAY_KEYS = ORDERED_DAYS.map(day => day.key);

/**
 * Map from English day names to Danish
 */
export const DAY_LABELS: Record<string, string> = ORDERED_DAYS.reduce((acc, day) => {
  acc[day.key] = day.label;
  return acc;
}, {} as Record<string, string>);

/**
 * Returns the day name in Danish for the specified day of week
 * @param dayIndex Day of week (0-6, where 0 is Sunday)
 */
export function getDayNameFromIndex(dayIndex: number): string {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayKey = days[dayIndex % 7];
  return DAY_LABELS[dayKey] || dayKey;
} 