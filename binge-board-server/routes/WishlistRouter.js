const { addToWishlist,deleteFromWishlist,getWishlist } = require('../controller/WishlistController');

const router = require('express').Router();

router.get('/:user_id',getWishlist);
router.post('/:user_id/:movie_id', addToWishlist);
router.delete('/:user_id/:movie_id',deleteFromWishlist);

module.exports = router;