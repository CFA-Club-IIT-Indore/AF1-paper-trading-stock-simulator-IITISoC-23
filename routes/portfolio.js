const express = require("express");
const mongoose = require("../Database/mongoose.js");
const session = require("express-session");
const passport =require("passport");
const Trader = require("../Database/Trader.js");
const passportLocalMongoose =require("passport-local-mongoose");
const { stocks_held, amount_invested } = require("../Database/trader_details.js");

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
        Trader.find({username : req.user.username })
        .then((data)=>{
            // console.log(data[0].stocks_held);
            if(!data[0].stocks_held){res.render("portfolio" , {stocks_held :{nse :[] ,us_stocks:[]} ,amount : parseFloat(data[0].amount.toString()),
            amount_invested : parseFloat(data[0].amount_invested.toString())})}
            res.render("portfolio" ,
             {  
                stocks_held : data[0].stocks_held , 
                amount : parseFloat(data[0].amount.toString()),
                amount_invested : parseFloat(data[0].amount_invested.toString())
            });
        })
        .catch((err)=>{
            console.log(err);
        })
        console.log(req.user);
    }else{
        res.redirect("/login");
    }
})

module.exports = router;

