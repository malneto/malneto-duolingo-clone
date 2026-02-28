// ─── CEFR level helpers ────────────────────────────────────────────────────
//
// CEFR levels map to floats:
//   A1.1=1.1  A1.2=1.2  A1.3=1.3
//   A2.1=2.1  A2.2=2.2  A2.3=2.3
//   B1.1=3.1  B1.2=3.2  B1.3=3.3
//   B2.1=4.1  B2.2=4.2  B2.3=4.3
//   C1.1=5.1  C1.2=5.2  C1.3=5.3

const BAND_TO_INT: Record<string, number> = {
  A1: 1, A2: 2, B1: 3, B2: 4, C1: 5,
};

const INT_TO_BAND: Record<number, string> = {
  1: "A1", 2: "A2", 3: "B1", 4: "B2", 5: "C1",
};

export const CEFR_MIN = 1.1;
export const CEFR_MAX = 5.3;

/** "B1.2" → 3.2 */
export function cefrToFloat(level: string): number {
  const [band, micro] = level.split(".");
  const base = BAND_TO_INT[band];
  if (!base) return CEFR_MIN;
  return parseFloat(`${base}.${micro ?? "1"}`);
}

/** 3.2 → "B1.2" */
export function floatToCefr(f: number): string {
  const clamped = Math.max(CEFR_MIN, Math.min(CEFR_MAX, f));
  // Round to 1 decimal to avoid floating point drift
  const rounded = Math.round(clamped * 10) / 10;
  const base = Math.floor(rounded);
  const micro = Math.round((rounded - base) * 10);
  // micro should be 1, 2 or 3 — clamp just in case
  const safeMicro = Math.max(1, Math.min(3, micro || 1));
  const band = INT_TO_BAND[base] ?? "A1";
  return `${band}.${safeMicro}`;
}

/** Clamp a float to valid CEFR range */
export function clampCefr(f: number): number {
  return Math.max(CEFR_MIN, Math.min(CEFR_MAX, Math.round(f * 10) / 10));
}

/** Returns the main CEFR band string: "B1.2" → "B1" */
export function cefrBand(level: string): string {
  return level.split(".")[0] ?? "A1";
}