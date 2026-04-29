const API_BASE = window.location.origin + '/api';

const translations = {
  en: {
    code: 'en',
    eyebrow: 'Provably fair educational demo',
    balanceLabel: 'Balance',
    reset: 'Reset',
    user: 'User',
    loading: 'loading',
    network: 'Network',
    checking: 'checking',
    online: 'online',
    error: 'error',
    mode: 'Mode',
    noRealMoney: 'No real money',
    games: 'Games',
    gamesIntro: 'Each bet commits to a hidden server seed and resolves from the next Bitcoin block hash.',
    guideTitle: 'Fair Play Guide',
    guideDemoTitle: 'Demo only',
    guideDemoText: 'No real money, deposits or withdrawals. Credits are local demo points.',
    guidePlayTitle: 'How to play',
    guidePlayText: 'Pick a game, choose a stake, make a guess and wait for the next Bitcoin block.',
    guideFairTitle: 'Fairness',
    guideFairText: 'Every bet commits to a hidden server seed before the future block hash is known.',
    guideVerifyTitle: 'Verify',
    guideVerifyText: 'After resolution, public log data can be checked in the fairness verifier.',
    pendingBets: 'Pending Bets',
    myBets: 'My Bets',
    leaderboard: 'Leaderboard',
    publicLog: 'Public Log',
    fairnessVerifier: 'Fairness Verifier',
    verifierIntro: 'Paste public log data to recompute SHA256(blockHash + serverSeed + betId).',
    betId: 'Bet ID',
    blockHash: 'Block hash',
    serverSeed: 'Server seed',
    game: 'Game',
    guess: 'Guess',
    verify: 'Verify',
    waitingVerification: 'Waiting for verification data.',
    noPending: 'No pending bets.',
    noBets: 'No bets yet.',
    noPlayers: 'No players yet.',
    noPublicBets: 'No resolved public bets yet.',
    pending: 'pending',
    won: 'won',
    lost: 'lost',
    block: 'block',
    seedHash: 'seed hash',
    stake: 'stake',
    payout: 'payout',
    net: 'net',
    targetBlock: 'target block',
    bets: 'bets',
    wins: 'wins',
    losses: 'losses',
    actual: 'actual',
    fairnessData: 'fairness data',
    copyJson: 'Copy JSON',
    copied: 'Copied',
    useInVerifier: 'Use in verifier',
    placeBet: 'Place bet',
    hexTitle: 'HEX Hunter',
    hexDescription: 'Pick the first hexadecimal symbol of the final hash.',
    parityTitle: 'Parity Pulse',
    parityDescription: 'Guess whether the last hex digit is even or odd.',
    coinTitle: 'Quantum Flip',
    coinDescription: 'Guess the least significant bit of the first byte.'
  },
  de: {
    code: 'de',
    eyebrow: 'Nachweisbar faires Bildungsdemo',
    balanceLabel: 'Guthaben',
    reset: 'Zurücksetzen',
    user: 'Nutzer',
    loading: 'lädt',
    network: 'Netzwerk',
    checking: 'prüft',
    online: 'online',
    error: 'Fehler',
    mode: 'Modus',
    noRealMoney: 'Kein Echtgeld',
    games: 'Spiele',
    gamesIntro: 'Jede Wette bindet einen versteckten Server-Seed und wird mit dem nächsten Bitcoin-Blockhash aufgelöst.',
    guideTitle: 'Fair Play Guide',
    guideDemoTitle: 'Nur Demo',
    guideDemoText: 'Kein Echtgeld, keine Einzahlungen und keine Auszahlungen. Credits sind lokale Demo-Punkte.',
    guidePlayTitle: 'So spielst du',
    guidePlayText: 'Wähle ein Spiel, setze einen Einsatz, gib einen Tipp ab und warte auf den nächsten Bitcoin-Block.',
    guideFairTitle: 'Fairness',
    guideFairText: 'Jede Wette bindet einen versteckten Server-Seed, bevor der zukünftige Blockhash bekannt ist.',
    guideVerifyTitle: 'Prüfen',
    guideVerifyText: 'Nach der Auflösung können die öffentlichen Log-Daten im Fairness-Prüfer kontrolliert werden.',
    pendingBets: 'Offene Wetten',
    myBets: 'Meine Wetten',
    leaderboard: 'Bestenliste',
    publicLog: 'Öffentliches Log',
    fairnessVerifier: 'Fairness-Prüfer',
    verifierIntro: 'Füge Log-Daten ein, um SHA256(blockHash + serverSeed + betId) neu zu berechnen.',
    betId: 'Wett-ID',
    blockHash: 'Blockhash',
    serverSeed: 'Server-Seed',
    game: 'Spiel',
    guess: 'Tipp',
    verify: 'Prüfen',
    waitingVerification: 'Warte auf Prüfdaten.',
    noPending: 'Keine offenen Wetten.',
    noBets: 'Noch keine Wetten.',
    noPlayers: 'Noch keine Spieler.',
    noPublicBets: 'Noch keine aufgelösten öffentlichen Wetten.',
    pending: 'offen',
    won: 'gewonnen',
    lost: 'verloren',
    block: 'Block',
    seedHash: 'Seed-Hash',
    stake: 'Einsatz',
    payout: 'Auszahlung',
    net: 'Netto',
    targetBlock: 'Zielblock',
    bets: 'Wetten',
    wins: 'Siege',
    losses: 'Niederlagen',
    actual: 'Ergebnis',
    fairnessData: 'Fairness-Daten',
    copyJson: 'JSON kopieren',
    copied: 'Kopiert',
    useInVerifier: 'Im Prüfer nutzen',
    placeBet: 'Wette setzen',
    hexTitle: 'HEX Hunter',
    hexDescription: 'Wähle das erste Hex-Zeichen des finalen Hashes.',
    parityTitle: 'Parity Pulse',
    parityDescription: 'Tippe, ob die letzte Hex-Ziffer gerade oder ungerade ist.',
    coinTitle: 'Quantum Flip',
    coinDescription: 'Tippe auf das niedrigstwertige Bit des ersten Bytes.'
  },
  uk: {
    code: 'uk',
    eyebrow: 'Навчальне демо з перевірюваною чесністю',
    balanceLabel: 'Баланс',
    reset: 'Скинути',
    user: 'Користувач',
    loading: 'завантаження',
    network: 'Мережа',
    checking: 'перевірка',
    online: 'онлайн',
    error: 'помилка',
    mode: 'Режим',
    noRealMoney: 'Без реальних грошей',
    games: 'Ігри',
    gamesIntro: 'Кожна ставка фіксує прихований server seed і розв’язується за наступним Bitcoin block hash.',
    guideTitle: 'Fair Play Guide',
    guideDemoTitle: 'Лише демо',
    guideDemoText: 'Без реальних грошей, депозитів і виведення. Credits — це локальні демо-бали.',
    guidePlayTitle: 'Як грати',
    guidePlayText: 'Обери гру, ставку, зроби прогноз і дочекайся наступного Bitcoin-блоку.',
    guideFairTitle: 'Чесність',
    guideFairText: 'Кожна ставка фіксує прихований server seed до того, як стане відомий майбутній block hash.',
    guideVerifyTitle: 'Перевірка',
    guideVerifyText: 'Після розв’язання дані з публічного журналу можна перевірити у fairness verifier.',
    pendingBets: 'Очікувані ставки',
    myBets: 'Мої ставки',
    leaderboard: 'Таблиця лідерів',
    publicLog: 'Публічний журнал',
    fairnessVerifier: 'Перевірка чесності',
    verifierIntro: 'Встав дані з публічного журналу, щоб перерахувати SHA256(blockHash + serverSeed + betId).',
    betId: 'ID ставки',
    blockHash: 'Block hash',
    serverSeed: 'Server seed',
    game: 'Гра',
    guess: 'Прогноз',
    verify: 'Перевірити',
    waitingVerification: 'Очікування даних для перевірки.',
    noPending: 'Немає очікуваних ставок.',
    noBets: 'Ставок ще немає.',
    noPlayers: 'Гравців ще немає.',
    noPublicBets: 'Ще немає розв’язаних публічних ставок.',
    pending: 'очікує',
    won: 'виграно',
    lost: 'програно',
    block: 'блок',
    seedHash: 'seed hash',
    stake: 'ставка',
    payout: 'виплата',
    net: 'нетто',
    targetBlock: 'цільовий блок',
    bets: 'ставки',
    wins: 'перемоги',
    losses: 'поразки',
    actual: 'результат',
    fairnessData: 'дані чесності',
    copyJson: 'Копіювати JSON',
    copied: 'Скопійовано',
    useInVerifier: 'Використати в перевірці',
    placeBet: 'Зробити ставку',
    hexTitle: 'HEX Hunter',
    hexDescription: 'Обери перший hex-символ фінального hash.',
    parityTitle: 'Parity Pulse',
    parityDescription: 'Вгадай, чи остання hex-цифра парна або непарна.',
    coinTitle: 'Quantum Flip',
    coinDescription: 'Вгадай наймолодший біт першого байта.'
  },
  ru: {
    code: 'ru',
    eyebrow: 'Учебное демо с проверяемой честностью',
    balanceLabel: 'Баланс',
    reset: 'Сбросить',
    user: 'Пользователь',
    loading: 'загрузка',
    network: 'Сеть',
    checking: 'проверка',
    online: 'онлайн',
    error: 'ошибка',
    mode: 'Режим',
    noRealMoney: 'Без реальных денег',
    games: 'Игры',
    gamesIntro: 'Каждая ставка фиксирует скрытый server seed и рассчитывается по следующему Bitcoin block hash.',
    guideTitle: 'Fair Play Guide',
    guideDemoTitle: 'Только демо',
    guideDemoText: 'Без реальных денег, депозитов и выводов. Credits — локальные демо-баллы.',
    guidePlayTitle: 'Как играть',
    guidePlayText: 'Выбери игру, ставку, сделай прогноз и дождись следующего Bitcoin-блока.',
    guideFairTitle: 'Честность',
    guideFairText: 'Каждая ставка фиксирует скрытый server seed до того, как станет известен будущий block hash.',
    guideVerifyTitle: 'Проверка',
    guideVerifyText: 'После расчёта данные из публичного лога можно проверить в fairness verifier.',
    pendingBets: 'Ожидающие ставки',
    myBets: 'Мои ставки',
    leaderboard: 'Лидерборд',
    publicLog: 'Публичный лог',
    fairnessVerifier: 'Проверка честности',
    verifierIntro: 'Вставь данные из публичного лога, чтобы пересчитать SHA256(blockHash + serverSeed + betId).',
    betId: 'ID ставки',
    blockHash: 'Block hash',
    serverSeed: 'Server seed',
    game: 'Игра',
    guess: 'Прогноз',
    verify: 'Проверить',
    waitingVerification: 'Ожидание данных для проверки.',
    noPending: 'Нет ожидающих ставок.',
    noBets: 'Ставок пока нет.',
    noPlayers: 'Игроков пока нет.',
    noPublicBets: 'Пока нет рассчитанных публичных ставок.',
    pending: 'ожидает',
    won: 'выигрыш',
    lost: 'проигрыш',
    block: 'блок',
    seedHash: 'seed hash',
    stake: 'ставка',
    payout: 'выплата',
    net: 'нетто',
    targetBlock: 'целевой блок',
    bets: 'ставки',
    wins: 'победы',
    losses: 'поражения',
    actual: 'результат',
    fairnessData: 'данные честности',
    copyJson: 'Копировать JSON',
    copied: 'Скопировано',
    useInVerifier: 'Использовать в проверке',
    placeBet: 'Сделать ставку',
    hexTitle: 'HEX Hunter',
    hexDescription: 'Выбери первый hex-символ финального hash.',
    parityTitle: 'Parity Pulse',
    parityDescription: 'Угадай, будет последняя hex-цифра чётной или нечётной.',
    coinTitle: 'Quantum Flip',
    coinDescription: 'Угадай младший бит первого байта.'
  }
};

