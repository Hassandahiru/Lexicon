document.addEventListener('DOMContentLoaded', (event) => {
  console.log('DOM fully loaded and parsed');
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
      // Periodically send words to the backend every 10 seconds
      setInterval(() => {
        if (words.length > 0) {
          addWords(words);
        }
      }, 30000); // 10 seconds