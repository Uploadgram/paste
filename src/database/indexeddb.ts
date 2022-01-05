import { Database } from './abstract';

export default class IndexedDb extends Database {
    idbBlocked: boolean = true;

    constructor() {
        super();

        let request = window.indexedDB.open('pastes', 1);
        request.onblocked = function (e) {
            console.log('request blocked');
        };
        request.onsuccess = this.setNoIdbBlocked;
        request.onupgradeneeded;
    }

    private setNoIdbBlocked() {
        this.idbBlocked = false;
    }
}
