const Trader = require("../Database/Trader");
const axios= require("axios");
var finnhub = require("finnhub");
var api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "citr851r01qu27mo2udgcitr851r01qu27mo2ue0"; // Replace this
const finnhubClient = new finnhub.DefaultApi();

// <------------------------------------------------------------------------------------------------------>
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
  
  const NSEsymbols1 = [
    'ADANIPORTS','ASIANPAINT','AXISBANK','APOLLOHOSP' ,'ADANIENT', 'BAJAJ-AUTO', 'BAJFINANCE', 'BAJAJFINSV',       'BPCL', 'BHARTIARTL',      'CIPLA', 
     "COALINDIA", 'DIVISLAB' ,   "DRREDDY",  'EICHERMOT',    'GRASIM',    "HCLTECH", 'HDFC' ,  "HDFCBANK", "HEROMOTOCO",   'HINDALCO', 
     'HINDUNILVR',       'HDFCLIFE',  'INFY' ,   'ITC',  'ICICIBANK', 'INDUSINDBK',   'JSWSTEEL',  
     'KOTAKBANK',         'LT',     'MARUTI', 'NESTLEIND' ,     'NTPC',       'ONGC',  'POWERGRID',   'RELIANCE',       'SBIN',  'SBILIFE',
    'TCS', 'TATAMOTORS', 'TATACONSUM' , 'TATASTEEL',      'TECHM',      'TITAN',        'UPL', 'ULTRACEMCO',     
      'WIPRO'
    ]

  var stock_prices = new Array(stock_name.length);
  stock_prices.fill({});

    var nse_stocks = [];

  async function getStockPrice(stock) {
    if(stock.symbol === "TXN"){

    }
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

  async function exchangeRate(){
    var data = axios.get(`https://exchange-rates.abstractapi.com/v1/convert?base=usd&target=inr&api_key=${process.env.EX_RATE_API_KEY}`)
    return data;
  }

  async function getData(){
    for(var i=0 ;i<NSEsymbols1.length ; i++){
      var data =await axios.get(`https://api.stockmarketapi.in/api/v1/getprices?token=${process.env.NSE_API_KEY}&nsecode=${NSEsymbols1[i]}`);
      console.log(data.data.data);
    //   for(const [key ,value] of Object.entries(data.data.data)){
    //     nse_stocks.push(value);
    //   };
    };
  }
  
  const load_data = async ()=>{
    
    console.log("hello");
    // nse_stocks = await getData();
    // console.log(nse_stocks);
    // const res = await getData();
    // console.log(nse_stocks);
  
    ex_rate = await exchangeRate();
    console.log(ex_rate.data.exchange_rate);
    ex_rate = ex_rate.data.exchange_rate;     
    stock_prices = await Promise.all(stock_name.map(getStockPrice));
    return stock_prices;
  }

  module.exports = load_data;