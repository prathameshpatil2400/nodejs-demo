const mongoose = require('mongoose');
const { dbUrl } = require('./appConfig');

exports.connectDatabase = () =>{
    return mongoose.connect(dbUrl);
}