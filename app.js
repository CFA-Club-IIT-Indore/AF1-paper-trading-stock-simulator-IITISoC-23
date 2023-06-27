require('dotenv').config() ;
const express= require("express");
const bodyParser = require ("body-parser");
const ejs =require ("ejs");
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
app.use("/", newsRouter)
app.use("/", us_stocksRouter)
app.use("/", add_stocksRouter)

app.get("/" , (req ,res)=>{
    res.render("home");
})

app.listen(PORT , ()=>{
    console.log("server running at http://localhost:8000");
})