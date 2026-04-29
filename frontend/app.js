const API_BASE = window.location.origin + '/api';

const games = [
  {
    type: 'hex',
    title: 'HEX Hunter',
    description: 'Pick the first hexadecimal symbol of the final hash.',
    multiplier: 'x16',
    guesses: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  },
  {
    type: 'parity',
    title: 'Parity Pulse',
    description: 'Guess whether the last hex digit is even or odd.',
    multiplier: 'x2',
    guesses: ['even', 'odd']
  },
  {
    type: 'coin',
    title: 'Quantum Flip',
    description: 'Guess the least significant bit of the first byte.',
    multiplier: 'x2',
    guesses: ['heads', 'tails']
  }
];

let userId = localStorage.getItem('blockhashUserId');

const state = {
  balance: document.getElementById('balance'),
  userBadge: document.getElementById('userBadge'),
  networkStatus: document.getElementById('networkStatus'),
  gamesGrid: document.getElementById('gamesGrid'),
  pendingBets: document.getElementById('pendingBets'),
  myBets: document.getElementById('myBets'),
  leaderboard: document.getElementById('leaderboard'),
  publicLog: document.getElementById('publicLog'),
  verifyForm: document.getElementById('verifyForm'),
  verifyResult: document.getElementById('verifyResult'),
  resetDemoBtn: document.getElementById('resetDemoBtn')
};

async function api(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

function formatDate(value) {
  if (!value) {
    return 'pending';
  }
  return new Date(value).toLocaleString();
}

function statusClass(status) {
  if (status === 'won') {
    return 'won';
  }
  if (status === 'lost') {
    return 'lost';
  }
  return 'pending';
}

function setMessage(element, message) {
  element.innerHTML = `<div class="meta">${message}</div>`;
}

async function initUser() {
  if (!userId) {
    const user = await api('/user/create', { method: 'POST' });
    userId = user.userId;
    localStorage.setItem('blockhashUserId', userId);
  }

  state.userBadge.textContent = userId.slice(0, 8);
}

async function updateBalance() {
  const data = await api(`/user/${userId}/balance`);
  state.balance.textContent = `${data.balance} CC`;
}

async function createBet(gameType, stakeInput, guessSelect, button) {
  button.disabled = true;

  try {
    await api('/bets/create', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        gameType,
        stake: Number(stakeInput.value),
        guess: guessSelect.value
      })
    });

    await pollRefresh();
  } catch (error) {
    alert(error.message);
  } finally {
    button.disabled = false;
  }
}

async function loadPendingBets() {
  const data = await api(`/bets/${userId}`);
  const pending = data.bets.filter((bet) => bet.status === 'pending');

  if (pending.length === 0) {
    setMessage(state.pendingBets, 'No pending bets.');
    return;
  }

  state.pendingBets.innerHTML = pending.map((bet) => `
    <article class="pending-item">
      <div class="row">
        <strong>${bet.game_type.toUpperCase()} ${bet.stake} CC</strong>
        <span class="pill pending">block ${bet.target_height}</span>
      </div>
      <div class="meta">guess ${bet.guess} - seed hash ${bet.server_seed_hash}</div>
    </article>
  `).join('');
}

async function loadMyBets() {
  const data = await api(`/bets/${userId}`);

  if (data.bets.length === 0) {
    setMessage(state.myBets, 'No bets yet.');
    return;
  }

  state.myBets.innerHTML = data.bets.slice(0, 15).map((bet) => `
    <article class="bet-item">
      <div class="row">
        <strong>${bet.game_type.toUpperCase()} - ${bet.guess}</strong>
        <span class="${statusClass(bet.status)}">${bet.status}</span>
      </div>
      <div class="meta">stake ${bet.stake} CC - payout ${bet.payout || 0} CC - net ${bet.net_result || -bet.stake}</div>
      <div class="meta">target block ${bet.target_height} - ${formatDate(bet.resolved_at)}</div>
    </article>
  `).join('');
}

async function loadLeaderboard() {
  const data = await api('/leaderboard');

  if (data.leaderboard.length === 0) {
    setMessage(state.leaderboard, 'No players yet.');
    return;
  }

  state.leaderboard.innerHTML = data.leaderboard.map((entry, index) => `
    <article class="leader-item">
      <div class="row">
        <strong>#${index + 1} ${entry.userId}</strong>
        <span class="${entry.profit >= 0 ? 'won' : 'lost'}">${entry.profit} CC</span>
      </div>
      <div class="meta">balance ${entry.balance} - bets ${entry.totalBets} - wins ${entry.wins} - losses ${entry.losses}</div>
    </article>
  `).join('');
}

