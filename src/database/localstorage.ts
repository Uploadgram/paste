import { Paste } from '.';
import { UploadedPaste } from '../api';
import { Database } from './abstract';

type RawPaste = Omit<Paste, 'token'>;

export default class LocalStorage extends Database {
    /**
     * keeps the uploading order,
     * and also serves as a quick lookup table
     */
    entries: Array<string>;
    /**
     * downloadId => token
     */
    downloadIdTable: Map<string, string>;

    constructor() {
        super();

        this.entries =
            localStorage.getItem('entries') === null
                ? []
                : JSON.parse(localStorage.getItem('entries')!);
        this.downloadIdTable = new Map<string, string>(
            localStorage.getItem('downloadid_table') === null
                ? []
                : Object.entries(
                      JSON.parse(localStorage.getItem('downloadid_table')!)
                  )
        );
    }

    async waitForDatabaseReady() {}

    async addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        localStorage.setItem(
            'paste_' + paste.token,
            JSON.stringify({
                downloadId: paste.downloadId,
                codePreview: codePreview,
                key: paste.key,
            } as RawPaste)
        );

        this.entries.push(paste.token);
        this.downloadIdTable.set(paste.downloadId, paste.token);
        console.log(this.downloadIdTable);
        this.saveEntries();
    }

    async removePaste(token: string): Promise<void> {
        const downloadId = (await this.fetchPaste(token))!.downloadId;
        this.downloadIdTable.delete(downloadId);
        localStorage.removeItem('paste_' + token);
        this.removeEntry(token);
        this.saveEntries();
    }

    async fetchPaste(
        token: string,
        isDownloadId: boolean = false
    ): Promise<Paste | undefined> {
        let key: string | undefined;

        if (isDownloadId) {
            if (this.downloadIdTable.has(token))
                key = this.downloadIdTable.get(token);
        } else {
            key = token;
        }
        if (key === undefined) return undefined;
        let entry = localStorage.getItem('paste_' + key);
        if (entry === null) return undefined;
        let entryParsed: RawPaste = JSON.parse(entry);
        return { ...entryParsed, token: key };
    }

    async fetchPastes(): Promise<Paste[]> {
        let pastes: Paste[] = [];
        for (const key of this.entries) {
            pastes.push((await this.fetchPaste(key))!);
        }

        return pastes;
    }

    async hasPaste(
        id: string,
        isDownloadId: boolean = false
    ): Promise<boolean> {
        return this.downloadIdTable.has(id) || this.entries.indexOf(id) !== -1;
    }

    private saveEntries() {
        localStorage.setItem('entries', JSON.stringify(this.entries));
        console.log(this.downloadIdTable);
        localStorage.setItem(
            'downloadid_table',
            JSON.stringify(Object.fromEntries(this.downloadIdTable))
        );
    }

    private removeEntry(entry: string) {
        const index = this.entries.indexOf(entry);
        if (index === -1) return false;
        return this.entries.splice(index, 1)[0];
    }

    static isAvailable() {
        return 'localStorage' in window;
    }
}
