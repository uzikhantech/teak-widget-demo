import { create } from "zustand";

type ProtectionInteractionState = {
  hasProtectionInteracted: boolean;
  setProtectionInteracted: () => void;
  resetProtectionInteraction: () => void;
};

export const useProtectionInteractionStore = create<ProtectionInteractionState>((set) => ({
  hasProtectionInteracted: false,

  setProtectionInteracted: () => set({ hasProtectionInteracted: true }),

  resetProtectionInteraction: () => set({ hasProtectionInteracted: false }),
}));
