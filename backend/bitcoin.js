const BLOCK_HASH_RE = /^[0-9a-fA-F]{64}$/;
const TIMEOUT_MS = 5000;

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      headers: { accept: 'application/json,text/plain' },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

async function tryProviders(providers) {
  const errors = [];

  for (const provider of providers) {
    try {
      return await provider();
    } catch (error) {
      errors.push(error.message);
    }
  }

  throw new Error(`Bitcoin API providers failed: ${errors.join('; ')}`);
}

async function getCurrentHeight() {
  return tryProviders([
    async () => {
      const text = await fetchText('https://mempool.space/api/blocks/tip/height');
      const height = Number.parseInt(text.trim(), 10);
      if (!Number.isInteger(height) || height <= 0) {
        throw new Error('Invalid mempool.space height');
      }
      return height;
    },
    async () => {
      const text = await fetchText('https://api.blockcypher.com/v1/btc/main');
      const data = JSON.parse(text);
      if (!Number.isInteger(data.height) || data.height <= 0) {
        throw new Error('Invalid BlockCypher height');
      }
      return data.height;
    }
  ]);
}

async function getBlockHash(height) {
  if (!Number.isInteger(height) || height <= 0) {
    throw new Error('Invalid block height');
  }

  const hash = await tryProviders([
    async () => {
      const text = await fetchText(`https://mempool.space/api/block-height/${height}`);
      const value = text.trim();
      if (!BLOCK_HASH_RE.test(value)) {
        throw new Error('Invalid mempool.space block hash');
      }
      return value.toLowerCase();
    },
    async () => {
      const text = await fetchText(`https://api.blockcypher.com/v1/btc/main/blocks/${height}`);
      const data = JSON.parse(text);
      if (!BLOCK_HASH_RE.test(data.hash || '')) {
        throw new Error('Invalid BlockCypher block hash');
      }
      return data.hash.toLowerCase();
    }
  ]);

  return hash;
}

module.exports = {
  BLOCK_HASH_RE,
  getCurrentHeight,
  getBlockHash
};
