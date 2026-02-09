<script lang="ts">
    import { retro } from '../lib/store';
    import GroupingStep from './GroupingStep.svelte';

    const groups = [
        { key: 'actionable', label: 'Actionable' },
        { key: 'non-actionable', label: 'Not Actionable' },
    ];
</script>

<GroupingStep
    title="Step 4: Are they actionable?"
    items={$retro.wishItems}
    updateGroup={retro.updateWishGroup}
    {groups}
/>