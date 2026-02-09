<script lang="ts">
  import Step1 from './components/Step1.svelte';
  import Step2 from './components/Step2.svelte';
  import Step3 from './components/Step3.svelte';
  import Step4 from './components/Step4.svelte';
  import Step5 from './components/Step5.svelte';
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
  {:else if currentStep === 3}<Step3 />
  {:else if currentStep === 4}<Step4 />
  {:else if currentStep === 5}<Step5 />
  {/if}

  <div class="nav-buttons">
    <button on:click={() => currentStep--} disabled={currentStep === 1}>Back</button>
    <button on:click={() => currentStep++} disabled={currentStep === 5}>Next</button>
  </div>
</main>
