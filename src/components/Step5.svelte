<script lang="ts">
  import { retro } from '../lib/store';
  import type { DoneItem, WishItem } from '../lib/types';

  let summary = $retro.summary;

  function updateSummary() {
    retro.setSummary(summary);
  }

  // Helper function to filter items by group
  const filterItemsByGroup = (items: readonly (DoneItem | WishItem)[], groupKey: string) => {
    return items.filter(item => item.group === groupKey);
  };
</script>

<h1
>Step 5: Synthesis</h1>
<p>Write a final summary based on the gathered insights.</p>

<div class="synthesis-container">
  <section class="summary-section">
    <h2>What went well (Keep Doing)</h2>
    {#each filterItemsByGroup($retro.doneItems, 'keep-doing') as item (item.id)}
      <p>- {item.content}</p>
    {/each}
  </section>

  <section class="summary-section">
    <h2>What could be improved (Stop Doing)</h2>
    {#each filterItemsByGroup($retro.doneItems, 'stop-doing') as item (item.id)}
      <p>- {item.content}</p>
    {/each}
  </section>

  <section class="summary-section">
    <h2>Planned but not started (Actionable Wish)</h2>
    {#each filterItemsByGroup($retro.wishItems, 'actionable') as item (item.id)}
      <p>- {item.content}</p>
    {/each}
  </section>

  <section class="summary-section">
    <h2>Planned but not started (Non-Actionable Wish)</h2>
    {#each filterItemsByGroup($retro.wishItems, 'non-actionable') as item (item.id)}
      <p>- {item.content}</p>
    {/each}
  </section>

  <section class="summary-section">
    <h2>Final Synthesis / Comments</h2>
    <textarea
      bind:value={summary}
      on:input={updateSummary}
      placeholder="Write your overall summary or comments for this retro session here..."
      rows="10"
    ></textarea>
  </section>

  <div class="actions">
    <button on:click={retro.reset}>Finish Retro</button>
  </div>
</div>