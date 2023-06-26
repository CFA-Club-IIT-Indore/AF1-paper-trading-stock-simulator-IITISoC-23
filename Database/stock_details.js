const mongoose =require("./mongoose");
const passportLocalMongoose =require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");


const stock_data = {
    stock_type : String,
    symbol :String ,
    action : String ,
    quantity : mongoose.Decimal128,
    money_invested :mongoose.Decimal128,
    price : mongoose.Decimal128
}
const stockSchema = new mongoose.Schema(stock_data);

stockSchema.plugin(passportLocalMongoose);
stockSchema.plugin(findOrCreate);

const stock_type = {
    nse : [stock_data],
    bse : [stock_data],
    us_stocks : [stock_data]
}

const stock_type_schema = new mongoose.Schema(stock_type);
stock_type_schema.plugin(passportLocalMongoose);
stock_type_schema.plugin(findOrCreate);

module.exports = stock_type_schema;