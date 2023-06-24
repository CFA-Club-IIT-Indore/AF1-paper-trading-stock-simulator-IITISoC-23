const express = require("express");
const _ = require("lodash");
const bodyParser = require("body-parser");
const app = express();
// ------------------------------------------------------------------------------------
// const path = require("path")
// const __dirname = path.resolve();

// To add 50 more Stocks Names in stock_name.

// ------------------------------------------------------------------------------------

const stock_name = ["AAPL", "MSFT"];
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
    stock_prices = [];
    
// ------------------------------------------------------------------------------------
    // TO BE REWRITTEN USING API CALL


    /*API call for stocks in 'stock_name' array by stock names AND pushing incoming data to stock_prices array
.
.       push the info come in as a stringified JSON object
.
.
    */
    
    stock_prices.push({
        stock_price: Number(323.5),
        growth: Number(2),
    });
    stock_prices.push({
        stock_price: Number(223.5),
        growth: Number(0.4),
    });

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
    if (purse_amount >= (quantity * stock_prices[to_buy_stock].stock_price))
    {
        
        purse_amount=purse_amount-(quantity * stock_prices[to_buy_stock].stock_price);
        res.render("success.ejs", {
            company: stock_name[to_buy_stock],
            shares: quantity,
            amt: purse_amount,
            price: stock_prices[to_buy_stock].stock_price,
    });
    }
    else
    {
        res.render("failure.ejs",{})
        }
    
})
// ------------------------------------------------------------------------------------





// ------------------------------------------------------------------------------------
app.listen(3000, function () {
    console.log("Server started at port 3000");
});
// ------------------------------------------------------------------------------------
