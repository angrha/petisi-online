const express=require("express");
const router=express.Router();

const Models  = require('../models')

function checkLogin(req, res, next){
    if (req.session.loggedIn) {
        next()
    }else{
        res.redirect('/login')
    }
}

router.get('/', checkLogin, function(req, res){
    Models.User.findAll().then((rows) => {
        res.render('profile', {rowsProfile : rows})
    }).catch(function(err){
        console.log(err);
    })
})

router.get('/edit/:id', checkLogin, function(req, res){
    Models.User.findById(req.params.id).then((rows) => {
        res.render('editprofile', {rowsEditProfile : rows})
    })
})

router.post('/edit/:id',checkLogin, function(req, res){
    Models.User.update(req.body, {
        where : {
            id : req.params.id
        }
    }).then((result) => {
        res.redirect('/profile')
    }).catch((err) => {
        console.log(err);
    })
})

module.exports=router;
