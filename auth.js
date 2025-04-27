/* auth.js */
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const authForms = document.querySelectorAll('.auth-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.dataset.tab;

            tabButtons.forEach(btn => btn.classList.remove('active'));
            authForms.forEach(form => form.classList.remove('active'));

            button.classList.add('active');
            document.getElementById(tab).classList.add('active');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');

    authButton.addEventListener('click', () => {
        window.location.href = 'auth.html'; 
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const movies = [
        { title: 'Inception', imageUrl: 'inception.jpg', details: 'A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO.' },
        { title: 'The Shawshank Redemption', imageUrl: 'shawshank.jpg', details: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.' },
        // ... more movies
    ];

    const movieList = document.querySelector('#all-movies .movie-list');

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.imageUrl}" alt="${movie.title}">
            <div class="overlay">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">${movie.details}</div>
            </div>
        `;
        movieList.appendChild(movieItem);
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const wishlistMovies = [
        { title: 'Spirited Away', imageUrl: 'spirited.jpg', details: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.' },
        { title: 'Parasite', imageUrl: 'parasite.jpg', details: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
    ];

    const wishlist = document.querySelector('#wishlist .movie-list');

    wishlistMovies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.classList.add('movie-item');
        movieItem.innerHTML = `
            <img src="${movie.imageUrl}" alt="${movie.title}">
            <div class="overlay">
                <div class="movie-title">${movie.title}</div>
                <div class="movie-details">${movie.details}</div>
            </div>
        `;
        wishlist.appendChild(movieItem);
    });
});

// auth.js
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-button');
    const authForms = document.querySelectorAll('.auth-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding form
            authForms.forEach(form => form.classList.remove('active'));
            document.getElementById(tab).classList.add('active');
        });
    });
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }
            
            // Store token and user ID
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            
            // Redirect to recommendations page
            window.location.href = 'recommendations.html';
        } catch (error) {
            alert(error.message);
        }
    });
    
    // Signup form submission
    const signupForm = document.getElementById('signup-form');
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Signup failed');
            }
            
            alert('Account created successfully! Please login.');
            
            // Switch to login tab
            document.querySelector('.tab-button[data-tab="login"]').click();
            
            // Clear form
            signupForm.reset();
        } catch (error) {
            alert(error.message);
        }
    });
});