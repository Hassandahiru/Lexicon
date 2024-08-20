import { exec } from 'child_process';
import { writeAllDefinitionsToFile } from '../database/scripts/dbFile';

// Path to the script that writes definitions to a file
const scriptPath ='src/database/scripts/dbFile.js' ; // Adjust the path as needed

// Function to execute the script
function runTask() {
  exec(`node ${scriptPath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Script stderr: ${stderr}`);
      return;
    }
    console.log(`Script stdout: ${stdout}`);
  });
}

// Run the task immediately
runTask();

// Schedule the task to run every 5 minutes
setInterval(runTask, 5 * 60 * 1000); // 5 minutes in milliseconds
