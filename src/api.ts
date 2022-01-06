import database from './database';
import { encode, decode } from 'base64-arraybuffer';
import { base64ToUrl, urlToBase64 } from './utils';

const apiEndpoint = 'https://api.uploadgram.me/';
const downloadEndpoint = 'https://dl.uploadgram.me/';
// max: 1MiB
const maxSize = 1 * 1024 * 1024;

export class FileNotFoundError extends Error {
    constructor() {
        super('File was not found within the Uploadgram servers.');
    }
}

export class UploadFailedError extends Error {
    constructor() {
        super('The upload failed. Please try again later.');
    }
}

interface UploadResponse {
    ok: boolean;
    url: string;
    delete: string;
}

export interface UploadedPaste {
    downloadId: string;
    token: string;
    key: string;
}

export type UploadedPastePublic = Omit<UploadedPaste, 'token'>;

export interface DeleteResponse {
    ok: boolean;
}

export interface RenameResponse {
    ok: boolean;
    new_filename: string;
}

export interface FileInfoResponse {
    ok: boolean;
    filename: string;
    mimeType: string;
    size: number;
    url: string;
}

export async function savePaste(
    content: string,
    filename: string = 'paste'
): Promise<UploadedPaste> {
    const key = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const textEncoder = new TextEncoder();
    const encoded = textEncoder.encode(content);
    const encryptedMessage: ArrayBuffer = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        encoded
    );
    const parcel = new Blob([iv, encryptedMessage]);
    const res = await fetch(apiEndpoint + 'upload', {
        method: 'PUT',
        body: parcel,
        headers: {
            'content-type': 'application/octet-stream',
            'upload-filename': filename,
        },
    });
    if (res.status !== 201) throw new UploadFailedError();
    const json: UploadResponse = await res.json();
    if (!json.ok) throw new UploadFailedError();
    const exportedKey = await crypto.subtle.exportKey('raw', key);
    const encodedKey = base64ToUrl(encode(exportedKey));

    let paste: UploadedPaste = {
        token: json.delete,
        downloadId: json.url.replace(downloadEndpoint, ''),
        key: encodedKey,
    };
    database.addPaste(
        paste,
        content.split('\n').slice(0, 10).join('\n').trim()
    );
    return paste;
}

export async function deletePaste(token: string): Promise<DeleteResponse> {
    const res = await fetch(apiEndpoint + 'delete/' + token);
    if (res.status === 403 || res.status === 200) database.removePaste(token);
    if (res.status === 403) throw new FileNotFoundError();
    if (res.status !== 200) {
        throw new Error('Unexpected status: ' + res.status);
    }
    return await res.json();
}

export async function getFileInfo(id: string): Promise<FileInfoResponse> {
    const res = await fetch(apiEndpoint + 'get/' + id);
    if (res.status === 403) throw new FileNotFoundError();
    return await res.json();
}

export async function fetchPaste(
    downloadId: string,
    key: string | ArrayBuffer | Uint8Array
): Promise<string | null> {
    if (typeof key === 'string') {
        key = decode(urlToBase64(key));
    }
    if (key.byteLength !== 32) {
        throw new Error('Key is of wrong length!');
    }
    const importedKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    );
    const info = await getFileInfo(downloadId);
    if (info.size > maxSize) return null;
    if (info.size < 29) {
        throw new Error('Parcel is less than 29 bytes');
    }
    const res = await fetch(downloadEndpoint + downloadId + '?raw');

    if (res.status === 404) throw new FileNotFoundError();
    const arrayBuffer = new Uint8Array(await res.arrayBuffer());
    const iv = arrayBuffer.slice(0, 12);
    const encryptedMessage = arrayBuffer.slice(12);

    const decryptedBuffer: ArrayBuffer = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        importedKey,
        encryptedMessage
    );
    return await new Blob([decryptedBuffer]).text();
}
