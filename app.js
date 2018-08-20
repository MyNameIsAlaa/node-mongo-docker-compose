var express = require("express");
var BodyParser = require("body-parser");
var app = express();

var mongoose = require("mongoose");
var Users = require('./dbs/users.js');
var passport = require("passport");
var Route_Users = require("./routes/users");
var Route_Business = require("./routes/business");
var Route_Plans = require("./routes/plans");
var Route_Contacts = require("./routes/contacts");

var config = require("./config");


mongoose.connect(config.dbURL, (error)=>{
  if(error) console.log(error)
});



app.use(BodyParser.urlencoded({ extended: false }));
app.use(BodyParser.json());


var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'OwnedBy_NineVisions.com';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    Users.findOne({id: jwt_payload.sub}).select("-password").exec(function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        
        }
    });
}));

app.get('/' , (req, res)=>{
    res.send("CRM API v1");
});

app.use("/api/users", Route_Users);
app.use("/api/business", Route_Business);
app.use("/api/plans", Route_Plans);
app.use("/api/contacts", Route_Contacts);

app.listen(8080);
