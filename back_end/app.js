const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const app = express();
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "ci9hic1r01qtqvvf2510ci9hic1r01qtqvvf251g"; // Replace this
const finnhubClient = new finnhub.DefaultApi();




// ------------------------------------------------------------------------------------
// currently 30 Major stocks






const stock_name = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Crporations" },
  { symbol: "GOOG", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name:"NVIDIA Corporation"},
  { symbol: "META", name:"Meta Platforms"},
  { symbol: "V", name:"Visa Inc."},
  { symbol: "WMT", name:"Walmart Inc."},
  { symbol: "JPM", name:"JP Morgan"},
  { symbol: "MA", name:"Mastercard Incorporated "},
  { symbol: "PG", name:"Proctar& Gamble Company"},
  { symbol: "ORCL", name:"Oracle Corporation"},
  { symbol: "KO", name:"Coca-Cola Company"},
  { symbol: "PEP", name:"PepsiCo, Inc."},
  { symbol: "ADBE", name:"Adobe, Inc."},
  { symbol: "MCD", name:"McDonald's Corporations"},
  { symbol: "TM", name:"Toyota Motor Corporations"},
  { symbol: "CSCO", name:"Cisco System, Inc."},
  { symbol: "ACN", name:"Accenture"},
  { symbol: "NFL", name:"Netflix, Inc."},
  { symbol: "ABT", name:"Abbott Laboratories"},
  { symbol: "NKE", name:"Nike, Inc."},
  { symbol: "TBB", name:"AT&T Inc."},
  { symbol: "DIS", name:"Walt Disney Company"},
  { symbol: "WFC", name:"Wells Fargo & Company"},
  { symbol: "TXN", name:"Texas Instruments Incorporated"},
  { symbol: "QCOM", name:"QUALCOMM Incorporated"},
  { symbol: "AXP", name:"American Express Company"},
  { symbol: "SONY", name:"Sony Group Corporations"},
];




var stock_prices = [];
var purse_amount = 1000000;



// ------------------------------------------------------------------------------------
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/get_stock.html");
});
// ------------------------------------------------------------------------------------
app.post("/stock", function (req, res) {
  //  clearing past Stock prices before UPDATING
  // stock_prices=[]
  // ------------------------------------------------------------------------------------
  for (var i = 0; i < stock_name.length; i++) {
    finnhubClient.quote(String(stock_name[i].symbol), (error, data, response) => {
      stock_prices.push((data));
      const dta = data;
      console.log(dta);
      stock_prices.push(dta);
    });
  }
  console.log("*" + stock_prices[0]);
  // ------------------------------------------------------------------------------------
  res.render("stock_price.ejs", {
    stocks: stock_name,
    price: stock_prices,
  });
  // ------------------------------------------------------------------------------------
});

var to_buy_stock;
// ------------------------------------------------------------------------------------
app.get("/stock/:word/:list_number", function (req, res) {
  to_buy_stock = parseInt(Number(req.params.list_number));
  res.render("add_stock.ejs", {
    company_name: req.params.word,
    price: stock_prices[parseInt(Number(req.params.list_number))].stock_price,
    stock_code: parseInt(Number(req.params.list_number)),
    purse: purse_amount,
  });
});
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
app.post("/buy", function (req, res) {
  var quantity = req.body.numberOfStocks;
  if (purse_amount >= quantity * stock_prices[to_buy_stock].stock_price) {
    purse_amount =
      purse_amount - quantity * stock_prices[to_buy_stock].stock_price;
    res.render("success.ejs", {
      company: stock_name[to_buy_stock],
      shares: quantity,
      amt: purse_amount,
      price: stock_prices[to_buy_stock].stock_price,
    });
  } else {
    res.render("failure.ejs", {});
  }
});
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
app.listen(3000, function () {
  console.log("Server started at port 3000");
});
// ------------------------------------------------------------------------------------
