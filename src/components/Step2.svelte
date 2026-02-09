<script lang="ts">
    import { retro } from '../lib/store';
    import GroupingStep from './GroupingStep.svelte';

    const groups = [
        { key: 'expected', label: 'Expected' },
        { key: 'unexpected', label: 'Unexpected' },
    ];
</script>

<GroupingStep
    title="Step 2: How did it go?"
    items={$retro.doneItems}
    updateGroup={retro.updateDoneGroup}
    {groups}
/>