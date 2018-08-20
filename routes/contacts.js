var express = require("express");
var mongoose = require("mongoose");
var Router = express.Router();
var JWT = require("jsonwebtoken");
var passport = require("passport");
var config = require("../config");
var Contacts = require("../dbs/contacts.js");



Router.get("/", passport.authenticate("jwt", { session: false }), (req, res)=>{
    Contacts.find({business_id: req.user.business_id }).exec((error, results)=>{
      if(error) return res.json("ERROR");
      return res.json(results);
    })
});


Router.post("/", passport.authenticate("jwt", { session: false }), (req, res)=>{
 if(! req.body.first_name) return res.json("first_name is required!");
 var NewContact = new Contacts({
    first_name: req.body.first_name,
    business_id: req.user.business_id,  
    user_id: req.user._id
   }).save((err, contact)=>{
   if(err) return res.json("ERROR!");
     return res.json(contact)
   })
});

Router.put("/:id", passport.authenticate("jwt", { session: false }), (req, res)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid!");
    Contacts.findByIdAndUpdate(req.params.id, req.body, {new: true}).exec((error, contact)=>{
        if(error) return res.json("ERROR:" + error);
        res.json(contact)
    })
});

Router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res)=>{
 if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid!");
 Contacts.findByIdAndRemove(req.params.id).exec((error, contact)=>{
     if(error) return res.json("ERROR!")
     if(contact) return res.json("SUCCESS!")
     if(! contact) return res.json("NOT FOUND!")
 })
});


module.exports = Router;