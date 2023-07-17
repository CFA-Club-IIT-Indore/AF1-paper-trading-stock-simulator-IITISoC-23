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



route.post("/short_sell", function (req, res) {
    
    var arr ,his;
    var purse_amount;

    Trader.find({username : req.user.username })
    .then((data)=>{

        var stop_loss1;
        var stop_profit1;
        if(!req.body.stop_loss1){
            stop_loss1 = 100000000;
        }else{
            stop_loss1 = parseFloat(req.body.price) + parseFloat(req.body.stop_loss1);
        }
        if(!req.body.stop_profit1){
            stop_profit1 = -1;
        }else{
            stop_profit1 = parseFloat(req.body.price) - parseFloat(req.body.stop_profit1);
        }

        if(!data[0].stocks_sold_adv){
            data[0].stocks_sold_adv = {us_stocks:[] ,bse : [] ,nse :[]};
            console.log(data[0]);
        }
        if(!data[0].history){
            data[0].history = {us_stocks:[] ,bse : [] ,nse :[]};
            console.log(data[0]);
        }


        if(req.body.stock_type === "us"){
            arr = data[0].stocks_sold_adv.us_stocks;
            his = data[0].history.us_stocks;
            purse_amount = parseFloat(data[0].amount.toString());
        }else if(req.body.stock_type === "nse"){
            arr = data[0].stocks_sold_adv.nse;
            his = data[0].history.nse;
            purse_amount = parseFloat(data[0].amount.toString());
        }else{
            arr = data[0].stocks_sold_adv.bse;
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
                arr[targetObject].stop_loss = stop_loss1 ;
                arr[targetObject].stop_profit = stop_profit1 ;
            }else{
                arr.push({
                    stock_type : req.body.stock_type,
                    symbol : req.body.company_name ,
                    action : "short sell" ,
                    // date : date,
                    // time : time,
                    quantity : quant,
                    money_invested : quant*price,
                    price : req.body.price,
                    stop_loss : parseFloat(stop_loss1),
                    stop_profit : parseFloat(stop_profit1)
                })
                his.push({
                    stock_type : req.body.stock_type,
                    symbol : req.body.company_name ,
                    action : "short sell" ,
                    date : date,
                    time : time,
                    quantity : quant,
                    money_invested : quant*price,
                    price : req.body.price,
                    stop_loss : parseFloat(stop_loss1),
                    stop_profit : parseFloat(stop_profit1)
                })
            }
            console.log(arr);
            console.log(his);
            purse_amount = purse_amount - quant * price;

            const tot_invest = parseFloat(data[0].amount_invested.toString()) + quant*price;
            if(req.body.stock_type === "us"){
                data[0].stocks_sold_adv.us_stocks = arr;
                data[0].history.us_stocks = his;
                Trader.updateOne({username : req.user.username} , {stocks_sold_adv : data[0].stocks_sold_adv ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }else if(req.body.stock_type === "nse"){
                data[0].stocks_sold_adv.nse = arr;
                data[0].history.nse = his;
                Trader.updateOne({username : req.user.username} , {stocks_sold_adv : data[0].stocks_sold_adv ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }else{
                data[0].stocks_sold_adv.bse = arr;
                data[0].history.bse = his;
                Trader.updateOne({username : req.user.username} , {stocks_sold_adv : data[0].stocks_sold_adv  ,amount : purse_amount , amount_invested : tot_invest , history : data[0].history})
                .then((response)=>{
                    console.log(response.acknowledged);
                })
            }


            
          // mongoose add data
          res.render("short_sell_success.ejs", {
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