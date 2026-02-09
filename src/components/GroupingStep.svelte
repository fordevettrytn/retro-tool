<script lang="ts">
    import type { DoneItem, WishItem } from '../lib/types';

    export let title: string;
    export let items: readonly (DoneItem | WishItem)[];
    export let updateGroup: (id: string, group: any) => void;
    export let groups: readonly {
        key: string;
        label: string;
    }[];

</script>

<div class="step">
    <h2>{title}</h2>
    <div class="grid">
        <section>
            <h3>Unclassified</h3>
            {#each items.filter(i => i.group === 'none') as item}
                <div class="card">
                    {item.content}
                    {#each groups as group}
                        <button on:click={() => updateGroup(item.id, group.key)}>{group.label}</button>
                    {/each}
                </div>
            {/each}
        </section>

        <section class="done-cols">
            {#each groups as group}
                <div class="col">
                    <h3>{group.label}</h3>
                    {#each items.filter(i => i.group === group.key) as item}
                        <div class="card mini" on:click={() => updateGroup(item.id, 'none')}>{item.content}</div>
                    {/each}
                </div>
            {/each}
        </section>
    </div>
</div>
