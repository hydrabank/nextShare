const DatabaseManager = require("./Database");
const { validate } = require("jsonschema");

const schemas = {
    user: {
        type: "object",
        properties: {
            user: { type: "string" },
            friendlyName: { type: "string" },
            password: { type: "string" },
            roles: { type: "array" },
            deleteToken: { type: "string" },
            customColour: { type: "string" },
            flags: { type: "array" },
        },
        required: ["user", "friendlyName", "password", "roles", "deleteToken", "customColour"]
    }
};

class UserManager {
    constructor(options) {
        this.options = options;
        this.db = new DatabaseManager(options);
    };

    async getUser(username) {
        const users = await this.db.get("users");
        return users.find(user => user.user === username);
    };

    async getAllUsers(master) {
        const users = await this.db.get("users");
        if (master) {
            return users;
        } else {
            return users.map(user => {
                delete user.password;
                return user;
            });
        };
    };

    async addUser(user) {
        const valid = validate(user, schemas.user);
        if (valid.errors.length > 0) {
            return {
                status: "error",
                data: `User ${user.user} is not valid. Check schema for reference.`,
                data_Errors: valid.errors
            };
        };

        let users = await this.db.get("users");
        const existingUser = users.find(u => user.user === u.user);
        if (existingUser) {
            return {
                status: "error",
                data: `User ${user.user} already exists.`
            };
        } else {
            if (user.roles.includes("root") && !user.roles.includes("SYSTEM")) {
                return {
                    status: "error",
                    data: `Role "root" can only be assigned to users with the SYSTEM flag.`
                };
            } else if (user.user === "root") {
                return {
                    status: "error",
                    data: `User "root" is a reserved user.`
                };
            };
            users.push(user);
            await this.db.set("users", users);
            return {
                status: "success",
                data: user
            };
        };
    };

    async removeUser(user) {
        let users = await this.db.get("users");
        const existingUser = users.find(u => user === u.user);
        if (existingUser) {
            users = users.filter(u => user !== u.user);
            await this.db.set("users", users);
            return {
                status: "success",
                data: user
            };
        } else {
            return {
                status: "error",
                data: `User ${user} does not exist.`
            };
        };
    };
    
    async updateUser(username, newData) {
        let users = await this.db.get("users");
        const existingUser = users.find(u => username === u.user);
        if (existingUser) {
            const valid = validate(newData, schemas.user);
            if (valid.errors.length > 0) {
                return {
                    status: "error",
                    data: `User ${username} is not valid. Check schema for reference.`,
                    data_Errors: valid.errors
                };
            };
            if (newData.roles.includes("root") && !newData.roles.includes("SYSTEM")) {
                return {
                    status: "error",
                    data: `Role "root" can only be assigned to users with the SYSTEM flag.`
                };
            } else if (newData.user === "root") {
                return {
                    status: "error",
                    data: `User "root" is a reserved user.`
                };
            };
            users = users.map(u => {
                if (u.user === username) {
                    return newData;
                } else {
                    return u;
                };
            });
            await this.db.set("users", users);
            return {
                status: "success",
                data: newData
            }
        } else {
            return {
                status: "error",
                data: `User ${username} does not exist.`
            }
        }
    };

    async getUserByDeleteToken(token, master) {
        const users = await this.db.get("users");
        const user = users.find(user => user.deleteToken === token);
        if (user) {
            if (master) {
                return user;
            } else {
                delete user.password;
                return user;
            };
        } else {
            return {
                status: "error",
                data: `User with delete token ${token} does not exist.`
            };
        };
    };
};

module.exports = UserManager;