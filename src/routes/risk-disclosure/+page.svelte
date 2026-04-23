<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Risk Disclosure | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Risk Disclosure</h1>
  <p>Full disclosure will live here.</p>
</main>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }
</style>
