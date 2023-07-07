const express =require("express");
const mongoose = require("../Database/mongoose");
const passport = require("passport");
const Trader = require("../Database/Trader");
const axios= require("axios");
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "ci9hic1r01qtqvvf2510ci9hic1r01qtqvvf251g"; // Replace this
const finnhubClient = new finnhub.DefaultApi();

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

async function getStockPrice(stock) {
    return new Promise((resolve, reject) => {
      finnhubClient.quote(stock, (error, data, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
  async function getdata(stock){
    var data = await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${stock}`);
    return data;
  }

route.post("/sell_stock" , (req ,res)=>{
    Trader.find({username : req.user.username })
    .then(async function(data){
      var arr ,his;
        var curr_price;
        if(req.body.stock_type === "us"){
            arr = data[0].stocks_held.us_stocks;
            his = data[0].history.us_stocks;
            const prices = await getStockPrice(req.body.code);
            curr_price = prices.c;
        } 
        else if(req.body.stock_type === "nse"){
            arr = data[0].stocks_held.nse;
            his = data[0].history.nse;
            var stock_data = await getdata(req.body.code);
            for(const [key ,value] of Object.entries(stock_data.data.data)){
                curr_price= value.ltp;
            }
        }
        console.log(curr_price);
        var quantity = parseFloat(req.body.quantity);
        // console.log(curr_price , arr ,his);
        const targetObject = arr.findIndex(obj => obj.symbol === req.body.code );
        if(parseFloat(arr[targetObject].quantity) === parseFloat(req.body.quantity)){
          arr.splice(targetObject ,1);
        }else{
          arr[targetObject].quantity = parseFloat(arr[targetObject].quantity) - quantity;
          arr[targetObject].money_invested = parseFloat(arr[targetObject].money_invested) - quantity*parseFloat(arr[targetObject].price);
        }

        // <------------------------------------------------------------------------------------------------------------------------------------------->
        const dates = new Date();
        var date = dates.getDate().toString() + "-" + dates.getMonth().toString() +"-" + dates.getFullYear().toString();
        var time = dates.getHours().toString() + " : " + dates.getMinutes().toString() +" : " + dates.getSeconds().toString();
        his.push({
          stock_type : req.body.stock_type,
          symbol : req.body.code ,
          action : "sell" ,
          date : date,
          time : time,
          quantity : quantity,
          money_invested : quantity*curr_price,
          price : curr_price
        })
        // <------------------------------------------------------------------------------------------------------------------------------------------->

        var purse_amount = parseFloat(data[0].amount) + quantity*curr_price;
       var tot_invest =parseFloat(data[0].amount_invested) - quantity*parseFloat(arr[targetObject].price); 
        // console.log(purse_amount , tot_invest);
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

    res.redirect("/portfolio");
      })
})

module.exports = route;