import { Paste } from '.';
import { UploadedPaste } from '../api';

export class Database {
    constructor() {
        if (this.constructor === Database)
            throw new Error('Abstract classes cannot be instantiated!');
    }

    addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        throw new Error('addPaste() must be implemented!');
    }

    removePaste(token: string): Promise<void> {
        throw new Error('removePaste() must be implemented!');
    }

    fetchPastes(): Promise<Paste[]> {
        throw new Error('fetchPastes() must be implemented!');
    }
}
