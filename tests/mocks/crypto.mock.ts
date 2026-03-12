/**
 * Mock déterministe de crypto.getRandomValues pour les tests
 * Retourne une séquence fixe de valeurs (toutes < 252) pour des résultats reproductibles
 */

let indexSequence = 0;
const sequenceFixe = [5, 11, 17, 23, 29, 35, 41, 47, 53, 59, 65, 71, 77, 83, 89, 95];

let cryptoOriginal: Crypto | null = null;

export function activerCryptoMock(): void {
  indexSequence = 0;
  if (!cryptoOriginal) {
    cryptoOriginal = globalThis.crypto;
  }
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      getRandomValues: <T extends ArrayBufferView>(buffer: T): T => {
        const tableau = buffer as unknown as Uint8Array;
        for (let i = 0; i < tableau.length; i++) {
          tableau[i] = sequenceFixe[indexSequence % sequenceFixe.length];
          indexSequence++;
        }
        return buffer;
      },
    },
    writable: true,
    configurable: true,
  });
}

export function restaurerCrypto(): void {
  if (cryptoOriginal) {
    Object.defineProperty(globalThis, 'crypto', {
      value: cryptoOriginal,
      writable: true,
      configurable: true,
    });
  }
}

export function reinitialiserIndex(): void {
  indexSequence = 0;
}
