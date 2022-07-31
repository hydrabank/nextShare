# How to configure nextShare

## Configuration files
There are two configuration files in nextShare:

- `nextshare.config.js`, the primary configuration and secrets file for nextShare. All authentication and storage configuration is stored here.
- `lib/publicEnv.js`, the public and customization file for nextShare's frontend. This file contains the configuration for the frontend, such as the instance name and icons.

While both files configure different components of the instance, both are equally important.

## Backend configuration (nextshare.config.js)
As mentioned above, nextShare's backend configuration is stored in `nextshare.config.js`. There are many settings to configure, like datastores and authentication. This section will cover the most important settings.

> **Warning**
> If you are storing authentication credentials in this file, it should be kept **INCREDIBLY CONFIDENTIAL**! Sharing this file may compromise the security of your instance.

### Access and listeners
```js
access: {
    baseUrl: "http://localhost:3000"
},
listener: {
    hostname: "127.0.0.1",
    port: 3000,
},
```

These settings are the most straightforward - they configure the primary instance URL, accessible network interfaces, and the instance's listening port. By default, the instance listens on `localhost:3000` and will only be accessible from the local machine. It is recommended to **only listen on localhost** or a network interface that is not exposed to the internet, and instead use a "gateway" reverse proxy (such as NGINX or HAProxy) to allow outside access to the instance.

