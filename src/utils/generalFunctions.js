import fs from 'fs';
import path from 'path';
import { readFile } from 'fs/promises'; 


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



function extractTermsAndSentences(inputFilePath, outputFileName) {
    try {
        // Read the file content
        const data = fs.readFileSync(inputFilePath, 'utf-8');
        
        // Parse the JSON data
        const jsonArray = JSON.parse(data);
        
        // Extract the term and the first 'text' part from 'generatedSentence'
        const results = jsonArray.map(item => {
            const term = item.term;
            let sentenceText = '';

            if (item.generatedSentence && item.generatedSentence.parts && item.generatedSentence.parts.length > 0) {
                sentenceText = item.generatedSentence.parts[0].text.trim();
            }

            return {
                term,
                text: sentenceText
            };
        });

        // Define the output file path
        const outputFilePath = path.join(path.dirname(inputFilePath), outputFileName);

        // Write the results to the output JSON file
        fs.writeFileSync(outputFilePath, JSON.stringify(results, null, 2), 'utf-8');

        // Print the extracted data to the console
        console.log('Extracted Data:', results);
        console.log(`Data has been written to ${outputFilePath}`);
        
        return results;
    } catch (error) {
        console.error('Error reading, parsing, or writing file:', error);
        return [];

    }
}


async function getAllTermsFromFile() {
    const filePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/allDefinitions.json';
    
    try {
        // Read the content of the JSON file
        const fileContent = await readFile(filePath, 'utf8');
        
        // Parse the JSON content
        const data = JSON.parse(fileContent);
        
        // Extract and return all 'term' values
        const terms = data.map(entry => entry.term);
        
        return terms;
    } catch (error) {
        console.error('Error reading or parsing the file:', error);
        return [];
    }
}

// Example usage
/*getAllTermsFromFile().then(terms => {
    console.log('Terms:', terms);
}); */


// Usage example



export { writeArrayToFile, extractTermsAndSentences, getAllTermsFromFile };
