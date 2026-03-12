import { writable } from 'svelte/store';
import type { Separateur } from '../lib/diceware';

export const nombreMotsStore = writable<number>(6);
export const separateurStore = writable<Separateur>(' ');
