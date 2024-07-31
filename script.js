// Event listener to load popular movies when the page loads
document.addEventListener('DOMContentLoaded', () => {
    displayPopularMovies();

    // Add event listener to the Back button
    const backButton = document.getElementById('back-button');
    backButton.addEventListener('click', () => {
        document.getElementById('movie-details').style.display = 'none';
        document.getElementById('popular-movies').style.display = 'flex';
        document.getElementById('back-button-container').style.display = 'none';
    });
});

// Function to fetch and display popular movies
async function displayPopularMovies() {
    const popularMovies = [
        'Guardians of the Galaxy Vol. 2',
        'Avengers: Endgame',
        'Spider-Man: Far From Home',
        'Joker',
        'The Lion King',
        'Toy Story 4',
        'Inception',
        'Parasite'
    ];

    const apiKey = 'db27728'; // Replace with your actual API key
    const movieDetailsPromises = popularMovies.map(title =>
        fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`)
            .then(response => response.json())
    );

    try {
        const movieDetails = await Promise.all(movieDetailsPromises);
        console.log(movieDetails); // Log the details to check the Poster URLs
        const popularMoviesDiv = document.getElementById('popular-movies');
        popularMoviesDiv.innerHTML = movieDetails
            .map(movie => {
                if (movie.Response === 'True') {
                    return `<div class="movie-card" onclick="showMovieDetails('${movie.Title}')">
                                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                                <h3>${movie.Title}</h3>
                                <div class="rating">
                                    ${createStarRating(movie.imdbRating)}
                                </div>
                                <p><span class="rating-label">Rating:</span> ${movie.imdbRating} / 10</p>
                            </div>`;
                } else {
                    return `<div class="movie-card">
                                <h3>${movie.Title}</h3>
                                <p>Movie not found.</p>
                            </div>`;
                }
            })
            .join('');

        // Show the Back button and popular movies
        document.getElementById('back-button-container').style.display = 'none';
        document.getElementById('movie-details').style.display = 'none'; // Hide movie details
        document.getElementById('popular-movies').style.display = 'flex';
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        document.getElementById('popular-movies').innerHTML = '<p>Error loading popular movies.</p>';
    }
}

// Function to show details for a specific movie when its image is clicked
async function showMovieDetails(title) {
    const apiKey = 'db27728'; // Replace this with your actual API key
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
        displayMovieDetails(data);
    } else {
        document.getElementById('movie-details').innerHTML = `<p>Movie not found.</p>`;
    }
}

// Function to display the details of a searched movie
async function searchMovie() {
    const title = document.getElementById('movie-title').value;
    if (!title) {
        alert('Please enter a movie title');
        return;
    }

    const apiKey = 'db27728'; // Replace this with your actual API key
    const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === 'True') {
        displayMovieDetails(data);
    } else {
        document.getElementById('movie-details').innerHTML = `<p>Movie not found.</p>`;
    }

    // Clear the search input field
    document.getElementById('movie-title').value = '';
}

// Function to display the details of a searched movie
function displayMovieDetails(movie) {
    const imdbRating = parseFloat(movie.imdbRating);

    const movieDetails = `
        <img src="${movie.Poster}" alt="${movie.Title} Poster">
        <h2>${movie.Title} (${movie.Released})</h2>
        <div class="rating">
            ${createStarRating(movie.imdbRating)}
        </div>
        <p><span class="rating-label">Rating:</span> ${imdbRating} / 10</p>
        <p><strong>Plot:</strong> ${movie.Plot}</p>
    `;
    document.getElementById('movie-details').innerHTML = movieDetails;
    document.getElementById('movie-details').style.display = 'block';
    document.getElementById('popular-movies').style.display = 'none'; // Hide popular movies
    document.getElementById('back-button-container').style.display = 'block'; // Show Back button
}

// Function to create star rating out of 5 stars
function createStarRating(rating) {
    const imdbRating = parseFloat(rating);
    const fullStars = Math.floor(imdbRating / 2);
    const halfStar = imdbRating % 2 >= 1 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    return `
        ${'★'.repeat(fullStars)}
        ${halfStar ? '☆' : ''}
        ${'☆'.repeat(emptyStars)}
    `;
}
