const express = require("express");
const router  = express.Router();
const bcrypt  = require('bcrypt');
const Models  = require('../models')

router.get('/', (req, res) => {
    res.render("login", {error: false})
})

router.post('/', (req, res) => {
    Models.User.findOne({
        where: {
            username: req.body.username
        }
    }).then(function(user){
        if(user){
            bcrypt.compare(req.body.password, user.password).then((result) => {
                if(result){
                    req.session.loggedIn = true;
                    req.session.username = user.username
                    let id = user.id
                    if(user.first_name == null || user.last_name == null || user.gender == null || user.address == null){
                        res.redirect(`/profile/edit/${id}`)
                    }else{
                        res.redirect('/dashboard')
                    }
                }else{
                    res.render('login',{error : true})
                }
            })
        }else{
            res.render('login')
        }
    }).catch((err) => {
        console.log(err);
    });
})

module.exports = router
