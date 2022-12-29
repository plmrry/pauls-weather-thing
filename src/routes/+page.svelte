<script>
  import "$lib/global.css";
  import * as stores from '$lib/stores.js'
  import Modal from "$lib/Modal.svelte";
  import Chart from "$lib/Chart.svelte";

  const { debug_mode } = stores;
</script>

<svelte:body on:click={() => $debug_mode = !$debug_mode} />

<grid-container>
  <Chart options={stores.temperature_plot} />
  <Chart options={stores.wind_plot} />
  <Chart options={stores.tide_plot} />
  <Chart options={stores.wave_plot} />
</grid-container>
<Modal />

<style>
  grid-container {
    display: grid;
    grid-auto-rows: var(--row-height, 25svh);
  }
</style>