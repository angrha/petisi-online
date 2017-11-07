const express=require("express");
const Model=require("../models");
const router=express.Router();
const perPage=5;
let offsetStart=0;
let jumlahTampil=0;
let loadMore=true;

// Halaman awal dashboard
router.get("/",(req,res)=>{
    offsetStart=0;
    jumlahTampil=0;
    Model.Post.findAll({
        offset:offsetStart,
        limit:perPage
    }).then((rows)=>{
        jumlahTampil+=rows.length;
        Model.Post.count().then((count)=>{
            count <= jumlahTampil ? loadMore=false : loadMore=true;
            res.render("dashboard",{listPost:rows,button:loadMore});
        });
    }).catch((err)=>{
        res.send(err);
    });
});

// Halaman load more
router.get("/more",(req,res)=>{
    if(loadMore){
        offsetStart+=perPage;
    }
    Model.Post.findAll({
        offset:offsetStart,
        limit:perPage
    }).then((rows)=>{
        jumlahTampil+=rows.length;
        if(jumlahTampil <= offsetStart + perPage){
            loadMore=false
        }
        res.render("dashboard",{listPost:rows,button:loadMore});
    }).catch((err)=>{
        res.send(err);
    });
});

// Action tambah post
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
