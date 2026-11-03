# The Mafias: Midnight in Bellweather

A browser Mafia game where AI God runs both local pass-and-play and online rooms. Players answer privately on a shared device in local mode; AI God scores challenges, deals shuffled Mystery cards, keeps Council time, counts secret ballots, and resolves nights. Includes AI seats, profiles, coins, daily randomized challenges, Council chat, sound effects, and a WebGL 3D town scene.

## Play online
[Play The Mafias: Midnight in Bellweather](https://mafia-game-ij59.onrender.com/). No download or local server is required.

## Accounts and saved data

Passwords are stored as salted scrypt hashes. Accounts, profile customizations, and coins are saved under the server data directory (by default, data/). Set DATA_DIR to a durable mounted folder before deploying if account and coin data should survive restarts. Active rooms are currently held in server memory and end if the server restarts.

## Source and hosting
This public repository contains the game source. The hosted game is available at [mafia-game-ij59.onrender.com](https://mafia-game-ij59.onrender.com/).