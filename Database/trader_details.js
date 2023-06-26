const stock_type_schema = require("./stock_details");

const userDetails = {
    email : String ,
    username : {
        type : String ,
        unique : true ,
        required : [true , "Enter the username"]
    } ,
    password : String ,
    mobile_no : String ,
    address : String ,
    googleId :String,
    githubId : String,
    facebookId : String,
    amount : {
        type : Number ,
        default : 1000000
    },
    amount_invested : {
        type : Number ,
        default : 0
    },
    stocks_held : stock_type_schema ,
    stocks_sold_adv : stock_type_schema,
    history: stock_type_schema
}

module.exports = userDetails;