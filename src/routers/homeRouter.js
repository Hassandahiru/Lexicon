import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { db }  from '../database/localHost.js';
import { Word } from '../models/word.js';
import { deleteLockFileIfExists } from '../database/scripts/DBfunctions.js'
import { readFile } from 'fs/promises'; 


const homeRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicPath = join(__dirname, '..', '..', 'public', 'views');
console.log(`Serving static files from: ${publicPath}`); // Debugging
homeRouter.use(express.static(publicPath));

homeRouter.get('/', (req, res) => {
    res.sendFile(join(publicPath, 'home.html'));

});
// Main route
homeRouter.get('/words', async (req, res) => {
    // For fetching words. 
  try {
      const result = await db.allDocs({ include_docs: true });
      const words = result.rows.map(row => row.doc);
      res.json(words);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch words' });
    }

})
//for adding words
homeRouter.post('/words', async (req, res) => {
  console.log('Received request body:', req.body); // Debugging line
  const words = req.body; // Expect an array of word objects
  const responses = [];
  try {
    // Check if the request body is an array
    if (!Array.isArray(words)) {
      console.log(words);
      return res.status(400).json({ error: 'Invalid data format' });
    }

    const wordInstances = await Promise.all(
      words.map(async (wordObj) => {
        const term = wordObj.word;
        const bucket = wordObj.bucket;

        const newWord = Word.createWithTerm(term, bucket);
        await newWord.fetchDefinition(); // Fetch definition from the dictionary API

        console.log('API definition:', newWord);
        return newWord;
      })
    );
   // Save each word to the database
    for (const newWord of wordInstances) {
      try {

        const existingWord = await db.find({
          selector: { term: newWord.term }
        });

        if (existingWord.docs.length > 0) {
          console.log(`Term '${newWord.term}' already exists. Skipping.`);
          responses.push({ message: `Term '${newWord.term}' already exists. Skipping.` });
          continue; // Skip to the next word
        }
        const id = String(newWord.getID());
        console.log('id:', id)
        
        if (typeof id !== 'string' || !id) {
          console.error('Invalid ID:', id);
          continue; // Skip this word if the ID is invalid
        }
        
        const response = await db.put({
          ...newWord.toJSON(),
          _id: id
        });
        responses.push(response);
        
      } catch (error) {
        console.error(`Error saving word with ID ${newWord.getID()}:`, error);
        responses.push({ error: `Failed to save word with ID ${newWord.getID()}` });
        
        deleteLockFileIfExists();
      }
    }

    // Respond with the results
    res.json({ responses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process the request' });
  }
});

// for fetching definitions
homeRouter.get('/definitions', async (req, res) => {
  try {
    // Fetch all documents from the database, including their contents
    const result = await db.allDocs({ include_docs: true });
    
    // Map the result to extract documents
    const words = result.rows.map(row => row.doc);

    // Send the array of word documents as a JSON response
    res.json(words);
  } catch (error) {
    // Handle any errors that occur during the fetch
    res.status(500).json({ error: 'Failed to fetch words' });
  }
});

homeRouter.get('/sentences', async (req, res) => {
  const jsonFilePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/sampleSentences.json';
  
  try {
    // Read the content of the JSON file
    const data = await readFile(jsonFilePath, 'utf8');
    const jsonData = JSON.parse(data);

    // Map over the data to extract 'term' and 'text'
    const termsWithText = jsonData.map(item => {
      const textParts = item.generatedSentence?.parts?.map(part => part.text).join(' ').trim() || '';
      
      return {
        term: item.term,
        text: textParts
      };
    });

    // Send the extracted data as the response
    res.json(termsWithText);
  } catch (error) {
    console.error('Error reading the JSON file:', error);
    res.status(500).json({ error: 'Failed to read JSON file' });
  }
});

export { homeRouter };



  

