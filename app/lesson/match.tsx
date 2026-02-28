"use client";

import { useState } from "react";

type ChallengeOption = {
  id: number;
  text: string;
  correct: boolean;
  matchGroup: number | null;
};

type Challenge = {
  id: number;
  type: string;
  question: string;
  challengeOptions: ChallengeOption[];
};

type MatchProps = {
  challenge: Challenge;
  onSelect: (id: number) => void;
  status: "correct" | "wrong" | "none";
  disabled?: boolean;
};

// Each color slot for a completed pair
const PAIR_COLORS = [
  { border: "rgba(34,211,238,0.7)",  bg: "rgba(34,211,238,0.12)",  glow: "rgba(34,211,238,0.25)",  text: "#67e8f9"  },
  { border: "rgba(167,139,250,0.7)", bg: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.25)", text: "#c4b5fd"  },
  { border: "rgba(251,146,60,0.7)",  bg: "rgba(251,146,60,0.12)",  glow: "rgba(251,146,60,0.25)",  text: "#fdba74"  },
  { border: "rgba(244,114,182,0.7)", bg: "rgba(244,114,182,0.12)", glow: "rgba(244,114,182,0.25)", text: "#f9a8d4"  },
];

const DEFAULT_STYLE = {
  border: "rgba(99,102,241,0.3)",
  bg: "rgba(15,23,42,0.6)",
  text: "#94a3b8",
  glow: "none",
};

const SELECTED_STYLE = {
  border: "rgba(34,211,238,0.9)",
  bg: "rgba(34,211,238,0.12)",
  text: "#67e8f9",
  glow: "0 0 16px rgba(34,211,238,0.35)",
};

type Side = "left" | "right";

export const Match = ({ challenge, onSelect, status, disabled }: MatchProps) => {
  // Which item is currently "pending" (one side clicked, waiting for the other)
  const [pending, setPending] = useState<{ id: number; side: Side } | null>(null);
  // Completed pairs: { leftId → rightId }
  const [pairs, setPairs] = useState<Record<number, number>>({});

  const leftItems  = challenge.challengeOptions.filter((o) => !o.correct);
  const rightItems = challenge.challengeOptions.filter((o) => o.correct);

  // Returns which color slot this left-item owns (for consistent coloring)
  const pairColorForLeft = (leftId: number) => {
    const slot = Object.keys(pairs).indexOf(String(leftId));
    return slot >= 0 ? PAIR_COLORS[slot % PAIR_COLORS.length] : null;
  };

  // Given a rightId, return the leftId that is paired with it (if any)
  const leftIdForRight = (rightId: number) =>
    Number(Object.keys(pairs).find((k) => pairs[Number(k)] === rightId) ?? -1);

  // ── Click handlers ────────────────────────────────────────────

  const handleClick = (id: number, side: Side) => {
    if (disabled || status !== "none") return;

    // Determine if this item already belongs to a completed pair
    const pairedLeftId  = side === "left"  ? id : leftIdForRight(id);
    const pairedRightId = side === "left"  ? pairs[id] : id;
    const isPaired      = side === "left"  ? pairs[id] !== undefined : leftIdForRight(id) !== -1;

    // 1. Clicking a paired item → break the pair (undo)
    if (isPaired) {
      setPairs((prev) => {
        const next = { ...prev };
        delete next[pairedLeftId];
        return next;
      });
      setPending(null);
      return;
    }

    // 2. Clicking the currently pending item → deselect it
    if (pending?.id === id && pending.side === side) {
      setPending(null);
      return;
    }

    // 3. No pending item → set this as pending
    if (!pending) {
      setPending({ id, side });
      return;
    }

    // 4. Pending item exists on the SAME side → switch selection to new item
    if (pending.side === side) {
      setPending({ id, side });
      return;
    }

    // 5. Pending item exists on the OTHER side → form a pair
    const leftId  = side === "left"  ? id : pending.id;
    const rightId = side === "right" ? id : pending.id;

    const newPairs = { ...pairs, [leftId]: rightId };
    setPairs(newPairs);
    setPending(null);

    // Evaluate when all pairs are formed
    if (Object.keys(newPairs).length === leftItems.length) {
      const allCorrect = Object.entries(newPairs).every(([lId, rId]) => {
        const l = challenge.challengeOptions.find((o) => o.id === Number(lId));
        const r = challenge.challengeOptions.find((o) => o.id === rId);
        return l && r && l.matchGroup === r.matchGroup;
      });
      onSelect(allCorrect ? challenge.challengeOptions[0].id : -1);
    }
  };

  // ── Style resolver ────────────────────────────────────────────

  const getStyle = (id: number, side: Side) => {
    const isPending = pending?.id === id && pending.side === side;

    if (side === "left") {
      const col = pairColorForLeft(id);
      if (col) return col;
      if (isPending) return { ...SELECTED_STYLE, glow: SELECTED_STYLE.glow };
      return DEFAULT_STYLE;
    } else {
      const lId = leftIdForRight(id);
      if (lId !== -1) {
        const col = pairColorForLeft(lId);
        if (col) return col;
      }
      if (isPending) return { ...SELECTED_STYLE, glow: SELECTED_STYLE.glow };
      return DEFAULT_STYLE;
    }
  };

  // ── Render ────────────────────────────────────────────────────

  const renderButton = (item: ChallengeOption, side: Side) => {
    const s = getStyle(item.id, side);
    const isPaired = side === "left" ? pairs[item.id] !== undefined : leftIdForRight(item.id) !== -1;
    const isPending = pending?.id === item.id && pending.side === side;

    return (
      <button
        key={item.id}
        onClick={() => handleClick(item.id, side)}
        disabled={disabled || status !== "none"}
        className="w-full rounded-2xl px-5 py-4 text-left text-sm font-bold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed"
        style={{
          border: `2px solid ${s.border}`,
          backgroundColor: s.bg,
          color: s.text,
          boxShadow: s.glow === "none" ? "none" : s.glow,
          backdropFilter: "blur(8px)",
          opacity: 1,
          // Subtle "dimple" when fully paired and not interacting
          transform: isPaired && !isPending ? "scale(0.99)" : undefined,
        }}
      >
        <span className="flex items-center gap-2">
          {/* Small indicator dot */}
          <span
            className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
            style={{
              background: isPaired || isPending ? s.border : "rgba(255,255,255,0.1)",
              boxShadow: isPaired || isPending ? `0 0 6px ${s.border}` : "none",
            }}
          />
          {item.text}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-indigo-300">
        {challenge.question || "🔗 Conecte os pares"}
      </p>

      {/* Helper hint */}
      <p className="text-center text-xs text-slate-500">
        Selecione um item de qualquer coluna, depois o par correspondente
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-2xl mx-auto">
        <div className="space-y-3">
          {leftItems.map((item) => renderButton(item, "left"))}
        </div>
        <div className="space-y-3">
          {rightItems.map((item) => renderButton(item, "right"))}
        </div>
      </div>

      {/* Undo hint when pairs exist */}
      {Object.keys(pairs).length > 0 && status === "none" && (
        <p className="text-center text-xs text-slate-600 animate-pulse">
          Toque em um par formado para desfazê-lo
        </p>
      )}
    </div>
  );
};