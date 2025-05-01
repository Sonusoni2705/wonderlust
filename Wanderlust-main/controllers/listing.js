const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding'); //requiring the mapbox-sdk
const mapToken = process.env.MAP_TOKEN; //storing the mapbox token in the variable
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//Index Controller(callback function which show all listings)
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
};

//New Listing Controller(callback function which show new listing form)
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Show Listing Controller(callback function which show specific listing)
module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");// populate is used to get all the information about reviews and owner (or any parameter which is passed) field in the listing model
    if(!listing) {
        req.flash("failure", "Cannot find that listing!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

//Create Listing Controller(callback function which create new listing)
module.exports.createListing = async (req, res,next) => {
    // if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data"); //this syntax is also correct and only use when we not pass any middleware but here we pass validate listing so we dont require these lines anymore
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Invalid Listing Data");
    // }

    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        })
        .send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newListings = new Listing(req.body.listing);
    newListings.image = {url, filename};
    newListings.owner = req.user._id;
    newListings.geometry = response.body.features[0].geometry;
    let savedListings = await newListings.save();
    console.log(savedListings);
    req.flash("success", "New Listing Created!"); // req.flash is used to store the data in the session and it is used to display the message on the screen where key is success and value is New Listing Created and it is used to display the message on the screen (all listing page)
    res.redirect("/listings");
};

//Edit Listing Controller(callback function which show edit listing form)
module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("failure", "Cannot find that listing!");
        res.redirect("/listings");
    }

    let originalURL = listing.image.url;
    let originalImageURL = originalURL.replace("upload", "upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageURL});
};


//Update Listing Controller(callback function which update the listing)
module.exports.updateListing = async (req, res) => {
    // if(!req.body.listing) throw new ExpressError(400, "Invalid Listing Data"); //this syntax is also correct
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Invalid Listing Data");
    // }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing}); 
    // ... is spread operator & used to create a new object and passed as second argument to findByIdAndUpdate for updating the listing.
    
    if(typeof  req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save();
    }
    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Listing Controller(callback function which delete the listing)
module.exports.deleteListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};