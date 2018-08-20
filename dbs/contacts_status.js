var mongoose = require("mongoose");
var status = mongoose.Schema({
  business_id: {type: mongoose.Schema.Types.ObjectId, ref:"business"},
  name: {type: String},
});

module.exports = mongoose.model("Contact_Status", status);