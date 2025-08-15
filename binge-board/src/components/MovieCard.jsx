import React from "react";
import { FaHeart } from 'react-icons/fa';

const MovieCard = ({ movie: { id, title, poster_path, vote_average, original_language, release_date, overview }, movie, isWishlisted, toggleWishlist }) => {
    return (
        <div className="movie-card relative group overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105">
            <img
                src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'}
                alt={movie.title}
                className="w-full object-cover"
            />

            {/* Hover overlay with overview */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-70 text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-y-auto">
                <h3 className="text-lg text-gradient font-bold mb-2">{title}</h3>
                <p className="text-sm">{overview ? overview : 'No overview available.'}</p>
            </div>

            <div className="mt-4 flex justify-between items-start z-10 relative">
                <div>
                    <h3>{title}</h3>

                    <div className="content flex items-center gap-2 text-sm text-gray-300">
                        <div className="rating flex items-center gap-1">
                            <img src="star.svg" alt="Star Icon" className="w-4 h-4" />
                            <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                        </div>

                        <span>•</span>
                        <p className="lang">{original_language}</p>

                        <span>•</span>
                        <p className="year">
                            {release_date ? release_date.split('-')[0] : 'N/A'}
                        </p>
                    </div>
                </div>
                <div className="text-xl cursor-pointer select-none">
                    <button
                        className="top-2 right-2 text-xl"
                        onClick={() => toggleWishlist(movie)}
                    >
                        <FaHeart color={isWishlisted ? 'red' : 'white'} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MovieCard;