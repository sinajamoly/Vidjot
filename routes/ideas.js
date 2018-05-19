const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
//Load Idea Model
require('../models/Ideas');
const Idea = mongoose.model('ideas');

module.exports =  router;

router.get('/ideas/add', (req,res)=>{
    res.render('ideas/add')
});

router.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({_id:req.params.id})
        .then(idea=>{
            res.render('ideas/edit',{
                idea
            })
        })
});

//process form
router.post('/',(req,res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({text: 'Please add a title'});
    }
    if(!req.body.details){
        errors.push({text: 'Please add some details'});
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors,
            title: req.body.title,
            details: req.body.details
        })
    }else{
        const newUser= {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser).save()
            .then(idea=>{
                res.redirect('/ideas');
            })
    }

});

router.get('/', (req, res)=>{
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas =>{
            res.render('ideas/index',{
                ideas
            })
        });

});


//Edit Form process
router.put('/:id', (req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea=>{
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save()
            .then(idea =>{
                res.redirect('/ideas')
            });
    })
})

router.delete('/:id',(req,res)=>{
    Idea.remove({_id: req.params.id}).then(()=>{

        req.flash('success_msg', 'Video Idea Removed');
        res.redirect('/ideas');
    })
})
