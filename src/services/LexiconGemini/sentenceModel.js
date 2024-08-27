import { GoogleGenerativeAI } from "@google/generative-ai";
import { googleAPIkey } from "../../../config.js";
import { getAllTerms } from '../../database/scripts/DBfunctions.js';
import { writeArrayToFile } from "../../utils/generalFunctions.js.js";
import fetch, { Headers, Request, Response } from 'node-fetch'; // Import required polyfills

// Tell GoogleGenerativeAI to use node-fetch and polyfill web APIs
globalThis.fetch = fetch;
globalThis.Headers = Headers;
globalThis.Request = Request;
globalThis.Response = Response;

const genAI = new GoogleGenerativeAI(googleAPIkey);
const lexiconAI = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function simpleSentenceTerms() {
    try {
        // Fetch all terms from the database
        const words = await getAllTerms();
        const responses = [];
        // Iterate over each word and generate a sentence
        for (const word of words) {
            const prompt = `Please generate a sentence with the word "${word}"`;
            
            // Send the prompt to the AI model
            const result = await lexiconAI.generateContent(prompt);
            console.log('Full Result:', JSON.stringify(result, null, 2)); // Highlighted Log

            const firstCandidate = result.response.candidates[0];
            console.log('First Candidate:', JSON.stringify(firstCandidate, null, 2)); // Highlighted Log

            // Access the generated sentence
            let generatedSentence = '';
        
            if (firstCandidate) {
                // Check if 'parts' exists and is an array
                if (firstCandidate.parts && Array.isArray(firstCandidate.parts)) {
                    console.log(`Parts for word "${word}":`, JSON.stringify(firstCandidate.parts, null, 2)); // Highlighted Log

                    // Attempt to extract 'text' from each part
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
                        console.warn(`No valid text found in parts for word "${word}".`); // Highlighted Log
                    }
                }
                // Alternatively, if 'text' is a string
                else if (firstCandidate.text && typeof firstCandidate.text === 'string') {
                    generatedSentence = firstCandidate.text;
                }
                // Alternatively, if 'text' is a function, call it
                else if (firstCandidate.text && typeof firstCandidate.text === 'function') {
                    try {
                        generatedSentence = firstCandidate.text();
                    } catch (e) {
                        console.error('Error calling text function:', e); // Highlighted Log
                    }
                }
                // Check other possible properties
                else if (firstCandidate.output) {
                    generatedSentence = firstCandidate.output;
                }
                else if (firstCandidate.content) {
                    generatedSentence = firstCandidate.content;
                }
                else {
                    console.warn(`Unable to extract sentence for word "${word}".`); // Highlighted Log
                }
            }

            // Log the extracted sentence
            console.log(`Extracted sentence for "${word}":`, generatedSentence); // Highlighted Log
           
            // Store the term and generated sentence in the responses array
            responses.push({
                term: word,
                generatedSentence: generatedSentence // Assuming the content is where the generated sentence is stored
            });

            // Stop after 10 items
            if (responses.length >= 10) {
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
        // Return the responses as a JSON array
        console.log('responses:', responses); // Highlighted Log

        return responses;
        
    } catch (error) {
        console.error('Error generating sentences:', error); // Highlighted Log
        return [];
    }
}

const sampleSentences = await simpleSentenceTerms();
writeArrayToFile(sampleSentences, 'sampleSentences');
//simpleSentenceTerms();
export { simpleSentenceTerms };