function fairnessJson(bet) {
  return {
    betId: bet.id,
    blockHash: bet.block_hash,
    serverSeed: bet.server_seed,
    gameType: bet.game_type,
    guess: bet.guess
  };
}

async function copyFairnessData(bet) {
  const text = JSON.stringify(fairnessJson(bet), null, 2);
  await navigator.clipboard.writeText(text);
}

function fillVerifier(bet) {
  document.getElementById('verifyBetId').value = bet.id;
  document.getElementById('verifyBlockHash').value = bet.block_hash;
  document.getElementById('verifyServerSeed').value = bet.server_seed;
  document.getElementById('verifyGameType').value = bet.game_type;
  document.getElementById('verifyGuess').value = bet.guess;
}

async function loadPublicLog() {
  const data = await api('/public-log');

  if (data.bets.length === 0) {
    setMessage(state.publicLog, 'No resolved public bets yet.');
    return;
  }

  state.publicLog.innerHTML = data.bets.map((bet, index) => `
    <article class="log-item">
      <div class="row">
        <strong>${bet.userId} - ${bet.game_type.toUpperCase()}</strong>
        <span class="${statusClass(bet.status)}">${bet.status} ${bet.net_result} CC</span>
      </div>
      <div class="meta">guess ${bet.guess} - actual ${bet.actual} - block ${bet.target_height}</div>
      <details>
        <summary>fairness data</summary>
        <pre class="fairness-data">betId: ${bet.id}
blockHash: ${bet.block_hash}
serverSeed: ${bet.server_seed}
serverSeedHash: ${bet.server_seed_hash}
finalHash: ${bet.final_hash}
gameType: ${bet.game_type}
guess: ${bet.guess}</pre>
        <button class="copy-fairness-btn" type="button" data-log-index="${index}">Copy JSON</button>
        <button class="use-fairness-btn" type="button" data-log-index="${index}">Use in verifier</button>
      </details>
    </article>
  `).join('');

  state.publicLog.querySelectorAll('.copy-fairness-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await copyFairnessData(data.bets[Number(button.dataset.logIndex)]);
      button.textContent = 'Copied';
    });
  });

  state.publicLog.querySelectorAll('.use-fairness-btn').forEach((button) => {
    button.addEventListener('click', () => fillVerifier(data.bets[Number(button.dataset.logIndex)]));
  });
}

async function verifyFairness(event) {
  event.preventDefault();
  const formData = new FormData(state.verifyForm);

  try {
    const result = await api('/fairness/verify', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(formData.entries()))
    });

    state.verifyResult.textContent = JSON.stringify(result, null, 2);
  } catch (error) {
    state.verifyResult.textContent = error.message;
  }
}

async function resetDemo() {
  if (!userId) {
    return;
  }

  await api(`/user/${userId}/reset`, { method: 'POST' });
  await pollRefresh();
}

function renderGames() {
  state.gamesGrid.innerHTML = games.map((game) => `
    <article class="game-card">
      <div class="row">
        <h3>${game.title}</h3>
        <span class="pill">${game.multiplier}</span>
      </div>
      <p>${game.description}</p>
      <form class="game-form" data-game-type="${game.type}">
        <label>
          Stake
          <input name="stake" type="number" min="1" max="500" value="25" required>
        </label>
        <label>
          Guess
          <select name="guess">
            ${game.guesses.map((guess) => `<option value="${guess}">${guess}</option>`).join('')}
          </select>
        </label>
        <button type="submit">Place bet</button>
      </form>
    </article>
  `).join('');

  state.gamesGrid.querySelectorAll('.game-form').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      createBet(
        form.dataset.gameType,
        form.elements.stake,
        form.elements.guess,
        form.querySelector('button')
      );
    });
  });
}

async function pollRefresh() {
  await updateBalance();
  await loadPendingBets();
  await loadMyBets();
  await loadLeaderboard();
  await loadPublicLog();
  state.networkStatus.textContent = 'online';
}

async function boot() {
  renderGames();
  state.verifyForm.addEventListener('submit', verifyFairness);
  state.resetDemoBtn.addEventListener('click', resetDemo);
  await initUser();
  await pollRefresh();
  setInterval(pollRefresh, 15000);
}

boot().catch((error) => {
  state.networkStatus.textContent = 'error';
  console.error(error);
});
