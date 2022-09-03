import { DBSchema, IDBPDatabase, openDB } from 'idb';
import { Paste } from '.';
import { UploadedPaste } from '../api';
import { Database } from './abstract';

interface PastesSchema extends DBSchema {
    pastes: {
        value: Paste;
        key: number;
        indexes: { token: string; downloadId: string };
    };
}

export default class IndexedDb extends Database {
    db: IDBPDatabase<PastesSchema> | undefined;
    databasePromise: Promise<any>;

    constructor() {
        super();
        this.databasePromise = openDB<PastesSchema>('pastes', 1, {
            upgrade: (db) => {
                this.db = db;
                var store = db.createObjectStore('pastes', {
                    keyPath: 'index',
                    autoIncrement: true,
                });
                store.createIndex('token', 'token', { unique: true });
                store.createIndex('downloadId', 'downloadId', {
                    unique: true,
                });
            },
        }).then((db) => (this.db = db));
    }

    waitForDatabaseReady(): Promise<void> {
        return this.databasePromise;
    }

    addPaste(paste: UploadedPaste, codePreview: string): Promise<void> {
        return new Promise<void>(async (resolve) => {
            await this.waitForDatabaseReady();
            var transaction = this.db!.transaction('pastes', 'readwrite');
            await transaction.store.add({ ...paste, codePreview });
            await transaction.done;
        });
    }

    async removePaste(token: string | number): Promise<void> {
        await this.waitForDatabaseReady();
        const transaction = this.db!.transaction('pastes', 'readwrite');
        var index;
        if (typeof token === 'number') {
            index = token;
        } else {
            index = await transaction.store.index('token').getKey(token);
            if (index === undefined) {
                console.log('key not found');
                return;
            }
        }
        await transaction.store.delete(index);
        await transaction.done;
    }

    async fetchPaste(
        id: string,
        isDownloadId: boolean = false
    ): Promise<Paste | undefined> {
        await this.waitForDatabaseReady();
        const transaction = this.db!.transaction('pastes', 'readonly');
        if (isDownloadId) {
            return await transaction.store.index('downloadId').get(id);
        } else {
            return await transaction.store.index('token').get(id);
        }
    }

    async fetchPastes(): Promise<Paste[]> {
        await this.waitForDatabaseReady();
        const transaction = this.db!.transaction('pastes', 'readonly');
        var cursor = await transaction.store.openCursor();
        var pastes: Paste[] = [];
        while (cursor !== null) {
            pastes.push(cursor.value);
            cursor = await cursor.continue();
        }
        return pastes;
    }

    async hasPaste(id: string, isDownloadId: boolean): Promise<boolean> {
        await this.waitForDatabaseReady();
        const transaction = this.db!.transaction('pastes', 'readonly');

        if (isDownloadId) {
            return (await transaction.store.index('downloadId').count(id)) > 0;
        } else {
            return (await transaction.store.index('token').count(id)) > 0;
        }
    }

    static isAvailable(): boolean {
        return 'indexedDB' in window;
    }
}
