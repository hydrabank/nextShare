# nextShare
A visually-appealing and modern file sharing and upload server written with ES6-friendly Next.js. Designed for ShareX, useable with other software as well.

## How to install in production mode
1. Clone the repository (`git clone https://github.com/hydrabank/nextShare.git`)
2. Install dependencies (`yarn install`, `npm install` works fine too)
3. Build the app with the Next CLI (`yarn build`, `npm run build`, or `next build`)
4. Start the server (`yarn prod`, `npm run prod`, or `NODE_ENV=production node ./bootstrapper.js`, nextShare uses Next.js's custom server feature to extend it)

**Every time the (publicEnv or nextShare configuration) is changed, the bundle will need to be rebuilt. Until proper persistent database support has been added, the recommended solution is to add `yarn build` to your startup flow.**

## Development
- Follow steps 1 and 2 as stated in the previous section
- Start the app in development mode (`yarn start`, `npm run start`, or `next dev`)
- Open the app in your browser (`http://localhost:3000`)

## Configuration
See [CONFIGURATION.md](docs/CONFIGURATION.md) for more information.

## Credits
- [Hydro](https://danny.works): I created this project and wrote the bulk of the code for it. Hi there!


**NOTE: nextShare is not at all related with Vercel as a company and is only written with Next, the framework.**