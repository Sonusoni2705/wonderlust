const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        url: String,
        filename: String,
        // default: "https://plus.unsplash.com/premium_photo-1682285210821-5d1b5a406b97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlZSUyMGJlYWNoJTIwaG91c2UlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D",
        // set: (v) => 
        //     v === "" ? "https://plus.unsplash.com/premium_photo-1682285210821-5d1b5a406b97?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZnJlZSUyMGJlYWNoJTIwaG91c2UlMjBpbWFnZXxlbnwwfHwwfHx8MA%3D%3D" : v,
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: { //moongose stores the data in the form of geojson inwhich latitude comes first
        type: {
            type: String, //Don't do `{location:{type:String}}`
            enum: ['Point'], //'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }

}); 

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;