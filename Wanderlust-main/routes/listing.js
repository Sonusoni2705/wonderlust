const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const listingController = require("../controllers/listing.js");// here all callback functions are come from the controller folder listing.js file

//index route and create route are merged into one route because we are using the same path for both routes
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing, wrapAsync(listingController.createListing));

    // this line is for testing the image upload
    // .post(upload.single("listing[image]"), (req, res) => {
    //     res.send(req.file);
    // });

//New Listing Route
router.get("/new",isLoggedIn, listingController.renderNewForm);

//Show, Update and Delete Routes are merged into one route because we are using the same path for all routes
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

//Index Route
// router.get("/", wrapAsync(listingController.index));

//Show Route
//router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
//router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
//router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.updateListing));

//Delete Route
//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;