const User = require("../models/user.js");

//Render Signup Form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Signup Controller
module.exports.signup = async (req, res) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({username, email, password});
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err) {
            return next(err)
        }
        req.flash("success", `Welcome to Wanderlust ${username}!`);
    res.redirect("/listings");
    });
    } catch(e){
        req.flash("failure", e.message);
        console.log(e.message);
        res.redirect("/signup");
    }
    
};

//Render Login Form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

//Login Controller
module.exports.login = async(req,res) => { //here we are using passport.authenticate() to authenticate the user and it is used to authenticate the user and it is used to check the user is valid or not "local" is a strategy which is used to authenticate the user and it is provided by passport-local and it is used to authenticate the user by using the username and password
    req.flash(`success", "Welcome back to Wanderlust! ${req.user.username}`);
    res.redirect(res.locals.redirectUrl || "/listings"); //here we are using res.locals.redirectUrl to redirect the user to the same page after logedin and if it is not available then redirect to the listing page
};

//Logout Controller
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "Yoy are logged out!");
        res.redirect("/listings");
    })
};