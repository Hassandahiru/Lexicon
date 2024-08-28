import { GoogleGenerativeAI } from "@google/generative-ai";
import { googleAPIkey } from "../../../config.js";
import { getAllTerms, deleteLockFileIfExists } from '../../database/scripts/DBfunctions.js';
import { writeFile, readFile } from 'fs/promises'; 
import { access } from 'fs/promises'; 
import fetch, { Headers, Request, Response } from 'node-fetch'; 
import { getAllTermsFromFile } from '../../utils/generalFunctions.js'

// Tell GoogleGenerativeAI to use node-fetch and polyfill web APIs
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;

const genAI = new GoogleGenerativeAI(googleAPIkey);
const lexiconAI = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const filePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/sampleSentences.json';

// Helper function to check if a file exists
async function fileExists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

async function simpleSentenceTerms() {
    deleteLockFileIfExists();
    try {
        // Fetch all terms from the database
        const words = await getAllTermsFromFile();

        // Shuffle the words array
        const shuffledWords = words.sort(() => 0.5 - Math.random());

        // Pick the first 10 items from the shuffled array
        const selectedWords = shuffledWords.slice(0, 10);

        const responses = [];

        // Iterate over each selected word and generate a sentence
        for (const word of selectedWords) {
            const prompt = `Please generate a sentence with the word "${word}"`;

            // Send the prompt to the AI model
            const result = await lexiconAI.generateContent(prompt);
            console.log('Full Result:', JSON.stringify(result, null, 2));

            const firstCandidate = result.response.candidates[0];
            console.log('First Candidate:', JSON.stringify(firstCandidate, null, 2));

            let generatedSentence = '';

            if (firstCandidate) {
                if (firstCandidate.parts && Array.isArray(firstCandidate.parts)) {
                    const sentenceParts = firstCandidate.parts.map(part => {
                        if (typeof part === 'string') {
                            return part;
                        } else if (part.text) {
                            return part.text;
                        } else if (part.content) {
                            return part.content;
                        } else {
                            return '';
                        }
                    }).filter(part => part).join(' ');

                    if (sentenceParts.trim()) {
                        generatedSentence = sentenceParts;
                    } else {
                        console.warn(`No valid text found in parts for word "${word}".`);
                    }
                } else if (firstCandidate.text && typeof firstCandidate.text === 'string') {
                    generatedSentence = firstCandidate.text;
                } else if (firstCandidate.text && typeof firstCandidate.text === 'function') {
                    try {
                        generatedSentence = firstCandidate.text();
                    } catch (e) {
                        console.error('Error calling text function:', e);
                    }
                } else if (firstCandidate.output) {
                    generatedSentence = firstCandidate.output;
                } else if (firstCandidate.content) {
                    generatedSentence = firstCandidate.content;
                } else {
                    console.warn(`Unable to extract sentence for word "${word}".`);
                }
            }

            console.log(`Extracted sentence for "${word}":`, generatedSentence);

            const newEntry = {
                term: word,
                generatedSentence: generatedSentence
            };

            // Check if the new entry already exists in the existing data
            const exists = responses.some(item =>
                item.term === newEntry.term && item.generatedSentence === newEntry.generatedSentence
            );

            if (!exists) {
                responses.push(newEntry);
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }

        // Check if the file already exists
        let existingData = [];
        if (await fileExists(filePath)) {
            const fileContent = await readFile(filePath, 'utf8');
            existingData = JSON.parse(fileContent);
        }

        // Filter out duplicate entries based on 'term' and 'generatedSentence'
        const uniqueResponses = responses.filter(newEntry => {
            return !existingData.some(existingEntry =>
                existingEntry.term === newEntry.term && existingEntry.generatedSentence === newEntry.generatedSentence
            );
        });

        // Append unique responses to the existing data
        const updatedData = [...existingData, ...uniqueResponses];

        // Write the updated data back to the file, creating it if necessary
        await writeFile(filePath, JSON.stringify(updatedData, null, 2), 'utf8');
        console.log(`File successfully written to ${filePath}`);

        return uniqueResponses;

    } catch (error) {
        console.error('Error generating sentences:', error);
        return [];
    }
}

// Set an interval to run the function every 20 minutes
setInterval(simpleSentenceTerms, 20 * 60 * 1000); // 20 minutes in milliseconds

// Initial run
simpleSentenceTerms();

export { simpleSentenceTerms };
