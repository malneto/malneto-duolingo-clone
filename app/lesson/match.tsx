"use client";

import { useState } from "react";

type ChallengeOption = { id: number; text: string; correct: boolean; matchGroup: number | null; };
type Challenge = { id: number; type: string; question: string; challengeOptions: ChallengeOption[]; };
type MatchProps = { challenge: Challenge; onSelect: (id: number) => void; status: "correct" | "wrong" | "none"; disabled?: boolean; };
type Side = "left" | "right";

const PAIR_COLORS = [
  { border: "rgba(34,211,238,0.7)",  bg: "rgba(34,211,238,0.12)",  glow: "rgba(34,211,238,0.3)",  text: "#67e8f9" },
  { border: "rgba(167,139,250,0.7)", bg: "rgba(167,139,250,0.12)", glow: "rgba(167,139,250,0.3)", text: "#c4b5fd" },
  { border: "rgba(251,146,60,0.7)",  bg: "rgba(251,146,60,0.12)",  glow: "rgba(251,146,60,0.3)",  text: "#fdba74" },
  { border: "rgba(244,114,182,0.7)", bg: "rgba(244,114,182,0.12)", glow: "rgba(244,114,182,0.3)", text: "#f9a8d4" },
];
const DEFAULT_STYLE = { border: "rgba(99,102,241,0.3)", bg: "rgba(15,23,42,0.6)", text: "#94a3b8", glow: "none" };
const SELECTED_STYLE = { border: "rgba(34,211,238,0.9)", bg: "rgba(34,211,238,0.12)", text: "#67e8f9", glow: "0 0 16px rgba(34,211,238,0.35)" };

export const Match = ({ challenge, onSelect, status, disabled }: MatchProps) => {
  const [pending, setPending] = useState<{ id: number; side: Side } | null>(null);
  const [pairs, setPairs] = useState<Record<number, number>>({});

  // Since ALL options have correct=false in MATCH type,
  // split by position within each matchGroup: first occurrence = left, second = right
  const groups: Record<number, ChallengeOption[]> = {};
  for (const opt of challenge.challengeOptions) {
    const g = opt.matchGroup ?? 0;
    if (!groups[g]) groups[g] = [];
    groups[g].push(opt);
  }
  const leftItemsRaw: ChallengeOption[] = [];
  const rightItemsRaw: ChallengeOption[] = [];
  for (const g of Object.values(groups)) {
    if (g[0]) leftItemsRaw.push(g[0]);
    if (g[1]) rightItemsRaw.push(g[1]);
  }
  // Shuffle each side independently so pairs don't align visually
  const shuffleOnce = <T,>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const [leftItems] = useState(() => shuffleOnce(leftItemsRaw));
  const [rightItems] = useState(() => shuffleOnce(rightItemsRaw));

  const pairColorForLeft = (leftId: number) => {
    const slot = Object.keys(pairs).indexOf(String(leftId));
    return slot >= 0 ? PAIR_COLORS[slot % PAIR_COLORS.length] : null;
  };
  const leftIdForRight = (rightId: number) =>
    Number(Object.keys(pairs).find((k) => pairs[Number(k)] === rightId) ?? -1);

  const handleClick = (id: number, side: Side) => {
    if (disabled || status !== "none") return;
    const isPaired = side === "left" ? pairs[id] !== undefined : leftIdForRight(id) !== -1;
    const pairedLeftId = side === "left" ? id : leftIdForRight(id);

    if (isPaired) {
      setPairs((prev) => { const n = { ...prev }; delete n[pairedLeftId]; return n; });
      setPending(null); return;
    }
    if (pending?.id === id && pending.side === side) { setPending(null); return; }
    if (!pending) { setPending({ id, side }); return; }
    if (pending.side === side) { setPending({ id, side }); return; }

    const leftId  = side === "left"  ? id : pending.id;
    const rightId = side === "right" ? id : pending.id;
    const newPairs = { ...pairs, [leftId]: rightId };
    setPairs(newPairs);
    setPending(null);

    if (Object.keys(newPairs).length === leftItems.length) {
      // Verify: each leftId should be paired with the rightId in same matchGroup
      const allCorrect = Object.entries(newPairs).every(([lId, rId]) => {
        const l = challenge.challengeOptions.find((o) => o.id === Number(lId));
        const r = challenge.challengeOptions.find((o) => o.id === rId);
        return l && r && l.matchGroup !== null && l.matchGroup === r.matchGroup;
      });
      onSelect(allCorrect ? (challenge.challengeOptions[0]?.id ?? 1) : -1);
    }
  };

  const getStyle = (id: number, side: Side) => {
    const isPending = pending?.id === id && pending.side === side;
    if (side === "left") {
      const col = pairColorForLeft(id); if (col) return col;
      if (isPending) return SELECTED_STYLE; return DEFAULT_STYLE;
    } else {
      const lId = leftIdForRight(id);
      if (lId !== -1) { const col = pairColorForLeft(lId); if (col) return col; }
      if (isPending) return SELECTED_STYLE; return DEFAULT_STYLE;
    }
  };

  const renderBtn = (item: ChallengeOption, side: Side) => {
    const s = getStyle(item.id, side);
    const isPaired = side === "left" ? pairs[item.id] !== undefined : leftIdForRight(item.id) !== -1;
    const isPending = pending?.id === item.id && pending.side === side;
    return (
      <button key={item.id} onClick={() => handleClick(item.id, side)}
        disabled={disabled || status !== "none"}
        className="w-full rounded-2xl px-4 py-4 text-left text-sm font-bold transition-all duration-150 active:scale-[0.97] disabled:cursor-not-allowed"
        style={{ border: `2px solid ${s.border}`, backgroundColor: s.bg, color: s.text,
          boxShadow: s.glow === "none" ? "none" : s.glow, backdropFilter: "blur(8px)",
          transform: isPaired && !isPending ? "scale(0.99)" : undefined }}>
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 flex-shrink-0 rounded-full"
            style={{ background: isPaired || isPending ? s.border : "rgba(255,255,255,0.1)", boxShadow: isPaired || isPending ? `0 0 6px ${s.border}` : "none" }} />
          {item.text}
        </span>
      </button>
    );
  };

  return (
    <div className="space-y-4">
      <p className="text-center text-xs text-slate-500">
        Selecione um item de qualquer coluna, depois o par correspondente
      </p>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">{leftItems.map((item) => renderBtn(item, "left"))}</div>
        <div className="space-y-3">{rightItems.map((item) => renderBtn(item, "right"))}</div>
      </div>
      {Object.keys(pairs).length > 0 && status === "none" && (
        <p className="text-center text-xs text-slate-600 animate-pulse">Toque em um par formado para desfazê-lo</p>
      )}
    </div>
  );
};