const { log } = require("./lib/logWrapper");
const express = require("express");
const path = require("path");
const fs = require("fs");
const next = require("next");
const DatabaseManager = require("./lib/Database");
const chalk = require("chalk");

const { loadEnvConfig } = require("@next/env");
loadEnvConfig('./', process.env.NODE_ENV !== 'production')

const configExists = fs.existsSync(path.join(__dirname, './nextshare.config.js'), 'utf8');
const publicCfgExists = fs.existsSync(path.join(__dirname, './lib/publicEnv.js'), 'utf8');

if (configExists === false) {
    log(`Please create a ${chalk.bold("nextshare.config.js")} file in the root of the nextShare directory. An example can be found in the ${chalk.bold("nextshare.config.example.js")} file.`, "error");
    process.exit(1);
} if (publicCfgExists === false) {
    log(`Please create a ${chalk.bold("publicCfg.js")} file in the lib folder of the nextShare directory. An example can be found in the ${chalk.bold("lib/publicEnv.example.js")} file.`, "error");
    process.exit(1);
}

if (process.env.NODE_ENV !== "production") {
    log(`${chalk.bold("Development mode")} is ${chalk.bold("enabled")}.`, "info");
};

const config = require('./nextshare.config.js');
const publicCfg = require('./lib/publicEnv.js');
const { hostname, port } = config.listener;


let database = {
    authentication: {}
};

if (config.authentication?.database_env === true) {
    log(`Accounts are being loaded in ${chalk.bold("database mode")}.`, "info");
    if (!process.env.NEXTSHARE_AUTHENTICATION_DATABASE_URI) {
        log(`${chalk.bold("NEXTSHARE_AUTHENTICATION_DATABASE_URI")} is not set.`, "error");
        return process.exit(1);
    };
    
    database.authentication = {
        uri: process,
        type: "db",
        instance: new DatabaseManager({ uri: process.env.NEXTSHARE_AUTHENTICATION_DATABASE_URI, namespace: "authentication" })
    };

    (async () => {
        let dbRequest = await database.authentication.instance.get("users");
        
        const rootUser = {
            user: "root",
            friendlyName: "System",
            password: "nextShare",
            roles: ["admin", "proctor", "root"],
            flags: ["SYSTEM"],
            authorColour: null,
            deleteToken: "rootToken"
        };

        if (dbRequest === null) {
            if (config.rootUser?.enabled === true) {
                dbRequest = [rootUser];
            } else {
                dbRequest = [];
            }

            await database.authentication.instance.set("users", dbRequest);
        } else {
            const rootUser = dbRequest.find(user => user.user === "root" && user.roles.includes("root"));
            if (rootUser === undefined) {
                if (config.rootUser?.enabled === true) {
                    dbRequest.push(rootUser);
                };
            } else {
                if (config.rootUser?.enabled === false) {
                    dbRequest = dbRequest.filter(user => user.user !== "root");
                };
                
            };

            await database.authentication.instance.set("users", dbRequest);
        };

        config.authentication = dbRequest;
    })();
} else {
    if (config.rootUser.enabled === true) {
        log(`Root user CANNOT be enabled when accounts are loaded from JSON. Define users in the Authentication section of the configuration, or enable database authentication.`, "error");
        return process.exit(1);
    };
    log(`Accounts are being loaded in ${chalk.bold("JSON mode")}.`, "info");
    database = {
        uri: null,
        type: "memory"
    };
};

const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();


/* Based on Next.js examples. Reference: https://nextjs.org/docs/advanced-features/custom-server */
app.prepare().then(() => {
    const server = express();

    server.use("/ds", express.static(path.join(config.storage.rootPath)));

    server.all("*", async (req, res) => {
        try {
            if (req.path.startsWith("/api/protected")) {
                const { headers } = req;
                if (!headers.auth_user || !headers.auth_pass) {
                    res.statusCode = 401;
                    return res.send({ status: 401, message: "Unauthorized (no username or password provided, use auth_user and auth_pass headers)" });
                };
                const { auth_user, auth_pass } = headers;
                
                const user = config.authentication.find(u => u.user === auth_user && u.password === auth_pass);
                if (user === undefined) {
                    res.statusCode = 401;
                    return res.status(401).send({ status: 401, response: "Forbidden (user or password incorrect)" });
                };

                req.user = user;
                req.config = config;

                return await handle(req, res);
            };

            if (req.path.startsWith("/api/delete")) {
                if (!req.query.deleteToken) return res.status(401).send({ status: 401, response: "Forbidden (no delete token provided)" });
                const user = config.authentication.find(u => u.deleteToken === req.query.deleteToken);
                if (user === undefined) {
                    res.statusCode = 401;
                    return res.status(404).send({ status: 401, response: "Forbidden (deleteToken incorrect)" });
                };

                req.user = user;
                req.config = config;
                
                return await handle(req, res);
            };

            if (publicCfg.frontend.redirect.enabled === true) {
                if (req.path === '/') {
                    return res.redirect(publicCfg.frontend.redirect.url);
                };
            };

            await handle(req, res);
        } catch (err) {
            log(`Error occurred handling route: ${err.stack}`, "error");
            res.statusCode = 500;
            res.send({ status: 500, response: "Internal Server Error: check stdout for more information" });
        };
    });

    server.listen(port, hostname, (err) => {
        if (err) throw err;
        log(`started nextShare on ${hostname}:${port}, url: http://${hostname}:${port}`, "ready");
    });
});