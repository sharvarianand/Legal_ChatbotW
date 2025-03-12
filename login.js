document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Perform login logic here (e.g., send credentials to the server)
            if (username === 'admin' && password === 'password') { // Example validation
                // Save chat history (example)
                localStorage.setItem('chatHistory', JSON.stringify([])); // Initialize empty chat history
                // Set authentication flag
                localStorage.setItem('authenticated', 'true');
                // Redirect to the main page after successful login
                window.location.href = 'index.html';
            } else {
                // Show error message
                document.getElementById('login-error').style.display = 'block';
            }
        });
    }
});
