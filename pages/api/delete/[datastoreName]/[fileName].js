import path from "path";
import fs from "fs";
import chalk from "chalk";
import { log } from "/lib/logWrapper";

let validMethods = ["GET", "DELETE"];

export default function handler(req, res) {
    if (!validMethods.includes(req.method)) return res.status(405).send({ status: 405, response: "Method not allowed (use GET or DELETE)" });
    if (!req.user.roles.includes("admin")) return res.status(403).send({ status: 403, response: "Forbidden: User is not an administrator" });
    const { config } = req;

    let fileName = req.query.fileName;
    if (!fileName) return res.status(400).send({ status: 400, response: "Bad Request: No file name provided (use parameter :fileName)" });

    let datastore = config.storage.datastores[req.query.datastoreName ? req.query.datastoreName : config.storage.current];
    let datastoreName = req.query.datastoreName ? req.query.datastoreName : config.storage.current;
    if (!datastore) return res.status(500).send({ status: 500, response: "Internal Server Error: No default datastore found (configure one in nextShare configuration)" });
    
    const directoryIndex = fs.readdirSync(path.join(config.storage.rootPath, datastore.folder), { withFileTypes: true });
    let actualFile = directoryIndex.find(file => file.name.startsWith(fileName));
    if (!actualFile) return res.status(404).send({ status: 404, response: "Not Found: File not found" });
    
    const filePath = path.join(config.storage.rootPath, datastore.folder, actualFile.name);
    if (!fs.existsSync(filePath)) return res.status(404).send({ status: 404, response: "Not Found: File not found" });

    try {
        fs.unlinkSync(filePath);
        log(`File ${chalk.bold(`${actualFile.name}`)} ${chalk.red("successfully deleted")} in datastore ${chalk.bold(datastoreName)} by ${chalk.bold(req.user.user)} (${chalk.bold(new Date().toUTCString())})`, "delete");
        return res.status(200).send({ status: 200, response: "File deleted" });
    } catch (err) {
        log(`Error while deleting file: ${err.stack}`, "error");
        return res.status(500).send({ status: 500, response: "check stdout for more information" });
    };
};