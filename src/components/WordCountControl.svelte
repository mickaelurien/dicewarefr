<script lang="ts">
  import { nombreMotsStore } from '../stores/diceware.store';

  const MIN = 3;
  const MAX = 12;

  function handleInput(event: Event) {
    const valeur = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(valeur) && valeur >= MIN && valeur <= MAX) {
      nombreMotsStore.set(valeur);
    }
  }
</script>

<div class="control">
  <label for="word-count">Nombre de mots</label>
  <div class="word-count-row">
    <input
      id="word-count-slider"
      type="range"
      min={MIN}
      max={MAX}
      value={$nombreMotsStore}
      on:input={handleInput}
      aria-label="Nombre de mots (slider)"
    />
    <input
      id="word-count"
      type="number"
      min={MIN}
      max={MAX}
      value={$nombreMotsStore}
      on:input={handleInput}
      aria-label="Nombre de mots"
    />
  </div>
</div>
