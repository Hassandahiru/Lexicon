import fs from 'fs';
import path from 'path';


// Writing array files to JSON in 'files' directory.
async function writeArrayToFile(array, fileName) {
    const outputFilePath = `/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/${fileName}.json`;

    try {
    // Check if the file exists
        if (!fs.existsSync(outputFilePath)) {
      // Create an empty file if it doesn't exist
      fs.writeFileSync(outputFilePath, '', 'utf8');
      console.log(`File ${outputFilePath} created.`);
        }
    // Convert documents to JSON string
    const jsonContent = JSON.stringify(array, null, 2); // Pretty print with 2-space indentation
    // Write the JSON string to the specified file
    fs.writeFileSync(outputFilePath, jsonContent, 'utf8');

    console.log(`Array has been written to ${outputFilePath}`);
  } catch (error) {
    console.error('Error writing definitions to file:', error);

  }
}

export { writeArrayToFile };
