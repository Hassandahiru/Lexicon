import fetch from 'node-fetch';
import {v4 as uuidv4} from 'uuid';

class Word {
    constructor(id, term, definitions = [], categories = [], origin, bucket = []) {
      this.id = id;
      this.term = term;
      this.definitions = definitions;
      this.categories = categories;
      this.origin = origin;
      this.bucket = bucket;
      this.dateAdded = new Date().toISOString();
    }

    static createWithTerm(term, bucket) {
      const id = uuidv4();
      return new Word(id, term, [], [], '', bucket);
    }

    getID() {
      return this.id;
    }
  
    addDefinition(definition) {
      this.definitions.push(definition);
    }
  
    removeDefinition(definitionIndex) {
      if (definitionIndex >= 0 && definitionIndex < this.definitions.length) {
        this.definitions.splice(definitionIndex, 1);
      }
    }
  
    addCategory(category) {
      if (!this.categories.includes(category)) {
        this.categories.push(category);
      }
    }

    addBucket(bucket) {
      if (!this.bucket.includes(bucket)) {
        this.bucket.push(bucket);
      }
    }
  
    removeCategory(category) {
      const index = this.categories.indexOf(category);
      if (index !== -1) {
        this.categories.splice(index, 1);
      }
    }
  
    toJSON() {
    return {
        id: this.id,
        term: this.term,
        definitions: this.definitions,
        categories: this.categories,
        bucket: this.bucket,
        dateAdded: this.dateAdded
      };
    }

  
  
    static fromJSON(json) {
      const { id, term, definitions, categories, bucket ,dateAdded } = json;
      const wordInstance = new Word(id, term, definitions, categories, bucket);
      wordInstance.dateAdded = new Date(dateAdded);
      return wordInstance;
    }
    
    async fetchDefinition() {
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.term}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.length > 0) {
          // Assuming we take the first definition from the first meaning
          const { origin, phonetic, phonetics, meanings } = data[0];
          this.origin = origin || this.origin;
          this.phonetic = phonetic || this.phonetic;
          this.phonetics = phonetics || this.phonetics;
          meanings.forEach(meaning => {
            const partOfSpeech = meaning.partOfSpeech;
            meaning.definitions.forEach(def => {
              this.addDefinition({ partOfSpeech, definition: def.definition});
            })
          })
        }
      } catch (error) {
        console.error('Error fetching definition:', error);
      }
    }
  
  }

//const word1 = Word.createWithTerm('infamy');

/* word1.fetchDefinition().then(() => {
    console.log(word1.toJSON());  // Output after fetching definitions
  }); */


  
export {  Word };
  // Example usage:
  /*const word = new Word('word_1', 'example', ['an instance serving to illustrate'], ['noun']);
  console.log(word.toJSON());  // Output the word as JSON
  word.addDefinition('a typical or distinctive example');
  console.log(word.toJSON());  // Output after adding another definition
  word.removeDefinition(0);  // Remove the first definition
  console.log(word.toJSON());  // Output after removing a definition
  */