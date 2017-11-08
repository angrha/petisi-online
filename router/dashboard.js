const express=require("express");
const Model=require("../models");
const router=express.Router();
const perPage=5;
let offsetStart=0;
let jumlahTampil=0;
let loadMore=true;

const ceklogin=(req,res,next)=>{
    if(req.session.loggedIn){
        next();
    }else{
        res.redirect("/login");
    }
}

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
            const withCounter=rows.map((value)=>{
                const countLikeDislike=value.getUsers().then((users)=>{
                    let like=0;
                    let dislike=0;
                    users.map((user)=>{
                        if(user.User_Post.status){
                            like++;
                        }else{
                            dislike++;
                        }
                    });
                    return {
                        like:like,
                        dislike:dislike,
                        title:value.title,
                        content:value.content,
                        id:value.id
                    }
                });
                return countLikeDislike;
            });
            Promise.all(withCounter).then((value)=>{
                console.log(value);
                res.render("dashboard",{listPost:value,button:loadMore});
            });
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

// Halaman detail post
router.get("/post/:id",(req,res)=>{
    Model.Post.findById(req.params.id).then((data)=>{
        data.getUsers().then((users)=>{
            let like=0;
            let dislike=0;
            users.map((value)=>{
                value.User_Post.status ? like++ : dislike++;
            });
            Model.User.findById(data.UserId).then((user)=>{
                console.log(data.UserId);
                res.render("post",{data:data,like:like,dislike:dislike});
            });
        });
    }).catch((err)=>{
        res.send(err);
    });
});

module.exports=router;
