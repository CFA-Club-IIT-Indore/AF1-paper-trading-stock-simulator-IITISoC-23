const express= require("express");
const mongoose= require("../Database/mongoose");
const Trader= require("../Database/Trader");
const session = require("express-session");
const passport =require("passport");

const router = express.Router();

router.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

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

router.get("/register" , (req ,res )=>{
    res.render("register");
})
router.post("/register" ,(req,res)=>{

    Trader.register({username: req.body.username ,email: req.body.email } , req.body.password , (err,user)=>{
        if(err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req ,res ,function(){
                res.redirect("/portfolio");
            });
        }
    })
});

module.exports = router;