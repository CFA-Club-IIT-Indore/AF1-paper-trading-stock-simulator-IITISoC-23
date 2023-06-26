const mongoose =require("./mongoose");
const session = require("express-session");
const passport =require("passport");
const passportLocalMongoose =require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userDetails = require("./trader_details");

const userSchema = new mongoose.Schema(userDetails);

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const Trader = new mongoose.model("Trader" , userSchema);

passport.use(Trader.createStrategy());

module.exports = Trader;