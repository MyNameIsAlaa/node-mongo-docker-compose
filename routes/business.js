var express = require("express");
var mongoose = require("mongoose");
var Business = require('../dbs/business.js');
var MD5 = require("md5");
var Router = express.Router();
var JWT = require("jsonwebtoken");
var passport = require("passport");
var config = require("../config");

mongoose.connect(config.dbURL, (error)=>{
    if(error) console.log(error)
});

Router.get('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    Business.find({}).exec( (error, result)=>{
        res.send(result);
    });
});

Router.get('/:id' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid");
    Business.findOne({"_id": mongoose.Types.ObjectId(req.params.id)}).exec( (error, result)=>{
        if(error) return res.json("ERROR");
        res.send(result);
    });
});

Router.post('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
  
    var Newbiz = new Business(re.body);

    Newbiz.save((error, biz)=>{
       if(error) return  res.json(error);
       if(!biz) return res.json("ERROR");
       return res.json("success")
    });

});


Router.put('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! req.body.biz_id) return res.json("biz_id is required!")
    var biz_id = mongoose.Types.ObjectId(req.body.biz_id);
   
    Business.findOne({"_id": biz_id}, (err, biz)=>{
       if(err) return res.json("Error getting biz");
       if(! biz) return res.json("business not found");
       
       if(req.body.name) biz.name = req.body.name;
       if(req.body.status) biz.status = req.body.status;
       if(req.body.currency) biz.currency = req.body.currency;
       if(req.body.logo) biz.logo = req.body.logo;
       if(req.body.plan_id) biz.plan_id = req.body.plan_id;

        biz.save((error, sbiz)=>{
            if(error) return res.json(error)
            res.send(sbiz);
         })
    })
});

Router.delete('/:id' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid");
    Business.findOneAndRemove({"_id": mongoose.Types.ObjectId(req.params.id)}).exec( (error, result)=>{
        if(error) return res.json("ERROR");
        if(result) return res.json("success!");
        return res.json("failed");
    });
});





module.exports = Router;