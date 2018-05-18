const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app =express();
//Map global promise
mongoose.Promise =  global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    // useMongoClient: true
})
    .then(()=>console.log('mongoDB Connected'))
    .catch(err => console.log(err));







//Load Idea Model
require('./models/Ideas');
const Idea = mongoose.model('ideas');




//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//middleware
app.use(function(req, res, next){
    next();
});

//index Route
app.get('/',(req, res)=>{
    const title = 'Welcome';
    res.render('index', {
        title
    });
});

app.get('/about', (req,res)=>{
    res.render('About')
});

app.get('/ideas/add', (req,res)=>{
    res.render('ideas/add')
});

app.get('/ideas/edit/:id', (req,res)=>{
    Idea.findOne({_id:req.params.id})
        .then(idea=>{
            res.render('ideas/edit',{
                idea
            })
        })
});

//process form
app.post('/ideas',(req,res)=>{
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

app.get('/ideas', (req, res)=>{
    Idea.find({})
        .sort({date: 'desc'})
        .then(ideas =>{
            res.render('ideas/index',{
                ideas
            })
        });

});

app.get('/home', (req,res)=>{
    res.send('home')
});

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

