require('dotenv').config() ;
const express= require("express");
const bodyParser = require ("body-parser");
const ejs =require ("ejs");
const cron = require('node-cron');
// const mongoose= require("./Database/mongoose");
const findOrCreate = require("mongoose-findorcreate");
const portfolioRouter = require("./routes/portfolio");
const registerRouter = require("./routes/register");
const loginRouter = require("./routes/login");
const googleAuthRouter = require("./routes/google_auth");
const githubAuthRouter = require("./routes/github_auth");
const facebookAuthRouter = require("./routes/facebook_auth");
const nse_niftyRouter = require("./routes/NSE/nifty");
const newsRouter = require("./routes/news");
const us_stocksRouter = require("./routes/stocks");
const add_stocksRouter = require("./routes/add_stock");
const buy_stockRouter = require("./routes/buy_stock");
const sell_stockRouter = require("./routes/sell_stock");
const shortsell_Router = require("./routes/short_sell");
const squareOFF_Router = require("./routes/square_OFF");
const live = require("./routes/live_update");
const load_data = require('./routes/load_data');

const app = express();
const PORT = 8000;

app.use(express.static("public"));
app.set('view engine'  ,'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use("/" , portfolioRouter);
app.use("/" , registerRouter);
app.use("/" , loginRouter);
app.use("/" , googleAuthRouter);
app.use("/" , githubAuthRouter);
app.use("/" , facebookAuthRouter);
app.use("/" , nse_niftyRouter);
app.use("/", newsRouter);
app.use("/", us_stocksRouter);
app.use("/", add_stocksRouter);
app.use("/", buy_stockRouter);
app.use("/", sell_stockRouter);
app.use("/", shortsell_Router);
app.use("/", squareOFF_Router);

var stocks_data;
cron.schedule('1,5,10,15,20,25,30,35,40,45,50,55 * * * *', async () => {
    live();
});


app.get("/" , async (req ,res)=>{
    res.render("home");
})

app.listen(PORT , ()=>{
    console.log("server running at http://localhost:8000");
})


