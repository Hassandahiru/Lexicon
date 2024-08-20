// main.js
const form = document.getElementById('signup-form');
form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Retrieve form data
    const email = form.elements['email'].value;
    const password = form.elements['password'].value;

    // Example: Send form data to server (replace with your logic)
    console.log(`Email: ${email}, Password: ${password}`);
});

const forgotPasswordLink = document.getElementById('forgot-password');
forgotPasswordLink.addEventListener('click', function(event) {
    event.preventDefault();
    const link = 'https://example.com/forgot-password'; // Replace with your link
    window.open(link, '_blank'); // Open link in a new tab
});

const usernameLink = document.getElementById('username');
usernameLink.addEventListener('click', function(event) {
    event.preventDefault();
    const link = 'https://example.com/username'; // Replace with your link
    window.open(link, '_blank'); // Open link in a new tab
});
