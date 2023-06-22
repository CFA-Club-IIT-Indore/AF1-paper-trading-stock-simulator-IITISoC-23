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

app.get("/" , (req ,res)=>{
    res.render("home");
})

app.listen(PORT , ()=>{
    console.log("server running at http://localhost:8000");
})