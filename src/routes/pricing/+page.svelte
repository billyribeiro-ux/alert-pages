<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Pricing | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Pricing</h1>
  <p>Pricing details match the home page section; refine this page when ready.</p>
</main>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }
</style>
