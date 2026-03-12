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
    <p class="subtitle">Générateur de phrases de passe sécurisées en français</p>
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

  <section class="about" aria-label="À propos de la méthode Diceware">
    <h2>Qu'est-ce que Diceware ?</h2>
    <p>
      <strong>Diceware</strong> est une méthode de génération de <strong>phrases de passe</strong> sécurisées inventée par Arnold Reinhold.
      Elle consiste à sélectionner aléatoirement des mots dans une liste de référence, formant ainsi un mot de passe long, mémorable et cryptographiquement robuste.
    </p>
    <h2>Pourquoi utiliser un générateur de phrase de passe ?</h2>
    <p>
      Contrairement aux mots de passe courts et complexes, une <strong>phrase de passe Diceware</strong> est à la fois facile à retenir et très difficile à craquer.
      Avec 6 mots, vous obtenez plus de 77 bits d'entropie — bien au-delà des recommandations actuelles pour un <strong>mot de passe sécurisé</strong>.
    </p>
    <h2>Foire aux questions</h2>
    <dl class="faq">
      <dt>Mes phrases de passe sont-elles stockées quelque part ?</dt>
      <dd>Non. La génération est entièrement réalisée dans votre navigateur grâce à l'API Web Crypto. Aucune donnée n'est jamais transmise à un serveur.</dd>
      <dt>Quelle est la liste de mots utilisée ?</dt>
      <dd>Ce générateur utilise une liste de mots français adaptée de la liste Diceware originale, contenant plus de 7 700 mots courants de la langue française.</dd>
      <dt>Combien de mots pour un mot de passe fort ?</dt>
      <dd>5 mots offrent ~64 bits d'entropie, 6 mots ~77 bits. Pour les usages sensibles (gestionnaire de mots de passe, chiffrement), 6 mots ou plus sont recommandés.</dd>
    </dl>
  </section>

  <footer>
    <p>100% côté client · Aucune donnée envoyée · <a href="https://en.wikipedia.org/wiki/Diceware" target="_blank" rel="noopener noreferrer">En savoir plus sur Diceware</a></p>
  </footer>
</main>
