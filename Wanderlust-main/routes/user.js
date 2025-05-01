const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require("../controllers/user.js");// here all callback functions are come from the controller folder user.js file

//Signup Form Route and Login after Signup Route are combined in one route because both are using the same path
router.route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login Form Route and Login after Login Route are combined in one route because both are using the same path
router.route("/login")
    .get(userController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), (userController.login));
//Signup Form Route
//router.get("/signup", userController.renderSignupForm);

//Login after Signup Route
//router.post("/signup",wrapAsync(userController.signup));

//Login Form Route
//router.get("/login", userController.renderLoginForm);

//Login after Login Route
//router.post("/login",saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), (userController.login));

//Logout Route
router.get("/logout", userController.logout);


module.exports = router;