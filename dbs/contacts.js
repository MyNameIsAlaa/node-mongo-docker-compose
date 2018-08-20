var Mongoose = require("mongoose");

var Contacts = Mongoose.Schema({
  business_id: {type: Mongoose.Schema.Types.ObjectId, ref:"Business", required: true},
  user_id: {type: Mongoose.Schema.Types.ObjectId, ref:"Users", required: true},
  first_name: {type: String , required: true},
  last_name: {type: String},
  email: {type: String},
  phone: {type: String},
  note: {type: String},
  address : {type: String},
  city : {type: String},
  state : {type: String},
  country: {type: String},
  zipcode: {type: String},
  source: {type: Mongoose.Schema.Types.ObjectId, ref:"Contact_Sources"},
  status: {type: Mongoose.Schema.Types.ObjectId, ref:"Contact_Status"}
});

module.exports = Mongoose.model("Contacts", Contacts);