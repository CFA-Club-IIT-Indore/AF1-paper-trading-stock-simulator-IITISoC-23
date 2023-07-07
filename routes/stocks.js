const express = require("express");
const _ = require("lodash");
const axios = require("axios");
const bodyParser = require("body-parser");
const route = express.Router();
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "ci9hic1r01qtqvvf2510ci9hic1r01qtqvvf251g"; // Replace this
const finnhubClient = new finnhub.DefaultApi();

// ------------------------------------------------------------------------------------
// currently 30 Major stocks

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
];

var stock_prices = new Array(stock_name.length);
stock_prices.fill({});
var purse_amount = 1000000;

// ------------------------------------------------------------------------------------
// route.use(bodyParser.urlencoded({ extended: true }));
// route.use(express.static("public"));
// route.get("/", function (req, res) {
//   res.sendFile(__dirname + "/views/get_stock.html");
// });
// ------------------------------------------------------------------------------------

const NSEsymbols1 = [
  'ADANIPORTS','ASIANPAINT','AXISBANK','APOLLOHOSP' ,'ADANIENT', 'BAJAJ-AUTO', 'BAJFINANCE', 'BAJAJFINSV',       'BPCL', 'BHARTIARTL',      'CIPLA', 
   "COALINDIA", 'DIVISLAB' ,   "DRREDDY",  'EICHERMOT',    'GRASIM',    "HCLTECH", 'HDFC' ,  "HDFCBANK", "HEROMOTOCO",   'HINDALCO', 
   'HINDUNILVR',       'HDFCLIFE',  'INFY' ,   'ITC',  'ICICIBANK', 'INDUSINDBK',   'JSWSTEEL',  
  ]
  const NSEsymbols2 =[ 'KOTAKBANK',         'LT',     'MARUTI', 'NESTLEIND' ,     'NTPC',       'ONGC',  'POWERGRID',   'RELIANCE',       'SBIN',  'SBILIFE',
  'TCS', 'TATAMOTORS', 'TATACONSUM' , 'TATASTEEL',      'TECHM',      'TITAN',        'UPL', 'ULTRACEMCO',     
    'WIPRO' ]
  const stocks_string1 = NSEsymbols1.join(',');
  const stocks_string2 = NSEsymbols2.join(',');

route.post("/stock", async function (req, res) {
  stock_prices = await Promise.all(stock_name.map(getStockPrice));

  console.log(stock_prices);

  async function getData(){
  var stock_dataj = await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${stocks_string1}`);
  stock_dataj =stock_dataj.data.data;
  var stocks =[];
  for(const [key ,value] of Object.entries(stock_dataj)){
      stocks.push(value);
  }
  stock_dataj = await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${stocks_string2}`);
  stock_dataj =stock_dataj.data.data;
  for(const [key ,value] of Object.entries(stock_dataj)){
      stocks.push(value);
  }
  console.log(stocks);
  res.render("stock_price.ejs", {
    stocks: stock_name,
    price: stock_prices,
    stock_data : stocks,
  });
}
getData();

  
});

async function getStockPrice(stock) {
  return new Promise((resolve, reject) => {
    finnhubClient.quote(stock.symbol, (error, data, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}


var to_buy_stock;
// ------------------------------------------------------------------------------------
route.get("/stock/:word/:list_number", function (req, res) {
  console.log(Number(stock_prices[parseInt(Number(req.params.list_number))].c));
  to_buy_stock = parseInt(Number(req.params.list_number));
  res.render("add_stock.ejs", {
    company_name: req.params.word,
    price: Number(stock_prices[parseInt(Number(req.params.list_number))].c),
    stock_code: parseInt(Number(req.params.list_number)),
    purse: purse_amount,
    stock_type : "us"
  });
});
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
module.exports =route;
// ------------------------------------------------------------------------------------