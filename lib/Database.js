const Keyv = require("keyv");
const { log } = require("./logWrapper.js");

class Database {
    /**
     * Creates a new instance of DatabaseManager.
     * @param {*} options Options to pass to the database (URI and namespace).
     */
    constructor(options) {
        if (typeof options.uri !== "string") {
            throw new TypeError("Database: uri in constructor must be a string");
        };

        let namespace = "ns_default";
        if (typeof options.namespace == "string") namespace = "ns_" + options.namespace;
        
        this.db = new Keyv(options.uri, {
            namespace: namespace
        });

        this.db.on("error", (e) => {
            log(`An issue occurred during a database handshake: ${e.stack}`, "error");
            return process.exit(1);
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

module.exports = Database;