### Authentication
> **Note**
> The JSON-based authentication configuration options are not recommended in automated usecases. In cases where accounts and modification to authentication settings may be automated, it is recommended to configure database storage for authentication. See the [Database Authentication](#database-authentication) section for more details.

```js
authentication: [
    {
        user: "user1", // The username to use when logging in
        friendlyName: "User 1", // The friendly name (shows up in the frontend)
        password: "examplePassword", // Set the user password here
        roles: ["admin"], // Set user roles
        deleteToken: "deletetokenhere", // The user's delete token (used to delete files from the instance)  
        customColour: "#ff0000", // The user's custom colour (hex code)
    }
],
```

The `authentication` array contains all valid user authentication information. Each user is represented by an object with the following properties:

- `user`: The username used when running protected tasks (like uploading files)
- `friendlyName`: This is the name that will be shown in the frontend in place of the user's actual username
- `password`: The user's password, used to authenticate the user (the account will not function properly without a password)
- `roles`: The user's set roles (see below section for more information)
- `deleteToken`: The user's delete token (exclusively used for deleting files from the instance)
- `customColour`: This colour is used in place of the global default theme colour used in openGraph and Twitter Card embeds.

#### Roles
The roles array contains the user's set roles. The following roles are available as of v0.5.0:
- `root`: This role is reserved for the `root` user defined in the `nextshare.config.js` file.
- `proctor`: The user is the proctor of the instance. A proctor is essentially a "sudoer" in the sense that they have access to all data.
- `admin`: The user is an administrator of the instance. The user can perform most actions on the instance, including deleting files (even those not owned by the user). **In the future, administrators will be able to completely bypass ACLs configured in datastores.**


#### Root User Details
```js
rootUser: { // Read CONFIGURATION.md for more details
    enabled: true // Set to true to enable the root user
},
```
The root user is the master user of the instance. While effectively proctor-level, this account is effectively a "recovery" account in the case of no other users being in the instance. It also serves as a first-run user (in database mode) and should only be used to create a second account stored in database.

The username for the root user is `root`, and the password is `nextShare`. **This is not modifiable and is a reserved username when creating new users.**

**DO NOT** leave the root account enabled in a production setting unless if needed for recovery or first-time setup. It is a *MASSIVE* security risk to keep it enabled.


#### Database Authentication
For those who need granular control over authentication to their nextShare instance (e.g. if you want to integrate with your pre-existing authentication system), you can use database authentication via mongoDB (with other database methods coming in the future). This is **not** for the faint-hearted as there are no front-end management options for this (all account management is done via the special account manager.).

If you wish to use database storage for authentication, you can replace the above skeleton with the following:

At this time, only **mongoDB** is supported.

```js
    authentication: {
        database_env: true
    }
```

- `authentication.database_env`: This is a boolean value that determines whether or not the database authentication is enabled.

**Database connection details can be configured in .env.local, which should be created in the root of the project**:
```env
NEXTSHARE_AUTHENTICATION_DATABASE_URI=mongodb://localhost:27017/nextshare
```

- `NEXTSHARE_AUTHENTICATION_DATABASE_URI`: The database URI for the connection. This is the only setting that is required.
- 

> **Warning**
> Note that your .env file should be INCREDIBLY confidential! Sharing this file may compromise the security of your instance. Also ensure that your database is secured!

### Datastores
```js
datastores: {
    "store1": { // Name of datastore, used in URLs (other than static URLs for non-image files)
        friendlyName: "Store A", // Friendly name of datastore (shows up in the frontend)
        folder: "store1", // The folder (or bucket, depending on storage type) that the datastore is stored in
        online: true, // If set to offline, the datastore will not be available from the frontend (but will still be accessible from the backend static component)
        fileNamePolicy: {
            type: "random", // Types are: random, hash
            fileLength: 14, // Only used if type is random
        },
        acceptedFilesPolicy: {
            type: "all", // Types are: all (all files allowed), whitelist (only extensions on whitelist are allowed / all other extensions are blocked), blacklist (extensions on blacklist are blocked)
            whitelist: ["jpg", "png", "gif", "jpeg", "svg", "txt"], // Only used if type is whitelist
            blacklist: ["exe", "apk", "dmg", "AppImage"] // Only used if type is blacklist
        }
    }
}
```

The `datastores` object contains all datastores that are configured for the instance. Each datastore is represented by an object with the following properties:

- `friendlyName`: This is the name that will be shown in the frontend in place of the datastore's actual name.
- `folder`: The folder (or bucket, for object-based storage configurations) that data from the datastore is stored in.
- `online`: Online datastores are completely accessible from the frontend. While offline datastores are not accessible from the frontend, backend access (using the static paths given with non-image files) is still available. **This setting should not be used as a security measure - move or replace/delete the data (or remove the datastore from the configuration) if the datastore needs to be taken completely offline.**
- `fileNamePolicy.type`: This is the policy used to generate file names for uploaded files. The following types are available:
    - `random`: A random string of the given length is generated for each file.
    - `hash`: A hash of the file's contents is generated for each file.
- `fileNamePolicy.fileLength`: This is the length of the random string generated for each file. Only used if `fileNamePolicy.type` is `random`.
- `acceptedFilesPolicy.type`: This is the policy used to determine which file extensions are allowed to be uploaded to the datastore. The following types are available:
    - `all`: All files are allowed to be stored within the store.
    - `whitelist`: Only files with extensions on the whitelist are allowed.
    - `blacklist`: Only files with extensions on the blacklist are blocked.
- `acceptedFilesPolicy.whitelist`: This is the list of extensions that are allowed to be uploaded to the datastore. Only used if `acceptedFilesPolicy.type` is `whitelist`.
- `acceptedFilesPolicy.blacklist`: This is the list of extensions that are allowed to be uploaded to the datastore. Only used if `acceptedFilesPolicy.type` is `blacklist`.

**Note with the acceptedFilesPolicy settings:** This does not apply to files that are manually uploaded or otherwised moved to the datastore via external means.

## Frontend configuration (lib/publicEnv.js)
The frontend configuration is stored in `lib/publicEnv.js`. This file contains the configuration for the frontend, like index.html redirection and the name of the instance.

```js
frontend: {
    redirect: {
        url: "https://example.com", // redirect to page when navigating to /
        enabled: false // enable redirect
    },
    customization: {
        name: "hydro", // name of the instance
        embedColour: "#00ff00", // colour of openGraph embeds
        // to change the icon: swap out icon.png for your own icon (with the same name)
        // for the favicon: swap out favicon.ico with a new one with the same name (must be .ico)
        // banner: replace banner.png with your own banner with the same name (regular resolution is 1920x1080)
        // or fork this repository and manually change the file namepaths
    }
}
```

Here is a rundown of the frontend configuration:
- `frontend.redirect.url` is the URL that the frontend will redirect to when the user navigates to `/`.
- `frontend.redirect.enabled` is straight forward - it determines if the redirect is enabled or not.
- `frontend.customization.name` is the name of the instance. This is incredibly simple - it's the name shown in the frontend, and the name that is referenced in place of the default `nextShare` in the frontend.

### Changing favicons, icons, and banners

- Favicon: swap out `favicon.ico` with your own favicon image. This **must** also be in `ico` format with the same name.
- Icon: Similar to the favicon, swap `icon.png` with your own replacement. It is highly recommended that you use a square image with a transparent background (and with a preferable size of at least 512x512).
- Banner: Likewise, `banner.png` stores the banner. The default resolution is 1920x1080 (standard HD resolution).

For more advanced edits, you should probably fork this repository instead. nextShare, while being incredibly useful without any modifications, only has basic customization options and is designed to be used as a basic starting point for a Next.js project; it only handles the basic Next project setup, Tailwind, and some backend functions (like file uploads) - not much else. Instead of using nextShare without any modifications, fork it and edit/extend it to your liking.