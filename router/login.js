const Model=require("../models");
const express=require("express");
const bcrypt=require("bcrypt");
const router=express.Router();

// Check Login State
const checkLogin=(req,res,next)=>{
    if(req.session.loggedIn){
        res.redirect("/profile");
    }
}

// Halaman login
router.get("/",(req,res)=>{
    res.render("login",{error:false});
});

// Action login
router.post("/",(req,res)=>{
    Model.User.findOne({
        where:{
            username:req.body.username
        }
    }).then((user)=>{
        if(user){ // Jika username ditemukan
            bcrypt.compare(req.body.password,user.password).then((result)=>{
                if(result){ // Jika password benar
                    req.session.loggedIn=true;
                    req.session.userId=user.id;
                    res.redirect("/dashboard");
                }else{ // Jika password salah
                    res.render("login",{error:true,msg:"Pastikan username dan password yang kamu masukan benar"});
                }
            });
        }else{
            res.render("login",{error:true,msg:"Pastikan username dan password yang kamu masukan benar"});
        }
    }).catch((err) => {
        res.send(err);
    });
});

module.exports=router
