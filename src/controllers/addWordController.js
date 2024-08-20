import { words } from '../../public/js/home.js';
import { Word } from '../models/word.js';

// Function to fetch words from the backend
const getWords = async () => {
  try {
    const response = await fetch('/words');
    if (!response.ok) {
      throw new Error('Failed to fetch words');
    }
    const wordsData = await response.json();
    return wordsData.map(Word.fromJSON); // Convert JSON data to Word instances
  } catch (error) {
    console.error('Error fetching words:', error);
    return [];
  }
};




