import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import * as generator from "generate-password";
import { extension } from "mime-types";
import { log } from "/lib/logWrapper";
import chalk from "chalk";

let defaultRandomGeneratorOptions = {
    length: 10,
    numbers: true
};

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).send({ status: 405, response: "Method not allowed (use POST)" });
    
    const { config } = req;
    let datastore = config.storage.datastores[req.query.datastore ? req.query.datastore : config.storage.current];
    let datastoreName = req.query.datastore ? req.query.datastore : config.storage.current;
    if (!datastore) return res.status(500).send({ status: 500, response: "Internal Server Error: No default datastore found (configure one in nextShare configuration)" });
    
    const body = await new Promise((resolve, reject) => {
        const f = new IncomingForm({ hashAlgorithm: "MD5" });
        
        f.parse(req, (err, fields, files) => {
          if (err) return reject(err);
          resolve({ fields, files });
        });
    });
    
    const file = body.files.toUpload;
    if (!file) return res.status(400).send({ status: 400, response: "Bad Request: No file uploaded (upload in body file name toUpload)" });
    defaultRandomGeneratorOptions.length = datastore.fileNamePolicy.fileLength;

    if (config.storage.type === "fs") {
        const directoryIndex = fs.readdirSync(path.join(config.storage.rootPath, datastore.folder), { withFileTypes: true });

        function getFileName(hash) {
            let fileName;

            switch (datastore.fileNamePolicy.type) {
                case "random":
                    fileName = generator.generate(defaultRandomGeneratorOptions);
                    break;
        
                case "hash":
                    fileName = hash;
                    break;
                
                default:
                    fileName = generator.generate(defaultRandomGeneratorOptions);
                    break;
            };
    
            const existingFile = directoryIndex.find(file => file.name.startsWith(fileName));
            if (existingFile) {
                return getFileName(hash);
            };

            return fileName;
        };
        const rootPath = path.join(config.storage.rootPath, datastore.folder);

        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        };
        
        let fileName = getFileName(file.hash) + `_nsAuthor_${req.user.user}`;
        let fileExtension = "." + extension(file.mimetype);
        if (!fileExtension) fileExtension = "";

        const deleteToken = req.user.deleteToken;
        const cleanUrl = config.access.baseUrl + "/" + datastoreName + "/" + fileName.replace(`_nsAuthor_${req.user.user}`, "");
        const deleteUrl = config.access.baseUrl + "/api/delete/" + datastoreName + "/" + fileName + "?deleteToken=" + deleteToken;

        try {
            const fileData = fs.readFileSync(file.filepath);
            const fileStream = fs.createWriteStream(path.join(rootPath, `${fileName}${fileExtension}`));

            fileStream.write(fileData);
            fileStream.end();
            
            log(`File ${chalk.bold(`${fileName}${fileExtension}`)} ${chalk.green("successfully created")} in datastore ${chalk.bold(datastoreName)} by ${chalk.bold(req.user.user)} (${chalk.bold(new Date().toUTCString())})`, "create");
            return res.status(200).send({ status: 200, response:
                {
                    fileName: `${fileName}${fileExtension}`,
                    url: cleanUrl,
                    deleteUrl: deleteUrl
                }
            });
        } catch (err) {
            log(`Error while uploading file: ${err.stack}`, "error");
            return res.status(500).send({ status: 500, response: "check stdout for more information" });
        };
    } else {
        return res.status(500).send({ status: 500, response: "Internal Server Error: Instance uses an unknown storage type" });
    };
};

export const config = {
    api: {
        bodyParser: false
    }
};