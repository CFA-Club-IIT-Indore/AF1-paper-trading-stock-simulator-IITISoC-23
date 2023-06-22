const mongoose =require("./mongoose");
const session = require("express-session");
const passport =require("passport");
const passportLocalMongoose =require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new mongoose.Schema({
    username : String ,
    password : String ,
    googleId :String,
    githubId : String,
    facebookId : String,
})

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Trader = new mongoose.model("Trader" , userSchema);

passport.use(Trader.createStrategy());

module.exports = Trader;