// Shared streak health calculation used by streak.tsx and lesson-top-bar.tsx
//
// "lastActivityDate" is the ISO date string from the DB (YYYY-MM-DD) or null.
// Returns a StreakHealth object that drives all visual states.

export type StreakHealth =
  | "healthy"    // active today or yesterday — rocket fire blazing
  | "warning"    // 1 day missed  — fire flickering
  | "danger"     // 2-3 days missed — fire sputtering, orange→red
  | "critical"   // 4-5 days missed — almost out
  | "dead";      // 6+ days / streak = 0 — engine offline

export interface StreakState {
  health: StreakHealth;
  daysInactive: number;
  /** Percentage of streak remaining (0-100, visual only) */
  healthPct: number;
  /** Color token for the flame / border */
  color: string;
  /** Glow color */
  glow: string;
  /** Human-readable warning label */
  label: string;
  /** CSS animation speed for the flame */
  animDuration: string;
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    Math.abs(new Date(a).getTime() - new Date(b).getTime()) / 86_400_000
  );
}

export function getStreakState(
  currentStreak: number,
  lastActivityDate: string | null | undefined
): StreakState {
  const today = todayStr();
  const last  = lastActivityDate as string | null | undefined;

  let daysInactive = 0;
  if (last && last !== today) {
    daysInactive = daysBetween(last, today);
  }

  // Streak = 0 always → dead
  if (currentStreak === 0) {
    return {
      health: "dead", daysInactive,
      healthPct: 0,
      color: "#475569", glow: "rgba(71,85,105,0.3)",
      label: "Foguete desligado 🚀💀",
      animDuration: "4s",
    };
  }

  if (daysInactive === 0 || daysInactive === 1) {
    // Active today or yesterday — still safe
    if (daysInactive === 0) {
      return {
        health: "healthy", daysInactive,
        healthPct: 100,
        color: "#f97316", glow: "rgba(249,115,22,0.6)",
        label: `${currentStreak} dias 🔥`,
        animDuration: "0.6s",
      };
    }
    // Yesterday — gentle warning
    return {
      health: "warning", daysInactive,
      healthPct: 85,
      color: "#fb923c", glow: "rgba(251,146,60,0.5)",
      label: "Recarregue hoje! ⚡",
      animDuration: "0.9s",
    };
  }

  if (daysInactive <= 3) {
    return {
      health: "danger", daysInactive,
      healthPct: Math.max(10, 70 - daysInactive * 20),
      color: "#ef4444", glow: "rgba(239,68,68,0.5)",
      label: `${daysInactive}d sem jogar ⚠️`,
      animDuration: "1.4s",
    };
  }

  if (daysInactive <= 5) {
    return {
      health: "critical", daysInactive,
      healthPct: Math.max(5, 30 - daysInactive * 5),
      color: "#dc2626", glow: "rgba(220,38,38,0.5)",
      label: `Streak quase perdido! 💀`,
      animDuration: "2.2s",
    };
  }

  // 6+ days
  return {
    health: "dead", daysInactive,
    healthPct: 0,
    color: "#475569", glow: "rgba(71,85,105,0.3)",
    label: "Foguete desligado 🚀💀",
    animDuration: "4s",
  };
}