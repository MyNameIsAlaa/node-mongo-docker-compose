var Mongoose = require("mongoose");
var deepPopulate = require("mongoose-deep-populate")(Mongoose);

var Users = Mongoose.Schema({
    email:{type:String, required:true},
    password:{type:String, required:true},
    first_name:{type:String, required:true},
    last_name:{type:String, required:true},
    level:{
        type:String, 
        required:true,
        enum: ["admin", "user"],
        default: "user"
    },
    business_id:{type:Mongoose.Schema.Types.ObjectId, ref:'Business'}
});

Users.plugin(deepPopulate);

module.exports = Mongoose.model("Users", Users);