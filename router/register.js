const Model=require("../models");
const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("register");
});

router.post('/',(req,res)=>{
    if(req.body.password === req.body.password_retype){
        Model.User.create(req.body).then((result)=>{
            res.redirect("/dashboard");
        });
    }else{
        res.send("please write your password correctly");
    }
});

module.exports=router;
