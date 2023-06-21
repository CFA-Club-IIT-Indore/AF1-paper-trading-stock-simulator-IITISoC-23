const express= require("express");
const mongoose= require("../Database/mongoose.js");
const Trader= require("../Database/Trader");
const session = require("express-session");
const passport =require("passport");

const router = express.Router();

router.use(session({
    secret: 'This app is for stocks trading mainly paper trading',
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

router.get("/login" , (req ,res)=>{
    res.render("login");
})
router.post("/login" ,(req ,res)=>{
    const trader = new Trader({
        username : req.body.username,
        password: req.body.password
    });
    req.login(trader , (err)=>{
        if(err){
            console.log(err);
            res.redirect("/login");
        }else{
            passport.authenticate("local")(req ,res , ()=>{
                res.redirect("/portfolio");
            });
        }
    });
})

module.exports = router;