const express= require("express");
const axios = require("axios");
// var spawn = require("child_process").spawn;

const router = express.Router();

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
router.get("/nse" , (req ,res)=>{
    
    async function getData(){
        const nifty_dataj = await axios.get(`https://api.stockmarketapi.in/api/v1/indexprice?token=${process.env.NSE_API_KEY}&indexcode==BANKNIFTY,NIFTY,FINNIFTY,NIFTY100,NIFTYMIDCAP,NIFTYAUTO,NIFTYFMCG,NIFTYIT,NIFTYMEDIA,NIFTYMETAL,NIFTYPHARMA,NIFTYPSUBANK,NIFTYPVTBANK,NIFTYREALTY`);
        // const stock_dataj = await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${stocks_string}`);
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
        res.render("NSE/nse" ,{stock_data : stocks , nifty_data : nifty_dataj.data.data} )
        // console.log(nifty_dataj.data.data);
        // console.log(stocks);
    }
    getData();

});

module.exports =router;

// const python = spawn('py' , ['\scripts\\nifty.py']);
// python.stdout.on("data" , (data)=>{
//     res.send(data.toString());
// });
// python.stderr.on('data', (data) => {
//     console.log(`error:${data}`);
// });
// python.stderr.on('close', () => {
//    console.log("Closed");
// });