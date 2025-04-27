
// Movies Data
const movies = [
  { title: 'Blaze Pursuit', genre: 'action', description: 'Explosive missions and breathtaking stunts.', image: 'images/action1.jpg', ratings: [] },
  { title: 'Crimson Chase', genre: 'action', description: 'One last ride to save the world.', image: 'images/action2.jpg', ratings: [] },
  { title: 'Shadow Strike', genre: 'action', description: 'A silent assassin fights corruption.', image: 'images/action3.jpg', ratings: [] },
  { title: 'Laugh Riot', genre: 'comedy', description: 'A hilarious road trip with unexpected twists.', image: 'images/comedy1.jpg', ratings: [] },
  { title: 'Bakers Unleashed', genre: 'comedy', description: 'Two clueless roommates open a bakery.', image: 'images/comedy2.jpg', ratings: [] },
  { title: 'Cosmic Giggles', genre: 'comedy', description: 'Aliens land and discover stand-up comedy.', image: 'images/comedy3.jpg', ratings: [] },
];

// Theme toggle
const themeBtn = document.getElementById('theme-toggle');
if (themeBtn) {
  themeBtn.onclick = () => {
    document.body.classList.toggle('light');
    localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
  };
}

// Load Movies
const container = document.getElementById('movies-container');
if (container) {
  loadMovies('all');
  document.querySelectorAll('.genre-btn').forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadMovies(btn.dataset.genre);
    };
  });
}

function loadMovies(filter) {
  container.innerHTML = '';
  let filtered = filter === 'all' ? movies : movies.filter(m => m.genre === filter);
  filtered.forEach(movie => {
    let avg = movie.ratings.length ? (movie.ratings.reduce((a, b) => a + b) / movie.ratings.length).toFixed(1) : 'No ratings';
    let card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `<img src="${movie.image}" alt="${movie.title}" title="${movie.description}">
      <div class="title">${movie.title}</div>
      <div class="rating">⭐ ${avg}</div>
      <div class="buttons">
        <button onclick="rateMovie('${movie.title}')">Rate This</button>
        <button onclick="addToWatchlist('${movie.title}')">Add to Watchlist</button>
      </div>`;
    container.appendChild(card);
  });
}

function rateMovie(title) {
  const user = localStorage.getItem('loggedInUser');
  if (!user) return alert('Login first to rate.');
  const rating = prompt('Enter your rating (1-5):');
  if (rating >= 1 && rating <= 5) {
    let movie = movies.find(m => m.title === title);
    movie.ratings.push(parseInt(rating));
    loadMovies('all');
  } else {
    alert('Invalid rating.');
  }
}

function addToWatchlist(title) {
  const user = localStorage.getItem('loggedInUser');
  if (!user) return alert('Login first to add to watchlist.');
  let list = JSON.parse(localStorage.getItem(user + '_watchlist') || '[]');
  if (!list.includes(title)) list.push(title);
  localStorage.setItem(user + '_watchlist', JSON.stringify(list));
  alert('Added to watchlist!');
}

// Load Watchlist
const watchlistContainer = document.getElementById('wishlist-container');
if (watchlistContainer) {
  const user = localStorage.getItem('loggedInUser');
  if (!user) {
    watchlistContainer.innerHTML = '<p>Please login to see your wishlist.</p>';
  } else {
    const list = JSON.parse(localStorage.getItem(user + '_watchlist') || '[]');
    watchlistContainer.innerHTML = list.length ? list.map(m => `<div>${m}</div>`).join('') : '<p>Your wishlist is empty.</p>';
  }
}


// Logout Functionality
document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser');
      alert('You have been logged out.');
      window.location.href = 'Login.html';
    });
  }
});

// Logout Functionality (fixed)
document.addEventListener('DOMContentLoaded', () => {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('loggedInUser'); // Only remove session key
      alert('You have been logged out.');
      window.location.href = 'Login.html'; // Redirect safely
    });
  }
});


// Add to Wishlist functionality
function addToWishlist(movieName) {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    alert('Please login to add movies to wishlist.');
    window.location.href = 'Login.html';
    return;
  }

  const wishlistKey = 'wishlist_' + loggedInUser;
  let wishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

  if (!wishlist.includes(movieName)) {
    wishlist.push(movieName);
    localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    alert('Movie added to your wishlist!');
  } else {
    alert('Movie already in your wishlist.');
  }
}
