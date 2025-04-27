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
/* script.js (existing script) */

// Add this to existing script
document.addEventListener('DOMContentLoaded', () => {
    const authButton = document.getElementById('auth-button');

    authButton.addEventListener('click', () => {
        window.location.href = 'auth.html'; // Redirect to your auth page
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // Replace with your actual movie data loading logic
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
    // Replace with your actual wishlist data loading logic
    const wishlistMovies = [
        { title: 'Spirited Away', imageUrl: 'spirited.jpg', details: 'During her family\'s move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, and where humans are changed into beasts.' },
        { title: 'Parasite', imageUrl: 'parasite.jpg', details: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.' },
        // ... more wishlist movies
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