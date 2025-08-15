import React from "react";
import Search from "./../components/Search";
import Spinner from "./../components/Spinner";
import { useState, useEffect } from "react";
import { useDebounce } from 'react-use'
import MovieCard from "./../components/MovieCard";
import { getTrendingMovies, updateSearchCount } from './../appwrite.js'
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { FaBars, FaUser, FaSignOutAlt, FaBookmark } from "react-icons/fa";


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [wishlist, setWishlist] = useState([]);



  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'))
  }, [])

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const res = await fetch(`http://localhost:8080/wishlist/${userId}`);
        const data = await res.json();
        const movieIds = data.map((item) => item.movie_id);
        setWishlist(movieIds);
      } catch (error) {
        console.error('Failed to fetch wishlist', error);
      }
    };
  
    if (loggedInUser) {
      fetchWishlist();
    }
  }, [loggedInUser]);
  

  const handleLogout = (e) => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Loggedout');
    setTimeout(() => {
      navigate('/login');
    }, 1000)
  }

  const fetchMovies = async (query = '', page = 1) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const endpointBase = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const endpoint = `${endpointBase}&page=${page}`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error('Error fetching movies');
      }

      const data = await response.json();
      
      if (data.Response === 'False') {
        setErrorMessage(data.Error || 'Failed to fetch movies');
        setMovieList([]);
        return;
      }

      // Limit the number of pages to 25
      const maxPages = 25;
      setTotalPages(Math.min(data.total_pages, maxPages)); // Set totalPages to 25 or the actual value, whichever is smaller

      setMovieList(data.results);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Error fetching movies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };



  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();

      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  const toggleWishlist = async (movie) => {
    const userId = localStorage.getItem('userId');
    const isWishlisted = wishlist.includes(movie.id);
    // console.log(mpvie.id);
    try {
      if (isWishlisted) {
        // Remove
        await fetch(`http://localhost:8080/wishlist/${userId}/${movie.id}`, {
          method: 'DELETE',
        });
        setWishlist((prev) => prev.filter((id) => id !== movie.id));
      } else {
        // Add
        await fetch(`http://localhost:8080/wishlist/${userId}/${movie.id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            language: movie.original_language,
            year: movie.release_date?.split('-')[0],
          }),
        });
        setWishlist((prev) => [...prev, movie.id]);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };
  

  useEffect(() => {
    fetchMovies(debouncedSearchTerm, currentPage);
  }, [debouncedSearchTerm, currentPage]);


  useEffect(() => {
    loadTrendingMovies();
  }, []);


  return (
    <main className="homepage">


      <div className="pattern" />

      <div className="wrapper">
        <header>
          <img className="logo" src="./logo.png" alt="Logo"></img>
          <img src="./hero.png" alt="Hero Poster"></img>
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>


        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Now</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                </li>
              ))}
            </ul>
          </section>
        )}


        <section className="all-movies">
          <h2>Popular</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie}
                isWishlisted={wishlist.includes(movie.id)}
                toggleWishlist={toggleWishlist} />
              ))}
            </ul>

          )}
          <div className="pagination items-center flex justify-center gap-4 mt-6">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
            >
              &lt;
            </button>

            {/* Page Numbers */}
            <span className="text-white"> {currentPage} / {totalPages}</span>

            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg disabled:opacity-50 hover:bg-gray-700 transition"
            >
              &gt;
            </button>
          </div>


        </section>
      </div>
      <ToastContainer />
    </main>
  )
}

export default Home