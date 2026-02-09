# Step-by-Step Implementation Guide

## Phase 1: Core Logic & Types

First, we define the "Brain" of the application. By keeping this in pure TypeScript, we ensure it is easily testable.

### 1.1 src/lib/types.ts

Define the data structures. We use readonly to enforce the immutability pattern we discussed.

```typescript
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
```

### 1.2 src/lib/logic.ts

Implement the state transition logic as pure functions.

```typescript
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
```

## Phase 2: Reactive Store & Persistence

Now we wrap the logic in a Svelte Store to handle reactivity and localStorage.

### 2.1 src/lib/store.ts

```typescript
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
```

## Phase 3: Building UI Components

We will use Svelte's concise syntax to link the Store to the view.

### 3.1 src/components/Step1.svelte (Inventory)

```svelte
<script lang="ts">
  import { retro } from '../lib/store';
  let inputVal = "";

  const submit = () => {
    retro.addDone(inputVal);
    inputVal = "";
  };
</script>

<div class="step">
  <h2>Step 1: What did you do?</h2>
  <div class="input-row">
    <input bind:value={inputVal} on:keydown={e => e.key === 'Enter' && submit()} placeholder="Enter activity..." />
    <button on:click={submit}>Add</button>
  </div>
  <ul>
    {#each $retro.doneItems as item (item.id)}
      <li>{item.content || "(Empty Activity)"}</li>
    {/each}
  </ul>
</div>
```

### 3.2 src/components/Step2.svelte (Grouping)

```svelte
<script lang="ts">
  import { retro } from '../lib/store';
</script>

<div class="step">
  <h2>Step 2: How did it go?</h2>
  <div class="grid">
    <section>
      <h3>Unclassified</h3>
      {#each $retro.doneItems.filter(i => i.group === 'none') as item}
        <div class="card">
          {item.content}
          <button on:click={() => retro.updateDoneGroup(item.id, 'expected')}>Expected</button>
          <button on:click={() => retro.updateDoneGroup(item.id, 'unexpected')}>Unexpected</button>
        </div>
      {/each}
    </section>

    <section class="done-cols">
      <div class="col">
        <h3>Expected</h3>
        {#each $retro.doneItems.filter(i => i.group === 'expected') as item}
          <div class="card mini" on:click={() => retro.updateDoneGroup(item.id, 'none')}>{item.content}</div>
        {/each}
      </div>
    </section>
  </div>
</div>
```

## Phase 4: Integration

Finally, assemble everything in App.svelte.

### 4.1 src/App.svelte

```svelte
<script lang="ts">
  import Step1 from './components/Step1.svelte';
  import Step2 from './components/Step2.svelte';
  // ... import other steps
  let currentStep = 1;
</script>

<main class="container">
  <nav class="tabs">
    {#each [1,2,3,4,5] as s}
      <button class:active={currentStep === s} on:click={() => currentStep = s}>{s}</button>
    {/each}
  </nav>

  {#if currentStep === 1}<Step1 />
  {:else if currentStep === 2}<Step2 />
  {/if}

  <div class="nav-buttons">
    <button on:click={() => currentStep--} disabled={currentStep === 1}>Back</button>
    <button on:click={() => currentStep++} disabled={currentStep === 5}>Next</button>
  </div>
</main>
```
