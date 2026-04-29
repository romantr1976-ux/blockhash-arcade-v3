const crypto = require('crypto');

function generateServerSeed() {
  return crypto.randomBytes(32).toString('hex');
}

function sha256(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function hashServerSeed(seed) {
  return sha256(seed);
}

function computeFinalHash(blockHash, serverSeed, betId) {
  return sha256(`${blockHash}${serverSeed}${betId}`);
}

function validateGuess(gameType, guess) {
  const normalizedGuess = String(guess || '').trim().toLowerCase();

  if (gameType === 'hex') {
    return /^[0-9a-f]$/.test(normalizedGuess);
  }

  if (gameType === 'parity') {
    return normalizedGuess === 'even' || normalizedGuess === 'odd';
  }

  if (gameType === 'coin') {
    return normalizedGuess === 'heads' || normalizedGuess === 'tails';
  }

  return false;
}

function getGameResult(finalHash, gameType, guess) {
  const normalizedGuess = String(guess || '').trim().toLowerCase();

  if (gameType === 'hex') {
    const actual = finalHash[0];
    return {
      actual,
      won: actual === normalizedGuess,
      multiplier: 16
    };
  }

  if (gameType === 'parity') {
    const lastDigit = Number.parseInt(finalHash[finalHash.length - 1], 16);
    const actual = lastDigit % 2 === 0 ? 'even' : 'odd';
    return {
      actual,
      won: actual === normalizedGuess,
      multiplier: 2
    };
  }

  if (gameType === 'coin') {
    const firstByte = Number.parseInt(finalHash.slice(0, 2), 16);
    const actual = (firstByte & 1) === 0 ? 'heads' : 'tails';
    return {
      actual,
      won: actual === normalizedGuess,
      multiplier: 2
    };
  }

  throw new Error('Unsupported game type');
}

module.exports = {
  generateServerSeed,
  sha256,
  hashServerSeed,
  computeFinalHash,
  getGameResult,
  validateGuess
};
