// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active form
            document.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
        });
    });

    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;
            
            try {
                // In a real application, you would call your backend API here
                // For this example, we'll simulate a successful login after 1 second
                
                console.log('Attempting login with:', { username, password });
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Store user data in localStorage (simulating authentication)
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);
                
                // Redirect to index.html after successful login
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed. Please try again.');
            }
        });
    }

    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('signup-username').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            
            try {
                // In a real application, you would call your backend API here
                // For this example, we'll simulate a successful signup after 1 second
                
                console.log('Attempting signup with:', { username, email, password });
                
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Store user data in localStorage (simulating account creation)
                localStorage.setItem('isAuthenticated', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                
                // Redirect to index.html after successful signup
                window.location.href = 'index.html';
                
            } catch (error) {
                console.error('Signup error:', error);
                alert('Signup failed. Please try again.');
            }
        });
    }
});