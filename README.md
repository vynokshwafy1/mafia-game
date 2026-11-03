# The Mafias: Midnight in Bellweather

A browser Mafia game with private online rooms, username/password accounts, player profiles, a coin wallet, AI seats, AI God, daily randomized challenges, Council chat, secret ballots, night actions, and a WebGL 3D town scene.

## Play online
[Play The Mafias: Midnight in Bellweather](https://mafia-game-ij59.onrender.com/). No download or local server is required.

## Accounts and saved data

Passwords are stored as salted scrypt hashes. Accounts, profile customizations, and coins are saved under the server data directory (by default, data/). Set DATA_DIR to a durable mounted folder before deploying if account and coin data should survive restarts. Active rooms are currently held in server memory and end if the server restarts.

## Source and hosting
This public repository contains the game source. The hosted game is available at [mafia-game-ij59.onrender.com](https://mafia-game-ij59.onrender.com/).