export function getServerSideProps(ctx) {
    const fs = require("fs");
    const path = require("path");
    const filesize = require("filesize");
    const { lookup } = require("mime-types");
    const extensionLookup = require("mime-types").extension;
    const { DateTime } = require("luxon");

    const { filename } = ctx.query;
    const datastoreQuery = ctx.query.datastore;

    const { access, storage, authentication } = require("/nextshare.config.js");
    const { log } = require("/lib/logWrapper");
    
    if (!storage.datastores[datastoreQuery]) {
        return {
            props: {
                status: "01-1",
                datastore: datastoreQuery,
                filename: filename
            }
        }
    };

    const datastore = storage.datastores[datastoreQuery];

    if (!datastore.online) {
        return {
            props: {
                status: "01-1",
                datastore: datastoreQuery,
                filename: filename
            }
        };
    };

    if (storage.type == "fs") {
        try {
            fs.readdirSync(path.join(storage.rootPath, datastore.folder), { withFileTypes: true });
        } catch(e) {
            log(`Error while looking up file: ${e.stack}`, "error");
            return {
                props: {
                    status: "01-1",
                    datastore: datastoreQuery,
                    filename: filename
                }
            };
        };

        const directoryIndex = fs.readdirSync(path.join(storage.rootPath, datastore.folder), { withFileTypes: true });
        let actualFile = directoryIndex.find(file => file.name.startsWith(filename));
        
        if (!actualFile) {
            return {
                props: {
                    status: "01-2",
                    datastore: datastoreQuery,
                    filename: filename
                }
            };
        };

        let tryData = {
            stats: {
                sizeFriendly: { type: "String" },
                birthDate: new Date(0),
            },
            isImage: { type: "String" },
            author: { type: "String" },
            datastore: { type: "String" },
        };

        try {
            fs.readFileSync(path.join(storage.rootPath, datastore.folder, actualFile.name));
            let stats = fs.statSync(path.join(storage.rootPath, datastore.folder, actualFile.name));
            let author;

            if (typeof lookup(actualFile.name) === "string") {
                tryData.isImage = lookup(actualFile.name).startsWith("image/")
            } else {
                tryData.isImage = false;
            };

            if (actualFile.name.includes("_nsAuthor_")) {
                let authorObj;
                if (typeof lookup(actualFile.name) === "string") authorObj = authentication.find(u => u.user === actualFile.name.split("_nsAuthor_")[1].replace(`.${extensionLookup(lookup(actualFile.name))}`, ""));
                else {
                    authorObj = authentication.find(u => u.user === actualFile.name.split("_nsAuthor_")[1].split(".").slice(0, -1).join("."));
                };

                if (authorObj) {
                    author = authorObj.friendlyName || authorObj.user;
                } else {
                    author = "Unknown Author";
                };
            } else {
                author = "Unknown Author";
            }

            tryData.author = author;
            tryData.datastore = datastore.friendlyName;

            tryData.stats = {
                sizeFriendly: (filesize(stats.size) === 0 ? "[Size indexing unsupported]" : filesize(stats.size)),
                creationTimeUtc: {
                    time: DateTime.fromJSDate(new Date(stats.birthtime), { zone: "utc" }).toLocaleString(DateTime.TIME_SIMPLE),
                    date: DateTime.fromJSDate(new Date(stats.birthtime), { zone: "utc" }).toLocaleString(DateTime.DATE_FULL),
                    shortDate: DateTime.fromJSDate(new Date(stats.birthtime), { zone: "utc" }).toLocaleString(DateTime.DATE_SHORT),
                },
            };
        } catch(e) {
            log(`Error while reading file: ${e.stack}`, "error");
            return {
                props: {
                    status: "01-2",
                    datastore: datastoreQuery,
                    filename: filename
                }
            };
        };
        
        let file = `${access.baseUrl}/ds/${datastore.folder}/${actualFile.name}`;
        
        if (tryData.isImage) {
            return {
                props: {
                    status: "02-1",
                    filename: filename,
                    extension: extensionLookup(lookup(actualFile.name)),
                    res: file,
                    ...tryData
                }
            };
        } else {
            return {
                redirect: {
                    destination: `${file}`,
                    permanent: true
                }
            };
        };
    } else {
        return {
            props: {
                status: "01-1",
                datastore: datastoreQuery,
                filename: filename
            }
        };
    };
};