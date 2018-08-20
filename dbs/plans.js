var Mongoose = require("mongoose");

var Plans = Mongoose.Schema({
    name:{type:String, required:true},
    price:{type:Number, required:true},
    users_limit:{type:Number, required:true},
    contacts_limit:{type:Number, required:true},
    storage_limit:{type:Number, required:true},
});

module.exports = Mongoose.model("Plans", Plans);