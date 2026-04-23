<script lang="ts">
  import { resolve } from '$app/paths';
</script>

<svelte:head>
  <title>Contact | Explosive Swings</title>
</svelte:head>

<main class="prose">
  <p><a href={resolve('/')}>← Home</a></p>
  <h1>Contact Us</h1>
  <p>Contact form or details will live here.</p>
</main>

<style>
  .prose {
    max-width: 720px;
    margin: 0 auto;
    padding: 120px 20px 80px;
  }
</style>
