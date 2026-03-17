import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import SeparatorControl from '../../src/components/SeparatorControl.svelte';
import { separateurStore } from '../../src/stores/diceware.store';

describe('SeparatorControl', () => {
  beforeEach(() => {
    separateurStore.set(' ');
  });

  it('affiche les 4 options de séparateur', () => {
    const { getByLabelText } = render(SeparatorControl);
    expect(getByLabelText('Espace')).toBeTruthy();
    expect(getByLabelText('Tiret')).toBeTruthy();
    expect(getByLabelText('Underscore')).toBeTruthy();
    expect(getByLabelText('Aucun')).toBeTruthy();
  });

  it('coche "Espace" par défaut', () => {
    const { getByLabelText } = render(SeparatorControl);
    expect((getByLabelText('Espace') as HTMLInputElement).checked).toBe(true);
  });

  it('met à jour le store au choix "Tiret"', async () => {
    const { getByLabelText } = render(SeparatorControl);
    await fireEvent.change(getByLabelText('Tiret'));
    expect(get(separateurStore)).toBe('-');
  });

  it('met à jour le store au choix "Underscore"', async () => {
    const { getByLabelText } = render(SeparatorControl);
    await fireEvent.change(getByLabelText('Underscore'));
    expect(get(separateurStore)).toBe('_');
  });

  it('met à jour le store au choix "Aucun"', async () => {
    const { getByLabelText } = render(SeparatorControl);
    await fireEvent.change(getByLabelText('Aucun'));
    expect(get(separateurStore)).toBe('');
  });

  it('met à jour le store au choix "Espace"', async () => {
    separateurStore.set('-');
    const { getByLabelText } = render(SeparatorControl);
    await fireEvent.change(getByLabelText('Espace'));
    expect(get(separateurStore)).toBe(' ');
  });

  it('affiche la légende "Séparateur"', () => {
    const { getByText } = render(SeparatorControl);
    expect(getByText('Séparateur')).toBeTruthy();
  });
});
