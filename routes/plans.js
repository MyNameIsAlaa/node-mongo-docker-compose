var express = require("express");
var mongoose = require("mongoose");
var Plans = require('../dbs/plans.js');
var MD5 = require("md5");
var Router = express.Router();
var JWT = require("jsonwebtoken");
var passport = require("passport");
var config = require("../config");

mongoose.connect(config.dbURL, (error)=>{
    if(error) console.log(error)
});

Router.get('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    Plans.find({}).exec( (error, result)=>{
        res.send(result);
    });
});


Router.get('/:id' , passport.authenticate('jwt', { session: false }), (req, res)=>{
 if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid");
  Plans.findOne({"_id": mongoose.Types.ObjectId(req.params.id)}).exec((error, plan)=>{
    if(error) return res.json("ERROR getting plan!");
    res.json(plan)
  })
});


Router.post('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! req.body.name) return res.json("Plane name is required!");
    if(! req.body.price) return res.json("Plane price required!");
    if(! req.body.users_limit) return res.json("Users limit is required!");
    if(! req.body.contacts_limit) return res.json("Contacts limit required!");
    if(! req.body.storage_limit) return res.json("Storage limit required!");
    
    var NewPlan = new Plans({
       "name": req.body.name,
       "price": req.body.price,
       "users_limit": req.body.users_limit,
       "contacts_limit": req.body.contacts_limit,
       "storage_limit": req.body.storage_limit,
    })
    NewPlan.save((err, plan)=>{
     if(err) return res.json("Error Saving Plan:" + err);
     return res.json(plan);
    });
});


module.exports = Router;
