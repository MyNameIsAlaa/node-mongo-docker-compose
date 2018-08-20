var Mongoose = require("mongoose");

var Business = Mongoose.Schema({
    name:{type:String},
    status:{type:String},
    currency:{type:String},
    logo:{type:String},
    plan_id:{type:Mongoose.Schema.Types.ObjectId, ref:"Plans"}
});

module.exports = Mongoose.model("Business", Business);