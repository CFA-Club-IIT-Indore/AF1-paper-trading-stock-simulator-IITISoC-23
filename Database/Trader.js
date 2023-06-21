const mongoose =require("./mongoose");
const session = require("express-session");
const passport =require("passport");
const passportLocalMongoose =require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    username : String ,
    password : String 
})

userSchema.plugin(passportLocalMongoose);

const Trader = new mongoose.model("Trader" , userSchema);

passport.use(Trader.createStrategy());

module.exports = Trader;