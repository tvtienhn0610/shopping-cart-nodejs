var express = require('express');
var router = express.Router();
var user = require('../model/user');


/* GET home page. */

module.exports = function(passport){
    router.post('/register', function(req, res) {
        var body = req.body,
            username = body.username,
            password = body.password,
            phone = body.phone,
            address = body.address,
            giohang = [];  
        user.findOne({username:username},function(err,doc){
            if(err){res.status(500).send('error occured')}
            else{
                if(doc){
                    res.status(500).send('username already exists')
                }
                else{
                    var record = new user();
                    record.username = username;
                    record.phone = phone;
                    record.password = record.hashPassword(password);
                    record.address = address;
                    record.giohang = giohang;
                    record.save(function(err,user){
                        if(err){
                            res.status(500).send('db err');
                        }
                        else{
                            res.redirect('/login');
                        }
                    })
                }
            }
        })
      });

    router.post('/login',passport.authenticate('local',{
          failureRedirect:'/login',
          successRedirect:'/',
      }),function(req,res){

    });

    return router;
};
