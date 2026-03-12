import { describe, it, expect } from 'vitest';
import { calculerEntropie, niveauSecurite, estimerBruteForce } from '../src/lib/diceware';

describe('calculerEntropie', () => {
  it('calcule correctement pour 6 mots (~77.5 bits)', () => {
    const bits = calculerEntropie(6);
    expect(bits).toBeCloseTo(77.55, 1);
  });

  it('calcule correctement pour 4 mots (~51.7 bits)', () => {
    const bits = calculerEntropie(4);
    expect(bits).toBeCloseTo(51.7, 0);
  });

  it('calcule correctement pour 8 mots (~103.4 bits)', () => {
    const bits = calculerEntropie(8);
    expect(bits).toBeCloseTo(103.4, 0);
  });

  it('est proportionnel au nombre de mots', () => {
    const bits3 = calculerEntropie(3);
    const bits6 = calculerEntropie(6);
    expect(bits6 / bits3).toBeCloseTo(2, 5);
  });
});

describe('niveauSecurite', () => {
  it('retourne "faible" pour moins de 63 bits (≤ 4 mots)', () => {
    const resultat = niveauSecurite(45);
    expect(resultat.niveau).toBe('faible');
    expect(resultat.label).toBe('Faible');
  });

  it('retourne "faible" pour 51.7 bits (4 mots, ~5 heures à 100 Md/s)', () => {
    const resultat = niveauSecurite(51.7);
    expect(resultat.niveau).toBe('faible');
  });

  it('retourne "moyen" entre 63 et 77 bits (5 mots, ~4.5 ans à 100 Md/s)', () => {
    const resultat = niveauSecurite(65);
    expect(resultat.niveau).toBe('moyen');
    expect(resultat.label).toBe('Bon');
  });

  it('retourne "fort" entre 77 et 92 bits (6-7 mots)', () => {
    const resultat = niveauSecurite(80);
    expect(resultat.niveau).toBe('fort');
    expect(resultat.label).toBe('Fort');
  });

  it('retourne "fort" pour 77.5 bits (6 mots, ~35 000 ans à 100 Md/s)', () => {
    const resultat = niveauSecurite(77.5);
    expect(resultat.niveau).toBe('fort');
  });

  it('retourne "tres-fort" pour 92 bits et plus (8+ mots)', () => {
    const resultat = niveauSecurite(103);
    expect(resultat.niveau).toBe('tres-fort');
    expect(resultat.label).toBe('Très fort');
  });
});

describe('estimerBruteForce', () => {
  it('retourne une chaîne non vide', () => {
    const resultat = estimerBruteForce(77.5);
    expect(resultat).toBeTruthy();
    expect(typeof resultat).toBe('string');
  });

  it('retourne "moins d\'un an" pour une entropie très faible', () => {
    const resultat = estimerBruteForce(10);
    expect(resultat).toBe("moins d'un an");
  });

  it('retourne "moins d\'un an" pour 4 mots (51.7 bits, ~5 heures)', () => {
    const resultat = estimerBruteForce(51.7);
    expect(resultat).toBe("moins d'un an");
  });

  it('retourne ~4.5 ans pour 5 mots (64.62 bits)', () => {
    const resultat = estimerBruteForce(64.62);
    expect(resultat).toMatch(/^4\.\d ans$/);
  });

  it('retourne des milliers d\'années pour 6 mots (77.55 bits)', () => {
    const resultat = estimerBruteForce(77.55);
    expect(resultat).toMatch(/milliers d'années/);
  });

  it('mentionne des millions d\'années pour 7 mots (90.47 bits)', () => {
    const resultat = estimerBruteForce(90.47);
    expect(resultat).toMatch(/millions d'années/);
  });

  it('retourne des billions d\'années pour 8 mots (103.4 bits)', () => {
    const resultat = estimerBruteForce(103.4);
    expect(resultat).toMatch(/billions d'années/);
  });

  it('retourne "incraquable en pratique" pour 9+ mots (≥ 116 bits)', () => {
    const resultat = estimerBruteForce(116.3);
    expect(resultat).toBe("incraquable en pratique");
  });
});
