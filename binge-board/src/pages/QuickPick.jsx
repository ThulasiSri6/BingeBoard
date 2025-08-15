import React, { useState } from 'react';
import MovieCard from '../components/MovieCard';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

const QuickPick = () => {
  const [randomMovie, setRandomMovie] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePickMovie = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const randomPage = Math.floor(Math.random() * 25) + 1;
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${randomPage}`;
      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json();
      const movies = data.results;

      if (movies.length === 0) {
        setErrorMessage('No movies found.');
        setRandomMovie(null);
        return;
      }

      const randomIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[randomIndex]);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Error fetching movie. Please try again.');
      setRandomMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quick-pick text-center">
  <button
    onClick={handlePickMovie}
    disabled={isLoading}
    className="pick-movie-button mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
  >
    {isLoading ? 'Loading...' : 'Pick a Movie'}
  </button>

  {errorMessage && <p className="error text-red-500">{errorMessage}</p>}

  {!randomMovie && !isLoading && (
    <img
      src="/dice.svg" // replace with your die image path
      alt="Roll the Dice"
      className="mx-auto w-40 h-40 mt-55 animate-bounce"
    />
  )}

  {randomMovie && (
    <div className="movie-card relative group overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 max-w-sm mx-auto mt-6">
      <img
        src={
          randomMovie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${randomMovie.poster_path}`
            : '/no-movie.png'
        }
        alt={randomMovie.title}
        className="w-full h-100 object-cover"
      />

      {/* Hover overlay with overview */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
        <h3 className="text-lg text-gradient font-bold mb-2">{randomMovie.title}</h3>
        <p className="text-sm line-clamp-4">
          {randomMovie.overview ? randomMovie.overview : 'No overview available.'}
        </p>
      </div>

      <div className="mt-4 flex justify-between items-start z-10 relative">
        <div>
          <h3 className="ml-0">{randomMovie.title}</h3>

          <div className="content flex items-center gap-2 text-sm text-gray-300">
            <div className="rating flex items-center gap-1">
              <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
              <p>{randomMovie.vote_average ? randomMovie.vote_average.toFixed(1) : 'N/A'}</p>
            </div>

            <span>•</span>
            <p className="lang">{randomMovie.original_language}</p>

            <span>•</span>
            <p className="year">
              {randomMovie.release_date ? randomMovie.release_date.split('-')[0] : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default QuickPick;
