import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

const Watchlist = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const loggedInUser = localStorage.getItem('userId');

    useEffect(() => {
        if (!loggedInUser) {
            navigate('/login');
        } else {
            fetchWatchlist(loggedInUser);
        }
    }, [loggedInUser, navigate]);

    const fetchWatchlist = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8080/wishlist/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setWatchlist(data);
            } else {
                setErrorMessage('Failed to load watchlist');
            }
        } catch (error) {
            console.error('Error fetching watchlist:', error);
            setErrorMessage('Failed to load watchlist');
        }
    };

    const handleDelete = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:8080/wishlist/${loggedInUser}/${movieId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setWatchlist(prev => prev.filter(movie => movie.movie_id !== movieId));
            } else {
                console.error("Failed to delete movie");
            }
        } catch (error) {
            console.error("Error deleting movie:", error);
        }
    };

    return (
        <main className="watchlist-page">
            <h1><span className="text-gradient">BingeList</span></h1>

            {errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
            ) : (
                <section className="watchlist">
                    {watchlist.length > 0 ? (
                        <>
                            {watchlist.map((movie) => (
                                <div key={movie.movie_id} className="movie-card">
                                    <button className="delete-btn" onClick={() => handleDelete(movie.movie_id)}>×</button>
                                    <img
                                        src={movie.poster_url ? `https://image.tmdb.org/t/p/w500/${movie.poster_url}` : '/no-movie.png'}
                                        alt={movie.title}
                                    />
                                    <h3>{movie.title}</h3>
                                    <p className="year">{movie.year ? movie.year.split('-')[0] : 'N/A'}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <div id="emptywatchlist">
                            <p>Your Watchlist is Empty... Start Binging!</p>
                            <img src="/empty-wishlist.png" alt="Empty watchlist" />
                        </div>
                    )}
                </section>
            )}
        </main>
    );
};

export default Watchlist;
