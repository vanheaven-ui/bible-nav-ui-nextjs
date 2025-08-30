import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VerseState {
  lastUpdated: string | null;
  hasNewVerse: boolean;
  setLastUpdated: (date: string) => void;
  clearNewVerse: () => void;
}

export const useVerseStore = create<VerseState>()(
  persist(
    (set, get) => ({
      lastUpdated: null,
      hasNewVerse: false,
      setLastUpdated: (date) => {
        const isNew = get().lastUpdated !== date;
        set({
          lastUpdated: date,
          hasNewVerse: isNew,
        });
      },
      clearNewVerse: () => set({ hasNewVerse: false }),
    }),
    {
      name: "verse-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
