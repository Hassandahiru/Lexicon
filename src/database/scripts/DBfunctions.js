import  {  db  } from '../localHost.js';
import path from 'path';
import fs from 'fs';

const lockFilePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/database/pouchDB/lexiconDB/LOCK';

const fetchAllDocuments = async () => {
  try {
    const allDocs = await db.allDocs({ include_docs: true });
    console.log('All documents in the database:');
    allDocs.rows.forEach(doc => {
      console.log(doc.doc);
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
  }
};

async function deleteAllDocuments() {
  try {
    // Fetch all documents from the database
    const allDocs = await db.allDocs({ include_docs: true });
    // Map through all documents and set the _deleted attribute to true
    const docsToDelete = allDocs.rows.map(row => ({
      _id: row.id,
      _rev: row.doc._rev, // Required to delete the document
      _deleted: true
    }));
    
    // Use bulkDocs to delete all documents
    const result = await db.bulkDocs(docsToDelete);
    
    console.log('All documents deleted successfully:', result);
  } catch (error) {
    console.error('Error deleting documents:', error);
  }
}

function deleteLockFileIfExists() {
  if (fs.existsSync(lockFilePath)) {
    try {
      fs.unlinkSync(lockFilePath);
      console.log(`File ${lockFilePath} has been deleted.`);
    } catch (error) {
      console.error(`Error deleting file ${lockFilePath}:`, error);
    }
  } else {
    console.log(`File ${lockFilePath} does not exist.`);
  }
}

async function getAllTerms() {
  try {
      // Fetch all documents from the database
      const result = await db.allDocs({ include_docs: true });

      // Map the 'term' attributes to an array
      const terms = result.rows.map(row => row.doc.term);

      return terms;
  } catch (error) {
      console.error('Error fetching terms:', error);
      return [];
  }
}

// Example usage

/* getAllTerms().then(terms => {
  console.log('All terms:', terms);
}).catch(error => {
  console.error('Error:', error);
}); */


// Call the function to delete all documents
//deleteAllDocuments();
// Function to fetch and display all documents
//fetchAllDocuments();
// Call the function to delete the lock file if it exists
//deleteLockFileIfExists();


// Fetch and display the documents
export { fetchAllDocuments, deleteAllDocuments, deleteLockFileIfExists, getAllTerms }; 


