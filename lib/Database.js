import Keyv from 'keyv';
import KeyvFile from 'keyv-file';

class Database {
    constructor(options) {
        if (typeof options.filePath !== "string") {
            throw new TypeError("Database: filePath in constructor must be a string");
        };
        
        this.db = new Keyv({
            store: new KeyvFile({
                filename: options.filePath
            })
        });
    };
    
    async get(key) {
        let value = await this.db.get(key);

        if (value === undefined || value === null || value === "") {
            return null;
        };

        return value;
    };

    async set(key, value) {
        if (value === undefined || value === null || value === "") {
            throw new TypeError("value cannot be null, undefined, or an empty string");
        } if (key === undefined || key === null || key === "") {
            throw new TypeError("key cannot be null, undefined, or an empty string");
        };

        await this.db.set(key, value);
        return value;
    };

    async delete(key) {
        await this.db.delete(key);
        return true;
    };

    async clear() {
        await this.db.clear();
        return true;
    };
};

export default Database;