let currentLang = localStorage.getItem('blockhashLang') || 'en';

function t(key) {
  return (translations[currentLang] && translations[currentLang][key]) || translations.en[key] || key;
}

const games = [
  {
    type: 'hex',
    titleKey: 'hexTitle',
    descriptionKey: 'hexDescription',
    multiplier: 'x16',
    guesses: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f']
  },
  {
    type: 'parity',
    titleKey: 'parityTitle',
    descriptionKey: 'parityDescription',
    multiplier: 'x2',
    guesses: ['even', 'odd']
  },
  {
    type: 'coin',
    titleKey: 'coinTitle',
    descriptionKey: 'coinDescription',
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
  resetDemoBtn: document.getElementById('resetDemoBtn'),
  languageButtons: document.querySelectorAll('[data-lang]')
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
    return t('pending');
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

function applyStaticTranslations() {
  document.documentElement.lang = translations[currentLang].code;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  state.languageButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === currentLang);
  });
}

async function setLanguage(lang) {
  if (!translations[lang]) {
    return;
  }

  currentLang = lang;
  localStorage.setItem('blockhashLang', currentLang);
  applyStaticTranslations();
  renderGames();

  if (userId) {
    await pollRefresh();
  }
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
    setMessage(state.pendingBets, t('noPending'));
    return;
  }

  state.pendingBets.innerHTML = pending.map((bet) => `
    <article class="pending-item">
      <div class="row">
        <strong>${bet.game_type.toUpperCase()} ${bet.stake} CC</strong>
        <span class="pill pending">${t('block')} ${bet.target_height}</span>
      </div>
      <div class="meta">${t('guess')} ${bet.guess} - ${t('seedHash')} ${bet.server_seed_hash}</div>
    </article>
  `).join('');
}

