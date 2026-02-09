<script lang="ts">
  export let title: string;
  export let items: readonly { id: string; content: string }[];
  export let addItem: (content: string) => void;
  export let placeholder: string = "Enter activity...";

  let inputVal = "";

  const submit = () => {
    if (inputVal.trim() === "") return;
    addItem(inputVal);
    inputVal = "";
  };
</script>

<div class="step">
  <h2>{title}</h2>
  <div class="input-row">
    <input bind:value={inputVal} on:keydown={e => e.key === 'Enter' && submit()} {placeholder} />
    <button on:click={submit}>Add</button>
  </div>
  <ul>
    {#each items as item (item.id)}
      <li>{item.content || "(Empty Activity)"}</li>
    {/each}
  </ul>
</div>
