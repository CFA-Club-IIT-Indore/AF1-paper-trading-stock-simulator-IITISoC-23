const express= require("express");
const Trader= require("../Database/Trader");
const session = require("express-session");
const passport =require("passport");
require('dotenv').config({path : "../.env"}) ;
const GitHubStrategy = require("passport-github2").Strategy;

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

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/github/portfolio"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    Trader.findOrCreate({ githubId: profile.id , username : `${profile._json.login}${profile.id[0]}${profile.id[3]}${profile.id[5]}` }, function (err, user) {
      return done(err, user);
    });
  }
));

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/portfolio', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/portfolio');
  });

module.exports =router;