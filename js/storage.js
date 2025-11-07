// Модуль для роботи з localStorage
import { GAME_CONFIG } from './constants.js';

class Storage {
  // Отримання рекорду
  getRecord() {
    const record = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
    return record ? parseInt(record) : null;
  }

  // Збереження рекорду
  saveRecord(attempts) {
    const currentRecord = this.getRecord();
    
    if (currentRecord === null || attempts < currentRecord) {
      localStorage.setItem(GAME_CONFIG.STORAGE_KEY, attempts.toString());
      return true; // Новий рекорд
    }
    
    return false;
  }

  // Очищення рекорду
  clearRecord() {
    localStorage.removeItem(GAME_CONFIG.STORAGE_KEY);
  }
}

export default Storage;