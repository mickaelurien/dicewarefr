# Diceware FR

Générateur de phrases de passe [Diceware](https://en.wikipedia.org/wiki/Diceware) en français, avec estimation de robustesse en temps réel.

## Présentation

Le principe Diceware consiste à tirer aléatoirement des mots dans une liste de taille fixe (7 776 mots = 6⁵) pour composer une phrase de passe mémorisable mais cryptographiquement solide. Chaque mot apporte **~12.9 bits d'entropie** (log₂(7776)).

L'application affiche pour chaque phrase générée :

- l'entropie en bits
- un niveau de sécurité qualitatif (Faible → Très fort)
- une estimation du temps nécessaire à une attaque par brute force

## Comment fonctionne le tirage

Dans sa forme originale (papier), Diceware utilise **5 lancers d'un dé à 6 faces** pour sélectionner un mot. Chaque lancer produit un chiffre de 1 à 6, et les 5 chiffres concaténés forment une clé (ex. `42316`) qui pointe vers une entrée unique de la liste.

```
Lancer 5 dés → 4  2  3  1  6 → clé "42316" → mot "longeait"
```

La liste contient exactement 6⁵ = **7 776 mots**, ce qui garantit qu'une clé sur 5 chiffres (de `11111` à `66666`) correspond toujours à exactement un mot.

### Implémentation numérique

Cette application reproduit ce tirage via **`crypto.getRandomValues()`** (Web Crypto API), qui fournit une source d'aléa cryptographiquement sûre. Pour chaque dé virtuel, un octet aléatoire est généré et ramené à une valeur entre 1 et 6 en utilisant un _rejection sampling_ : les valeurs au-delà de 251 sont rejetées pour garantir une distribution parfaitement uniforme (évite le biais modulo).

```
octet ∈ [0, 251] → valeur = (octet % 6) + 1   ✓ distribution uniforme
octet ∈ [252, 255] → rejeté, on retire           ✗ évite le biais
```

## Stack technique

| Outil                                         | Rôle                 |
| --------------------------------------------- | -------------------- |
| [Svelte 5](https://svelte.dev/)               | Framework UI         |
| [TypeScript](https://www.typescriptlang.org/) | Typage statique      |
| [Vite](https://vitejs.dev/)                   | Bundler / dev server |
| [Vitest](https://vitest.dev/)                 | Tests unitaires      |

## Installation

```bash
# Prérequis : Node.js ≥ 20
npm install
```

## Utilisation

```bash
# Développement (hot-reload)
npm run dev

# Build de production
npm run build

# Prévisualiser le build
npm run preview
```

## Tests

```bash
# Lancer les tests une fois
npm test

# Mode watch
npm run test:watch

# Couverture de code
npm run test:coverage
```

## Niveaux de sécurité

Les seuils sont établis à partir d'un modèle d'attaque réaliste pour 2026 : **100 milliards de tentatives par seconde**, ce qui correspond approximativement à un cluster de 5 GPU RTX 4090 attaquant un hash SHA-256 avec [Hashcat](https://hashcat.net/).

| Niveau    | Bits       | Mots     | Temps estimé                       |
| --------- | ---------- | -------- | ---------------------------------- |
| Faible    | < 63 bits  | 3–4 mots | Quelques heures                    |
| Bon       | 63–77 bits | 5 mots   | ~4.5 ans                           |
| Fort      | 77–92 bits | 6–7 mots | 35 000 ans → 272 millions d'années |
| Très fort | ≥ 92 bits  | 8+ mots  | Plusieurs billions d'années        |

### Sources

- **EFF Diceware** — [eff.org/dice](https://www.eff.org/dice) : recommande 6 mots minimum (77.5 bits) depuis 2014, suite à la montée en puissance des GPU
- **Arnold Reinhold (créateur de Diceware)** — [dicewarefaq.html](https://theworld.com/~reinhold/dicewarefaq.html) : historique des recommandations et threat models
- **Wikipedia — Diceware** — [en.wikipedia.org/wiki/Diceware](https://en.wikipedia.org/wiki/Diceware) : formule d'entropie et niveaux de recommandation
- **Hashcat benchmarks RTX 4090** — [onlinehashcrack.com](https://onlinehashcrack.com/tools-benchmark-hashcat-nvidia-rtx-4090.php) : 21.8 GH/s sur SHA-256, base du calcul du taux d'attaque retenu
- **NIST SP 800-63B** — directives sur la longueur et l'entropie des secrets mémorisés
