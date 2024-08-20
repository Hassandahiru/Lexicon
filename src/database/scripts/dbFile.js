import fs from 'fs';
import path from 'path';
import { db } from '../../database/localHost.js'; // Assuming this is the correct path to your PouchDB instance
import { deleteLockFileIfExists } from '../scripts/DBfunctions.js';
import { exec } from 'child_process';

const outputFilePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/allDefinitions.json';

async function writeAllDefinitionsToFile() {
  try {
    // Check if the file exists
    if (!fs.existsSync(outputFilePath)) {
      // Create an empty file if it doesn't exist
      fs.writeFileSync(outputFilePath, '', 'utf8');
      console.log(`File ${outputFilePath} created.`);
    }

    // Fetch all documents from the database
    const result = await db.allDocs({ include_docs: true });

    // Extract documents
    const documents = result.rows.map(row => row.doc);

    // Convert documents to JSON string
    const jsonContent = JSON.stringify(documents, null, 2); // Pretty print with 2-space indentation

    // Write the JSON string to the specified file
    fs.writeFileSync(outputFilePath, jsonContent, 'utf8');

    console.log(`All definitions have been written to ${outputFilePath}`);
  } catch (error) {
    console.error('Error writing definitions to file:', error);

    deleteLockFileIfExists();
  }
}

// Call the function to write all definitions to the file
writeAllDefinitionsToFile();

export { writeAllDefinitionsToFile };
