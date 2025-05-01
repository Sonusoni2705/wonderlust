const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MongoURL = "mongodb://127.0.0.1:27017/wanderlust2";//"mongodb:initialize the URL before funciton call";
main()
.then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(MongoURL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "67bd63ae2c3c4e4de18344f8"}));
    await Listing.insertMany(initData.data);
    console.log("Data inserted");
};

initDB();