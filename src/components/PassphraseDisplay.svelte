<script lang="ts">
  import { copierDansPressePapiers } from '../lib/clipboard';

  export let passphrase: string = '';

  let copiee = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  async function copier() {
    const succes = await copierDansPressePapiers(passphrase);
    if (succes) {
      copiee = true;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        copiee = false;
      }, 2000);
    }
  }
</script>

<div class="passphrase-display">
  <p class="passphrase-text" aria-live="polite" aria-label="Passphrase générée">
    {passphrase || '…'}
  </p>
  <button
    class="copy-btn"
    class:copied={copiee}
    on:click={copier}
    disabled={!passphrase}
    aria-label="Copier la passphrase"
  >
    {#if copiee}
      <span>Copié !</span>
    {:else}
      <span>Copier</span>
    {/if}
  </button>
</div>
