<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>FAQ | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Frequently Asked Questions</h1>
  <p>FAQ content will live here (or link to the on-page FAQ section).</p>
</main>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }
</style>
