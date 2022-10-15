const mongoose = require('mongoose');
const crypto = require('crypto');


const userSchema = mongoose.Schema({
    username    : {type:String, require:true},
    phone       : {type:String,require:true},
    email       : {type:String,require:true},
    password    : {type:String,require:true},
    age         : {type:Number,require:false},
    active      : {type:Boolean,require:false,default:false},
    address     : {type:String,require:false , default:'chennai-68'},
    latestVisted: {type:String,require:false},
    loginStatus : {type:Boolean,require:false,default:true},
    duration    : {type:String,require:false}
})


module.exports = mongoose.model('userData',userSchema);