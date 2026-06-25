export function formatNumberIt(value: number | string | null | undefined): string {
  if (value == null) return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";
  return num.toLocaleString("it-IT", { maximumFractionDigits: 2 });
}

export function formatHoursIt(value: number | string | null | undefined): string {
  if (value == null) return "-";
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "-";

  const h = Math.floor(num);
  const m = Math.round((num % 1) * 60);
  const hDisplay = h.toLocaleString("it-IT");

  if (h === 0) return `${m}m`;
  if (m === 0) return `${hDisplay}h`;
  return `${hDisplay}h ${m}m`;
}

export function formatDateIt(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
