import type { Wordlist } from '../../src/lib/diceware';

/**
 * Liste de mots réduite pour les tests
 * Couvre toutes les combinaisons possibles de dés (11111 à 66666)
 * générées programmatiquement pour éviter la dépendance au vrai fichier JSON
 */
function genererWordlistStub(): Wordlist {
  const liste: Wordlist = {};
  const chiffres = [1, 2, 3, 4, 5, 6];

  for (const a of chiffres)
    for (const b of chiffres)
      for (const c of chiffres)
        for (const d of chiffres)
          for (const e of chiffres) {
            const cle = `${a}${b}${c}${d}${e}`;
            liste[cle] = `w${cle}`;
          }

  return liste;
}

export const wordlistStub: Wordlist = genererWordlistStub();
