import { Paste } from '.';
import { UploadedPaste } from '../api';
import { Database } from './abstract';

type RawPaste = Omit<Paste, 'token'>;

export default class LocalStorage extends Database {
    async addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        localStorage.setItem(
            'paste_' + paste.token,
            JSON.stringify({
                downloadId: paste.downloadId,
                codePreview: codePreview,
                key: paste.key,
            } as RawPaste)
        );
    }

    async removePaste(token: string): Promise<void> {
        localStorage.removeItem('paste_' + token);
    }

    async fetchPastes(): Promise<Paste[]> {
        let pastes: Paste[] = [];
        let localStorageLength = localStorage.length;
        for (let i = 0; i < localStorageLength; i++) {
            let key = localStorage.key(i);
            if (!key?.startsWith('paste_')) continue;
            let entry: RawPaste = JSON.parse(localStorage.getItem(key)!);
            pastes.push({ ...entry, token: key.substr('paste_'.length) });
        }

        return pastes;
    }
}
