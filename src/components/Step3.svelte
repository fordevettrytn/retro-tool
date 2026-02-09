<script lang="ts">
  import { retro } from '../lib/store';
  import InventoryStep from './InventoryStep.svelte';
</script>

<InventoryStep
  title="Step 3: What did you wish you had done?"
  items={$retro.wishItems}
  addItem={retro.addWish}
  placeholder="Enter wish..."
/>