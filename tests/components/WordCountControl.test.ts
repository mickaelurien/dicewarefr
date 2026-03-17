import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import { get } from 'svelte/store';
import WordCountControl from '../../src/components/WordCountControl.svelte';
import { nombreMotsStore } from '../../src/stores/diceware.store';

describe('WordCountControl', () => {
  beforeEach(() => {
    nombreMotsStore.set(6);
  });

  it('affiche le label "Nombre de mots"', () => {
    const { getByText } = render(WordCountControl);
    expect(getByText('Nombre de mots')).toBeTruthy();
  });

  it('affiche le slider avec la valeur du store', () => {
    const { getByLabelText } = render(WordCountControl);
    const slider = getByLabelText('Nombre de mots (slider)') as HTMLInputElement;
    expect(slider.value).toBe('6');
  });

  it('affiche le champ numérique avec la valeur du store', () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    expect(input.value).toBe('6');
  });

  it('met à jour le store via le champ numérique', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '8' } });
    expect(get(nombreMotsStore)).toBe(8);
  });

  it('met à jour le store via le slider', async () => {
    const { getByLabelText } = render(WordCountControl);
    const slider = getByLabelText('Nombre de mots (slider)') as HTMLInputElement;
    await fireEvent.input(slider, { target: { value: '10' } });
    expect(get(nombreMotsStore)).toBe(10);
  });

  it('ignore une valeur inférieure au minimum (3)', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '2' } });
    expect(get(nombreMotsStore)).toBe(6);
  });

  it('ignore une valeur supérieure au maximum (12)', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '13' } });
    expect(get(nombreMotsStore)).toBe(6);
  });

  it('ignore une valeur non numérique', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: 'abc' } });
    expect(get(nombreMotsStore)).toBe(6);
  });

  it('accepte la valeur minimale (3)', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '3' } });
    expect(get(nombreMotsStore)).toBe(3);
  });

  it('accepte la valeur maximale (12)', async () => {
    const { getByLabelText } = render(WordCountControl);
    const input = getByLabelText('Nombre de mots') as HTMLInputElement;
    await fireEvent.input(input, { target: { value: '12' } });
    expect(get(nombreMotsStore)).toBe(12);
  });
});
