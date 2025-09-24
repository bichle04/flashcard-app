class StorageService {
  constructor(key = 'flashcards') {
    this.key = key;
  }

  getCards() {
    try {
      const savedCards = localStorage.getItem(this.key);
      return savedCards ? JSON.parse(savedCards) : [];
    } catch (error) {
      console.error('Error loading cards from localStorage:', error);
      return [];
    }
  }

  saveCards(cards) {
    try {
      localStorage.setItem(this.key, JSON.stringify(cards));
      return true;
    } catch (error) {
      console.error('Error saving cards to localStorage:', error);
      return false;
    }
  }

  clearCards() {
    try {
      localStorage.removeItem(this.key);
      return true;
    } catch (error) {
      console.error('Error clearing cards from localStorage:', error);
      return false;
    }
  }

  isStorageAvailable() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }
}

const storageService = new StorageService();
export default storageService;