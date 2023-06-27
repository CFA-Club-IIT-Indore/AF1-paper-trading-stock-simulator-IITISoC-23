
const express= require("express");
const path = require("path");
const axios = require("axios");
const router = express.Router();
router.get("/news",async (req,res)=>{
    res.render("news");
})

module.exports= router;