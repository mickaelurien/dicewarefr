<script lang="ts">
  import { calculerEntropie, niveauSecurite, estimerBruteForce } from '../lib/diceware';

  export let nombreMots: number = 6;

  $: bits = calculerEntropie(nombreMots);
  $: securite = niveauSecurite(bits);
  $: bruteForce = estimerBruteForce(bits);
</script>

<div class="entropy-display">
  <div class="entropy-row">
    <span class="entropy-bits">{bits.toFixed(1)} bits</span>
    <span class="entropy-badge niveau-{securite.niveau}">{securite.label}</span>
  </div>
  <p class="brute-force">Brute force (100 Md/s) : {bruteForce}</p>
</div>
