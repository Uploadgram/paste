import { UploadedPaste } from '../api';
import { Database } from './abstract';
import IndexedDb from './indexeddb';
import LocalStorage from './localstorage';

export interface Paste extends UploadedPaste {
    codePreview: string;
}

function getDatabase(): Database {
    // if ('indexedDB' in window) return new IndexedDb();
    if ('localStorage' in window) return new LocalStorage();
    throw new Error('No supported database backend.');
}

const database = getDatabase();
export default database;
