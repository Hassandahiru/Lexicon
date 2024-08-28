import { fork } from 'child_process';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import fs from 'fs';


// Path to the child script
const childScriptPath = '/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/services/LexiconGemini/sentenceModel.js';
const logFilePath = path.join('/Users/hassan/Desktop/Projects_DevFiles/ElectronApps/Lexicon/src/utils/logs', 'sentenceGenerator.log');

// Function to start the sentence generator process
export function startSentenceGenerator() {
        const out = fs.openSync(logFilePath, 'a');
        const err = fs.openSync(logFilePath, 'a');
    
        // Spawn a new process
        const childProcess = spawn('node', [childScriptPath], {
            stdio: ['ignore', out, err],
            detached: true // Ensures the child process runs independently of the parent
        });
    
        // Detach and unref the child process so it runs separately
        childProcess.unref();
        
        console.log('Sentence generator process started');
}

startSentenceGenerator();
    
