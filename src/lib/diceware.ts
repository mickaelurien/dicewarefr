import wordlistRaw from '../data/wordlist-fr.json';

export type Wordlist = Record<string, string>;
export type Separateur = ' ' | '-' | '_' | '';

const listeMotsFr = wordlistRaw as Wordlist;

/**
 * Génère un entier aléatoire entre 1 et 6 via crypto.getRandomValues()
 * Utilise rejection sampling pour garantir une distribution uniforme
 */
function lancerDe(): number {
  const buffer = new Uint8Array(1);
  let valeur: number;
  do {
    crypto.getRandomValues(buffer);
    valeur = buffer[0] % 6;
  } while (buffer[0] >= 252);
  return valeur + 1;
}

/**
 * Génère une clé Diceware à 5 chiffres (ex: "42316")
 * correspondant à 5 lancers de dé
 */
export function genererCle(): string {
  return Array.from({ length: 5 }, () => lancerDe()).join('');
}

/**
 * Récupère un mot depuis la liste à partir d'une clé Diceware
 * @param cle string clé à 5 chiffres (ex: "42316")
 * @param liste Wordlist dictionnaire { clé: mot }
 */
export function recupererMot(cle: string, liste: Wordlist = listeMotsFr): string {
  const mot = liste[cle];
  if (!mot) throw new Error(`Clé introuvable : ${cle}`);
  return mot;
}

/**
 * Génère une passphrase Diceware complète
 * @param nombreMots number nombre de mots à générer (3-12)
 * @param separateur Separateur caractère de séparation entre les mots
 * @param liste Wordlist dictionnaire à utiliser
 */
export function genererPassphrase(
  nombreMots: number,
  separateur: Separateur = ' ',
  liste: Wordlist = listeMotsFr
): string {
  const mots = Array.from({ length: nombreMots }, () => {
    const cle = genererCle();
    return recupererMot(cle, liste);
  });
  return mots.join(separateur);
}

/**
 * Calcule l'entropie en bits d'une passphrase Diceware
 * Formule : wordCount * log2(7776)
 * @param nombreMots number nombre de mots dans la passphrase
 */
export function calculerEntropie(nombreMots: number): number {
  return nombreMots * Math.log2(7776);
}

/**
 * Retourne un label qualitatif basé sur l'entropie en bits.
 * Seuils calés sur les limites entre nombres de mots consécutifs :
 *   < 63 bits  → 3-4 mots  → craquable en quelques heures
 *  63-77 bits  → 5 mots    → quelques années
 *  77-92 bits  → 6-7 mots  → dizaines de milliers à centaines de millions d'années
 *   ≥ 92 bits  → 8+ mots   → milliards d'années
 * @param bits number entropie en bits
 */
export function niveauSecurite(bits: number): { label: string; niveau: 'faible' | 'moyen' | 'fort' | 'tres-fort' } {
  if (bits < 63) return { label: 'Faible', niveau: 'faible' };
  if (bits < 77) return { label: 'Bon', niveau: 'moyen' };
  if (bits < 92) return { label: 'Fort', niveau: 'fort' };
  return { label: 'Très fort', niveau: 'tres-fort' };
}

/**
 * Estime le temps de brute force en années pour une entropie donnée.
 * Modèle d'attaque : ~100 milliards de tentatives/s (cluster de ~5 GPU RTX 4090
 * sur SHA-256 — adversaire bien équipé, réaliste en 2026).
 * @param bits number entropie en bits
 */
export function estimerBruteForce(bits: number): string {
  const tentativesParSeconde = 1e11;
  const secondesParAnnee = 365.25 * 24 * 3600;
  const annees = Math.pow(2, bits) / tentativesParSeconde / secondesParAnnee / 2;

  if (annees < 1) return "moins d'un an";
  if (annees < 10) return `${annees.toFixed(1)} ans`;
  if (annees < 1_000) return `${Math.round(annees)} ans`;
  if (annees < 1_000_000) return `${Math.round(annees / 1_000)} milliers d'années`;
  if (annees < 1e9) return `${Math.round(annees / 1e6)} millions d'années`;
  if (annees < 1e12) return `${Math.round(annees / 1e9)} milliards d'années`;
  if (annees < 1e15) {
    const billions = annees / 1e12;
    return `${billions < 10 ? billions.toFixed(1) : Math.round(billions)} billions d'années`;
  }
  return "incraquable en pratique";
}
