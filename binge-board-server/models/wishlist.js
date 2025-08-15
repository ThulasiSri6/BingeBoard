const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WishlistSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  // optional: assuming you have a User model
        required: true
      },
      movie_id: {
        type: Number, // TMDB movie id is usually a number
        required: true
      },
      title: {
        type: String,
        required: true
      },
      poster_url: {
        type: String
      },
      language: {
        type: String
      },
      year: {
        type: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
});

const WishlistModel = mongoose.model('wishlist', WishlistSchema);
module.exports = WishlistModel;