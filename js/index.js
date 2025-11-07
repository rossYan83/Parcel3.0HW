import Game from './game.js';
import Storage from './storage.js';
import { MESSAGES } from './constants.js';

// Ініціалізація
const game = new Game();
const storage = new Storage();

// Отримання елементів DOM
const guessInput = document.getElementById('guessInput');
const checkBtn = document.getElementById('checkBtn');
const restartBtn = document.getElementById('restartBtn');
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const recordEl = document.getElementById('record');
const historyEl = document.getElementById('history');

// Оновлення UI
function updateUI() {
  attemptsEl.textContent = game.getAttempts();
  
  const record = storage.getRecord();
  recordEl.textContent = record !== null ? record : '-';
}

// Відображення історії
function updateHistory() {
  const guesses = game.getGuesses();
  
  if (guesses.length === 0) {
    historyEl.innerHTML = '';
    return;
  }

  const historyHTML = `
    <div class="history-title">Ваші спроби:</div>
    <div class="history-list">
      ${guesses.map(guess => {
        const result = game.checkGuess(guess);
        const className = result.tooHigh ? 'too-high' : 'too-low';
        return `<span class="history-item ${className}">${guess}</span>`;
      }).join('')}
    </div>
  `;
  
  historyEl.innerHTML = historyHTML;
}

// Показати повідомлення
function showMessage(message, type = 'info') {
  messageEl.textContent = message;
  messageEl.className = 'message';
  
  if (type === 'success') {
    messageEl.classList.add('success');
  } else if (type === 'hot') {
    messageEl.classList.add('hot');
  } else if (type === 'warm') {
    messageEl.classList.add('warm');
  } else if (type === 'cold') {
    messageEl.classList.add('cold');
  }
}

// Обробка перевірки
function handleCheck() {
  const guess = guessInput.value.trim();
  const result = game.checkGuess(guess);

  if (!result.valid) {
    showMessage(result.message);
    return;
  }

  if (result.correct) {
    showMessage(result.message, 'success');
    checkBtn.disabled = true;
    guessInput.disabled = true;
    
    // Перевірка та збереження рекорду
    const isNewRecord = storage.saveRecord(result.attempts);
    if (isNewRecord) {
      setTimeout(() => {
        showMessage(`${result.message}\n🏆 Новий рекорд!`, 'success');
      }, 500);
    }
  } else {
    // Визначення типу підказки
    let messageType = 'info';
    if (result.difference <= 5) {
      messageType = 'hot';
    } else if (result.difference <= 15) {
      messageType = 'warm';
    } else {
      messageType = 'cold';
    }
    
    showMessage(result.message, messageType);
  }

  updateUI();
  updateHistory();
  guessInput.value = '';
  guessInput.focus();
}

// Обробка перезапуску
function handleRestart() {
  game.restart();
  guessInput.disabled = false;
  checkBtn.disabled = false;
  guessInput.value = '';
  showMessage(MESSAGES.START);
  updateUI();
  historyEl.innerHTML = '';
  guessInput.focus();
}

// Обробники подій
checkBtn.addEventListener('click', handleCheck);
restartBtn.addEventListener('click', handleRestart);

guessInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleCheck();
  }
});

// Дозволити тільки числа в інпуті
guessInput.addEventListener('input', (e) => {
  e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

// Ініціалізація
updateUI();
guessInput.focus();

// Експорт для можливого використання
export { game, storage };