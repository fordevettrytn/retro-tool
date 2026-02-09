# Development Specification: Web-Based Retrospective Tool (MVP)

## 1. Project Overview

A lightweight, front-end-only web application designed to help users reflect on their activities through a structured 5-step process.

### The 5-Step Workflow

1. **Inventory (Done):** List all completed activities.
2. **Grouping (Done):** Categorize activities into "As Expected" or "Unexpected (Learnings)."
3. **Inventory (Wish):** List activities that were planned but not started.
4. **Judgment (Wish):** Categorize wishes into "Actionable (Next)" or "Non-Actionable (Postpone)."
5. **Synthesis:** Write a final summary based on the gathered insights.

## 2. Architecture & Tech Stack

The project follows the principles of Functional Programming and Clean Architecture, separating domain logic from the UI framework.

- **Framework:** Svelte 5 (utilizing Runes/Signals for reactivity)
- **Build Tool:** Vite with Rolldown (Rust-based bundler for maximum performance)
- **Package Manager:** pnpm (for strict and efficient dependency management)
- **State Management:** Svelte Writable Stores with Immutable updates.
- **Persistence:** Browser localStorage.

## 3. Data Modeling (types.ts)

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

## 4. Module Design

### 4.1 Domain Logic (logic.ts)

Contains pure functions only. No side effects.

- **addDone / addWish:** Appends new items to the state.
- **updateGroup:** Returns a new state with the modified item category.
- **setSummary:** Updates the final reflection text.

### 4.2 State Management (store.ts)

Handles the application state and side effects (Persistence).

- **Hydration:** Loads initial state from localStorage on instantiation.
- **Auto-Save:** Uses subscribe to sync every state change to localStorage as a JSON string.

### 4.3 User Interface (App.svelte)

- **Wizard-style UI:** Renders one step at a time to maintain user focus.
- **Flexible Navigation:** Allows moving between steps even if data is empty.

## 5. Development Workflow (Setup Guide)

### Prerequisites

Install `mise` or `proto` to manage your runtime, then:

```bash
mise use node@lts
mise use pnpm@latest
```

### Initialization

```bash
# Create project with Vite (Rolldown-ready)
pnpm create vite retro-tool --template svelte-ts
cd retro-tool
npm install

# Setup directory structure
mkdir -p src/lib src/components
touch src/lib/types.ts src/lib/logic.ts src/lib/store.ts
```

### Project Structure

```plaintext
src/
├── lib/
│   ├── types.ts      # Type definitions
│   ├── logic.ts      # Pure functions (Immutable Logic)
│   └── store.ts      # Svelte Store (Persistence & State)
├── components/
│   ├── Step1.svelte  # Inventory (Done)
│   ├── Step2.svelte  # Grouping (Done)
│   ├── Step3.svelte  # Inventory (Wish)
│   ├── Step4.svelte  # Judgment (Wish)
│   └── Step5.svelte  # Synthesis (Final Summary)
└── App.svelte        # Main Layout & Step Routing
```

## 6. Engineering Principles

- **Immutability:** All state updates must return new objects to ensure predictable reactivity and easy Undo/Redo implementation in the future.
- **Zero-Constraint Navigation:** Users are free to skip steps or leave items blank, prioritizing the flow of thought over data validation.
- **Performance:** Leveraging Rolldown's Rust-based speed for a near-instant developer feedback loop.
