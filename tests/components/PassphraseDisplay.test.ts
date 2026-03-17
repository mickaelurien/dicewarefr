import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import PassphraseDisplay from '../../src/components/PassphraseDisplay.svelte';
import { clipboardMock } from '../mocks/clipboard.mock';
import { clipboardStub } from '../stubs/clipboard.stub';

describe('PassphraseDisplay', () => {
  beforeEach(() => {
    clipboardMock.contenu = '';
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboardStub,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('affiche la passphrase fournie', () => {
    const { getByText } = render(PassphraseDisplay, { passphrase: 'cheval battery staple' });
    expect(getByText('cheval battery staple')).toBeTruthy();
  });

  it('affiche "…" quand la passphrase est vide', () => {
    const { getByText } = render(PassphraseDisplay, { passphrase: '' });
    expect(getByText('…')).toBeTruthy();
  });

  it('désactive le bouton quand la passphrase est vide', () => {
    const { getByLabelText } = render(PassphraseDisplay, { passphrase: '' });
    expect((getByLabelText('Copier la passphrase') as HTMLButtonElement).disabled).toBe(true);
  });

  it('active le bouton quand la passphrase est renseignée', () => {
    const { getByLabelText } = render(PassphraseDisplay, { passphrase: 'cheval battery staple' });
    expect((getByLabelText('Copier la passphrase') as HTMLButtonElement).disabled).toBe(false);
  });

  it('affiche "Copié !" après avoir cliqué sur le bouton', async () => {
    const { getByLabelText, getByText } = render(PassphraseDisplay, { passphrase: 'cheval battery staple' });
    await fireEvent.click(getByLabelText('Copier la passphrase'));
    await waitFor(() => expect(getByText('Copié !')).toBeTruthy());
  });

  it('copie la passphrase dans le presse-papiers', async () => {
    const passphrase = 'cheval battery staple';
    const { getByLabelText } = render(PassphraseDisplay, { passphrase });
    await fireEvent.click(getByLabelText('Copier la passphrase'));
    await waitFor(() => expect(clipboardMock.contenu).toBe(passphrase));
  });

  it('revient à "Copier" après 2 secondes', async () => {
    vi.useFakeTimers();
    const { getByLabelText, getByText } = render(PassphraseDisplay, { passphrase: 'cheval battery staple' });

    await fireEvent.click(getByLabelText('Copier la passphrase'));
    await Promise.resolve();
    await Promise.resolve();

    expect(getByText('Copié !')).toBeTruthy();

    await vi.advanceTimersByTimeAsync(2001);

    expect(getByText('Copier')).toBeTruthy();
  });

  it('possède l\'attribut aria-live sur le texte de passphrase', () => {
    const { getByLabelText } = render(PassphraseDisplay, { passphrase: 'test' });
    expect(getByLabelText('Passphrase générée').getAttribute('aria-live')).toBe('polite');
  });
});
