export function formatNumberIt(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "-";
  return value.toLocaleString("it-IT", { maximumFractionDigits: 2 });
}

export function formatHoursIt(value: number | null | undefined): string {
  if (value == null || isNaN(value)) return "-";
  return `${value.toLocaleString("it-IT", { maximumFractionDigits: 2 })} h`;
}

export function formatDateIt(value: string | null | undefined): string {
  if (!value) return "-";
  const d = new Date(value);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
