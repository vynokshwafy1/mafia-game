# The Mafias: Midnight in Bellweather

A browser Mafia game with private online rooms, username/password accounts, player profiles, a coin wallet, AI seats, AI God, daily randomized challenges, Council chat, secret ballots, night actions, and a WebGL 3D town scene.

## Run locally

Install Node.js 20 or later and run:

    npm start

Open http://localhost:3000. Create an account, then host a room and share its six-character invite code. Friends sign in on their own devices and join with the code. AI God deals roles privately, draws a new challenge each day, deals Mystery Box cards, opens Council chat, and resolves votes and night actions. Choose from zero to eight AI players when setting up; rooms support up to eight total players.

The local single-device game remains available from the setup screen. The Doctor is included only in a four-player game.

## Accounts and saved data

Passwords are stored as salted scrypt hashes. Accounts, profile customizations, and coins are saved under the server data directory (by default, data/). Set DATA_DIR to a durable mounted folder before deploying if account and coin data should survive restarts. Active rooms are currently held in server memory and end if the server restarts.

## Publish

The repository includes render.yaml for a Render Node web service. Push the project to a Git repository, connect it in Render, and create the service from the blueprint. Render supplies a public onrender.com URL. Its free web service uses an ephemeral filesystem, so attach durable storage or configure a persistent database before relying on saved accounts and coins. A custom domain can be added in the Render dashboard.
