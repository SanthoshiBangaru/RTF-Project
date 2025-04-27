// recommendations.js
document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    
    if (!token || !userId) {
        window.location.href = 'index.html';
        return;
    }
    
    // Logout button
    document.getElementById('logout-btn').addEventListener('click', function() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = 'index.html';
    });
    
    // Load recommendations and preferences
    loadUserData();
    
    async function loadUserData() {
        try {
            const response = await fetch('/api/recommendations', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to load data');
            }
            
            displayPreferences(data.preferences);
            displayRecommendations(data.recommendations);
        } catch (error) {
            console.error(error);
            alert('Failed to load recommendations. Please try again.');
        }
    }
    
    function displayPreferences(preferences) {
        const prefsContainer = document.getElementById('user-preferences');
        prefsContainer.innerHTML = '';
        
        if (preferences.length === 0) {
            prefsContainer.innerHTML = '<p>No preferences set yet.</p>';
            return;
        }
        
        const prefsList = document.createElement('ul');
        
        preferences.forEach(pref => {
            const li = document.createElement('li');
            let prefText = '';
            
            if (pref.preferred_genre) prefText += `Genre: ${pref.preferred_genre} `;
            if (pref.preferred_actor) prefText += `Actor: ${pref.preferred_actor} `;
            if (pref.preferred_director) prefText += `Director: ${pref.preferred_director} `;
            
            li.textContent = prefText;
            prefsList.appendChild(li);
        });
        
        prefsContainer.appendChild(prefsList);
    }
    
    function displayRecommendations(recommendations) {
        const recsContainer = document.getElementById('recommendations-list');
        recsContainer.innerHTML = '';
        
        if (recommendations.length === 0) {
            recsContainer.innerHTML = '<p>No recommendations yet. Rate some movies to get recommendations.</p>';
            return;
        }
        
        const recsGrid = document.createElement('div');
        recsGrid.className = 'recommendations-grid';
        
        recommendations.forEach(movie => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            
            movieCard.innerHTML = `
                <h3>${movie.title} (${movie.release_year})</h3>
                <p>Genre: ${movie.genre || 'Unknown'}</p>
                <p>Director: ${movie.director || 'Unknown'}</p>
                <p>Rating: ${movie.average_rating || 'Not rated'}</p>
                <p>Match score: ${movie.score.toFixed(1)}</p>
                <div class="rate-buttons">
                    <button data-movie-id="${movie.movie_id}" class="rate-btn" data-rating="1">1★</button>
                    <button data-movie-id="${movie.movie_id}" class="rate-btn" data-rating="2">2★</button>
                    <button data-movie-id="${movie.movie_id}" class="rate-btn" data-rating="3">3★</button>
                    <button data-movie-id="${movie.movie_id}" class="rate-btn" data-rating="4">4★</button>
                    <button data-movie-id="${movie.movie_id}" class="rate-btn" data-rating="5">5★</button>
                </div>
            `;
            
            recsGrid.appendChild(movieCard);
        });
        
        recsContainer.appendChild(recsGrid);
        
        // Add event listeners to rating buttons
        document.querySelectorAll('.rate-btn').forEach(button => {
            button.addEventListener('click', function() {
                const movieId = this.getAttribute('data-movie-id');
                const rating = this.getAttribute('data-rating');
                rateMovie(movieId, rating);
            });
        });
    }
    
    async function rateMovie(movieId, rating) {
        try {
            const response = await fetch('/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    movieId,
                    rating: parseInt(rating)
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }
            
            alert('Rating submitted! Recommendations will update.');
            loadUserData(); // Refresh recommendations
        } catch (error) {
            console.error(error);
            alert('Failed to submit rating. Please try again.');
        }
    }
});
