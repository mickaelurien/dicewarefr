import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { genererCle, recupererMot, genererPassphrase } from '../src/lib/diceware';
import { wordlistStub } from './stubs/wordlist.stub';
import { activerCryptoMock, restaurerCrypto, reinitialiserIndex } from './mocks/crypto.mock';

describe('genererCle', () => {
  beforeEach(() => {
    activerCryptoMock();
    reinitialiserIndex();
  });

  afterEach(() => {
    restaurerCrypto();
  });

  it('retourne une chaîne de 5 caractères', () => {
    const cle = genererCle();
    expect(cle).toHaveLength(5);
  });

  it('ne contient que des chiffres de 1 à 6', () => {
    for (let i = 0; i < 20; i++) {
      const cle = genererCle();
      expect(cle).toMatch(/^[1-6]{5}$/);
    }
  });
});

describe('recupererMot', () => {
  it('retourne le mot associé à une clé valide', () => {
    const mot = recupererMot('11111', wordlistStub);
    expect(mot).toBe('w11111');
  });

  it('retourne le mot pour une autre clé', () => {
    const mot = recupererMot('66666', wordlistStub);
    expect(mot).toBe('w66666');
  });

  it('lève une erreur pour une clé introuvable', () => {
    expect(() => recupererMot('99999', wordlistStub)).toThrow('Clé introuvable : 99999');
  });
});

describe('genererPassphrase', () => {
  beforeEach(() => {
    activerCryptoMock();
    reinitialiserIndex();
  });

  afterEach(() => {
    restaurerCrypto();
  });

  it('retourne une passphrase avec le bon nombre de mots (séparateur espace)', () => {
    const passphrase = genererPassphrase(6, ' ', wordlistStub);
    const mots = passphrase.split(' ');
    expect(mots).toHaveLength(6);
  });

  it('utilise le séparateur tiret', () => {
    const passphrase = genererPassphrase(3, '-', wordlistStub);
    expect(passphrase).toContain('-');
    expect(passphrase.split('-')).toHaveLength(3);
  });

  it('utilise le séparateur underscore', () => {
    const passphrase = genererPassphrase(4, '_', wordlistStub);
    expect(passphrase.split('_')).toHaveLength(4);
  });

  it('retourne une passphrase sans séparateur', () => {
    const passphrase = genererPassphrase(3, '', wordlistStub);
    expect(passphrase).not.toContain(' ');
    expect(passphrase).not.toContain('-');
  });

  it('tous les mots de la passphrase existent dans la liste', () => {
    const passphrase = genererPassphrase(6, ' ', wordlistStub);
    const mots = passphrase.split(' ');
    mots.forEach(mot => {
      expect(Object.values(wordlistStub)).toContain(mot);
    });
  });
});

describe('distribution RNG', () => {
  it('produit une distribution approximativement uniforme sur 1200 tirages', () => {
    const compteurs: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const buffer = new Uint8Array(1);

    for (let i = 0; i < 1200; i++) {
      crypto.getRandomValues(buffer);
      const valeur = (buffer[0] % 6) + 1;
      compteurs[valeur]++;
    }

    const valeurAttendue = 1200 / 6;
    const tolerancePct = 0.30;

    Object.values(compteurs).forEach(count => {
      expect(count).toBeGreaterThan(valeurAttendue * (1 - tolerancePct));
      expect(count).toBeLessThan(valeurAttendue * (1 + tolerancePct));
    });
  });
});
