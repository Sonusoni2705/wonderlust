const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose"); //this npm module define schema for & deals with authentication and authorization with monogDB

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
    //passport automatically include username and password that why here not define.
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);