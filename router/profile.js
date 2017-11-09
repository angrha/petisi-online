const Model=require("../models");
const express=require("express");
const bcrypt=require("bcrypt");
const router=express.Router();

// Check Login State
const checklogin=(req,res,next)=>{
    if(req.session.loggedIn){
        next();
    }else{
        res.redirect("/login");
    }
}

// Halaman profile
router.get('/',checklogin,(req,res)=>{
    Model.User.findById(req.session.userId).then((user)=>{
        Model.Post.findAll({
            where:{
                UserId:req.session.userId
            }
        }).then((posts)=>{
            res.render("profile",{user:user,posts:posts,error:false});
        });
    }).catch((err)=>{
        res.send(err);
    });
});

// Action edit profile
router.post("/edit/:id",checklogin,(req,res)=>{
    if(req.body.password !== "" && req.body.password_retype !== ""){ // Jika field password tidak kosong ketika akan melakukan update profile
        if(req.body.password === req.body.password_retype){  // Jika kedua field password memiliki value yang sama
            bcrypt.hash(req.body.password,10).then((hashes)=>{
                Model.User.update({
                    password:hashes,
                    email:req.body.email,
                    first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    gender:req.body.gender,
                    address:req.body.address
                },{
                    where:{
                        id:req.params.id
                    }
                }).then((stats)=>{
                    res.redirect("/logout");
                });
            }).catch((err)=>{
                res.send(err);
            });
        }else{
            res.send("Pastikan kedua field password memiliki value yang sama");
        }
    }else{ // Jika field password kosong ketika akan melakukan update profile
        Model.User.update({
            email:req.body.email,
            first_name:req.body.first_name,
            last_name:req.body.last_name,
            gender:req.body.gender,
            address:req.body.address
        },{
            where:{
                id:req.params.id
            }
        }).then((stats)=>{
            res.redirect("/profile");
        }).catch((err)=>{
            res.send(err);
        });
    }
});

module.exports=router;
