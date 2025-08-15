
const UserMovie = require('../models/wishlist');
const addToWishlist = async (req, res) => {
    const { user_id, movie_id } = req.params;
    const { title, poster_url, language, year } = req.body;
  
    try {
      // Prevent duplicate entry
      const exists = await UserMovie.findOne({ user_id, movie_id });
      if (exists) {
        return res.status(409).json({ message: 'Movie already in wishlist' });
      }
  
      const movie = new UserMovie({
        user_id,
        movie_id,
        title,
        poster_url,
        language,
        year
      });
  
      await movie.save();
      res.status(201).json(movie);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add to wishlist', error });
    }
  };
  const deleteFromWishlist = async (req, res) => {
    const { user_id, movie_id } = req.params;
  
    try {
      const deleted = await UserMovie.findOneAndDelete({ user_id, movie_id });
  
      if (!deleted) {
        return res.status(404).json({ message: 'Movie not found in wishlist' });
      }
  
      res.json({ message: 'Movie removed from wishlist' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove movie', error });
    }
  };
  const getWishlist = async (req, res) => {
    const { user_id } = req.params;
  
    try {
      const wishlist = await UserMovie.find({ user_id });
      res.json(wishlist);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch wishlist', error });
    }
  };
  module.exports = {
    addToWishlist,
    deleteFromWishlist,
    getWishlist
  };
        