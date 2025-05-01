if ( process.env.NODE_ENV !== "production" ) {
    require("dotenv").config(); 
} //this is used to check the environment of the app and it is used to check the app is in production or development mode
// if the app is in development mode then it will print the development mode in the console and if it is in production mode then it will print the production mode in the console

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path"); //for using path.join
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MongoURL = "mongodb://127.0.0.1:27017/wanderlust2";//"mongodb:initialize the URL before funciton call";
const dbURL = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(dbURL);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "Public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({ // MongoStore is used to store the session data in the MongoDB Atlas (which is a cloud database) and it is used to store the session data in the database
    mongoUrl: dbURL, // here we are using the MongoDB Atlas URL to store the session data in the database
    crypto: { // crypto is used to encrypt the session data and it is used to store the session data in the encrypted form
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600, // time period in seconds and it is used to update the session data after the time period
});

const sessionOptions = { //sessionOptions is an object which is used to create a session for the user
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { //cookie is used to store the session data in the browser
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOptions)); //here session is used to create a session for the user
app.use(flash()); // here we use flash after session because flash uses session to store the data and flow is go to listing.js

app.use(passport.initialize());// here passport is initialized and it is used to authenticate the user and always use after the session
app.use(passport.session());// here passport is used to create a session for the user and track the user session and it is used to authenticate the user for different routes and tabs in the same browser
passport.use(new LocalStrategy(User.authenticate())); //User.authenticate() is a method which is provided by passport-local-mongoose and it is used to authenticate the user
passport.serializeUser(User.serializeUser());//User.serializeUser() is a method which is provided by passport-local-mongoose and it is used to serialize the user (means storing the user in the session)
passport.deserializeUser(User.deserializeUser());//User.deserializeUser() is a method which is provided by passport-local-mongoose and it is used to deserialize the user (means removing the user from the session)

app.use((req, res, next) => { //this middleware is used to store the data in the locals object and locals object is used to store the data in the session and it is used to display the message on the screen (all listing page) without passing it as any arguemnt
    res.locals.success = req.flash("success");
    res.locals.failure = req.flash("failure");
    res.locals.currUser = req.user; //req.user is used to store the current user in the session and it is used to display the message on the screen (all listing page or any page) without passing it as any arguemnt
    next();
});

// here we are using the userRouter to handle the user routes and used to create demouser and used to authenticate the user
// app.get("/demoUser", async (req, res) => {
//     let fakeuser = new User({
//         username: "fakeuser",
//         email: "fakeuser@gmail.com",
//     });
//     let registeredUser = await User.register(fakeuser, "fakepassword");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// Used for debugging when req.body is sending empty object or undefined
// app.use((req, res, next) => {
//     console.log(`Headers: ${JSON.stringify(req.headers)}`);
//     console.log(`Body: ${JSON.stringify(req.body)}`);
//     next();
// });

// Used for creating a test listing in the database 
// app.get("/testlisting", async (req,res) => {
//     let sampleListing = new Listing({
//         "title": "Test Listing",
//         "description": "This is a test listing",
//         "price": 100,
//         "location": "Test Location",
//         "country": "Test Country",
//     });
//     await sampleListing.save();
//     console.log("Test Listing created");
//     res.send("Test Listing created");
// })

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found")); //ExpressError is a custom error class and pass as a parameter to next function
})

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});


app.listen(8080, () => {
    console.log("Server is listening to the port : 8080");
});