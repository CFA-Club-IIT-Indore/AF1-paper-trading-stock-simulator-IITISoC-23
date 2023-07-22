const express = require("express");
const mongoose = require("../Database/mongoose.js");
const session = require("express-session");
const passport =require("passport");
const Trader = require("../Database/Trader.js");
const passportLocalMongoose =require("passport-local-mongoose");
const { stocks_held, amount_invested } = require("../Database/trader_details.js");
const load_data = require('./load_data.js');
var stocks = require("../app.js");
const axios = require("axios");
const cron = require('node-cron');

const router = express.Router();

router.use(session({
    secret: 'This app is for stocks trading mainly paper trading',
    resave: false,
    saveUninitialized: false
}));

var stock_prices;
router.use(passport.initialize());
router.use(passport.session());

cron.schedule('2,3,4,6,7,8,9,11,12,13,14,16,17,18,19,21,22,23,24,26,27,28,29,31,32,33,34,36,37,38,39,41,42,43,44,46,47,48,49,51,52,53,54,56,57,58,59 * * * *', async () => {
    stock_prices = await load_data();
            console.log(stock_prices);
});

router.get("/portfolio" , (req ,res)=>{
    if(req.isAuthenticated()){
        Trader.find({username : req.user.username })
        .then(async (data)=>{
        
            ex_rate = await exchangeRate();
            ex_rate = ex_rate.data.exchange_rate;
            // console.log(data[0].stocks_held);
            if(!data[0].stocks_held){res.render("portfolio" , {stocks_held :{nse :[] ,us_stocks:[]} ,amount : parseFloat(data[0].amount.toString()),
            stocks_sold_adv :{nse :[] ,us_stocks:[]},
            amount_invested : parseFloat(data[0].amount_invested.toString())})}

            var ss_arr =  [];
            var sh_arr =  [];
            data[0].stocks_sold_adv.us_stocks.map((obj)=>{
                console.log(obj);
                const targetObject = stock_name.findIndex(obj1 => obj1.symbol === obj.symbol );
                console.log(stock_name[targetObject]);
               ss_arr.push ((parseFloat((stock_prices[targetObject].c))*ex_rate).toPrecision(6));
            });
            ss_arr.map((obj)=>{
                console.log(obj);
            });
            data[0].stocks_held.us_stocks.map((obj)=>{
                console.log(obj);
                const targetObject = stock_name.findIndex(obj1 => obj1.symbol === obj.symbol );
                console.log(stock_name[targetObject]);
               sh_arr.push ((parseFloat((stock_prices[targetObject].c))*ex_rate).toPrecision(6));
            });
            sh_arr.map((obj)=>{
                console.log(obj);
            });

            res.render("portfolio" ,
             {  
                stocks_sold_adv : data[0].stocks_sold_adv,
                stocks_held : data[0].stocks_held ,
                sh_arr : sh_arr,
                ss_arr:ss_arr, 
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

var ex_rate ;
router.post("/stock", async function (req, res) {
  
    console.log(stock_prices);
    ex_rate = await exchangeRate();
    console.log(ex_rate.data.exchange_rate);
    ex_rate = ex_rate.data.exchange_rate;
  
    async function getData(){
    res.render("stock_price.ejs", {
      ex_rate : ex_rate,
      stocks: stock_name,
      price: stock_prices,
      // stock_data : stocks,
    });
  }
  getData();
  
    
  });

  async function exchangeRate(){
    var data = axios.get(`https://exchange-rates.abstractapi.com/v1/convert?base=usd&target=inr&api_key=${process.env.EX_RATE_API_KEY}`)
    return data;
  }
  

  router.get("/stock/:word/:list_number", function (req, res) {
    // console.log(Number(stock_prices[parseInt(Number(req.params.list_number))].c));
    to_buy_stock = parseInt(Number(req.params.list_number));
    res.render("add_stock.ejs", {
      company_name: req.params.word,
      price: parseFloat((stock_prices[parseInt(Number(req.params.list_number))].c))*ex_rate,
      stock_code: parseInt(Number(req.params.list_number)),
      stock_type : "us"
    });
  });

module.exports = router;




















const stock_name = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corporations" },
    { symbol: "GOOG", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com" },
    { symbol: "TSLA", name: "Tesla, Inc." },
    { symbol: "NVDA", name: "NVIDIA Corporation" },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "V", name: "Visa Inc." },
    { symbol: "WMT", name: "Walmart Inc." },
    { symbol: "JPM", name: "JP Morgan" },
    { symbol: "MA", name: "Mastercard Incorporated " },
    { symbol: "PG", name: "Proctar& Gamble Company" },
    { symbol: "ORCL", name: "Oracle Corporation" },
    { symbol: "KO", name: "Coca-Cola Company" },
    { symbol: "PEP", name: "PepsiCo, Inc." },
    { symbol: "ADBE", name: "Adobe, Inc." },
    { symbol: "MCD", name: "McDonald's Corporations" },
    { symbol: "TM", name: "Toyota Motor Corporations" },
    { symbol: "CSCO", name: "Cisco System, Inc." },
    { symbol: "ACN", name: "Accenture" },
    { symbol: "NFLX", name: "Netflix, Inc." },
    { symbol: "ABT", name: "Abbott Laboratories" },
    { symbol: "NKE", name: "Nike, Inc." },
    { symbol: "TBB", name: "AT&T Inc." },
    { symbol: "DIS", name: "Walt Disney Company" },
    { symbol: "WFC", name: "Wells Fargo & Company" },
    { symbol: "TXN", name: "Texas Instruments Incorporated" },
    { symbol: "QCOM", name: "QUALCOMM Incorporated" },
    { symbol: "AXP", name: "American Express Company" },
    { symbol: "SONY", name: "Sony Group Corporations" },
    { symbol: "GILD", name: "Gilead Sciences, Inc." },
    { symbol: "ADP", name: "Automatic Data Processing, Inc.	" },
    { symbol: "ADI", name: "Analog Devices, Inc.	" },
    { symbol: "VRTX", name: "Vertex Pharmaceuticals Incorporated	" },
    { symbol: "LRCX", name: "Lam Research Corporation	" },
    { symbol: "PYPL", name: "PayPal Holdings, Inc.	" },
    { symbol: "REGN	", name: "Regeneron Pharmaceuticals, Inc.	" },
    { symbol: "EQIX", name: "EQIX" },
    { symbol: "PANW", name: "Palo Alto Networks, Inc.	" },
    { symbol: "ATVI", name: "Activision Blizzard, Inc.	" },
    { symbol: "MU", name: "Micron Technology, I" },
    { symbol: "SNPS", name: "Synopsys, Inc." },
    { symbol: "CME", name: "CME Group Inc." },
    { symbol: "CSX", name: "CSX Corporation" },
    { symbol: "NTES", name: "NetEase, Inc." },
    { symbol: "FTNT", name: "Fortinet, Inc." },
    { symbol: "CHTR", name: "Charter Communicati" },
    { symbol: "MELI	", name: "MercadoLibre, Inc." },
    { symbol: "MAR", name: "Marriott Internationa" },
    { symbol: "JD", name: "JD.com, Inc." },
  ];