<script>
  import { debug_mode } from '$lib/stores.js'
</script>

<dialog open={$debug_mode}>
  <p>
    I am a dialog
  </p>
</dialog>

<style>
  dialog {
    position: fixed;
    top: 0;
  }
</style>