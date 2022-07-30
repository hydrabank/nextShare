const { log } = require("./lib/logWrapper");
const express = require("express");
const path = require("path");
const fs = require("fs");
const next = require("next");
const chalk = require("chalk");

const configExists = fs.existsSync(path.join(__dirname, './nextshare.config.js'), 'utf8');
const publicCfgExists = fs.existsSync(path.join(__dirname, './lib/publicEnv.js'), 'utf8');

if (configExists === false) {
    log(`Please create a ${chalk.bold("nextshare.config.js")} file in the root of the nextShare directory. An example can be found in the ${chalk.bold("nextshare.config.example.js")} file.`, "error");
    process.exit(1);
} if (publicCfgExists === false) {
    log(`Please create a ${chalk.bold("publicCfg.js")} file in the lib folder of the nextShare directory. An example can be found in the ${chalk.bold("lib/publicEnv.example.js")} file.`, "error");
    process.exit(1);
}

const config = require('./nextshare.config.js');
const publicCfg = require('./lib/publicEnv.js');
const { hostname, port } = config.listener;

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
                const { method, headers } = req;
                if (!headers.auth_user || !headers.auth_pass) {
                    res.statusCode = 401;
                    return res.send({ status: 401, message: "Unauthorized (no username or password provided, use auth_user and auth_pass headers)" });
                };
                const { auth_user, auth_pass } = headers;
                
                const user = config.authentication.find(u => u.user === auth_user && u.password === auth_pass);
                if (user === undefined) {
                    res.statusCode = 401;
                    return res.status(404).send({ status: 401, response: "Forbidden (user or password incorrect)" });
                };

                req.user = user;
                req.config = config;

                return await handle(req, res);
            };

            if (req.path.startsWith("/api/delete")) {
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