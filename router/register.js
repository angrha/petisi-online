const Model=require("../models");
const express=require("express");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("register",{error:false});
});

router.post('/',(req,res)=>{
    if(req.body.password === req.body.password_retype){
        Model.User.count({where:{username:req.body.username}}).then((countUser)=>{
            if(countUser === 0){
                Model.User.create(req.body).then((result)=>{
                    res.redirect("/dashboard");
                }).catch((err)=>{
                    res.send(err);
                });
            }else{
                res.render("register",{error:true,msg:"Username telah digunakan"});
            }
        });
    }else{
        res.render("register",{error:true,msg:"Pastikan username dan password yang kamu masukan benar"});
    }
});

module.exports=router;
