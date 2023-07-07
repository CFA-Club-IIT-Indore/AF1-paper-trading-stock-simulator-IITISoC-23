const express= require("express");
const Trader= require("../Database/Trader");
const session = require("express-session");
const passport =require("passport");
require('dotenv').config({path : "../.env"}) ;
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, username: user.username });
    });
  });
  
  passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/portfolio"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    Trader.findOrCreate({ googleId: profile.id , username : `${profile.name.givenName}${profile.id[0]}7${profile.id[2]}`}, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/auth/google', 
  passport.authenticate('google', {scope : ['profile']})
);


router.get('/auth/google/portfolio', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/portfolio');
  });

module.exports =router;