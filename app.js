const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');


const app =express();
//Map global promise
mongoose.Promise =  global.Promise;
// Connect to mongoose
mongoose.connect('mongodb://localhost/vidjot-dev', {
    // useMongoClient: true
})
    .then(()=>console.log('mongoDB Connected'))
    .catch(err => console.log(err));

//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//middleware
app.use(function(req, res, next){
    req.name = 'brad Tra'
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

app.get('/home', (req,res)=>{
    res.send('home')
});

const port = 5000;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});

