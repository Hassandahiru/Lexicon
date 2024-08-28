document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
  
  // Menu Tabular
  const menuTabs = document.querySelectorAll('.menu__tabs li a');
  menuTabs.forEach(tab => {
      tab.addEventListener('click', function(e) {
          e.preventDefault();
          menuTabs.forEach(t => t.classList.remove('active'));
          this.classList.add('active');
          const items = document.querySelectorAll('.menu__item');
          items.forEach(item => item.classList.remove('item-active'));
          document.querySelector(this.hash).classList.add('item-active');
      });
  });
});

const addWordBtn = document.getElementById('add-word-btn');
const wordInput = document.getElementById('word-input');
const wordsUl = document.getElementById('words-ul');
const bucketSelect = document.getElementById('bucket-select');

if (!addWordBtn || !wordInput || !wordsUl || !bucketSelect) {
        console.error('Required HTML elements not found');
      }
      const words = [];
      const renderWords = () => {
        wordsUl.innerHTML = ''; // Clear existing words
        words.forEach((word, index) => {
          const li = document.createElement('li');
          li.textContent = `${word.word} (Bucket: ${word.bucket})`;
          wordsUl.appendChild(li);
        });
      };
  
addWordBtn.addEventListener('click', () => {
        const newWord = wordInput.value.trim();
        const selectedBucket = bucketSelect.value; // Get selected bucket from dropdown
        if (newWord !== '') {
          if (!words.some(word => word.word === newWord && word.bucket === selectedBucket)) {
            words.push({ word: newWord, bucket: selectedBucket }); // Add word with bucket to the words array
            renderWords(); // Render the updated word list
            wordInput.value = ''; // Clear the input field
          }else {
            console.log('Word with the same bucket already added');        }
      } else {
        console.log('No word entered');
      }
      });

const addWords = async (words) => {
try {
      const response = await fetch('http://localhost:4020/home/words', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
      },
            body: JSON.stringify(words), // Send the words array as JSON
          });
      
          if (!response.ok) {
            throw new Error('Failed to add words');
          }
      
          const savedWordsData = await response.json();
          console.log('Words saved successfully:', savedWordsData);
          
        } catch (error) {
          console.error('Error adding words:', error);
        }
      };

      const fetchAndDisplayDefinitions = async () => {
        try {
          const response = await fetch('http://localhost:4020/home/definitions');
          const words = await response.json();
    
          const tableBody = document.querySelector('#definitions-tbody');
          tableBody.innerHTML = ''; // Clear the table before adding new rows
    
          words.forEach(word => {
            const row = document.createElement('tr');
            const termCell = document.createElement('td');
            const definitionCell = document.createElement('td');
    
            termCell.textContent = word.term;
    
            // Concatenate the first two definitions
            const firstTwoDefinitions = word.definitions.slice(0, 2)
              .map(def => `${def.partOfSpeech}: ${def.definition}`).join(' | ');
    
            definitionCell.textContent = firstTwoDefinitions;
    
            row.appendChild(termCell);
            row.appendChild(definitionCell);
            tableBody.appendChild(row);
          });
        } catch (error) {
          console.error('Error fetching words:', error);
        }
      };

      const fetchAndDisplaySentences = async () => {
        try {
            // Fetch sample sentences from the API
            const response = await fetch('http://localhost:4020/home/sentences');
            const sentences = await response.json();
    
            // Get the table body element
            const tableBody = document.querySelector('#sentences-tbody');
            tableBody.innerHTML = ''; // Clear the table before adding new rows
    
            // Iterate over the fetched sentences and create table rows
            sentences.forEach(entry => {
                const row = document.createElement('tr');
                const termCell = document.createElement('td');
                const sentenceCell = document.createElement('td');
    
                termCell.textContent = entry.term;
                sentenceCell.textContent = entry.text; // Corrected to use the 'text' property
    
                row.appendChild(termCell);
                row.appendChild(sentenceCell);
                tableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching sample sentences:', error);
        }
    };
    
      // Periodically send words to the backend every 10 seconds
      setInterval(() => {
        if (words.length > 0) {
          addWords(words);
        }
      }, 30000); // 10 seconds

        // Periodically fetch and display definitions every 30 seconds
  
  fetchAndDisplaySentences();
  fetchAndDisplayDefinitions(); // Initial call
  setInterval(fetchAndDisplayDefinitions, 30000); // Subsequent calls every 30 seconds
