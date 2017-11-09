const express=require("express");
const Model=require("../models");
const router=express.Router();
const perPage=5;
let offsetStart=0;
let jumlahTampil=0;
let loadMore=true;

// Check Login State
const checklogin=(req,res,next)=>{
    if(req.session.loggedIn){
        next();
    }else{
        res.redirect("/login");
    }
}

// Halaman awal dashboard
router.get("/",checklogin,(req,res)=>{
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
                res.render("dashboard",{listPost:value,button:loadMore,userId:req.session.userId});
            });
        });
    }).catch((err)=>{
        res.send(err);
    });
});

// Halaman load more
router.get("/more",checklogin,(req,res)=>{
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
    }).catch((err)=>{
        res.send(err);
    });
});

// Action tambah post
router.post("/post",checklogin,(req,res)=>{
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
router.get("/post/:id",checklogin,(req,res)=>{
    Model.Post.findById(req.params.id).then((data)=>{
        data.getUsers().then((users)=>{
            let like=0;
            let dislike=0;
            const activeUser=req.session.userId;
            users.map((value)=>{
                value.User_Post.status ? like++ : dislike++;
            });
            Model.User.findById(data.UserId).then((user)=>{
                res.render("post",{data:data,like:like,dislike:dislike,activeUser:activeUser});
            });
        });
    }).catch((err)=>{
        res.send(err);
    });
});

// Add Reaction
router.get("/post/:type/:postId/:userId",checklogin,(req,res)=>{
    Model.User_Post.count({where:{PostId:req.params.postId}}).then((count)=>{
        const createNew=(status)=>{
            Model.User_Post.create({
                UserId:req.params.userId,
                PostId:req.params.postId,
                status:status
            }).then((stats)=>{
                res.redirect("/dashboard");
            });
        }
        const updateData=(status)=>{
            Model.User_Post.update({
                status:status
            },{
                where:{
                    UserId:req.params.userId,
                    PostId:req.params.postId
                }
            }).then((stats)=>{
                res.redirect("/dashboard");
            });
        }
        if(count === 0){ // Jika post dengan id tidak ditemukan di conjunction
            req.params.type === "like" ? createNew(true) : createNew(false);
        }else{ // Jika post dengan id ditemukan di conjunction
            Model.User_Post.count({
                where:{
                    PostId:req.params.postId,
                    UserId:req.params.userId
                }
            }).then((countByUser)=>{
                if(countByUser === 0){ // Jika post join user dengan id tidak ditemukan di conjunction
                    req.params.type === "like" ? createNew(true) : createNew(false);
                }else{ // Jika post join user dengan id ditemukan di conjunction
                    req.params.type === "like" ? updateData(true) : updateData(false);
                }
            });
        }
    }).catch((err)=>{
        res.send(err);
    });
});

// Halaman edit post
router.get("/post/edit/:id",checklogin,(req,res)=>{
    Model.Post.findById(req.params.id).then((data)=>{
        res.render("edit-post",{data:data});
    }).catch((err)=>{
        res.send(err);
    });
});

// Action edit post
router.post("/post/edit/:id",checklogin,(req,res)=>{
    Model.Post.update(req.body,{
        where:{
            id:req.body.id
        }
    }).then((stats)=>{
        res.redirect(`/dashboard/post/${req.body.id}`);
    }).catch((err)=>{
        res.send(err);
    });
});

// Action hapus post
router.get("/post/delete/:id",checklogin,(req,res)=>{
    Model.Post.destroy({
        where:{
            id:req.params.id
        }
    }).then((stats)=>{
        Model.User_Post.destroy({
            where:{
                PostId:req.params.id
            }
        }).then((stats)=>{
            res.redirect("/profile");
        });
    }).catch((err)=>{
        res.send(err);
    });
});

module.exports=router;
