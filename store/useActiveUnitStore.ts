'use client'

import { create } from 'zustand'

export interface ActiveUnit {
  id: number
  order: number
  title: string
  description: string | null
  section: {
    id: number
    order: number
    title: string
  }
}

interface Store {
  activeUnit: ActiveUnit | null
  setActiveUnit: (unit: ActiveUnit | null) => void
}

export const useActiveUnitStore = create<Store>((set) => ({
  activeUnit: null,
  setActiveUnit: (unit) => set({ activeUnit: unit }),
}))