async function loadMyBets() {
  const data = await api(`/bets/${userId}`);

  if (data.bets.length === 0) {
    setMessage(state.myBets, t('noBets'));
    return;
  }

  state.myBets.innerHTML = data.bets.slice(0, 15).map((bet) => `
    <article class="bet-item">
      <div class="row">
        <strong>${bet.game_type.toUpperCase()} - ${bet.guess}</strong>
        <span class="${statusClass(bet.status)}">${t(bet.status)}</span>
      </div>
      <div class="meta">${t('stake')} ${bet.stake} CC - ${t('payout')} ${bet.payout || 0} CC - ${t('net')} ${bet.net_result || -bet.stake}</div>
      <div class="meta">${t('targetBlock')} ${bet.target_height} - ${formatDate(bet.resolved_at)}</div>
    </article>
  `).join('');
}

async function loadLeaderboard() {
  const data = await api('/leaderboard');

  if (data.leaderboard.length === 0) {
    setMessage(state.leaderboard, t('noPlayers'));
    return;
  }

  state.leaderboard.innerHTML = data.leaderboard.map((entry, index) => `
    <article class="leader-item">
      <div class="row">
        <strong>#${index + 1} ${entry.userId}</strong>
        <span class="${entry.profit >= 0 ? 'won' : 'lost'}">${entry.profit} CC</span>
      </div>
      <div class="meta">${t('balanceLabel')} ${entry.balance} - ${t('bets')} ${entry.totalBets} - ${t('wins')} ${entry.wins} - ${t('losses')} ${entry.losses}</div>
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
    setMessage(state.publicLog, t('noPublicBets'));
    return;
  }

  state.publicLog.innerHTML = data.bets.map((bet, index) => `
    <article class="log-item">
      <div class="row">
        <strong>${bet.userId} - ${bet.game_type.toUpperCase()}</strong>
        <span class="${statusClass(bet.status)}">${t(bet.status)} ${bet.net_result} CC</span>
      </div>
      <div class="meta">${t('guess')} ${bet.guess} - ${t('actual')} ${bet.actual} - ${t('block')} ${bet.target_height}</div>
      <details>
        <summary>${t('fairnessData')}</summary>
        <pre class="fairness-data">betId: ${bet.id}
blockHash: ${bet.block_hash}
serverSeed: ${bet.server_seed}
serverSeedHash: ${bet.server_seed_hash}
finalHash: ${bet.final_hash}
gameType: ${bet.game_type}
guess: ${bet.guess}</pre>
        <button class="copy-fairness-btn" type="button" data-log-index="${index}">${t('copyJson')}</button>
        <button class="use-fairness-btn" type="button" data-log-index="${index}">${t('useInVerifier')}</button>
      </details>
    </article>
  `).join('');

  state.publicLog.querySelectorAll('.copy-fairness-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      await copyFairnessData(data.bets[Number(button.dataset.logIndex)]);
      button.textContent = t('copied');
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
        <h3>${t(game.titleKey)}</h3>
        <span class="pill">${game.multiplier}</span>
      </div>
      <p>${t(game.descriptionKey)}</p>
      <form class="game-form" data-game-type="${game.type}">
        <label>
          ${t('stake')}
          <input name="stake" type="number" min="1" max="500" value="25" required>
        </label>
        <label>
          ${t('guess')}
          <select name="guess">
            ${game.guesses.map((guess) => `<option value="${guess}">${guess}</option>`).join('')}
          </select>
        </label>
        <button type="submit">${t('placeBet')}</button>
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
  state.networkStatus.textContent = t('online');
}

async function boot() {
  applyStaticTranslations();
  renderGames();
  state.verifyForm.addEventListener('submit', verifyFairness);
  state.resetDemoBtn.addEventListener('click', resetDemo);
  state.languageButtons.forEach((button) => {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  });
  await initUser();
  await pollRefresh();
  setInterval(pollRefresh, 15000);
}

boot().catch((error) => {
  state.networkStatus.textContent = t('error');
  console.error(error);
});
