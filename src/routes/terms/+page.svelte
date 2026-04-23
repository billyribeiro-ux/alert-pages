<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Terms of Service | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Terms of Service</h1>
  <p>Full legal copy will live here.</p>
</main>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }
</style>
