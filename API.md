# BlockHash Arcade v3.0 API Reference

Base URL: `/api`

## Public endpoints

### `GET /health`

Health check. Returns `{ "ok": true, "version": "3.0.0", "time": "...", "db": "sqlite" }`.

Example response:

```json
{
  "ok": true,
  "version": "3.0.0",
  "time": "2026-04-29T12:00:00.000Z",
  "db": "sqlite"
}
```

### `GET /public-log`

Returns last 100 resolved bets with all fairness data, including server seed.

Example response:

```json
{
  "bets": [
    {
      "id": "bet-uuid",
      "betId": "bet-uuid",
      "userId": "abcd1234",
      "game_type": "hex",
      "stake": 25,
      "guess": "a",
      "target_height": 840001,
      "status": "lost",
      "block_hash": "0000000000000000000000000000000000000000000000000000000000000000",
      "actual": "4",
      "payout": 0,
      "net_result": -25,
      "final_hash": "hash",
      "server_seed_hash": "hash",
      "server_seed": "seed",
      "created_at": "2026-04-29T12:00:00.000Z",
      "resolved_at": "2026-04-29T12:10:00.000Z"
    }
  ]
}
```

### `GET /leaderboard`

Returns top 20 users by profit: `balance - 1000`.

Example response:

```json
{
  "leaderboard": [
    {
      "userId": "abcd1234",
      "balance": 1200,
      "totalBets": 4,
      "wins": 1,
      "losses": 3,
      "profit": 200
    }
  ]
}
```

## User endpoints

### `POST /user/create`

Creates a new anonymous demo user.

Response:

```json
{
  "userId": "uuid",
  "balance": 1000,
  "createdAt": "2026-04-29T12:00:00.000Z"
}
```

### `GET /user/:userId/balance`

Returns current balance.

Example response:

```json
{
  "userId": "uuid",
  "balance": 1000,
  "createdAt": "2026-04-29T12:00:00.000Z"
}
```

### `POST /user/:userId/reset`

Resets balance to 1000 CC. History is preserved.

Response:

```json
{
  "userId": "uuid",
  "balance": 1000
}
```

## Bets endpoints

### `POST /bets/create`

Creates a new bet.

Request:

```json
{
  "userId": "uuid",
  "gameType": "hex",
  "stake": 25,
  "guess": "a"
}
```

Response:

```json
{
  "betId": "uuid",
  "status": "pending",
  "targetHeight": 840001,
  "serverSeedHash": "hash",
  "stake": 25,
  "guess": "a"
}
```

### `POST /bets/resolve`

Manually triggers resolution of pending bets. Resolution also runs automatically in the background every 30 seconds.

Response:

```json
{
  "resolved": 1
}
```

### `GET /bets/:userId`

Returns all bets of the user. `server_seed` is hidden for pending bets and revealed only after resolution.

Example response:

```json
{
  "bets": [
    {
      "id": "uuid",
      "userId": "uuid",
      "game_type": "coin",
      "stake": 25,
      "guess": "heads",
      "target_height": 840001,
      "status": "pending",
      "block_hash": null,
      "actual": null,
      "payout": 0,
      "net_result": 0,
      "final_hash": null,
      "server_seed_hash": "hash",
      "server_seed": null,
      "created_at": "2026-04-29T12:00:00.000Z",
      "resolved_at": null
    }
  ]
}
```

## Fairness verification

### `POST /fairness/verify`

Verifies a bet using provided fairness data.

Request:

```json
{
  "betId": "uuid",
  "blockHash": "0000000000000000000000000000000000000000000000000000000000000000",
  "serverSeed": "seed",
  "gameType": "hex",
  "guess": "a"
}
```

Response:

```json
{
  "finalHash": "hash",
  "actual": "a",
  "won": true,
  "multiplier": 16,
  "blockHash": "0000000000000000000000000000000000000000000000000000000000000000",
  "serverSeed": "seed",
  "betId": "uuid",
  "gameType": "hex",
  "guess": "a"
}
```
