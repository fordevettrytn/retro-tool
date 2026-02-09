import { writable } from "svelte/store";
import { RetroLogic } from "./logic";
import type { RetroState } from "./types";

const STORAGE_KEY = "retro-tool-v1";

const getInitialState = (): RetroState => {
  if (typeof window === "undefined")
    return { doneItems: [], wishItems: [], summary: "" };
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved
    ? JSON.parse(saved)
    : { doneItems: [], wishItems: [], summary: "" };
};

function createRetroStore() {
  const { subscribe, set, update } = writable<RetroState>(getInitialState());

  // Persistence: Auto-save on every change
  subscribe((state) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  });

  return {
    subscribe,
    addDone: (content: string) => update((s) => RetroLogic.addDone(s, content)),
    updateDoneGroup: (id: string, group: any) =>
      update((s) => RetroLogic.updateDoneGroup(s, id, group)),
    addWish: (content: string) => update((s) => RetroLogic.addWish(s, content)),
    updateWishGroup: (id: string, group: any) =>
      update((s) => RetroLogic.updateWishGroup(s, id, group)),
    setSummary: (summary: string) =>
      update((s) => RetroLogic.setSummary(s, summary)),
    reset: () => {
      if (confirm("Clear all data?"))
        set({ doneItems: [], wishItems: [], summary: "" });
    },
  };
}

export const retro = createRetroStore();
