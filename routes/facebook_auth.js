const express= require("express");
const Trader= require("../Database/Trader");
const session = require("express-session");
const passport =require("passport");
require('dotenv').config({path : "../.env"}) ;
const FacebookStrategy = require("passport-facebook").Strategy;

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

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:8000/auth/facebook/portfolio"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    Trader.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/portfolio',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/portfolio');
  });
module.exports =router;