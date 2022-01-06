import { Paste } from '.';
import { UploadedPaste } from '../api';
import { Database } from './abstract';

export default class IndexedDb extends Database {
    db: IDBDatabase | undefined;
    databasePromise: Promise<void>;

    constructor() {
        super();

        this.databasePromise = new Promise<void>((resolve, reject) => {
            let request = window.indexedDB.open('pastes', 1);
            request.addEventListener('blocked', () => {
                reject(new Error('IndexedDB request blocked.'));
            });
            request.addEventListener('upgradeneeded', () => {
                this.db = request.result;
                var store = this.db.createObjectStore('pastes', {
                    keyPath: 'token',
                });
                store.createIndex('token', 'token', { unique: true });
                store.createIndex('downloadId', 'downloadId', {
                    unique: true,
                });
                store.createIndex('codePreview', 'codePreview');
                store.createIndex('key', 'key');
            });
            request.addEventListener('success', () => {
                this.db = request.result;
                resolve();
            });
            request.addEventListener('error', () => reject(request.error));
        });
    }

    waitForDatabaseReady(): Promise<void> {
        return this.databasePromise;
    }

    addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.waitForDatabaseReady();
            var transaction = this.db!.transaction('pastes', 'readwrite');
            var store = transaction.objectStore('pastes');
            transaction.addEventListener('complete', () => resolve());
            store.add({ ...paste, codePreview });
            transaction.commit();
        });
    }

    removePaste(token: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.waitForDatabaseReady();
            var transaction = this.db!.transaction('pastes', 'readwrite');
            var store = transaction.objectStore('pastes');
            transaction.addEventListener('complete', () => resolve());
            store.delete(token);
        });
    }

    fetchPaste(id: string, isDownloadId: boolean = false): Promise<Paste> {
        return new Promise<Paste>(async (resolve, reject) => {
            await this.waitForDatabaseReady();
            var transaction = this.db!.transaction('pastes', 'readonly');
            var store = transaction.objectStore('pastes');
            var req: IDBRequest;
            if (isDownloadId) {
                var index = store.index('downloadId');
                req = index.get(id);
            } else {
                req = store.get(id);
            }
            req.addEventListener('success', () => resolve(req.result));
            req.addEventListener('error', () => reject(req.error));
        });
    }

    fetchPastes(): Promise<Paste[]> {
        return new Promise<Paste[]>(async (resolve, reject) => {
            await this.waitForDatabaseReady();
            var transaction = this.db!.transaction('pastes', 'readonly');
            var store = transaction.objectStore('pastes');
            var req = store.openCursor();
            var pastes: Paste[] = [];
            req.addEventListener('success', function () {
                var cursor = this.result;
                if (cursor === null) return resolve(pastes);
                pastes.push(cursor.value as Paste);
                cursor.continue();
            });
            req.addEventListener('error', () => reject(req.error));
        });
    }

    hasPaste(id: string, isDownloadId: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            await this.waitForDatabaseReady();

            var transaction = this.db!.transaction('pastes', 'readonly');
            var store = transaction.objectStore('pastes');
            var req: IDBRequest<number>;
            if (isDownloadId) {
                var index = store.index('downloadId');
                req = index.count(id);
            } else {
                req = store.count(id);
            }
            req.addEventListener('success', () => resolve(req.result > 0));
            req.addEventListener('error', () => reject(req.error));
        });
    }

    static isAvailable(): boolean {
        return 'indexedDB' in window;
    }
}
