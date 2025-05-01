const express = require('express');
const router = express.Router({mergeParams: true});//here mergeParams is used to merge the params from the app.js and the routes
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/review.js");//All callback functions are written in the controller folder review.js file

// Review Post Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.reviewDelete));

module.exports = router;