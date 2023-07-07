const express= require("express");
const axios = require("axios");

const router = express.Router();

var purse_amount =1000000;

router.get("/stock/:nse_code" , (req ,res) =>{
    var data ;
    async function getData(){
        const result =await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${req.params.nse_code}`);
        for(const [key ,value] of Object.entries(result.data.data)){
            console.log(value);
            data = value;   
        }
        res.render("add_stock" , {
            company_name: req.params.nse_code,
            price: Number(data.ltp),
            stock_code: req.params.nse_code ,
            purse: purse_amount,
            stock_type :"nse"
        }  )
    }
    getData();
})

module.exports =router;