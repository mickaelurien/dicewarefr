<script lang="ts">
  import { onMount } from 'svelte';
  import { nombreMotsStore, separateurStore } from './stores/diceware.store';
  import { genererPassphrase } from './lib/diceware';
  import WordCountControl from './components/WordCountControl.svelte';
  import SeparatorControl from './components/SeparatorControl.svelte';
  import PassphraseDisplay from './components/PassphraseDisplay.svelte';
  import EntropyDisplay from './components/EntropyDisplay.svelte';

  let passphrase = '';

  function generer() {
    passphrase = genererPassphrase($nombreMotsStore, $separateurStore);
  }

  onMount(() => {
    generer();
  });
</script>

<main>
  <header>
    <h1>Diceware FR</h1>
    <p class="subtitle">Générateur de phrases de passe sécurisées</p>
  </header>

  <section class="config" aria-label="Configuration">
    <WordCountControl />
    <SeparatorControl />
    <button class="generate-btn" on:click={generer}>
      Générer
    </button>
  </section>

  <section class="result" aria-label="Résultat">
    <PassphraseDisplay {passphrase} />
  </section>

  <section class="security" aria-label="Niveau de sécurité">
    <EntropyDisplay nombreMots={$nombreMotsStore} />
  </section>

  <footer>
    <p>100% côté client · Aucune donnée envoyée · <a href="https://en.wikipedia.org/wiki/Diceware" target="_blank" rel="noopener noreferrer">En savoir plus</a></p>
  </footer>
</main>
