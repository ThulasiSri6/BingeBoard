import React, { useState, useEffect } from "react";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BingeBytes = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [watchlist, setWatchlist] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!userId) {
        setErrorMessage("User ID not found in localStorage.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:8080/wishlist/${userId}`);
        const data = await response.json();
        setWatchlist(data); // Assuming the response is an array of movie IDs or movie objects

        if (data.length === 0) {
          setErrorMessage("");
        }
      } catch (error) {
        setErrorMessage("Error fetching watchlist.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [userId]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (watchlist.length === 0) {
        // Use a default movie if the watchlist is empty
        const movie_id=822119;
        fetchSuggestions(movie_id); // Movie ID 550 (Fight Club) as a fallback
      } else {
        const movie = watchlist[0]; // First movie in the watchlist
        fetchSuggestions(movie.movie_id);
      }
    };

    if (!loading) {
      fetchMovies();
    }
  }, [watchlist, loading]);

  const fetchSuggestions = async (movieId) => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/similar?language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setMovies(data.results);
      } else {
        setErrorMessage("No similar movies found.");
      }
    } catch (error) {
      setErrorMessage("Error fetching suggestions. Please try again.");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="moviesuggestions">
    <h2 className="text-gradient">Movies That Match Your Vibe</h2>
    {movies.length > 0 ? (
      <div className="movie-suggestions px-44 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
        {movies.map((randomMovie) => (
          <div key={randomMovie.id} className="movie-card relative group overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 max-w-sm mx-auto">
            <img
              src={
                randomMovie.poster_path
                  ? `https://image.tmdb.org/t/p/w500/${randomMovie.poster_path}`
                  : '/no-movie.png'
              }
              alt={randomMovie.title}
              className="w-full object-cover"
            />
  
            {/* Hover overlay with overview */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
              <h3 className="text-lg text-gradient font-bold mb-2">{randomMovie.title}</h3>
              <p className="text-sm line-clamp-17">
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
        ))}
      </div>
    ) : (
      <p>No suggestions available.</p>
    )}
  </div>
  

  );
};

export default BingeBytes;
