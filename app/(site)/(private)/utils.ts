export function calculateStreak(dates: string[]): number {
  if (!dates || dates.length === 0) return 0;
  
  // Get unique local dates as YYYY-MM-DD
  const uniqueDates = Array.from(new Set(dates.map(d => new Date(d).toLocaleDateString('en-CA'))))
    .sort((a, b) => b.localeCompare(a));
    
  if (uniqueDates.length === 0) return 0;
  
  const today = new Date().toLocaleDateString('en-CA');
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toLocaleDateString('en-CA');
  
  let streak = 0;
  let currentDateObj = new Date(today);
  
  // If the latest entry is neither today nor yesterday, streak is 0
  if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
    return 0;
  }
  
  // Start checking from the most recent entry
  let checkDate = new Date(uniqueDates[0]);
  
  for (let i = 0; i < uniqueDates.length; i++) {
    const entryDateStr = uniqueDates[i];
    const checkDateStr = checkDate.toLocaleDateString('en-CA');
    
    if (entryDateStr === checkDateStr) {
      streak++;
      // Move check date back 1 day
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  
  return streak;
}

/**
 * Build a 20-cell heatmap (oldest→newest) from an array of ISO date strings.
 * Returns levels 0–4 where 0 = no entries, 4 = heavy activity.
 * Thresholds: 0 entries→0, 1→1, 2→2, 3–4→3, 5+→4
 */
export function computeHeatmap(dates: string[], days = 20): number[] {
  // Build a count map: YYYY-MM-DD → count
  const countMap = new Map<string, number>();
  for (const d of dates) {
    const key = new Date(d).toLocaleDateString('en-CA');
    countMap.set(key, (countMap.get(key) ?? 0) + 1);
  }

  // Generate the last `days` calendar dates, oldest first
  const today = new Date();
  const result: number[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString('en-CA');
    const count = countMap.get(key) ?? 0;
    const level =
      count === 0 ? 0 :
      count === 1 ? 1 :
      count === 2 ? 2 :
      count <= 4  ? 3 : 4;
    result.push(level);
  }
  return result;
}
