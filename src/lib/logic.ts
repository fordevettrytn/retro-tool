import type { RetroState, DoneGroup, WishGroup } from "./types";

export const RetroLogic = {
  addDone: (state: RetroState, content: string): RetroState => ({
    ...state,
    doneItems: [
      ...state.doneItems,
      { id: crypto.randomUUID(), content, group: "none" },
    ],
  }),

  updateDoneGroup: (
    state: RetroState,
    id: string,
    group: DoneGroup,
  ): RetroState => ({
    ...state,
    doneItems: state.doneItems.map((item) =>
      item.id === id ? { ...item, group } : item,
    ),
  }),

  addWish: (state: RetroState, content: string): RetroState => ({
    ...state,
    wishItems: [
      ...state.wishItems,
      { id: crypto.randomUUID(), content, group: "none" },
    ],
  }),

  updateWishGroup: (
    state: RetroState,
    id: string,
    group: WishGroup,
  ): RetroState => ({
    ...state,
    wishItems: state.wishItems.map((item) =>
      item.id === id ? { ...item, group } : item,
    ),
  }),

  setSummary: (state: RetroState, summary: string): RetroState => ({
    ...state,
    summary,
  }),
};
