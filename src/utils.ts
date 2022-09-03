import { UploadedPastePublic } from './api';
export function copyText(text: string): boolean {
    if ('clipboard' in navigator) {
        navigator.clipboard.writeText(text);
        return true;
    }
    const el = document.createElement('textarea');
    el.style.position = 'absolute';
    el.style.left = '-100%';
    el.style.right = '-100%';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    const res = document.execCommand('copy');
    if ('remove' in el) el.remove();
    else document.body.removeChild(el);
    return res;
}

export const languageAliases = {
    txt: 'text',
    js: 'javascript',
    md: 'markdown',
    py: 'python',
};

export function base64ToUrl(base64: string): string {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''); // remove padding
}

export function urlToBase64(base64Url: string): string {
    base64Url = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    // Pad out with standard base64 required padding characters
    var pad = base64Url.length % 4;
    if (pad) {
        if (pad === 1) {
            throw new Error(
                'InvalidLengthError: Input base64url string is the wrong length to determine padding'
            );
        }
        base64Url += new Array(5 - pad).join('=');
    }

    return base64Url;
}

export function buildPasteUri(paste: UploadedPastePublic): string {
    return '/' + paste.downloadId + '#' + paste.key;
}
