export function formatHours(hours: number | null | undefined): string {
  if (hours == null || isNaN(hours as number)) return "-";
  const h = Math.floor(hours);
  const m = Math.round((hours % 1) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
