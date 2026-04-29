# BlockHash Arcade v3.0

Stable portfolio demo for an educational full-stack provably fair arcade. It uses future Bitcoin block hashes, server seed commitments, Node.js, SQLite, and vanilla JavaScript.

![Status](https://img.shields.io/badge/status-stable%20portfolio%20demo-31d6a0)
![Money](https://img.shields.io/badge/no%20real%20money-educational%20only-58a6ff)

## Disclaimer

BlockHash Arcade v3.0 is an educational demo only. It has no real money, no deposits, no withdrawals, and no gambling functionality. Credits are local demo points.

## Features

- Anonymous demo users with a 1000 CC starting balance.
- Three simple games: HEX Hunter, Parity Pulse, and Quantum Flip.
- Server seed commitment before every bet.
- Resolution against the next Bitcoin block hash.
- Public resolved bet log with verification data.
- Leaderboard by demo profit.
- Independent fairness verifier.
- Background bet resolution every 30 seconds.

## How It Works

1. A user creates a bet.
2. The backend generates a hidden `server_seed` and stores its SHA256 hash as `server_seed_hash`.
3. The bet targets the next Bitcoin block height.
4. After that block exists, the backend resolves the bet with:

```text
finalHash = SHA256(blockHash + serverSeed + betId)
```

5. The resolved public log reveals the server seed, block hash, and final hash so anyone can verify the result.

## Tech Stack

- Backend: Node.js, Express, SQLite
- Frontend: vanilla HTML, CSS, JavaScript
- Bitcoin data: mempool.space with BlockCypher fallback
- Security middleware: Helmet, CORS, express-rate-limit

## Local Run

```bash
cd backend
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

Health check:

```text
http://localhost:3000/api/health
```

If port `3000` is already used by another local project, start the demo on `3001` instead:

```bash
PORT=3001 npm start
```

Then open:

```text
http://localhost:3001
```

Health check:

```text
http://localhost:3001/api/health
```

## Environment

Copy `.env.example` to `.env` if you want to override defaults.

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | HTTP server port |
| `CORS_ORIGIN` | `http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001` | Allowed browser origins |
| `MAX_STAKE` | `500` | Maximum stake per demo bet |
| `MAX_PENDING_BETS` | `3` | Maximum pending bets per user |

## Documentation

- [API reference](API.md)
- [Fairness explanation](FAIRNESS.md)

## Deployment

### Render

1. Create a new Web Service from the GitHub repository.
2. Set the root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables from `.env.example` if needed.

Render free storage may be ephemeral. For a portfolio demo this is acceptable, but the SQLite database can reset after restarts or redeploys. Use a persistent disk or managed database for long-lived data.

### Railway

1. Create a new project from the GitHub repository.
2. Set the service root to `backend`.
3. Use `npm install` as the build step and `npm start` as the start command.
4. Configure environment variables from `.env.example`.

For persistent production-like storage, attach a volume or move the data layer away from local SQLite.

## Screenshots

Place portfolio screenshots in `screenshots/` after deployment or local capture.

## License

MIT License. See [LICENSE](LICENSE).
