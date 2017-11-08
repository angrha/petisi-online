const Model=require("../models");
const express=require("express");
const bcrypt=require("bcrypt");
const router=express.Router();

router.get('/',(req,res)=>{
    res.render("login",{error: false});
});

router.post('/',(req,res)=>{
    Model.User.findOne({
        where:{
            username: req.body.username
        }
    }).then((user)=>{
        if(user){
            bcrypt.compare(req.body.password, user.password).then((result)=>{
                if(result){
                    req.session.loggedIn=true;
                    req.session.username=user.username
                    // res.redirect('/dashboard');
                    res.send("OK");
                }else{
                    res.render('dashboard');
                }
            });
        }else {
            res.render("login");
        }
    }).catch((err)=>{
        console.log(err);
    });
});

module.exports = router
