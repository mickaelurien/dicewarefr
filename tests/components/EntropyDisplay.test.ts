import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import EntropyDisplay from '../../src/components/EntropyDisplay.svelte';
import { calculerEntropie, niveauSecurite } from '../../src/lib/diceware';

describe('EntropyDisplay', () => {
  it('affiche les bits d\'entropie pour 6 mots', () => {
    const { getByText } = render(EntropyDisplay, { nombreMots: 6 });
    const bits = calculerEntropie(6);
    expect(getByText(`${bits.toFixed(1)} bits`)).toBeTruthy();
  });

  it('affiche les bits d\'entropie pour 3 mots', () => {
    const { getByText } = render(EntropyDisplay, { nombreMots: 3 });
    const bits = calculerEntropie(3);
    expect(getByText(`${bits.toFixed(1)} bits`)).toBeTruthy();
  });

  it('affiche les bits d\'entropie pour 12 mots', () => {
    const { getByText } = render(EntropyDisplay, { nombreMots: 12 });
    const bits = calculerEntropie(12);
    expect(getByText(`${bits.toFixed(1)} bits`)).toBeTruthy();
  });

  it('affiche le badge du niveau de sécurité', () => {
    const { getByText } = render(EntropyDisplay, { nombreMots: 6 });
    const securite = niveauSecurite(calculerEntropie(6));
    expect(getByText(securite.label)).toBeTruthy();
  });

  it('applique la classe CSS du niveau au badge', () => {
    const { container } = render(EntropyDisplay, { nombreMots: 6 });
    const securite = niveauSecurite(calculerEntropie(6));
    expect(container.querySelector(`.niveau-${securite.niveau}`)).toBeTruthy();
  });

  it('affiche le texte de brute force', () => {
    const { getByText } = render(EntropyDisplay, { nombreMots: 6 });
    expect(getByText(/Brute force/)).toBeTruthy();
  });

  it('adapte le niveau de sécurité pour un faible nombre de mots', () => {
    const { container } = render(EntropyDisplay, { nombreMots: 3 });
    const securite = niveauSecurite(calculerEntropie(3));
    expect(container.querySelector(`.niveau-${securite.niveau}`)).toBeTruthy();
  });
});
