<script lang="ts">
  import type { Separateur } from '../lib/diceware';
  import { separateurStore } from '../stores/diceware.store';

  const options: { label: string; valeur: Separateur }[] = [
    { label: 'Espace', valeur: ' ' },
    { label: 'Tiret', valeur: '-' },
    { label: 'Underscore', valeur: '_' },
    { label: 'Aucun', valeur: '' },
  ];
</script>

<div class="control">
  <fieldset>
    <legend>Séparateur</legend>
    <div class="separator-options">
      {#each options as option}
        <label class="radio-label">
          <input
            type="radio"
            name="separateur"
            value={option.valeur}
            checked={$separateurStore === option.valeur}
            on:change={() => separateurStore.set(option.valeur)}
          />
          {option.label}
        </label>
      {/each}
    </div>
  </fieldset>
</div>
