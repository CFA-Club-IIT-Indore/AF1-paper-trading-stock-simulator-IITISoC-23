const stock_type_schema = require("./stock_details");
const mongoose =require("./mongoose");

const userDetails = {
    email : String ,
    username : {
        type : String ,
        // unique : true ,
        // required : [true , "Enter the username"]
    } ,
    password : String ,
    mobile_no : String ,
    address : String ,
    googleId :String,
    githubId : String,
    facebookId : String,
    amount : {
        type :  mongoose.Decimal128,
        default : 1000000
    },
    amount_invested : {
        type : mongoose.Decimal128 ,
        default : 0
    },
    current_amount:{
        type : mongoose.Decimal128,
        default :1000000
    },
    stocks_held : stock_type_schema ,
    stocks_sold_adv : stock_type_schema,
    history: stock_type_schema
}

module.exports = userDetails;