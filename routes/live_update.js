const Trader = require("../Database/Trader");
const axios= require("axios");
const finnhub = require("finnhub");
const api_key = finnhub.ApiClient.instance.authentications["api_key"];
api_key.apiKey = "ci9hic1r01qtqvvf2510ci9hic1r01qtqvvf251g"; // Replace this
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
      for(const [key ,value] of Object.entries(data.data.data)){
        nse_stocks.push(value);
      };
    };
  }
  
  const live = async ()=>{
    
    console.log("hello");
    // nse_stocks = await getData();
    // console.log(nse_stocks);
    const res = await getData();
    // console.log(nse_stocks);
  
    ex_rate = await exchangeRate();
    console.log(ex_rate.data.exchange_rate);
    ex_rate = ex_rate.data.exchange_rate;     
    stock_prices = await Promise.all(stock_name.map(getStockPrice));
    console.log(stock_prices);
  

    Trader.find()
    .then((data)=>{
      console.log(data);
        for(var i=0 ;i< data.length ; i++ ){
          var invested = parseFloat(data[i].amount_invested);
          var purse = parseFloat(data[i].amount);
          var arr = data[i].stocks_held.nse;
          var his_nse = data[i].history.nse;
          var his_us = data[i].history.us_stocks;
          for(var j = 0 ;j<arr.length ; j++){
            const dates = new Date();
            var date = dates.getDate().toString() + "-" + dates.getMonth().toString() +"-" + dates.getFullYear().toString();
            var time = dates.getHours().toString() + " : " + dates.getMinutes().toString() +" : " + dates.getSeconds().toString();
            const targetObject = NSEsymbols1.findIndex(obj => obj === arr[j].symbol );
            console.log(targetObject , NSEsymbols1[targetObject]);
            if(parseFloat(nse_stocks[targetObject].ltp) <= parseFloat(arr[j].stop_loss)){
              invested = invested - parseFloat(arr[j].money_invested);
              purse = purse + parseFloat(arr[j].quantity)*parseFloat(arr[j].stop_loss);

              //<--------------------------------------------------------->
              var temp = arr[targetObject];
              temp.action = "sell";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(arr[j].stop_loss);
              his_nse.push(temp);
              //<--------------------------------------------------------->

              arr.splice(targetObject , 1);
            }else if(parseFloat(nse_stocks[targetObject].ltp) >= parseFloat(arr[j].stop_profit)){
              invested = invested - parseFloat(arr[j].money_invested);
              purse = purse + parseFloat(arr[j].quantity)*parseFloat(arr[j].stop_profit);
              
              //<--------------------------------------------------------->
              var temp = arr[targetObject];
              temp.action = "sell";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(arr[j].stop_profit);
              his_nse.push(temp);
              //<--------------------------------------------------------->
              
              arr.splice(targetObject , 1);
            }
          }
          var us_arr = data[i].stocks_held.us_stocks ;
          for(var j = 0 ;j<us_arr.length ; j++){
            const targetObject = stock_name.findIndex(obj => obj.symbol === us_arr[j].symbol );
            console.log(targetObject , stock_name[targetObject].symbol);
            if(parseFloat(stock_prices[targetObject].c)*parseFloat(ex_rate) <= parseFloat(us_arr[j].stop_loss)){
              invested = invested - parseFloat(us_arr[j].money_invested);
              purse = purse + parseFloat(us_arr[j].quantity)*parseFloat(us_arr[j].stop_loss);

              //<--------------------------------------------------------->
              var temp = us_arr[targetObject];
              temp.action = "sell";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(us_arr[j].stop_loss);
              his_us.push(temp);
              //<--------------------------------------------------------->

              us_arr.splice(targetObject , 1);
            }else if(parseFloat(stock_prices[targetObject].c)*parseFloat(ex_rate) >= parseFloat(us_arr[j].stop_profit)){
              invested = invested - parseFloat(us_arr[j].money_invested);
              purse = purse + parseFloat(us_arr[j].quantity)*parseFloat(us_arr[j].stop_profit);

              //<--------------------------------------------------------->
              var temp = us_arr[targetObject];
              temp.action = "sell";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(us_arr[j].stop_profit);
              his_us.push(temp);
              //<--------------------------------------------------------->

              us_arr.splice(targetObject , 1);
            }
          }
          
          data[i].stocks_held.nse = arr;
          data[i].stocks_held.us_stocks = us_arr;

          var arr = data[i].stocks_sold_adv.nse;
          for(var j = 0 ;j<arr.length ; j++){
            const targetObject = NSEsymbols1.findIndex(obj => obj === arr[j].symbol );
            console.log(targetObject , NSEsymbols1[targetObject]);
            if(parseFloat(nse_stocks[targetObject].ltp) >= parseFloat(arr[j].stop_loss)){
              invested = invested - parseFloat(arr[j].money_invested);
              purse = purse + parseFloat(arr[j].quantity)*parseFloat(arr[j].stop_loss - arr[j].price);

              //<--------------------------------------------------------->
              var temp = arr[targetObject];
              temp.action = "square off";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(arr[j].stop_loss);
              his_us.push(temp);
              //<--------------------------------------------------------->

              arr.splice(targetObject , 1);
            }else if(parseFloat(nse_stocks[targetObject].ltp) <= parseFloat(arr[j].stop_profit)){
              invested = invested - parseFloat(arr[j].money_invested);
              purse = purse + parseFloat(arr[j].quantity)*parseFloat(arr[j].price - arr[j].stop_profit);

              //<--------------------------------------------------------->
              var temp = arr[targetObject];
              temp.action = "square off";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(arr[j].stop_profit);
              his_us.push(temp);
              //<--------------------------------------------------------->

              arr.splice(targetObject , 1);
            }
          }
          var us_arr = data[i].stocks_sold_adv.us_stocks ;
          for(var j = 0 ;j<us_arr.length ; j++){
            const targetObject = stock_name.findIndex(obj => obj.symbol === us_arr[j].symbol );
            console.log(targetObject , stock_name[targetObject].symbol);
            if(parseFloat(stock_prices[targetObject].c)*parseFloat(ex_rate) >= parseFloat(us_arr[j].stop_loss - us_arr[j].price)){
              invested = invested - parseFloat(us_arr[j].money_invested);
              purse = purse + parseFloat(us_arr[j].quantity)*parseFloat(us_arr[j].stop_loss);

              //<--------------------------------------------------------->
              var temp = us_arr[targetObject];
              temp.action = "square off";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(us_arr[j].stop_loss);
              his_us.push(temp);
              //<--------------------------------------------------------->

              us_arr.splice(targetObject , 1);
            }else if(parseFloat(stock_prices[targetObject].c)*parseFloat(ex_rate) <= parseFloat(us_arr[j].price - us_arr[j].stop_profit)){
              invested = invested - parseFloat(us_arr[j].money_invested);
              purse = purse + parseFloat(us_arr[j].quantity)*parseFloat(us_arr[j].stop_loss);

              //<--------------------------------------------------------->
              var temp = us_arr[targetObject];
              temp.action = "square off";
              temp.date = date; 
              temp.time = time;
              temp.price = parseFloat(us_arr[j].stop_profit);
              his_us.push(temp);
              //<--------------------------------------------------------->

              us_arr.splice(targetObject , 1);
            }
          }

          data[i].stocks_sold_adv.nse = arr;
          data[i].stocks_sold_adv.us_stocks = us_arr;
          data[i].history.nse = his_nse;
          data[i].history.us_stocks = his_us;

          Trader.updateOne({username : data[i].username} , {stocks_held : data[i].stocks_held  ,amount : purse , amount_invested : invested , stocks_sold_adv : data[i].stocks_sold_adv , history : data[i].history});

        }
    }).catch((err)=>{
        console.log(err);
    })
    
};

module.exports = live;

