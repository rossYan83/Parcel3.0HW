
import { GAME_CONFIG, MESSAGES, DISTANCE } from './constants.js';

class Game {
  constructor() {
    this.secretNumber = this.generateRandomNumber();
    this.attempts = 0;
    this.guesses = [];
    this.isGameOver = false;
  }


  generateRandomNumber() {
    const min = GAME_CONFIG.MIN_NUMBER;
    const max = GAME_CONFIG.MAX_NUMBER;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Перевірка припущення
  checkGuess(guess) {
    if (this.isGameOver) {
      return { valid: false, message: 'Гра завершена. Почніть нову!' };
    }

    const number = parseInt(guess);

    // Валідація введення
    if (isNaN(number) || number < GAME_CONFIG.MIN_NUMBER || number > GAME_CONFIG.MAX_NUMBER) {
      return { valid: false, message: MESSAGES.INVALID };
    }

    // Перевірка на повторне припущення
    if (this.guesses.includes(number)) {
      return { valid: false, message: 'Ви вже пробували це число!' };
    }

    this.attempts++;
    this.guesses.push(number);

    // Перевірка результату
    if (number === this.secretNumber) {
      this.isGameOver = true;
      return {
        valid: true,
        correct: true,
        message: `${MESSAGES.WIN} за ${this.attempts} ${this.getAttemptsWord()}!`,
        attempts: this.attempts
      };
    }

    // Визначення підказки
    const difference = Math.abs(number - this.secretNumber);
    let message = number > this.secretNumber ? MESSAGES.TOO_HIGH : MESSAGES.TOO_LOW;
    let hint = '';

    if (difference <= DISTANCE.VERY_CLOSE) {
      hint = MESSAGES.VERY_CLOSE;
    } else if (difference <= DISTANCE.CLOSE) {
      hint = MESSAGES.CLOSE;
    } else {
      hint = MESSAGES.FAR;
    }

    return {
      valid: true,
      correct: false,
      message: `${message}\n${hint}`,
      tooHigh: number > this.secretNumber,
      difference: difference,
      attempts: this.attempts
    };
  }

  // Отримання слова "спроба/спроби/спроб"
  getAttemptsWord() {
    const lastDigit = this.attempts % 10;
    const lastTwoDigits = this.attempts % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
      return 'спроб';
    }
    if (lastDigit === 1) {
      return 'спробу';
    }
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'спроби';
    }
    return 'спроб';
  }

  // Отримання поточної кількості спроб
  getAttempts() {
    return this.attempts;
  }

  // Отримання історії припущень
  getGuesses() {
    return this.guesses;
  }

  // Перезапуск гри
  restart() {
    this.secretNumber = this.generateRandomNumber();
    this.attempts = 0;
    this.guesses = [];
    this.isGameOver = false;
  }

  // Чи гра завершена
  isFinished() {
    return this.isGameOver;
  }
}

export default Game;