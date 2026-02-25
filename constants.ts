// constants.ts
import { MESSAGES } from "@/constants/messages";   // ← Import adicionado

export const POINTS_TO_REFILL = 10;
export const MAX_HEARTS = 10;

export const QUESTS = [
  {
    title: MESSAGES.questEarn20,   // "Ganhe 20 XP"
    value: 20,
  },
  {
    title: MESSAGES.questEarn50,
    value: 50,
  },
  {
    title: MESSAGES.questEarn100,
    value: 100,
  },
  {
    title: MESSAGES.questEarn250,
    value: 250,
  },
  {
    title: MESSAGES.questEarn500,
    value: 500,
  },
  {
    title: MESSAGES.questEarn1000,
    value: 1000,
  },
];