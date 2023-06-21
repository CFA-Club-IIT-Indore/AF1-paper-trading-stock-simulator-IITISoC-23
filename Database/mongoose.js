const mongoose = require('mongoose');
const db = mongoose.connection;
mongoose.connect(
    'mongodb://127.0.0.1:27017/stockDB'
);

module.exports = mongoose;