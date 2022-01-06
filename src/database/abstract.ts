import { Paste } from '.';
import { UploadedPaste } from '../api';

export class Database {
    constructor() {
        if (this.constructor === Database)
            throw new Error('Abstract classes cannot be instantiated!');
    }

    waitForDatabaseReady(): Promise<void> {
        throw new Error('waitForDatabaseReady() must be implemented!');
    }

    addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        throw new Error('addPaste() must be implemented!');
    }

    removePaste(token: string): Promise<void> {
        throw new Error('removePaste() must be implemented!');
    }

    fetchPaste(
        id: string,
        isDownloadId: boolean = false
    ): Promise<Paste | undefined> {
        throw new Error('fetchPaste() must be implemented!');
    }

    fetchPastes(): Promise<Paste[]> {
        throw new Error('fetchPastes() must be implemented!');
    }

    hasPaste(id: string, isDownloadId: boolean = false): Promise<boolean> {
        throw new Error('hasPaste() must be implemented!');
    }

    static isAvailable(): boolean {
        throw new Error('isAvailable() must be implemented!');
    }
}
