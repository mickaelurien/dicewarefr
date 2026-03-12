/**
 * Copie un texte dans le presse-papiers via l'API Clipboard
 * @param texte string texte à copier
 * @returns Promise<boolean> succès de la copie
 */
export async function copierDansPressePapiers(texte: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texte);
    return true;
  } catch {
    return fallbackCopier(texte);
  }
}

function fallbackCopier(texte: string): boolean {
  const element = document.createElement('textarea');
  element.value = texte;
  element.style.position = 'fixed';
  element.style.opacity = '0';
  document.body.appendChild(element);
  element.focus();
  element.select();
  try {
    document.execCommand('copy');
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(element);
  }
}
