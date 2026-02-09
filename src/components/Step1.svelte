<script lang="ts">
  import { retro } from '../lib/store';
  import InventoryStep from './InventoryStep.svelte';
</script>

<InventoryStep
  title="Step 1: What did you do?"
  items={$retro.doneItems}
  addItem={retro.addDone}
/>