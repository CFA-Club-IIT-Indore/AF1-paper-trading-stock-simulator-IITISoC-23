const express = require("express");
const mongoose = require("../Database/mongoose.js");
const session = require("express-session");
const passport =require("passport");
const passportLocalMongoose =require("passport-local-mongoose");

const router = express.Router();

router.use(session({
    secret: 'This app is for stocks trading mainly paper trading',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());
router.use(passport.session());

router.get("/portfolio" , (req ,res)=>{
    if(req.isAuthenticated()){
        res.render("portfolio");
    }else{
        res.redirect("/login");
    }
})

module.exports = router;

