const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')
const mongoose = require('mongoose');
require('../models/User');
const User =mongoose.model('users');

module.exports = router;

router.get('/login',(req,res)=>{
    res.render('users/login');
});

router.get('/register',(req,res)=>{
    res.render('users/register');
})

//Login from POST
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next)
})

//Register Form Post
router.post('/register', (req,res)=>{
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({text: 'passwords do not match'});
    }

    if(req.body.password < 4){
        errors.push({text: 'password must be atleast 4 character'});
    }

    if(errors.length > 0){
        res.render('users/register',{
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2,
        });
    }else{
        User.findOne({email: req.body.email}).then(user =>{
            if(user){
                req.flash('error_msg', 'Email Already Registered');
                res.redirect('/users/register')
            }else{
                const newUser = new User ({
                    name:  req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                console.log(newUser);
                bcrypt.genSalt(10, (err,salt)=>{
                    bcrypt.hash(newUser.password,salt,(err,hash)=>{
                        if(err)throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user =>{
                                req.flash('success_msg', 'you are now registered and can log in');
                                res.redirect('/users/login')
                            }).catch(err=>{
                            console.log(err);
                            return;
                        })
                    })
                })
            }
        })

    }
})