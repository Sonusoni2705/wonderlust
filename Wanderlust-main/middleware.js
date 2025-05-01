const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) { //isAuthenticated is a method which is provided by passport and it is used to check whether the user is authenticated (logedin) or not
        req.session.redirectUrl = req.originalUrl; //here we are storing the url in the session object and it is used to redirect the user to the same page after logedin
        req.flash("failure", "You must be Login to create a new listing!");
        return res.redirect("/login"); //if not logedin then redirect to login page
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("failure", "You are not owner of this listing!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};

// Validation Middleware
module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        // throw new ExpressError(400, result.error.details.map(el => el.message).join(", "));
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Review Validation Middleware
module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        // throw new ExpressError(400, result.error.details.map(el => el.message).join(", "));
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)) {
        req.flash("failure", "You are not author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
};