import { extractTermsAndSentences } from "../utils/generalFunctions.js";

const inputFilePath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/files/sampleSentences.json';
const outputFileName = 'extractedSentences.json';
extractTermsAndSentences(inputFilePath, outputFileName);
