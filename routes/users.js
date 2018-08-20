var express = require("express");
var mongoose = require("mongoose");
var Users = require('../dbs/users.js');
var Business = require('../dbs/business.js');
var MD5 = require("md5");
var Router = express.Router();
var JWT = require("jsonwebtoken");
var passport = require("passport");
var config = require("../config");
var deepPopulate = require("mongoose-deep-populate")(mongoose);


mongoose.connect(config.dbURL, (error)=>{
    if(error) console.log(error)
});

Router.get('/' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid");
    Users.findOne({"_id": mongoose.Types.ObjectId(req.params.id)}).select("-password").exec( (error, result)=>{
        res.send(result);
    });
});


Router.get('/:id' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    Users.find({}).select("-password").exec( (error, result)=>{
        if(error) return res.json("ERROR");
        res.send(result);
    });
});



Router.post('/', (req, res)=>{
 if(! req.body.password) return res.json("Password required!");
 if(! req.body.level) return res.json("level required!");
 if(! req.body.email) return res.json("email required!");
 if(! req.body.first_name) return res.json("first_name required!");
 if(! req.body.last_name) return res.json("last_name required!");

 Users.findOne({"email":req.body.email, "level":"admin"},(err, user)=>{
     if(err) return res.json(err);
     if(user) return res.json("E-mail already exists!");
     var Newbiz = new Business();
     Newbiz.save((error, biz)=>{
        if(error) return  res.json(error);
        var NewUser = new Users(req.body);
        NewUser.business_id = biz._id;
        NewUser.password = MD5(NewUser.password);
        NewUser.save((error, user)=>{
           if(error) return  res.json(error)
           res.send(user);
        });
     })
 })

});

Router.post("/login", (req, res)=>{
    if(! req.body.password) return res.json("Password required!");
    if(! req.body.email) return res.json("email required!");

  
    Users.findOne({
        email: req.body.email,
        password: MD5(req.body.password)
    }).select("-password").deepPopulate("business_id.plan_id").exec((err, user)=>{
        if(err) return res.json("USER NOT FOUND!");
        res.json({
            "status": "success",
            "token": JWT.sign({_id: user._id}, "OwnedBy_NineVisions.com"), 
            "user": user,
        })
    });

})

Router.put("/",passport.authenticate('jwt', { session: false }), (req, res)=>{
   Users.findOne(mongoose.Types.ObjectId(req.body.id), (error, user)=>{
       if(error) return res.send(error);
       if(req.body.password) user.password = MD5(req.body.password);
       if(req.body.level) user.level = req.body.level;
       if(req.body.email) user.email = req.body.email;
       if(req.body.first_name)  user.first_name = req.body.first_name;
       if(req.body.last_name)  user.last_name = req.body.last_name;
       user.save((error, user)=>{
        if(error) return  res.json(error)
        res.send(user);
      });
    });
});


Router.delete('/:id' ,passport.authenticate('jwt', { session: false }), (req, res)=>{
    if(! mongoose.Types.ObjectId.isValid(req.params.id)) return res.json("ID not valid");
    Users.findOneAndRemove({"_id": mongoose.Types.ObjectId(req.params.id)}).exec( (error, result)=>{
        if(error) return res.json("ERROR");
        if(result) return res.json("success!");
        return res.json("failed");
    });
});



module.exports = Router;