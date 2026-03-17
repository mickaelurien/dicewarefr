import { clipboardMock } from '../mocks/clipboard.mock';

export const clipboardStub: Pick<Clipboard, 'writeText'> = {
  writeText: (texte: string): Promise<void> => {
    clipboardMock.contenu = texte;
    return Promise.resolve();
  },
};
