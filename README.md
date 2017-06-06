# CATHbot
something something meme bot

# Installation
Requires Node.js >= 7.0.0 (makes use of async/await, so `--harmony` flag is required).   
Requires MongoDB server

Create a `config.json` file in `./` in the same fashion as the provided `config.json.example`.

Be sure to `npm install` to get dependencies, then...

Update database with:
`npm run db`

Finally,
`npm start` (or optionally -- and preferably -- use something like `pm2` to run your bot).
