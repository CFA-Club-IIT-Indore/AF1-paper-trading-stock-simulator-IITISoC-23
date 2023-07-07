const express =require("express");
const mongoose = require("../Database/mongoose");
const passport = require("passport");
const Trader = require("../Database/Trader");

const route =express.Router();

route.use(passport.initialize());
route.use(passport.session());

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



route.post("/buy", function (req, res) {
    
    var arr ,his;
    var purse_amount;

    Trader.find({username : req.user.username })
    .then((data)=>{


        if(!data[0].stocks_held){
            data[0].stocks_held = {us_stocks:[] ,bse : [] ,nse :[]};
            console.log(data[0]);
        }
        if(!data[0].history){
            data[0].history = {us_stocks:[] ,bse : [] ,nse :[]};
            console.log(data[0]);
        }


        if(req.body.stock_type === "us"){
            arr = data[0].stocks_held.us_stocks;
            his = data[0].history.us_stocks;
            purse_amount = parseFloat(data[0].amount.toString());
        }else if(req.body.stock_type === "nse"){
            arr = data[0].stocks_held.nse;
            his = data[0].history.nse;
            purse_amount = parseFloat(data[0].amount.toString());
        }else{
            arr = data[0].stocks_held.bse;
            his = data[0].history.bse;
            purse_amount = parseFloat(data[0].amount.toString());
        }

        var quant = parseFloat(req.body.numberOfStocks);
        var price = parseFloat(req.body.price)
        const dates = new Date();
        var date = dates.getDate().toString() + "-" + dates.getMonth().toString() +"-" + dates.getFullYear().toString();
        var time = dates.getHours().toString() + " : " + dates.getMinutes().toString() +" : " + dates.getSeconds().toString();

        if (purse_amount >= quant * price) {

            const targetObject = arr.findIndex(obj => obj.symbol === req.body.company_name);
            console.log(targetObject);

            if(targetObject>-1){
                arr[targetObject].quantity = parseFloat(arr[targetObject].quantity) + quant;
                arr[targetObject].money_invested = parseFloat(arr[targetObject].money_invested) + quant*price;
                arr[targetObject].price = parseFloat(arr[targetObject].money_invested)/parseFloat(arr[targetObject].quantity);
            }else{
                arr.push({
                    stock_type : req.body.stock_type,
                    symbol : req.body.company_name ,
                    action : "buy" ,
                    // date : date,
                    // time : time,
                    quantity : quant,
                    money_invested : quant*price,
                    price : req.body.price
                })
                his.push({
                    stock_type : req.body.stock_type,
                    symbol : req.body.company_name ,
                    action : "buy" ,
                    date : date,
                    time : time,
                    quantity : quant,
                    money_invested : quant*price,
                    price : req.body.price
                })
            }
            console.log(arr);
            console.log(his);
            purse_amount = purse_amount - quant * price;

            const tot_invest = parseFloat(data[0].amount_invested.toString()) + quant*price;
            if(req.body.stock_type === "us"){
                data[0].stocks_held.us_stocks = arr;
                data[0].history.us_stocks = his;
                Trader.updateOne({username : req.user.username} , {stocks_held : data[0].stocks_held ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }else if(req.body.stock_type === "nse"){
                data[0].stocks_held.nse = arr;
                data[0].history.nse = his;
                Trader.updateOne({username : req.user.username} , {stocks_held : data[0].stocks_held ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }else{
                data[0].stocks_held.bse = arr;
                data[0].history.bse = his;
                Trader.updateOne({username : req.user.username} , {stocks_held : data[0].stocks_held  ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }


            
          // mongoose add data
          res.render("success.ejs", {
            company: req.body.company_name,
            shares: quant,
            amt: purse_amount,
            price: price,
          });
        } else {
          res.render("failure.ejs", {});
        }
      });
    })
    
    
    


module.exports = route;