# BlockHash Arcade v3.0 Fairness

BlockHash Arcade v3.0 is an educational demo of a provably fair pattern. It does not use real money.

## Seed Commitment

When a bet is created, the server generates a random `server_seed`.

The server stores and returns:

```text
server_seed_hash = SHA256(server_seed)
```

The raw `server_seed` remains hidden while the bet is pending. This prevents the player from knowing the final outcome early, while the commitment prevents the server from changing the seed later without detection.

## Future Bitcoin Block

Each bet targets the next Bitcoin block height:

```text
target_height = current_height + 1
```

The future block hash is unknown when the bet is created. After the target block is mined, the backend fetches the block hash from mempool.space, with BlockCypher as a fallback.

## Final Hash Formula

The result is derived from:

```text
finalHash = SHA256(blockHash + serverSeed + betId)
```

Where:

- `blockHash` is the Bitcoin block hash at `target_height`.
- `serverSeed` is the revealed seed committed before the bet.
- `betId` is the unique bet identifier.

## Game Rules

### HEX Hunter

Uses the first hex character of `finalHash`.

- Valid guesses: `0` through `9`, `a` through `f`
- Multiplier: `x16`

### Parity Pulse

Uses the parity of the last hex digit of `finalHash`.

- Valid guesses: `even`, `odd`
- Multiplier: `x2`

### Quantum Flip

Uses the least significant bit of the first byte of `finalHash`.

- Valid guesses: `heads`, `tails`
- Multiplier: `x2`

## Verification Steps

1. Open the public log after a bet resolves.
2. Copy the fairness JSON containing `betId`, `blockHash`, `serverSeed`, `gameType`, and `guess`.
3. Paste it into the verifier.
4. The verifier recomputes `finalHash`.
5. The verifier derives the game result from `finalHash` and compares it to the public log.
6. Optionally verify `SHA256(serverSeed)` equals `server_seed_hash`.

## Why This Is Fair

The server commits to the seed before the Bitcoin block hash exists. The future Bitcoin block hash is external data that neither the demo app nor the player can practically control. Once the block is mined, the revealed seed and public block hash are enough to independently reproduce the outcome.

## Limitations

- This is an educational portfolio demo, not a production gambling system.
- Bitcoin block times are variable, so pending bets can take longer than expected.
- External API providers can be unavailable or rate-limited.
- Local SQLite storage is suitable for a demo, not high-traffic production.
- Free deployment storage may be ephemeral and can reset demo data.
