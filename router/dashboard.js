const express=require("express");
const Model=require("../models");
const router=express.Router();

router.get("/",(req,res)=>{
    res.render("dashboard");
});

router.post("/post",(req,res)=>{
    const susun={
        title:req.body.title,
        content:req.body.content,
        UserId:req.body.userId
    };
    Model.Post.create(susun).then((stats)=>{
        res.redirect("/dashboard");
    }).catch((err)=>{
        res.send(err);
    });
});

module.exports=router;
