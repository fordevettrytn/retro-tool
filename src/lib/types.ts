export type DoneGroup = "none" | "expected" | "unexpected";
export type WishGroup = "none" | "actionable" | "non-actionable";

export interface Item {
  readonly id: string;
  readonly content: string;
}

export interface DoneItem extends Item {
  readonly group: DoneGroup;
}

export interface WishItem extends Item {
  readonly group: WishGroup;
}

export interface RetroState {
  readonly doneItems: readonly DoneItem[];
  readonly wishItems: readonly WishItem[];
  readonly summary: string;
}
